import Vue from 'vue'
import Router from 'vue-router'

const review = r => require.ensure([], () => r(require('../../flowManage/views/infoBase/review/review.vue')), 'infoBase')
const reviewDetail = r => require.ensure([], () => r(require('../../flowManage/views/infoBase/review/reviewDetail.vue')), 'infoBase')
const project = r => require.ensure([], () => r(require('../../flowManage/views/infoBase/project/index.vue')), 'infoBase')
const projectDetail = r => require.ensure([], () => r(require('../../flowManage/views/infoBase/project/detail.vue')), 'infoBase')
const history = r => require.ensure([], () => r(require('../../flowManage/views/infoBase/project/history.vue')), 'infoBase')
const historyDetail = r => require.ensure([], () => r(require('../../flowManage/views/infoBase/project/historyDetail.vue')), 'infoBase')
const file = r => require.ensure([], () => r(require('../../flowManage/views/infoBase/file/index.vue')), 'infoBase')
const dataBase = r => require.ensure([], () => r(require('../../flowManage/views/infoBase/dataBase/index.vue')), 'infoBase')
const dataBaseDetail = r => require.ensure([], () => r(require('../../flowManage/views/infoBase/dataBase/detail.vue')), 'infoBase')


const preViewList = r => require.ensure([], () => r(require('../../flowManage/views/preView/list/index.vue')), 'preView')
const preReviewDetail = r => require.ensure([], () => r(require('../../flowManage/views/preView/list/detail.vue')), 'preView')
const planDeclare = r => require.ensure([], () => r(require('../../flowManage/views/preView/planDeclare/index.vue')), 'preView')
const restart = r => require.ensure([], () => r(require('../../flowManage/views/preView/restart/index.vue')), 'preView')
const resetDialog = r => require.ensure([], () => r(require('../../flowManage/views/preView/restart/resetDialog.vue')), 'preView')

Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
        {
          path:'',
          redirect:'/review'
        },
        {
          path:'/review',
          name:'review',
          component:review,
        },
        {
          path:'/reviewDetail/:id',
          name:'reviewDetail',
          component:reviewDetail,
        },
        {
          path:'/dataBase',
          name:'dataBase',
          component:dataBase,
        },
        {
          path:'/project',
          name:'project',
          component:project,
        },
        {
          path:'/projectDetail/:id',
          name:'projectDetail',
          component:projectDetail,
        },
        {
          path:'/history',
          name:'history',
          component:history,
        },
        {
          path:'/historyDetail/:id',
          name:'historyDetail',
          component:historyDetail,
        },
        {
          path:'/dataBaseDetail/:id',
          name:'dataBaseDetail',
          component:dataBaseDetail,
        },
        {
          path:'/file',
          name:'file',
          component:file,
        },
        {
          path:'/preViewList',
          name:'preViewList',
          component:preViewList,
        },
        {
          path:'/preReviewDetail/:id',
          name:'preReviewDetail',
          component:preReviewDetail,
        },
        {
          path:'/planDeclare',
          name:'planDeclare',
          component:planDeclare,
        },
        {
          path:'/restart',
          name:'restart',
          component:restart,
        },
        {
          path:'/resetDialog',
          name:'resetDialog',
          component:resetDialog,
        },
  ]
})
