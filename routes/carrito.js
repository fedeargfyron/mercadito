const express = require('express')
const router = express.Router()
const Carrito = require('../models/carrito')
const Menu = require('../models/menu')

router.get('/', checkAuthenticated, async (req, res) => {
    try{
        const user = await req.user
        const carrito = await Carrito.findById(user.carrito)
        res.render('carrito/index', {
            user: user,
            carrito: carrito
        })
    }
    catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

router.put('/menus/:id', checkAuthenticated, async (req, res) => {
    try{
        const user = await req.user
        const carrito = await Carrito.findById(user.carrito)
        const menu = await Menu.findById(req.params.id)
        pos = await carrito.buyMenuArray.map((e) => { return e.menu })
                                        .indexOf(menu.id)
        if(pos >= 0){
            carrito.buyMenuArray[pos].contador++
        }
        else{
            carrito.buyMenuArray.push({
                menu: menu.id,
                nombre: menu.nombre,
                precio: menu.precio,
                contador: 1
            })
        }
        carrito.save()
        return res.redirect('/menus')
    } catch (err) {
        return res.redirect('/menus', {errorMessage: 'No se pudo agregar al carrito'})
    }
})

router.delete('/menus/:id', checkAuthenticated, async(req, res) => {
    try{
        const user = await req.user
        const carrito = await Carrito.findById(user.carrito)
        const menu = await Menu.findById(req.params.id)
        pos = await carrito.buyMenuArray.map((e) => { return e.menu })
                                        .indexOf(menu.id)
        carrito.buyMenuArray.splice(pos, 1)
        carrito.save()
        res.render('carrito/index', {
            user: user,
            carrito: carrito
        })
    } catch (err) {
        console.log(err)
        return res.redirect('/carrito')
    }
})


function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

module.exports = router