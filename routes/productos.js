const express = require('express')
const router = express.Router()

router.get('/', async (req, res) =>{
    res.render('productos/index')
})

router.get('/new', async (req,res) =>{
    res.render('productos/new')
})

router.get('/edit', async(req,res) =>{
    res.render('productos/edit')
})

module.exports = router