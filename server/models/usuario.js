const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}



let Schema = mongoose.Schema;



let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    }, 
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});


//con este metodo obtengo el objeto Usuario sin el password visible 
//cno esto se modifica el JSON, to JSON se llama cuando se intenta imprimir
usuarioSchema.methods.toJSON = function () {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

//le decimos al esquema que use un plugin en particular y el otro parametro es el mje qe podemos mostrar
usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe ser unico'})

module.exports = mongoose.model( 'usuario', usuarioSchema )