const mongoose = require('mongoose')

const Finance = mongoose.model('Finance', {
    date: {
        type: Date,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['entrada', 'saida'],
        required: true
    },
    budgeted: {
        type: Number,
        required: true
    },
    realized: {
        type: Number,
    }
})

module.exports = Finance