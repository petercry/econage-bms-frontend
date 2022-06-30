import Vue from 'vue'
import Router from 'vue-router'


const treeIndex = r => require.ensure([], () => r(require('../views/treeIndex.vue')), 'PRO')
const proIndex = r => require.ensure([], () => r(require('../views/proIndex.vue')), 'PRO')

const proBaseInfo = r => require.ensure([], () => r(require('../views/baseInfo/proBaseInfo.vue')), 'baseInfo')
const addProjectBaseInfo = r => require.ensure([], () => r(require('../views/baseInfo/addBaseInfo.vue')), 'baseInfo')
const editProjectBaseInfo = r => require.ensure([], () => r(require('../views/baseInfo/editBaseInfo.vue')), 'baseInfo')
const proBaseInfoHistory = r => require.ensure([], () => r(require('../views/baseInfo/proBaseInfoHistory.vue')), 'baseInfo')


const proMember = r => require.ensure([], () => r(require('../views/member/proMember.vue')), 'member')
const addProjectMember = r => require.ensure([], () => r(require('../views/member/addMember.vue')), 'member')
const editProjectMember = r => require.ensure([], () => r(require('../views/member/editMember.vue')), 'member')
const proMemberHistory = r => require.ensure([], () => r(require('../views/member/proMemberHistory.vue')), 'member')

const proPlanGantt = r => require.ensure([], () => r(require('../views/plan/proPlanGantt.vue')), 'plan')
const proPlanIndex = r => require.ensure([], () => r(require('../views/plan/proPlanIndex.vue')), 'plan')

const proNodeList = r => require.ensure([], () => r(require('../views/plan/proNodeList.vue')), 'plan')
const addProNode = r => require.ensure([], () => r(require('../views/plan/addProNode.vue')), 'plan')
const editProNode = r => require.ensure([], () => r(require('../views/plan/editProNode.vue')), 'plan')

const proPlanList = r => require.ensure([], () => r(require('../views/plan/proPlanList.vue')), 'plan')
const addProPlan = r => require.ensure([], () => r(require('../views/plan/addProPlan.vue')), 'plan')
const editProPlan = r => require.ensure([], () => r(require('../views/plan/editProPlan.vue')), 'plan')
const proPlanProcess = r => require.ensure([], () => r(require('../views/plan/proPlanProcess.vue')), 'plan')

const design = r => require.ensure([], () => r(require('../views/design/design.vue')), 'design')
const taskList = r => require.ensure([], () => r(require('../views/design/taskList.vue')), 'design')
const editTaskList = r => require.ensure([], () => r(require('../views/design/editTaskList.vue')), 'design')
const editLiaison = r => require.ensure([], () => r(require('../views/design/editLiaison.vue')), 'design')
const detailTaskInfo = r => require.ensure([], () => r(require('../views/design/detailTaskInfo.vue')), 'design')
const liaison = r => require.ensure([], () => r(require('../views/design/liaison.vue')), 'design')
const designList = r => require.ensure([], () => r(require('../views/design/designList.vue')), 'design')
const handleStripes = r => require.ensure([], () => r(require('../views/design/handleStripes.vue')), 'design')
const feedback = r => require.ensure([], () => r(require('../views/design/feedback.vue')), 'design')
const handleStripesExamine = r => require.ensure([], () => r(require('../views/design/handleStripesExamine.vue')), 'design')
const departmentHead = r => require.ensure([], () => r(require('../views/design/departmentHead.vue')), 'design')
const DepartmentContact = r => require.ensure([], () => r(require('../views/design/DepartmentContact.vue')), 'design')
const RegulatoryContact = r => require.ensure([], () => r(require('../views/design/RegulatoryContact.vue')), 'design')
const RegulatoryHead = r => require.ensure([], () => r(require('../views/design/RegulatoryHead.vue')), 'design')
const withdrawPage = r => require.ensure([], () => r(require('../views/design/withdrawPage.vue')), 'design')

const flowHistory = r => require.ensure([], () => r(require('../views/design/flowHistory.vue')), 'design')

const realVehicle = r => require.ensure([], () => r(require('../views/realVehicle/realVehicleIndex.vue')), 'realVehicle');
const checkList = r => require.ensure([], () => r(require('../views/realVehicle/checkList.vue')), 'realVehicle');
const editCheck  = r => require.ensure([], () => r(require('../views/realVehicle/editCheck.vue')), 'realVehicle');
const personAudit = r => require.ensure([], () => r(require('../views/realVehicle/personAudit.vue')), 'realVehicle');
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
  mode:'hash',
  routes: [
        {
          path:'',
          redirect:'/treeIndex'
        },
        {
            path:'/treeIndex',
            name:'treeIndex',
            component:treeIndex,
        },
        { 
            path:'/proIndex/:proId',
            name:'proIndex',
            component:proIndex,
            children:[
              {
                  path:'proBaseInfo',
                  name:'proBaseInfo',
                  component:proBaseInfo
              },
              {
                  path:'proMember',
                  name:'proMember',
                  component:proMember
              },

              {
                    path:'proMemberHistory',
                    name:'proMemberHistory',
                    component:proMemberHistory
              },
              {
                  path:'proPlanGantt',
                  name:'proPlanGantt',
                  component:proPlanGantt
              },
              {
                  path:'proPlanIndex',
                  name:'proPlanIndex',
                  component:proPlanIndex,
                  children:[
                        {
                                path:'proNodeList',
                                name:'proNodeList',
                                component:proNodeList
                        },
                        {
                                path:'addProNode',
                                name:'addProNode',
                                component:addProNode
                        },
                        {
                                path:'editProNode/:id',
                                name:'editProNode',
                                component:editProNode
                        },

                        {
                            path:'proPlanList',
                            name:'proPlanList',
                            component:proPlanList
                        },

                        {
                            path:'addProPlan',
                            name:'addProPlan',
                            component:addProPlan
                        },
                        {
                            path:'editProPlan/:id',
                            name:'editProPlan',
                            component:editProPlan
                        }
                  ]
              },
              {
                path:'design',
                name:'design',
                component:design,
                children:[
                    {
                        path:'taskList',
                        name:'taskList',
                        component:taskList
                    },
                    {
                        path:'liaison',
                        name:'liaison',
                        component:liaison
                    },
                    {
                        path:'designList',
                        name:'designList',
                        component:designList
                    },
                    {
                        path:'departmentHead',
                        name:'departmentHead',
                        component:departmentHead
                    },
                    {
                        path:'DepartmentContact',
                        name:'DepartmentContact',
                        component:DepartmentContact
                    },
                    {
                        path:'RegulatoryContact',
                        name:'RegulatoryContact',
                        component:RegulatoryContact
                    },
                    {
                        path:'RegulatoryHead',
                        name:'RegulatoryHead',
                        component:RegulatoryHead
                    },
                ]
              },
              {
                  path:'realVehicle',
                  name:'realVehicle',
                  component:realVehicle,
                  children:[
                     {
                         path:'checkList',
                         name:'checkList',
                         component:checkList
                     },{
                         path:'personAudit',
                         name:'personAudit',
                         component:personAudit
                     }
                  ]
              }
            ]
        },
        {
            path:'/addProjectBaseInfo',
            name:'addProjectBaseInfo',
            component:addProjectBaseInfo,
        },
        {
            path:'/editProjectBaseInfo/:proId',
            name:'editProjectBaseInfo',
            component:editProjectBaseInfo,
        },
        {
            path:'/addProjectMember/:proId',
            name:'addProjectMember',
            component:addProjectMember,
        },
        {
            path:'/editProjectMember/:id',
            name:'editProjectMember',
            component:editProjectMember,
        },
        {
            path:'/proPlanProcess/:id',
            name:'proPlanProcess',
            component:proPlanProcess,
        },
        {
            path:'/editTaskList/:taskId/:stage/:proId',
            name:'editTaskList',
            component:editTaskList,
        },
        {   
            path:'/editLiaison/:taskId/:proId',
            name:'editLiaison',
            component:editLiaison,
        },
        {
            path:'/detailTaskInfo/:taskId',
            name:'detailTaskInfo',
            component:detailTaskInfo,
        },
        {
            path:'/handleStripes/:Id/:proId/:caseType',
            name:'handleStripes',
            component:handleStripes,
        },
        {
            path:'/handleStripesExamine/:Id/:phase/:proId',
            name:'handleStripesExamine',
            component:handleStripesExamine,
        },
        {
            path:'/feedback/:taskId/:caseType',
            name:'feedback',
            component:feedback,
        },
        {
            path:'/editCheck/:id/:caseType',
            name:'editCheck',
            component:editCheck
        },{
            path:'/proBaseInfoHistory/:proId',
            name:'proBaseInfoHistory',
            component:proBaseInfoHistory
        },{
            path:'/withdrawPage/:ids/:phase/:projectId',
            name:'withdrawPage',
            component:withdrawPage
        },{
            path:'/flowHistory/:id',
            name:'flowHistory',
            component:flowHistory
        }
  ]
})
