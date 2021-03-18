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
        res.render('menus/index', { 
            menus: menus, 
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/new', async(req, res) =>{
    try{
        const categorias = await Categoria.find({})
        const menu = new Menu()
        res.render('menus/new', {
            menu: menu,
            categorias: categorias
        }) 
    } catch {

    }
    
})

router.post('/', async(req, res) =>{
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
        res.render('menus/show', {
            menu: menu
        })
    } catch {
        
    }
})

router.get('/:id/edit', async (req, res) =>{
    try{
        const menu = await Menu.findById(req.params.id)
        const categoria = await Categoria.find({})
        res.render("menus/edit", {
            menu: menu,
            categorias: categoria
        })
    } catch {
        res.redirect('/menus')
    }
})


router.put('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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


module.exports = router