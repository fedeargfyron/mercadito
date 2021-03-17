const express = require('express')
const Categoria = require('../models/categoria')
const router = express.Router()

router.get('/', async (req, res) =>{
    try{
        const categorias = await Categoria.find({})
        res.render('categorias/index', {categorias: categorias})
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
        res.redirect('categorias')
    } catch {
        res.render('categorias/new', {
            categoria: categoria,
            errorMessage: 'Error creando categoria'
        })
    }
    
})
module.exports = router