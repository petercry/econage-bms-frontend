import Vue from 'vue'
import Router from 'vue-router'

const config = r => require.ensure([], () => r(require('../views/config.vue')), 'integration')

const addAgent = r => require.ensure([], () => r(require('../views/components/addAgent.vue')), 'integration')

const editAgent = r => require.ensure([], () => r(require('../views/components/editAgent.vue')), 'integration')

Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
      {
        path:'',
        redirect:'/config'
      },
      {
        path:'/config',
        name:'config',
        component:config,
       
      },
      {
        path:'/addAgent',
        name:'addAgent',
        component:addAgent
      },
      {
        path:'/editAgent/:id',
        name:'editAgent',
        component:editAgent
      }
  ],

})
