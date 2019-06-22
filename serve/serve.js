const express = require('express');
require('./configuracion/configuracion');
const app = express()

// body-parse se usa para recoger las peticiones x-www-from-urlencode
// que son solamente los parametros que se mandan a guardar 
// por ejemplo en un formulario para recoger esos datos 
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', function(req, res) {
    // realizamos res.json porque para guardar la informacion en mongobd dede ser
    // en formato json 
    res.json('Hello World')
})

app.post('/usuario', function(req, res) {
    // ese body es el que retorna el body-parse 
    let body = req.body;
    res.json({
        persona: body
    });

    // realizamos res.json porque para guardar la informacion en mongobd dede ser
    // en formato json 

})
app.put('/', function(req, res) {
    // realizamos res.json porque para guardar la informacion en mongobd dede ser
    // en formato json 
    res.json('Hello World')
})

app.delete('/', function(req, res) {
    // realizamos res.json porque para guardar la informacion en mongobd dede ser
    // en formato json 
    res.json('Hello World')
})

app.listen(process.env.PORT, () => {
    console.log("Escuchando peticiones en el puerto ", process.env.PORT);
})