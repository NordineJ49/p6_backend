const express = require('express')
const router = express.Router()
const userCtrl = require('../controllers/user')
const rateLimit = require('express-rate-limit')
const mail = require('../middlewares/mail')
const password = require('../middlewares/password')


const limit = rateLimit({
    windowMs: 90000,
    max: 3,
    ban: true
})


router.post('/signup', mail, password, userCtrl.signup)
router.post('/login', userCtrl.login)

module.exports = router