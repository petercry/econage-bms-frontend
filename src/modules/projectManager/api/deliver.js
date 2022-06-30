import request from '../utils/request'
import qs from 'qs'
import {getApiBaseUrl} from '../utils/utils'
//添加交付物
export const addDeliver = function(data,moudle){
    let url = '/extend/faw/pm-base';
    if(moudle == "project"){
        url = '/extend/faw/pm';
    }else if(moudle == "templates"){
        url = '/extend/faw/pm-model';
    }
    return request({
        url: url+'/deliverable',
        method: 'post',
        data:data

    })
}
//编辑交付物
export const updateDeliver = function(data,moudle){
    let url = '/extend/faw/pm-base';
    if(moudle == "project"){
        url = '/extend/faw/pm';
    }else if(moudle == "templates"){
        url = '/extend/faw/pm-model';
    }
    return request({
        url: url+'/deliverable',
        method: 'put',
        data:data
    })
}
//查询交付物
export const getDeliverInfo = function(id,moudle){
    let url = '/extend/faw/pm-base';
    if(moudle == "project"){
        url = '/extend/faw/pm';
    }else if(moudle == "templates"){
        url = '/extend/faw/pm-model';
    }
    return request({
        url: url+'/deliverable-single',
        method: 'get',
        params:{
            id
        }
    })
}
//查询交付物列表
export const getDeliverInfoList = function(params){
    return request({
        url: getApiBaseUrl()+'/deliverable-rows',
        method: 'get',
        params,
        paramsSerializer: params => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}
//编辑交付物
export const inValidDeliver = function(id){
    return request({
        url: getApiBaseUrl()+'/deliverable-invalid',
        method: 'delete',
        params:{
            id
        },
        paramsSerializer: params => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}
