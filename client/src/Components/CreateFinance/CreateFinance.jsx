import '../../App.css'
import './CreateFinance.css'
import { useState } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const CreateFinance = () => {

    const [date, setDate] = useState()
    const [name, setName] = useState ()
    const [type, setType] = useState ()
    const [budgeted, setBudgeted] = useState ()
    const [realized, setRealized] = useState ()

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3002/apiF/createFinance', {date, name, type, budgeted, realized})
        .then(res => {
            console.log(res)
            navigate('/dashboard')
        })
        .catch(err => console.log(err))
    }

    return (
        <>
        <div className="createFinancePage">
        <div className="modal">
            <div className="modal-content">
              <h2>Nova Ação</h2>
              <form className='formModal' onSubmit={handleSubmit}>
                <div className='formInputsModal'>
                  <label>Data da Ação:</label>
                  <input type="date" id='input-date' placeholder='Insira a data' required onChange={(e) => {setDate(e.target.value)}}/>
                </div>
                <div className='formInputsModal'>
                  <label>Nome / Descrição:</label>
                  <input type="text" id="name" placeholder='Insira o nome / descrição' required onChange={(e) => {setName(e.target.value)}}/>
                </div>
                <div className='formInputsModal'>
                  <label>Tipo:</label>
                  <select id="type" required onChange={(e) => {setType(e.target.value)}}>
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
                  </select>
                </div>
                <div className='formInputsModal'>
                  <label>Orçado (R$):</label>
                  <input type="number" id="budgeted" placeholder='Insira o valor orçado' required onChange={(e) => {setBudgeted(e.target.value)}}/>
                </div>
                <div className='formInputsModal'>
                  <label>Realizado (R$):</label>
                  <input type="number" id="realized" placeholder='Insira o valor final' required onChange={(e) => {setRealized(e.target.value)}}/>
                </div>
                <button type="submit">Adicionar</button>
              </form>
            </div>
          </div>
        </div>
        </>
    )

}

export default CreateFinance