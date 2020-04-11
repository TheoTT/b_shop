import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'

Vue.component('tree-table', TreeTable)

axios.defaults.baseURL = 'http://10.10.10.105:5000'
// axios.defaults.baseURL = 'http://127.0.0.1:5000'
// axios.defaults.baseURL = 'http://192.168.3.5:5000'
// axios.defaults.headers.post['Content-Type'] = 'application/json'
// 将axios挂载至Vue原型对象， 所有组件都能通过this.$http访问
// 增加权限验证
axios.interceptors.request.use(config => {
  config.headers.Authorization = 'JWT ' + window.sessionStorage.getItem('token')
  console.log(config)
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
