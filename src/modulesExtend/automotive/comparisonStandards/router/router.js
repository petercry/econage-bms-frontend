import Vue from 'vue'
import Router from 'vue-router'
import {sysEnv} from '../config/env'
import {ENV_ROUTER} from '../../../../forEnv/forEnvRoute.js'

const comparisonStandardsIndex = r => require.ensure([], () => r(require('../views/index.vue')), 'comparisonStandards');
const structuredLIst  = r => require.ensure([], () => r(require('../views/structuredLIst.vue')), 'comparisonStandards');
Vue.use(Router)
const router = [ 
  {
    path:'',
    redirect:'/comparisonStandardsIndex'
  },
  {
    path:'/comparisonStandardsIndex',
    name:'comparisonStandardsIndex',
    component:comparisonStandardsIndex
  },{
    path:'/structuredLIst/:idType',
    name:'structuredLIst',
    component:structuredLIst
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
