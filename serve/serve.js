const express = require('express');
require('./configuracion/configuracion');
//llamado de mongoose para conectar a la BD de mongodb
const mongoose = require('mongoose');


const app = express()

// body-parse se usa para recoger las peticiones x-www-from-urlencode
// que son solamente los parametros que se mandan a guardar 
// por ejemplo en un formulario para recoger esos datos 
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
    //=========================
    // LLamado del archivo que contiene las rutas del usuario
    //=========================
app.use(require('./rutas/index'));

//conexion a la base de datos 
//==============
// localhost:27017 es porque lo estoy corriendo localmente en ese puerto 
//==============
// process.env.NODEBD===>> es un proceso que yo creo para conectarme a lña base de datos 
// local o el cluster de atlas de forma remota 
mongoose.connect(process.env.NODEBD, { useNewUrlParser: true,useCreateIndex:true }, (err, res) => {
    if (err) throw new err("Error al conectarse a la base de datos", err);
    console.log("Conexion exitosa !!!");
});

app.listen(process.env.PORT, () => {
    console.log("Escuchando peticiones en el puerto ", process.env.PORT);
})