import request from '../utils/request'
import {getApiBaseUrl} from '../utils/utils'
import qs from 'qs'
//添加计划
export const addPlan = function(data){
  return request({
      url: getApiBaseUrl()+'/work',
      method: 'post',
      data:data

  })
}
//编辑计划
export const updatePlan = function(data){
  return request({
      url: getApiBaseUrl()+'/work',
      method: 'put',
      data:data
  })
}
//删除计划
export const deletePlan = function(id){
  return request({
      url: getApiBaseUrl()+'/work-invalid',
      method: 'delete',
      params:{
          id
      }
  })
}
//计划查询----单个
export const getPlanInfo = function(id){
  return request({
      url: getApiBaseUrl()+'/work-single',
      method: 'get',
      params:{
          id
      }
  })
}
//计划查询-----树形
export const getPlanTreeList = function(id,modelId,infoId){
  return request({
      url: getApiBaseUrl()+'/work-sub-rows',
      method: 'get',
      params:{
          parentId:id || -1,
          modelId:modelId,//模型卡片
          infoId:infoId//项目卡片
      }
  })
}
//计划查询-----列表
export const getPlanInfoList = function(params){
  return request({
      url: getApiBaseUrl()+'/work-rows',
      method: 'get',
      params
  })
}
//计划统计数-----列表
export const getPlanRowsCount = function(params){
  return request({
      url: getApiBaseUrl()+'/work-rows-count',
      method: 'get',
      params
  })
}
//关联里程碑的交付物
export const getPlanDeliverRows = function(workType,infoId,modelId){
  return request({
      url: getApiBaseUrl()+'/miles-deliverable-rows',
      method: 'get',
      params:{
        workType,
        infoId,
        modelId
      }
  })
}
//计划----角色查询
export const getPlanRoleList = function(infoId){
  return request({
      url: '/extend/faw/pm-base/role-search-rows',
      method: 'get',
      params:{
        infoId
      }
  })
}
//计划----审核
export const approvePlan = function(infoId,workId){
  return request({
    url: '/extend/faw/pm/initwf-work-approval',
    method: 'get',
    params:{
      infoId,
      workId
    },
    paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//计划---下发
export const xiafaPlan = function(id){
  return request({

    url: '/extend/faw/pm/work-notice',
    method: 'get',
    params:{
      id
    },
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//计划---变更
export const changePlan = function(data){
  return request({

    url: '/extend/faw/pm/work-change',
    method: 'PUT',
    data:data
  })
}
//计划---变更记录
export const getChangePlanList = function(id){
  return request({

    url: '/extend/ext/obj-his-rows',
    method: 'get',
    params:{
      type:"faw_pm_sign",
      model:"faw_pm_model_plan",
      modelId:id
    }
  })
}

//获取关键里程碑
export const getMainMiles = function(infoId,type){
  return request({

    url: '/extend/faw/pm/main-miles',
    method: 'get',
    params:{
      infoId,
      type
    }
  })
}
//计划导出
export const exportPlan = function(infoId){
  return request({
      url: '/extend/faw/pm/work-exp',
      method: 'get',
      responseType: 'blob',
      params:{
        infoId
      },
      paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: 'repeat' })
      }
  })
}
