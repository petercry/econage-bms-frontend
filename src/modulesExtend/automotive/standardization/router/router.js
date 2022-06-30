import Vue from 'vue'
import Router from 'vue-router'
import {sysEnv} from '../config/env'
import {ENV_ROUTER} from '../../../../forEnv/forEnvRoute.js'

const managementMethods = r => require.ensure([], () => r(require('../../standardization/views/managementMethods.vue')), 'managementMethods')
const editManagement = r => require.ensure([], () => r(require('../views/compontent/editManagement.vue')), 'managementMethods')
const workingGroupSummary = r => require.ensure([], () => r(require('../views/workingGroupSummary.vue')), 'workingGroupSummary')
const editWorkingGroup = r => require.ensure([], () => r(require('../views/compontent/editWorkingGroup.vue')), 'workingGroupSummary')
const committeeSummary = r => require.ensure([], () => r(require('../views/committeeSummary.vue')), 'committeeSummary')
const editCommitteeSummary = r => require.ensure([], () => r(require('../views/compontent/editCommitteeSummary.vue')), 'committeeSummary')

Vue.use(Router)
const router=[
  {
    path:'',
    redirect:'/managementMethods'
  },
  {
    path:'/managementMethods',
    name:'managementMethods',
    component:managementMethods,
  },{
    path:'/editManagement/:id/:caseType',
    name:'editManagement',
    component:editManagement
  },{
    path:'/workingGroupSummary',
    name:'workingGroupSummary',
    component:workingGroupSummary
  },{
    path:'/editWorkingGroup/:id/:caseType',
    name:'editWorkingGroup',
    component:editWorkingGroup
  },{
    path:'/committeeSummary',
    name:'committeeSummary',
    component:committeeSummary
  },{
    path:'/editCommitteeSummary/:id/:caseType',
    name:'editCommitteeSummary',
    component:editCommitteeSummary
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
