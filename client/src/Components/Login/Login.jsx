import React, {useEffect, useState} from 'react'
import './Login.css'
import '../../App.css'
import { Link, useNavigate} from 'react-router-dom'
import Axios from 'axios'

//importar os assets

import imgLogin from '../../LoginAssets/img-login-teste.png'
import imgLogo from '../../LoginAssets/voxlink-logo.png'

//Icones Importados

import { FaUserShield } from "react-icons/fa"
import { BsFillShieldLockFill } from "react-icons/bs"
import { AiOutlineSwapRight } from "react-icons/ai"

const Login = () => {

    const [loginUserName, setLoginUserName] = useState('')
    const [loginPassword, setLoginPassword] = useState('')
    const [loginStatus, setLoginStatus] = useState('')
    const [statusHolder, setStatusHolder] = useState('message')
    const navigateTo = useNavigate()

    useEffect(() => {
        if(loginStatus !== '') {
            setStatusHolder('showMessage')
            setTimeout(() => {
                setStatusHolder('message')
            }, 4000)
        }
    }, [loginStatus])

    const loginUser = async (e) => {
        e.preventDefault()

        try {
            const response = await Axios.post('http://localhost:3002/api/login', {
                username: loginUserName,
                password: loginPassword
            })

            if (response.status === 200) {
                setLoginStatus('Login realizado com sucesso!')
                localStorage.setItem('token', response.data.token)
                navigateTo('dashboard')
            }

        } catch (err) {
            if (err.response) {
                setLoginStatus(err.response.data.msg)
            } else {
                console.error('Erro: ', err)
            }
        }
    }


    return (
        <div className='loginPage flex'>
            <div className="container flex">

                <div className="imgDiv">
                    <img id='imgLogin' src={imgLogin} alt="" />

                    <div className="textDiv">
                        <h2 className='title'>Programa de Gerenciamento Financeiro - Voxlink</h2>
                        <p>Sua parceira em soluções de TI!</p>
                    </div>
                </div>

                <div className="formDiv flex">
                    <div className="headerDiv">
                        <img id='imgLogo' src={imgLogo} alt="Imagem da Logo" />
                        <h3>Bem-vindo de volta!</h3>
                    </div>

                    <form className='form grid' onSubmit = {loginUser}>
                        <span className={statusHolder}>{loginStatus}</span>
                        <div className="inputDiv">
                            <label htmlFor="username">Usuário</label>
                            <div className="input flex">
                            <FaUserShield className='icon'/>
                            <input type="text" id='username' placeholder='Insira o usuário' 
                            onChange={(event) => {
                                setLoginUserName(event.target.value)
                            }}/>
                            </div>
                        </div>

                        <div className="inputDiv">
                            <label htmlFor="password">Senha</label>
                            <div className="input flex">
                            <BsFillShieldLockFill className='icon'/>
                            <input type="password" id='password' placeholder='Insira a senha' 
                            onChange={(event) => {
                                setLoginPassword(event.target.value)
                            }}/>
                            </div>
                        </div>

                        <button type='submit' className='btn flex'>
                            <span>Login </span>
                            <AiOutlineSwapRight className='icon' />
                        </button>

                        {/* <span className='forgotPassword'>
                            Esqueceu a senha? <a href="">Clique aqui</a>
                        </span> */}

                    </form>
                </div>

            </div>
        </div>
    )
}

export default Login