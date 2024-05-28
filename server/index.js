//Dependencias
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require ('jsonwebtoken')

app.use(express.json())
app.use(cors())

//Rodar servidor
app.listen(3002, () => {
    console.log('Server está rodando na porta 3002')
})

//Models
const User = require('./models/User')


// Rota Privada
app.get('/user/:id', checkToken, async (req, res) => {
    const id = req.params.id

    const user = await User.findById(id, '-password')

    if (!user) {
        return res.status(404).json({msg: 'Usuário não encontrado!'})
    }

    res.status(200).json({user})
})

function checkToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token) {
        return res.status(401).json({msg: 'Acesso negado!'})
    }

    try {
        const secret = process.env.SECRET

        jwt.verify(token, secret)

        next()
    } catch (err) {
        res.status(400).json({msg: "Token Inválido"})
    }
}

//Registrar usuário
app.post('/register', async (req,res) => {
    const {username, email, password, confirmPassword} = req.body

    if(!username) {
        return res.status(422).json({msg: 'O nome é obrigatório!'})
    }

    if(!email) {
        return res.status(422).json({msg: 'O email é obrigatório!'})
    }

    if(!password) {
        return res.status(422).json({msg: 'A senha é obrigatório!'})
    }

    if (password !== confirmPassword) {
        return res.status(422).json({msg: 'As senhas não conferem!'})
    }

    const emailExists = await User.findOne({ email: email })
    const usernameExists = await User.findOne({ username: username })

    if(emailExists) {
        return res.status(422).json({msg: 'Por favor utilize um email ainda não cadastrado!'})
    }

    if(usernameExists) {
        return res.status(422).json({msg: 'Por favor utilize um nome de usuário ainda não cadastrado!'})
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
})

//Autenticar Usuário
app.post("/", async (req, res) => {
    const {username, password} = req.body

    if(!username) {
        return res.status(422).json({msg: 'O email é obrigatório!'})
    }

    if(!password) {
        return res.status(422).json({msg: 'A senha é obrigatória!'})
    }

    const user = await User.findOne({ username: username })

    if(!user) {
        return res.status(404).json({msg: 'Usuário não encontrado!'})
    }

    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
        return res.status(422).json({msg: 'Senha inválida!'})
    }

    try {

        const secret = process.env.SECRET

        const token = jwt.sign(
            {
                id: user._id
            },
            secret
        )

        res.status(200).json({msg: "Autenticação realizada com sucesso", token})

    } catch (error) {
        console.log(error)
        res.status(500).json({msg: 'Ocorreu um erro...'})
    }
})

//Credenciais Banco
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@voxlinkdb.hthbsoz.mongodb.net/?retryWrites=true&w=majority&appName=VoxlinkDB`).then(() => {
    app.listen(3000)
    console.log('Conectou ao banco de dados!')
})
.catch((err) => console.log(err))








