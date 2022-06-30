import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
      loginUser:{},
      menuTabClickObj:{},
      menuTabArray:[],
      toggleMenuObj:{time:0},
      toggleFlag:0,
      sysWidth:1000,
      themeStatus:0,
      lang:'',
      tempObj:{},
      documentReady:false
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
