<template>
    <div class="container my-4">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <span class="badge badge-primary mt-2 mb-4 w-100" style="font-size: 20px;">Expenses</span>
                <!-- <span class="badge badge-danger w-100 my-3" v-if="error" style="font-size: 16px;">{{ error }}</span> -->
                <div class="form-group">
                    <label for="amount">Amount</label>
                    <input type="number" @keyup.enter="addExpense" id="amount" v-model.number="inputexp.amount" class="form-control">
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <input type="text" @keyup.enter="addExpense" id="description" v-model="inputexp.description" class="form-control">
                </div>
                <div class="form-group">
                    <label for="category">Category</label>
                    <v-select :options="categories" v-model="inputexp.category" :clearable="false"></v-select>
                    <!-- <input type="text" @keyup.enter="addExpense" id="category" v-model="inputexp.description" class="form-control"> -->
                </div>
                <div class="form-group">
                    <!-- <input type="date" @keyup.enter="addExpense" id="date" v-model="inputexp.date" class="form-control"> -->
                    <datetime v-model="inputexp.date" format="MM-DD-YYYY HH:mm"></datetime>
                </div>
                <div class="form-group">
                    <button class="btn btn-outline-dark w-100 font-weight-bold" :disabled="isLoading" @click="addExpense">Submit</button>
                </div>
                <div class="form-group">
                    <!-- <select class="custom-select" v-model="selectedmonth">
                        <option :value="month" v-for="month in months" :key="month">
                            {{ month }}
                        </option>
                    </select> -->
                    <span class="badge badge-primary" style="font-size: 16px;">Filter</span>
                    <v-select :options="listYears" class="mt-1" v-model="selectedyear" :clearable="false" @input="selectedmonth = 'Show All'"></v-select>
                    <v-select :options="listMonths" class="my-2" v-model="selectedmonth" :clearable="false"></v-select>
                    <v-select :options="listCategories" v-model="selectedcategory" :clearable="false"></v-select>
                    <!-- {{ listMonths }} -->
                </div>
                <div>
                    <div class="d-flex my-3" v-if="isLoading">
                        <div class="mx-auto">
                            <radar-spinner
                                :animation-duration="2000"
                                :size="60"
                                color="#ff1d5e"
                            />
                        </div>
                    </div>
                    <div v-else>
                        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="limit">
                            <ul class="list-group">
                                <li data-aos="fade-up" data-aos-offset="100" data-aos-easing="ease-out-back" class="list-group-item" v-for="(expense, index) in orderedExpenses" v-bind:key="expense._id" v-bind:index="index">
                                    <div>
                                        <div class="number">
                                            <span class="number">
                                                {{ expense.amount | currency }}
                                            </span>
                                            <span class="badge badge-danger mx-1" style="font-size: 14px;">
                                                {{ expense.category }}
                                            </span>
                                            <span class="float-right">
                                                <span class="mx-3 action-btn" style="cursor: pointer" @click="editExpense(expense)">
                                                    <i class="fa fa-edit"></i>
                                                </span>
                                                <span class="action-btn" style="cursor: pointer" @click="confirmRemoveExpense(expense._id)">
                                                    <i class="fa fa-trash"></i>
                                                </span>
                                                <!-- <button class="mx-1" @click="editExpense(expense)" style="font-size: 16px;">

                                                </button>
                                                <button class="btn btn-sm" @click="confirmRemoveExpense(expense._id)" style="font-size: 16px;">

                                                </button> -->
                                            </span>
                                        </div>
                                        <div>{{ expense.description }}</div>
                                        <div class="font-weight-bold my-1" style="letter-spacing: 1.2px;">
                                            <span class="badge badge-dark mr-1" style="font-size: 15px;">
                                                {{ expense.date | dateParse('MM-DD-YYYY HH:mm') | dateFormat('DD - MM - YYYY') }}
                                            </span>
                                            <span class="badge badge-secondary" style="font-size: 15px;">
                                                {{ expense.date | dateParse('MM-DD-YYYY HH:mm') | dateFormat('hh:mm A') }}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <hr>
                        <div class="my-3">
                            <div>
                                <span class="font-weight-bold">
                                    Total Expense
                                </span>
                                <span class="float-right number">
                                    {{ totalexpense | currency }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div>
                    <b-modal title="Edit Expense" v-model="modalShow" :centered="true" @ok="updateExpense()" @hide="getExpenses()">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="edit-amount">Amount</label>
                                    <input type="number" @keyup.enter="updateExpense()" v-model.number="editexp.amount" id="edit-amount" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label for="edit-description">Description</label>
                                    <input type="text" @keyup.enter="updateExpense()" v-model="editexp.description" id="edit-description" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label>Category</label>
                                    <v-select :options="categories" v-model="editexp.category" :clearable="false"></v-select>
                                </div>
                                <div class="form-group">
                                    <datetime v-model="editexp.date" format="MM-DD-YYYY HH:mm"></datetime>
                                </div>
                            </div>
                        </div>
                    </b-modal>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import ExpenseService from '../ExpenseService'
import { RadarSpinner  } from 'epic-spinners'
import Swal from 'sweetalert2'
import AOS from 'aos'

export default {
    name: 'expense', 
    components: {
        RadarSpinner
    },
    
    data(){
        return{
            isLoading: false, 
            expenses: [], 
            error: '', 
            selectedmonth: 'Show All', 
            selectedyear: 'Show All', 
            selectedcategory: 'Show All', 
            modalShow: false, 
            inputexp: {
                amount: null, 
                description: '', 
                category: 'Other', 
                date: ''
            }, 
            editexp: {
                _id: '', 
                amount: null, 
                description: '', 
                category: '', 
                date: ''
            }, 
            categories: [
                'Education', 
                'Fees & Charges', 
                'Food & Dining', 
                'Investments', 
                'Services', 
                'Shopping', 
                'Transportation', 
                'Travel', 
                'Other'
            ], 
            listOfMonths: ['Show All'], 
            listOfYears: ['Show All'], 
            listOfCategories: ['Show All'], 
            limit: 10,
            busy: false
        }
    }, 
    computed: {
        totalexpense(){
            return this.orderedExpenses.reduce(function(prev, cur) {
                return prev + cur.amount;
            }, 0);
        }, 
        orderedExpenses: function (){
            return _.orderBy(this.filterByCategory, 'date', 'desc')
        }, 

        listYears(){
            const expenses = this.filterByMonth

            expenses.forEach(item => {
                const dat = new Date(item.date)
                const year = dat.getFullYear()
                
                // eslint-disable-next-line
                this.listOfYears.push(year)
            })
            
            const uniqueSet = new Set(this.listOfYears)
            const backToArray = [...uniqueSet]

            return backToArray
        }, 

        listMonths(){
            const months = [
                'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
                'November', 'December'
            ]

            const expenses = this.filterByMonth
            // eslint-disable-next-line
            // this.listOfMonths = ['Show All']

            expenses.forEach(item => {
                const dat = new Date(item.date)
                const monthIndex = dat.getMonth()
                const wkwk = months[monthIndex]
                
                // eslint-disable-next-line
                this.listOfMonths.push(wkwk)
            })
            
            const uniqueSet = new Set(this.listOfMonths)
            const backToArray = [...uniqueSet]

            function mapOrder (array, order) {
                array.sort( function (a, b) {
                    // var A = a[key], B = b[key];

                    if (order.indexOf(a) > order.indexOf(b)) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
                return array
            }
            const ordered_array = mapOrder(backToArray, months)

            return ordered_array
        }, 

        listCategories(){
            const expenses = this.filterByMonth

            expenses.forEach(item => {
                const year = item.category

                // eslint-disable-next-line
                this.listOfCategories.push(year)
            })
            
            const uniqueSet = new Set(this.listOfCategories)
            const backToArray = [...uniqueSet]

            return backToArray
        },

        filterByYear(){
            // eslint-disable-next-line
            this.listOfMonths = ['Show All']
            // eslint-disable-next-line
            this.listOfCategories = ['Show All']
            // eslint-disable-next-line
            // this.selectedmonth = 'Show All'
            // eslint-disable-next-line
            // this.selectedcategory = 'Show All'

            const selectedyear = this.selectedyear
            if(selectedyear !== 'Show All'){
                const lolz = this.expenses.filter(function(exp) {
                    const dat = new Date(exp.date)
                    const year = dat.getFullYear()
                    return year === selectedyear
                })

                return lolz
            }else{
                return this.expenses
            }
        }, 

        filterByMonth() {
            // eslint-disable-next-line
            this.listOfCategories = ['Show All']

            const month = this.selectedmonth
            if(month !== 'Show All'){
                const months = [
                    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
                    'November', 'December'
                ]
                
                const lolz = this.filterByYear.filter(function(exp) {
                    const dat = new Date(exp.date)
                    const monthIndex = dat.getMonth()
                    const wkwk = months[monthIndex]
                    return wkwk === month
                })

                return lolz
            }else{
                return this.filterByYear
            }
        }, 

        filterByCategory(){
            const selectedcategory = this.selectedcategory
            if(selectedcategory !== 'Show All'){
                const lolz = this.filterByMonth.filter(function(exp) {
                    const cat = exp.category
                    return cat === selectedcategory
                })

                return lolz
            }else{
                return this.filterByMonth
            }
        }
    }, 

    async created(){
        try {
            this.isLoading = true
            this.loadMore()
            this.isLoading = false
        } catch (err) {
            this.error = err.message
            Swal.fire('Something went wrong', this.error, 'error')
        }
    }, 
    
    methods: {
        async loadMore(){
            const response = await ExpenseService.getExpenses()
            this.busy = true
            const append = response.slice(
                this.expenses.length,
                this.expenses.length + this.limit
            );
            this.expenses = this.expenses.concat(append)
            this.busy = false
        },
        async getExpenses(){
            this.expenses = await ExpenseService.getExpenses()
        }, 
        async addExpense(){
            if(this.inputexp.amount && this.inputexp.date){
                this.isLoading = true
                await ExpenseService.insertExpense(
                    this.inputexp.amount, 
                    this.inputexp.description, 
                    this.inputexp.category, 
                    this.inputexp.date
                )
                this.expenses = await ExpenseService.getExpenses()
                this.isLoading = false
                this.error = ''
                Swal.fire('Success', 'Expense Added', 'success')
            }else{
                this.error = 'Please fill Required fields'
                Swal.fire('Error', this.error, 'error')
            }
        }, 

        editExpense(expense){
            this.editexp = expense
            this.modalShow = !this.modalShow
        }, 

        async updateExpense(){
            this.modalShow = false
            this.isLoading = true
            await ExpenseService.updateExpense(
                this.editexp._id, 
                this.editexp.amount, 
                this.editexp.description, 
                this.editexp.category, 
                this.editexp.date, 
            )
            this.expenses = await ExpenseService.getExpenses()
            this.isLoading = false
            Swal.fire('Success', 'Expense Updated', 'success')
        }, 

        confirmRemoveExpense(id){
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                type: 'warning', 
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.value) {
                    this.removeExpense(id)
                    Swal.fire(
                        'Deleted!',
                        'Expense Deleted.',
                        'success'
                    )
                }
            })
        }, 

        async removeExpense(id){
            this.isLoading = true
            await ExpenseService.deleteExpense(id)
            this.expenses = await ExpenseService.getExpenses()
            this.isLoading = false
        }
    }
}
AOS.init();
</script>

<style lang="scss">
*{
    font-family: 'Quicksand', sans-serif;
}
.number{
    font-family: 'Poppins', sans-serif;
}
.action-btn{
    color: #dc3545;
    transition: 1s;
    &:hover{
        color: #943640;
    }
}
button.close{
    outline: 0;
}
</style>
