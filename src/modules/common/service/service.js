import axios from 'axios'
import {baseUrl,sysEnv} from '@/modules/common/config/env'
import {EcoUtil} from '@/components/util/main.js'
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
  
   
    if (err.response.status==401){
        parent.window.sysvm.$message.error({
            showClose: true,
            message: err.response.data,
            type: 'error'
        })
        if(err.response.config && err.response.config.url.indexOf('/login') == -1){
            parent.window.sysvm.logout();
        }
    }
  }
  return Promise.reject(err);
})



export const loginInitAjax = function(){
  return axios.post(baseUrl+'/login',qs.stringify({
      username:'205209',
      password:'1234abcd',
      time:new Date().getTime()
  }),{traditional:true});
}

//可选国际化信息
export const getI18nMap = function(){
  return axios.get(baseUrl+'/i18n-map',{
    params:{
      time:new Date().getTime()
    }
  })
}

//获取国际化列表
export const getI18nList = function(data){
  return axios.get(baseUrl+'/basic/i18n',{
    params:{
      sort:data.sort,//字符串，可以是数组，排序列名称
      order:data.order,//字符串，可以是数组，排序列顺序或者逆序
      page:data.page,//整数，分页查询第几页
      rows:data.rows,//整数，分页行数
      time:new Date().getTime()
    }
  })
}
//国际化批量添加
export const i18nBatch= function(data){
  return axios.post(baseUrl+'/basic/i18n/batch',{
    group:data.group,   //
    locale:data.locale,   //
    content:data.content, //
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;;charset=UTF-8'},
    traditional:true})
}
//刷新国际化缓存
export const i18nRefresh = function(){
  return axios.post(baseUrl+'/basic/i18n/refresh',{
    params:{
      time:new Date().getTime()
    }
  })
}

export const getUserSelfInfo = function(){
  return axios.get(baseUrl+'/org/user/self',{
      params: {
          time:new Date().getTime()
      }
  });
}

/*登陆*/
export const loginAjax = function(data){
  return axios.post(baseUrl+'/login',qs.stringify({
      username:data.username,
      password:data.password,
      time:new Date().getTime()
  }),{traditional:true});
}