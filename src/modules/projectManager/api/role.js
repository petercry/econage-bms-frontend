import request from '../utils/request'
//查询角色列表（根据类型）
export const getRoleList = function(type,modelId,infoId,name){
    return request({
        url: '/extend/faw/pm-base/role-rows',
        method: 'get',
        params:{
            type,
            modelId,
            infoId,
            name
        }
    })
}
//添加角色
export const addRole = function(data){
    return request({
        url: '/extend/faw/pm-base/role',
        method: 'post',
        data:data

    })
}
//编辑角色活动
export const updateRole = function(data){
    return request({
        url: '/extend/faw/pm-base/role',
        method: 'put',
        data:data

    })
}
//查询角色信息
export const getRoleInfo = function(id){
    return request({
        url: '/extend/faw/pm-base/role-single',
        method: 'get',
        params:{
            id
        }

    })
}
//删除角色
export const deleteRole = function(id){
    return request({
        url: '/extend/faw/pm-base/role-invalid',
        method: 'delete',
        params:{
            id
        }

    })
}
//添加角色类型
export const addRoleType = function(data){
    return request({
        url: '/extend/faw/pm-common/role-type',
        method: 'post',
        data:data

    })
}
//获取角色节点统计数
export const getRoleRowsCount = function(modelId,infoId){
    return request({
        url: '/extend/faw/pm-base/role-rows-count',
        method: 'get',
        params:{
            modelId,
            infoId
        }

    })
}
export const updateRoleType = function(data){
}
export const getRoleTypeInfo = function(data){
}
export const deleteRoleType = function(data){
}
