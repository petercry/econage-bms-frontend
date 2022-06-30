import Vue from 'vue'
import Router from 'vue-router'
import {sysEnv} from '../config/env'
import {ENV_ROUTER} from '../../../../forEnv/forEnvRoute.js'

const certificateIndex = r => require.ensure([], () => r(require('../../certificateManagement/views/index.vue')), 'certificateList')
const editcertificate = r => require.ensure([], () => r(require('../views/editcertificate.vue')), 'certificateList')
Vue.use(Router)
const router = [ 
  {
    path:'',
    redirect:'/certificateIndex'
  },
  {
    path:'/certificateIndex',
    name:'certificateIndex',
    component:certificateIndex
  },{
    path:'/editcertificate/:id/:caseType',
    name:'editcertificate',
    component:editcertificate
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
