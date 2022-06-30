import Vue from 'vue'
import Router from 'vue-router'

import {sysEnv} from '../config/env'
import {ENV_ROUTER} from '../../../forEnv/forEnvRoute.js'

/*


Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
    {
      path:'',
      redirect:'/mmmForProject'
    },
    {
      path:'/mmmForProject',
      name:'mmmForProject',
      component:mmmForProject
    } 
  ],

})

/*

Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
    {
      path:'',
      redirect:'/mmmForProduct'
    },
    {
      path:'/mmmForProduct',
      name:'mmmForProduct',
      component:mmmForProduct
    } 
  ],

})
*/


/*


Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
    {
      path:'',
      redirect:'/mmmForTeam'
    },
    {
      path:'/mmmForTeam',
      name:'mmmForTeam',
      component:mmmForTeam
    } 
  ],

})
*/
const mmmForProject = r => require.ensure([], () => r(require('../views/mmmForProject.vue')), 'common')
const mmmForProduct = r => require.ensure([], () => r(require('../views/mmmForProduct.vue')), 'common')
const mmmForTeam = r => require.ensure([], () => r(require('../views/mmmForTeam.vue')), 'common')
const mmmCalendar = r => require.ensure([], () => r(require('../views/mmmCalendar.vue')), 'common')
const requireList = r => require.ensure([], () => r(require('../views/requireList.vue')), 'common')
const taskList = r => require.ensure([], () => r(require('../views/taskList.vue')), 'common')

Vue.use(Router)
const router = [
  {
    path:'',
    redirect:'/mmmCalendar/forPersonal'
  },
  {
    path:'/mmmCalendar/:pageViewFlagProp',
    name:'mmmCalendar',
    component:mmmCalendar
  },
  {
    path:'/mmmForProduct/:productIdProp?',
    name:'mmmForProduct',
    component:mmmForProduct
  } ,
  {
    path:'/mmmForProject',
    name:'mmmForProject',
    component:mmmForProject
  } ,
  {
    path:'/mmmForTeam',
    name:'mmmForTeam',
    component:mmmForTeam
  } ,
  {
    path:'/requireList/:productIdProp?',
    name:'requireList',
    component:requireList
  } ,
  {
    path:'/taskList',
    name:'taskList',
    component:taskList
  } 
]
/*
export default new Router({
  mode:'hash',
  routes: [
    {
      path:'',
      redirect:'/mmmCalendar/forPersonal'
    },
    {
      path:'/mmmCalendar/:pageViewFlagProp',
      name:'mmmCalendar',
      component:mmmCalendar
    },
    {
      path:'/mmmForProduct/:productIdProp?',
      name:'mmmForProduct',
      component:mmmForProduct
    } ,
    {
      path:'/mmmForProject',
      name:'mmmForProject',
      component:mmmForProject
    } ,
    {
      path:'/mmmForTeam',
      name:'mmmForTeam',
      component:mmmForTeam
    } ,
    {
      path:'/requireList/:productIdProp?',
      name:'requireList',
      component:requireList
    } ,
    {
      path:'/taskList/:projectIdProp?',
      name:'taskList',
      component:taskList
    } 
  ],

})
*/
export default new Router({
  mode:'hash',
  routes: sysEnv == 1?router:router.concat(ENV_ROUTER)

})