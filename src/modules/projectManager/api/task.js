import request from '../utils/request'
import {getApiBaseUrl} from '../utils/utils'
import qs from 'qs'
//任务列表查询
export const getTaskList = function(params){
  return request({
      url: '/extend/faw/pm/work-task-rows',
      method: 'get',
      params:{
        publishStatus:"faw_pm_work_publish_status3",
        infoId:params.infoId,
        status:params.status,
        name:params.name,
        currentUserId:params.currentUserId,
        liableUserId:params.liableUserId,
        liableUserName:params.liableUserName,
        planStartDate:params.planStartDate,
        planEndDate:params.planEndDate

      }
  })
}
export const getTaskInfo = (id)=>{
  return request({
      url: '/extend/faw/pm/work-task-single',
      method: 'get',
      params:{
        id
      }
  })
}
//保存交付步骤
export const saveTaskDeliv = (data)=>{
  return request({
      url: '/extend/faw/pm/task-deliv',
      method: 'post',
      data:data
  })
}
//完成任务
export const finishedTask = (id)=>{
  return request({
      url: '/extend/faw/pm/task-finish',
      method: 'GET',
      params:{
        id
      }
  })
}
//点击代办任务列
export const getTaskDoInfo = (id)=>{
  return request({
      url: '/extend/faw/pm/task-do',
      method: 'GET',
      params:{
        id
      }
  })
}
//显示通知列表
export const getTaskNoticeList = (params) => {
  if(params.click == '-1'){
    delete params.click;
  }
  return request({
      url: '/extend/faw/pm/notice-rows',
      method: 'GET',
      params,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
  })
}
//通知已读
export const readNoticeInfo = (id) => {
  return request({
      url: '/extend/faw/pm/notice-click',
      method: 'GET',
      params:{
        id
      }
  })
}
