import React, {useEffect, useState} from 'react';
import './Dashboard.css';
import '../../App.css';
import {Link} from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [entradasOrcadas, setEntradasOrcadas] = useState(0);
    const [entradasRealizadas, setEntradasRealizadas] = useState(0);
    const [saidasOrcadas, setSaidasOrcadas] = useState(0);
    const [saidasRealizadas, setSaidasRealizadas] = useState(0);
    const [caixaCorrenteOrcado, setCaixaCorrenteOrcado] = useState(0);
    const [caixaCorrenteRealizado, setCaixaCorrenteRealizado] = useState(0);

    const formatDate = (dateString) => {
      const [year, month, day] = dateString.split('-'); // Divide a data ISO no formato 'YYYY-MM-DD'
      return `${day}/${month}/${year}`; // Retorna no formato 'DD/MM/YYYY'
    };
    

    const formatCurrency = (amount) => {
      return `R$ ${parseFloat(amount).toFixed(2).replace('.', ',')}`;
    };

    const calculateValues = (data) => {
      let entradasOrcadas = 0;
      let entradasRealizadas = 0;
      let saidasOrcadas = 0;
      let saidasRealizadas = 0;

      data.forEach(item => {
        if (item.type === 'entrada') {
          entradasOrcadas += parseFloat(item.budgeted);
          if (item.realized) entradasRealizadas += parseFloat(item.realized);
        } else if (item.type === 'saida') {
          saidasOrcadas += parseFloat(item.budgeted);
          if (item.realized) saidasRealizadas += parseFloat(item.realized);
        }
      });

      const caixaCorrenteOrcado = entradasOrcadas - saidasOrcadas;
      const caixaCorrenteRealizado = entradasRealizadas - saidasRealizadas;

      setEntradasOrcadas(entradasOrcadas);
      setEntradasRealizadas(entradasRealizadas);
      setSaidasOrcadas(saidasOrcadas);
      setSaidasRealizadas(saidasRealizadas);
      setCaixaCorrenteOrcado(caixaCorrenteOrcado);
      setCaixaCorrenteRealizado(caixaCorrenteRealizado);
    };

    useEffect(() => {
      axios.get('http://localhost:3002/apiF/finances')
        .then(res => {
          console.log(res);
          const formattedData = res.data.map(item => ({
            ...item,
            date: formatDate(item.date),
            budgeted: formatCurrency(item.budgeted),
            realized: item.realized ? formatCurrency(item.realized) : undefined
          }));
          setData(formattedData);
          calculateValues(res.data);  
        })
        .catch(err => console.log(err));
    }, []);

    const handleDelete = (id) => {
      const confirmDelete = window.confirm('Você tem certeza que deseja deletar essa ação?');

      if (confirmDelete) {
        axios.delete('http://localhost:3002/apiF/deleteFinance/' + id)
        .then(() => {
          setData(prevData => prevData.filter(finance => finance._id !== id));
          calculateValues(data.filter(finance => finance._id !== id));  
        })
        .catch(err => console.log(err));
      }
    };

    return (
      <>
        <div className='dashboardHeader'>
          <Link to='/'>
            <button id='logoutBtn'>Log Out</button>
          </Link>
            <Link to={'/register'}>
              <button id='btn-register'>Cadastrar Usuário</button>
            </Link>
          
        </div>
        <div className="dashboardPage">
          <h1>Sistema Financeiro</h1>
          <Link to='/CreateFinance'>
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
                  return (
                    <tr key={index}>
                      <td>{finance.date}</td>
                      <td>{finance.name}</td>
                      <td>{finance.type}</td>
                      <td>{finance.budgeted}</td>
                      <td>{finance.realized ? finance.realized : '(Pendente)'}</td>
                      <td id='td-actions'>
                        <Link to={`/updateFinance/${finance._id}`}>
                          <button id='btn-edit'>Editar</button>
                        </Link>
                        <button id='btn-delete' onClick={() => handleDelete(finance._id)}>Deletar</button>
                      </td>           
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
          <br />
          <br />
          <h2>Resumo Financeiro Total</h2>
          <table id="summary-table">
            <thead>
              <tr>
                <th></th>
                <th>Orçado</th>
                <th>Realizado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Entradas</td>
                <td>{formatCurrency(entradasOrcadas)}</td>
                <td>{formatCurrency(entradasRealizadas)}</td>
              </tr>
              <tr>
                <td>Saídas</td>
                <td>{formatCurrency(saidasOrcadas)}</td>
                <td>{formatCurrency(saidasRealizadas)}</td>
              </tr>
              <tr>
                <td>Caixa Corrente</td>
                <td>{formatCurrency(caixaCorrenteOrcado)}</td>
                <td>{formatCurrency(caixaCorrenteRealizado)}</td>
              </tr>
            </tbody>
          </table>
          <br />
          <div className="btns-report">
          <Link to='/monthlyReport'>
                <button>Ver Relatórios Mensais</button>
          </Link>
          <Link to='/quarterlyReport'>
                <button>Ver Relatórios Trimestrais</button>
          </Link>
          <Link to='/semesterReport'>
                <button>Ver Relatórios Semestrais</button>
          </Link>
          <Link to='/annualReport'>
                <button>Ver Relatórios Anuais</button>
          </Link>
          </div>

        </div>
      </>
    );
}

export default Dashboard;
