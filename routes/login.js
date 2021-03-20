const express = require('express')
const Usuario = require('../models/usuario')
const router = express.Router()

const bcrypt = require('bcrypt')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
initialize(passport)
//Pagina de login
router.get('/', checkNoAuthenticated, async (req, res) => {
    try {
        res.render('login/index')
    } catch {
        return
        ////////////////
    }
})

//Pagina de register
router.get('/register', checkNoAuthenticated, async (req, res) => {
    try {
        res.render('login/register')
    } catch {
        return
    }
})

//Register
router.post('/register', checkNoAuthenticated, async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    try {
        const user = new Usuario ({
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            email: req.body.email,
            password: hashedPassword,
            role: "basic"
        })
        user.save()
        res.redirect('/login')
    } catch (err) {
        return console.log('ERRRROR:' + err)
        ////////////////
    }
})

//Login
router.post('/', checkNoAuthenticated, passport.authenticate('local', {
    successRedirect: '/menus',
    failureRedirect: '/login'
}))

router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

function initialize() {
    const authenticateUser = async (email, password, done) =>{
        let user = await getUserByEmail(email)
        if(user == null || user == {}) {
            return done(null, false, { errorMessage: 'No hay usuario con ese mail' })
        }
        try {
            const match = await bcrypt.compare(password, user.password)
            if (match){
                return done(null, user)
            } else {
                return done(null, false, { errorMessage: 'Contraseña incorrecta'})
            }
        } catch(e) {
            return done(e)
        }

    }
    passport.use(new localStrategy({ usernameField: 'email'}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

async function getUserByEmail(email){
    let searchEmail = { email: email }
    searchEmail.email = new RegExp(searchEmail.email, 'i')
    return await Usuario.findOne(searchEmail)
}

async function getUserById(id){
    return await Usuario.findById(id)
}


function checkNoAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return res.redirect('/menus')
    }
    next()
}

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

function checkAdmin(req, res, next) {
    if(checkAuthenticated){
        if(req.user.role === "admin"){
            return next()
        }
        else return
    }
}
module.exports = router