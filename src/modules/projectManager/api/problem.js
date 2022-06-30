import request from '../utils/request'
import qs from 'qs'
//查询问题列表
export const getProblemList = function(params){
  return request({
      url: '/extend/faw/pm/problem-rows',
      method: 'get',
      params,
      paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: 'repeat' })
      }
  })
}
// 添加问题生成编号
export const createProblemCode = function(params){
  return request({
      url: 'extend/faw/pm/problem-code',
      method: 'get',
      params,
      paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: 'repeat' })
      }
  })
}

// 添加问题
export const addProblem = function(data){
  return request({
      url: '/extend/faw/pm/problem',
      method: 'post',
      data:data
  })
}
// 查询问题信息
export const getProblemInfo = function(id){
  return request({
      url: '/extend/faw/pm/problem-single',
      method: 'get',
      params:{
          id
      }

  })
}
// 查询单个解决措施信息
export const getSingleMeasureInfo = function(id){
  return request({
      url: '/extend/faw/pm/problem-measures-single',
      method: 'get',
      params:{
          id
      }

  })
}
// 维护单条解决措施
export const updateSingleMeasureInfo = function(data){
  return request({
      url: '/extend/faw/pm/problem-measures',
      method: 'put',
      data:data
  })
}
// 关闭问题
export const closeProblem = function(id){
  return request({
      url: '/extend/faw/pm/problem-close',
      method: 'get',
      params:{
          id
      }
  })
}
// 删除问题
export const delProblem = function(id){
  return request({
      url: '/extend/faw/pm/problem-invalid',
      method: 'delete',
      params:{
          id
      }

  })
}
// 编辑问题
export const updateProblemInfo = function(data){
  return request({
      url: '/extend/faw/pm/problem',
      method: 'put',
      data:data
  })
}
// 查询人员所在部门
export const getDpetBylinkId= function(id){
  return request({
      url: '/extend/faw/pm/dept-single',
      method: 'get',
      params:{
        userId:id
      }

  })
}

// 问题延期流程
export const  startProblemDelayFlow= function(id,infoId){
  return request({
      url: '/extend/faw/pm/initwf-problem-overdue',
      method: 'get',
      params:{
        problemId:id,
        infoId:infoId
      }

  })
}
