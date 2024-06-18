const Finance = require('../models/Finance')


const listFinances = async (req, res) => {
    Finance.find()
    .then(finances => res.json(finances))
    .catch (err => res.json(err))
}

const listFinanceById = async (req, res) => {
    const id = req.params.id
    Finance.findById({ _id: id})
    .then(post => res.json(post))
    .catch(err => console.log(err))
}

const createFinance = async (req, res) => {
    Finance.create(req.body)
    .then (finance => res.json(finance))
    .catch (err => res.json(err))
}

const updateFinance = async (req, res) => {
    const id = req.params.id

    Finance.findByIdAndUpdate({ _id: id}, {
        date: req.body.date,
        name: req.body.name,
        type: req.body.type,
        budgeted: req.body.budgeted,
        realized: req.body.realized
    }).then(Finance => res.json(Finance))
    .catch(err => res.json(err))
}

const deleteFinance = async (req, res) => {
    const id = req.params.id

    Finance.findByIdAndDelete ({_id: id})
    .then(response => res.json(response))
    .catch (err => res.json(err))
}


module.exports = {
    createFinance,
    updateFinance,
    deleteFinance,
    listFinances,
    listFinanceById
}