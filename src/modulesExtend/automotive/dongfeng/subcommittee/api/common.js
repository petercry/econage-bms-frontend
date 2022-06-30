import request from '../utils/request'
import qs from 'qs'
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
