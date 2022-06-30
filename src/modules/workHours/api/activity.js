import request from '../utils/request'

//查询专业列表（根据类型）
export const getActivityList = function(type,name){
    return request({
        url: '/extend/faw/mh/activity-rows',
        method: 'get',
        params:{
            type,
            name
        }
    })
}
//添加专业
export const addActivity = function(data){
    return request({
        url: '/extend/faw/mh/activity',
        method: 'post',
        data:data

    })
}
//编辑保存专业
export const updateActivity = function(data){
    return request({
        url: '/extend/faw/mh/activity',
        method: 'put',
        data:data

    })
}
//查询专业信息
export const getActivityInfo = function(id){
    return request({
        url: '/extend/faw/mh/activity-single',
        method: 'get',
        params:{
            id
        }

    })
}
//删除专业
export const deleteActivity = function(id){
    return request({
        url: '/extend/faw/mh/activity-invalid',
        method: 'delete',
        params:{
            id
        }

    })
}
export const getActivityRowsCount = function(){
    return request({
        url: '/extend/faw/mh/activity-rows-count',
        method: 'get',
    })
}
