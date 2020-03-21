//importa la libreria express
const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore')

const Usuario = require('../models/usuario');

//inicializa express
const app = express();









app.get('/usuario', function (req, res) {

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);

  //el parametros del find son las condiciones de busqueda. En este caso usuarios activos
  //el segundo parametro despues de los {} son los campos que queremos mostrar
  Usuario.find({estado:true}, 'nombre email role estado google')
         .skip(desde)//se salta x cantidad de registros, desde donde comienza,->
         .limit(limite)//muestra los siguientes x registros (paginacion)
         .exec( (err,usuarios) => { //ejecuta la query
          if(err){
            return  res.status(400).json({
                ok: false,
                err
              });
            };

            //cantidad de registros que tiene la coleccion (BD)
            Usuario.countDocuments({estado:true}, (err,conteo) => {
              res.json({
              ok: true,
              usuarios,
              totalRegistros: conteo
            });
            })

            

         } )
    // res.json('get usuario')
  })
  
  












   
  app.post('/usuario', function (req, res) {
  
    // node-parse es un paquete que permite procesar la info enviada en el formulario 
    // y almacenarla en un objeto Json para que podamos procesarlas en las peticiones POST
    //el .body es el que va aparecer cuando el body-parse procese cualquier pailot q reciban las peticiones
    let body = req.body;

    
      let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10),
        role: body.role
      });

      //err en el caso que haya un error en la insercion o usuarioDB en el caso de exito
      usuario.save( (err, usuarioDB) => {

        if(err){
        return  res.status(400).json({
            ok: false,
            err
          });
        };
 
        res.json({
          ok: true,
          usuario: usuarioDB
        });

      });
    });
  









  
  
    app.put('/usuario/:id', function (req, res) {
  
      //obtenemos el parametro enviado por la ruta
      let id = req.params.id;
      //obtener el body y utilizando la funcion pick del underscore, le pasamos el objeto completo 
      //y en forma de arreglo los campos que si permitiremos actuualizar
      let body = _.pick(req.body, ['nombre','email','img','role','estado'] );

      

      //mirar la documentacion de mongoose para saber como funciona la funcion findById 
      //y los parametros que recibe, en este caso le pasamos 3 parametros y un callback
      Usuario.findByIdAndUpdate( id, body, {new: true,runValidators: true}, (err,usuarioDB) => {
          
        if(err){
          return  res.status(400).json({
              ok: false,
              err
            });
          };
        
        res.json({
          ok: true,
          usuario: usuarioDB
      });     
    })
  })
  
  








  
    app.delete('/usuario/:id', function (req, res) {
      
      let id = req.params.id;

      let cambiaEstado = {
        estado: false
      }
      
      
    // esto elimina fisicamente el objeto de la base de datos
      // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
      Usuario.findByIdAndUpdate(id, cambiaEstado, {new:true}, (err, usuarioBorrado) => {

        if(err){
          return  res.status(400).json({
              ok: false,
              err
            });
          };
     
          if (!usuarioBorrado){
              return  res.status(400).json({
                  ok: false,
                  err: {
                    message: 'Usuario no encontrado'
                  }
                });
          }

          res.json({
            ok: true,
            estado: false,
            usuario: usuarioBorrado
          })
      })
    })
  

    module.exports = app;