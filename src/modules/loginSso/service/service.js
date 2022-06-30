import axios from 'axios'
import {baseUrl} from '../config/env'
import qs from 'qs';
import {EcoUtil} from '@/components/util/main.js'
import { Message } from 'element-ui';
//全局设置超时时间 120s
axios.defaults.timeout = 120000;


// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
      EcoUtil.beforeAjaxDoAction();
      if(!EcoUtil.requestCheckByWhiteList(config.url) && sessionStorage.getItem('ecoToken') && sessionStorage.getItem('ecoToken') != "null"){
        config.headers['eco-auth-token'] =  sessionStorage.getItem('ecoToken');
      }
  
  // config.headers['eco-auth-token'] =  sessionStorage.getItem('ecoToken');
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 拦截响应response，并做一些错误处理
axios.interceptors.response.use((response) => {
    if(!response.data){
      Message({
        message: "网络错误",
        type: 'error',
        showClose: true,
        duration:2000,
        customClass:'design-from-el-message'
      });
      window.isError = true;
    }
    if(( response.data.status && (response.data.status >= 100 && response.data.status != 301 && response.data.status != 400)) || (response.data.hasOwnProperty("success") && response.data.success == false)){
        Message({
          message: response.data.msg || response.data.msgDesc,
          type: 'warning',
          showClose: true,
          duration:2000,
          customClass:'design-from-el-message'
        });
        window.isError = true;
    }
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
  }
  return Promise.reject(err);
})

//用户个人信息
export const getUserSelfInfo = function(){
  return axios.get(baseUrl+'/org/user/self',{
      params: {
         time:new Date().getTime()
      }
  });
}
//请求测试
export const requestTest = function(){
  return axios.get(baseUrl+'/request-test',{
      params: {
         time:new Date().getTime()
      }
  });
}
export const loginAjax = function(){
  return axios.post(baseUrl+'/login',qs.stringify({
      username:'18815292113',
      password:'1234abcd',
      time:new Date().getTime()
  }),{traditional:true});
}


//用户角色------权限
export const getRoleExists = function(role){
  return axios.get(baseUrl+'/org/user/personal/role/is-exists-anyone-or-admin',{
    params:{
      'role-def':role,
      time:new Date().getTime()
    },
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    },
  })
}
//根据cas 获取登录令牌
export const getAuthTokenByCas = function(key,value){
  return axios.post(baseUrl+'/login/sso/cas',qs.stringify({
    [key]:value,
    time:new Date().getTime()
  }),{traditional:true});
}
//获取公开配置项
export const getPublicSetting = function(){
  return axios.get(baseUrl+'/public/setting/union',{
    params: {

    }
  });
}
//获取target重定向地址
export const getUrlByCasTarget = function(target){
  let url = baseUrl+'/public/setting/cas-login-url-with-target';
  if (type){
    url+='?target='+target;
  }
  return axios.get(url,{
    params: {
      time:new Date().getTime()
    }
  });
}
export const dingdingLoginAjax = function(code,corpId,loginMethod){
  return axios.post(baseUrl+'/login/sso/edd',qs.stringify({
    code:code,
    corpId:corpId,
    loginMethod:loginMethod,
    time:new Date().getTime()
  }),{traditional:true});
}
export const appUserLoginAjax = function(code){
  return axios.post(baseUrl+'/login/sso/app-user',qs.stringify({
    ['auth-code']:code,
    time:new Date().getTime()
  }),{traditional:true});
}
export const loginSSOGddAjax = function(code,loginMethod){
  return axios.post(baseUrl+'/login/sso/gdd',qs.stringify({
    code:code,
    loginMethod:loginMethod,
    time:new Date().getTime()
}),{traditional:true});
}