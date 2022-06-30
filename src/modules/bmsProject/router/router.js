import Vue from 'vue'
import Router from 'vue-router'

const projectList = r => require.ensure([], () => r(require('../views/projectList.vue')), 'common')
const projectInfo = r => require.ensure([], () => r(require('../views/projectInfo.vue')), 'common')

const taskList = r => require.ensure([], () => r(require('@/modules/bmsMmm/views/taskList.vue')), 'common')
const mmmForProject = r => require.ensure([], () => r(require('@/modules/bmsMmm/views/mmmForProject.vue')), 'common')
const finCompute = r => require.ensure([], () => r(require('../views/finCompute.vue')), 'common')

const partnerExamineList = r => require.ensure([], () => r(require('../views/employeeManage/employeeExamineList.vue')), 'common')

Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
    {
      path:'',
      redirect:'/projectList'
    },
    {
      path:'/projectList',
      name:'projectList',
      component:projectList,
      children:[
        {
          path:'/projectInfo',
          name:'projectInfo',
          components:{
            sideRouterView: projectInfo
          },
          children:[
            {
              path:'taskList',
              name:'taskListInDialog',
              component:taskList
            },
            {
              path:'mmmForProject',
              name:'mmmForProjectInDialog',
              component:mmmForProject
            },
          ],

        }
      ]
    },
    {
      path:'/taskList',
      name:'taskList',
      component:taskList
    },
    {
      path:'/mmmForProject',
      name:'mmmForProject',
      component:mmmForProject
    },
    {
      path:'/finCompute',
      name:'finCompute',
      component:finCompute
    },
    {
      path:'/partnerExamineList',
      name:'partnerExamineList',
      component:partnerExamineList
    }
  ],

})
