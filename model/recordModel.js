var mongoose = require('mongoose')

// setup schema
var recordSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true
    },
    borrower: {
        type: String,
        required: true
    },
    contact_number: String,
    create_date: {
        type: Date,
        default: Date.now
    }
})

// export Borrow model
var Record = module.exports = mongoose.model('record', recordSchema)
module.exports.get = function (callback, limit) {
    Record.find(callback).limit(limit)
}