import Vue from 'vue'
import Router from 'vue-router'

const loginCheck = r => require.ensure([], () => r(require('@/modules/system2/views/page/loginCheck.vue')), 'Root')
const loginQr = r => require.ensure([], () => r(require('@/modules/system2/views/page/loginQr.vue')), 'Root')
const loginDisplay = r => require.ensure([], () => r(require('@/modules/system2/views/page/loginDisplay.vue')), 'Root')
const login = r => require.ensure([], () => r(require('@/modules/system2/views/page/login.vue')), 'Root')
const Root = r => require.ensure([], () => r(require('@/modules/system2/Root.vue')), 'Root')
const mainPage = r => require.ensure([], () => r(require('@/modules/system2/views/page/mainPage.vue')), 'Root')
const nonePage = r => require.ensure([], () => r(require('@/modules/system2/views/page/nonePage.vue')), 'Root')
const iconChoose = r => require.ensure([], () => r(require('@/modules/system2/views/page/iconChoose.vue')), 'Root')

Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
      {
        path:'/',
        redirect:'/login'
      },
      {
        path:'',
        name:'index',
        component:Root,
        children:[
           {
             path: 'mainPage',
             name:'mainPage',
             component: mainPage
           },
          {
              path: 'nonePage',
              name:'nonePage',
              component: nonePage
          }
        ]
      },
      {
        path:'/iconChoose',
        name:'iconChoose',
        component:iconChoose,
      },
      {
        path:'/login',
        name:'login',
        component:login
      },
      {
        path:'/loginCheck/:corpId',
        name:'loginCheck',
        component:loginCheck
      },
      {
        path:'/loginDisplay/:ecoToken',
        name:'loginDisplay',
        component:loginDisplay
      },
      {
        path:'/loginQr',
        name:'loginQr',
        component:loginQr
      }
  ],

})
