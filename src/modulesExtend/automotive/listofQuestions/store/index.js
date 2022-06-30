import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
      demo:{}, 
      tempObj:{},
      revisionTypeList:[], //制、修订基础数据

}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
