import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
  baseData:{
    RESUMESOURCE:[],
    GENDER:[],
    MARRIAGE:[],
    CURRENTSTATE:[],
    JOIN:[],
    GENDER:[],
    FOLLOWTYPE:[],
    FOLLOWWAY:[],
    INTERVIEWMETHOD:[],
    FOLLOWRESULT:[],
    'BMS-HR-STATUS':[],
    'BMS-BP-STATUS':[],
    'BMS.TALENT.JOB':[],
    'BMS.TALENT.LABEL':[],

  },

}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
