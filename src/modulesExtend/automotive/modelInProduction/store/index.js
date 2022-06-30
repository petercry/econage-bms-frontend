import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
  tempObj:{},
  applicableModels:[],//适用车型
  powerType:[],//动力类型
  isApplicable:[], //是否适用
  available:[], //是否有效
  dischargeStageList:[], //排放阶段
  modelNameList:[],  //车型名称
  ApplicationCategory:[],//申请检验类别
  copeStatus:{}, //应对状态 
  statusList:{},//状态
  spotInRegulationStatus:{},
  typeList:[], //分类
  subClassList:{},//子类
  natureList:[],//性质
  vehicleList:[], //整车/零部件
  authenticationList:[], //认证管理公告
  standardState:[],//标准状态
  statusSet:{}, //自定义集合
  spotCheckStatus:{},//点检状态
  respondList:{}, //是否应对
  dfHandlingInterfaceList:{},//符合性
  professionList:[],//专业
  resultEnumList:{},//审批状态
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
