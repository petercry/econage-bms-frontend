import request from '../utils/request'
import {baseUrl} from '../config/env'
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
export const openGuide = function (operationType,id) {
  return request({
    url: '/df/business/guide/manage/init-Workflow',
    method: 'GET',
    params:{
      operationType,
      id
    },
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

//流程查看
export const getWFViewOperateId = function(params){
  return request({
    url: '/bpm/v95/process/form-view',
    method: 'post',
    params,
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' },{  traditional:true,})
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
// //获取制修订审批状态
// export const getRevisionStatus= function () {
//   return request({
//     url: 'dongfeng/guideline/program/support/bg_revision-status',
//     method: 'GET',
//   })
// }
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
export const guidePlanList = function (info,params) {
  return request({
    url: '/df/business/guide/manage/list',
    method: 'GET',
    params:{
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
    url: '/df/business/guide/manage/excel-export',
    method: 'GET',
    params:{
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
    params:{
      id
    }
  })
}
//业务指南制修订详情查询
export const getGudeReviseDetails = function (id) {
  return request({
    url: '/df/business/guide/revision/select-single',
    method: 'GET',
    params:{
      id
    }
  })
}

//查询制修订列表
export const guideReviseList = function (info,params) {
  return request({
    url: '/df/business/guide/revision/list',
    method: 'GET',
    params:{
      ...info,
      ...params
    },
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

//制修订启动流程
export const openReviseGuide = function (id) {
  return request({
    url: '/df/business/guide/revision/start-revision-wf',
    method: 'post',
    params:{
      id
    },
    // paramsSerializer: params => {
    //   return qs.stringify(params, { arrayFormat: 'repeat' })
    // }
  })
}


//制修订审批状态
export const getRevisionStatus = function () {
  return request({
    url: '/df/business/guide/revision/status-enum',
    method: 'GET',
  })
}

//计划管理审批状态
export const getPlanStatus = function () {
  return request({
    url: '/df/business/guide/manage/status-enum',
    method: 'GET',
  })
}

//查询制修订归档列表
export const guideArchiveList = function (info,params) {
  return request({
    url: '/df/business/guide/revision/doc-list',
    method: 'GET',
    params:{
      ...info,
      ...params
    },
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//归档状态
export const getArchiveStatus = function () {
  return request({
    url: '/df/business/guide/revision/archive-status-enum',
    method: 'GET',
  })
}

//制修订归档
export const stdRevisionArchiveFile = function (params) {
  return request({
    url: '/df/business/guide/revision/archive-file',
    method: 'post',
    params,
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//制修订归档
export const checkFile = function (id) {
  return request({
    url: '/df/business/guide/revision/query-doc',
    method: 'get',
    params:{
      id
    }
    
  })
}

//获取有效性
export const getYouXX= function () {
  return request({
    url: '/basic/kv/group/YouXX/detail',
    method: 'get'
  })
}

//根据用户id获取用户信息
export const getUserInfoByOrgId = function(id){
  return request({
      url: '/org/user/'+id,
      method: 'get',
  })
}