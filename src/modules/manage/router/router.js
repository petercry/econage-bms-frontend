import Vue from 'vue'
import Router from 'vue-router'

const app = r => require.ensure([], () => r(require('@/modules/manage/views/app/index.vue')), 'demo')
const appEdit = r => require.ensure([], () => r(require('@/modules/manage/views/app/edit.vue')), 'demo')

const permissionGroup = r => require.ensure([], () => r(require('@/modules/manage/views/permission-group/index.vue')), 'permissionGroup')
const permissionAdd = r => require.ensure([], () => r(require('@/modules/manage/views/permission-group/add.vue')), 'permissionGroup')
const permissionEdit = r => require.ensure([], () => r(require('@/modules/manage/views/permission-group/edit.vue')), 'permissionGroup')
const permissionEditMember = r => require.ensure([], () => r(require('@/modules/manage/views/permission-group/editMember.vue')), 'permissionGroup')
const permissionEditMenu = r => require.ensure([], () => r(require('@/modules/manage/views/permission-group/editMenu.vue')), 'permissionGroup')
const permissionEditModual = r => require.ensure([], () => r(require('@/modules/manage/views/permission-group/editModual.vue')), 'permissionGroup')


const basicKv = r => require.ensure([], () => r(require('../views/basicKv/index.vue')), 'basicKv')
const basicKvImport = r => require.ensure([], () => r(require('../views/basicKv/import.vue')), 'basicKv')
const basicKvGroupList = r => require.ensure([], () => r(require('../views/basicKv/group/list.vue')), 'basicKv')
const basicKvGroupDetailList = r => require.ensure([], () => r(require('../views/basicKv/detail/list.vue')), 'basicKv')
const basicKvCategoryAdd = r => require.ensure([], () => r(require('../views/basicKv/category/add.vue')), 'basicKv')
const basicKvCategoryEdit = r => require.ensure([], () => r(require('../views/basicKv/category/edit.vue')), 'basicKv')
const basicKvGroupAdd = r => require.ensure([], () => r(require('../views/basicKv/group/add.vue')), 'basicKv')
const basicKvGroupEdit = r => require.ensure([], () => r(require('../views/basicKv/group/edit.vue')), 'basicKv')
const basicKvDetailAdd = r => require.ensure([], () => r(require('../views/basicKv/detail/add.vue')), 'basicKv')
const basicKvDetailEdit = r => require.ensure([], () => r(require('../views/basicKv/detail/edit.vue')), 'basicKv')



const basicData = r => require.ensure([], () => r(require('@/modules/manage/views/basicData/index.vue')), 'basicKv')
const basicDataGroupAdd = r => require.ensure([], () => r(require('@/modules/manage/views/basicData/group/add.vue')), 'basicKv')
const basicDataGroupEdit = r => require.ensure([], () => r(require('@/modules/manage/views/basicData/group/edit.vue')), 'basicKv')
const basicDataGroupList = r => require.ensure([], () => r(require('@/modules/manage/views/basicData/group/list.vue')), 'basicKv')
const basicDataCategoryAdd = r => require.ensure([], () => r(require('@/modules/manage/views/basicData/category/add.vue')), 'basicKv')
const basicDataCategoryEdit = r => require.ensure([], () => r(require('@/modules/manage/views/basicData/category/edit.vue')), 'basicKv')
const basicDataDetailList = r => require.ensure([], () => r(require('@/modules/manage/views/basicData/detail/list.vue')), 'basicKv')
const basicDataDetailAdd = r => require.ensure([], () => r(require('@/modules/manage/views/basicData/detail/add.vue')), 'basicKv')
const basicDataDetailEdit = r => require.ensure([], () => r(require('@/modules/manage/views/basicData/detail/edit.vue')), 'basicKv')


const commonSequence = r => require.ensure([], () => r(require('../views/commonSequence/index.vue')), 'commonSequence')
const commonSequenceAdd = r => require.ensure([], () => r(require('../views/commonSequence/add.vue')), 'commonSequence')
const commonSequenceEdit = r => require.ensure([], () => r(require('../views/commonSequence/edit.vue')), 'commonSequence')


const  treeKv = r => require.ensure([], () => r(require('../views/treeKv/index.vue')), 'treeKv')
const  treeKvAdd = r => require.ensure([], () => r(require('../views/treeKv/treeKvAdd.vue')), 'treeKv')
const  treeKvDet = r => require.ensure([], () => r(require('../views/treeKv/treeKvDet.vue')), 'treeKv')
const  treeKvEdit = r => require.ensure([], () => r(require('../views/treeKv/treeKvEdit.vue')), 'treeKv')
const  treeKvSort = r => require.ensure([], () => r(require('../views/treeKv/treeKvSort.vue')), 'treeKv')


const  personal = r => require.ensure([], () => r(require('../views/personal/index.vue')), 'personal')
const  personalInfo = r => require.ensure([], () => r(require('../views/personal/views/info.vue')), 'personal')
const  personalPassword = r => require.ensure([], () => r(require('../views/personal/views/password.vue')), 'personal')
const  personalFastOpinion = r => require.ensure([], () => r(require('../views/personal/views/fastOpinion.vue')), 'personal')
// const  personalFastOpinionAdd = r => require.ensure([], () => r(require('../views/personal/views/fastOpinionAdd.vue')), 'personal')
// const  personalFastOpinionEdit = r => require.ensure([], () => r(require('../views/personal/views/fastOpinionEdit.vue')), 'personal')
const  personalRemind = r => require.ensure([], () => r(require('../views/personal/views/remind.vue')), 'personal')
const  personalPortalType = r => require.ensure([], () => r(require('../views/personal/views/portalType.vue')), 'personal')


Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
      {
        path:'',
        redirect:'/app'
      },
      {
        path:'/app',
        name:'app',
        component:app,
      },
      {
        path:'/appEdit/:appId',
        name:'appEdit',
        component:appEdit,
      },
      {
        path:'/permissionGroup',
        name:'permissionGroup',
        component:permissionGroup,
      },
      {
        path:'/permissionAdd',
        name:'permissionAdd',
        component:permissionAdd,
      },
      {
        path:'/permissionEdit/:id',
        name:'permissionEdit',
        component:permissionEdit,
      },
      {
        path:'/permissionEditMember/:id',
        name:'permissionEditMember',
        component:permissionEditMember,
      },
      {
        path:'/permissionEditMenu/:id',
        name:'permissionEditMenu',
        component:permissionEditMenu,
      },

      {
        path:'/permissionEditModual/:id',
        name:'permissionEditModual',
        component:permissionEditModual,
      },

      {
          path:'/basicKv',
          name:'basicKv',
          component:basicKv,
          children:[
              {
                  path:'basicKvGroupList/:parentId/:parentName',
                  name:'basicKvGroupList',
                  component:basicKvGroupList,
              },
              {
                  path:'basicKvGroupDetailList/:parentId/:parentName',
                  name:'basicKvGroupDetailList',
                  component:basicKvGroupDetailList
              }
          ]
      },
      {
          path:'/basicKvImport',
          name:'basicKvImport',
          component:basicKvImport
      },
      {
          path:'/basicKvCategoryAdd',
          name:'basicKvCategoryAdd',
          component:basicKvCategoryAdd
      },

      {
          path:'/basicKvCategoryEdit/:key',
          name:'basicKvCategoryEdit',
          component:basicKvCategoryEdit,
      },

      {
        path:'/basicKvGroupAdd/:categoryId',
        name:'basicKvGroupAdd',
        component:basicKvGroupAdd,
      },
      

      {
        path:'/basicKvGroupEdit/:key',
        name:'basicKvGroupEdit',
        component:basicKvGroupEdit,
      },

      
      {
          path:'/basicKvDetailAdd/:group',
          name:'basicKvDetailAdd',
          component:basicKvDetailAdd,
      },

      {
        path:'/basicKvDetailEdit/:key',
        name:'basicKvDetailEdit',
        component:basicKvDetailEdit,
      },



    
      {
        path:'/basicDataAggregatePage',
        name:'basicDataAggregatePage',
        component:basicData,
        children:[
          {
            path:'categoryAdd',
            name:'basicDataCategoryAdd',
            component:basicDataCategoryAdd,
          },
          {
            path:'categoryEdit/:id',
            name:'basicDataCategoryEdit',
            component:basicDataCategoryEdit,
          },
          {
            path:'groupAdd/:categoryId',
            name:'basicDataGroupAdd',
            component:basicDataGroupAdd,
          },
          {
            path:'groupEdit/:id',
            name:'basicDataGroupEdit',
            component:basicDataGroupEdit,
          },
          {
            path:'groupList/:categoryId',
            name:'basicDataGroupList',
            component:basicDataGroupList,
          },
          {
            path:'detailList/:group',
            name:'basicDataDetailList',
            component:basicDataDetailList,
          },
        ]
      },
      {
        path:'/basicDataDetailAdd/:group',
        name:'basicDataDetailAdd',
        component:basicDataDetailAdd,
      },
      {
        path:'/basicDataDetailEdit/:group/:id',
        name:'basicDataDetailEdit',
        component:basicDataDetailEdit,
      },

      {
          path:'/commonSequence',
          name:'commonSequence',
          component:commonSequence,
      },

      {
        path:'/commonSequenceAdd',
        name:'commonSequenceAdd',
        component:commonSequenceAdd,
      },
      {
        path:'/commonSequenceEdit/:id',
        name:'commonSequenceEdit',
        component:commonSequenceEdit,
      },


      {
          path:'/treeKv',
          name:'treeKv',
          component:treeKv,
          children:[
              {
                path:'treeKvDet/:parentId',
                name:'treeKvDet',
                component:treeKvDet,
              }
          ]
      },

      {
          path:'/treeKvAdd/:parentId',
          name:'treeKvAdd',
          component:treeKvAdd
      },

      {
          path:'/treeKvEdit/:id',
          name:'treeKvEdit',
          component:treeKvEdit
      },

      {
        path:'/treeKvSort/:parentId',
        name:'treeKvSort',
        component:treeKvSort
      },

      {
        path:'/personal',
        name:'personal',
        component:personal,
        redirect:'/personalInfo',
        children:[
          {
            path:'/personalInfo',
            name:'personalInfo',
            component:personalInfo,
          },
          {
            path:'/personalPassword',
            name:'personalPassword',
            component:personalPassword,
          },
          {
            path:'/personalRemind',
            name:'personalRemind',
            component:personalRemind,
          },
          {
            path:'/personalFastOpinion',
            name:'personalFastOpinion',
            component:personalFastOpinion,
          },
          {
            path:'/personalPortalType',
            name:'personalPortalType',
            component:personalPortalType,
          },
        ]
      },
      // {
      //     path:'/personalFastOpinionAdd',
      //     name:'personalFastOpinionAdd',
      //     component:personalFastOpinionAdd
      // },
      // {
      //     path:'/personalFastOpinionEdit/:id',
      //     name:'personalFastOpinionEdit',
      //     component:personalFastOpinionEdit
      // },
  ],

})
