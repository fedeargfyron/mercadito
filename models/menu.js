const mongoose = require('mongoose')

const menuSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Categoria'
    },
    imgCover:{
        type: Buffer,
        required: true
    },
    imgType:{
        type:String,
        required: true
    },

})

menuSchema.virtual('coverImagePath').get(function() {
    if(this.imgCover != null && this.imgType != null) {
        return `data:${this.imgType};charset=utf-8;base64,${this.imgCover.toString('base64')}`
    }
})

module.exports = mongoose.model('Menu', menuSchema)