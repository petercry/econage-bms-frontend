import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
  breadList:[{
    label:'首页',
    to:{
      name:'serviceList'
    }
  }],
//   事项添加，修改，删除  ROLE_portal1-item_create，ROLE_portal1-item_mod，ROLE_portal1-item_delete
// 主项添加，修改，删除  ROLE_portal1-item-group_create,ROLE_portal1-item-group_mod,
// ROLE_portal1-item-group_delete
// 主题添加，修改，删除 ROLE_portal1-title_create，ROLE_portal1-title_mod，ROLE_portal1-item_delete
// 应用查询添加修改删除 ROLE_ExternalApp_select，ROLE_ExternalApp_create，ROLE_ExternalApp_mod，ROLE_ExternalApp_delete
  userRole:{
    // 事项
    'portal1-item_create':false,
    'portal1-item_mod':false,
    'portal1-item_delete':false,
    //主项
    'portal1-item-group_create':false,
    'portal1-item-group_mod':false,
    'portal1-item-group_delete':false,
    //主题
    'portal1-title_create':false,
    'portal1-title_mod':false,
    'portal1-title_delete':false,
    //应用
    'ExternalApp_select':false,
    'ExternalApp_create':false,
    'ExternalApp_mod':false,
    'ExternalApp_delete':false,
  }
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
