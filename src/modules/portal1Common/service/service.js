import axios from 'axios'
import {baseUrl,ecoPubAuthToken,sysEnv} from '@/modules/portal1Common/config/env'
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
      username:'17826806703',
      password:'1234abcd',
      time:new Date().getTime()
  }),{traditional:true});
}

//办件的导入接口
export const instanceExcelImport= function(){
  return baseUrl+'/portal1/item/instance/excel-import'
}

//办件权限-添加
export const instancePrivilegeAddAjax = function(data){
  return axios.post(baseUrl+'/portal1/item/instance-privilege',{
    order:data.order,
    name:data.name,
    comment:data.comment,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//办件权限-更新单个
export const instancePrivilegeEditAjax = function(data){
  return axios.put(baseUrl+'/portal1/item/instance-privilege',{
    id:data.id,
    order:data.order,
    name:data.name,
    comment:data.comment,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}

//办件权限-设置人员
export const instancePrivilegeResetUserAjax = function(data){
  return axios.put(baseUrl+'/portal1/item/instance-privilege/reset-user',{
    id:data.id,
    users:data.users,
    userScopes:data.userScopes,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//办件权限-设置角色
export const instancePrivilegeResetRoleAjax = function(data){
  return axios.put(baseUrl+'/portal1/item/instance-privilege/reset-role',{
    id:data.id,
    coverRoleSubDept:data.coverRoleSubDept,
    roles:data.roles,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//办件权限-删除
export const instancePrivilegeDeleteBatchAjax= function(id){
  return axios.delete(baseUrl+'/portal1/item/instance-privilege',{
    params:{
      id:id,
      time:new Date().getTime()
    },  
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    },
    traditional:true
  })
}


//办件权限 列表查询
export const getInstancePrivilegeList= function(){
  return axios.get(baseUrl+'/portal1/item/instance-privilege/list',{
    params:{
      time:new Date().getTime()
    }
  })
}

//办件权限 
export const getInstancePrivilegeSingle= function(id){
  return axios.get(baseUrl+'/portal1/item/instance-privilege/single',{
    params:{
      id:id,
      time:new Date().getTime()
    }
  })
}