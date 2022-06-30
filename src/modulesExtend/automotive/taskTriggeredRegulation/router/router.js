import Vue from 'vue'
import Router from 'vue-router'
import {sysEnv} from '../config/env'
import {ENV_ROUTER} from '../../../../forEnv/forEnvRoute.js'

const regulatoryChangePoints = r => require.ensure([], () => r(require('../../taskTriggeredRegulation/views/regulatoryChangePoints.vue')), 'regulatoryChangePoints')
const editPoint = r => require.ensure([], () => r(require('../../taskTriggeredRegulation/views/editPoint.vue')), 'editPoint')
const spotCheckList = r => require.ensure([], () => r(require('../../taskTriggeredRegulation/views/spotCheckList.vue')), 'spotCheckList')
const withdrawPage = r => require.ensure([], () => r(require('../../taskTriggeredRegulation/views/withdrawPage.vue')), 'withdrawPage')
const selectProId  = r => require.ensure([], () => r(require('../../taskTriggeredRegulation/views/selectProId.vue')), 'selectProId')
Vue.use(Router)
const router = [ 
  {
    path:'',
    redirect:'/regulatoryChangePoints'
  },
  {
    path:'/regulatoryChangePoints',
    name:'regulatoryChangePoints',
    component:regulatoryChangePoints,
    children:[
      {
        path:'editPoint/:id/:caseType',
        name:'editPoint',
        component:editPoint
      }
    ]
  },{
    path:'/spotCheckList/:phase',
    name:'spotCheckList',
    component:spotCheckList
  },{
    path:'/withdrawPage/:id',
    name:'withdrawPage',
    component:withdrawPage
  },{
    path:'/selectProId/:rowIndex',
    name:'selectProId',
    component:selectProId
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
