import Vue from 'vue'
import Router from 'vue-router'
import {sysEnv} from '../config/env'
import {ENV_ROUTER} from '../../../forEnv/forEnvRoute.js'

const projectList = r => require.ensure([], () => r(require('../views/moudle/project/list.vue')), 'project')
const addOrUpdateProject = r => require.ensure([], () => r(require('../views/moudle/project/addOrUpdateProject.vue')), 'project')
const exportProject = r => require.ensure([], () => r(require('../views/components/exportProject.vue')), 'project')


const majorSetting = r => require.ensure([], () => r(require('../views/moudle/major/index.vue')), 'base')

const addOrUpdateMajor = r => require.ensure([], () => r(require('../views/moudle/major/addOrUpdateMajor.vue')), 'base')
const addOrUpdateMajorType = r => require.ensure([], () => r(require('../views/moudle/major/addOrUpdateMajorType.vue')), 'base')

const roleSetting = r => require.ensure([], () => r(require('../views/moudle/role/index.vue')), 'base')

const addOrUpdateRole = r => require.ensure([], () => r(require('../views/moudle/role/addOrUpdateRole.vue')), 'base')

const addOrUpdateRoleType = r => require.ensure([], () => r(require('../views/moudle/role/addOrUpdateRoleType.vue')), 'base')


const groupSetting = r => require.ensure([], () => r(require('../views/moudle/group/index.vue')), 'base')

const listMain = r => require.ensure([], () => r(require('../views/moudle/group/listMain.vue')), 'base')
const addOrUpdateGroup = r => require.ensure([], () => r(require('../views/moudle/group/addOrUpdateGroup.vue')), 'base')
const addOrUpdateGroupType = r => require.ensure([], () => r(require('../views/moudle/group/addOrUpdateGroupType.vue')), 'base')

const deliverList = r => require.ensure([], () => r(require('../views/moudle/deliver/list.vue')), 'base')
const addOrUpdateDeliver = r => require.ensure([], () => r(require('../views/moudle/deliver/addOrUpdateDeliver.vue')), 'base')

const milesSetting = r => require.ensure([], () => r(require('../views/moudle/miles/index.vue')), 'base')
const addOrUpdateMiles = r => require.ensure([], () => r(require('../views/moudle/miles/addOrUpdateMiles.vue')), 'base')
const milesInfo = r => require.ensure([], () => r(require('../views/moudle/miles/info.vue')), 'base')

const authorityList = r => require.ensure([], () => r(require('../views/moudle/authority/list.vue')), 'base')
const editAuthority = r => require.ensure([], () => r(require('../views/moudle/authority/editAuthority.vue')), 'base')


const templatesList = r => require.ensure([], () => r(require('../views/moudle/templates/list.vue')), 'templates')


const addOrUpdateTemplates = r => require.ensure([], () => r(require('../views/moudle/templates/addOrUpdateTemplates.vue')), 'templates')

const templatesCard = r => require.ensure([], () => r(require('../views/moudle/templates/templatesCard.vue')), 'templates')

const projectCard = r => require.ensure([], () => r(require('../views/moudle/project/projectCard.vue')), 'project')


const problemList = r => require.ensure([], () => r(require('../views/moudle/problem/list.vue')), 'problem')
const addProblem = r => require.ensure([], () => r(require('../views/moudle/problem/addProblem.vue')), 'problem')
const detailProblem = r => require.ensure([], () => r(require('../views/moudle/problem/detailProblem.vue')), 'problem')
const updateProblem = r => require.ensure([], () => r(require('../views/moudle/problem/updateProblem.vue')), 'problem')

const riskList = r => require.ensure([], () => r(require('../views/moudle/risk/list.vue')), 'risk')
const addRisk = r => require.ensure([], () => r(require('../views/moudle/risk/addRisk.vue')), 'risk')
const detailRisk = r => require.ensure([], () => r(require('../views/moudle/risk/detailRisk.vue')), 'risk')
const updateRisk = r => require.ensure([], () => r(require('../views/moudle/risk/updateRisk.vue')), 'risk')

const planSetting = r => require.ensure([], () => r(require('../views/moudle/task/plan/index.vue')), 'task')
const addOrUpdatePlan = r => require.ensure([], () => r(require('../views/moudle/task/plan/addOrUpdatePlan.vue')), 'task')
const planGantt = r => require.ensure([], () => r(require('../views/moudle/task/plan/planGantt.vue')), 'task')
const taskList = r => require.ensure([], () => r(require('../views/moudle/task/taskList.vue')), 'task')
const taskInfo = r => require.ensure([], () => r(require('../views/moudle/task/info.vue')), 'task')
const updateRecord = r => require.ensure([], () => r(require('../views/moudle/task/plan/updateRecord.vue')), 'task')

const roleGroup = r => require.ensure([], () => r(require('../views/moudle/roleGroup/index.vue')), 'roleGroup')
const addRoleGroupForm = r => require.ensure([], () => r(require('../views/moudle/roleGroup/addRoleGroupForm.vue')), 'roleGroup')


const hrInput = r => require.ensure([], () => r(require('../views/moudle/hr/hr-input.vue')), 'hr')


Vue.use(Router)
const router = [
  {
    path: '',
    redirect: '/project-list'
  },
  {
    path:'/project-list',
    name:'project-list',
    component:projectList,
  },
  {
    path:'/addOrUpdateProject/:id',
    name:'addOrUpdateProject',
    component:addOrUpdateProject,
  },
  {
    path:'/majorSetting',
    name:'majorSetting',
    component:majorSetting,
    children:[
      {
        path:'addOrUpdateMajor/:id',
        name:'addOrUpdateMajor',
        component:addOrUpdateMajor,
      },
      {
        path:'addOrUpdateMajorType/:id',
        name:'addOrUpdateMajorType',
        component:addOrUpdateMajorType,
      },
    ]
  },
  {
    path:'/roleSetting',
    name:'roleSetting',
    component:roleSetting,
    children:[
      {
        path:'addOrUpdateRole/:id',
        name:'addOrUpdateRole',
        component:addOrUpdateRole,
      },
      {
        path:'addOrUpdateRoleType/:id',
        name:'addOrUpdateRoleType',

        component:addOrUpdateRoleType,
      },
    ]
  },
  {
    path:'/groupSetting',
    name:'groupSetting',
    component:groupSetting,
    children:[
      {
        path:'addOrUpdateGroup/:id',
        name:'addOrUpdateGroup',
        component:addOrUpdateGroup,
      },
      {
        path:'addOrUpdateGroupType/:id',
        name:'addOrUpdateGroupType',
        component:addOrUpdateGroupType,
      }
    ]
  },
  {
    path:'/deliver-list',
    name:'deliver-list',
    component:deliverList,
  },
  {
    path:'/addOrUpdateDeliver/:id/:moudleId/:moudle',
    name:'addOrUpdateDeliver',
    component:addOrUpdateDeliver,
  },
  {
    path:'/milesSetting',
    name:'milesSetting',
    component:milesSetting,
    children:[
      {
        path:'addOrUpdateMiles/:id',
        name:'addOrUpdateMiles',
        component:addOrUpdateMiles,
      },
    ]
  },
  {
    path:'/authorityList',
    name:'authorityList',
    component:authorityList
  },
  {
    path:'/editAuthority/:roleType/:moudleId/:moudle',
    name:'editAuthority',
    component:editAuthority
  },
  {
    path:'/templates-list',
    name:'templates-list',
    component:templatesList
  },
  {
    path:'/addOrUpdateTemplates/:modelId',
    name:'addOrUpdateTemplates',
    component:addOrUpdateTemplates,
  },
  {
    path:'/templatesCard/:modelId',
    name:'templatesCard',
    component:templatesCard,
    children:[
      {
        path:'addOrUpdateMiles/:id',
        name:'addOrUpdateMilesInCard',
        component:addOrUpdateMiles,
      },
      {
        path:'addOrUpdateMajor/:id',
        name:'addOrUpdateMajorInCard',
        component:addOrUpdateMajor,
      },
      {
        path:'addOrUpdateRole/:id',
        name:'addOrUpdateRoleInCard',
        component:addOrUpdateRole,
      },
      {
        path:'addOrUpdateGroup/:id',
        name:'addOrUpdateGroupInCard',
        component:addOrUpdateGroup,
      },
      {
        path:'addOrUpdateRoleType/:id',
        name:'addOrUpdateRoleTypeInCard',
        component:addOrUpdateRoleType,
      },
      {
        path:'addOrUpdateGroupType/:id',
        name:'addOrUpdateGroupTypeInCard',
        component:addOrUpdateGroupType,
      },
      {
        path:'addOrUpdateMajorType/:id',
        name:'addOrUpdateMajorTypeInCard',
        component:addOrUpdateMajorType,
      },
      {
        path:'addOrUpdatePlan/:id',
        name:'addOrUpdatePlanInCard',
        component:addOrUpdatePlan,
      },
    ]
  },
  {
    path:'/projectCard/:infoId',
    name:'projectCard',
    component:projectCard,
    children:[
      {
        path:'milesInfo',
        name:'milesInfo',
        component:milesInfo,
      },
      {
        path:'milesSetting',
        name:'milesSettingInProjectCard',
        component:milesSetting,
        children:[
          {
            path:'addOrUpdateMiles/:id',
            name:'addOrUpdateMilesInProjectCard',
            component:addOrUpdateMiles,
          },
        ]
      },
      {
        path:'addOrUpdateMajor/:id',
        name:'addOrUpdateMajorInProjectCard',
        component:addOrUpdateMajor,
      },
      {
        path:'addOrUpdateRole/:id',
        name:'addOrUpdateRoleInProjectCard',
        component:addOrUpdateRole,
      },
      {
        path:'addOrUpdateGroup/:id',
        name:'addOrUpdateGroupInProjectCard',
        component:addOrUpdateGroup,
      },
      {
        path:'addOrUpdateRoleType/:id',
        name:'addOrUpdateRoleTypeInProjectCard',
        component:addOrUpdateRoleType,
      },
      {
        path:'addOrUpdateGroupType/:id',
        name:'addOrUpdateGroupTypeInProjectCard',
        component:addOrUpdateGroupType,
      },
      {
        path:'addOrUpdateMajorType/:id',
        name:'addOrUpdateMajorTypeInProjectCard',
        component:addOrUpdateMajorType,
      }
      ,{
        path:'listMain/:id',
        name:'listMain',
        component:listMain
      },
      {
        path:'problem-list/:id',
        name:'problem-list',
        component:problemList,
      },

      {
        path:'detailProblem/:prId',
        name:'detailProblem',
        component:detailProblem,
      },
      {
        path:'risk-list/:id',
        name:'risk-list',
        component:riskList,
      },
      {
        path:'detailRisk/:riskId',
        name:'detailRisk',
        component:detailRisk,
      },
      {
        path:'planGantt',
        name:'planGantt',
        component:planGantt,
      },
      {
        path:'planSetting',
        name:'planSettingInProjectCard',
        component:planSetting,
        children:[
          {
            path:'addOrUpdatePlan/:id/:parentId',
            name:'addOrUpdatePlanInProjectCard',
            component:addOrUpdatePlan,
          },
        ]
      },
      {
        path:'taskList',
        name:'taskListInProjectCard',
        component:taskList,
      },
      {
        path:'taskInfo/:id',
        name:'taskInfoInProjectCard',
        component:taskInfo,
      },
      {
        path:'/hrInput',
        name:'hrInput',
        component:hrInput,
      },
    ],
  },
  {
    path:'/updateProblem/:measureId/:prId',
    name:'updateProblem',
    component:updateProblem,
  },
  {
    path:'/addProblem/:infoId',
    name:'addProblem',
    component:addProblem,
  },
  {
    path:'/updateRisk/:measureId/:riskId',
    name:'updateRisk',
    component:updateRisk,
  },
  {
    path:'/addRisk/:infoId',
    name:'addRisk',
    component:addRisk,
  },
  {
    path:'/planSetting',
    name:'planSetting',
    component:planSetting,
    children:[
      {
        path:'addOrUpdatePlan/:id/:parentId',
        name:'addOrUpdatePlan',
        component:addOrUpdatePlan,
      },
    ]
  },
  {
    path:'/addOrUpdatePlan/:id/:parentId',
    name:'addOrUpdatePlanDialog',
    component:addOrUpdatePlan,
  },
  {
    path:'/exportProject/:flag/:infoId',
    name:'exportProject',
    component:exportProject,
  },
  {
    path:'/taskList',
    name:'taskList',
    component:taskList,
  },
  {
    path:'/updateRecord/:id',
    name:'updateRecord',
    component:updateRecord,
  },
  {
    path:'/roleGroup',
    name:'roleGroup',
    component:roleGroup,
  },
  {
    path:'/addRoleGroupForm',
    name:'addRoleGroupForm',
    component:addRoleGroupForm,
  },

];
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Router.prototype.replace = function replace(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  mode:'hash',
  routes: sysEnv == 1?router:router.concat(ENV_ROUTER)

})
