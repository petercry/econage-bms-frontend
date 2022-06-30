import Vue from 'vue'
import Router from 'vue-router'


const outSideIndex = r => require.ensure([], () => r(require('../views/outSideIndex.vue')), 'outSide')
//新增
const outSideAdd = r => require.ensure([], () => r(require('../views/outSideAdd.vue')), 'outSide')
//修改
const outSideEdit = r => require.ensure([], () => r(require('../views/outSideEdit.vue')), 'outSide')
//查看界面
const outSideDetails = r => require.ensure([], () => r(require('../views/outSideDetails.vue')), 'outSide')
//批量上传
const outSideuploadMult = r => require.ensure([], () => r(require('../views/outSideuploadMult.vue')), 'outSide')
//自行上传
const myUpload = r => require.ensure([], () => r(require('../views/myUpload.vue')), 'outSide')

//自行上传
const iframe = r => require.ensure([], () => r(require('../views/iframe.vue')), 'outSide')

//体系码
const selectSystemCode = r => require.ensure([], () => r(require('../views/selectSystemCode.vue')), 'outSide')

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
          redirect:'/outSideIndex'
        },
        {
            path:'/outSideIndex',
            name:'outSideIndex',
            component:outSideIndex,
        },
        {
            path:'/outSideAdd',
            name:'outSideAdd',
            component:outSideAdd,
        },
        {
            path:'/outSideEdit/:id?',
            name:'outSideEdit',
            component:outSideEdit,
        },
        {
            path:'/outSideDetails/:id?',
            name:'outSideDetails',
            component:outSideDetails,
        },
        {
            path:'/outSideuploadMult',
            name:'outSideuploadMult',
            component:outSideuploadMult,
        },
        {
            path:'/myUpload',
            name:'myUpload',
            component:myUpload,
        },
        {
            path:'/iframe/:id?',
            name:'iframe',
            component:iframe,
        },
        {
            path:'/selectSystemCode',
            name:'selectSystemCode',
            component:selectSystemCode,
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
        }
  ]
})
