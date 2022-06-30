import Vue from 'vue'
import Router from 'vue-router'
import {sysEnv} from '../config/env'
import {ENV_ROUTER} from '../../../../forEnv/forEnvRoute.js'

const index = r => require.ensure([], () => r(require('../views/index.vue')), 'recurrencePreventionList');
const editPage = r => require.ensure([], () => r(require('../views/edit.vue')), 'editPage');
// const test = r => require.ensure([], () => r(require('../views/test.vue')), 'editPage');
const withdrawPage = r => require.ensure([], () => r(require('../views/withdrawPage.vue')), 'withdrawPage');
const appropeUser = r => require.ensure([], () => r(require('../views/appropeUser.vue')), 'appropeUser');

const historyList = r => require.ensure([], () => r(require('../views/historyList.vue')), 'historyList')
const flowHistory = r => require.ensure([], () => r(require('../views/flowHistory.vue')), 'historyList')

const regulatoryForm = r => require.ensure([], () => r(require('../views/regulatoryForm.vue')), 'regulatoryFormList')


Vue.use(Router)
const router = [ 
  {
    path:'',
    redirect:'/index/organization'
    // redirect:'/test'
  },
  {
    path:'/index/:pageType',
    name:'index',
    component:index
  },{
    path:'/editPage/:id/:caseType/:fromPage',
    name:'editPage',
    component:editPage
  },{
    path:'/withdrawPage',
    name:'withdrawPage',
    component:withdrawPage    
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
  },{
    path:'/regulatoryFormList',
    name:'regulatoryFormList',
    component:regulatoryForm
  }
  // ,{
  //   path:'/test',
  //   name:'test',
  //   component:test
  // }
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
