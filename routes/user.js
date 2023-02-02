const express = require('express')
const router = express.Router()
const userCtrl = require('../controllers/user')
const mail = require('../middlewares/mail')
const password = require('../middlewares/password')





router.post('/signup', mail, password, userCtrl.signup)
router.post('/login', userCtrl.login)

module.exports = router