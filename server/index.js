//Dependencias
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')


app.use(express.json())
app.use(cors())

//Importar rotas
const userRoutes = require('./routes/userRoutes')
app.use('/api', userRoutes)

//Rodar servidor
app.listen(3002, () => {
    console.log('Server está rodando na porta 3002')
})


//Credenciais Banco
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@voxlinkdb.hthbsoz.mongodb.net/?retryWrites=true&w=majority&appName=VoxlinkDB`).then(() => {
    app.listen(3000)
    console.log('Conectou ao banco de dados!')
})
.catch((err) => console.log(err))








