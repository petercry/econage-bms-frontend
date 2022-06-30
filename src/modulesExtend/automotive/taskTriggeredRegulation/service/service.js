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
      password:'0c176cddbdad8b2c69c8879345412b73443b8c5cf8b599de385a63bf84f71821',
      time:new Date().getTime()
  }),{traditional:true});
}

//获取基础数据
export const getEnumSelectEnabled = function(id,action=''){
  return axios.get(baseUrl+'/basic/kv/group/'+id+'/detail/'+action,{
    params:{
      time:new Date().getTime()
    }
  })
}
//根据用户id获取用户信息
export const getUserInfoByOrgId = function(id){
  return axios.get(baseUrl+'/org/user/'+id,{
    params:{
      time:new Date().getTime()
    }
  })
}
//根据orgId 回显部门名称
export const getOrgsMemberByIds = function(orgIdArray){
  return axios.post(baseUrl+'/org/tree-select/member-text-show',orgIdArray,{
      headers: {'Content-Type': 'application/json;charset=UTF-8'},
      traditional:true
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
//获取级联基础数据
export const getTreeSelectEnabled = function (id) {
  return axios.get(baseUrl + '/basic/tree-kv/group/select-enabled?parentId=' + id, {
    params: {
      time: new Date().getTime()
    }
  })
}

//查询列表
export const regulationChangeList = function (data) {
  return axios.get(baseUrl + '/dongfeng/thinktank/regulation-change/list/select', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
// 新增
export const  regulationChangeAdd = function (data) {
  return axios.post(baseUrl + '/dongfeng/thinktank/regulation-change/single/insert?time=' + new Date().getTime(), JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//获取项目列表
export const getProList = function(data){
  return axios.get(baseUrl+'/dongfeng/thinktank/regulation-change/project/list/select',{
      params:{
          page:data.page,
          rows:data.rows,
          sort:data.sort,
          order:data.order,
          time:new Date().getTime()
      }
  })
}
//获取结构化库详情
export const structurebaseSingle = function (id) {
  return axios.get(baseUrl + '/dongfeng/thinktank/structurebase', {
    params: {
      time: new Date().getTime(),
      id
    }
  })
}
//更新
export const  regulationChangeUpdate = function (data) {
  return axios.post(baseUrl + '/dongfeng/thinktank/regulation-change/single/update?time=' + new Date().getTime(), JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//查看详情
export const  regulationChangeDetails= function (id) {
  return axios.get(baseUrl + '/dongfeng/thinktank/regulation-change/single/select', {
    params: {
      time: new Date().getTime(),
      id
    }
  })
}
//发布
export const regulationChangePublish = function (ids) {
  return axios.post(baseUrl + '/dongfeng/thinktank/regulation-change/publish',qs.stringify(
    {
      time: new Date().getTime(),
      ids
    },{ arrayFormat: 'repeat' }
  ),{
      traditional: true
  })
}
//查询车型信息列表
export const projectListSelectByStructure = function (id) {
  return axios.get(baseUrl + '/dongfeng/thinktank/regulation-change/project/list/select-by-structure', {
    params: {
      time: new Date().getTime(),
      id
    }
  })
}
//查询任务列表
export const regulationChangeTaskList = function (data) {
  return axios.get(baseUrl + '/dongfeng/thinktank/regulation-change/task/list/select', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//点检
export const regulationChangeDoCheck = function (ids) {
  return axios.post(baseUrl + '/dongfeng/thinktank/regulation-change/flow/do-check',qs.stringify(
    {
      time: new Date().getTime(),
      ids
    },{ arrayFormat: 'repeat' }),{traditional: true})
}

//不点检
export const regulationChangeNotCheck = function (ids,cause) {
  return axios.post(baseUrl + '/dongfeng/thinktank/regulation-change/flow/not-check',qs.stringify(
    {
      time: new Date().getTime(),
      ids,
      cause
    },{ arrayFormat: 'repeat' }
  ),{
      traditional: true
  })
}
//标准专业负责人同意
export const regulationLeaderApproval = function (ids) {
  return axios.post(baseUrl + '/dongfeng/thinktank/regulation-change/flow/regulation-leader/approval',qs.stringify(
    {
      time: new Date().getTime(),
      ids
    },{ arrayFormat: 'repeat' }),{traditional: true})
}
//标准专业负责人不同意
export const regulationLeaderDisapproval = function (ids) {
  return axios.post(baseUrl + '/dongfeng/thinktank/regulation-change/flow/regulation-leader/disapproval',qs.stringify(
    {
      time: new Date().getTime(),
      ids
    },{ arrayFormat: 'repeat' }),{traditional: true})
}
//项目专业负责人同意
export const projectLeaderApproval = function (ids) {
  return axios.post(baseUrl + '/dongfeng/thinktank/regulation-change/flow/project-leader/approval',qs.stringify(
    {
      time: new Date().getTime(),
      ids
    },{ arrayFormat: 'repeat' }),{traditional: true})
}
//项目专业负责人不同意
export const projectLeaderDisapproval = function (ids) {
  return axios.post(baseUrl + '/dongfeng/thinktank/regulation-change/flow/project-leader/disapproval',qs.stringify(
    {
      time: new Date().getTime(),
      ids
    },{ arrayFormat: 'repeat' }),{traditional: true})
}




