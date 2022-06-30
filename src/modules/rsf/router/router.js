import Vue from 'vue'
import Router from 'vue-router'

const noticeList = r => require.ensure([], () => r(require('../views/moudle/notice/noticeList.vue')), 'notice')
const noticesDetail = r => require.ensure([], () => r(require('../views/moudle/notice/noticesDetail.vue')), 'notice')
const noticesAdd = r => require.ensure([], () => r(require('../views/moudle/notice/noticesAdd.vue')), 'notice')
const noticesSuccess = r => require.ensure([], () => r(require('../views/moudle/notice/noticesSuccess.vue')), 'notice')
const noticesListSender = r => require.ensure([], () => r(require('../views/moudle/notice/noticesListSender.vue')), 'notice')
const noticesEdit = r => require.ensure([], () => r(require('../views/moudle/notice/noticesEdit.vue')), 'notice')
const noticesReader = r => require.ensure([], () => r(require('../views/moudle/notice/noticesReader.vue')), 'notice')


Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
      {
        path: '',
        redirect: '/noticeList'
      },
      {
        path:'/noticeList',
        name:'noticeList',
        component:noticeList
      },
      {
        path:'/noticesDetail/:id/:from',
        name:'noticesDetail',
        component:noticesDetail
      },
      {
        path:'/noticesAdd',
        name:'noticesAdd',
        component:noticesAdd
      },
      {
        path:'/noticesSuccess/:id',
        name:'noticesSuccess',
        component:noticesSuccess
      },
      {
        path:'/noticesListSender',
        name:'noticesListSender',
        component:noticesListSender
      },
      {
        path:'/noticesEdit/:id',
        name:'noticesEdit',
        component:noticesEdit
      },
      {
        path:'/noticesReader/:id',
        name:'noticesReader',
        component:noticesReader
      },
  ],

})
