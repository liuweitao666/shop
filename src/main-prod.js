import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入nprogress包
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' 

Vue.use(VueQuillEditor)
Vue.component("tree-table",TreeTable)

// 设置baseUrl
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
// 设置request拦截器，每次发送Ajax请求都保存一个token值
axios.interceptors.request.use(config=>{
  // console.log(config)
  // 在request拦截器中显示进度条
  NProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 设置response拦截器,请求成功隐藏进度条 NProgress.done()
axios.interceptors.response.use(config=>{
  NProgress.done()
  return config
})

Vue.prototype.$http =axios
Vue.config.productionTip = false

// 注册全局的时间戳处理过滤器
Vue.filter('dateformat',function(origantime){
  const dt = new Date(origantime)

  const y = dt.getFullYear()
  const m = (dt.getMonth()+1+'').padStart(2,'0')
  const d = (dt.getDate()+'').padStart(2,'0')

  const hh = (dt.getHours()+'').padStart(2,'0')
  const mm = (dt.getMinutes()+'').padStart(2,'0')
  const ss = (dt.getSeconds()+'').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
