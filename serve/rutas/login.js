const express = require('express');
// LLamado del bcrypt para encriptar la contraseña con un hash de una sola via 
const bcrypt = require('bcrypt');

// llamado de jwt que es para crear un token que ex´pira en un tiempo determinado
const jwt = require('jsonwebtoken');

// llamado del modelo de usuario para guardarlo en la base de datos 
const Usuario = require('../Modelo/ModeloUsuario');


// llamado de las varibles de validacion de google
const {OAuth2Client} = require('google-auth-library'); // importamos la libreria
const client = new OAuth2Client(process.env.CLIENTID); // llamdo del cliente id generado que lo hacemos como varible global en configuracion 



const app = express()

app.get('/login', function(req, res) {


    res.json({
        ok : true,
           });
});


app.post('/login',function(req,res){

    let body = req.body;
    Usuario.findOne({email: body.email},(err,usuarioDB)=>{
         // El return sirve para cuando entre en un if hay finalize la operacion y salga de la peticion POST
        if(err){
            return res.status(500).json({ // status(500) por que el error es del lado del servidor 
                ok: false,
                menssaje: "Error", err
            });
        }

        if(!usuarioDB){
            return res.status(400).json({ // status(400) por que es un error del lado del cliente
                ok: false,
                menssaje: "El (usuario) o contraseña son incorrectas"
            });
        }

        if(!bcrypt.compareSync(body.password,usuarioDB.password)){ 
            // bcrypt.compareSync  es para comparar si la password que digita el usuario hace math 
            // con que se encuentra registrada en la base de datos 
            // math es que la suma de comprovacion sea igual 
            return res.status(400).json({
                ok: false,
                menssaje:"El usuario o (contraseña) son incorrectas"
            });

        }

        // si todo sale bien aqui devuelvo la respuesta con el token 
        let token = jwt.sign({
            usuario: usuarioDB
            // nuestra clave secreta hay que ponerla de una forma global asi es 
            // una forma correcta para manejar los token 
            // porcess.env es una variable global que se puede llamar en todo el proyecto
            // estas configuracion se encuentran en el archivo configuracion
        },process.env.SEED, { expiresIn: process.env.FechaExpiracionToken }); // secret es el nombre de mi clve del token 
        // expiresIn 60 * 60 es el tiempo de durara el token en expirar el primer 60 
        // son los segundo y el segundo 60 son los minutos en total demorara 1 hora este token 
        // Tambien puedo poner 60*60*24*30 donde 24 es un dia y 30 son los dias que dura ese toquen osea que este
        // tpken durara 30 dias 
        res.json({
            ok: true,
            usuarioDB,
            token
        });

    });

});


//=============================================
// Configuracion de los servicios de Google
//=============================================

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENTID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
   
    /// como el esta funcion retorna una promesa podemos retornar de al siguiente manera
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
    
}
 
// como verify retorna una promesa para poder capturar lo que retorna
// hay que convertir este servicio en async para poder trabajar el awit 
app.post('/google', async (req,res)=>{
    let token = req.body.idtoken;
    let google_user = await verify(token)
    .catch(e =>{
        return res.status(403).json({
            ok: false,
            menssaje:e
        });
    });

//    res.json({
//        ok:true,
//        usuario: google_user
//    });
    // validacion para comprovar si el usuario ya se registro con google o por metodos normales

    Usuario.findOne({ email: google_user.email}, (err,usuarioDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        // si el usuario se autentico de forma normal sin usar google
        if(usuarioDB){
            if(usuarioDB.google === false){
                return res.status(400).json({
                    ok:false,
                    err:'Auttenticacion no realizada por google'
                });
            }else{
                  // si todo sale bien aqui devuelvo la respuesta con el token 
                let token = jwt.sign({
                    usuario: usuarioDB
                    // nuestra clave secreta hay que ponerla de una forma global asi es 
                    // una forma correcta para manejar los token 
                    // porcess.env es una variable global que se puede llamar en todo el proyecto
                    // estas configuracion se encuentran en el archivo configuracion
                },process.env.SEED, { expiresIn: process.env.FechaExpiracionToken }); // secret es el nombre de mi clve del token 
                // expiresIn 60 * 60 es el tiempo de durara el token en expirar el primer 60 
                // son los segundo y el segundo 60 son los minutos en total demorara 1 hora este token 
                // Tambien puedo poner 60*60*24*30 donde 24 es un dia y 30 son los dias que dura ese toquen osea que este
                // tpken durara 30 dias 
                res.json({
                    ok: true,
                    usuarioDB,
                    token
                });
            }
        }else{
            // si el usuario no existe la creamos en la base de datos 

            let usuario = new Usuario();
            usuario.nombre = google_user.nombre;
            usuario.email  = google_user.email;
            usuario.img    = google_user.img;
            usuario.google = true;
            usuario.password = ':)'; // contraseña para rellenar requisitos de acuerdo con nuestra validacion

            // Guardando usuario en la base de datos de mongoDB
            usuario.save((err,usuarioDB)=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    });
                }
                let token = jwt.sign({
                    usuario: usuarioDB
                    // nuestra clave secreta hay que ponerla de una forma global asi es 
                    // una forma correcta para manejar los token 
                    // porcess.env es una variable global que se puede llamar en todo el proyecto
                    // estas configuracion se encuentran en el archivo configuracion
                },process.env.SEED, { expiresIn: process.env.FechaExpiracionToken }); // secret es el nombre de mi clve del token 
                // expiresIn 60 * 60 es el tiempo de durara el token en expirar el primer 60 
                // son los segundo y el segundo 60 son los minutos en total demorara 1 hora este token 
                // Tambien puedo poner 60*60*24*30 donde 24 es un dia y 30 son los dias que dura ese toquen osea que este
                // tpken durara 30 dias 
                res.json({
                    ok: true,
                    usuarioDB,
                    token
                });
            });

        }
    });
    

});




//=============================================
// Exportacion de la varible app
//=============================================
module.exports = app;