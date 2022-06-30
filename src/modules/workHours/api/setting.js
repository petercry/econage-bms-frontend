import request from '../utils/request'
//添加配置项
export const addSetting = function(data){
    return request({
        url: '/extend/faw/mh/config',
        method: 'post',
        data:data
        
    })
}
//查询配置项列表
export const getSettingList = function(){
    return request({
        url: '/extend/faw/mh/config-rows',
        method: 'get'
    })
}
//删除配置
export const deleteSetting = function(id){
    return request({
        url: '/extend/faw/mh/config',
        method: 'delete',
        params:{
            id
        }
        
    })
}