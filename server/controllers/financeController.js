const Finance = require('../models/Finance')

const toCents = (amount) => Math.round(amount * 100)

const toReais = (amount) => (amount / 100).toFixed(2)


const listFinances = async (req, res) => {
    try {
        const finances = await Finance.find({}).sort({ date: 1 });
        const result = finances.map(finance => ({
            ...finance.toObject(),
            date: finance.date.toISOString().split('T')[0], // Converte para 'YYYY-MM-DD'
            budgeted: toReais(finance.budgeted),
            realized: finance.realized ? toReais(finance.realized) : undefined,
        }));
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
};


const listFinanceById = async (req, res) => {
    const id = req.params.id
    Finance.findById({ _id: id})
    .then(post => res.json(post))
    .catch(err => console.log(err))
}

const createFinance = async (req, res) => {
    try {
        const { date, name, type, budgeted, realized } = req.body;
        
        // Converter valores monetários para centavos
        const budgetedInCents = toCents(budgeted);
        const realizedInCents = realized ? toCents(realized) : undefined;

        const finance = new Finance({
            date,
            name,
            type,
            budgeted: budgetedInCents,
            realized: realizedInCents,
        });

        await finance.save();
        res.status(201).send(finance);
    } catch (error) {
        res.status(400).send(error);
    }
}
  
    // Finance.create(req.body)
    // .then (finance => res.json(finance))
    // .catch (err => res.json(err))

const updateFinance = async (req, res) => {
        const id = req.params.id;
    
        // Função auxiliar para converter dólares para centavos
    
        try {
            // Extrair os valores do corpo da requisição
            const { date, name, type, budgeted, realized } = req.body;
            
            // Converter os valores de budgeted e realized para centavos
            const budgetedInCents = budgeted ? toCents(budgeted) : undefined;
            const realizedInCents = realized !== undefined ? toCents(realized) : undefined;
    
            // Montar o objeto de atualização, omitindo campos não fornecidos
            const updateData = {
                ...(date && { date }),
                ...(name && { name }),
                ...(type && { type }),
                ...(budgetedInCents !== undefined && { budgeted: budgetedInCents }),
                ...(realizedInCents !== undefined && { realized: realizedInCents }),
            };
    
            // Atualizar o documento no MongoDB
            const updatedFinance = await Finance.findByIdAndUpdate(id, updateData, { new: true });
    
            // Verificar se a atualização foi bem-sucedida
            if (!updatedFinance) {
                return res.status(404).json({ error: 'Finance not found' });
            }
    
            // Função auxiliar para converter centavos para dólares
    
            // Converter os valores de volta para dólares na resposta
            const responseFinance = {
                ...updatedFinance.toObject(),
                budgeted: toReais(updatedFinance.budgeted),
                realized: updatedFinance.realized ? toReais(updatedFinance.realized) : undefined,
            };
    
            res.json(responseFinance);
        } catch (err) {
            res.status(400).json(err);
        }
    

    // const id = req.params.id
    

    // Finance.findByIdAndUpdate({ _id: id}, {
    //     date: req.body.date,
    //     name: req.body.name,
    //     type: req.body.type,
    //     budgeted: req.body.budgeted,
    //     realized: req.body.realized
    // }).then(Finance => res.json(Finance))
    // .catch(err => res.json(err))
}

const deleteFinance = async (req, res) => {
    const id = req.params.id

    Finance.findByIdAndDelete ({_id: id})
    .then(response => res.json(response))
    .catch (err => res.json(err))
}

const listFinancesByMonth = async (req, res) => {
    const { month, year } = req.query;

    const startDate = new Date(year, month - 1, 0); // Month is zero-based
    const endDate = new Date(year, month, 0);

    try {
        const finances = await Finance.find({
            date: { $gte: startDate, $lte: endDate }
        });

        let totalBudgeted = 0;
        let totalRealized = 0;

        finances.forEach(finance => {
            if (finance.type === 'entrada') {
                totalBudgeted += finance.budgeted;
                totalRealized += finance.realized ? finance.realized : 0;
            } else if (finance.type === 'saida') {
                totalBudgeted -= finance.budgeted;
                totalRealized -= finance.realized ? finance.realized : 0;
            }
        });

        const result = finances.map(finance => ({
            ...finance.toObject(),
            date: finance.date.toISOString().split('T')[0], // Converte para 'YYYY-MM-DD'
            budgeted: toReais(finance.budgeted),
            realized: finance.realized ? toReais(finance.realized) : undefined,
        }));

        res.json({
            finances: result,
            totalBudgeted: toReais(totalBudgeted),
            totalRealized: toReais(totalRealized)
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

const listFinancesByQuarter = async (req, res) => {
    const { quarter, year } = req.query;

    if (!quarter || !year) {
        return res.status(400).send('Quarter and year are required');
    }

    const startMonth = (quarter - 1) * 3;
    const startDate = new Date(year, startMonth, 0);
    const endDate = new Date(year, startMonth + 3, 1);

    try {
        const finances = await Finance.find({
            date: { $gte: startDate, $lt: endDate }
        });

        let totalBudgeted = 0;
        let totalRealized = 0;

        finances.forEach(finance => {
            const budgeted = parseFloat(finance.budgeted);
            const realized = finance.realized ? parseFloat(finance.realized) : 0;

            if (finance.type === 'entrada') {
                totalBudgeted += budgeted;
                totalRealized += realized;
            } else if (finance.type === 'saida') {
                totalBudgeted -= budgeted;
                totalRealized -= realized;
            }
        });

        const result = finances.map(finance => ({
            ...finance.toObject(),
            date: finance.date.toISOString().split('T')[0], // Converte para 'YYYY-MM-DD'
            budgeted: toReais(finance.budgeted),
            realized: finance.realized ? toReais(finance.realized) : undefined,
        }));

        res.json({
            finances: result,
            totalBudgeted: toReais(totalBudgeted),  // Converte totalBudgeted de centavos para reais
            totalRealized: toReais(totalRealized)   // Converte totalRealized de centavos para reais
        });
    } catch (err) {
        res.status(500).send(err);
    }
};

const listFinancesBySemester = async (req, res) => {
    const { semester, year } = req.query;

    if (!semester || !year) {
        return res.status(400).send('Semester and year are required');
    }

    const startMonth = (semester - 1) * 6;
    const startDate = new Date(year, startMonth, 0);
    const endDate = new Date(year, startMonth + 6, 1);

    try {
        const finances = await Finance.find({
            date: { $gte: startDate, $lt: endDate }
        });

        let totalBudgeted = 0;
        let totalRealized = 0;

        finances.forEach(finance => {
            const budgeted = parseFloat(finance.budgeted);
            const realized = finance.realized ? parseFloat(finance.realized) : 0;

            if (finance.type === 'entrada') {
                totalBudgeted += budgeted;
                totalRealized += realized;
            } else if (finance.type === 'saida') {
                totalBudgeted -= budgeted;
                totalRealized -= realized;
            }
        });

        const result = finances.map(finance => ({
            ...finance.toObject(),
            date: finance.date.toISOString().split('T')[0], // Converte para 'YYYY-MM-DD'
            budgeted: toReais(finance.budgeted),
            realized: finance.realized ? toReais(finance.realized) : undefined,
        }));

        res.json({
            finances: result,
            totalBudgeted: toReais(totalBudgeted),  
            totalRealized: toReais(totalRealized)   
        });
    } catch (err) {
        res.status(500).send(err);
    }
};

const listFinancesByYear = async (req, res) => {
    const { year } = req.query;

    if (!year) {
        return res.status(400).send('Year is required');
    }

    const startDate = new Date(year, 0, 0);
    const endDate = new Date(year, 11, 31);

    try {
        const finances = await Finance.find({
            date: { $gte: startDate, $lt: endDate }
        });

        let totalBudgeted = 0;
        let totalRealized = 0;

        finances.forEach(finance => {
            const budgeted = parseFloat(finance.budgeted);
            const realized = finance.realized ? parseFloat(finance.realized) : 0;

            if (finance.type === 'entrada') {
                totalBudgeted += budgeted;
                totalRealized += realized;
            } else if (finance.type === 'saida') {
                totalBudgeted -= budgeted;
                totalRealized -= realized;
            }
        });

        const result = finances.map(finance => ({
            ...finance.toObject(),
            date: finance.date.toISOString().split('T')[0], // Converte para 'YYYY-MM-DD'
            budgeted: toReais(finance.budgeted),
            realized: finance.realized ? toReais(finance.realized) : undefined,
        }));

        res.json({
            finances: result,
            totalBudgeted: toReais(totalBudgeted),  
            totalRealized: toReais(totalRealized)   
        });
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = {
    createFinance,
    updateFinance,
    deleteFinance,
    listFinances,
    listFinanceById,
    listFinancesByMonth,
    listFinancesByQuarter,
    listFinancesBySemester,
    listFinancesByYear
}