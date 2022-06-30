import Vue from 'vue'
import Router from 'vue-router'

const Root = r => require.ensure([], () => r(require('../Root.vue')), 'Root')
const nonePage = r => require.ensure([], () => r(require('../views/page/nonePage.vue')), 'Root')



Vue.use(Router)

export default new Router({
  mode:'hash',
  routes: [
      {
        path:'/root/:url',
        name:'index',
        component:Root,
        children:[
          {
              path: 'nonePage',
              name:'nonePage',
              component: nonePage
          },
        ]
      },
  ],



})
