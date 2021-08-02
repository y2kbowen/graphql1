const mongoose = require('mongoose')
const mongooseSchema = mongoose.Schema;

const postsSchema = new mongooseSchema( {
    comment: String,
    userId: String
})

module.exports = mongoose.model("Post",postsSchema)