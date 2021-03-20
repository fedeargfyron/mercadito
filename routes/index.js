const express = require('express')
const router = express.Router()

router.get('/', async (req, res) =>{
    const user = await req.user
    res.render('index', {user: user})
})

module.exports = router