import axios from 'axios'
import {baseUrl} from '../config/env'
import {EcoUtil} from '@/components/util/main.js'
import { Message } from 'element-ui'
import qs from 'qs';
//全局设置超时时间 120s
axios.defaults.timeout = 120000;
axios.defaults.withCredentials = false ;

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  EcoUtil.beforeAjaxDoAction();
  if(config.url && config.url.indexOf('/login') == -1){
      config.headers['eco-auth-token'] =  sessionStorage.getItem('ecoToken');
  }
  return config;
}, function (error) {
// 对请求错误做些什么
return Promise.reject(error);
});

// 拦截响应response，并做一些错误处理
axios.interceptors.response.use((response) => {
    return response;
}, (err) => { // 这里是返回状态码不为200时候的错误处理
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '请求错误'
        break
      case 401:
        err.message = '未授权，请登录'
        break
      case 403:
        err.message = '拒绝访问'
        break
      case 404:
        err.message = `请求地址出错: ${err.response.config.url}`
        break
      case 408:
        err.message = '请求超时'
        break
      case 500:
        err.message = '服务器内部错误'
        break
      case 501:
        err.message = '服务未实现'
        break
      case 502:
        err.message = '网关错误'
        break
      case 503:
        err.message = '服务不可用'
        break
      case 504:
        err.message = '网关超时'
        break
      case 505:
        err.message = 'HTTP版本不受支持'
        break
      default:
    }
    if(err.response && err.response.data){
      err.message = err.message +','+ err.response.data
    }
    if (err.response.status==401){
      Message({
        showClose: true,
        message: err.response.data,
        type: 'error'
      })
      if(parent.window.sysvm){
        parent.window.sysvm.logout();
      }
    } else if (err.response.status==500){
      Message({
        showClose: true,
        message: err.response.data,
        type: 'error'
      })
    }else{
      Message({
        showClose: true,
        message: err.message,
        type: 'error'
      })
    }
  }
  return Promise.reject(err);
})

export const loginAjax = function(){
  return axios.post(baseUrl+'/login',qs.stringify({
      // username:'qqq222',
      // password:'123456',
      username:'econage',
      password:'cd2f2c39398d4cb8f8f31a3a3b28d7e94d5c26c708484afe6833e32e267504fb',
      time:new Date().getTime()
  }),{traditional:true});
}
//获取当前人信息
export const getUserSelfInfo = function(){
  return axios.get(baseUrl+'/org/user/self',{
      params: {
          time:new Date().getTime()
      }
  });
}

//根据用户id获取用户信息
export const getUserInfoByOrgId = function (id) {
  return axios.get(baseUrl + '/org/user/' + id, {
    params: {
      time: new Date().getTime()
    }
  })
}

//获取基础数据
export const getEnumSelectEnabled = function (id, action = '') {
  return axios.get(baseUrl + '/basic/kv/group/' + id + '/detail/' + action, {
    params: {
      time: new Date().getTime()
    }
  })
}
//获取操作类型枚举
export const getOperationTypeList = function () {
  return axios.get(baseUrl + '/dongfeng/guideline/program/support/operation-type', {
    params: {
      time: new Date().getTime()
    }
  })
}
//获取状态标示枚举
export const getSupportStatusList = function () {
  return axios.get(baseUrl + '/dongfeng/guideline/program/support/status', {
    params: {
      time: new Date().getTime()
    }
  })
}
//获取复审结论枚举
export const supportReviewConclusion = function () {
  return axios.get(baseUrl + '/dongfeng/guideline/program/support/review-conclusion', {
    params: {
      time: new Date().getTime()
    }
  })
}
//获取所有审批流节点
export const supportStateFlow = function () {
  return axios.get(baseUrl + '/dongfeng/guideline/program/support/state-flow', {
    params: {
      time: new Date().getTime()
    }
  })
}
//获取当前用户可以获取的审批节点
export const programCurrentUserState = function () {
  return axios.get(baseUrl + '/dongfeng/guideline/program/flow/current-user-state-list', {
    params: {
      time: new Date().getTime()
    }
  })
}
//获取审批状态枚举
export const supportPhaseStatus = function () {
  return axios.get(baseUrl + '/dongfeng/guideline/program/support/phase-status', {
    params: {
      time: new Date().getTime()
    }
  })
}
//获取列表
export const guidelineProgramList = function (data) {
  return axios.get(baseUrl + '/dongfeng/guideline/program/main/list', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

//批量删除
export const guidelineDelete = function (ids) {
  return axios.post(baseUrl + '/dongfeng/guideline/program/main/delete-batch',{},
  {
    params:{
      ids,
      time:new Date().getTime()
    },
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    },
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    traditional: true
  })
}

//导出
export const programExportExcel  = function(data){
  return axios.get(baseUrl + '/dongfeng/guideline/program/main/excel-export', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    responseType:'blob',
  })
}
//导入
export const  programImportExcel = function (data) {
  return axios.post(baseUrl + '/dongfeng/guideline/program/main/excel-import',data,
    {
      headers: {  'Content-Type': 'multipart/form-data' },
      traditional: true
    })
}

//获取流程历史
export const programApproveHistory = function (data) {
  return axios.get(baseUrl + '/dongfeng/guideline/program/main/approve-history', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//查看详情
export const programDetails = function (id) {
  return axios.get(baseUrl + '/dongfeng/guideline/program/main/select-single', {
    params: {
      time: new Date().getTime(),
      id
    }
  })
}
//业务指南规划 新增
export const programMainAdd = function (data) {
  return axios.post(baseUrl + '/dongfeng/guideline/program/main/add-single?time=' + new Date().getTime(), JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//业务指南规划 修改
export const programMainUpdate = function (data) {
  return axios.post(baseUrl + '/dongfeng/guideline/program/main/update-single?time=' + new Date().getTime(), JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//查询当前节点拥有的数据行数
export const  stateFlowCurrentCount = function (phase) {
  return axios.get(baseUrl + '/dongfeng/guideline/program/flow/current-count?phase='+phase, {
    params: {
      time: new Date().getTime()
    }
  })
}
//查询当前节点需要到达的数据总行数
export const  stateFlowTotalCount = function (phase) {
  return axios.get(baseUrl + '/dongfeng/guideline/program/flow/total-count?phase='+phase, {
    params: {
      time: new Date().getTime()
    }
  })
}
//下发
export const stateFlowPass = function (data) {
  return axios.post(baseUrl + '/dongfeng/guideline/program/flow/pass', {
    time: new Date().getTime()
  }, {
      params:data,
      paramsSerializer: function(params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      }
    },{traditional: true})
}
//退回
export const programWithdraw = function (data) {
  return axios.post(baseUrl + '/dongfeng/guideline/program/flow/send-back',{},
  {
    params:{
      ...data,
      time:new Date().getTime()
    },
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    },
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    traditional: true
  })
}
//获取立项单
export const programSpecificEstablish = function (id) {
  return axios.get(baseUrl + '/dongfeng/guideline/program/specific/establish/select-single', {
    params: {
      time: new Date().getTime(),
      guidelineId:id
    }
  })
}

//获取复审单
export const programSpecificReview = function (id) {
  return axios.get(baseUrl + '/dongfeng/guideline/program/specific/review/select-single', {
    params: {
      time: new Date().getTime(),
      guidelineId:id
    }
  })
}



//添加或更新立项单
export const programEstablishUpdate = function (guidelineId,data) {
  return axios.post(baseUrl + '/dongfeng/guideline/program/specific/establish/update-single?guidelineId=' + guidelineId, JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}

//添加或更新复审单
export const programSpecificUpdate = function (guidelineId,data) {
  return axios.post(baseUrl + '/dongfeng/guideline/program/specific/review/update-single?guidelineId=' + guidelineId, JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}



//启动规划
export const  programMainStartup = function () {
  return axios.post(baseUrl + '/dongfeng/guideline/program/main/startup', {
    time: new Date().getTime()
  }, {
      traditional: true
    })
}

//责任人确定
export const responsibleUserConfirm = function (guidelineId) {
  return axios.post(baseUrl + '/dongfeng/guideline/program/specific/responsible-user/confirm?guidelineId=' + guidelineId,{

  },
  {
    traditional: true
  })
}

// 发布-分页查询
export const planPublishMainList = function (data) {
  return axios.get(baseUrl + '/dongfeng/guideline/plan-publish/main/list', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

//发布-获取所有审批流节点
export const planPublishStateFlow = function () {
  return axios.get(baseUrl + '/dongfeng/guideline/plan-publish/support/state-flow', {
    params: {
      time: new Date().getTime()
    }
  })
}

//发布-获取审批状态枚举
export const planPublishPhaseStatus = function () {
  return axios.get(baseUrl + '/dongfeng/guideline/plan-publish/support/phase-status', {
    params: {
      time: new Date().getTime()
    }
  })
}

//发布-当前用户所获取的节点
export const  planPublishCurrentState = function () {
  return axios.get(baseUrl + '/dongfeng/guideline/plan-publish/flow/current-user-state-list', {
    params: {
      time: new Date().getTime()
    }
  })
}
//发布启动
export const  planPublishStartup = function () {
  return axios.post(baseUrl + '/dongfeng/guideline/plan-publish/main/startup', {
    time: new Date().getTime()
  }, {
      traditional: true
    })
}

//查询当前节点拥有的数据行数
export const  planPublishCurrentCount = function (phase) {
  return axios.get(baseUrl + '/dongfeng/guideline/plan-publish/flow/current-count?phase='+phase, {
    params: {
      time: new Date().getTime()
    }
  })
}
//查询当前节点需要到达的数据总行数
export const  planPublishTotalCount = function (phase) {
  return axios.get(baseUrl + '/dongfeng/guideline/plan-publish/flow/total-count?phase='+phase, {
    params: {
      time: new Date().getTime()
    }
  })
}
//发布-批量删除
export const planPublishDelete = function (ids) {
  return axios.post(baseUrl + '/dongfeng/guideline/plan-publish/main/delete-batch',{},
  {
    params:{
      ids,
      time:new Date().getTime()
    },
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    },
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    traditional: true
  })
}

//发布-下发
export const planPublishFlowPass = function (data) {
  return axios.post(baseUrl + '/dongfeng/guideline/plan-publish/flow/pass', {
    time: new Date().getTime()
  }, {
      params:data,
      paramsSerializer: function(params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      }
    },{traditional: true})
}
//发布-导出
export const  planPublishExcelExport = function(data){
  return axios.get(baseUrl + '/dongfeng/guideline/plan-publish/main/excel-export', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    responseType:'blob',
  })
}

//发布-导入
export const  planPublishExcelImport = function (data) {
  return axios.post(baseUrl + '/dongfeng/guideline/plan-publish/main/excel-import',data,
    {
      headers: {  'Content-Type': 'multipart/form-data' },
      traditional: true
    })
}

//发布-获取审批流程历史意见
export const planPublishApproveHistory = function (data) {
  return axios.get(baseUrl + '/dongfeng/guideline/plan-publish/main/approve-history', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

//发布-驳回
export const planPublishSendBack = function (data) {
  return axios.post(baseUrl + '/dongfeng/guideline/plan-publish/flow/send-back',{},
  {
    params:{
      ...data,
      time:new Date().getTime()
    },
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    },
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    traditional: true
  })
}

//发布-新增
export const planPublishAdd= function (data) {
  return axios.post(baseUrl + '/dongfeng/guideline/plan-publish/main/add-single?time=' + new Date().getTime(), JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}

//发布-更新
export const planPublishUpdate = function (data) {
  return axios.post(baseUrl + '/dongfeng/guideline/plan-publish/main/update-single?time=' + new Date().getTime(), JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}

//发布-查看详情
export const planPublishDetails = function (id) {
  return axios.get(baseUrl + '/dongfeng/guideline/plan-publish/main/select-single', {
    params: {
      time: new Date().getTime(),
      id
    }
  })
}

// 获取uid
export const getItemFetchId = function () {
  return axios.get(baseUrl + '/fetch-uid', {
    params: {
      time: new Date().getTime()
    },
    transformResponse: [function (data) {
      return data;
    }],
  })
}
//根据orgId 回显部门名称
export const getOrgsMemberByIds = function(orgIdArray){
  return axios.post(baseUrl+'/org/tree-select/member-text-show',orgIdArray,{
      headers: {'Content-Type': 'application/json;charset=UTF-8'},
      traditional:true
    })
}

//环节统计
export const statisticsTaskCountList = function (data) {
  return axios.get(baseUrl + '/dongfeng/guideline/program/statistics/task-count-list', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//环节统计导出
export const downloadTaskCountList  = function(data){
  return axios.get(baseUrl + '/dongfeng/guideline/program/main/excel/download-task-count-list', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    responseType:'blob',
  })
}