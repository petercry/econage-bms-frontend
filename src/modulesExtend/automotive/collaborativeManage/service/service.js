import axios from 'axios'
import {baseUrl} from '../../collaborativeManage/config/env'
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
      password:'dc7ec2450dc392a0490e454605e1d465ad7bd3641abb471e7ad53b718bc65880',
      time:new Date().getTime()
  }),{traditional:true});
}


//查询协同项目列表
export const cooperateManageList =function(data){
  return axios.get(baseUrl+'/dongfeng/cooperate-manage/project/list/select',{
    params:{
      time:new Date().getTime(),
      ...data
    },
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}
//协同项目删除
export const cooperateManageDelete = function(ids){
  return axios.post(baseUrl+'/dongfeng/cooperate-manage/project/list/delete',{},{
      params:{
        ids,
        time:new Date().getTime()
      },
      paramsSerializer: function(params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      },
      traditional:true
  })
}
//协同项目详情
export const cooperateManageSingle =function(id){
  return axios.get(baseUrl+'/dongfeng/cooperate-manage/project/single/select',{
    params:{
      time:new Date().getTime(),
      id
    }
  })
}
//协同项目新增
export const cooperateManageAdd = function (data) {
  return axios.post(baseUrl + '/dongfeng/cooperate-manage/project/single/create?time=' + new Date().getTime(), JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//协同项目更新
export const cooperateManageUpdate = function (data) {
  return axios.post(baseUrl + '/dongfeng/cooperate-manage/project/single/update?time=' + new Date().getTime(), JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}

//协同范围列表
export const cooperateManageSelectList =function(data){
  return axios.get(baseUrl+'/dongfeng/cooperate-manage/project/scope/select-list',{
    params:{
      time:new Date().getTime(),
      ...data
    },
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}
//协同范围批量添加
export const cooperateManageAddStaff = function (data,masterId) {
  return axios.post(baseUrl + '/dongfeng/cooperate-manage/project/scope/add-list?masterId=' + masterId , JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//协同范围批量删除
export const cooperateManageDelStaff  = function(ids,masterId){
  return axios.post(baseUrl+'/dongfeng/cooperate-manage/project/scope/remove-list',{},{
      params:{
        masterId,
        ids,
        time:new Date().getTime()
      },
      paramsSerializer: function(params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      },
      traditional:true
  })
}
//文件管理列表
export const cooperateManageFileList =function(data){
  return axios.get(baseUrl+'/dongfeng/cooperate-manage/file/list/select',{
    params:{
      time:new Date().getTime(),
      ...data
    },
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}
//批量文件保存
export const cooperateManageFileSave = function(fileHeaderIds,masterId){
  return axios.post(baseUrl+'/dongfeng/cooperate-manage/file/list/save',{},{
      params:{
        masterId,
        fileHeaderIds,
        time:new Date().getTime()
      },
      paramsSerializer: function(params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      },
      traditional:true
  })
}
//批量文件删除
export const cooperateManageFileDel = function(ids){
  return axios.post(baseUrl+'/dongfeng/cooperate-manage/file/list/delete',{},{
      params:{
        ids,
        time:new Date().getTime()
      },
      paramsSerializer: function(params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      },
      traditional:true
  })
}
// 获取uid
export const getItemFetchId = function(){
  return axios.get(baseUrl+'/fetch-uid',{
    params:{
      time:new Date().getTime()
    },
    transformResponse: [function (data) {
      return data;
    }],
  })
}
//公共删除附件
export const fileDelete = function(id){
  return axios.delete(baseUrl+'/file-manager/info/'+id,{ traditional: true})
}
//已选择标准列表
export const  cooperateManageCategoryList =function(data){
  return axios.get(baseUrl+'/dongfeng/cooperate-manage/std-item/list/select',{
    params:{
      time:new Date().getTime(),
      ...data
    },
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}
//移除已选择标准列表
export const cooperateManageStdItemDel = function(ids){
  return axios.post(baseUrl+'/dongfeng/cooperate-manage/std-item/list/delete',{},{
      params:{
        ids,
        time:new Date().getTime()
      },
      paramsSerializer: function(params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      },
      traditional:true
  })
}

//已选择标准导入
export const cooperateManageUpload  = function (data) {
  return axios.post(baseUrl + '/dongfeng/cooperate-manage/std-item/excel/upload',data,
    {
      headers: {  'Content-Type': 'multipart/form-data' },
      traditional: true
    })
}
//已选择标准导出
export const cooperateManageStdItemDownload = function(data){
  return axios.get(baseUrl+'/dongfeng/cooperate-manage/std-item/excel/download',{
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

//选择标准列表
export const  cooperateManageCategorySelectList = function(data){
  return axios.get(baseUrl+'/dongfeng/cooperate-manage/std-item/category-list/select-list',{
    params:{
      time:new Date().getTime(),
      ...data
    },
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}
//选择清单tree
export const  cooperateManageCategoryTree  = function (){
  return axios.get(baseUrl + "/dongfeng/cooperate-manage/std-item/category-list/get-tree", {
    params: {
      time: new Date().getTime()
    }
  })
}
//选择标准-批量取消
export const cooperateManageDeleteBatch = function(itemIds,masterId){
  console.log(itemIds,masterId)
  return axios.post(baseUrl+'/dongfeng/cooperate-manage/std-item/category-list/delete-batch',{},{
      params:{
        masterId,
        itemIds,
        time:new Date().getTime()
      },
      paramsSerializer: function(params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      },
      traditional:true
  })
}
//选择标准-批量协同
export const cooperateManageAddBatch = function(itemIds,masterId){
  return axios.post(baseUrl+'/dongfeng/cooperate-manage/std-item/category-list/add-batch',{},{
      params:{
        masterId,
        itemIds,
        time:new Date().getTime()
      },
      paramsSerializer: function(params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      },
      traditional:true
  })
}