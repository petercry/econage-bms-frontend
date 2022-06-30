import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
      tempObj:{},
      typeList:[], //分类
      subClassList:{},//子类
      natureList:[],//性质
      vehicleList:[], //整车/零部件
      authenticationList:[], //认证管理公告
      applicableModels:[],//适用车型
      powerType:[], //动力类型
      standardState:[],//标准状态
      gasList:[], // 气体燃气
      statusSet:{}, //自定义集合
      regulationVersionList:[] ,//法规版本
      publicRole:{
        noticeList:{'regulation-notification.planning_dispatch':false,'regulation-notification.planning_notDispatch':false},
        noticeApprove:{'regulation-notification.approving_agree':false,'regulation-notification.approving_reject':false},
        noticeProofreading:{ 'regulation-notification.proofreading_agree':false,'regulation-notification.proofreading_reject':false},
        organizationList:{},
        approveList:{}
      }, //按钮权限

}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
