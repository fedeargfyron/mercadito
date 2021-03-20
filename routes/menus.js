const express = require('express')
const Categoria = require('../models/categoria')
const router = express.Router()
const Menu = require('../models/menu')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

router.get('/', async (req, res) =>{
    let searchOptions = {}
    if(req.query.nombreReq != null && req.query.nombreReq !== ''){
        searchOptions.nombre = new RegExp(req.query.nombreReq, 'i')
    }
    try{
        const menus = await Menu.find(searchOptions)
        const user = await req.user
        res.render('menus/index', { 
            menus: menus, 
            searchOptions: req.query,
            user: user
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/new', checkAdmin, async(req, res) =>{
    try{
        const categorias = await Categoria.find({})
        const menu = new Menu()
        const user = await req.user
        res.render('menus/new', {
            menu: menu,
            categorias: categorias,
            user: user
        }) 
    } catch {

    }
    
})

router.post('/', checkAdmin, async(req, res) =>{
    const menu = new Menu({
        nombre: req.body.nombre,
        precio: req.body.precio,
        descripcion: req.body.descripcion,
        categoria: req.body.categoria
    })
    saveCover(menu, req.body.imagen)
    try{
        const nuevoMenu = await menu.save()
        //res.render(`menus/${nuevoMenu.id}`)
        res.redirect('/menus')
    } catch {
        res.render('menus/new', {
            menu: menu,
            categorias: await Categoria.find({}),
            errorMessage: "Error al crear el menu",
            
        })
    }
})

router.get('/:id', async (req, res) =>{
    try{
        const menu = await Menu.findById(req.params.id)
                                .populate('categoria')
                                .exec()
        const user = await req.user
        res.render('menus/show', {
            menu: menu,
            user: user
        })
    } catch {
        
    }
})

router.get('/:id/edit', checkAdmin, async (req, res) =>{
    try{
        const menu = await Menu.findById(req.params.id)
        const categoria = await Categoria.find({})
        const user = await req.user
        res.render("menus/edit", {
            menu: menu,
            categorias: categoria,
            user: user
        })
    } catch {
        res.redirect('/menus')
    }
})


router.put('/:id', checkAdmin, async (req, res) => {
    let menu
    try{
        menu = await Menu.findById(req.params.id)
        menu.nombre = req.body.nombre
        menu.precio = req.body.precio
        menu.descripcion = req.body.descripcion
        menu.categoria = req.body.categoria
        saveCover(menu, req.body.imagen)
        menu.save()
        res.redirect('/menus')
    } catch {
        if(menu == null){
            res.redirect('/')
        } else {
            res.render('menus/edit', {
                menu: menu,
                errorMessage: 'No se pudo actualizar el menú'
            })
        }
    }
})

router.delete('/:id', checkAdmin, async (req, res) => {
    let menu
    try{
        menu = await Menu.findById(req.params.id)
        await menu.remove()
        res.redirect('/menus')
    } catch {
        if(menu == null){
            res.redirect('/')
        }
        else {
            res.redirect(`/menus/${menu.id}`)
        }
    }
})

function saveCover(menu, coverEncoded){
    if(coverEncoded == null || coverEncoded == '') return
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypes.includes(cover.type)){
        menu.imgCover = new Buffer.from(cover.data, 'base64')
        menu.imgType = cover.type
    }
}

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
        if(user.role === 'admin'){
            return next()
        }
        else return res.redirect('/')
    } else return res.redirect('/')
}


module.exports = router