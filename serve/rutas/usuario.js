//===================
// Archivo donde solo voy a tener las rutas de los usuarios 
// agregar eliminar etc...
//===================
const express = require('express');
// LLamado del bcrypt para encriptar la contraseña con un hash de una sola via 
const bcrypt = require('bcrypt');
// llamado del underscore que es paraa filtrar datos ademas de mas funciones
const _ = require('underscore');
// llamado del modelo de usuario para guardarlo en la base de datos 
const Usuario = require('../Modelo/ModeloUsuario');

// llamado el archivo para validar el token
const { autenticacion , verificar_Rol_Admin }= require('../middelware/autenticacionToken');
const app = express()

app.get('/usuario',autenticacion, function(req, res) {

    // esto seria una validacion del token donde puedo acceder a la informacion
    // de una forma efectiva 
//    return res.json({
//         usuario: req.usuario,
//         nombre: req.usuario.nombre,
//         email: req.usuario.email
//     });

    // exec significa ejecuta 
    // skip significa que comienza desde el registro que digo 
    // limit significa el liminete hasta donde va ha mostrar 
    // EJ: skip(0) limit(5) significa que comienza en el registro 0 hasta el registro 5 
    let desde = req.query.desde || 0;
    desde=Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    
    //============================
    // Mostramos todos lo datos de la base de datos 
    //================================
    // los datos que estan entre comillas simples son los datos que yo solo quiero mostrar 
    Usuario.find({estado:true},'nombre email img role estado google')
    .skip(desde)
    .limit(limite)
    .exec((err,usuario)=>{
        if (err){
            //==============================================
            // ok : false significa que ocurrio un error 
            // res.status(400)  error del parte del cliente 
            //==============================================
          return res.status(400).json({
            ok:false,
            err: "Ocurrio un error al Mostrar los datos en la BD",err
           });
        }
        //=========================================
        // si no entra en el if Muestra la informacion 
        //======================================
        // podemos mostrar el total de registro con el metodo count de mongodb
        //===============================
        Usuario.count({estado:true},(err,total)=>{
            if (err){
                //==============================================
                // ok : false significa que ocurrio un error 
                // res.status(400)  error del parte del cliente 
                //==============================================
              return res.status(400).json({
                ok:false,
                err: "Ocurrio un error al Contar los datos en la BD",err
               });
            }
            res.json({
                ok : true,
                Total_Registros:total,
                usuario
            });
        });
    });

   
})

app.post('/usuario',[autenticacion,verificar_Rol_Admin], function(req, res) {
    // ese body es el que retorna el body-parse 
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        // edad: body.edad,
        email: body.email,
        // guardado y encriptado de la password
        // bcrypt.hashSync guarda la password de forma sincrona osea, sin callback
        // recibe dos parametros el dato que se va a guardar y el numero de vueltas para encriptar lo mejor son 10
        password: bcrypt.hashSync(body.password,10),
        role: body.role
    });
    usuario.save((err,usuarioDB)=>{
        if (err){
            //==============================================
            // ok : false significa que ocurrio un error 
            // res.status(400)  error del parte del cliente 
            //==============================================
          return res.status(400).json({
            ok:false,
            err: "Ocurrio un error al guardar los datos en la BD",err
           });
        }
        //=========================================
        // si no entra en el if guardar  la informacion 
        res.json({
            ok : true,
            usuario: usuarioDB
        });
    });
   
  

});

app.put('/usuario/:id',[autenticacion,verificar_Rol_Admin], function(req, res) {
    let id= req.params.id;
    // el objeto underscore en su metodo pick recibe
    //  el objeto que tiene la informacion 
    // y un array con los datos validos que solo voy a usar o en este caqso a modificar 
    let body = _.pick(req.body,['nombre','email','estado','img','rol']);
    //===================
    // findByIdAndUpdate = busca la informacion en la base de datos por el id
    // para modificarla recibe los parametros de 
    // id , el objeto que voy a modificar en este caso el body que mando por parametro
    // new:true ==>significa que me muestre la informacion actualizada si no lo coloco
    // me mostrara la informacion que pertenesca a ese id pero no con las 
    // actualizaciones que le alla hecho 
    // y una funcion de callback, que son el posible err y la respuesta 
    // runValidators: true==>> es para activar las validaciones que tengo en el schema 
    // por ejemplo a de los roles 
    //============================
    Usuario.findByIdAndUpdate(id,body,{new:true,runValidators:true},(err,usuarioDB)=>{
        if (err){
            //==============================================
            // ok : false significa que ocurrio un error 
            // res.status(400)  error del parte del cliente 
            //==============================================
          return res.status(400).json({
            ok:false,
            err: "Ocurrio un error al modificar los datos en la BD",err
           });
        }
        //=========================================
        // si no entra en el if modifica la informacion 
        res.json({
            ok : true,
            usuario: usuarioDB
        });
    }); 
   
});

//===================================
// Borrar un usuario DB
// ================================

app.delete('/usuario/:id',[autenticacion,verificar_Rol_Admin], function(req, res) {
    let id = req.params.id;
    //"============================="
    // COn esta linea 
    // elimino un dato fisicamente
    // de la bas e de datos
    //==============================
    //Usuario.findByIdAndRemove(id,(err,usuarioborrado)=>{
    //=================================
    // cin esta linea solo cambio
    // el estado de true a false
    // y asi solo desactivar 
    // el usuariop y dejarlo fisicamente en la base de datos
    //==============================================
    let cambioEstado={
        estado: false
    }
    // el new: true es para mostrar la informacion actualizada
    Usuario.findByIdAndUpdate(id,cambioEstado,{new:true},(err,usuarioborrado)=>{
        if (err){
          
          return res.status(400).json({
            ok:false,
            err: "Ocurrio un error al borrar el usuario datos en la BD",err
           });
        }
        //===========================================
        // si el usuario lo encuentra pero ya fue 
        // borrado anteriormente
        //===========================================
        if (!usuarioborrado){
                         
              return res.status(400).json({
                ok:false,
                err: {
                    message: 'USUARIO NO ENCONTRADO'
                }
               });
            
        }
        //==============================
        // si no hubo algun error 
        //==============================
        res.json({
            ok : true,
            usuarioborrado
        });
    });
})

module.exports = app;