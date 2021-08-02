const mongoose = require('mongoose')
const mongooseSchema = mongoose.Schema;


const userSchema = new mongooseSchema( {
    name: String,
    age: Number,
    profession: String
})

module.exports = mongoose.model('User',userSchema)