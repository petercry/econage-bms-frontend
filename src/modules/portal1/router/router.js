import Vue from 'vue'
import Router from 'vue-router'


const serviceList = r => require.ensure([], () => r(require('@/modules/portal1/views/service/serviceList.vue')), 'portal')
const appList = r => require.ensure([], () => r(require('@/modules/portal1/views/service/appList.vue')), 'portal')
const manageConfig = r => require.ensure([], () => r(require('@/modules/portal1/views/service/manageConfig.vue')), 'portal')
const guidePage = r => require.ensure([], () => r(require('@/modules/portal1/views/service/guidePage.vue')), 'portal')
const groupManage = r => require.ensure([], () => r(require('@/modules/portal1/views/groupManage/index.vue')), 'portal')
  const themeAdd = r => require.ensure([], () => r(require('@/modules/portal1/views/groupManage/pops/themeAdd.vue')), 'portal')
  const themeEdit = r => require.ensure([], () => r(require('@/modules/portal1/views/groupManage/pops/themeEdit.vue')), 'portal')
  const themeSort = r => require.ensure([], () => r(require('@/modules/portal1/views/groupManage/pops/themeSort.vue')), 'portal')
  const groupAdd = r => require.ensure([], () => r(require('@/modules/portal1/views/groupManage/pops/groupAdd.vue')), 'portal')
  const groupEdit = r => require.ensure([], () => r(require('@/modules/portal1/views/groupManage/pops/groupEdit.vue')), 'portal')
  const groupSort = r => require.ensure([], () => r(require('@/modules/portal1/views/groupManage/pops/groupSort.vue')), 'portal')
const subjectManage = r => require.ensure([], () => r(require('@/modules/portal1/views/subjectManage/index.vue')), 'portal')
  const itemAdd = r => require.ensure([], () => r(require('@/modules/portal1/views/subjectManage/pops/add.vue')), 'portal')
  const itemEdit = r => require.ensure([], () => r(require('@/modules/portal1/views/subjectManage/pops/edit.vue')), 'portal')
  const itemSort = r => require.ensure([], () => r(require('@/modules/portal1/views/subjectManage/pops/sort.vue')), 'portal')
  const itemAuthEdit = r => require.ensure([], () => r(require('@/modules/portal1/views/subjectManage/pops/authEdit.vue')), 'portal')
const appManage = r => require.ensure([], () => r(require('@/modules/portal1/views/appManage/index.vue')), 'portal')
  const appAdd = r => require.ensure([], () => r(require('@/modules/portal1/views/appManage/pops/add.vue')), 'portal')
  const appEdit = r => require.ensure([], () => r(require('@/modules/portal1/views/appManage/pops/edit.vue')), 'portal')
const dingManage = r => require.ensure([], () => r(require('@/modules/portal1/views/dingManage/index.vue')), 'portal')
const serviceCount = r => require.ensure([], () => r(require('@/modules/portal1/views/serviceCount/index.vue')), 'portal')
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
    {
      path:'/appList',
      name:'appList',
      component:appList
    },
    {
      path:'/manageConfig',
      name:'manageConfig',
      component:manageConfig
    },
    {
      path:'/groupManage',
      name:'groupManage',
      component:groupManage
    },
        //pops
        {
          path:'/themeAdd',
          name:'themeAdd',
          component:themeAdd
        },
        {
          path:'/themeEdit/:id',
          name:'themeEdit',
          component:themeEdit
        },
        {
          path:'/themeSort',
          name:'themeSort',
          component:themeSort
        },
        {
          path:'/groupAdd/:theme',
          name:'groupAdd',
          component:groupAdd
        },
        {
          path:'/groupEdit/:id',
          name:'groupEdit',
          component:groupEdit
        },
        {
          path:'/groupSort/:theme',
          name:'groupSort',
          component:groupSort
        },
    {
      path:'/appManage',
      name:'appManage',
      component:appManage
    },
      {
        path:'/appAdd',
        name:'appAdd',
        component:appAdd
      },
      {
        path:'/appEdit/:appId',
        name:'appEdit',
        component:appEdit
      },
    {
      path:'/subjectManage',
      name:'subjectManage',
      component:subjectManage
    },
      {
        path:'/itemAdd',
        name:'itemAdd',
        component:itemAdd
      },
      {
        path:'/itemEdit/:id',
        name:'itemEdit',
        component:itemEdit
      },
      {
        path:'/itemSort/:group',
        name:'itemSort',
        component:itemSort
      },
      {
        path:'/itemAuthEdit/:id',
        name:'itemAuthEdit',
        component:itemAuthEdit
      },
    {
      path:'/dingManage',
      name:'dingManage',
      component:dingManage
    },
    {
      path:'/serviceCount',
      name:'serviceCount',
      component:serviceCount
    },
    
  ],

})
