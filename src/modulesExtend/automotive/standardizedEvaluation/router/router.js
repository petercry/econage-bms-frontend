import Vue from 'vue'
import Router from 'vue-router'

const annualList = r => require.ensure([], () => r(require('../../standardizedEvaluation/views/annualList.vue')), 'standardizedEvaluation')
const addAnnual = r => require.ensure([], () => r(require('../../standardizedEvaluation/views/addAnnual.vue')), 'standardizedEvaluation')
const initialEvaluation = r => require.ensure([], () => r(require('../../standardizedEvaluation/views/achievementEvaluation/initialEvaluation.vue')), 'standardizedEvaluation')
const evaluationConclusion = r => require.ensure([], () => r(require('../../standardizedEvaluation/views/achievementEvaluation/evaluationConclusion.vue')), 'standardizedEvaluation')
const blindtrialGrouping = r => require.ensure([], () => r(require('../../standardizedEvaluation/views/achievementEvaluation/blindtrialGrouping.vue')), 'standardizedEvaluation')
const tabView = r => require.ensure([], () => r(require('../../standardizedEvaluation/views/achievementEvaluation/tabView.vue')), 'standardizedEvaluation')
const createInitList = r => require.ensure([], () => r(require('../../standardizedEvaluation/views/achievementEvaluation/createInitList.vue')), 'standardizedEvaluation')
const srandardInfo = r => require.ensure([], () => r(require('../../standardizedEvaluation/views/achievementEvaluation/srandardInfo.vue')), 'standardizedEvaluation')
const standardAdd = r => require.ensure([], () => r(require('../../standardizedEvaluation/views/achievementEvaluation/standardAdd.vue')), 'standardizedEvaluation')
const getResultAdd = r => require.ensure([], () => r(require('../../standardizedEvaluation/views/achievementEvaluation/getResultAdd.vue')), 'standardizedEvaluation')
const selectGroup = r => require.ensure([], () => r(require('../../standardizedEvaluation/views/achievementEvaluation/selectGroup.vue')), 'standardizedEvaluation')
const addGroup = r => require.ensure([], () => r(require('../../standardizedEvaluation/views/achievementEvaluation/addGroup.vue')), 'standardizedEvaluation')
const judgesWaitList = r => require.ensure([], () => r(require('../../standardizedEvaluation/views/judgesWait/judgesWaitList.vue')), 'standardizedEvaluation')
const judgesScoreList = r => require.ensure([], () => r(require('../../standardizedEvaluation/views/judgesWait/judgesScoreList.vue')), 'standardizedEvaluation')
const declarantFeedbackList = r => require.ensure([], () => r(require('../../standardizedEvaluation/views/declarant/declarantFeedbackList.vue')), 'standardizedEvaluation')
const declarantFeedbackAdd = r => require.ensure([], () => r(require('../../standardizedEvaluation/views/declarant/declarantFeedbackAdd.vue')), 'standardizedEvaluation')
const declarantFeedbackView = r => require.ensure([], () => r(require('../../standardizedEvaluation/views/declarant/declarantFeedbackView.vue')), 'standardizedEvaluation')
const departmentContactList = r => require.ensure([], () => r(require('../../standardizedEvaluation/views/departmentContact/departmentContactList.vue')), 'standardizedEvaluation')
const rejectionDescription = r => require.ensure([], () => r(require('../../standardizedEvaluation/views/departmentContact/rejectionDescription.vue')), 'standardizedEvaluation')
const scientificInnovationRejection = r => require.ensure([], () => r(require('../../standardizedEvaluation/views/scientificInnovation/scientificInnovationRejection.vue')), 'standardizedEvaluation')
const scientificInnovationList = r => require.ensure([], () => r(require('../../standardizedEvaluation/views/scientificInnovation/scientificInnovationList.vue')), 'standardizedEvaluation')
const evaluationConclusionList = r => require.ensure([], () => r(require('../../standardizedEvaluation/views/evaluationConclusion/evaluationConclusionList.vue')), 'standardizedEvaluation')

Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
        {
          path:'',
          redirect:'/annualList'
        },
        {
          path:'/annualList',
          name:'annualList',
          component:annualList,
        },{
          path:'/addAnnual:/id',
          name:'addAnnual',
          component:addAnnual,
        },{
          path:'/tabView',
          name:'tabView',
          component:tabView,
          children: [
            {
              path:'/evaluationConclusion',
              name:'evaluationConclusion',
              component:evaluationConclusion,
            },{
              path:'/blindtrialGrouping',
              name:'blindtrialGrouping',
              component:blindtrialGrouping,
            },{
              path:'/initialEvaluation',
              name:'initialEvaluation',
              component:initialEvaluation,
            },{
              path:'/createInitList',
              name:'createInitList',
              component:createInitList,
            },{
              path:'/srandardInfo:/id',
              name:'srandardInfo',
              component:srandardInfo,
            },{
              path:'/standardAdd',
              name:'standardAdd',
              component:standardAdd,
            },{
              path:'/getResultAdd:/id',
              name:'getResultAdd',
              component:getResultAdd,
            },{
              path:'/selectGroup:/id',
              name:'selectGroup',
              component:selectGroup,
            },{
              path:'/addGroup',
              name:'addGroup',
              component:addGroup,
            },
          ]
        },{
          path:'/judgesWaitList',
          name:'judgesWaitList',
          component:judgesWaitList,
        },{
          path:'/judgesScoreList',
          name:'judgesScoreList',
          component:judgesScoreList,
        },{
          path:'/declarantFeedbackList',
          name:'declarantFeedbackList',
          component:declarantFeedbackList,
        },{
          path:'/declarantFeedbackAdd',
          name:'declarantFeedbackAdd',
          component:declarantFeedbackAdd,
        },{
          path:'/declarantFeedbackView',
          name:'declarantFeedbackView',
          component:declarantFeedbackView,
        },{
          path:'/departmentContactList',
          name:'departmentContactList',
          component:departmentContactList,
        },{
          path:'/rejectionDescription',
          name:'rejectionDescription',
          component:rejectionDescription,
        },{
          path:'/scientificInnovationRejection',
          name:'scientificInnovationRejection',
          component:scientificInnovationRejection,
        },{
          path:'/scientificInnovationList',
          name:'scientificInnovationList',
          component:scientificInnovationList,
        },{
          path:'/evaluationConclusionList',
          name:'evaluationConclusionList',
          component:evaluationConclusionList,
        },
  ]
})
