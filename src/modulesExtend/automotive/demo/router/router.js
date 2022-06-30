import Vue from 'vue'
import Router from 'vue-router'

const demo = r => require.ensure([], () => r(require('../../demo/views/demo.vue')), 'demo')


Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
        {
          path:'',
          redirect:'/demo'
        },
        {
          path:'/demo',
          name:'demo',
          component:demo,
        }  
  ]
})
