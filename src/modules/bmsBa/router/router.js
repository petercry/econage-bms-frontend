import Vue from 'vue'
import Router from 'vue-router'
import {sysEnv} from '@/modules/bmsMmm/config/env'
import {ENV_ROUTER} from '../../../forEnv/forEnvRoute.js'
const baList = r => require.ensure([], () => r(require('../views/baList.vue')), 'common')
const baInfo = r => require.ensure([], () => r(require('../views/baInfo.vue')), 'common')
const bizOppoPanel = r => require.ensure([], () => r(require('../views/bizOppoPanel.vue')), 'common')
const router = [
  {
    path:'',
    redirect:'/baList'
  },
  {
    path:'/baList',
    name:'baList',
    component:baList,
    children:[
      {
        path:'/baInfo',
        name:'baInfo',
        components:{
          sideRouterView: baInfo
        }
      }
    ]
  },
  {
    path:'/bizOppoPanel',
    name:'bizOppoPanel',
    component:bizOppoPanel,
  }
]

Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: sysEnv == 1?router:router.concat(ENV_ROUTER)

})
