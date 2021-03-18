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
        const categorias = await Categoria.find(searchOptions)
        res.render('categorias/index', {
            categorias: categorias,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
    
})

router.get('/new', async(req,res) =>{
    res.render('categorias/new', { categoria: new Categoria() })
})

router.post('/', async (req, res) =>{
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
    try{
        res.render('categorias/show', {
            categoria: categoria,
            MenusDeCategoria: menus
        })
    } catch {
        res.redirect('categorias')
    }
})

router.get('/:id/edit', async (req, res) =>{
    try{
        const categoria = await Categoria.findById(req.params.id)
        res.render('categorias/edit', {categoria: categoria})
    } catch {
        res.redirect('categorias')
    }
})

router.put('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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


module.exports = router