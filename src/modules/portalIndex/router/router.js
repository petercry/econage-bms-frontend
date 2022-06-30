import Vue from 'vue'
import Router from 'vue-router'


const serviceList = r => require.ensure([], () => r(require('@/modules/portalIndex/views/service/serviceList.vue')), 'portal')
const guidePage = r => require.ensure([], () => r(require('@/modules/portalIndex/views/service/guidePage.vue')), 'portal')
Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
    {
      path:'',
      redirect:'/serviceList'
    },
    {
      path:'/serviceList',
      name:'serviceList',
      component:serviceList
    },
    {
      path:'/guidePage/:id',
      name:'guidePage',
      component:guidePage
    },
  ],

})
