const mongoose = require('mongoose')

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    carrito:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Carrito'
    }
})

module.exports = mongoose.model('Usuario', usuarioSchema)