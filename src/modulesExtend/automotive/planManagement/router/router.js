import Vue from 'vue'
import Router from 'vue-router'
import {sysEnv} from '../config/env'
import {ENV_ROUTER} from '../../../../forEnv/forEnvRoute.js'

const planManageIndex = r => require.ensure([], () => r(require('../views/planManageIndex.vue')), 'planManagement');
const editPlan = r => require.ensure([], () => r(require('../views/editPlan.vue')), 'planManagement');

const preparationRevision  = r => require.ensure([], () => r(require('../views/preparationRevision.vue')), 'preparationRevision');
const preparationDetails = r => require.ensure([], () => r(require('../views/preparationDetails.vue')), 'preparationRevision');

const knowLedgeIndex  = r => require.ensure([], () => r(require('../views/knowLedgeIndex.vue')), 'knowLedgeIndex');
const knowLibDetail = r => require.ensure([], () => r(require('../views/knowLibDetail.vue')), 'knowLibDetail');

const fileView = r => require.ensure([], () => r(require('../views/components/fileView.vue')), 'fileView');


Vue.use(Router) 
const router = [ 
  {
    path:'',
    redirect:'/planManageIndex'
  },{
    path:'/planManageIndex',
    name:'planManageIndex',
    component:planManageIndex
  },{
    path:'/editPlan/:id/:caseType',
    name:'editPlan',
    component:editPlan
  },{
    path:'/preparationRevision/:pageType',
    name:'preparationRevision',
    component:preparationRevision
  },{
    path:'/preparationDetails/:id',
    name:"preparationDetails",
    component:preparationDetails
  },{
    path:'/knowLedgeIndex',
    name:'knowLedgeIndex',
    component:knowLedgeIndex,
    meta:{title:'一级'},
    children:[  
      {
        path:'knowLibDetail/:id/:category',
        name:'knowLibDetail',
        component:knowLibDetail,
        meta:{title:'二级'}
      }
    ]
  },{
    path:'/fileView/:modularInnerId/:modular',
    name:'fileView',
    component:fileView
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
