const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();


const Usuario = require('../models/usuario');
const Producto = require('../models/producto.js')

//FILE SISTEM
const fs = require('fs');

//para crear una ruta 
const path = require('path');


//default options, esto me permite usar el req.files
app.use(fileUpload());


app.put('/upload/:tipo/:id', (req, res) => {

    //la var tipo hace referencia si es de producto o usuario
    let tipo = req.params.tipo;
    let id = req.params.id;


    if(!req.files){
        return res.status(400).json({
            ok:false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        })
    }

    //valida el tipo 
    let tiposValidos = ['productos','usuarios'];
    if(tiposValidos.indexOf(tipo) < 0 ){
        return res.status(400).json({
            ok:false,
            err: {
                message: `Solo se pueden subir imagenes para ${tiposValidos.join(', ')}`
            }
        })
    }


    let sampleFile = req.files.archivo; //notese que este "archivo viene de un input con name archivo en algun form"

    let nombreSplit = sampleFile.name.split('.');

    //obtengo la extencion separando la ultima posicion del arreglo
    let extension = nombreSplit[nombreSplit.length -1];

    //validar extensiones 
    let extensionesValidas = ['png','jpg','gif','jpeg'];

    if( extensionesValidas.indexOf( extension ) < 0 ){
        return res.status(400).json({
            ok: false,
            err: {
                message: `Las extenciones permitidas son ${extensionesValidas.join(', ')}`,
                extencion: extension
            }
        })
    }

    //cambiar nombre al archivo a subir para ue sea unico
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;



    //la funcion mv --muve-- mueve el archivo al lugar especificado
    sampleFile.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(tipo === 'usuarios'){
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }
        

    })
})


 imagenUsuario = (id, res, nombreArchivo ) => {

    Usuario.findById(id, (err,usuarioDB) => {
        
        if(err){
            borrarArchivo(nombreArchivo, 'usuarios')//si se dispara el error la funcion borra la imagen, esto es para que no se genere archivos basura
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!usuarioDB){
            borrarArchivo(nombreArchivo, 'usuarios')//si el usuario no existe borrar la imagen subida
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }


        borrarArchivo(usuarioDB.img, `usuarios` )


        usuarioDB.img = nombreArchivo;

        usuarioDB.save( (err, usuarioGuardado) => {

            res.json({
                ok:true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            }) 
        })

    })
}


 imagenProducto = (id, res, nombreArchivo) => {

    Producto.findById(id, (err, productoDB) => {
        
        if(err){
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!productoDB){
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok:true,
                err: {
                    message: 'Producto no existe'
                }
            })
        }

        borrarArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save( (err, productoGuardado) => {
            res.json({
                ok:true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        })
    })





}


 borrarArchivo = (nombreImagen, tipo) => {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
        if(fs.existsSync(pathImagen)){  //en el caso que exista el path
            fs.unlinkSync(pathImagen);  //borra el archivo
        }

}

module.exports = app;