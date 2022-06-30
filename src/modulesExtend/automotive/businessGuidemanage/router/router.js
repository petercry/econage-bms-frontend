import Vue from 'vue'
import Router from 'vue-router'
import {sysEnv} from '../config/env'
import {ENV_ROUTER} from '../../../../forEnv/forEnvRoute.js'

const businessGuideIndex = r => require.ensure([], () => r(require('../views/businessGuideIndex.vue')), 'businessGuidemanage')
const editPage  = r => require.ensure([], () => r(require('../views/editPage.vue')), 'businessGuidemanage')
const historyList = r => require.ensure([], () => r(require('../views/historyList.vue')), 'businessGuidemanage')
const withdrawPage = r => require.ensure([], () => r(require('../views/withdrawPage.vue')), 'withdrawPage')
const projectApproval = r => require.ensure([], () => r(require('../views/projectApproval.vue')), 'projectApproval')
const reexaminationSheet = r => require.ensure([], () => r(require('../views/reexaminationSheet.vue')), 'reexaminationSheet')


const businessGuidePlan  = r => require.ensure([], () => r(require('../views/businessGuidePlan/businessGuidePlan.vue')), 'businessGuidePlan')
const planHistoryList = r => require.ensure([], () => r(require('../views/businessGuidePlan/historyList.vue')), 'planHistoryList')
const editPlan  = r => require.ensure([], () => r(require('../views/businessGuidePlan/editPlan.vue')), 'editPlan')

const linkStatisticsList  = r => require.ensure([], () => r(require('../views/linkStatisticsList.vue')), 'linkStatisticsList')
Vue.use(Router)
const router = [ 
  {
    path:'',
    redirect:'/businessGuideIndex'
  },
  {
    path:"/businessGuideIndex",
    name:'businessGuideIndex',
    component:businessGuideIndex
  },{
    path:'/editPage/:id/:caseType/:phase',
    name:'editPage',
    component:editPage
  },{
    path:'/historyList/:id',
    name:'historyList',
    component:historyList
  },{
    path: '/withdrawPage',
    name: 'withdrawPage',
    component: withdrawPage
  },{
    path: "/projectApproval/:id/:caseType",
    name: 'projectApproval',
    component:projectApproval
  },{
    path:'/reexaminationSheet/:id/:caseType',
    name: 'reexaminationSheet',
    component:reexaminationSheet
  },
  {
    path:'/businessGuidePlan',
    name:'businessGuidePlan',
    component: businessGuidePlan
  },{
    path: '/planHistoryList/:id',
    name: 'planHistoryList',
    component: planHistoryList
  },{
    path: '/editPlan/:id/:caseType/:phase',
    name: 'editPlan',
    component: editPlan
  },{
    path:'/linkStatisticsList',
    name:'linkStatisticsList',
    component:linkStatisticsList
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
