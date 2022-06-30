import request from '../utils/request'
import qs from 'qs'
//查询项目列表
export const getProjectList = function(params){
    return request({
        url: '/extend/faw/pm/info-rows',
        method: 'get',
        params,
        paramsSerializer: params => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}
//添加项目
export const addProject = function(data,status){
    return request({
        url: '/extend/faw/pm/info-'+status,
        method: 'post',
        data:data

    })
}
//编辑保存项目
export const updateProject = function(data,status){
    return request({
        url: '/extend/faw/pm/info-'+status,
        method: 'put',
        data:data

    })
}

//查询项目信息
export const getProjectInfo = function(id){
    return request({
        url: '/extend/faw/pm/info-single',
        method: 'get',
        params:{
            id
        }

    })
}
//关闭项目
export const closeProject = function(id){
    return request({
        url: '/extend/faw/pm/info-close',
        method: 'get',
        params:{
            id
        }

    })
}
//项目终止
export const stopProject = function(id){
    return request({
        url: '/extend/faw/pm/info-stop',
        method: 'get',
        params:{
            id
        }

    })
}
//删除项目
export const inValidProject = function(id){
    return request({
        url: '/extend/faw/pm/info-invalid',
        method: 'delete',
        params:{
            id
        },
        paramsSerializer: params => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}
//查询项目产品类别
export const getProductType = function({rdType,industry} = {}){
    return request({
        url: '/extend/faw/pm/info-product-type',
        method: 'get',
        params:{
            rdType,
            industry
        }

    })
}
//项目提交
export const submitProject = function(data){
    return request({
        url: '/extend/faw/pm/info-submit',
        method: 'put',
        data:data

    })
}
//项目导出
export const exportProject = function(params){
    return request({
        url: '/extend/faw/pm/info-exp',
        method: 'get',
        responseType: 'blob',
        params,
        paramsSerializer: params => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}
