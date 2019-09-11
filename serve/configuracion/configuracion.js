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

//=====================
// Configuracion del token
//=====================

process.env.FechaExpiracionToken =  60*60*24*30; 

//seed o semilla o clave del token
// esto es para desarrollo y producion 
// hay que crear una varible en heroku para que no se muestre nuestra semilla
process.env.SEED =  process.env.SEED|| 'secret';
//===================================
// configuracvion de entorno para la BD
//===================================
if (process.env.PORT==3000){
    // conexion local
    process.env.NODEBD= 'mongodb://localhost:27017/cafe';
}else{
    /// conexion de forma remota al cluster de mo0ngoatlas
    // process.env.MONGO_URI ==> VARIBALE DE ENTORNO DE HEROKU LA CUAL 
    // CREE EN GIT CON 
    // GIT HEROKU CONFIG:SET (NOMBRE DE LA VARIABLE)="VALOR DE LA VARIBALE N ESTE CASO EL LINK DE NOMGOATLAS"
    process.env.NODEBD=process.env.MONGO_URI;
}

//======================================
// Configuracion del client id de google
//======================================

process.env.CLIENTID =process.env.CLIENTID || '825039903450-42pi2019kcv5g4apue3b10qpktc2ssp5.apps.googleusercontent.com';