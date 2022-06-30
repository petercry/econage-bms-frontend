import Vue from 'vue'
import Router from 'vue-router'

const taList = r => require.ensure([], () => r(require('@/modules/bmsTalentPool/views/taList.vue')), 'talent')
const taInfo = r => require.ensure([], () => r(require('@/modules/bmsTalentPool/views/taInfo.vue')), 'talent')



Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
      {
        path:'',
        redirect:'/taList'
      },
      {
        path:'/taList',
        name:'taList',
        component:taList,
        children:[
          {
            path:'/taInfo',
            name:'taInfo',
            components:{
              sideRouterView: taInfo
            }
          }
        ]
      },
  ],

})
