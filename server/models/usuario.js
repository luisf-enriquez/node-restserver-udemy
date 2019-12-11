const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

let Schema = mongoose.Schema;

// define the schema for our empleadoSchema model
const usuarioSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'],
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        //type: Buffer
        type: String,
        required: false
    },
    role: {
        type: String,
        default: "USER_ROLE",
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

//para "eliminar" el password antes de pasarlo a la base de datos
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

//Para validar que sea unico el email
usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
})

// create the model for users and expose it to our app
module.exports = mongoose.model('Usuario', usuarioSchema);