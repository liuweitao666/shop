import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugin/element'
import axios from 'axios'


axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
Vue.prototype.$http =axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
