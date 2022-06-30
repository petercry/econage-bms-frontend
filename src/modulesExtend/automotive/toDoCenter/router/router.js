import Vue from 'vue'
import Router from 'vue-router'

const index = r => require.ensure([], () => r(require('../../toDoCenter/views/index.vue')), 'toDoCenter')
const selectProject = r => require.ensure([], () => r(require('../../toDoCenter/views/selectProject.vue')), 'selectProject')
const test = r => require.ensure([], () => r(require('../../toDoCenter/views/test.vue')), 'test')

Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
        {
          path:'',
          redirect:'/index'
        },{
          path:'/index',
          name:'index',
          component:index
        },{
          path:'/selectProject/:id/:typePage',
          name:'selectProject',
          component:selectProject
        },{
          path:'/test',
          name:'test',
          component:test
        },

  ]
})
