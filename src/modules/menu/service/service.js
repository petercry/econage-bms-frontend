import axios from 'axios'
import {baseUrl,sysEnv} from '@/modules/menu/config/env'
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
      parent.window.sysvm.logout();
    }
  }
  return Promise.reject(err);
})



export const loginAjax = function(){
  return axios.post(baseUrl+'/login',qs.stringify({
      username:'econage',
      password:'e473b4f3bbd044f073d113e35f4373ac7c7e96c2a5c9e66db4b51ae43daa8abf',
      time:new Date().getTime()
  }),{traditional:true});
}

//自定义菜单Tree接口
export const getCustomMenuTree = function(){
  return axios.get(baseUrl+'/sys-menu',{
    params:{
      time:new Date().getTime()
    }
  })
}
//获取菜单类型
export const getMenuType = function(){
  return axios.get(baseUrl+'/sys-menu/menu-type-map',{
    params:{
      time:new Date().getTime()
    }
  })
}
//获取菜单使用的模块列表
export const getModularList = function(){
  return axios.get(baseUrl+'/modular-def-list-4-menu-config',{
    params:{
      time:new Date().getTime()
    }
  })
}

//获取可选国际化信息
export const getI18nList = function(){
  return axios.get(baseUrl+'/basic/i18n',{
    params:{
      sort:'',//字符串，可以是数组，排序列名称
      order:'',//字符串，可以是数组，排序列顺序或者逆序
      page:1,//整数，分页查询第几页
      rows:9999,//整数，分页行数
      time:new Date().getTime()
    }
  })
}
// //菜单初始化获取配置
// export const getInitConfig = function(){
//   return axios.get(baseUrl,{
//     params:{
//       cmd:"v3.menu",
//       _method:"getInitConfig",
//       time:new Date().getTime()
//     }
//   })
// }
//根据ID获取某个菜单详情
export const getCustomMenuDetail = function(id){
  return axios.get(baseUrl+'/sys-menu/'+id,{
    params:{
      time:new Date().getTime()
    }
  })
}
//添加菜单
export const addCustomSysMenuItem= function(data){
  return axios.post(baseUrl+'/sys-menu',{
    id:data.id,   //菜单id
    name:data.name,   //菜单名称
    i18nKey:data.i18nKey,   //国际化key
    parentId:data.parentId, //上级节点
    type:data.type, //对应模块类型
    component:data.component,     //对应模块类型ID
    href:data.href,           //链接路径
    iconCls:data.iconCls,   //图片名称
    desc:data.desc, //备注
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;;charset=UTF-8'},
    traditional:true})
}

//修改菜单
export const updateCustomSysMenuItem= function(data){
  return axios.put(baseUrl+'/sys-menu/'+data.id,{
    menuId:data.id,
    name:data.name,   //菜单名称
    i18nKey:data.i18nKey,   //国际化key
    parentId:data.parentId, //上级节点
    type:data.type, //对应模块类型
    component:data.component,     //对应模块类型ID
    href:data.href,           //链接路径
    iconCls:data.iconCls,   //图片名称
    desc:data.desc, //备注
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;;charset=UTF-8'},
    traditional:true
  })
}

//自定义删除
export const deleteCustomSysMenuItem= function(id){
  return axios.delete(baseUrl+'/sys-menu/'+id,{
    data:qs.stringify({
      time:new Date().getTime()
    },{arrayFormat:'repeat'}),
    traditional:true})
}

//拖拽菜单 
export const dndCustomSysMenuItem= function(data){
  return axios.patch(baseUrl+'/sys-menu/'+data.id+'/dnd',qs.stringify({
    targetId: data.targetId,//字符串，目标菜单ID
    point: data.point,//字符串，对应的操作（append：作为放入目标节点子节点；top：与目标节点同级，并前置；bottom：与目标节点同级，并后置）
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true})
}
