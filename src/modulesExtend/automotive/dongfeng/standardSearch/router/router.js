import Vue from 'vue'
import Router from 'vue-router'

//标准根目录查询
const searchIndex = r => require.ensure([], () => r(require('../views/searchIndex.vue')), 'standardSearch')
//标准全文查询
const allTextSearch = r => require.ensure([], () => r(require('../views/allTextSearch.vue')), 'standardSearch')
//标准全文检索
const searchDetail = r => require.ensure([], () => r(require('../views/searchDetail.vue')), 'standardSearch')
//标准引用图纸查询
const searchDraw = r => require.ensure([], () => r(require('../views/searchDraw.vue')), 'standardSearch')

//标准引用图纸查询
const searchGuide = r => require.ensure([], () => r(require('../views/searchGuide.vue')), 'standardSearch')



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
  mode: 'hash',
  routes: [
    {
      path: '',
      redirect: '/searchIndex'
    },
    {
      path: '/searchIndex',
      name: 'searchIndex',
      component: searchIndex,
    },
    {
      path: '/allTextSearch',
      name: 'allTextSearch',
      component: allTextSearch,
    },
    {
      path: '/searchDetail/:id?',
      name: 'searchDetail',
      component: searchDetail,
    },
    {
      path: '/searchDraw',
      name: 'searchDraw',
      component: searchDraw,
    },
    {
      path: '/searchGuide',
      name: 'searchGuide',
      component: searchGuide,
    },

  ]
})
