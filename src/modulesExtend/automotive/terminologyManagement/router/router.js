import Vue from 'vue'
import Router from 'vue-router'
import {sysEnv} from '../config/env'
import {ENV_ROUTER} from '../../../../forEnv/forEnvRoute.js'
const terminologyIndex = r => require.ensure([], () => r(require('../../terminologyManagement/views/index.vue')), 'terminology')
const editTerminlogy = r => require.ensure([], () => r(require('../../terminologyManagement/views/editTerminlogy.vue')), 'terminology')

Vue.use(Router)
const router = [
  {
    path:'',
    redirect:'/terminologyIndex'
  },
  {
    path:'/terminologyIndex',
    name:'terminologyIndex',
    component:terminologyIndex
  },
  {
    path:'/editTerminlogy/:id/:caseType',
    name:'editTerminlogy',
    component:editTerminlogy
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
