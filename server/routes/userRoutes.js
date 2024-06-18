const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

// Registrar usuário
router.post('/register', userController.registerUser)

// Autenticar usuário
router.post('/login', userController.loginUser)

// Rota privada para obter usuário pelo ID
router.get('/user/:id', userController.checkToken, userController.getUserById)

router.get('/users', userController.getUsers)

module.exports = router
