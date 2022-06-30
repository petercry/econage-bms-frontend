import Vue from 'vue'
import Router from 'vue-router'

const home = r => require.ensure([], () => r(require('@/modules/schedule/views/index.vue')), 'schedule')
const scheduleEdit = r => require.ensure([], () => r(require('@/modules/schedule/views/edit.vue')), 'schedule')

Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
      {
        path:'',
        redirect:'/home'
      },
      {
        path:'/home',
        name:'home',
        component:home,
      },
      {
        path:'/scheduleEdit',
        name:'scheduleEdit',
        component:scheduleEdit,
      },
     
  ],

})
