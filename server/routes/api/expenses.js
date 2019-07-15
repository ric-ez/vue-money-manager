const express = require('express')
const mongodb = require('mongodb')

const router = express.Router()

// Get expenses / pengeluaran
router.get('/', async (req, res) => {
    const expenses = await loadExpenses()
    res.send(await expenses.find({}).toArray())
}) 

// Create expenses / pengeluaran
router.post('/', async (req, res) => {
    const expenses = await loadExpenses()
    await expenses.insertOne({
        amount: req.body.amount, 
        description: req.body.description, 
        category: req.body.category, 
        date: req.body.date
    })
    res.status(201).send()
}) 

// Update expenses / pengeluaran
router.put('/:id', async (req, res) => {
    const expenses = await loadExpenses()
    await expenses.updateOne(
        {
            _id: new mongodb.ObjectID(req.params.id), 
        }, 
        {
            $set:{
                amount: req.body.amount, 
                description: req.body.description, 
                category: req.body.category, 
                date: req.body.date
            }
        }
    )
    res.status(200).send()
}) 

// Delete expenses / pengeluaran
router.delete('/:id', async (req, res) => {
    const expenses = await loadExpenses()
    await expenses.deleteOne({
        _id: new mongodb.ObjectID(req.params.id)
    })
    res.status(200).send()
}) 

// Replace your_mongodb_connection_url with yours
async function loadExpenses(){
    const client = await mongodb.MongoClient.connect
    ('your_mongodb_connection_url', {
            useNewUrlParser: true
    })

    // Replace money_manager with your mongodb database name
    return client.db('money_manager').collection('expenses')
}

module.exports = router