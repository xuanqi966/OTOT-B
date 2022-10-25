let express = require('express')
let apiRoutes = require('./routes/api-routes')
let bodyParser = require('body-parser')
let mongoose = require('mongoose')

let app = express()

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

mongoose.connect('mongodb://localhost/xuanqi', { useNewUrlParser: true});

var db = mongoose.connection

if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")

var port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Hello World from Xuanqi'))

app.use('/library', apiRoutes)

app.listen(port, () => {
    console.log("Running on port " + port)
})