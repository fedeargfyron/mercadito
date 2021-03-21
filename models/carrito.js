const mongoose = require('mongoose')

const carritoSchema = new mongoose.Schema({
    usuario:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
    },
    buyMenuArray:
    [
        {
        menu: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Menu',
        },
        nombre:{
            type: String,
            required: true
        },
        precio:{
            type: Number,
            required: true
        },
        contador: {
            type: Number,
            required: true
            }
        }
    ],
    buyProductoArray:
    [
        {
            menu: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Producto',
            },
            contador: {
                type: Number,
                required: true
            }
        }
],
    

})

module.exports = mongoose.model('Carrito', carritoSchema)