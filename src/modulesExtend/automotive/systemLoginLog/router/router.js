import Vue from 'vue'
import Router from 'vue-router'

const logIndex = r => require.ensure([], () => r(require('../views/logIndex.vue')), 'logIndex')


Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
        {
          path:'',
          redirect:'/logIndex'
        },
        {
          path:'/logIndex',
          name:'logIndex',
          component:logIndex,
        }  
  ]
})
