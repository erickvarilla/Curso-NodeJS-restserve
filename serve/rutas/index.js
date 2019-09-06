const express = require('express');


const app = express()


/// las rutas de usuario y login asi es mas eficiente el llamado en serve
app.use(require('./usuario'));
app.use(require('./login'));

module.exports= app;