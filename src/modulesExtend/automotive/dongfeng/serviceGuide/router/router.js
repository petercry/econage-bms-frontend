import Vue from 'vue'
import Router from 'vue-router'

//业务指南计划首页
const guidePlanIndex = r => require.ensure([], () => r(require('../views/guidePlanIndex.vue')), 'guide')
//业务指南计划详情
const guidePlanDetails = r => require.ensure([], () => r(require('../views/guidePlanDetails.vue')), 'guide')

//业务指南制修订首页
const guideReviseIndex = r => require.ensure([], () => r(require('../views/guideReviseIndex.vue')), 'guide')
//制修订审批
const approvalRevise = r => require.ensure([], () => r(require('../views/approvalRevise.vue')), 'guide')
//业务指南查询与管理
const guideSearch = r => require.ensure([], () => r(require('../views/guideSearch.vue')), 'guide')

const fileContent = r => require.ensure([], () => r(require('../views/fileContent.vue')), 'guide')
//业务指南修改页
const editGudie = r => require.ensure([], () => r(require('../views/editGudie.vue')), 'guide')

const knowLedgeIndex  = r => require.ensure([], () => r(require('../views/knowLedgeIndex.vue')), 'knowLedgeIndex');
const knowLibDetail = r => require.ensure([], () => r(require('../views/knowLibDetail.vue')), 'knowLibDetail');

Vue.use(Router)

const originalPush = Router.prototype.push;
const originalReplace = Router.prototype.replace;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Router.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err)
}

export default new Router({
  mode:'hash',
  routes: [
        {
          path:'',
          redirect:'/guidePlanIndex'
        },
        {
            path:'/guidePlanIndex',
            name:'guidePlanIndex',
            component:guidePlanIndex,
        },
        {
            path:'/guidePlanDetails/:id?',
            name:'guidePlanDetails',
            component:guidePlanDetails,
            props: true
        },
        {
            path:'/approvalRevise',
            name:'approvalRevise',
            component:approvalRevise,
        },
        {
            path:'/guideReviseIndex',
            name:'guideReviseIndex',
            component:guideReviseIndex,
        },
        {
            path:'/guideSearch',
            name:'guideSearch',
            component:guideSearch,
        },
        {
            path:'/editGudie/:id?',
            name:'editGudie',
            component:editGudie,
        },
        {
          path:'/knowLedgeIndex',
          name:'knowLedgeIndex',
          component:knowLedgeIndex,
          meta:{title:'一级'},
          children:[  
            {
              path:'knowLibDetail/:id/:category',
              name:'knowLibDetail',
              component:knowLibDetail,
              meta:{title:'二级'}
            }
          ]
        },
        {
          path:'/fileContent/:fileHeaderId?/:fileName?',
          name:'fileContent',
          component:fileContent,
          props:true
      }
  ]
})
