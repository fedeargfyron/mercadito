if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayout = require('express-ejs-layouts')
const bodyParser = require('body-parser')

//Rutas
const indexRouter = require('./routes/index')
const menusRouter = require('./routes/menus')
const categoriaRouter = require('./routes/categorias')
const productosRouter = require('./routes/productos')
const mongoose = require('mongoose')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayout)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
})
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', () => console.log('connected to mongoose'))
app.use('/', indexRouter)
app.use('/menus', menusRouter)
app.use('/productos', productosRouter)
app.use('/categorias', categoriaRouter)
app.listen(process.env.PORT || 3000)