//=====================
//       Puerto
//=====================

// process es una varible global donde podemos encontrar el puerto 
// debemios saber el puerto cuando lo tenemos en produccion y en desarrollo
// en desarrollo debe ser 3000 en este ejemplo y en produccion es el puerto
/// que asigna heroku en este ejemplo 

// donde en produccion es el puerto que asigna heroku y en 
// desarrollo va hacer 3000 
process.env.PORT = process.env.PORT || 3000;

//===================================
// configuracvion de entorno para la BD
//===================================
if (process.env.PORT==3000){
    // conexion local
    process.env.NODEBD= 'mongodb://localhost:27017/cafe';
}else{
    /// conexion de forma remota al cluster de mo0ngoatlas
    process.env.NODEBD='mongodb+srv://eric:erick3107282022*@cafe-eqqaq.mongodb.net/test?retryWrites=true&w=majority';
}