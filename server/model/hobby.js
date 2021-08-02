const mongoose = require('mongoose')
const mongooseSchema = mongoose.Schema;

const hobbySchema = new mongooseSchema( {
    title: String,
    description: String,
    userId: String
})

module.exports = mongoose.model("Hobby",hobbySchema)
