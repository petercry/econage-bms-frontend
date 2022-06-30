import Vue from 'vue'
import Router from 'vue-router'

// const demo = r => require.ensure([], () => r(require('@/modules/demo/views/demo.vue')), 'demo')
const sysmenu = r => require.ensure([], () => r(require('@/modules/menu/views/sysmenu.vue')), 'menu')
const editSysMenu = r => require.ensure([], () => r(require('@/modules/menu/views/sys/editMenu.vue')), 'menu')
const addSysMenu = r => require.ensure([], () => r(require('@/modules/menu/views/sys/addMenu.vue')), 'menu')

Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
    {
      path:'',
      redirect:'/sysmenu'
    },
    {
      path:'/sysmenu',
      name:'sysmenu',
      component:sysmenu,
      children:[
        {
          path:'addSysMenu',
          name:'addSysMenu',
          component:addSysMenu
        },
        {
          path:'editSysMenu/:id',
          name:'editSysMenu',
          component:editSysMenu
        }
      ]
    },
  ],

})
