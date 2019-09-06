//Este archivo es para validar el token 

const jwt = require('jsonwebtoken');

// esta es la funcion que valida el token 
// recive tres variables 
//req => que es lo que recivo del header
// res=> va hacer la respuesta que retorno
// next => es para seguir adelante si todo esta bien
//======================
// verificar Token
//======================
let autenticacion = (req,res,next)=>{
    // capturo el valor del header
    let token = req.get('token'); // como es una peticion la capturo por get y entre comillas 
    // el nombre que se le dio en el header 
    // console.log(token);
    // next();
    //==========================
    // verificacion del token 
    //==========================
    // esta funcion recive tres parametro
    // el token 
    // la semilla en nuestro caso llamo SEDD que esta en process.env que se declaro en el archov configuracion
    // una funcion que tiene el error y la respuesta decodificada
    jwt.verify(token,process.env.SEED,(err,decode)=>{
        // si da error
        if(err){
            return res.status(401).json({ // status 401 error de autenticacion
                ok:false,
               err
            });
        }
    //     // si no hay error retorname
       req.usuario = decode.usuario; // asigno el usuario decodificado a una req que podre utilizar 
        next(); // todo salio bien sigue adelante
    });
};


//===============================
// verificar Rol de Administrador
//================================
let verificar_Rol_Admin = (req,res,next)=>{
    let rol = req.usuario;
    if(rol.role==='ADMIN_ROLE'){
        next();
    }else{
        res.json({
            ok:false,
            message:'El usuario no es ADMINISTRADOR'
        });
    }

    

};
module.exports={
    autenticacion,
    verificar_Rol_Admin
}