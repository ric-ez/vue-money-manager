import axios from 'axios'

const url = 'http://localhost:5000/api/expenses/'

class ExpenseService{
    // Get Expenses
    static getExpenses(){
        return new Promise(async (resolve, reject) => {
            try{
                const res = await axios.get(url)
                const data = res.data
                resolve(
                    data.map(expense => ({
                        ...expense, 
                    }))
                )
            }catch(err){
                reject(err)
            }
        })
    }

    // Insert Expense
    static insertExpense(amount, description, category, date){
        return axios.post(url, {
            amount, description, category, date
        })
    }
    // Update Expense
    static updateExpense(id, amount, description, category, date){
        return axios.put(`${url}${id}`, {
            amount, description, category, date
        })
    }
    // Delete Expense
    static deleteExpense(id){
        return axios.delete(`${url}${id}`)
    }
}

export default ExpenseService