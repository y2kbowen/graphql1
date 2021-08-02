const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const mongoose = require('mongoose');


const schema = require('./schema/schema')
const cors = require('cors')

const app = express();


mongoose.connect('mongodb+srv://y2kbowen:qedazcQEDAZC@cluster0.ewcji.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true} );
mongoose.connection.once('open', () => {
    console.log("Yes! Connected!");
})


/*

*/

app.use(cors())

app.use('/graphql',graphqlHTTP({
    graphiql : true,
    schema: schema
}))

app.listen(4000, () => {
    console.log("Listening for requests on port 4000");
} )