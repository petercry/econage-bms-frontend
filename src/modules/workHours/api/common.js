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
        url: '/basic/kv/group/'+id+'/detail/update-enabled',
        method: 'get'
    })
}
//查询项目列表
export const getProjectList = function(params){
    return request({
        url: '/extend/faw/pm/info-rows',
        method: 'get',
        params:{
            page:1,
            rows:9999
        }
    })
}
//查询当前人员所属部门专业列表
export const getActivityList = function(params){
    return request({
        url: '/extend/faw/mh/activity-rows',
        method: 'get',
        params:{
            currUserDept:true
        }
    })
}
//查询部门专业列表
export const getActivityListByDept = function(array = []){
    return request({
        url: '/extend/faw/mh/activity-rows',
        method: 'get',
        params:{
            deptLinkIds:array
        },
        paramsSerializer: params => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}
//查询日程安排
export const getScheduleMap = function(startDate,endDate){
    return request({
        url: '/extend/faw/mh/schedule-map',
        method: 'get',
        params:{
            startDate:startDate,
            endDate:endDate
        }
    })
}
//查询工时配置
export const getWorkHoursSetting = function(){
    return request({
        url: '/extend/faw/mh/config-map',
        method: 'get',
        params:{
            time:Date.now()
        }
    })
}
// 获取当前用户信息
export const getUserSelfInfo = function(){
    return request({
      url: '/org/user/self',
      method: 'get',
      params: {
        time:new Date().getTime()
      }
    })
  }
