
const express = require('express')
const app = express();


//TODAS LAS RUTAS CREADAS 
app.use( require('./usuario') );
app.use( require('./login') );


module.exports = app;