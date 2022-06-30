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
      message.error({
        showClose: true,
        message: err.response.data,
        type: 'error'
      })
      if(window.portalHeader){
        window.portalHeader.loginOut();
      }
    } else if (err.response.status==500){
      message.error({
        showClose: true,
        message: err.response.data,
        type: 'error'
      })
    }else{
      message.error({
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
      username:'econage',
      password:'72d2711f3560dfe09bd2c4452dba574980b3fc84dd0985ac2335906abd4bef15',
      time:new Date().getTime()
  }),{traditional:true});
}
// 法规实施时间预警
export const queryRegulationTrack = function () {
  return axios.get(baseUrl + '/dongfeng/standard-message/query-regulation-track', {
    params: {
      time: new Date().getTime()
    }
  })
}
//会议意见
export const standardMessageQueryBook = function (type) {
  return axios.get(baseUrl + '/dongfeng/standard-message/query-book?type='+type, {
    params: {
      time: new Date().getTime()
    }
  })
}
//获取当前用户
export const getUserSelfInfo = function(){
  return axios.get(baseUrl+'/org/user/self',{
      params: {
          time:new Date().getTime()
      }
  });
}

//获取图片列表
export const queryBookPohto = function(){
  return axios.get(baseUrl+'/dongfeng/standard-message/query-book-pohto',{
      params: {
          time:new Date().getTime()
      }
  });
}
//获取附件列表
export const getFileList = function(modular,modularInnerId){
  return axios.get(baseUrl+"/file-manager/info/modular/"+modular+"?modularInnerId=" + modularInnerId,{
    time: new Date().getTime()
  },{ traditional: true})
}

//获取临时token
export const getEETempToken = function(){
  return axios.get(baseUrl+'/file-manager/download-tmp-token',{
      params:{
          time: new Date().getTime()
      }
  })
}

//待办中心
export const queryAssignList  = function(size){
  return axios.get(baseUrl+'/dongfeng/task-aggregation/list/portal',{
      params:{
          size,
          time: new Date().getTime()
      }
  })
}

export const commonSupportTempToken = function(){
  return axios.post(baseUrl+'/dongfeng/common-support/store/temp-token',qs.stringify({
      time:new Date().getTime()
  }),{traditional:true});
}
