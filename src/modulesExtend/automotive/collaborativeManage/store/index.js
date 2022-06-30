import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
      demo:{}, 
      tempObj:{},
      statusList:{'IDLE':'未开始','ACTIVE':'协同中','CLOSED':'已关闭'}

}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
