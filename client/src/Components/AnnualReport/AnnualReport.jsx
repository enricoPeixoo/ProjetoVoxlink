import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AnnualReport.css';
import '../../App.css';
import { Link } from 'react-router-dom';

const AnnualReport = () => {
    const [selectedYear, setSelectedYear] = useState('');
    const [reportData, setReportData] = useState([]);
    const [totalBudgeted, setTotalBudgeted] = useState(0);
    const [totalRealized, setTotalRealized] = useState(0);

    const fetchReportData = () => {
        if (selectedYear) {
            axios.get('http://localhost:3002/apiF/financesByYear', {
                params: {
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
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate() + 1).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatCurrency = (amount) => {
        return `R$ ${parseFloat(amount).toFixed(2).replace('.', ',')}`;
    };


    return (
        <div className="AnnualReportPage">
            <div className='reportHeader'>
                <Link to='/dashboard'>
                    <button id='backBtn'>Voltar ao Dashboard</button>
                </Link>
            </div>
            <div className="report-container">
                <h2>Relatório Anual</h2>
                <div className="report-controls">
                    <label htmlFor="year-select">Ano:</label>
                    <select id="year-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                        <option value="">Selecione um ano</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
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
    );
};

export default AnnualReport;