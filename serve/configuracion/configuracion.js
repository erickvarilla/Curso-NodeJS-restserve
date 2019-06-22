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