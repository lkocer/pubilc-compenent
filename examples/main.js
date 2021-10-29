import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'
import './core/lazy_use'
import 'ant-design-vue/dist/antd.less'
 
Vue.config.productionTip = false
 
new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')