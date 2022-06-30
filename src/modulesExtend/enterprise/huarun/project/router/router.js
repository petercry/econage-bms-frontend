import Vue from 'vue'
import Router from 'vue-router'


const evidenceList = r => require.ensure([], () => r(require('../views/evidence/evidenceList.vue')), 'PRO')
const evidenceAdd = r => require.ensure([], () => r(require('../views/evidence/evidenceAdd.vue')), 'PRO')
const evidenceEdit = r => require.ensure([], () => r(require('../views/evidence/evidenceEdit.vue')), 'PRO')

const regionIndex = r => require.ensure([], () => r(require('../views/region/index.vue')), 'PRO')
const regionDet = r => require.ensure([], () => r(require('../views/region/regionDet.vue')), 'PRO')
const regionAdd = r => require.ensure([], () => r(require('../views/region/regionAdd.vue')), 'PRO')
const regionEdit = r => require.ensure([], () => r(require('../views/region/regionEdit.vue')), 'PRO')

const modelNodeList = r => require.ensure([], () => r(require('../views/modelNode/modelNodeList.vue')), 'PRO')
const modelNodeAdd = r => require.ensure([], () => r(require('../views/modelNode/modelNodeAdd.vue')), 'PRO')
const modelNodeEdit = r => require.ensure([], () => r(require('../views/modelNode/modelNodeEdit.vue')), 'PRO')


const proList = r => require.ensure([], () => r(require('../views/pro/proList.vue')), 'PRO')
const proAdd = r => require.ensure([], () => r(require('../views/pro/proAdd.vue')), 'PRO')
const proEdit = r => require.ensure([], () => r(require('../views/pro/proEdit.vue')), 'PRO')

const tempGraph = r => require.ensure([], () => r(require('../views/graph/temp-index.vue')), 'PRO')
const selectEvidenceList = r => require.ensure([], () => r(require('../views/graph/components/selectEvidenceList.vue')), 'PRO')

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
          redirect:'/proList'
        },

        {
            path:'/evidenceList',
            name:'evidenceList',
            component:evidenceList
        },
        {
            path:'/evidenceAdd',
            name:'evidenceAdd',
            component:evidenceAdd
        },
        {
            path:'/evidenceEdit/:id',
            name:'evidenceEdit',
            component:evidenceEdit
        },
        {
            path:'/regionIndex',
            name:'regionIndex',
            component:regionIndex,
            children:[
                {
                    path:'regionDet/:region/:area',
                    name:'regionDet',
                    component:regionDet
                }
            ]
        },

        {
            path:'/regionAdd/:region',
            name:'regionAdd',
            component:regionAdd
        },

        {
            path:'/regionEdit/:id',
            name:'regionEdit',
            component:regionEdit
        },

        {
            path:'/modelNodeList',
            name:'modelNodeList',
            component:modelNodeList
        },
        {
            path:'/modelNodeAdd',
            name:'modelNodeAdd',
            component:modelNodeAdd
        },
        {
            path:'/modelNodeEdit/:id',
            name:'modelNodeEdit',
            component:modelNodeEdit
        },
        {
            path:'/proList',
            name:'proList',
            component:proList
        },
        {
            path:'/proAdd',
            name:'proAdd',
            component:proAdd
        },
        {
            path:'/proEdit/:id',
            name:'proEdit',
            component:proEdit
        },
        {
            path:'/temp-graph/:modelId',
            name:'tempGraph',
            component:tempGraph
        },
        {
            path:'/selectEvidenceList',
            name:'selectEvidenceList',
            component:selectEvidenceList
        },
  ]
})
