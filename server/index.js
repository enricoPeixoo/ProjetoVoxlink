//Dependencias
const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')

app.use(express.json())
app.use(cors())

//Rodar servidor
app.listen(3002, () => {
    console.log('Server está rodando na porta 3002')
})


//Banco de dados
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Nxcoak*RAuWihBs87gN!",
    database: "login_voxlink",
})


app.post('/register', (req, res) => {
    
    const sentEmail = req.body.Email
    const sentUserName = req.body.UserName
    const sentPassword = req.body.Password


    const SQL = 'INSERT INTO users (email, username, password) VALUES (?,?,?)'
    const Values = [sentEmail, sentUserName, sentPassword]

    db.query(SQL, Values, (err, results) => {
        if (err) {
            res.send(err)
            console.log(err)
        }
        else {
            console.log('Usuário inserido no banco de dados!')
            res.send({ message: 'Usuário adicionado!' })
        }
    })
})

app.post('/login', (req, res) => {

    const sentLoginUserName = req.body.LoginUserName
    const sentLoginPassword = req.body.LoginPassword


    const SQL = 'SELECT * FROM users WHERE username = ? && password = ?'
    const Values = [sentLoginUserName, sentLoginPassword]

    db.query(SQL, Values, (err, results) => {
        if (err) {
            res.send ({error: err})
        }
        if(results.length > 0) {
            res.send(results)
        } else {
            res.send({message: 'As credenciais são inválidas!'})
        }
    })
})




