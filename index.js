let express = require('express')
let apiRoutes = require('./routes/api-routes')
let bodyParser = require('body-parser')
let mongoose = require('mongoose')
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` })

let app = express()

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

//mongoose.connect(process.env.DB_URI, { useNewUrlParser: true});
mongoose.connect('mongodb+srv://xuanqi:Password.1997@cs3219.wzic27q.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true});

var db = mongoose.connection

if(!db)
    console.log("Error connecting db")
else
    console.log(`DB connected successfully under env=${process.env.NODE_ENV}`)

var port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Hello World from Xuanqi'))

app.use('/library', apiRoutes)

app.listen(port, () => {
    console.log("Running on port " + port)
})

module.exports = app