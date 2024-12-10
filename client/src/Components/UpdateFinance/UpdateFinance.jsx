import '../../App.css'
import './UpdateFinance.css'
import { useEffect, useState } from 'react'
import { useParams, useNavigate} from 'react-router-dom'
import axios from 'axios'

const UpdateFinance = () => {

    const { id } = useParams()

    const [date, setDate] = useState()
    const [name, setName] = useState ()
    const [type, setType] = useState ()
    const [budgeted, setBudgeted] = useState ()
    const [realized, setRealized] = useState ()

    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3002/apiF/finance/' + id)
                console.log(response)

                const formattedDate = response.data.date.split('T')[0]
                setDate(formattedDate)
                setName(response.data.name)
                setType(response.data.type)
                setBudgeted((response.data.budgeted / 100).toFixed(2))
                setRealized(response.data.realized ? (response.data.realized / 100).toFixed(2) : '')

            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }, [])

    const handleUpdate = (e) => {
        e.preventDefault()


        axios.put('http://localhost:3002/apiF//updateFinance/' + id, {date, name, type, budgeted, realized})
        .then(res => {
            console.log(res)
            navigate('/dashboard')      
        })
        .catch(err => console.log(err))
    }


    return (
        <>
            <div className="updateFinancePage">
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button">&times;</span>
                        <h2>Editar ação</h2>
                        <form className='formModal' onSubmit={handleUpdate}>
                            <div className='formInputsModal'>
                                <label>Data da Ação:</label>
                                <input type="date" id='input-date' placeholder='Insira a data' required value={date} onChange={(e) => setDate(e.target.value)}/>
                            </div>
                            <div className='formInputsModal'>
                                <label>Nome / Descrição:</label>
                                <input type="text" id="name" placeholder='Insira o nome / descrição' required value={name} onChange={(e) => setName(e.target.value)}/>
                            </div>
                            <div className='formInputsModal'>
                                <label>Tipo:</label>
                                <select id="type" required value={type} onChange={(e) => setType(e.target.value)}>
                                    <option value="entrada">Entrada</option>
                                    <option value="saida">Saída</option>
                                </select>
                            </div>
                            <div className='formInputsModal'>
                                <label>Orçado (R$):</label>
                                <input type="number" id="budgeted" placeholder='Insira o valor orçado' required value={budgeted} step="0.01" onChange={(e) => setBudgeted(e.target.value)}/>
                            </div>
                            <div className='formInputsModal'>
                                <label>Realizado (R$):</label>
                                <input type="number" id="realized" placeholder='Insira o valor final' value={realized} step="0.01" onChange={(e) => setRealized(e.target.value)}/>
                                <button 
                                    type="button" 
                                    onClick={() => setRealized(budgeted)} 
                                    style={{ margin: "10px 0", padding: "5px 10px", cursor: "pointer" }}>
                                    Copiar valor Orçado
                                </button>
                            </div>
                            <button type="submit">Salvar</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UpdateFinance