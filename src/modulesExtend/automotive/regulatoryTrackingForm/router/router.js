import Vue from 'vue'
import Router from 'vue-router'
import {sysEnv} from '../config/env'
import {ENV_ROUTER} from '../../../../forEnv/forEnvRoute.js'

const organizationList = r => require.ensure([], () => r(require('../views/organizationList.vue')), 'regulatoryTrackingForm');
const editPage = r => require.ensure([], () => r(require('../views/edit.vue')), 'regulatoryTrackingForm')
const approveList = r => require.ensure([], () => r(require('../views/approveList.vue')), 'approveList')
const withdrawPage = r => require.ensure([], () => r(require('../views/withdrawPage.vue')), 'approveList')
const appropeUser  = r => require.ensure([], () => r(require('../views/appropeUser.vue')), 'approveList')

const dispatchList = r => require.ensure([], () => r(require('../views/dispatchList.vue')), 'dispatchList')
const dispatchEdit = r => require.ensure([], () => r(require('../views/dispatchEdit.vue')), 'dispatchList')

const finishList = r => require.ensure([], () => r(require('../views/index.vue')), 'finishList')
const noticeList = r => require.ensure([], () => r(require('../views/noticeList.vue')), 'noticeList')
const noticeApproveList = r => require.ensure([], () => r(require('../views/noticeApproveList.vue')), 'noticeApproveList')
const noticeFinishList = r => require.ensure([], () => r(require('../views/noticeFinishList.vue')), 'noticeFinishList')
const noticeProofreadingList = r => require.ensure([], () => r(require('../views/noticeProofreadingList.vue')), 'noticeProofreadingList')
const noticeSelectUser  = r => require.ensure([], () => r(require('../views/noticeSelectUser.vue')), 'noticeSelectUser')
const historyList   = r => require.ensure([], () => r(require('../views/historyList.vue')), 'historyList')
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
  },{
    path:'/editPage/:id/:caseType/:fromPage',
    name:'editPage',
    component:editPage
  },{
    path:'/approveList',
    name:'approveList',
    component:approveList
  },{
    path:'/withdrawPage/:caseType',
    name:'withdrawPage',
    component:withdrawPage    
  },{
    path:'/dispatchList',
    name:'dispatchList',
    component:dispatchList    
  },{
    path:'/finishList',
    name:'finishList',
    component:finishList
  },{
    path:'/dispatchEdit/:id/:type',
    name:'dispatchEdit',
    component:dispatchEdit    
  },{
    path:'/noticeList',
    name:'noticeList',
    component:noticeList
  },{
    path:'/noticeApproveList',
    name:'noticeApproveList',
    component:noticeApproveList
  },{
    path:'/noticeFinishList',
    name:'noticeFinishList',
    component:noticeFinishList
  },{
    path:'/noticeProofreadingList',
    name:'noticeProofreadingList',
    component:noticeProofreadingList
  },{
    path:'/noticeSelectUser',
    name:'noticeSelectUser',
    component:noticeSelectUser
  },{
    path:'/appropeUser',
    name:'appropeUser',
    component:appropeUser
  },
  {
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
