const mongoose = require('mongoose');


//will be built based on a loop to get all of the data 
const PriceSchema = new mongoose.Schema({
    bitcoin: {
                price: Number,
                _id: ObjectID(),
    },
    ethereum: {
                price: Number,
                _id: ObjectID(),
    },
})

const Prices = mongoose.model("prices", PriceSchema)

module.exports = Prices

//will be built based on a loop to get all of the data 
const CurrencySchema = new mongoose.Schema({
    CAD: {
                usd_conversion: Number,
                _id: ObjectID(),
    },
    EUR: {
                usd_conversion: Number,
                _id: ObjectID(),
    },
})

const Currencies = mongoose.model("currencies", CurrencySchema)

module.exports = Currencies
