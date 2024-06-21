import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import './MonthlyReport.css'; // Importar o arquivo de estilo CSS
import '../../App.css';

const MonthlyReport = () => {
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [reportData, setReportData] = useState([]);
    const [totalBudgeted, setTotalBudgeted] = useState(0);
    const [totalRealized, setTotalRealized] = useState(0);

    const formatCurrency = (amount) => {
        return `R$ ${parseFloat(amount).toFixed(2).replace('.', ',')}`;
      };

    const fetchReportData = () => {
        if (selectedMonth && selectedYear) {
            axios.get(`http://localhost:3002/apiF/financesByMonth`, {
                params: {
                    month: selectedMonth,
                    year: selectedYear
                }
            })
            .then(res => {
                const { finances, totalBudgeted, totalRealized } = res.data;

                setTotalBudgeted(formatCurrency(totalBudgeted));
                setTotalRealized(formatCurrency(totalRealized));
                setReportData(finances);
            })
            .catch(err => console.log(err));
        }
    };


    return (
        <>
        <div className="MonthlyReportPage">
        <div className='reportHeader'>
                <Link to='/dashboard'>
                    <button id='backBtn'>Voltar ao Dashboard</button>
                </Link>
            </div>
        <div className="monthly-report-container">
            <h2>Relatório Mensal</h2>
            <div className="report-controls">
                <label>Mês:</label>
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                >
                    <option value="">Selecione o mês</option>
                    <option value="1">Janeiro</option>
                    <option value="2">Fevereiro</option>
                    <option value="3">Março</option>
                    <option value="4">Abril</option>
                    <option value="5">Maio</option>
                    <option value="6">Junho</option>
                    <option value="7">Julho</option>
                    <option value="8">Agosto</option>
                    <option value="9">Setembro</option>
                    <option value="10">Outubro</option>
                    <option value="11">Novembro</option>
                    <option value="12">Dezembro</option>
                </select>
                <label htmlFor="year-select">Ano:</label>
                    <select id="year-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                        <option value="">Selecione um ano</option>
                        <option value="2024">2024</option>
                        {/* Adicione outras opções de ano conforme necessário */}
                    </select>
                <button onClick={fetchReportData}>Gerar Relatório</button>
            </div>

            <table className="report-table">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Nome</th>
                        <th>Tipo</th>
                        <th>Orçado</th>
                        <th>Realizado</th>
                    </tr>
                </thead>
                <tbody>
                    {reportData.map((finance, index) => (
                        <tr key={index}>
                            <td>{new Date(finance.date).toLocaleDateString()}</td>
                            <td>{finance.name}</td>
                            <td>{finance.type}</td>
                            <td>{formatCurrency(finance.budgeted)}</td>
                            <td>{finance.realized !== undefined ? formatCurrency(finance.realized) : '(Pendente)'}</td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan="3" style={{ textAlign: 'center' }}>Total</td>
                        <td>{totalBudgeted}</td>
                        <td>{totalRealized}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    </>
    );
};

export default MonthlyReport;
