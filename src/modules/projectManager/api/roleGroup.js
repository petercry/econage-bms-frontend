import request from '../utils/request'//添加配置项
export const addRoleGroup = function(data){
    return request({
        url: '/extend/faw/pm-base/role-group',
        method: 'post',
        data:data

    })
}
//查询配置项列表
export const getRoleGroupList = function(){
    return request({
        url: '/extend/faw/pm-base/role-group-rows',
        method: 'get'
    })
}
//删除配置
export const deleteRoleGroup = function(id){
    return request({
        url: '/extend/faw/pm-base/role-group-invalid',
        method: 'delete',
        params:{
            id
        }

    })
}
