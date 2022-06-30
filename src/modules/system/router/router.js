import Vue from 'vue'
import Router from 'vue-router'

const sysInit = r => require.ensure([], () => r(require('../sysInit.vue')), 'sysInit')

const login = r => require.ensure([], () => r(require('../views/page/login.vue')), 'Root')
const loginQr = r => require.ensure([], () => r(require('../views/page/loginQr.vue')), 'Root')
const Root = r => require.ensure([], () => r(require('../Root.vue')), 'Root')
const wfPortal = r => require.ensure([], () => r(require('../views/page/wfPortal.vue')), 'sys')
const workPlatform = r => require.ensure([], () => r(require('../views/page/workPlatform.vue')), 'sys')

const mainPage = r => require.ensure([], () => r(require('../views/page/mainPage.vue')), 'RootChart')
const oaPage = r => require.ensure([], () => r(require('../views/page/oaPage.vue')), 'RootChart')

const nonePage = r => require.ensure([], () => r(require('../views/page/nonePage.vue')), 'Root')
const iconChoose = r => require.ensure([], () => r(require('../views/page/iconChoose.vue')), 'Root')
const extendPage = r => require.ensure([], () => r(require('../views/page/extendPage.vue')), 'Root')
const controlPage = r => require.ensure([], () => r(require('../views/page/controlPage.vue')), 'Root')
const settingPage = r => require.ensure([], () => r(require('../views/page/settingPage.vue')), 'Root')

const projectList = r => require.ensure([], () => r(require('../views/page/projectList.vue')), 'projectList')
const projectPortal = r => require.ensure([], () => r(require('../views/page/projectPortal/root.vue')), 'projectList')
const projectPortal1 = r => require.ensure([], () => r(require('../views/page/projectPortal/page1.vue')), 'projectList')
const projectPortal2 = r => require.ensure([], () => r(require('../views/page/projectPortal/page2.vue')), 'projectList')
const projectPortal3 = r => require.ensure([], () => r(require('../views/page/projectPortal/page3.vue')), 'projectList')
const projectPortal4 = r => require.ensure([], () => r(require('../views/page/projectPortal/page4.vue')), 'projectList')



const webRoot = r => require.ensure([], () => r(require('../views/webPortal/webRoot.vue')), 'webPortal')
const webPlatform = r => require.ensure([], () => r(require('../views/webPortal/webPlatform.vue')), 'webPortal')
const webMainPage = r => require.ensure([], () => r(require('../views/webPortal/webMainPage.vue')), 'webPortal')
const webNonePage = r => require.ensure([], () => r(require('../views/webPortal/webNonePage.vue')), 'webPortal')
const webSettingPage = r => require.ensure([], () => r(require('../views/webPortal/webSettingPage.vue')), 'webPortal')
const webEcoSettingPage = r => require.ensure([], () => r(require('../views/webPortal/webEcoSettingPage.vue')), 'webPortal')


const adapterPage = r => require.ensure([], () => r(require('../views/page/adapterPage.vue')), 'Root')

Vue.use(Router)

const originalPush = Router.prototype.push;
const originalReplace = Router.prototype.replace;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Router.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err)
}


export default new Router({
  mode:'hash',
  routes: [
      {
        path:'/',
        redirect:'/login'
        //redirect:'/webRoot/webPlatform/webNonePage'
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
                       path:'oaPage',
                       name:'oaPage',
                       component:oaPage
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
                    },
                    {
                        path:'controlPage',
                        name:'controlPage',
                        component:controlPage
                    },
                    {
                        path:'extendPage',
                        name:'extendPage',
                        component:extendPage
                    },
                    {
                        path:'settingPage',
                        name:'settingPage',
                        component:settingPage
                    },
                    {
                      path:'projectList',
                      name:'projectList',
                      component:projectList
                    },
                    {
                      path:'projectPortal',
                      name:'projectPortal',
                      component:projectPortal,
                      children:[
                        {
                          path:'/workPlatform/projectPortal1',
                          name:'projectPortal1',
                          component:projectPortal1
                        },{
                          path:'/workPlatform/projectPortal2',
                          name:'projectPortal2',
                          component:projectPortal2
                        },{
                          path:'/workPlatform/projectPortal3',
                          name:'projectPortal3',
                          component:projectPortal3
                        },{
                          path:'/workPlatform/projectPortal4',
                          name:'projectPortal4',
                          component:projectPortal4
                        }
                      ]
                    },
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
  ]

})
