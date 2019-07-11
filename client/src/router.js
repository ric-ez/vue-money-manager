import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Expenses from './views/Expenses.vue'
import Income from './views/Income.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/expenses', 
      name: 'expenses', 
      component: Expenses
    }, 
    {
      path: '/income', 
      name: 'income', 
      component: Income
    }, 
    {
      path: '*', 
      redirect: '/expenses'
    }
  ]
})

export default router