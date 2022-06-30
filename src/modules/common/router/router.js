import Vue from 'vue'
import Router from 'vue-router'

// const demo = r => require.ensure([], () => r(require('@/modules/demo/views/demo.vue')), 'demo')
const i18nList = r => require.ensure([], () => r(require('@/modules/common/views/i18n/i18nList.vue')), 'common')
const i18nBatch = r => require.ensure([], () => r(require('@/modules/common/views/i18n/i18nBatch.vue')), 'common')
const checkSessionRelogin = r => require.ensure([], () => r(require('../views/checkSession/relogin.vue')), 'common')


Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
    {
      path:'',
      redirect:'/i18nList'
    },
    {
      path:'/i18nList',
      name:'i18nList',
      component:i18nList
    },
    {
      path:'/i18nBatch',
      name:'i18nBatch',
      component:i18nBatch
    },
    {
      path:'/checkSessionRelogin',
      name:'checkSessionRelogin',
      component:checkSessionRelogin,
    }
  ],

})
