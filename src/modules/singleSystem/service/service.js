import axios from 'axios'
import {baseUrl} from '../config/env'
import qs from 'qs';
//全局设置超时时间 120s
axios.defaults.timeout = 120000;

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
        window.visitServerTime = new Date().getTime();
        // 在发送请求之前做些什么
        if(config.url && (config.url.indexOf('/login') == -1 && config.url.indexOf('/dingding-login')== -1 && config.url.indexOf('/hr/dingding/open/setting')== -1 && config.url.indexOf('/public/setting/union') == -1)){
              config.headers['eco-auth-token'] =  sessionStorage.getItem('ecoToken');
        }else{}
        
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
        err.message =  '504-网关超时'
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
            // window.sysvm.logout();
        }
     }
  }
  return Promise.reject(err);
})



//申请查看流程
export const getWFViewOperateId = function(wfId,formView,ccId){
    let _data = {};
    _data.ajaxTime = new Date().getTime();
    _data.wf_id = wfId;
    _data.cc_id = ccId;
    _data.form_view = formView;
    return axios.post(baseUrl+'/bpm/v95/process/form-view',qs.stringify(_data,{arrayFormat:'repeat'}),{traditional:true});
}


//是否开启了分级管控
export const isFacadeBranchOrg = function(){
  return axios.get(baseUrl+'/bpm/v95/facade/branch-org',{
      params: {
         time:new Date().getTime()
      }
  });
}

export const getRoleExistsUnionRef = function(role){
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


