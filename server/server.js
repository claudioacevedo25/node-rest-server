require('./config/config')

const express = require('express')
const app = express();

const bodyParser = require('body-parser');
//los app.use SON MIDDLEWARE, funciones que se disparan con cada peticion que nosotros hagamos
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json()) 
 
app.get('/usuario', function (req, res) {
  res.json('get usuario')
})


 
app.post('/usuario', function (req, res) {

    let body = req.body;
    res.json({
        persona: body 
    })
  })



  app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;
    res.json({
        id
    })
  })



  app.delete('/usuario', function (req, res) {
    res.json('delete usuario')
  })

app.listen(process.env.PORT, () => {
    console.log(`escuchand puerto`,process.env.PORT);
})