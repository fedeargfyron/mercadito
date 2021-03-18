const mongoose = require('mongoose')
const Menu = require('./menu')
const categoriaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    }
})

categoriaSchema.pre('remove', function(next) {
    Menu.find( {categoria: this.id}, (err, menus) => {
        if(err){
            next(err)
        } else if( menus.length > 0){
            next(new Error('Esta categoria tiene menus asignados'))
        } else {
            next()
        }
    })
})

module.exports = mongoose.model('Categoria', categoriaSchema)