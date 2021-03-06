const express = require('express')
const Categoria = require('../models/categoria')
const Menu = require('../models/menu')
const router = express.Router()

router.get('/', async (req, res) =>{
    let searchOptions = {}
    if(req.query.nombreCat != null && req.query.nombreCat !== '') {
        searchOptions.nombre = new RegExp(req.query.nombreCat, 'i')
    }
    try{
        const user = await req.user
        const categorias = await Categoria.find(searchOptions)
        res.render('categorias/index', {
            categorias: categorias,
            searchOptions: req.query,
            user: user
        })
    } catch {
        res.redirect('/')
    }
    
})

router.get('/new', checkAdmin, async(req,res) =>{
    const user = await req.user
    res.render('categorias/new', { 
        categoria: new Categoria(), 
        user: user })
})

router.post('/', checkAdmin, async (req, res) =>{
    const categoria = new Categoria({
        nombre: req.body.nombre
    })
    try{
        const nuevaCategoria = await categoria.save()
        //res.redirect(`categorias/${nuevaCategoria.id}`)
        res.redirect('categorias')
    } catch {
        res.render('categorias/new', {
            categoria: categoria,
            errorMessage: 'Error creando categoria'
        })
    }
})

router.get('/:id', async (req, res) =>{
    const categoria = await Categoria.findById(req.params.id)
    const menus = await Menu.find({ categoria: categoria.id }).limit(6).exec()
    const user = await req.user
    try{
        res.render('categorias/show', {
            categoria: categoria,
            MenusDeCategoria: menus,
            user: user
        })
    } catch {
        res.redirect('categorias')
    }
})

router.get('/:id/edit', checkAdmin, async (req, res) =>{
    try{
        const categoria = await Categoria.findById(req.params.id)
        const user = await req.user
        res.render('categorias/edit', {
            categoria: categoria,
            user: user
        })
        
    } catch {
        res.redirect('categorias')
    }
})

router.put('/:id', checkAdmin, async (req, res) => {
    let categoria
    try{
        categoria = await Categoria.findById(req.params.id)
        categoria.nombre = req.body.nombre
        await categoria.save()
        res.redirect(`/categorias/${categoria.id}`)
    } catch {
        if(categoria == null){
            res.redirect('/')
        }
        else{
            res.render('categorias/edit', {
                categoria: categoria,
                errorMessage: 'Error actualizando categoria'
            })
        }
        
        
    }
})

router.delete('/:id', checkAdmin, async (req, res) => {
    let categoria
    try{
        categoria = await Categoria.findById(req.params.id)
        await categoria.remove()
        res.redirect('/categorias')
    } catch {
        if(categoria == null){
            res.redirect('/')
        } else {
            res.redirect(`/categorias/${categoria.id}`)
        }
    }
})

function checkNoAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        res.redirect('/')
    }
    next()
}

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

async function checkAdmin(req, res, next) {
    console.log("llegue admin")
    if(req.isAuthenticated()){
        const user = await req.user
        console.log(user.role)
        if(user.role === 'admin'){
            console.log("soy admin")
            return next()
        }
        else return res.redirect('/')
    } else return res.redirect('/')
}

module.exports = router