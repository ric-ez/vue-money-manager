import Vue from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import VueCurrencyFilter from 'vue-currency-filter'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
import vSelect from 'vue-select'

import VueFilterDateFormat from 'vue-filter-date-format';
import VueFilterDateParse from 'vue-filter-date-parse'
import infiniteScroll from 'vue-infinite-scroll'

import 'aos/dist/aos.css';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-select/dist/vue-select.css';

Vue.use(BootstrapVue)
Vue.use(infiniteScroll)
Vue.use(VueFilterDateFormat)
Vue.use(VueFilterDateParse)

Vue.component('v-select', vSelect)
Vue.component('datetime', VueCtkDateTimePicker)

Vue.use(VueCurrencyFilter, {
  symbol : 'Rp.',
  thousandsSeparator: ',',
  fractionSeparator: ',',
  symbolPosition: 'front',
  symbolSpacing: true
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
