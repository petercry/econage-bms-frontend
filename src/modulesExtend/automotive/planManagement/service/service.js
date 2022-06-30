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
//获取级联基础数据
export const getTreeSelectEnabled = function (id) {
  return axios.get(baseUrl + '/basic/tree-kv/group/select-enabled?parentId=' + id, {
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
//获取列表
export const planManageList = function (data) {
  return axios.get(baseUrl + '/df/std/plan/manage/list', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
// 启动流程
export const initWorkflowType = function (operationType,ids) {
  return axios.post(baseUrl + '/df/std/plan/manage/init-Workflow',{

  },{
      params:{
        operationType,
        ids
      },
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
  })
}
export const getWFOperateId = function(task_id){
  let _data = {};
  _data.task_id = task_id;
  _data.time = new Date().getTime();
  return axios.post(baseUrl+'/bpm/v95/process/process',qs.stringify(_data,{arrayFormat:'repeat'}),{traditional:true});
}
// 导出
export const planManageExport = function(data){
  return axios.get(baseUrl+'/df/std/plan/manage/excel-export',{
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
//计划当前审批状态
export const planPublishPhaseStatus  = function () {
  return axios.get(baseUrl + '/dongfeng/std/plan-publish/enum/phase-status', {
    params: {
      time: new Date().getTime()
    }
  })
}

//制修订获取列表
export const stdRevisionList = function (data) {
  return axios.get(baseUrl + '/dongfeng/std/revision/main/list/select', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//制修订启动流程
export const stdRevisionStart = function (id) {
  return axios.post(baseUrl + '/dongfeng/std/revision/main/start-revision-wf?id=' + id,{

  },{
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
  })
}

// 查询知识库列表
export const getKnowledgeLibCard = function (params) {
  return axios.get(baseUrl + '/dongfeng/doc-base/base/list/select', {
    params: {
      time: new Date().getTime(),
      ...params
    }
  })
}
// 查询知识库文件夹树
export const  docBaseTree= function (data) {
  return axios.get(baseUrl + '/dongfeng/doc-base/search/tree/dir', {
    params: {
      ...data,
      time: new Date().getTime()
    }
  })
}
//查对应文件夹 的文件
export const docBaseFileRecursively  = function (data) {
  return axios.get(baseUrl + '/dongfeng/doc-base/search/file/recursively', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

//批量归档
export const stdRevisionArchiveFile = function(data){
  return axios.post(baseUrl+'/dongfeng/std/revision/main/archive-file',
    {},
    {
      params: {
        time: new Date().getTime(),
        ...data
      },
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    }
  ,{traditional:true});
}
// export const stdRevisionArchiveFile = function(data){
//   return axios.post(baseUrl+'/dongfeng/std/revision/main/archive-file',
//     qs.stringify(data,{ arrayFormat: 'repeat' }),{traditional:true});
// }

//制修订查询详情
export const stdRevisionSigleDetails = function (id) {
  return axios.get(baseUrl + '/dongfeng/std/revision/main/single/select', {
    params: {
      id,
      time: new Date().getTime()
    }
  })
}

//流程查看
export const getWFViewOperateId = function(wfId,formView,ccId){
  let _data = {};
  _data.ajaxTime = new Date().getTime();
  _data.wf_id = wfId;
  _data.cc_id = ccId;
  _data.form_view = formView;
  return axios.post(baseUrl+'/bpm/v95/process/form-view',qs.stringify(_data,{arrayFormat:'repeat'}),{traditional:true});
}

//修改查看详情
export const planModifySelectDetails  = function (id) {
  return axios.get(baseUrl + '/df/std/plan/manage/modify-select-single', {
    params: {
      id,
      time: new Date().getTime()
    }
  })
}

//修改
export const planModifySingleUpdate = function (data) {
  return axios.post(baseUrl + '/df/std/plan/manage/modify-single', data, {
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    traditional: true
  })
}