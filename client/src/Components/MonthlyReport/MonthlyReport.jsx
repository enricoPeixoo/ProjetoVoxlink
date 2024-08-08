import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MonthlyReport.css'; 
import '../../App.css';
import {Link} from 'react-router-dom';

const MonthlyReport = () => {
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [reportData, setReportData] = useState([]);
    const [totalBudgeted, setTotalBudgeted] = useState(0);
    const [totalRealized, setTotalRealized] = useState(0);

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

                    setTotalBudgeted(totalBudgeted);
                    setTotalRealized(totalRealized);
                    setReportData(finances);
                })
                .catch(err => console.log(err));
        }
    };

    const formatCurrency = (amount) => {
        return `R$ ${parseFloat(amount).toFixed(2).replace('.', ',')}`;
      };

      const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate() + 1).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

    return (
        <>
            <div className="MonthlyReportPage">
            <div className='reportHeader'>
                <Link to='/dashboard'>
                    <button id='backBtn'>Voltar ao Dashboard</button>
                </Link>
            </div>
                <div className="report-container">
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
                            {reportData.map((item, index) => (
                                <tr key={index}>
                                    <td>{formatDate(item.date)}</td>
                                    <td>{item.name}</td>
                                    <td>{item.type}</td>
                                    <td>{formatCurrency(item.budgeted)}</td>
                                    <td>{item.realized !== undefined ? formatCurrency(item.realized) : '(Pendente)'}</td>
                                </tr>
                            ))}
                            <tr className="total-row">
                                <td colSpan="3">Total</td>
                                <td>{formatCurrency(totalBudgeted)}</td>
                                <td>{formatCurrency(totalRealized)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default MonthlyReport;
