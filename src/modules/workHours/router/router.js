import Vue from 'vue'
import Router from 'vue-router'
import {sysEnv} from '../config/env'
import {ENV_ROUTER} from '../../../forEnv/forEnvRoute.js'

const activity = r => require.ensure([], () => r(require('../views/moudle/activity/index.vue')), 'activity')
const addOrUpdateActivity = r => require.ensure([], () => r(require('../views/moudle/activity/addOrUpdateActivity.vue')), 'activity')
const setting = r => require.ensure([], () => r(require('../views/moudle/setting/index.vue')), 'setting')
const addSettingForm = r => require.ensure([], () => r(require('../views/moudle/setting/addSettingForm.vue')), 'setting')
const workHourForInput = r => require.ensure([], () => r(require('../views/moudle/workHours/forInput.vue')), 'workHours')
const workHourForView = r => require.ensure([], () => r(require('../views/moudle/workHours/forView.vue')), 'workHours')

const workHourForViewUser = r => require.ensure([], () => r(require('../views/moudle/workHours/forView-user.vue')), 'workHours')
const workHourForViewProject = r => require.ensure([], () => r(require('../views/moudle/workHours/forView-project.vue')), 'workHours')
const workHourForViewDept = r => require.ensure([], () => r(require('../views/moudle/workHours/forView-dept.vue')), 'workHours')

Vue.use(Router)
const router = [
  {
    path: '',
    redirect: '/workHour-forInput'
  },
  {
    path:'/activity',
    name:'activity',
    component:activity,
    children:[
      {
        path:'addOrUpdateActivity/:id',
        name:'addOrUpdateActivity',
        component:addOrUpdateActivity,
      },

    ]
  },
  {
    path:'/setting',
    name:'setting',
    component:setting
  },
  {
    path:'/addSettingForm',
    name:'addSettingForm',
    component:addSettingForm
  },
  {
    path:'/workHour-forInput',
    name:'workHour-forInput',
    component:workHourForInput
  },
  {
    path:'/workHour-forView',
    name:'workHour-forView',
    component:workHourForView
  },
  {
    path:'/workHour-forView-user/:flag',
    name:'workHour-forView-user',
    component:workHourForViewUser
  },
  {
    path:'/workHour-forView-user-fixed/:flag',
    name:'workHour-forView-user-fixed',
    component:workHourForViewUser
  },
  {
    path:'/workHour-forView-project',
    name:'workHour-forView-project',
    component:workHourForViewProject
  },
  {
    path:'/workHour-forView-dept',
    name:'workHour-forView-dept',
    component:workHourForViewDept
  },

]
window.sysEnv = sysEnv;
const originalPush = Router.prototype.push

Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  mode:'hash',
  routes: sysEnv == 1?router:router.concat(ENV_ROUTER)

})
