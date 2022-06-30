import Vue from 'vue'
import Router from 'vue-router'

const excellenceSystem = r => require.ensure([], () => r(require('../../standardInformationRelease/views/excellenceSystem.vue')), 'standardSystem')
const InformationRelease = r => require.ensure([], () => r(require('../../standardInformationRelease/views/InformationRelease.vue')), 'standardSystem')
const addProcess = r => require.ensure([], () => r(require('../../standardInformationRelease/views/addProcess.vue')), 'standardSystem')
const draftBox = r => require.ensure([], () => r(require('../../standardInformationRelease/views/draftBox.vue')), 'standardSystem')
const InformationExamine = r => require.ensure([], () => r(require('../../standardInformationRelease/views/InformationExamine.vue')), 'standardSystem')
const informationView = r => require.ensure([], () => r(require('../../standardInformationRelease/views/informationView.vue')), 'standardSystem')
const leavMessageExamine = r => require.ensure([], () => r(require('../../standardInformationRelease/views/leavMessageExamine.vue')), 'standardSystem')
const leavMsgBook = r => require.ensure([], () => r(require('../../standardInformationRelease/views/leavMsgBook.vue')), 'standardSystem')
const index = r => require.ensure([], () => r(require('../../standardInformationRelease/views/index.vue')), 'standardSystem')

Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
        {
          path:'',
          redirect:'/InformationRelease'
        },
        {
          path:'/index',
          name:'index',
          component:index,
        },
        {
          path:'/excellenceSystem',
          name:'excellenceSystem',
          component:excellenceSystem,
        },
        {
          path:'/InformationRelease',
          name:'InformationRelease',
          component:InformationRelease  ,
        },
        {
          path:'/addProcess/:id',
          name:'addProcess',
          component:addProcess  ,
        },
        {
          path:'/draftBox',
          name:'draftBox',
          component:draftBox  ,
        },
        {
          path:'/InformationExamine',
          name:'InformationExamine',
          component:InformationExamine  ,
        },
        {
          path:'/informationView/:id',
          name:'informationView',
          component:informationView  ,
        },{
          path:'/leavMessageExamine',
          name:'leavMessageExamine',
          component:leavMessageExamine  ,
        },{
          path:'/leavMsgBook/:id',
          name:'leavMsgBook',
          component:leavMsgBook  ,
        }
  ]
})
