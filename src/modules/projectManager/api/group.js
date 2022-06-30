import request from '../utils/request'
import {getApiBaseUrl} from '../utils/utils'
//查询团队列表（根据类型）
export const getGroupList = function(type,modelId,infoId,name){
    return request({
        url: getApiBaseUrl()+'/group-rows',
        method: 'get',
        params:{
            type,
            modelId,
            infoId,
            name
        }
    })
}
//添加团队
export const addGroup = function(data){
    return request({
        url: getApiBaseUrl()+'/group',
        method: 'post',
        data:data

    })
}
//编辑团队活动
export const updateGroup = function(data){
    return request({
        url: getApiBaseUrl()+'/group',
        method: 'put',
        data:data
    })
}
//编辑团队(关联角色)
export const saveGroupLinkUser = function(data){
    return request({
        url: getApiBaseUrl()+'/group-link-user',
        method: 'put',
        data:data
    })
}
//查询团队信息
export const getGroupInfo = function(id){
    return request({
        url: getApiBaseUrl()+'/group-single',
        method: 'get',
        params:{
            id
        }

    })
}
//删除团队
export const deleteGroup = function(id){
    return request({
        url: getApiBaseUrl()+'/group-invalid',
        method: 'delete',
        params:{
            id
        }

    })
}
//获取团队自节点统计数
export const getGroupRowsCount = function(modelId,infoId){
    return request({
        url: getApiBaseUrl()+'/group-rows-count',
        method: 'get',
        params:{
            modelId,
            infoId
        }

    })
}
//添加团队类型
export const addGroupType = function(data){
    return request({
        url: '/extend/faw/pm-common/group-type',
        method: 'post',
        data:data

    })
}
//获取团队权限
export const getGroupRole = function(id,infoId){
    return request({
        url: '/extend/faw/pm/group-role',
        method: 'get',
        params:{
            id,
            infoId
        }

    })
}
