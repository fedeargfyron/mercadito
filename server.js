if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayout = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('express-flash')
const session = require('express-session')

//Rutas
const indexRouter = require('./routes/index')
const menusRouter = require('./routes/menus')
const categoriaRouter = require('./routes/categorias')
const productosRouter = require('./routes/productos')
const loginRouter = require('./routes/login')
const mongoose = require('mongoose')
const passport = require('passport')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayout)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))
app.use(methodOverride('_method'))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
console.log(passport.session())
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', () => console.log('connected to mongoose'))
app.use('/', indexRouter)
app.use('/login', loginRouter)
app.use('/menus', menusRouter)
app.use('/productos', productosRouter)
app.use('/categorias', categoriaRouter)

app.delete('/logout', (req, res) => {
    req.logOut()
    req.redirect('/login')
})
app.listen(process.env.PORT || 3000)