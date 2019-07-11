const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(bodyParser.json())
app.use(cors())

const expenses = require('./routes/api/expenses')
const income = require('./routes/api/income')

app.use('/api/expenses', expenses)
app.use('/api/income', income)

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server started on port ${port}`))