import Vue from 'vue'
import Router from 'vue-router'

const roomList = r => require.ensure([], () => r(require('@/modules/meeting/views/meetingRoom/roomList.vue')), 'meetingRoom')
const roomAdd = r => require.ensure([], () => r(require('@/modules/meeting/views/meetingRoom/roomAdd.vue')), 'meetingRoom')
const roomEdit = r => require.ensure([], () => r(require('@/modules/meeting/views/meetingRoom/roomEdit.vue')), 'meetingRoom')
const roomAvaiableSelectList = r => require.ensure([], () => r(require('@/modules/meeting/views/meetingRoom/roomAvaiableSelectList.vue')), 'meetingRoom')

const meetingList = r => require.ensure([], () => r(require('@/modules/meeting/views/meetingView/meetingList.vue')), 'meetingView')
const meetingAdd = r => require.ensure([], () => r(require('@/modules/meeting/views/meetingView/meetingAdd.vue')), 'meetingView')
const meetingEdit = r => require.ensure([], () => r(require('@/modules/meeting/views/meetingView/meetingEdit.vue')), 'meetingView')
const meetingGraphical = r => require.ensure([], () => r(require('@/modules/meeting/views/meetingView/meetingGraphical.vue')), 'meetingView')
const meetingView = r => require.ensure([], () => r(require('@/modules/meeting/views/meetingView/meetingView.vue')), 'meetingView')






Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
    {
      path:'',
      redirect:'/meetingGraphical'
    },
    {
        path:'/roomList',
        name:'roomList',
        component:roomList
    },
    {
      path:'/roomAvaiableSelectList/:startTime4Available/:endTime4Available/:editId4Available',
      name:'roomAvaiableSelectList',
      component:roomAvaiableSelectList
    },

    {
        path:'/roomAdd',
        name:'roomAdd',
        component:roomAdd
    },
    {
        path:'/roomEdit/:id',
        name:'roomEdit',
        component:roomEdit,
    },
    {
        path:'/meetingList',
        name:'meetingList',
        component:meetingList
    },

    {
        path:'/meetingAdd/:storeKey',
        name:'meetingAdd',
        component:meetingAdd
    },

    {
      path:'/meetingEdit/:id',
      name:'meetingEdit',
      component:meetingEdit
    },

    {
        path:'/meetingGraphical',
        name:'meetingGraphical',
        component:meetingGraphical
    },

    {
        path:'/meetingView/:id',
        name:'meetingView',
        component:meetingView
    }
    
  ],

})
