import React, {useState} from 'react'
import './Register.css'
import '../../App.css'
import { Link, useNavigate } from 'react-router-dom'
import Axios from 'axios'

//importar os assets

import imgLogin from '../../LoginAssets/img-login-teste.png'
import imgLogo from '../../LoginAssets/voxlink-logo.png'

//Icones Importados

import { MdMarkEmailRead } from "react-icons/md"
import { BsFillShieldLockFill } from "react-icons/bs"
import { AiOutlineSwapRight } from "react-icons/ai"
import { FaUserShield } from "react-icons/fa"

const Register = () => {

    const [email, setEmail] = useState('')
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const navigateTo = useNavigate()


    const createUser = (e) => {

        e.preventDefault()
        
        Axios.post('http://localhost:3002/register', {
            Email: email,
            UserName: userName,
            Password: password
        }).then(() => {
            console.log('Usuário foi criado!')

            navigateTo('/')

            setEmail('')
            setUserName('')
            setPassword('')
        })
    }


    return (
        <div className='registerPage flex'>
            <div className="container flex">

                <div className="imgDiv">
                    <img id='imgLogin' src={imgLogin} alt="" />

                    <div className="textDiv">
                        <h2 className='title'>Programa de gerenciamento financeiro da Voxlink</h2>
                        <p>Sua parceira em soluções de TI!</p>
                    </div>

                    <div className="footerDiv flex">
                        <span className="text">Já possui uma conta?</span>
                        <Link to={'/'}>
                        <button className='btn'>Login</button>
                        </Link>
                    </div>
                </div>

                <div className="formDiv flex">
                    <div className="headerDiv">
                        <img id='imgLogo' src={imgLogo} alt="Imagem da Logo" />
                        <h3>Cadastre-se aqui!</h3>
                    </div>

                    <form action="" className='form grid'>

                        <div className="inputDiv">
                            <label htmlFor="email">Email</label>
                            <div className="input flex">
                            <MdMarkEmailRead className='icon'/>
                            <input type="email" id='email' placeholder='Insira o seu Email'
                            onChange={(event) => {
                                setEmail(event.target.value)
                            }} />
                            </div>
                        </div>

                        <div className="inputDiv">
                            <label htmlFor="user">Usuário</label>
                            <div className="input flex">
                            <FaUserShield className='icon'/>
                            <input type="text" id='username' placeholder='Insira o seu usuário' 
                            onChange={(event) => {
                                setUserName(event.target.value)
                            }}/>
                            </div>
                        </div>

                        <div className="inputDiv">
                            <label htmlFor="password">Senha</label>
                            <div className="input flex">
                            <BsFillShieldLockFill className='icon'/>
                            <input type="password" id='password' placeholder='Insira a senha' 
                            onChange={(event) => {
                                setPassword(event.target.value)
                            }}/>
                            </div>
                        </div>

                        <button type='submit' className='btn flex' onClick = {createUser}>
                            <span>Cadastrar</span>
                            <AiOutlineSwapRight className='icon' />
                        </button>

                        <span className='forgotPassword'>
                            Esqueceu a senha? <a href="">Clique aqui</a>
                        </span>

                    </form>
                </div>

            </div>
        </div>
    )
}

export default Register