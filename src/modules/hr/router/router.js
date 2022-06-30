import Vue from 'vue'
import Router from 'vue-router'

const orgSelect = r => require.ensure([], () => r(require('../views/orgSelect.vue')), 'hr')
const orgUserSelect = r => require.ensure([], () => r(require('../views/orgUserSelect.vue')), 'userChoose')

const deptSelect = r => require.ensure([], () => r(require('../views/dept/select.vue')), 'hr')
const deptManager = r => require.ensure([], () => r(require('../views/dept/manager.vue')), 'hr')
const deptWatcher = r => require.ensure([], () => r(require('../views/dept/watcher.vue')), 'hr')
const dept = r => require.ensure([], () => r(require('../views/dept/index.vue')), 'hr')
const editDept = r => require.ensure([], () => r(require('../views/dept/edit.vue')), 'hr')
const addDept = r => require.ensure([], () => r(require('../views/dept/add.vue')), 'hr')

const userImport = r => require.ensure([], () => r(require('../views/user/import.vue')), 'hr')
const userSelect = r => require.ensure([], () => r(require('../views/user/select.vue')), 'hr')

const user = r => require.ensure([], () => r(require('../views/user/index.vue')), 'hr')
const userListInDept = r => require.ensure([], () => r(require('../views/user/userListInDept.vue')), 'hr')
const userListSearch = r => require.ensure([], () => r(require('../views/user/userListSearch.vue')), 'hr')

const userAdd = r => require.ensure([], () => r(require('../views/user/add.vue')), 'hr')
const userEdit = r => require.ensure([], () => r(require('../views/user/components/baseInfo.vue')), 'hr')

const userRole = r => require.ensure([], () => r(require('../views/user/components/role.vue')), 'hr')
const userRoleAdd = r => require.ensure([], () => r(require('../views/user/components/roleAdd.vue')), 'hr')
const userRoleEdit = r => require.ensure([], () => r(require('../views/user/components/roleEdit.vue')), 'hr')
const userLinkAdd = r => require.ensure([], () => r(require('../views/user/linkAdd.vue')), 'hr')
const userAccountConfig = r => require.ensure([], () => r(require('../views/user/components/accountConfig.vue')), 'hr')

const role = r => require.ensure([], () => r(require('../views/role/index.vue')), 'role')
const roleAdd = r => require.ensure([], () => r(require('../views/role/add.vue')), 'role')
const roleEdit = r => require.ensure([], () => r(require('../views/role/edit.vue')), 'role')
const roleMember = r => require.ensure([], () => r(require('../views/role/member.vue')), 'role')
const roleMemberAdd = r => require.ensure([], () => r(require('../views/role/memberAdd.vue')), 'role')


const userGroup = r => require.ensure([], () => r(require('../views/user-group/index.vue')), 'hr')
const groupAdd = r => require.ensure([], () => r(require('../views/user-group/add.vue')), 'hr')
const groupEdit = r => require.ensure([], () => r(require('../views/user-group/edit.vue')), 'hr')

const groupEditBaseInfo = r => require.ensure([], () => r(require('../views/user-group/editBaseInfo.vue')), 'hr')
const groupEditMember = r => require.ensure([], () => r(require('../views/user-group/editMember.vue')), 'hr')
const groupRoleAdd = r => require.ensure([], () => r(require('../views/user-group/components/roleAdd.vue')), 'hr')
const groupRoleEdit = r => require.ensure([], () => r(require('../views/user-group/components/roleEdit.vue')), 'hr')
const groupMemberAdd = r => require.ensure([], () => r(require('../views/user-group/components/memberAdd.vue')), 'hr')

Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
    {
      path:'',
      redirect:'/role'
    },
    {
      path:'/orgSelect/:selectMulti/:selectType',
      name:'orgSelect',
      component:orgSelect,
    },
    
    {
      path:'/orgUserSelect/:key',
      name:'orgUserSelect',
      component:orgUserSelect,
    },

    {
      path:'/deptSelect/:type',
      name:'deptSelect',
      component:deptSelect,
    },
    {
      path:'/deptManager',
      name:'deptManager',
      component:deptManager,
    },
    {
      path:'/deptWatcher',
      name:'deptWatcher',
      component:deptWatcher,
    },
    {
      path:'/dept',
      name:'dept',
      component:dept,
      children:[
        {
          path:'add/:parentId',
          name:'addDept',
          component:addDept
        },
        {
          path:'edit/:id',
          name:'editDept',
          component:editDept
        }
      ]
    },
    {
      path:'/userSelect/:type',
      name:'userSelect',
      component:userSelect,
    },
    {
      path:'/user',
      name:'user',
      component:user,
      children:[
        {
          path:'userListInDept/:deptId',
          name:'userListInDept',
          component:userListInDept
        },

        {
          path:'userListSearch/:searchKey/:selectAll',
          name:'userListSearch',
          component:userListSearch
        },

        {
          path:'userAdd/:deptId',
          name:'userAdd',
          component:userAdd
        },
        {
          path:'userEdit/:userId/:deptId/:type',
          name:'userEdit',
          component:userEdit
        },
        {
          path:'userRole/:userId/:deptId/:type',
          name:'userRole',
          component:userRole

        }

      ]
    },
    {
      path:'/userImport',
      name:'userImport',
      component:userImport
    },
    {
      path:'/userLinkAdd/:deptId',
      name:'userLinkAdd',
      component:userLinkAdd
    },
    
    {
      path:'/userAccountConfig/:userId',
      name:'userAccountConfig',
      component:userAccountConfig
    },

    {
      path:'/userRoleAdd/:userId/:deptId',
      name:'userRoleAdd',
      component:userRoleAdd
    },
    {
      path:'/userRoleEdit/:userId/:id',
      name:'userRoleEdit',
      component:userRoleEdit
    },
    {
      path:'/role',
      name:'role',
      component:role,
    },
    {
      path:'/roleAdd/:type',
      name:'roleAdd',
      component:roleAdd,
    },
    {
      path:'/roleEdit/:code',
      name:'roleEdit',
      component:roleEdit,
    },

    {
        path:'/roleMember/:roleCode/:roleType/:roleName',
        name:'roleMember',
        component:roleMember,
    },

    {
        path:'/roleMemberAdd/:roleCode/:roleType/:roleName',
        name:'roleMemberAdd',
        component:roleMemberAdd,
    },

    {
      path:'/userGroup',
      name:'userGroup',
      component:userGroup,
    },
    {
      path:'/groupAdd',
      name:'groupAdd',
      component:groupAdd,
    },
    {
        path:'/groupEdit/:id',
        name:'groupEdit',
        component:groupEdit,
    },

    {
      path:'/groupEditBaseInfo/:id',
      name:'groupEditBaseInfo',
      component:groupEditBaseInfo,
    },

    {
      path:'/groupEditMember/:id',
      name:'groupEditMember',
      component:groupEditMember,
    },


    {
      path:'/groupRoleAdd/:id',
      name:'groupRoleAdd',
      component:groupRoleAdd
    },
    {
      path:'/groupRoleEdit/:id/:orgRoleId',
      name:'groupRoleEdit',
      component:groupRoleEdit
    },
    {
      path:'/groupMemberAdd/:id',
      name:'groupMemberAdd',
      component:groupMemberAdd
    },
  ],

})
