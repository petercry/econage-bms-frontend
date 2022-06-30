import request from '../utils/request'
import qs from 'qs'
import {baseUrl} from '../config/env'
//登录
export const login = (username, password) =>{
    return request({
        url: '/login',
        method: 'post',
        data: qs.stringify({
            username:username,
            password:password,
            time:new Date().getTime()
        })
    })
}
//查询基础数据
export const getEnumSelectEnabled = function(id){
    return request({
        url: '/basic/kv/group/'+id+'/detail/select-enabled',
        method: 'get'
    })
}
// 获取uid
export const getItemFetchId = function(){
  return request({
    url: '/fetch-uid',
    method: 'get',
    params:{
      time:new Date().getTime()
    },
    transformResponse: [function (data) {
      return data;
    }],
  })
}

//根据用户id获取用户信息
export const getUserInfoByOrgId = function(id){
  return request({
      url: '/org/user/'+id,
      method: 'get',
  })
}

//根据orgId 回显部门名称
export const getOrgsMemberByIds = function(data){
  return request({
    url:'/org/tree-select/member-text-show',
    method: 'post',
    data,
    traditional:true
  })
}

//获取卓越体系
export const getexcellenceSystem = function () {
  return request({
    url: '/basic/kv/group/esProgramClass/detail',
    method: 'GET',
  })
}

//获取有效性
export const getYouXX= function () {
  return request({
    url: '/basic/kv/group/YouXX/detail',
    method: 'GET'
  })
}
//获取制/修订
export const getRevisionType = function () {
  return request({
    url: '/basic/kv/group/1371283282024140801/detail',
    method: 'GET',
  })
}
//获取规划来源
export const getSource = function () {
  return request({
    url: 'basic/kv/group/esProgramSource/detail',
    method: 'GET',
  })
}