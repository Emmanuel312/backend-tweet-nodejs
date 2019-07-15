const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Sentry = require('@sentry/node');
const { url } = require('./config/database')
const { dsn } = require('./config/sentry')

Sentry.init({ dsn });
mongoose.connect(url, { useNewUrlParser: true })
app.use(express.json())

app.use(Sentry.Handlers.requestHandler());
app.use('/api', require('./routes'))

app.use(Sentry.Handlers.errorHandler());

app.listen(3000, () => console.log('server on port 3000'))
//16