const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const config = require('./config')

const mongoose = require('mongoose')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const companyRouter = require('./routes/company')
const staffRouter = require('./routes/staff')
const shopRouter = require('./routes/shop')

const app = express()

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(logger('dev'))
app.use(express.json({
  limit: '50mb'
}))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/company', companyRouter)
app.use('/staff', staffRouter)
app.use('/shop', shopRouter)

module.exports = app
