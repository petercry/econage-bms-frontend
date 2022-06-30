import Vue from 'vue'
import Router from 'vue-router'

const attachement = r => require.ensure([], () => r(require('../views/attachement/ecoAttachement.vue')), 'attachement')

Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
      {
        path:'/',
        name:'root',
        redirect:'/attachement/econage',
      },
      {
        path:'/attachement/:key',
        name:'attachement',
        component:attachement,
      },
  ],

})
