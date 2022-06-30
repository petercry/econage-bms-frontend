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
      tempObj:{},

      ecoSettingObj:{
        sysAdmin:false,
        branchDeptEnabled:false,//分级管控
        branchDepartments:[],
        branchNearestDeptId:[],
    }
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
