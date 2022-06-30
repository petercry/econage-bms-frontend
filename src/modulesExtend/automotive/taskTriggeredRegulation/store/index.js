import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
      demo:{}, 
      tempObj:{},
      typeList:[], //分类
      subClassList:{}, //子类
      standardState:[], //标准状态
      natureList:[], //性质
      applicableModels:[], //适用车型
      powerType:[],//动力类型
      proPlatfForm:[]//所属平台
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
