import request from '../utils/request'
import {getApiBaseUrl} from '../utils/utils'
//添加里程碑
export const addMiles = function(data){
    return request({
        url: getApiBaseUrl()+'/miles',
        method: 'post',
        data:data
    })
}
//编辑里程碑
export const updateMiles = function(data){
    return request({
        url: getApiBaseUrl()+'/miles',
        method: 'put',
        data:data
    })
}
//里程碑查询----单个
export const getMilesInfo = function(id){
    return request({
        url: getApiBaseUrl()+'/miles-single',
        method: 'get',
        params:{
            id
        }
    })
}
//里程碑查询-----树形
export const getMilesTreeList = function(id,modelId,infoId){
    return request({
        url: getApiBaseUrl()+'/miles-sub-rows',
        method: 'get',
        params:{
            parentId:id || -1,
            modelId:modelId,//模型卡片
            infoId:infoId//项目卡片
        }
    })
}
//删除里程碑
export const deleteMiles = function(id){
    return request({
        url: getApiBaseUrl()+'/miles-invalid',
        method: 'delete',
        params:{
            id
        }
    })
}
//里程碑查询-----列表
export const getMilesInfoList = function(params){
    return request({
        url: getApiBaseUrl()+'/miles-rows',
        method: 'get',
        params
    })
}
//里程碑统计数
export const getMilesRowsCount = function(modelId,infoId){
    return request({
        url: getApiBaseUrl()+'/miles-rows-count',
        method: 'get',
        params:{
            modelId,
            infoId
        }

    })
}