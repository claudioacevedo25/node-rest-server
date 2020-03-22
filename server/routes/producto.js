
const express = require('express');

const {verificaToken, verificaAdmin_Role} = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto.js');


//========================
//Obtener Productos
//========================
app.get('/productos', verificaToken, (req, res) => {


    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({disponible:true})
            .skip(desde)
            .limit(5)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec((err, productos) => {
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    });
                };

                res.json({
                    ok:true,
                    productos
                });

            }); 

});



//========================
//Obtener Productos by ID
//========================
app.get('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, producto) => {

        if(err){
            return status(500).json({
                ok:false,
                err: {
                    message: 'Id no existe'
                }
            });
        };

        if(!producto){
            return status(400).json({
                ok:false,
                err
            });
        };



        res.json({
            ok:true,
            producto
        });
    });

});


//========================
//BUSCAR Productos
//========================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    //obtengo una expresion regular con la funcion y el parametro "i", no discrimina mayusculas y minusculas
    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex})
            .populate('categoria', 'nombre')
            .exec( (err,productos) => {
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    })
                }

                res.json({
                    ok:true,
                    productos
                })
            })


})








//========================
//Crear Productos
//========================
app.post('/productos', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
        
    })

    producto.save( (err, productoDB) => {

        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        };

        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err
            });
        };



        res.status(200).json({
            ok:true,
            productoDB
        });
        
    })

});


//========================
//Actualizar Productos
//========================
app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;


    let descProducto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        disponible: body.disponible,
        usuario: req.usuario._id
    }

    Producto.findByIdAndUpdate(id, descProducto, {new: true, runValidators: true}, (err, productoDB) => {

        if(err){
            return status(500).json({
                ok:false,
                err
            });
        };


        if(!productoDB){
            return status(400).json({
                ok:false,
                err
            });
        };


    res.json({
        ok: true,
        productoDB
    })

    })

});


//========================
//Eliminar Productos
//========================
app.delete('/productos/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    let disponible = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, disponible, {new: true, runValidators: true}, (err, productoDB) => {

        if(err){
            return status(500).json({
                ok:false,
                err
            });
        };


        if(!productoDB){
            return status(400).json({
                ok:false,
                err: {
                     message: 'El producto no existe'
                }
               
            });
        };


    res.json({
        ok: true,
        message: 'El producto ha sido eliminado'
    })

    })


});




module.exports = app;