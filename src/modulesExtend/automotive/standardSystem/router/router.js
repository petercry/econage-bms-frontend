import Vue from 'vue'
import Router from 'vue-router'

const excellenceSystem = r => require.ensure([], () => r(require('../../standardSystem/views/excellenceSystem.vue')), 'standardSystem')
const technicalStandard = r => require.ensure([], () => r(require('../../standardSystem/views/technicalStandard.vue')), 'standardSystem')

Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
        {
          path:'',
          redirect:'/excellenceSystem'
        },
        {
          path:'/excellenceSystem',
          name:'excellenceSystem',
          component:excellenceSystem,
        },
        {
          path:'/technicalStandard',
          name:'technicalStandard',
          component:technicalStandard,
        }
  ]
})
