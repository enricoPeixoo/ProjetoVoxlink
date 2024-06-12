const Finance = require('../models/Finance')


const listFinances = async (req, res) => {
    Finance.find()
    .then(finances => res.json(finances))
    .catch (err => res.json(err))
}

const createFinance = async (req, res) => {
    const finance = new Finance({
        date: req.body.date,
        name: req.body.name,
        type: req.body.type,
        budgeted: req.body.budgeted,
        realized: req.body.realized,
      });
    
      try {
        const savedFinance = await finance.save();
        res.json(savedFinance);
      } catch (err) {
        res.json({ message: err });
      }
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
    listFinances
}