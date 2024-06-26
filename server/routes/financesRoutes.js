const express = require('express')
const router = express.Router()
const financeController = require('../controllers/financeController')


//Listar as ações criadas
router.get('/finances', financeController.listFinances)
router.get('/finance/:id', financeController.listFinanceById)
router.get('/financesByMonth', financeController.listFinancesByMonth)
router.get('/financesByQuarter', financeController.listFinancesByQuarter)
router.get('/financesBySemester', financeController.listFinancesBySemester)
router.get('/financesByYear', financeController.listFinancesByYear)

//Criar ação Financeira
router.post('/createFinance', financeController.createFinance)

//Edição de ação financeira por id
router.put('/updateFinance/:id', financeController.updateFinance)

//Deletar ação financeira por id
router.delete('/deleteFinance/:id', financeController.deleteFinance)

module.exports = router