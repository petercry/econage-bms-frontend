import Vue from 'vue'
import Router from 'vue-router'

const loginSso = r => require.ensure([], () => r(require('../views/loginSso.vue')), 'loginSso')

Vue.use(Router)
export default new Router({
  mode: 'hash',
  routes: [
    {
      path:'/login-sso/:type',
      name:'loginSso',
      component:loginSso,
    },

  ],

})
