import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
      tempObj:{},
      stateFlowList:{}, //获取审批流所有节点枚举
      phaseStatusList:{},//获取审批流状态
      standardType:[],//标准分类 
      editType:[], // 制修订
      programSource:[], //规划来源
      fiveAspectsField:[],//五化领域
      applicationCarType:[], //应用车型
      applicationField:[],//应用领域
      applicableProject:[], //适用项目
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
