// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Dashboard from './Components/Dashboard/Dashboard';
import CreateFinance from './Components/CreateFinance/CreateFinance';
import UpdateFinance from './Components/UpdateFinance/UpdateFinance';
import MonthlyReport from './Components/MonthlyReport/MonthlyReport'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/createFinance" element={<CreateFinance/>}/>
        <Route path="/updateFinance/:id" element={<UpdateFinance/>}/>
        <Route path="/monthlyReport" element={<MonthlyReport/>}/>
      </Routes>
    </Router>
  );
}

export default App;
