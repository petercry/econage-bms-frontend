import request from '../utils/request'
import qs from 'qs'
//添加模型
export const addTemplates = function(data){
    return request({
        url: '/extend/faw/pm-model/info',
        method: 'post',
        data:data

    })
}
//编辑模型
export const updateTemplates = function(data){
    return request({
        url: '/extend/faw/pm-model/info',
        method: 'put',
        data:data
    })
}
//查询模型
export const getTemplatesInfo = function(id){
    return request({
        url: '/extend/faw/pm-model/info-single',
        method: 'get',
        params:{
            id
        }
    })
}
//查询模型列表
export const getTemplatesInfoList = function(params){
    return request({
        url: '/extend/faw/pm-model/info-rows',
        method: 'get',
        params,
        paramsSerializer: params => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}
//删除模型
export const inValidTemplates = function(id){
    return request({
        url: '/extend/faw/pm-model/info-invalid',
        method: 'delete',
        params:{
            id
        },
        paramsSerializer: params => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}
