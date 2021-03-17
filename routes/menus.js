const express = require('express')
const router = express.Router()

router.get('/', async (req, res) =>{
    res.render('menus/index')
})

router.get('/new', async(req, res) =>{
    res.render('menus/new')
})

router.get('/edit', async(req, res) =>{
    res.render('menus/edit')
})

module.exports = router