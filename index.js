const express = require('express')
let cors = require('cors')
const connection = require('./connection')
const playerRoute = require('./routes/player')
const app = express()

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/player', playerRoute)

module.exports = app