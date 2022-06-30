import Vue from 'vue'
import Router from 'vue-router'

const knowLedgeList = r => require.ensure([], () => r(require('../views/moudle/knowLedge/index.vue')), 'knowledge')
const knowLibAdd = r => require.ensure([], () => r(require('../views/moudle/knowLedge/knowLibAdd.vue')), 'knowledge')
const knowLibEdit = r => require.ensure([], () => r(require('../views/moudle/knowLedge/knowLibEdit.vue')), 'knowledge')
const knowLibDetail = r => require.ensure([], () => r(require('../views/moudle/knowLedge/knowLibDetail.vue')), 'knowledge')
const knowLibInfo = r => require.ensure([], () => r(require('../views/moudle/knowLedge/knowLibInfo.vue')), 'knowledge')

const newFolderAdd = r => require.ensure([], () => r(require('../views/moudle/toolPage/newFolderAdd.vue')), 'knowledge')

const fileUpload = r => require.ensure([], () => r(require('../views/moudle/toolPage/fileUpload.vue')), 'knowledge')

const fileUploadMulti = r => require.ensure([], () => r(require('../views/moudle/toolPage/fileUploadMulti.vue')), 'knowledge')
const fileListSort = r => require.ensure([], () => r(require('../views/moudle/toolPage/fileListSort.vue')), 'knowledge')

const fileEdit = r => require.ensure([], () => r(require('../views/moudle/toolPage/fileEdit.vue')), 'knowledge')

const folderEdit = r => require.ensure([], () => r(require('../views/moudle/toolPage/folderEdit.vue')), 'knowledge')

const fileCard = r => require.ensure([], () => r(require('../views/moudle/file/fileCard.vue')), 'knowledge')

Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
      {
        path: '',
        redirect: '/knowLedgeList'
      },
      {
        path:'/knowLedgeList',
        name:'knowLedgeList',
        component:knowLedgeList
      },
      {
        path:'/knowLibAdd',
        name:'knowLibAdd',
        component:knowLibAdd
      },
      {
        path:'/knowLibEdit/:id',
        name:'knowLibEdit',
        component:knowLibEdit
      },
      {
        path:'/knowLibDetail/:id',
        name:'knowLibDetail',
        component:knowLibDetail
      },
      {
        path:'/knowLibInfo/:id',
        name:'knowLibInfo',
        component:knowLibInfo
      },
      {
        path:'/newFolderAdd/:id/:activeid',
        name:'newFolderAdd',
        component:newFolderAdd
      },

      {
        path:'/fileUpload/:id/:activeid',
        name:'fileUpload',
        component:fileUpload
      },
      {
        path:'/fileUploadMulti/:id/:activeid',
        name:'fileUploadMulti',
        component:fileUploadMulti
      },
      {
        path:'/fileListSort/:id/:activeid',
        name:'fileListSort',
        component:fileListSort
      },
      {
        path:'/fileEdit/:id',
        name:'fileEdit',
        component:fileEdit
      },
      {
        path:'/folderEdit/:id',
        name:'folderEdit',
        component:folderEdit
      },

      {
        path:'/fileCard/:id',
        name:'fileCard',
        component:fileCard
      },

  ],

})
