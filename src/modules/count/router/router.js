import Vue from 'vue'
import Router from 'vue-router'

const chart1 = r => require.ensure([], () => r(require('../views/chart1/home.vue')), 'chart1')
const chart2 = r => require.ensure([], () => r(require('../views/chart2/home.vue')), 'chart2')

Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
      {
        path:'',
        redirect:'/chart1'
      },
     
      {
        path:'/chart1',
        name:'chart1',
        component:chart1,
      },
      {
        path:'/chart2',
        name:'chart2',
        component:chart2,
      }
  ],

})
