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

//启动流程
export const openProblem = function () {
  return request({
    url: '/df/problem/manage/init-Workflow',
    method: 'post',
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

//查询计划列表
export const problemList = function (info,params) {
  return request({
    url: '/df/problem/manage/list',
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

//查询问题分类
export const getProblemType = function () {
  return request({
    url: '/basic/kv/group/WTLB/detail',
    method: 'GET',
  })
}


//导出excel-export
export const getExport = function (params) {
  return request({
    url: '/df/problem/manage/excel-export',
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
//删除问题
export const deleteProblem = function (id) {
  return request({
    url: '/df/problem/manage/delete-by-id',
    method: 'get',
    params:{
      id
    },
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
