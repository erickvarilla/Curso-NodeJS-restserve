//=========================
// Modelo del usuario
//=========================

// .1 Importar el objt de mongo

const mongoose = require('mongoose');

// .2 declaramos el cascaron de mongodb 

const Schema = mongoose.Schema;

// .3 importamos el uniquevalidator 

var uniqueValidator = require('mongoose-unique-validator');

// .4 Creamos nuestro modelo con el esquema de mongodb

//===================
// validar roles validos 
//===================

let rolesvalidos = {
    /// tiene los values que son los roles validos
    values:['ADMIN_ROLE','USER_ROLE'],
    /// tengo un mensaje de error
    // VALUE EN MAYUSCULA es el parametro que recibo ejemplo si escribo super_role y no esta en values
    // el mensaje de error dira super_role no es un rol valido 
    message:'{VALUE}, No es un ROL VÁLIDO'
}

// .4 Creamos nuestro modelo con el esquema de mongodb
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        unique:true, // llamado del uniquevalidator para que no se repita en la base de datos
        type: String,
        required: [true, 'El email es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'password obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type:String,
        default: 'USER_ROLE',
        enum: rolesvalidos // llamado de la validacion de roles en enum que enumera que roles son permitidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//========================
// methods.toJSON se usa cuando se va a imprimir 
// la informacion 
usuarioSchema.methods.toJSON=function(){
    // se le asigna this para hacer referencia a la asignacion de todos los campos 
    let user = this;
    // toObject() tengo todas las salidas que voy a imprimir 
    let userObject = user.toObject();
    // elimino el campo password para no mostrarlo en pantalla para el usuario
    delete userObject.password;
    return userObject;
}
// =====================
// llamado del plugin del uniquevalidator
//=======================
// message es para hacer un error personalizado
// {PATH} es para llamar a la propidad que tiene el unique activo en true 
// en este ejemplo seria: Error el email, ya se encuentra registrado
usuarioSchema.plugin(uniqueValidator,{message: 'Error el {PATH}, ya se encuentra registrado'})
//======================
//  Exportar el modelo
//======================
// .1 para exportar el modelo se debe usar la siguiente sintaxis

// aqui estoy diciendo que mi modelo se llama Usuario 
// y que puede usar toda la configuracion de usuarioSchema que es mi modelo 
module.exports = mongoose.model('Usuario', usuarioSchema)