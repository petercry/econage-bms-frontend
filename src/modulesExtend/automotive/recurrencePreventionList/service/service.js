import axios from 'axios'
import { baseUrl } from '../config/env'
import { EcoUtil } from '@/components/util/main.js'
import { Message } from 'element-ui'
import qs from 'qs';
//全局设置超时时间 120s
axios.defaults.timeout = 120000;
axios.defaults.withCredentials = false;

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  EcoUtil.beforeAjaxDoAction();
  if (config.url && config.url.indexOf('/login') == -1) {
    config.headers['eco-auth-token'] = sessionStorage.getItem('ecoToken');
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
    if (err.response && err.response.data) {
      err.message = err.message + ',' + err.response.data
    }
    if (err.response.status == 401) {
      Message({
        showClose: true,
        message: err.response.data,
        type: 'error'
      })
      if (parent.window.sysvm) {
        parent.window.sysvm.logout();
      }
    } else if (err.response.status == 500) {
      Message({
        showClose: true,
        message: err.response.data,
        type: 'error'
      })
    } else {
      Message({
        showClose: true,
        message: err.message,
        type: 'error'
      })
    }
  }
  return Promise.reject(err);
})

export const loginAjax = function () {
  return axios.post(baseUrl + '/login', qs.stringify({
    username: 'admin',
    password: '123456',
    time: new Date().getTime()
  }), { traditional: true });
}

//获取基础数据
export const getEnumSelectEnabled = function (id, action = '') {
  return axios.get(baseUrl + '/basic/kv/group/' + id + '/detail/' + action, {
    params: {
      time: new Date().getTime()
    }
  })
}


//根据用户id获取用户信息
export const getUserInfoByOrgId = function (id) {
  return axios.get(baseUrl + '/org/user/' + id, {
    params: {
      time: new Date().getTime()
    }
  })
}
//根据orgId 回显部门名称
export const getOrgsMemberByIds = function (orgIdArray) {
  return axios.post(baseUrl + '/org/tree-select/member-text-show', orgIdArray, {
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    traditional: true
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
//获取权限按钮配置项
export const getRoleBtnSetting = function(refs){
  return axios.get(baseUrl+'/org/user/personal/role/is-exists-one-by-one',{
    params:{
        'ref':refs,
        time:new Date().getTime()
      },

      paramsSerializer: function(params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      },
  })
}
//获取状态
export const getStatusEnum = function(){
  return axios.get(baseUrl+'/dongfeng/recurrence_prevention/status-enum',{
      params:{
        time:new Date().getTime()
      }
  })
}
//操作类型
export const getOperateEnum = function(){
  return axios.get(baseUrl+'/dongfeng/recurrence_prevention/operate-enum',{
      params:{
        time:new Date().getTime()
      }
  })
}
//查询列表
export const  recurrencePreventionList= function(data,pageType){
  let url;
  if(pageType == 'approve'){
    url = '/dongfeng/recurrence_prevention/list/select/approving';
  }else{
    url = '/dongfeng/recurrence_prevention/pagination';
  }
  return axios.get(baseUrl+url,{
    params:{
        time:new Date().getTime(),
        ...data
      },
      paramsSerializer: function(params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      },
  })
}
//编制更新
export const recurrencePreventionUpdate = function (data) {
  return axios.put(baseUrl + '/dongfeng/recurrence_prevention/update-single', {
    ...data,
    time: new Date().getTime()
  }, {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//申请更新
export const recurrencePreventionApplyUpdate = function (data) {
  return axios.post(baseUrl + '/dongfeng/recurrence_prevention/copy4update-single', {
    ...data,
    time: new Date().getTime()
  }, {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//查询单个
export const  recurrencePreventionDetails= function(id){
  return axios.get(baseUrl+'/dongfeng/recurrence_prevention/select-by-id',{
      params:{
        id,
        time:new Date().getTime()
      }
  })
}
//编制新增
export const  recurrencePreventionAdd= function (data) {
  return axios.post(baseUrl + '/dongfeng/recurrence_prevention/add-single?time=' + new Date().getTime(), JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//删除
export const recurrencePreventionDel = function (id) {
  return axios.delete(baseUrl + '/dongfeng/recurrence_prevention/delete-by-id', {
    params: {
      time: new Date().getTime(),
      id
    }
  },{
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
  })
}
//申请删除
export const  recurrencePreventionApplyDel= function (id) {
  return axios.post(baseUrl + '/dongfeng/recurrence_prevention/copy4Delete-single?id='+id, {
    time: new Date().getTime()
  },{
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
  })
}
//提交
export const  recurrencePreventionSubmit= function (id,assigneeId) {
  return axios.put(baseUrl + '/dongfeng/recurrence_prevention/submit-single?id='+id+'&assigneeId='+assigneeId, {
    time: new Date().getTime()
  },{
      traditional: true
    })
}
//审核
export const recurrencePreventionAudit = function (id,opinion,content) {
  let url = '/dongfeng/recurrence_prevention/audit-single?opinion='+opinion+'&id=' + id;
  if(!opinion){
    url += '&content='+encodeURI(content);
  }
  return axios.put(baseUrl + url, {
    time: new Date().getTime()
  }, {
      traditional: true
    })
}
//导入
export const recurrencePreventionImport = function (data) {
  return axios.post(baseUrl + '/dongfeng/recurrence_prevention/excel-import',data,
    {
      headers: {  'Content-Type': 'multipart/form-data' },
      traditional: true
    })
}
//导出
export const  recurrencePreventionExport = function(data){
  return axios.get(baseUrl+'/dongfeng/recurrence_prevention/excel-export-download',{
        params:{
            ...data,
            time: new Date().getTime(),
        },
      paramsSerializer: function(params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      },
      responseType:'blob',
    }
  )
}
//保存并提交
export const  recurrencePreventionSaveSubmit = function (data,assigneeId) {
  return axios.post(baseUrl + '/dongfeng/recurrence_prevention/single/save-submit?time=' + new Date().getTime()+'&assigneeId='+assigneeId, JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
// 再发防止清单查询页分类树
export const recurrencePreventionTree = function(){
  return axios.get(baseUrl + '/dongfeng/recurrence_prevention/tree/category-tree', {
    params: {
      time: new Date().getTime(),
    }
  })
}

//历史版本版本
export const recurrencePreventionArchiveList = function (data) {
  return axios.get(baseUrl + '/dongfeng/recurrence_prevention/archive/list', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//审批记录
export const recurrencePreventionHistoryList = function (id) {
  return axios.get(baseUrl + '/dongfeng/recurrence_prevention/approve/history-list?id='+id, {
    params: {
      time: new Date().getTime()
    }
  })
}
//历史版本详情
export const recurrencePreventionArchiveDetails = function (id) {
  return axios.get(baseUrl + '/dongfeng/recurrence_prevention/archive/single?id='+id, {
    params: {
      time: new Date().getTime()
    }
  })
}
//查询完成列表
export const finishList = function (data) {
  return axios.get(baseUrl + '/dongfeng/thinktank/regulationtrack/search/finish-list', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//获取级联基础数据
export const getTreeSelectEnabled = function (id) {
  return axios.get(baseUrl + '/basic/tree-kv/group/select-enabled?parentId=' + id, {
    params: {
      time: new Date().getTime()
    }
  })
}
//法规跟踪表获取自定义列表
export const regulationtrackStatusSet = function () {
  return axios.get(baseUrl + '/dongfeng/thinktank/structurebase/trivial/status-set', {
    params: {
      time: new Date().getTime()
    }
  })
}