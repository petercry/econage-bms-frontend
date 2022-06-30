import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
      tempObj:{},
      status:{},
      operate:{},
      publicRole:{},
      typeList:[], //分类
      subClassList:{},//子类
      natureList:[],//性质
      vehicleList:[], //整车/零部件
      authenticationList:[], //认证管理公告
      applicableModels:[],//适用车型
      powerType:[], //动力类型
      standardState:[],//标准状态
      statusSet:{}, //自定义集合
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
