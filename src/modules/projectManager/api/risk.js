import request from '../utils/request'
import qs from 'qs'
//查询风险列表
export const getRiskList = function(params){
  return request({
      url: '/extend/faw/pm/risk-rows',
      method: 'get',
      params,
      paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: 'repeat' })
      }
  })
}

// 添加风险
export const addRisk = function(data){
  return request({
      url: '/extend/faw/pm/risk',
      method: 'post',
      data:data
  })
}
// 查询风险信息
export const getRiskInfo = function(id){
  return request({
      url: '/extend/faw/pm/risk-single',
      method: 'get',
      params:{
          id
      }

  })
}
// 查询单个解决措施信息
export const getSingleMeasureInfo = function(id){
  return request({
      url: '/extend/faw/pm/risk-measures-single',
      method: 'get',
      params:{
          id
      }

  })
}
// 维护单条解决措施
export const updateSingleMeasureInfo = function(data){
  return request({
      url: '/extend/faw/pm/risk-measures',
      method: 'put',
      data:data
  })
}
// 关闭风险
export const closeRisk = function(id){
  return request({
      url: '/extend/faw/pm/risk-close',
      method: 'get',
      params:{
          id
      }

  })
}

// 删除风险
export const delRisk = function(id){
  return request({
      url: '/extend/faw/pm/risk-invalid',
      method: 'delete',
      params:{
          id
      }

  })
}
// 编辑风险
export const updateRiskInfo = function(data){
  return request({
      url: '/extend/faw/pm/risk',
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

// 风险延期流程
export const  startPiskDelayFlow= function(id,infoId){
  return request({
      url: '/extend/faw/pm/initwf-risk-overdue',
      method: 'get',
      params:{
        riskId:id,
        infoId:infoId
      }

  })
}
