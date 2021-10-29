import Vue from 'vue'
import Vuex from 'vuex'
import permission from './modules/permission'
// dynamic router permission control (Experimental)
// import permission from './modules/async-router'
import getters from './getters'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    permission
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})

export default store
