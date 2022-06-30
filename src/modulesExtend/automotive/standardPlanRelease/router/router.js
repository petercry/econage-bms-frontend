import Vue from 'vue'
import Router from 'vue-router'
import {sysEnv} from '../config/env'
import {ENV_ROUTER} from '../../../../forEnv/forEnvRoute.js'

const planIndex = r => require.ensure([], () => r(require('../views/planIndex.vue')), 'standardPlanRelease');
const editPlanPage = r => require.ensure([], () => r(require('../views/editPlanPage.vue')), 'editPlanPage');
const editSubcommittee = r => require.ensure([], () => r(require('../views/editSubcommittee.vue')), 'editSubcommittee');
const subcommitteeList = r => require.ensure([], () => r(require('../views/subcommitteeList.vue')), 'subcommitteeList');
const approveHistory = r => require.ensure([], () => r(require('../views/approveHistory.vue')), 'approveHistory');
const deptLiaisionProof = r => require.ensure([], () => r(require('../views/deptLiaisionProof.vue')), 'deptLiaisionProof');
const withdrawPage = r => require.ensure([], () => r(require('../views/withdrawPage.vue')), 'withdrawPage');

const quality = r => require.ensure([], () => r(require('../views/components/quality.vue')), 'quality');
const selectSystemCode  = r => require.ensure([], () => r(require('../views/components/selectSystemCode.vue')), 'selectSystemCode');
Vue.use(Router) 
const router = [ 
  {
    path:'',
    redirect:'/planIndex'
  },
  ,{
    path:'/planIndex',
    name:'planIndex',
    component:planIndex
  },{
    path:'/editPlanPage/:id/:caseType/:phaseId',
    name:'editPlanPage',
    component:editPlanPage
  },{
    path:'/subcommitteeList/:isOpenDia',
    name:'subcommitteeList',
    component:subcommitteeList
  },{
    path:'/editSubcommittee/:id/:caseType',
    name:'editSubcommittee',
    component:editSubcommittee
  },{
    path:'/approveHistory/:programId',
    name:'approveHistory',
    component:approveHistory
  },{
    path:'/deptLiaisionProof',
    name:'deptLiaisionProof',
    component:deptLiaisionProof
  },{
    path:'/withdrawPage/:state/:ids',
    name:'withdrawPage',
    component:withdrawPage
  },{
    path:'/quality',
    name:'quality',
    component:quality
  },{
      path:'/selectSystemCode',
      name:'selectSystemCode',
      component:selectSystemCode
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
