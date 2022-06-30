import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
  demo:{},
  isLogin:false,
  userObj:null,
  userRole:{
    'portal_link_item_manage':false,
  }
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
