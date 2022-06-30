import request from '../utils/request'
import {getApiBaseUrl} from '../utils/utils'
//获取权限列表
export const getAuthorityList = function(modelId,infoId){
    return request({
        url: getApiBaseUrl()+'/authority-rows',
        method: 'get',
        params:{
            modelId,
            infoId
        }
    })
}
//获取某个权限列表
export const  getAuthorityListSingle= function(data,moudle){
    let url = '/extend/faw/pm-base';
    if(moudle == "project"){
        url = '/extend/faw/pm';
    }else if(moudle == "templates"){
        url = '/extend/faw/pm-model';
    }
    return request({
        url: url+'/authority-single',
        method: 'get',
        params:data
    })
}
//权限配置-编辑
export const  editAuthority= function(data,moudle){
    let url = '/extend/faw/pm-base';
    if(moudle == "project"){
        url = '/extend/faw/pm';
    }else if(moudle == "templates"){
        url = '/extend/faw/pm-model';
    }
    return request({
        url: url+'/authority',
        method: 'put',
        data:data
    })
}
