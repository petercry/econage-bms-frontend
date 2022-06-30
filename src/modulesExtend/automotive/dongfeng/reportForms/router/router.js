import Vue from 'vue'
import Router from 'vue-router'

//标准制修订年度统计表
const standardReport = r => require.ensure([], () => r(require('../views/standardSearch/standardReport.vue')), 'reportForms')
//标准制修订部门完成率
const standardDeptFinish = r => require.ensure([], () => r(require('../views/standardSearch/standardDeptFinish.vue')), 'reportForms')
//标准制修订部门延迟率
const standardDeptDelay = r => require.ensure([], () => r(require('../views/standardSearch/standardDeptDelay.vue')), 'reportForms')
//设计指南计划发布
const guidePlanPut = r => require.ensure([], () => r(require('../views/standardSearch/guidePlanPut.vue')), 'reportForms')
//标准目录查询
const standardDirectorySearch = r => require.ensure([], () => r(require('../views/standardSearch/standardDirectorySearch.vue')), 'reportForms')
//标准查阅次数查询
const standardSearchTimes = r => require.ensure([], () => r(require('../views/standardSearch/standardSearchTimes.vue')), 'reportForms')
//术语查询
const termSearch = r => require.ensure([], () => r(require('../views/standardSearch/termSearch.vue')), 'reportForms')



//项目点检清单
const itemCheckList = r => require.ensure([], () => r(require('../views/itemCheck/itemCheckList.vue')), 'reportForms')
//项目点检汇总
const itemCheckResslt = r => require.ensure([], () => r(require('../views/itemCheck/itemCheckResslt.vue')), 'reportForms')



//法规类别数量统计
const regulationTypeCount = r => require.ensure([], () => r(require('../views/regulation/regulationTypeCount.vue')), 'reportForms')
//日期数据统计
const regulationDateCount = r => require.ensure([], () => r(require('../views/regulation/regulationDateCount.vue')), 'reportForms')
//法规分类统计
const regulationSortConten = r => require.ensure([], () => r(require('../views/regulation/regulationSortConten.vue')), 'reportForms')
//法规报表详情列表
const regulationDetailList = r => require.ensure([], () => r(require('../views/regulation/regulationDetailList.vue')), 'reportForms')

//法规报表详情列表
const regulationDetail = r => require.ensure([], () => r(require('../views/regulation/regulationDetail.vue')), 'reportForms')

//法规日期列表
const regulatioDateList = r => require.ensure([], () => r(require('../views/regulation/regulatioDateList.vue')), 'reportForms')

//选择项目名称列表
const projectList = r => require.ensure([], () => r(require('../views/itemCheck/projectList.vue')), 'reportForms')
//项目详情
const itemCheckDetail = r => require.ensure([], () => r(require('../views/itemCheck/itemCheckDetail.vue')), 'reportForms')

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
    mode: 'hash',
    routes: [
        {
            path: '',
            redirect: '/standardReport'
        },
        //标准查询
        {
            path: '/standardReport',
            name: 'standardReport',
            component: standardReport,
        },
        {
            path: '/standardDeptFinish',
            name: 'standardDeptFinish',
            component: standardDeptFinish,
        },
        {
            path: '/standardDeptDelay',
            name: 'standardDeptDelay',
            component: standardDeptDelay,
        },
        {
            path: '/guidePlanPut',
            name: 'guidePlanPut',
            component: guidePlanPut,
        },
        {
            path: '/standardDirectorySearch',
            name: 'standardDirectorySearch',
            component: standardDirectorySearch,
        },
        {
            path: '/standardSearchTimes',
            name: 'standardSearchTimes',
            component: standardSearchTimes,
        },
        {
            path: '/termSearch',
            name: 'termSearch',
            component: termSearch,
        },
        //项目点检
        {
            path: '/itemCheckList',
            name: 'itemCheckList',
            component: itemCheckList,
        },
        {
            path: '/itemCheckResslt',
            name: 'itemCheckResslt',
            component: itemCheckResslt,
        },
        {
            path: '/projectList',
            name: 'projectList',
            component: projectList,
        },
        {
            path: '/itemCheckDetail/:projectId?/:profession?/:regulationCode?',
            name: 'itemCheckDetail',
            component: itemCheckDetail,
            props: true
        },
        //法规报表
        {
            path: '/regulationTypeCount',
            name: 'regulationTypeCount',
            component: regulationTypeCount,
        },
        {
            path: '/regulationDateCount',
            name: 'regulationDateCount',
            component: regulationDateCount,
        },
        {
            path: '/regulationSortConten',
            name: 'regulationSortConten',
            component: regulationSortConten,
        },
        {
            path: '/regulationDetailList/:filterCondition?/:superpositionCondition?/:filterId?/:superpositionId?',
            name: 'regulationDetailList',
            component: regulationDetailList,
            props: true
        },
        {
            path: '/regulatioDateList/:startDate?/:endDate?/:fun?/:type?/:conditionId?',
            name: 'regulatioDateList',
            component: regulatioDateList,
            props: true
        },
        {
            path: '/regulationDetail/:id?',
            name: 'regulationDetail',
            component: regulationDetail,
        },




    ]
})
