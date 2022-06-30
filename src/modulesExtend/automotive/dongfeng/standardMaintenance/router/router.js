import Vue from 'vue'
import Router from 'vue-router'


const standardIndex = r => require.ensure([], () => r(require('../views/standardIndex.vue')), 'standard')
//新增
const standardAdd = r => require.ensure([], () => r(require('../views/standardAdd.vue')), 'standard')

//查看界面
const standardDetails = r => require.ensure([], () => r(require('../views/standardDetails.vue')), 'standard')
//批量上传
const standarduploadMult = r => require.ensure([], () => r(require('../views/standarduploadMult.vue')), 'standard')

//体系码
const selectSystemCode = r => require.ensure([], () => r(require('../views/selectSystemCode.vue')), 'standard')

const knowLedgeIndex = r => require.ensure([], () => r(require('../views/knowLedgeIndex.vue')), 'knowLedgeIndex');
const knowLibDetail = r => require.ensure([], () => r(require('../views/knowLibDetail.vue')), 'knowLibDetail');


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
      redirect: '/standardIndex'
    },
    {
      path: '/standardIndex',
      name: 'standardIndex',
      component: standardIndex,
    },
    {
      path: '/standardAdd/:id?',
      name: 'standardAdd',
      component: standardAdd,
    },
    {
      path: '/standardDetails/:id?',
      name: 'standardDetails',
      component: standardDetails,
    },
    {
      path: '/standarduploadMult',
      name: 'standarduploadMult',
      component: standarduploadMult,
    },
    {
      path: '/selectSystemCode',
      name: 'selectSystemCode',
      component: selectSystemCode,
    },
    {
      path: '/knowLedgeIndex',
      name: 'knowLedgeIndex',
      component: knowLedgeIndex,
      meta: { title: '一级' },
      children: [
        {
          path: 'knowLibDetail/:id/:category',
          name: 'knowLibDetail',
          component: knowLibDetail,
          meta: { title: '二级' }
        }
      ]
    }
  ]
})
