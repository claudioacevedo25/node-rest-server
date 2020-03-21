require('./config/config')

const express = require('express')
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
//los app.use SON MIDDLEWARE, funciones que se disparan con cada peticion que nosotros hagamos

//esto es de la libreria body-parser ...para procesar peticiones xwww-form-urlencode(algo generico)
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json()) 


//configuaracion global de rutas
app.use( require('./routes/index') );

 

  //CONEXION A LA BD MONGO
  //pasamos un callback para que se dispare despues que intente realizar la coneccion
  //le pasamos dos parametros, el primero en caso de error y el segundo en caso de exito
  //el objeto userNew y useCreate, es para la cadena de conexion a moongo
  mongoose.connect(process.env.URLDB, 
  {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true},
  (err, res) => {
  if(err) throw err;
  console.log('base de datos Online');
});



app.listen(process.env.PORT, () => {
    console.log(`escuchand puerto`,process.env.PORT);
})