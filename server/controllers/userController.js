const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {
    const {username, email, password, confirmPassword} = req.body

    if (!username || !email || !password || !confirmPassword) {
        return res.status(422).json({msg: 'Todos os campos são obrigatórios!'})
    }

    if (password !== confirmPassword) {
        return res.status(422).json({msg: 'As senhas não conferem!'})
    }

    const emailExists = await User.findOne({ email })
    const usernameExists = await User.findOne({ username })

    if (emailExists) {
        return res.status(422).json({msg: 'Por favor, utilize um email ainda não cadastrado!'})
    }

    if (usernameExists) {
        return res.status(422).json({msg: 'Por favor, utilize um nome de usuário ainda não cadastrado!'})
    }

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
        username,
        email,
        password: passwordHash
    })

    try {
        await user.save()
        res.status(201).json({msg: 'Usuário criado com sucesso!'})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: 'Ocorreu um erro...'})
    }
}

const loginUser = async (req, res) => {
    const {username, password} = req.body

    if (!username || !password) {
        return res.status(422).json({msg: 'Usuário e senha são obrigatórios!'})
    }

    const user = await User.findOne({ username })

    if (!user) {
        return res.status(404).json({msg: 'Usuário ou senha incorretos!'})
    }

    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
        return res.status(422).json({msg: 'Usuário ou senha incorretos!'})
    }

    try {
        const secret = process.env.SECRET
        const token = jwt.sign({ id: user._id }, secret)

        res.status(200).json({msg: "Autenticação realizada com sucesso", token})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: 'Ocorreu um erro...'})
    }
}

const getUserById = async (req, res) => {
    const id = req.params.id

    try {
        const user = await User.findById(id, '-password')
        if (!user) {
            return res.status(404).json({msg: 'Usuário não encontrado!'})
        }
        res.status(200).json({user})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: 'Ocorreu um erro...'})
    }
}

const checkToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({msg: 'Acesso negado!'})
    }

    try {
        const secret = process.env.SECRET
        jwt.verify(token, secret)
        next()
    } catch (err) {
        res.status(400).json({msg: 'Token inválido'})
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUserById,
    checkToken
}