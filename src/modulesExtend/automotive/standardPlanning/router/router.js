import Vue from 'vue'
import Router from 'vue-router'

const demo = r => require.ensure([], () => r(require('../../standardPlanning/views/demo.vue')), 'demo')
const confirm = r => require.ensure([], () => r(require('../../standardPlanning/views/confirm.vue')), 'confirm')
const addStandard = r => require.ensure([], () => r(require('../../standardPlanning/views/components/addStandard.vue')), 'addStandard')
const quality = r => require.ensure([], () => r(require('../../standardPlanning/views/components/quality.vue')), 'quality')
const questionDetails = r => require.ensure([], () => r(require('../../standardPlanning/views/components/questionDetails.vue')), 'questionDetails')
const historyComments = r => require.ensure([], () => r(require('../../standardPlanning/views/components/historyComments.vue')), 'historyComments')
const ReexaminationForm = r => require.ensure([], () => r(require('../../standardPlanning/views/components/ReexaminationForm.vue')), 'ReexaminationForm')
const readReexaminationForm = r => require.ensure([], () => r(require('../../standardPlanning/views/components/readReexaminationForm.vue')), 'readReexaminationForm')
const projectList = r => require.ensure([], () => r(require('../../standardPlanning/views/components/projectList.vue')), 'projectList')
const readProjectList = r => require.ensure([], () => r(require('../../standardPlanning/views/components/readProjectList.vue')), 'readProjectList')
const detail = r => require.ensure([], () => r(require('../../standardPlanning/views/components/detail.vue')), 'detail')
const editDetail = r => require.ensure([], () => r(require('../../standardPlanning/views/components/editDetail.vue')), 'editDetail')
const conditionEdit = r => require.ensure([], () => r(require('../../standardPlanning/views/components/conditionEdit.vue')), 'conditionEdit')
const officeEdit = r => require.ensure([], () => r(require('../../standardPlanning/views/components/officeEdit.vue')), 'officeEdit')
const selectDeptList = r => require.ensure([], () => r(require('../../standardPlanning/views/components/selectDeptList.vue')), 'selectDeptList')
const detaliDpet = r => require.ensure([], () => r(require('../../standardPlanning/views/components/detaliDpet.vue')), 'detaliDpet')
const selectSystemCode = r => require.ensure([], () => r(require('../../standardPlanning/views/components/selectSystemCode.vue')), 'selectSystemCode')
const linkStatisticsList = r => require.ensure([], () => r(require('../../standardPlanning/views/linkStatisticsList.vue')), 'linkStatisticsList')
const planningQuery = r => require.ensure([], () => r(require('../../standardPlanning/views/planningQuery.vue')), 'linkStatisticplanningQuerysList')
const index = r => require.ensure([], () => r(require('../../standardPlanning/views/index.vue')), 'index')
const treeIndex = r => require.ensure([], () => r(require('../../standardPlanning/views/components/treeIndex.vue')), 'treeIndex')

Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
        {
          path:'',
          redirect:'/demo'
        },
        {
          path:'/treeIndex',
          name:'treeIndex',
          component:treeIndex,
        },
        {
          path:'/index',
          name:'index',
          component:index,
        },
        {
          path:'/demo',
          name:'demo',
          component:demo,
        },
        {
          path:'/confirm',
          name:'confirm',
          component:confirm,
        },
        {
          path:'/addStandard/:phaseId',
          name:'addStandard',
          component:addStandard,
        },
        {
          path:'/quality',
          name:'quality',
          component:quality,
        },
        {
          path:'/questionDetails/:id/:caseType',
          name:'questionDetails',
          component:questionDetails,
        },
        {
          path:'/historyComments/:id',
          name:'historyComments',
          component:historyComments,
        },
        {
          path:'/ReexaminationForm/:id',
          name:'ReexaminationForm',
          component:ReexaminationForm,
        },
        {
          path:'/readReexaminationForm/:id',
          name:'readReexaminationForm',
          component:readReexaminationForm,
        },
        {
          path:'/projectList/:id',
          name:'projectList',
          component:projectList,
        },
        {
          path:'/readProjectList/:id',
          name:'readProjectList',
          component:readProjectList,
        },
        {
          path:'/detail/:id',
          name:'detail',
          component:detail,
        },
        {
          path:'/editDetail/:id',
          name:'editDetail',
          component:editDetail,
        },
        {
          path:'/conditionEdit/:id/:name',
          name:'conditionEdit',
          component:conditionEdit,
        },
        {
          path:'/officeEdit/:id',
          name:'officeEdit',
          component:officeEdit,
        },
        {
          path:'/selectDeptList/:ids/:status',
          name:'selectDeptList',
          component:selectDeptList,
        },
        {
          path:'/detaliDpet/:ids/:phaseId',
          name:'detaliDpet',
          component:detaliDpet,
        },
        {
          path:'/selectSystemCode',
          name:'selectSystemCode',
          component:selectSystemCode,
        },
        {
          path:'/linkStatisticsList',
          name:'linkStatisticsList',
          component:linkStatisticsList,
        },
        {
          path:'/planningQuery',
          name:'planningQuery',
          component:planningQuery,
        },
  ]
})
