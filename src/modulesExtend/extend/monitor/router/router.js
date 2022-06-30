import Vue from 'vue'
import Router from 'vue-router'

const demo = r => require.ensure([], () => r(require('../../monitor/views/demo.vue')), 'demo')
const performance = r => require.ensure([], () => r(require('../../monitor/views/performance.vue')), 'performance')


Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
        {
          path:'',
          redirect:'/performance'
        },
        {
          path:'/demo',
          name:'demo',
          component:demo,
        },
        {
          path:'/performance',
          name:'performance',
          component:performance,
        }
  ]
})
