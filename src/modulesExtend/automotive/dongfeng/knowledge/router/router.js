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

//知识库
const kmIndex = r => require.ensure([], () => r(require('../views/moudle/knowLedge/kmIndex.vue')), 'kmProect');
//知识库添加
const kmAdd = r => require.ensure([], () => r(require('../views/moudle/kmProject/kmAdd.vue')), 'kmProect');

//通用标准添加
const commonAdd = r => require.ensure([], () => r(require('../views/moudle/toolPage/commonAdd.vue')), 'kmProect');
//外来标准添加
const foreignAdd = r => require.ensure([], () => r(require('../views/moudle/toolPage/foreignAdd.vue')), 'kmProect');
//业务指南添加
const guideAdd = r => require.ensure([], () => r(require('../views/moudle/toolPage/guideAdd.vue')), 'kmProect');
//标准添加
const standardsAdd = r => require.ensure([], () => r(require('../views/moudle/toolPage/standardsAdd.vue')), 'kmProect');
//体系码
const selectSystemCode = r => require.ensure([], () => r(require('../views/moudle/toolPage/selectSystemCode.vue')), 'kmProect')

//预览
const fileContent = r => require.ensure([], () => r(require('../views/moudle/file/fileContent.vue')), 'kmProect')

Vue.use(Router)

Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
      {
        path: '',
        redirect: '/kmIndex'
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
        path:'/knowLibDetail/:id/:type',
        name:'knowLibDetail',
        component:knowLibDetail
      },
      {
        path:'/knowLibInfo/:id',
        name:'knowLibInfo',
        component:knowLibInfo
      },
      {
        path:'/newFolderAdd/:id?/:activeid?',
        name:'newFolderAdd',
        component:newFolderAdd
      },

      {
        path:'/fileUpload/:id?/:activeid?/:type?',
        name:'fileUpload',
        component:fileUpload
      },
      {
        path:'/fileUploadMulti/:id?/:activeid?',
        name:'fileUploadMulti',
        component:fileUploadMulti
      },
      {
        path:'/fileListSort/:id?/:activeid?',
        name:'fileListSort',
        component:fileListSort
      },
      {
        path:'/fileEdit/:id?/:type?',
        name:'fileEdit',
        component:fileEdit
      },
      {
        path:'/folderEdit/:id?',
        name:'folderEdit',
        component:folderEdit
      },

      {
        path:'/fileCard/:id?/:type?/:single?',
        name:'fileCard',
        component:fileCard
      },
      {
        path:'/kmIndex',
        name:'kmIndex',
        component:kmIndex
    },
    {
        path:'/kmAdd',
        name:'kmAdd',
        component:kmAdd
    },
    {
        path:'/commonAdd/:id?/:activeid?',
        name:'commonAdd',
        component:commonAdd
    },
    {
        path:'/foreignAdd/:id?/:activeid?',
        name:'foreignAdd',
        component:foreignAdd
    },
    {
        path:'/guideAdd/:id?/:activeid?',
        name:'guideAdd',
        component:guideAdd
    },
    {
        path:'/standardsAdd/:id?/:activeid?',
        name:'standardsAdd',
        component:standardsAdd
    },
    {
      path:'/selectSystemCode',
      name:'selectSystemCode',
      component:selectSystemCode,
  },
    {
      path:'/fileContent/:fileHeaderId?/:fileName?',
      name:'fileContent',
      component:fileContent,
      props:true
  }
  ],

})
