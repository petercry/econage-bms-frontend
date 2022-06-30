import Vue from 'vue'
import Router from 'vue-router'
import {sysEnv} from '../config/env'
import {ENV_ROUTER} from '../../../../forEnv/forEnvRoute.js'
const statisticsList = r => require.ensure([], () => r(require('../views/statisticsList.vue')), 'statisticsList');
const editPage = r => require.ensure([], () => r(require('../views/edit.vue')), 'editPage');

const vehicleAnnounceCarList = r => require.ensure([], () => r(require('../views/vehicleAnnounceCarList.vue')), 'vehicleAnnounceCarList');
const editVehicleAnnounceCar = r => require.ensure([], () => r(require('../views/editVehicleAnnounceCar.vue')), 'editVehicleAnnounceCar');
const historyList = r => require.ensure([], () => r(require('../views/historyList.vue')), 'historyList');
const importHistory = r => require.ensure([], () => r(require('../views/importHistory.vue')), 'importHistory');

const editVehicleTypeCertification = r => require.ensure([], () => r(require('../views/editVehicleTypeCertification.vue')), 'editVehicleTypeCertification');

const rectificationManagement = r => require.ensure([], () => r(require('../views/rectificationManagement.vue')), 'rectificationManagementList');
const editManagement = r => require.ensure([], () => r(require('../views/editManagement.vue')), 'editManagement');

const taskMaintenance = r => require.ensure([], () => r(require('../views/spotCheck/taskMaintenance.vue')), 'taskMaintenanceList');

const generateTask = r => require.ensure([], () => r(require('../views/spotCheck/generateTask.vue')), 'generateTask');
const vehicleInfoList = r => require.ensure([], () => r(require('../views/spotCheck/vehicleInfo.vue')), 'vehicleInfoList');

const structuredLIst = r => require.ensure([], () => r(require('../views/spotCheck/structuredLIst.vue')), 'structuredLIst');
const regulatoryForm = r => require.ensure([], () => r(require('../views/spotCheck/regulatoryForm.vue')), 'regulatoryForm');

const certPolicyCodeList = r => require.ensure([], () => r(require('../views/certPolicyCodeList.vue')), 'certPolicyCodeList');

const regulationsModelList = r => require.ensure([], () => r(require('../views/regulationsModelList.vue')), 'regulationsModelList');

const modelregulationsList = r => require.ensure([], () => r(require('../views/modelregulationsList.vue')), 'modelregulationsList');
const editCopingoutcomes = r => require.ensure([], () => r(require('../views/spotCheck/editCopingoutcomes.vue')), 'editCopingoutcomes');

const spotCheckPage = r => require.ensure([], () => r(require('../views/spotCheck/spotCheckPage.vue')), 'spotCheckPage');

const editPage1 = r => require.ensure([], () => r(require('../views/spotCheck/editPage1.vue')), 'editPage1');
const editPage2 = r => require.ensure([], () => r(require('../views/spotCheck/editPage2.vue')), 'editPage2');
const editPage3= r => require.ensure([], () => r(require('../views/spotCheck/editPage3.vue')), 'editPage3');
const editPageDetails=r => require.ensure([], () => r(require('../views/spotCheck/editPageDetails.vue')), 'editPageDetails');

const appropeUser  = r => require.ensure([], () => r(require('../views/appropeUser.vue')), 'appropeUser')
const withdrawPage = r => require.ensure([], () => r(require('../views/withdrawPage.vue')), 'withdrawPage')

const vehicleInfoHistoryList = r => require.ensure([], () => r(require('../views/spotCheck/vehicleInfoHistoryList.vue')), 'vehicleInfoHistoryList')
const vehicleInfoHistoryDetails = r => require.ensure([], () => r(require('../views/spotCheck/vehicleInfoHistoryDetails.vue')), 'vehicleInfoHistoryDetails')
Vue.use(Router)
const router = [
  {  
    path:'',
    // redirect:'/statisticsList'
    redirect:'/taskMaintenanceList'
  },
  {
    path:'/statisticsList',
    name:'statisticsList',
    component:statisticsList,
  },{
    path:'/editPage/:id/:caseType',
    name:'editPage',
    component:editPage
  },{
    path:'/vehicleAnnounceCarList/:isOpenDialog/:pageType',
    name:'vehicleAnnounceCarList',
    component:vehicleAnnounceCarList
  },{
    path:'/editVehicleAnnounceCar/:id/:caseType/:fromPage',
    name:'editVehicleAnnounceCar',
    component:editVehicleAnnounceCar
  },{
    path:'/historyList',
    name:'historyList',
    component:historyList
  },{
    path:'/editVehicleTypeCertification/:id/:caseType',
    name:"editVehicleTypeCertification",
    component:editVehicleTypeCertification
  },{
    path:'/rectificationManagementList/:isOpenDialog',
    name:'rectificationManagement',
    component:rectificationManagement
  },{
    path:'/editManagement/:id/:caseType',
    name:'editManagement',
    component:editManagement
  },{
    path:'/taskMaintenanceList',
    name:'taskMaintenance',
    component:taskMaintenance,
    children:[
      // {
      //   path:'/',
      //   redirect:''
      // },
      {
        path:'generateTask',
        name:'generateTask',
        component:generateTask
      },{
        path:'vehicleInfoList/:standardRegulationNo/:masterId',
        name:'vehicleInfoList',
        component:vehicleInfoList
      },{
        path:'editCopingoutcomes/:id',
        name:'editCopingoutcomes',
        component:editCopingoutcomes
      },{
        path:'spotCheckPage',
        name:'spotCheckPage',
        component:spotCheckPage
      },{
        path:'editPage1/:id',
        name:'editPage1',
        component:editPage1
      }
      ,{
        path:'editPage2/:ids',
        name:'editPage2',
        component:editPage2
      },{
        path:'editPage3/:deptName',
        name:'editPage3',
        component:editPage3
      }
    ]
  },{
    path:'/structuredLIst/:multiple',
    name:'structuredLIst',
    component:structuredLIst
  },{
    path:'/certPolicyCodeList/:id',
    name:'certPolicyCodeList',
    component:certPolicyCodeList
  },{
    path:'/regulationsModelList',
    name:'regulationsModelList',
    component:regulationsModelList
  },{
    path:'/modelregulationsList',
    name:'modelregulationsList',
    component:modelregulationsList
  },{
    path:'/editPageDetails/:id',
    name:'editPageDetails',
    component:editPageDetails
  },{
    path:'/appropeUser',
    name:'appropeUser',
    component:appropeUser
  },{
    path:'/withdrawPage/:caseType',
    name:'withdrawPage',
    component:withdrawPage    
  },{
    path:'/importHistory/:masterId',
    name:'importHistory',
    component:importHistory
  },{
    path:'/regulatoryForm',
    name:'regulatoryForm',
    component:regulatoryForm
  },{
    path:'/vehicleInfoHistoryList/:id',
    name:'vehicleInfoHistoryList',
    component:vehicleInfoHistoryList
  },{
    path:'/vehicleInfoHistoryDetails/:versionId',
    name:'vehicleInfoHistoryDetails',
    component:vehicleInfoHistoryDetails
    
  }
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
