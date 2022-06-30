import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
      editUser:{},//当前登录用户信息
      demo:{}, 
      tempObj:{},
      editType:[],//制修订
      operationType:{},//操作类型
      supportStatus:{},//状态标示
      supportReview:{},//复审结论
      stateFlow:{},//审批流节点
      phaseStatus:{},//审批状态
      usageList:[],//使用情况
      requirementCompareList:[],//与工作比较
      statePlanFlow:{},//发布-审批流节点
      planPhaseStatus:{},//发布-审批状态

}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
