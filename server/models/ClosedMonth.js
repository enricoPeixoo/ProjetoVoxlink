const mongoose = require('mongoose');

const ClosedMonth = mongoose.model('ClosedMonth', {
    month: {
        type: Number
    },
    year: {
        type: Number,
    },
    finances: {
        type: Array
    }
})

module.exports = ClosedMonth