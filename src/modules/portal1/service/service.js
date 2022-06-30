import axios from 'axios'
import {baseUrl,ecoPubAuthToken,sysEnv} from '@/modules/portal1/config/env'
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

//主题------查询单个主题
export const getTitleSingle = function(id){
  return axios.get(baseUrl+'/portal1/title/'+id,{
    params:{
      time:new Date().getTime()
    }
  })
}

//主题------查询所有主题
export const getTitleAll = function(){
  return axios.get(baseUrl+'/portal1/title',{
    params:{
      time:new Date().getTime()
    }
  })
}

//主题------添加主题
export const addTitle= function(data){
  return axios.post(baseUrl+'/portal1/title',{
    enabledInCreate:data.enabledInCreate,   
    enabledInSelect:data.enabledInSelect,   
    name:data.name, 
    desc:data.desc, 
  },{
    headers: {'Content-Type': 'application/json;;charset=UTF-8'},
    traditional:true})
}
//主题------更新主题
export const updateTitle= function(id,data){
  return axios.put(baseUrl+'/portal1/title/'+id,{
    enabledInCreate:data.enabledInCreate,   
    enabledInSelect:data.enabledInSelect,   
    name:data.name, 
    desc:data.desc, 
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true})
}
//主题------拖拽排序主题
export const dndTitle= function(id,data){
  return axios.patch(baseUrl+'/portal1/title/'+id+'/dnd',qs.stringify({
    targetId: data.targetId,//字符串，目标菜单ID
    point: data.point,//字符串，对应的操作（append：作为放入目标节点子节点；top：与目标节点同级，并前置；bottom：与目标节点同级，并后置）
  },{arrayFormat:'repeat'}),{traditional:true})
}

//主题------删除主题
export const delTitle = function(id){
  return axios.delete(baseUrl+'/portal1/title',{
    params:{
      id:id,
      time:new Date().getTime()
    }
  })
}

//主项------查询单个主项
export const getGroupSingle = function(id){
  return axios.get(baseUrl+'/portal1/group/'+id,{
    params:{
      time:new Date().getTime()
    }
  })
}

//主项------查询主题的主项列表
export const getGroupByTitle = function(titleId){
  return axios.get(baseUrl+'/portal1/group/by-title/'+titleId,{
    params:{
      time:new Date().getTime()
    }
  })
}


//主项------添加主项
export const addGroup= function(data){
  return axios.post(baseUrl+'/portal1/group',{
    titleId:data.titleId,
    enabledShow:data.enabledShow,
    enabledInCreate:data.enabledInCreate,   
    enabledInSelect:data.enabledInSelect,   
    name:data.name, 
    desc:data.desc, 
  },{
    headers: {'Content-Type': 'application/json;;charset=UTF-8'},
    traditional:true})
}
//主项------更新主项
export const updateGroup= function(id,data){
  return axios.put(baseUrl+'/portal1/group/'+id,{
    titleId:data.titleId,
    enabledShow:data.enabledShow,
    enabledInCreate:data.enabledInCreate,   
    enabledInSelect:data.enabledInSelect,   
    name:data.name, 
    desc:data.desc, 
  },{
    headers: {'Content-Type': 'application/json;;charset=UTF-8'},
    traditional:true})
}
//主项------主项不显示
export const disableGroup= function(id){
  return axios.post(baseUrl+'/portal1/group/disable',{
    id:data.id
  },{
    headers: {'Content-Type': 'application/json;;charset=UTF-8'},
    traditional:true})
}
//主项------拖拽排序主项
export const dndGroup= function(id,data){
  return axios.patch(baseUrl+'/portal1/group/'+id+'/dnd',qs.stringify({
    targetId: data.targetId,//字符串，目标菜单ID
    point: data.point,//字符串，对应的操作（append：作为放入目标节点子节点；top：与目标节点同级，并前置；bottom：与目标节点同级，并后置）
  },{arrayFormat:'repeat'}),{traditional:true})
}

//主项------删除主项
export const delGroup = function(id){
  return axios.delete(baseUrl+'/portal1/group',{
    params:{
      id:id,
      time:new Date().getTime()
    }
  })
}

//主题------事项添加页面主题列表
export const getTitleList4create = function(){
  return axios.get(baseUrl+'/portal1/title/list4create',{
    params:{
      time:new Date().getTime()
    }
  })
}
//主题------事项列表页面主题列表
export const getTitleList4select = function(interfaceType){
  return axios.get(baseUrl+'/portal1/title/list4select',{
    params:{
      interfaceType:interfaceType||null,//MODIFY
      time:new Date().getTime()
    }
  })
}

//主题------事项列表页面主题列表（事项不为空）
export const getTitlelistInItem = function(){
  return axios.get(baseUrl+'/portal1/title/listInItem',{
    params:{
      time:new Date().getTime()
    }
  })
}

//主项------事项添加页面主项列表
export const getGroupList4createByTitle = function(id){
  return axios.get(baseUrl+'/portal1/group/by-title-in-create/'+id,{
    params:{
      time:new Date().getTime()
    }
  })
}


//应用------列表
export const getAppList = function(){
  return axios.get(baseUrl+'/external-app/portal-available-list',{
    params:{
      time:new Date().getTime()
    }
  })
}

//应用------列表
export const getAppAll = function(data){
  return axios.get(baseUrl+'/external-app/pagination',{
    params:{
      sort:data&&data.sort||'modDate',//字符串，可以是数组，排序列名称
      order:data&&data.order||'desc',//字符串，可以是数组，排序列顺序或者逆序
      page:data&&data.page||1,//整数，分页查询第几页
      rows:data&&data.rows||99999,//整数，分页行数
      time:new Date().getTime()
    }
  })
}

//应用-详情
export const getAppItem = function(id){
  return axios.get(baseUrl+'/external-app/'+id,{
    params:{
      time:new Date().getTime()
    }
  })
}

//应用-添加
export const appAddAjax = function(data){
  return axios.post(baseUrl+'/external-app',{
    appName:data.appName,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//应用-修改
export const appEditAjax = function(id,data){
  return axios.put(baseUrl+'/external-app/'+id,{
    appName:data.appName,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//应用------删除应用
export const delApp = function(id){
  return axios.delete(baseUrl+'/external-app',{
    params:{
      id:id,
      time:new Date().getTime()
    }
  })
}
//应用 公共密钥-详情
export const getAppPubkeyStore = function(id){
  return axios.get(baseUrl+'/app-pub-key-store/'+id,{
    params:{
      time:new Date().getTime()
    }
  })
}

//应用 公共密钥-新增或者更改应用公共秘钥配置
export const editAppPubkeyStoreAjax = function(id,data){
  return axios.post(baseUrl+'/app-pub-key-store/'+id,{
    valid:data.valid,
    allUserAccessible:data.allUserAccessible,
    canSso:data.canSso,
    members:data.members,
    pubKey:data.pubKey,
    checkExpire:data.checkExpire,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}

//应用 oauth2-新密钥
export const getAppOauth2NewKey = function(){
  return axios.get(baseUrl+'/app-oauth2/fetch-secret',{
    params:{
      time:new Date().getTime()
    },
    transformResponse: [function (data) {
      // 对 data 进行任意转换处理
      return data;
    }]
  })
}
//应用 oauth2-详情
export const getAppOauth2 = function(id){
  return axios.get(baseUrl+'/app-oauth2/'+id,{
    params:{
      time:new Date().getTime()
    }
  })
}

//应用 oauth2-修改
export const editAppOauth2Ajax = function(id,data){
  return axios.post(baseUrl+'/app-oauth2/'+id,{
    valid:data.valid,
    redirectHost:data.redirectHost,
    redirectHost4Mobile:data.redirectHost4Mobile,
    secret:data.secret,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}

//应用----oauth2--url
export const getOauth2Url = function(appId){
  return axios.get(baseUrl+'/external-app/oauth2-login-url/'+appId,{
    params:{
      time:new Date().getTime()
    }
  })
}

//应用----oauth2--token
export const getAppToken = function(appId){
  return axios.get(baseUrl+'/org/user/self-oauth2-token',{
    params:{
      appId:appId,
      time:new Date().getTime()
    }
  })
}

//应用门户------列表
export const getAppPortalAll = function(data){
  return axios.get(baseUrl+'/external-app/portal-pagination',{
    params:{
      // sort:data&&data.sort||'modDate',//字符串，可以是数组，排序列名称
      // order:data&&data.order||'desc',//字符串，可以是数组，排序列顺序或者逆序
      page:data&&data.page||1,//整数，分页查询第几页
      rows:data&&data.rows||99999,//整数，分页行数
      time:new Date().getTime()
    }
  })
}


//应用门户-添加
export const appPortalAddAjax = function(data){
  return axios.post(baseUrl+'/external-app/portal',{
    appName:data.appName,
    oauth2:data.oauth2,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//应用门户-修改
export const appPortalEditAjax = function(id,data){
  return axios.put(baseUrl+'/external-app/portal/'+id,{
    appName:data.appName,
    oauth2:data.oauth2,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//应用门户------作废
export const delAppPortal = function(id){
  return axios.patch(baseUrl+'/external-app/portal-disable',qs.stringify({
    id: id,
  },{arrayFormat:'repeat'}),{traditional:true})
}

//事项------内容类别查询
export const getDetailEntry = function(){
  return axios.get(baseUrl+'/portal1/detail-entry',{
    params:{
      time:new Date().getTime()
    }
  })
}


//事项------查询单个事项
export const getItemSingle = function(id){
  return axios.get(baseUrl+'/portal1/item/'+id,{
    params:{
      time:new Date().getTime()
    }
  })
}

//事项------事项列表分页查询 （有权限后被删除）
// export const getGroupItemViewList = function(data){
//   return axios.get(baseUrl+'/portal1/group-item-view/pagination',{
//     params:{
//       page:data.page,
//       rows:data.rows,
//       dept:data.dept,
//       titleId:data.titleId,
//       enableHandleOnline:data.enableHandleOnline,
//       enableHandleOnMobile:data.enableHandleOnMobile,
//       name:data.name,
//       time:new Date().getTime()
//     }
//   })
// }

//事项------事项列表（查看权限）
export const getGroupItemSelectViewList = function(data){
  return axios.get(baseUrl+'/portal1/group-item-view/select-view',{
    params:{
      page:data.page,
      rows:data.rows,
      dept:data.dept,
      titleId:data.titleId,
      enableHandleOnline:data.enableHandleOnline,
      enableHandleOnMobile:data.enableHandleOnMobile,
      name:data.name,
      time:new Date().getTime()
    }
  })
}


//事项------事项列表分页查询
export const getGroupItemUpdateViewList = function(data){
  return axios.get(baseUrl+'/portal1/group-item-view/update-view',{
    params:{
      page:data.page,
      rows:data.rows,
      dept:data.dept,
      titleId:data.titleId,
      enableHandleOnline:data.enableHandleOnline,
      enableHandleOnMobile:data.enableHandleOnMobile,
      name:data.name,
      time:new Date().getTime()
    }
  })
}

//事项------事项权限设置获取
export const getItemAuthConfig= function(id){
  return axios.get(baseUrl+'/portal1/item-auth/'+id+'/list-by-item',{
    params:{
      time:new Date().getTime()
    }
  })
}
//事项------事项权限设置
export const saveItemAuthConfig= function(id,arr){
  return axios.put(baseUrl+'/portal1/item-auth/'+id+'/auth-config',arr,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}

//事项------添加事项
export const addItem= function(data){
  return axios.post(baseUrl+'/portal1/item',{
    name:data.name, 
    dept:data.dept, 
    titleId:data.titleId, 
    linkAppId:data.linkAppId, 
    linkAppCode:data.linkAppCode, 
    handleUrl4Pc:data.handleUrl4Pc, 
    handleUrl4Mobile:data.handleUrl4Mobile, 
    enableHandleGuide:data.enableHandleGuide, 
    enableHandleOnline:data.enableHandleOnline, 
    enableHandleOnMobile:data.enableHandleOnMobile, 
    groupId:data.groupId, 
    desc:data.desc, 
    handleMethod:data.handleMethod, 
    handleTips:data.handleTips, 
    attr2:data.attr2, 
    attr6:data.attr6, 
    innerInteraction:data.innerInteraction, 
    interactionModularId:data.interactionModularId, 
    detailTexts:data.detailTexts, 
    detailFiles:data.detailFiles, 
    extProps:data.extProps, 
    extOrgs:data.extOrgs, 
  },{
    headers: {'Content-Type': 'application/json;;charset=UTF-8'},
    traditional:true})
}
//事项------更新事项
export const updateItem= function(id,data){
  return axios.put(baseUrl+'/portal1/item/'+id,{
    name:data.name, 
    dept:data.dept, 
    titleId:data.titleId, 
    linkAppId:data.linkAppId, 
    linkAppCode:data.linkAppCode, 
    handleUrl4Pc:data.handleUrl4Pc, 
    handleUrl4Mobile:data.handleUrl4Mobile, 
    enableHandleGuide:data.enableHandleGuide, 
    enableHandleOnline:data.enableHandleOnline, 
    enableHandleOnMobile:data.enableHandleOnMobile, 
    groupId:data.groupId, 
    desc:data.desc, 
    handleMethod:data.handleMethod, 
    handleTips:data.handleTips, 
    attr2:data.attr2, 
    attr6:data.attr6, 
    innerInteraction:data.innerInteraction, 
    interactionModularId:data.interactionModularId, 
    detailTexts:data.detailTexts, 
    detailFiles:data.detailFiles,
    extProps:data.extProps, 
    extOrgs:data.extOrgs, 
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true})
}

//事项------事项附件获取id
export const getItemFileFetchId = function(){
  return axios.get(baseUrl+'/portal1/item-detail-file/fetchId',{
    params:{
      time:new Date().getTime()
    }
  })
}

//事项------拖拽排序事项
export const dndItem= function(id,data){
  return axios.patch(baseUrl+'/portal1/item/'+id+'/dnd',qs.stringify({
    targetId: data.targetId,//字符串，目标菜单ID
    point: data.point,//字符串，对应的操作（append：作为放入目标节点子节点；top：与目标节点同级，并前置；bottom：与目标节点同级，并后置）
  },{arrayFormat:'repeat'}),{traditional:true})
}

//事项------删除事项
export const delItem = function(id){
  return axios.delete(baseUrl+'/portal1/item',{
    params:{
      id:id,
      time:new Date().getTime()
    }
  })
}

//事项------事项数量
export const getItemCount = function(){
  return axios.get(baseUrl+'/portal1/group-item-view/count',{
    params:{
      time:new Date().getTime()
    }
  })
}

//事项------查询某个主项的事项列表 (排序可用)
export const getItemsByGroup = function(groupId){
  return axios.get(baseUrl+'/portal1/item/by-group/'+groupId,{
    params:{
      time:new Date().getTime()
    }
  })
}

//事项------事项在线办理
export const getItemOnlineUrl = function(entityId){
  return axios.get(baseUrl+'/portal1/item/'+entityId+'/online-handle-url',{
    params:{
      time:new Date().getTime()
    }
  })
}

//事项------事项掌上办理
export const getItemMobileUrl = function(entityId){
  return axios.get(baseUrl+'/portal1/item/'+entityId+'/mobile-handle-url',{
    params:{
      time:new Date().getTime()
    }
  })
}

//钉钉------查看配置文件里是否开启了钉钉同步，一般默认没有开启
export const getDingSync = function(){
  return axios.get(baseUrl+'/hr/dingding/open/setting',{
    params:{
      time:new Date().getTime()
    }
  })
}

//钉钉------同步
export const configDingSync= function(){
  return axios.post(baseUrl+'/hr/dingding-sync',{
  },{
    headers: {'Content-Type': 'application/json;;charset=UTF-8'},
    traditional:true})
}

//用户角色------权限
export const getRoleExists = function(role){
  return axios.get(baseUrl+'/org/user/personal/role/is-exists/'+role,{
    params:{
      time:new Date().getTime()
    }
  })
}

// //用户角色------权限
// export const getRoleExists = function(role){
//   return axios.get(baseUrl+'/org/user/personal/role/is-exists-anyone-or-admin',{
//     params:{
//       'role-def':role,
//       time:new Date().getTime()
//     },
//     paramsSerializer: function(params) {
//       return qs.stringify(params, {arrayFormat: 'repeat'})
//     },
//   })
// }
//枚举新增可用
export const getEnumCreateEnabled = function(id){
  return axios.get(baseUrl+'/basic/kv/group/'+id+'/detail/create-enabled',{
    params:{
      time:new Date().getTime()
    }
  })
}

//枚举修改可用
export const getEnumUpdateEnabled = function(id){
  return axios.get(baseUrl+'/basic/kv/group/'+id+'/detail/update-enabled',{
    params:{
      time:new Date().getTime()
    }
  })
}

//枚举查询可用
export const getEnumSelectEnabled = function(id){
  return axios.get(baseUrl+'/basic/kv/group/'+id+'/detail/select-enabled',{
    params:{
      time:new Date().getTime()
    }
  })
}

//事项汇总表
export const getTitleItemCount= function(data){
  return axios.get(baseUrl+'/portal1/title-item-view',{
    params:{
      createDateFrom: data.createDateFrom,
      createDateTo: data.createDateTo,
      time:new Date().getTime()
    }
  })
}

//提示方式
export const getItemHandleMethodEnum= function(){
  return axios.get(baseUrl+'/portal1/item/handle-method-enum',{
    params:{
      time:new Date().getTime()
    }
  })
}

//内部可用模块列表
export const getItemInnerInteractionModList= function(){
  return axios.get(baseUrl+'/portal1/item/inner-interaction-modular-list',{
    params:{
      time:new Date().getTime()
    }
  })
}
