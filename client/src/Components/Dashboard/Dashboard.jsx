import React from 'react'
import './Dashboard.css'
import '../../App.css'

const Dashboard = () => {
    return (
        <>
        <main className='dashboardPage'>
    <div className="resume">
      <div>
        Entradas: R$
        <span className="incomes">0.00</span>
      </div>
      <div>
        Saídas: R$
        <span className="expenses">0.00</span>
      </div>
      <div>
        Total: R$
        <span className="total">0.00</span>
      </div>
    </div>
    <div className="newItem">
      <div className="divDesc">
        <label for="desc">Descrição</label>
        <input type="text" id="desc" />
      </div>
      <div className="divAmount">
        <label for="amount">Valor</label>
        <input type="number" id="amount" />
      </div>
      <div className="divType">
        <label for="type">Tipo</label>
        <select id="type">
          <option>Entrada</option>
          <option>Saída</option>
        </select>
      </div>
      <button id="btnNew">Incluir</button>
    </div>
    <div className="divTable"></div>
      <table>
        <thead>
          <tr>
            <th>Descrição</th>
            <th className="columnAmount">Valor</th>
            <th className="columnType">Tipo</th>
            <th className="columnAction"></th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
  </main> 
        </>

    )
}

export default Dashboard