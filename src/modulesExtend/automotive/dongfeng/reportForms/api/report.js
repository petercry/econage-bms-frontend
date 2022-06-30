import request from '../utils/request'
import { baseUrl } from '../config/env'
import qs from 'qs'
// 获取uid
export const getItemFetchId = function () {
  return request({
    url: '/fetch-uid',
    method: 'get',
    params: {
      time: new Date().getTime()
    },
    transformResponse: [function (data) {
      return data;
    }]
  })
}

//计划启动流程
export const openGuide = function (operationType, id) {
  return request({
    url: '/df/business/guide/manage/init-Workflow',
    method: 'GET',
    params: {
      operationType,
      id
    },
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

//流程查看
export const getWFViewOperateId = function (params) {
  return request({
    url: '/bpm/v95/process/form-view',
    method: 'post',
    params,
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' }, { traditional: true, })
    }

  })
}

//获取操作类型枚举
export const getOperationType = function () {
  return request({
    url: '/basic/kv/group/1374984805560344577/detail',
    method: 'GET',

  })
}
//获取制/修订
export const getRevisionType = function () {
  return request({
    url: '/basic/kv/group/1371283282024140801/detail',
    method: 'GET',
  })
}
//获取制修订审批状态
export const getRevisionStatus = function () {
  return request({
    url: 'dongfeng/guideline/program/support/bg_revision-status',
    method: 'GET',
  })
}
//获取卓越体系
export const getexcellenceSystem = function () {
  return request({
    url: '/basic/kv/group/esProgramClass/detail',
    method: 'GET',
  })
}
//获取计划类型
export const getPlanType = function () {
  return request({
    url: '/basic/kv/group/1374925683821371393/detail',
    method: 'GET',
  })
}
//查询计划列表
export const guidePlanList = function (info, params) {
  return request({
    url: '/df/business/guide/manage/list',
    method: 'GET',
    params: {
      ...info,
      ...params
    },
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//导出excel-export
export const getExport = function (params) {
  return request({
    url: '/dongfeng/regulation-report/export-project-list',
    method: 'GET',
    params: {
      ...params
    },
    responseType: 'blob',
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//业务指南计划管理详情查询
export const getGudePlanDetails = function (id) {
  return request({
    url: '/df/business/guide/manage/select-single',
    method: 'GET',
    params: {
      id
    }
  })
}

//查询制修订列表
export const guideReviseList = function (info, params) {
  return request({
    url: '/df/business/guide/revision/list',
    method: 'GET',
    params: {
      ...info,
      ...params
    },
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

//法规报表--各类别数量统计(单选)
export const getRegulationTypeCount = function (fun1, fun2) {
  return request({
    url: '/dongfeng/regulation-report/regulation-category-quantity',
    method: 'GET',
    params: {
      fun1,
      fun2
    }
  })
}
//法规分类统计
export const getRegulationSortConten = function () {
  return request({
    url: '/dongfeng/regulation-report/regulation-category',
    method: 'GET',
    params: {

    }
  })
}
//日期数据统计
export const getRegulationDateConten = function (type, startDate, endDate, fun) {
  return request({
    url: '/dongfeng/regulation-report/regulation-year',
    method: 'GET',
    params: {
      type,
      startDate,
      endDate,
      fun
    }
  })
}

//法规报表详情
export const getRegulationDetail = function (id) {
  return request({
    url: '/dongfeng/thinktank/regulationtrack',
    method: 'GET',
    params: {
      id
    }
  })
}
//法规报表详情列表
export const getRegulationList = function (filterCondition, superpositionCondition, filterId, superpositionId) {
  return request({
    url: '/dongfeng/regulation-report/regulation-category-list',
    method: 'GET',
    params: {
      filterCondition,   //筛选条件   
      superpositionCondition,  // 叠加条件
      filterId,   //筛选条件的基础数据id
      superpositionId,   //叠加条件基础数据id
    }
  })
}
//法规报表详情列表
export const getDateList = function (startDate, endDate, fun, type, conditionId) {
  return request({
    url: '/dongfeng/regulation-report/regulation-year-list',
    method: 'GET',
    params: {
      startDate,
      endDate,
      fun,
      type,
      conditionId,
    }
  })
}

//项目点检清单列表
export const getItemCheckList = function (info, form) {
  return request({
    url: '/dongfeng/regulation-report/project-list',
    method: 'GET',
    params: {
      ...info,
      ...form
    }
  })
}
//项目点检结果汇总
export const getInspection = function (params) {
  return request({
    url: '/dongfeng/regulation-report/project-condition',
    method: 'GET',
    params: {
      ...params
    }
  })
}
//项目点检结果汇总
export const getProjectList = function () {
  return request({
    url: '/dongfeng/thinktank/project/list?page=1&rows=999999&sort=createDate&order=asc',
    method: 'GET',
    params: {

    }
  })
}
//分类、子类
export const getCategory = function (parentId) {
  return request({
    url: '/basic/tree-kv/group/select-enabled',
    method: 'GET',
    params: {
      parentId
    }
  })
}

//项目点检结果汇总
export const getItemDetailList = function (projectId, profession, regulationCode) {
  return request({
    url: '/dongfeng/regulation-report/project-list-provisions',
    method: 'GET',
    params: {
      projectId,
      profession,
      regulationCode
    }
  })
}
//获取专业
export const getMajor = function () {
  return request({
    url: '/basic/kv/group/1372459642503467009/detail',
    method: 'GET',
    params: {

    }
  })
}
//获取标准制修订年度统计表
export const getStandYear = function (year) {
  return request({
    url: '/data-report/standard-query/annual-statistics',
    method: 'GET',
    params: {
      year
    }
  })
}
//获取标准制修订部门完成率
export const getStandDeptFinish = function (year) {
  return request({
    url: '/data-report/standard-query/completion-rate',
    method: 'GET',
    params: {
      year
    }
  })
}
//获取标准制修订部门完成率
export const getStandDeptDelay = function (year) {
  return request({
    url: '/data-report/standard-query/delay-count',
    method: 'GET',
    params: {
      year
    }
  })
}
//获取术语统计
export const getStandQuery = function (typeId) {
  return request({
    url: '/data-report/standard-query/term-statistics',
    method: 'GET',
    params: {
      typeId
    }
  })
}
//获取技术类
export const getTechnical = function (parentId) {
  return request({
    url: '/basic/tree-kv/group/select-enabled',
    method: 'GET',
    params: {
      parentId
    }
  })
}
//标准查阅次数
export const getSearchTimes = function (info, params) {
  return request({
    url: '/data-report/standard-query/standard-views',
    method: 'GET',
    params: {
      ...info,
      ...params
    }
  })
}
//获取有效性
export const getYouXX = function () {
  return request({
    url: '/basic/kv/group/YouXX/detail',
    method: 'GET'
  })
}

//标准查阅次数
export const getSearchDir = function (params) {
  return request({
    url: '/data-report/standard-query/standard-catalogue',
    method: 'GET',
    params: {
      ...params
    }
  })
}
//编制及发布
export const getSummary = function (year) {
  return request({
    url: '/data-report/standard-query/release-summary',
    method: 'GET',
    params: {
      year
    }
  })
}
//导出excel-export
export const getDirectoryExport = function (params) {
  return request({
    url: '/data-report/standard-query/standard-catalogue-excel-export',
    method: 'GET',
    params: {
      ...params
    },
    responseType: 'blob',
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//标准查阅次数 导出
export const getTimesExport = function (params) {
  return request({
    url: '/data-report/standard-query/standard-views-excel-export',
    method: 'GET',
    params: {
      ...params
    },
    responseType: 'blob',
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//术语统计 导出
export const getTermExport = function (params) {
  return request({
    url: '/data-report/standard-query/term-statistics-excel-export',
    method: 'GET',
    params: {
      ...params
    },
    responseType: 'blob',
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}