import React, {useEffect, useState} from 'react'
import './Dashboard.css'
import '../../App.css'
import {Link, useParams} from 'react-router-dom'
import axios from 'axios'

const Dashboard = () => {

    const { id } = useParams()

    const [data, setData] = useState ([])

    useEffect (() => {
      axios.get('http://localhost:3002/apiF/finances')
        .then(res => {
          console.log(res)
          setData(res.data)
        })
        .catch (err => console.log(err))
    }, [])



    const [showModal, setShowModal] = useState(false);

    const handleAddActionClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    

    return (
      <>
            <div className='dashboardHeader'>
                <Link to ={'/'}>
                    <button id='logoutBtn'>Log Out</button>
                </Link>               
            </div>
          <div className="dashboardPage">
        <h1>Sistema Financeiro</h1>
        <button onClick={handleAddActionClick}>Adicionar nova ação</button>
        <h2>Registros</h2>
        <table id="records-table">
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Nome</th>
                    <th>Tipo</th>
                    <th>Orçado</th>
                    <th>Realizado</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {
                  data.map((finance, index) => {
                    return <tr key={index}>
                      <td>{finance.date}</td>
                      <td>{finance.name}</td>
                      <td>{finance.type}</td>
                      <td>{finance.budgeted}</td>
                      <td>{finance.realized}</td>
                      <td>
                        <Link to={'/updateFinance/{finance._id}'} className='btn-edit'>Editar</Link>
                        <button className='btn-delete'>Deletar</button>
                      </td>           
                    </tr>
                  })
                }
            </tbody>
        </table>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-button" onClick={handleCloseModal}>&times;</span>
              <h2>Nova Ação</h2>
              <form className='formModal'>
                <div className='formInputsModal'>
                  <label>Data da Ação:</label>
                  <input type="date" id='input-date' placeholder='Insira a data' required />
                </div>
                <div className='formInputsModal'>
                  <label>Nome / Descrição:</label>
                  <input type="text" id="name" placeholder='Insira o nome / descrição' required />
                </div>
                <div className='formInputsModal'>
                  <label>Tipo:</label>
                  <select id="type" required>
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
                  </select>
                </div>
                <div className='formInputsModal'>
                  <label>Orçado (R$):</label>
                  <input type="number" id="budgeted" placeholder='Insira o valor orçado' required />
                </div>
                <div className='formInputsModal'>
                  <label>Realizado (R$):</label>
                  <input type="number" id="realized" placeholder='Insira o valor final' required />
                </div>
                <button type="submit">Adicionar</button>
              </form>
            </div>
          </div>
        )}
    </div>
      </>
    )
}

export default Dashboard