import request from '../utils/request'
import {getApiBaseUrl} from '../utils/utils'
//查询专业列表（根据类型）
export const getMajorList = function(type,modelId,infoId,name){
    return request({
        url: getApiBaseUrl()+'/activity-rows',
        method: 'get',
        params:{
            type,
            modelId,
            infoId,
            name
        }
    })
}
//添加专业
export const addMajor = function(data){
    return request({
        url: getApiBaseUrl()+'/activity',
        method: 'post',
        data:data

    })
}
//编辑专业活动
export const updateMajor = function(data){
    return request({
        url: getApiBaseUrl()+'/activity',
        method: 'put',
        data:data

    })
}
//查询专业信息
export const getMajorInfo = function(id){
    return request({
        url: getApiBaseUrl()+'/activity-single',
        method: 'get',
        params:{
            id
        }

    })
}
//删除专业
export const deleteMajor = function(id){
    return request({
        url: getApiBaseUrl()+'/activity-invalid',
        method: 'delete',
        params:{
            id
        }

    })
}
//添加专业类型
export const addMajorType = function(data){
    return request({
        url: '/extend/faw/pm-common/activity-type',
        method: 'post',
        data:data

    })
}
//获取角色节点统计数
export const getMajorRowsCount = function(modelId,infoId){
    return request({
        url: getApiBaseUrl()+'/activity-rows-count',
        method: 'get',
        params:{
            modelId,
            infoId
        }

    })
}
export const updateMajorType = function(data){
}
export const getMajorTypeInfo = function(data){
}
export const deleteMajorType = function(data){
}
