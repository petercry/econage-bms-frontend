import Vue from 'vue'
import Router from 'vue-router'
import {sysEnv} from '../config/env'
import {ENV_ROUTER} from '../../../../forEnv/forEnvRoute.js'

const collaborativeIndex = r => require.ensure([], () => r(require('../../collaborativeManage/views/index.vue')), 'collaborativeManage')
const editColl = r => require.ensure([], () => r(require('../../collaborativeManage/views/editPage/editColl.vue')), 'collaborativeManage')
const selectedStaff = r => require.ensure([], () => r(require('../../collaborativeManage/views/selectedStaff.vue')), 'selectedStaff')
const fileManage = r => require.ensure([], () => r(require('../../collaborativeManage/views/fileManage.vue')), 'fileManage')
const addFile = r => require.ensure([], () => r(require('../../collaborativeManage/views/editPage/addFile.vue')), 'fileManage')

const selectCriteriaList = r => require.ensure([], () => r(require('../../collaborativeManage/views/selectCriteriaList.vue')), 'selectCriteria')
const selectCriteriaPage = r => require.ensure([], () => r(require('../../collaborativeManage/views/selectCriteriaPage.vue')), 'selectCriteria')
Vue.use(Router)
const router = [ 
  {
    path:'',
    redirect:'/collaborativeIndex'
  },
  {
    path:'/collaborativeIndex',
    name:'collaborativeIndex',
    component:collaborativeIndex
  },{
    path:'/editColl/:id/:caseType',
    name:'editColl',
    component:editColl
  },{
    path:'/selectedStaff/:masterId',
    name:'selectedStaff',
    component:selectedStaff
  }
  ,{
    path:'/addFile/:masterId',
    name:'addFile',
    component:addFile
  }
  ,{
    path:'/fileManage/:masterId',
    name:'fileManage',
    component:fileManage
  },{
    path:'/selectCriteriaList/:masterId',
    name:'selectCriteriaList',
    component:selectCriteriaList
  },{
    path:'/selectCriteriaPage/:masterId/:isOpenDialog',
    name:'selectCriteriaPage',
    component:selectCriteriaPage
  }
 
];
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Router.prototype.replace = function replace(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  mode:'hash',
  routes: sysEnv == 1?router:router.concat(ENV_ROUTER)
})
