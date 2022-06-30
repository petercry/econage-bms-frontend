import Vue from 'vue'
import Router from 'vue-router'
import {sysEnv} from '../config/env'
import {ENV_ROUTER} from '../../../../forEnv/forEnvRoute.js'

const questionsIndex = r => require.ensure([], () => r(require('../../listofQuestions/views/index.vue')), 'listofQuestions')
const editListQuestions = r => require.ensure([], () => r(require('../../listofQuestions/views/editListQuestions.vue')), 'listofQuestions')
Vue.use(Router)
const router = [ 
  {
    path:'',
    redirect:'/questionsIndex'
  },
  {
    path:'/questionsIndex',
    name:'questionsIndex',
    component:questionsIndex
  },
  {
    path:'/editListQuestions/:id/:caseType',
    name:'editListQuestions',
    component:editListQuestions
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
