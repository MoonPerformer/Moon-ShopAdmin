// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// vue-quill-editor富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 时间插件
import moment from 'moment'

import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'

Vue.use(ElementUI)
Vue.use(VueQuillEditor)
Vue.prototype.axios = axios
// 时间过滤器
Vue.filter('timeFilter', (input, format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(input).format(format)
})

// axios默认设置
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// axios.defaults.headers.common['Authorization'] = localStorage.getItem('shop_token')

//  axios的拦截器
axios.interceptors.request.use(function (config) {
  // config.baseURL = 'http://localhost:8888/api/private/v1/'
  config.headers.Authorization = localStorage.getItem('shop_token')
  return config
}, function (error) {
  return Promise.reject(error)
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
