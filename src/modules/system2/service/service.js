import axios from 'axios'
import {baseUrl,ecoPubAuthToken,sysEnv} from '@/modules/system2/config/env'
import { Message } from 'element-ui';
import qs from 'qs';
//全局设置超时时间 120s
axios.defaults.timeout = 120000;
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  window.visitServerTime = new Date().getTime();
  if(config.url && (config.url.indexOf('/login') == -1 && config.url.indexOf('/dingding-login')== -1 )){
      config.headers['eco-auth-token'] =  sessionStorage.getItem('ecoToken');
  }else{
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
        err.message = '400-请求错误'
        break
      case 401:
        err.message = '401-未授权，请登录'
        break
      case 403:
        err.message = '403-拒绝访问'
        break
      case 404:
        err.message = `404-请求地址出错: ${err.response.config.url}`
        break
      case 408:
        err.message = '408-请求超时'
        break
      case 500:
        err.message = '500-服务器内部错误'
        break
      case 501:
        err.message = '501-服务未实现'
        break
      case 502:
        err.message = '502-网关错误'
        break
      case 503:
        err.message = '503-服务不可用'
        break
      case 504:
        err.message = '504-网关超时'
        break
      case 505:
        err.message = '505-HTTP版本不受支持'
        break
      default:
    }
    
    if(err.response && err.response.data){
        err.message = err.message + err.response.data
    }
     
     Message.error({
        showClose: true,
        message: err.response.data,
        type: 'error'
     })
     if (err.response.status==401){
       if (window.sysvm){
          window.sysvm.logout();
       }
     }
  }
  return Promise.reject(err);
})



/*登陆*/
export const loginAjax = function(data){
    return axios.post(baseUrl+'/login',qs.stringify({
        username:data.username,
        password:data.password,
        time:new Date().getTime()
    }),{traditional:true});
}


export const dingdingLoginAjax = function(code,corpId){
  return axios.post(baseUrl+'/dingding-login',qs.stringify({
    code:code,
    corpId:corpId,
    time:new Date().getTime()
}),{traditional:true});
}

/*登出*/
export const loginOutAjax = function(data){
    return axios.post(baseUrl+'/logout',qs.stringify({
        time:new Date().getTime()
    }),{traditional:true});
}



//左侧菜单json
export const getMenuTreeViewAjax = function(){
    return axios.get(baseUrl+'/sys-menu/personal-list',{
        params: {
           time:new Date().getTime()
        }
    });
}



export const getSSOLinkAjax = function(url,flag){
    return axios.get(baseSearchDataServerUrl,{
        params: {
            flag:"ssolink",
            ssolink:url,
            time:new Date().getTime()
        }
    });
}

//用户个人信息
export const getUserSelfInfo = function(){
  return axios.get(baseUrl+'/org/user/self',{
      params: {
         time:new Date().getTime()
      }
  });
}

