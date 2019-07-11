const express = require('express')
const mongodb = require('mongodb')

const router = express.Router()

// Get Posts
router.get('/', async (req, res) => {
    const expenses = await loadExpenses()
    res.send(await expenses.find({}).toArray())
}) 

// Add Posts
router.post('/', async (req, res) => {
    const expenses = await loadExpenses()
    await expenses.insertOne({
        amount: req.body.amount, 
        description: req.body.description, 
        date: req.body.date
    })
    res.status(201).send()
}) 

// Update Posts
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
                date: req.body.date
            }
        }
    )
    res.status(200).send()
}) 

// Delete Posts
router.delete('/:id', async (req, res) => {
    const expenses = await loadExpenses()
    await expenses.deleteOne({
        _id: new mongodb.ObjectID(req.params.id)
    })
    res.status(200).send()
}) 

async function loadExpenses(){
    const client = await mongodb.MongoClient.connect
    ('your_mongodb_connection_url', {
            useNewUrlParser: true
    })

    return client.db('money_manager').collection('income')
}

module.exports = router