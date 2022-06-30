import Vue from 'vue'
import Router from 'vue-router'


const instanceExcelImport = r => require.ensure([], () => r(require('@/modules/portal1Common/views/instance/excelImport.vue')), 'portal1Common')
const instancePrivilege = r => require.ensure([], () => r(require('@/modules/portal1Common/views/instancePrivilege/index.vue')), 'portal1Common')
const instancePrivilegeAdd = r => require.ensure([], () => r(require('@/modules/portal1Common/views/instancePrivilege/add.vue')), 'portal1Common')
const instancePrivilegeEdit = r => require.ensure([], () => r(require('@/modules/portal1Common/views/instancePrivilege/edit.vue')), 'portal1Common')
const instancePrivilegeEditMember = r => require.ensure([], () => r(require('@/modules/portal1Common/views/instancePrivilege/editMember.vue')), 'portal1Common')
const instancePrivilegeEditRole = r => require.ensure([], () => r(require('@/modules/portal1Common/views/instancePrivilege/editRole.vue')), 'portal1Common')
Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
    {
      path:'/instanceExcelImport',
      name:'instanceExcelImport',
      component:instanceExcelImport
    },
    {
      path:'/instancePrivilege',
      name:'instancePrivilege',
      component:instancePrivilege
    },
    {
      path:'/instancePrivilegeAdd',
      name:'instancePrivilegeAdd',
      component:instancePrivilegeAdd
    },
    {
      path:'/instancePrivilegeEdit/:id',
      name:'instancePrivilegeEdit',
      component:instancePrivilegeEdit
    },
    {
      path:'/instancePrivilegeEditMember/:id',
      name:'instancePrivilegeEditMember',
      component:instancePrivilegeEditMember
    },
    {
      path:'/instancePrivilegeEditRole/:id',
      name:'instancePrivilegeEditRole',
      component:instancePrivilegeEditRole
    },
  ],

})
