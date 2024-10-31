import React, {useState} from 'react';
import axios from 'axios';
import './QuarterlyReport.css'
import '../../App.css';
import {Link} from 'react-router-dom';

import imgGreenArrow from '../../DashboardAssets/setaVerde.png'
import imgRedArrow from '../../DashboardAssets/setaVermelha.png'

const QuarterlyReport = () => {
    const [selectedQuarter, setSelectedQuarter] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [reportData, setReportData] = useState([]);
    const [totalBudgeted, setTotalBudgeted] = useState(0);
    const [totalRealized, setTotalRealized] = useState(0);

    const fetchReportData = () => {
        if (selectedQuarter && selectedYear) {
            axios.get(`http://localhost:3002/apiF/financesByQuarter`, {
                params: {
                    quarter: selectedQuarter,
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

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-'); // Divide a data ISO no formato 'YYYY-MM-DD'
        return `${day}/${month}/${year}`; // Retorna no formato 'DD/MM/YYYY'
      };

    const formatCurrency = (amount) => {
        return `R$ ${parseFloat(amount).toFixed(2).replace('.', ',')}`;
    };

    return (
        <>
            <div className="QuarterlyReportPage">
            <div className='reportHeader'>
                <Link to='/dashboard'>
                    <button id='backBtn'>Voltar ao Dashboard</button>
                </Link>
            </div>
                <div className="report-container">
                    <h2>Relatório Trimestral</h2>
                    <div className="report-controls">
                        <label>Trimestre:</label>
                        <select
                            value={selectedQuarter}
                            onChange={(e) => setSelectedQuarter(e.target.value)}
                        >
                            <option value="">Selecione o trimestre</option>
                            <option value="1">1º Trimestre (Jan - Mar)</option>
                            <option value="2">2º Trimestre (Abr - Jun)</option>
                            <option value="3">3º Trimestre (Jul - Set)</option>
                            <option value="4">4º Trimestre (Out - Dez)</option>
                        </select>
                        <label htmlFor="year-select">Ano:</label>
                        <select id="year-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                            <option value="">Selecione um ano</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            {/* Adicionar outras opções de ano conforme necessário */}
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
                                    <td>
                                    {item.type === 'entrada' ? (
                                            <><img src={imgGreenArrow} alt="Entrada" className="icon-arrow" id='greenArrow'/></>
                                        ) : (
                                            <><img src={imgRedArrow} alt="Saída" className="icon-arrow" /></>
                                        )}
                                    </td>
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

export default QuarterlyReport;