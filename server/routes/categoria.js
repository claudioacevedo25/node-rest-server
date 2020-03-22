const express = require('express');

let {verificaToken, verificaAdmin_Role} = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');


//===============================
//MOSTRAR TODAS LAS CATEGORIAS
//===============================
app.get('/categoria', verificaToken,  (req, res) => {

    Categoria.find({})
            //Ordena por algun campo (sort()) y utiliza otro esquma, relacion(populate())
            //  .sort('descripcion')
            //  .populate('usuario', 'nombre email')
             .exec( (err, categorias) => {
                 if(err){
                     return status(400).json({
                         ok: false,
                         err
                     })
                 }

                 res.json({
                     ok: true,
                     categorias
                 })
             });

});


//===============================
//MOSTRAR UNA CATEGORIA POR ID
//===============================
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Categoria.findById(id, (err, categoriaID) => {

        if(err){
            return status(500).json({
                ok: false,
                err
            });
        };

        if(!categoriaID){
            return status(400).json({
                ok: false,
                message: 'El id no es correcto'
            });
        };
         
        res.json({
            ok: true,
            categoria: categoriaID
        })
    })

});


//===============================
//CREA UNA NUEVA CATEGORIA
//===============================
app.post('/categoria', verificaToken, (req, res) => {

    let body =req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id //este id funciona solo con el verificaToken
    });

    categoria.save( (err, categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        };

        //valida si la categoria no se creo y regresa el error 400
        if(!categoriaDB){
            return status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
    
});


//===============================
//MODIFICA UNA CATEGORIA
//===============================
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;


    //segundo parametro pasado a la funcion find(id, info que yo quiero actualizar)
    let descCategoria = {
        descripcion: body.descripcion
    };


    Categoria.findByIdAndUpdate(id, descCategoria, {new: true, runValidators: true}, (err,categoriaDB) => {
        
        if(err){
            return  status(500).json({
                ok: false,
                err
              });
            };

            //valida si la categoria no se creo y regresa el error 400
        if(!categoriaDB){
            return status(400).json({
                ok: false,
                err
            });
        };

         res.json({
              ok:true,
              categoria: categoriaDB
         });
    });
    
});


//===============================
//BORRA UNA CATEGORIA
//===============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    //solo ADMIN elimina categorias
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err,categoriaBorrada) => {

        if(err){
            return  res.status(500).json({
                ok: false,
                err
              });
            };

        
        if(!categoriaBorrada){
            return status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada - Id no existe'
                }
            });
        }


        res.json({
            ok:true,
            message: 'Categoria Borrada'
        })

    })
    
})



module.exports = app;