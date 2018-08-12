// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

Vue.prototype.axios = axios

//  axios的拦截器
// axios.interceptors.request.use(function (config) {
//   config.baseURL = 'http://localhost:8888/api/private/v1/'
//   config.headers.Authorization = localStorage.getItem('shop_token')
//   return config
// }, function (error) {
//   return Promise.reject(error)
// })

// axios默认设置
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
axios.defaults.headers.common['Authorization'] = localStorage.getItem('shop_token')

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
