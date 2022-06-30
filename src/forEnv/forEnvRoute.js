/*设置默认大小*/
import './main.css'
import Vue from 'vue'
import VueContextMenu from '@xunlei/vue-context-menu'
const Root = r => require.ensure([], () => r(require('../modules/system/Root.vue')), 'Root')

const workPlatform = r => require.ensure([], () => r(require('../modules/system/views/page/workPlatform.vue')), 'sys')

const attachement = r => require.ensure([], () => r(require('../modules/globalServices/views/attachement/ecoAttachement.vue')), 'attachement')

const orgUserSelect = r => require.ensure([], () => r(require('../modules/hr/views/orgUserSelect.vue')), 'userChoose')
const ENV_ROUTER = [{
    path:'/env',
    name:'index',
    component:Root,
    children:[
      {
          path: 'workPlatformForEnv/:routeName',
          name:'workPlatformForEnv',
          component: workPlatform,

      },

    ]
  },
  {
    path:'/env/orgUserSelect/:key',
    name:"orgUserSelect",
    component:orgUserSelect
  },
  {
    path:'/env/attachement/:key',
    name:"attachement",
    component:attachement
  }
]
Vue.use(VueContextMenu);
export{ ENV_ROUTER }
