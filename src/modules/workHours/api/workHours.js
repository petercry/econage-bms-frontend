import request from '../utils/request'
import qs from 'qs'
//保存工时填报
export const saveWorkHours = function(data){
    return request({
        url: '/extend/faw/mh/timesheets',
        method: 'post',
        data:data

    })
}
//工时填报查询
export const getWorkHoursInfo = function(startDate,endDate){
    return request({
        url: '/extend/faw/mh/timesheets-rows',
        method: 'get',
        params:{
            startDate:startDate,
            endDate:endDate,
            time:Date.now()
        }
    })
}


//隐藏工时填报
export const hideWorkHours = function(params){
    return request({
        url: '/extend/faw/mh/timesheets-hide',
        method: 'get',
        params:{
            model:params.model,
            modelId:params.modelId,
            activityId:params.activityId
        }

    })
}
//得到复制上周的数据
export const copyLastWeek = function(params){
    return request({
        url: '/extend/faw/mh/timesheets-copy',
        method: 'get',
        params:{
            model:params.model,
            modelId:params.modelId,
            activityId:params.activityId,
            currDate:params.currDate
        }

    })
}
//得到可能被隐藏的项目数据
export const getHideItemInfo = function(params){
    return request({
        url: '/extend/faw/mh/timesheets-single-row',
        method: 'get',
        params:{
            model:params.model,
            modelId:params.modelId,
            activityId:params.activityId,
            startDate:params.startDate,
            endDate:params.endDate
        }

    })
}
//根据人员查询工时报表
export const getChartByUser = function(params){
    return request({
        url: '/extend/faw/mh/chart/user-hour',
        method: 'get',
        params,
        paramsSerializer: params => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}
//根据人员查询工时报表-换算后的
export const getFixedChartByUser = function(params){
    return request({
        url: '/extend/faw/mh/chart/user-day',
        method: 'get',
        params,
        paramsSerializer: params => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}
//根据部门查询工时报表
export const getChartByDept = function(params){
    return request({
        url: '/extend/faw/mh/chart/dept',
        method: 'get',
        params,
        paramsSerializer: params => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}
//根据项目查询工时报表
export const getChartByPm = function(params){
    return request({
        url: '/extend/faw/mh/chart/pm',
        method: 'get',
        params,
        paramsSerializer: params => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}
//项目工时报表查询获取专业列
export const getDeptForPmChart = function(params){
    return request({
        url: '/extend/faw/mh/chart/pm-dept',
        method: 'get',
        params,
        paramsSerializer: params => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}
//根据日期获取隐藏工时数总和
export const getHideTotalByDate = function(currDate){
    return request({
        url: '/extend/faw/mh/hide-total',
        method: 'get',
        params:{
            currDate:currDate
        }
    })
}
//根据日期区间获取隐藏工时数总和
export const getHideTotalMap = function(params){
    return request({
        url: '/extend/faw/mh/hide-total-map',
        method: 'get',
        params,
        paramsSerializer: params => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}
//项目成员报表导出
export const exportChartByUser = function(params){
    return request({
        url: '/extend/faw/mh/chart/user-hour-excel',
        method: 'get',
        params,
        responseType: 'blob',
        paramsSerializer: params => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}
//项目成员报表(8小时)导出
export const exportChartByUserFixed = function(params){
    return request({
        url: '/extend/faw/mh/chart/user-day-excel',
        method: 'get',
        params,
        responseType: 'blob',
        paramsSerializer: params => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}
//项目工时报表导出
export const exportChartByPm = function(params){
    return request({
        url: '/extend/faw/mh/chart/pm-excel',
        method: 'get',
        params,
        responseType: 'blob',
        paramsSerializer: params => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}
//角色组成员查询
export const getRoleGroupByLinyu = function(roleGroup){
    return request({
        url: '/extend/faw/mh/chart/group-user',
        method: 'get',
        params:{
            roleGroup:roleGroup
        }
    })
}
//获取当前用户所属角色
export const getRoleByUser = function(roleGroup){
    return request({
        url: '/extend/faw/mh/chart/user-role',
        method: 'get',

    })
}
