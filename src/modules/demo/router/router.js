import Vue from 'vue'
import Router from 'vue-router'

const demo = r => require.ensure([], () => r(require('@/modules/demo/views/demo.vue')), 'demo')
const treeAdd = r => require.ensure([], () => r(require('@/modules/demo/views/treeDemo/add.vue')), 'demo')
const treeEdit = r => require.ensure([], () => r(require('@/modules/demo/views/treeDemo/edit.vue')), 'demo')
const commonAdd = r => require.ensure([], () => r(require('@/modules/demo/views/commonDemo/add.vue')), 'demo')
const commonEdit = r => require.ensure([], () => r(require('@/modules/demo/views/commonDemo/edit.vue')), 'demo')


Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
      {
        path:'',
        redirect:'/treedemo'
      },
      {
        path:'/commondemo',
        name:'commondemo',
        component:demo,
      },
      {
        path:'/commonAdd',
        name:'commonAdd',
        component:commonAdd,
      },
      {
        path:'/commonEdit/:id',
        name:'commonEdit',
        component:commonEdit,
      },
      {
        path:'/treedemo',
        name:'treedemo',
        component:demo,
        children:[
          {
            path:'treeAdd/:parentId',
            name:'treeAdd',
            component:treeAdd
          },
          {
            path:'treeEdit/:id',
            name:'treeEdit',
            component:treeEdit
          }
        ]
      },
  ],

})
