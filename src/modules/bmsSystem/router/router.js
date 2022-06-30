import Vue from 'vue'
import Router from 'vue-router'

const sysInit = r => require.ensure([], () => r(require('../sysInit.vue')), 'sysInit')

const login = r => require.ensure([], () => r(require('../views/page/login.vue')), 'Root')
const loginQr = r => require.ensure([], () => r(require('../views/page/loginQr.vue')), 'Root')
const Root = r => require.ensure([], () => r(require('../Root.vue')), 'Root')
const wfPortal = r => require.ensure([], () => r(require('../views/page/wfPortal.vue')), 'sys')
const workPlatform = r => require.ensure([], () => r(require('../views/page/workPlatform.vue')), 'sys')
const mainPage = r => require.ensure([], () => r(require('../views/page/mainPage.vue')), 'Root')
const nonePage = r => require.ensure([], () => r(require('../views/page/nonePage.vue')), 'Root')
const iconChoose = r => require.ensure([], () => r(require('../views/page/iconChoose.vue')), 'Root')
const webRoot = r => require.ensure([], () => r(require('../views/webPortal/webRoot.vue')), 'webPortal')
const webPlatform = r => require.ensure([], () => r(require('../views/webPortal/webPlatform.vue')), 'webPortal')
const webMainPage = r => require.ensure([], () => r(require('../views/webPortal/webMainPage.vue')), 'webPortal')
const webNonePage = r => require.ensure([], () => r(require('../views/webPortal/webNonePage.vue')), 'webPortal')
const webSettingPage = r => require.ensure([], () => r(require('../views/webPortal/webSettingPage.vue')), 'webPortal')
const webEcoSettingPage = r => require.ensure([], () => r(require('../views/webPortal/webEcoSettingPage.vue')), 'webPortal')


const adapterPage = r => require.ensure([], () => r(require('../views/page/adapterPage.vue')), 'Root')

Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
      {
        path:'/',
        redirect:'/login'
      },

      {
        path:'/sysInit',
        name:'sysInit',
        component:sysInit
      },    

      {
        path:'/nonePage',
        name:'adapterPage',
        component:adapterPage,
      },

      {
        path:'',
        name:'index',
        component:Root,
        children:[
          {
              path: 'workPlatform',
              name:'workPlatform',
              component: workPlatform,
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
                    },
                    {
                      path: 'wfPortal',
                      name:'wfPortal',
                      component: wfPortal
                    }
              ]
          },
        ]
      },

      
      {
        path:'/webRoot',
        name:'webRoot',
        component:webRoot,
        children:[
              {
                  path: 'webPlatform',
                  name:'webPlatform',
                  component: webPlatform,
                  children:[
                      {
                          path: 'webMainPage',
                          name:'webMainPage',
                          component: webMainPage
                      },
                      {
                        path: 'webNonePage',
                        name:'webNonePage',
                        component: webNonePage
                      },
                      {
                          path:'webSettingPage',
                          name:'webSettingPage',
                          component:webSettingPage
                      },
                      {
                        path:'webEcoSettingPage',
                        name:'webEcoSettingPage',
                        component:webEcoSettingPage
                    }
                      
                  ]
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
        path:'/loginQr',
        name:'loginQr',
        component:loginQr
      }
  ],

})
