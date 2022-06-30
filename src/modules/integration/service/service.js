import axios from 'axios'
import {baseUrl,sysEnv} from '@/modules/integration/config/env'
import qs from 'qs';
//全局设置超时时间 120s

axios.defaults.timeout = 120000;
axios.defaults.withCredentials = false ;

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if(config.url && config.url.indexOf('/login') == -1){
    // if(sysEnv == 0){
    //     config.headers['eco-pub-auth-token'] =  ecoPubAuthToken ;
    // }else if(sysEnv == 1){
    config.headers['eco-auth-token'] =  sessionStorage.getItem('ecoToken');
    // }
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
      parent.window.sysvm.$message.error({
        showClose: true,
        message: err.response.data,
        type: 'error'
      })
      parent.window.sysvm.logout();
    }
  }
  return Promise.reject(err);
})



export const loginAjax = function(){
  return axios.post(baseUrl+'/login',qs.stringify({
    username:'econage',
    password:'123456',
    time:new Date().getTime()
  }),{traditional:true});
}


//添加angent

export const addAgent = function(data){
  return axios.post(baseUrl+'/eims/agent-host/',{
    name:data.name,
    comment:data.comment,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;;charset=UTF-8'},
    traditional:true});
}

//获取agent分页列表


export const getAgentList = function(data){
  return axios.get(baseUrl+'/eims/agent-host/pagination',{
    params:{
      sort:data.sort,
      order:data.order,
      page:data.page,
      rows:data.rows,
      name:data.name,
      agentLinkHost:data.agentLinkHost,
      time:new Date().getTime(),
    }
  })
}

//删除agent
export const deleteAgent = function(id){
  return axios.patch(baseUrl+'/eims/agent-host/'+id+'/disable',{
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;;charset=UTF-8'},
    traditional:true});
}

export const getAgentInfo = function(id){
  return axios.get(baseUrl+'/eims/agent-host/'+id,{
    params:{
      time:new Date().getTime()
    }
  })
}


//修改单条
export const editAgent = function(id,data){
  return axios.put(baseUrl+'/eims/agent-host/'+id,{
    name:data.name,
    comment:data.comment,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;;charset=UTF-8'},
    traditional:true});
}

//获取用户基本信息
export const getUserInfoAjax = function(){
  return axios.get(baseUrl+'/org/user/self',{
    params: {
      time:new Date().getTime()
    }
  });
}
