import Vue from 'vue'
import Router from 'vue-router'

//问题管理首页
const problemIndex = r => require.ensure([], () => r(require('../views/problemIndex.vue')), 'problem')


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
      redirect: '/problemIndex'
    },
    {
      path: '/problemIndex',
      name: 'problemIndex',
      component: problemIndex,
    }



  ]
})
