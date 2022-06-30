import Vue from 'vue'
import Router from 'vue-router'
import {sysEnv} from '../config/env'
import {ENV_ROUTER} from '../../../../forEnv/forEnvRoute.js'

const organizationList = r => require.ensure([], () => r(require('../views/organizationList.vue')), 'regulationStructured');
const articleEdit = r => require.ensure([], () => r(require('../views/articleEdit.vue')), 'regulationStructured')

const approveList = r => require.ensure([], () => r(require('../views/approveList.vue')), 'approveList')
const withdrawPage = r => require.ensure([], () => r(require('../views/withdrawPage.vue')), 'approveList')
const appropeUser = r => require.ensure([], () => r(require('../views/appropeUser.vue')), 'approveList')

const finishList = r => require.ensure([], () => r(require('../views/finishList.vue')), 'finishList')
const uploadDialog = r => require.ensure([], () => r(require('../views/uploadDialog.vue')), 'uploadDialog')

const regulatoryForm = r => require.ensure([], () => r(require('../views/regulatoryForm.vue')), 'regulatoryFormList')

const historyList = r => require.ensure([], () => r(require('../views/historyList.vue')), 'historyList')
const flowHistory = r => require.ensure([], () => r(require('../views/flowHistory.vue')), 'historyList')

Vue.use(Router)
const router = [ 
  {
    path:'',
    redirect:'/organizationList'
  },
  {
    path:'/organizationList',
    name:'organizationList',
    component:organizationList
  }
  ,{
    path:'/articleEdit/:id/:caseType/:masterId/:fromPage/:parentIsEdit',
    name:'articleEdit',
    component:articleEdit
  },{
    path:'/approveList',
    name:'approveList',
    component:approveList
  },{
    path:'/withdrawPage/:caseType',
    name:'withdrawPage',
    component:withdrawPage    
  },{
    path:'/finishList/:isOpenDialog',
    name:'finishList',
    component:finishList
  },{
    path:'/uploadDialog',
    name:'uploadDialog',
    component:uploadDialog
  },{
    path:'/regulatoryFormList',
    name:'regulatoryFormList',
    component:regulatoryForm
  },{
    path:'/appropeUser',
    name:'appropeUser',
    component:appropeUser
  },{
    path:'/historyList/:id',
    name:'historyList',
    component:historyList
  },{
    path:'/flowHistory/:id/:pageType',
    name:'flowHistory',
    component:flowHistory
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
