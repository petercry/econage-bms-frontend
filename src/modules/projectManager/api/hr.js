import request from '../utils/request'
import qs from 'qs'
//人力资源  添加
export const addInfoAjax = function(data){
    return request({
        url: '/extend/faw/pm/resources',
        method: 'post',
        data:data
    })
}
//人力资源  查看列表
export const getHrList = function(infoId){
    return request({
        url: '/extend/faw/pm/resources-rows',
        method: 'get',
        params:{
            rows:'1000',
            page:'1',
            infoId,
        }
    })
}
//人力资源  清空
export const deleteList = function(infoId){
    return request({
        url: '/extend/faw/pm/resources-delete',
        method: 'delete',
        params:{
            infoId
        }
    })
}