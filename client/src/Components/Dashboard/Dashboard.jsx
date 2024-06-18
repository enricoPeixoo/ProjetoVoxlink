import React, {useEffect, useState} from 'react'
import './Dashboard.css'
import '../../App.css'
import {Link} from 'react-router-dom'
import axios from 'axios'

const Dashboard = () => {


    //use state para pegar os dados e imprimir na lista
    const [data, setData] = useState ([])

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    }

    //Efeito para listar os dados na tabela
    useEffect (() => {
      axios.get('http://localhost:3002/apiF/finances')
        .then(res => {
          console.log(res)

          const formattedDate = res.data.map(item => ({
            ...item,
            date: formatDate(item.date)
          }))
          setData(formattedDate)
        })
        .catch (err => console.log(err))
    }, [])

    return (
      <>
            <div className='dashboardHeader'>
                <Link to ={'/'}>
                    <button id='logoutBtn'>Log Out</button>
                </Link>               
            </div>
          <div className="dashboardPage">
        <h1>Sistema Financeiro</h1>
        <Link to = '/CreateFinance'>
        <button>Adicionar nova ação</button>
        </Link>
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
                      <td id='td-actions'>
                        <Link to= {`/updateFinance/${finance._id}`}>
                        <button id='btn-edit'>Editar</button>
                        </Link>
                        <button id='btn-delete'>Deletar</button>
                      </td>           
                    </tr>
                  })
                }
            </tbody>
        </table>
    </div>
      </>
    )
}

export default Dashboard