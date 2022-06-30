import Vue from 'vue'
import Router from 'vue-router'

const seal = r => require.ensure([], () => r(require('@/modules/sealManage/views/seal/index.vue')), 'sealManage')
const sealListInDept = r => require.ensure([], () => r(require('@/modules/sealManage/views/seal/list.vue')), 'sealManage')
const sealAdd = r => require.ensure([], () => r(require('@/modules/sealManage/views/seal/add.vue')), 'sealManage')
const sealEdit = r => require.ensure([], () => r(require('@/modules/sealManage/views/seal/edit.vue')), 'sealManage')
const sealKg = r => require.ensure([], () => r(require('@/modules/sealManage/views/seal-kg/index.vue')), 'sealManage')
const sealKgListInDept = r => require.ensure([], () => r(require('@/modules/sealManage/views/seal-kg/list.vue')), 'sealManage')
const sealKgAdd = r => require.ensure([], () => r(require('@/modules/sealManage/views/seal-kg/add.vue')), 'sealManage')
const sealKgEdit = r => require.ensure([], () => r(require('@/modules/sealManage/views/seal-kg/edit.vue')), 'sealManage')
const sealTypeList = r => require.ensure([], () => r(require('@/modules/sealManage/views/type/list.vue')), 'sealManage')
const sealTypeListSort = r => require.ensure([], () => r(require('@/modules/sealManage/views/type/sort.vue')), 'sealManage')
const sealTypeAdd = r => require.ensure([], () => r(require('@/modules/sealManage/views/type/add.vue')), 'sealManage')
const sealTypeEdit = r => require.ensure([], () => r(require('@/modules/sealManage/views/type/edit.vue')), 'sealManage')

Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
    {
      path:'',
      redirect:'/sealListInDept/-1'
    },
   
    {
      path:'/seal',
      name:'seal',
      component:seal,
      children:[
        {
          path:'/sealListInDept/:orgId',
          name:'sealListInDept',
          component:sealListInDept
        },
      ]
    },
    {
      path:'/sealAdd/:orgId',
      name:'sealAdd',
      component:sealAdd
    },
    {
      path:'/sealEdit/:id',
      name:'sealEdit',
      component:sealEdit
    },
    {
      path:'/sealTypeList/:orgId',
      name:'sealTypeList',
      component:sealTypeList
    },
    {
      path:'/sealTypeListSort/:orgId',
      name:'sealTypeListSort',
      component:sealTypeListSort
    },
    {
      path:'/sealTypeAdd/:orgId',
      name:'sealTypeAdd',
      component:sealTypeAdd
    },
    {
      path:'/sealTypeEdit/:id',
      name:'sealTypeEdit',
      component:sealTypeEdit
    },

    {
      path:'/sealKg',
      name:'sealKg',
      component:sealKg,
      redirect:'/sealKgListInDept/-1',
      children:[
        {
          path:'/sealKgListInDept/:orgId',
          name:'sealKgListInDept',
          component:sealKgListInDept
        },
      ]
    },
    {
      path:'/sealKgAdd/:orgId',
      name:'sealKgAdd',
      component:sealKgAdd
    },
    {
      path:'/sealKgEdit/:id',
      name:'sealKgEdit',
      component:sealKgEdit
    },
  ],

})
