import React, {useState} from 'react'
import './Dashboard.css'
import '../../App.css'
import {Link} from 'react-router-dom'

const Dashboard = () => {
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
                {/* Registros serão adicionados aqui */}
            </tbody>
        </table>
        <div id="summary">
            <h2>Resumo do Mês</h2>
            <p>Caixa Orçado: <span id="budgeted-total"></span></p>
            <p>Caixa Realizado: <span id="realized-total"></span></p>
        </div>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-button" onClick={handleCloseModal}>&times;</span>
              <h2>Nova Ação</h2>
              <form className='formModal'>
                <div className='formInputsModal'>
                  <label>Data da Ação:</label>
                  <input type="date" name="date" id='input-date' placeholder='Insira a data' required />
                </div>
                <div className='formInputsModal'>
                  <label>Nome:</label>
                  <input type="text" name="name" placeholder='Insira o nome' required />
                </div>
                <div className='formInputsModal'>
                  <label>Tipo:</label>
                  <select name="type" required>
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
                  </select>
                </div>
                <div className='formInputsModal'>
                  <label>Orçado (R$):</label>
                  <input type="number" name="budgeted" placeholder='Insira o valor orçado' required />
                </div>
                <div className='formInputsModal'>
                  <label>Realizado (R$):</label>
                  <input type="number" name="realized" placeholder='Insira o valor final' required />
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