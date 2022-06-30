import Vue from 'vue'
import Router from 'vue-router'

const index = r => require.ensure([], () => r(require('../../standardPortal/views/index.vue')), 'standardPortal')
const portalIndex  = r => require.ensure([], () => r(require('../../standardPortal/views/page/portalIndex.vue')), 'portalIndex')
Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
        {
          path:'',
          redirect:'/index'
        },
        {
          path:'/index',
          name:'index',
          component:index,
          children:[
            {
              path:'portalIndex',
              name:'portalIndex',
              component:portalIndex
            }
          ]
        }

  ]
})
