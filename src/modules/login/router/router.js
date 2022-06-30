import Vue from 'vue'
import Router from 'vue-router'

const login = r => require.ensure([], () => r(require('@/modules/login/views/login.vue')), 'flow')

Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
    {
      path:'',
      redirect:'/login',
    },
    {
      path:'/login',
      name:'login',
      component:login,
    },
    
  ],

})
