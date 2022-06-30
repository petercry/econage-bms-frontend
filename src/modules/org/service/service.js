import axios from 'axios'
import {baseUrl,sysEnv} from '../config/env'
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
    if(err.response && err.response.data){
      err.message = err.message +','+ err.response.data
    }
    if (err.response.status==401){
      try {
      parent.window.sysvm.$message.error({
        showClose: true,
        message: err.response.data,
        type: 'error'
      })
      parent.window.sysvm.logout();
      } catch (error) { }
      document.documentElement.className = 'hideVis';
    }
  }
  return Promise.reject(err);
})



export const loginAjax = function(){
  return axios.post(baseUrl+'/login',qs.stringify({
      username:'econage',
      password:'d65c8f44ad589fa04842d73fedc23d5d72123cd5f082d3c582b5684508f45b95',
      time:new Date().getTime()
  }),{traditional:true});
}

//------查询配置
export const getUnionSetting = function(){
  return axios.get(baseUrl+'/public/setting/union',{
    params:{
      time:new Date().getTime()
    }
  })
}

//自定义菜单Tree接口
export const getCustomMenuTree = function(){
  return axios.get(baseUrl+'/sys-menu',{
    params:{
      time:new Date().getTime()
    }
  })
}

//角色-角色定义列表
export const getRoleList = function(){
  return axios.get(baseUrl+'/role/def',{
    params:{
      time:new Date().getTime()
    }
  })
}

/*获取角色定义枚举*/
export const getRoleTypeEnum = function(){
  return axios.get(baseUrl+'/role/def/type-enum',{
    params:{
      time:new Date().getTime()
    }
  })
}



//角色-角色添加
export const addRole = function(data){
  return axios.post(baseUrl+'/role/def',{
      code:data.code,
      name:data.name,
      type:data.type,
      i18nKey:data.i18nKey,
      order:data.order,
      i18nText:data.i18nText,
      time:new Date().getTime()
  },{
      headers: {'Content-Type': 'application/json;charset=UTF-8'},
      traditional:true
  })
}
//角色-角色修改
export const editRole = function(data){
  return axios.put(baseUrl+'/role/def/'+data.code,{
    code:data.code,
    name:data.name,
    type:data.type,
    i18nKey:data.i18nKey,
    order:data.order,
    i18nText:data.i18nText,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//@todo 后台可能注释了
//角色-角色删除
export const deleteRole= function(code){
  return axios.delete(baseUrl+'/role/def/'+code,qs.stringify({
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true})
}

//获取用户组列表
export const getUserGroupList = function(data){
  return axios.get(baseUrl+'/user-group/pagination',{
    params:{
      sort:data.sort,//字符串，可以是数组，排序列名称
      order:data.order,//字符串，可以是数组，排序列顺序或者逆序
      page:data.page,//整数，分页查询第几页
      rows:data.rows,//整数，分页行数
      time:new Date().getTime()
    }
  })
}
//获取用户组 单个
export const getUserGroupSingle = function(id){
  return axios.get(baseUrl+'/user-group/'+id,{
    params:{
      time:new Date().getTime()
    }
  })
}


//获取用户组列表
export const getUserGroupMulti = function(orgIdArray){
  return axios.get(baseUrl+'/user-group/multi',{
    params:{
        id:orgIdArray,
        time:new Date().getTime()
    },
    // 主要是以下四行代码
    paramsSerializer: function(params) {
        const id= params.id.map(_=>`id=${_}`).join('&');
        return `${id}` ;
    }
  })
}


//用户组-失效
export const disableGroup = function(id){
  return axios.patch(baseUrl+'/user-group/'+id+'/disable',qs.stringify({
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true})
}
//用户组-生效
export const enableGroup = function(id){
  return axios.patch(baseUrl+'/user-group/'+id+'/enable',qs.stringify({
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true})
}

//用户组-用户组添加
export const addGroup = function(data){
  return axios.post(baseUrl+'/user-group',{
    code:data.code,
    name:data.name,
    comments:data.comments,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//用户组-用户组修改
export const editGroup = function(data){
  return axios.put(baseUrl+'/user-group/'+data.id,{
    code:data.code,
    name:data.name,
    comments:data.comments,
    member:data.member,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//获取用户组 单个 菜单ids
export const getUserGroupMenuIds = function(id){
  return axios.get(baseUrl+'/user-group/'+id+'/menu-ids',{
    params:{
      time:new Date().getTime()
    }
  })
}
//用户组 单个 菜单保存
export const saveUserGroupMenuIds = function(id,menuIds){
  return axios.put(baseUrl+'/user-group/'+id+'/menu-ids',qs.stringify({
    menuIds:menuIds,
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true})
}
//获取用户组 单个 模块配置
export const getUserGroupModularConfig= function(id){
  return axios.get(baseUrl+'/user-group/'+id+'/modular-config',{
    params:{
      time:new Date().getTime()
    }
  })
}
//用户组 单个 模块配置修改
export const saveGroupModularConfig = function(id,arr){
  return axios.put(baseUrl+'/user-group/'+id+'/modular-config',arr,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//用户组 单个 角色配置
export const getGroupRoleConfig= function(id){
  return axios.get(baseUrl+'/user-group/'+id+'/role-config',{
    params:{
      time:new Date().getTime()
    }
  })
}
//用户组 角色配置添加
export const addGroupRoleConfig = function(id,data){
  return axios.post(baseUrl+'/user-group/'+id+'/role-config',{
    role:data.role,
    roleScope:data.roleScope,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//用户组 角色配置修改
export const editGroupRoleConfig = function(id,orgRoleId,data){
  return axios.put(baseUrl+'/user-group/'+id+'/role-config/'+orgRoleId,{
    role:data.role,
    roleScope:data.roleScope,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//用户组 角色配置删除
export const deleteGroupRole= function(id,orgRoleId){
  return axios.delete(baseUrl+'/user-group/'+id+'/role-config/'+orgRoleId,qs.stringify({
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true})
}
//用户组 单个 成员配置
// export const getGroupMemberConfig= function(id,data){
//   return axios.get(baseUrl+'/user-group/'+id+'/member-config',{
//     params:{
//       // page=1&rows=60&sort=modDate&order=desc
//       sort:data.sort,//字符串，可以是数组，排序列名称
//       order:data.order,//字符串，可以是数组，排序列顺序或者逆序
//       page:data.page,//整数，分页查询第几页
//       rows:data.rows,//整数，分页行数
//       time:new Date().getTime()
//     }
//   })
// }
//用户组 成员配置添加
export const addGroupMember= function(id,userId){
  return axios.post(baseUrl+'/user-group/'+id+'/member-config',qs.stringify({
    userId:userId,
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true})
}

//用户组 成员配置删除
export const deleteGroupMember= function(id,userIds){
  return axios.delete(baseUrl+'/user-group/'+id+'/member-config',{
    data:qs.stringify({
      userId:userIds,
      time:new Date().getTime()
    },{arrayFormat:'repeat'}),
    traditional:true,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  })
}

//用户组 查询 成员配置
export const getGroupMemberConfig= function(id){
  return axios.get(baseUrl+'/user-group/'+id+'/member-config',{
    params:{
      time:new Date().getTime()
    }
  })
}
//用户组 成员配置修改
export const saveGroupMember= function(id,arr){
  return axios.post(baseUrl+'/user-group/'+id+'/member-config',arr,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}



export const getBasicKvGroupDetail = function(id){
  return axios.get(baseUrl+'/basic/kv/group/'+id+'/detail',{
    params:{
        time:new Date().getTime()
    }
  })
}

//获取部门机构 部门等级
export const getOrgDeptLevel = function(id){
  
  
  return axios.get(baseUrl+'/org/dept/dept-level-map',{
    params:{
        time:new Date().getTime()
    }
  })


}
//获取部门机构 列表 按父节点查找
export const getOrgDeptList = function(id){
  return axios.get(baseUrl+'/org/dept/'+id+'/sub-all-status',{
    params:{
      time:new Date().getTime()
    }
  })
}
//获取部门机构 选择列表 按父节点查找
export const getOrgDeptSelectList = function(id,data){
  return axios.get(baseUrl+'/org/tree-select/'+id+'/sub',{
    params:{
      selectScope:(data&&data.selectScope)||['DEPT','USER'],
      deptScopeType:(data&&data.deptScopeType)||'BUSINESS',
      time:new Date().getTime()
    },
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    },
  })
}
//获取部门机构 选择列表 搜索
export const getOrgDeptSelectSearchList = function(str,type){
  return axios.get(baseUrl+'/org/tree-select',{
    params:{
      unifiedSearch:str,
      scope:type,
      time:new Date().getTime()
    }
  })
}
//部门-添加
export const addDept = function(data){
  return axios.post(baseUrl+'/org/dept',{
    code:data.code,
    name:data.name,
    comments:data.comments,
    address:data.address,
    contactName:data.contactName,
    i18nKey:data.i18nKey,
    level:data.level,
    branch:data.branch,
    ignoreHrSync:data.ignoreHrSync,
    parentId:data.parentId,
    pyFull:data.pyFull,
    pyIdx:data.pyIdx,
    telephone:data.telephone,
    status:data.status,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//部门-编辑
export const editDept = function(data,id){
 
  return axios.put(baseUrl+'/org/dept/'+id,{
    code:data.code,
    name:data.name,
    comments:data.comments,
    address:data.address,
    contactName:data.contactName,
    i18nKey:data.i18nKey,
    levelV2:data.levelV2,
    branch:data.branch,
    ignoreHrSync:data.ignoreHrSync,
    parentId:data.parentId,
    pyFull:data.pyFull,
    pyIdx:data.pyIdx,
    telephone:data.telephone,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//部门-失效
export const disableDept = function(id){
  return axios.patch(baseUrl+'/org/dept/'+id+'/disable',qs.stringify({
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true})
}
//部门-生效
export const enableDept = function(id){
  return axios.patch(baseUrl+'/org/dept/'+id+'/enable',qs.stringify({
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true})
}


//拖拽部门 
export const drapDeptNode = function(data){
    return axios.patch(baseUrl+'/org/dept/'+data.id+'/dnd',qs.stringify({
      targetId: data.targetId,//字符串，目标菜单ID
      point: data.point,//字符串，对应的操作（append：作为放入目标节点子节点；top：与目标节点同级，并前置；bottom：与目标节点同级，并后置）
      time:new Date().getTime()
    },{arrayFormat:'repeat'}),{traditional:true})
}

//人员信息 获取某部门人员列表
export const getUserListInDept= function(deptId){
  return axios.get(baseUrl+'/org/user/config/list-in-dept',{
    params:{
      deptId:deptId,
      time:new Date().getTime()
    }
  })
}
//人员-添加
export const addUser = function(data){
  return axios.post(baseUrl+'/org/user',{
    alias:data.alias,
    emId:data.emId,
    deptId4Config:data.deptId4Config,
    comments:data.comments,
    email:data.email,
    mi:data.mi,
    pyFull:data.pyFull,
    pyIdx:data.pyIdx,
    ssn:data.ssn,
    mobilePhone:data.mobilePhone,
    ignoreHrSync:data.ignoreHrSync,
    hrLink:data.hrLink,
    hrAccount:data.hrAccount,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//人员-编辑 
export const editUser = function(id,data){
  return axios.put(baseUrl+'/org/user/'+id,{
    alias:data.alias,
    emId:data.emId,
    deptId4Config:data.deptId4Config,
    comments:data.comments,
    email:data.email,
    mi:data.mi,
    pyFull:data.pyFull,
    pyIdx:data.pyIdx,
    ssn:data.ssn,
    mobilePhone:data.mobilePhone,
    ignoreHrSync:data.ignoreHrSync,
    hrLink:data.hrLink,
    hrAccount:data.hrAccount,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//人员信息 获取人员详情
export const getUserDetail= function(id){
  return axios.get(baseUrl+'/org/user/'+id,{
    params:{
      time:new Date().getTime()
    }
  })
}
//人员信息 成员引用
export const addUserLink= function(deptId,userId){
  return axios.post(baseUrl+'/org/user/config/dept-link',qs.stringify({
    deptId:deptId,
    userId:userId,
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true})
}
//人员信息 成员引用删除
export const deleteUserLink= function(deptId,userId){
  return axios.delete(baseUrl+'/org/user/config/dept-link',{
    data:qs.stringify({
      deptId:deptId,
      userId:[userId],
      time:new Date().getTime()
    },{arrayFormat:'repeat'}),
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    traditional:true},)
}
//人员信息-失效并作废账号
export const disableUser = function(id){
  return axios.put(baseUrl+'/org/user/disable?userId='+id,qs.stringify({
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true})
}
//人员信息-生效
export const enableUser = function(id){
  return axios.put(baseUrl+'/org/user/enable?userId='+id,qs.stringify({
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true})
}

//人员信息-账号 编辑
export const editAccount = function(data){
  return axios.put(baseUrl+'/org/account/'+data.userId,{
    accountExpiration:data.accountExpiration,
    newPwd:data.newPwd,
    status:data.status,
    themePackage:data.themePackage,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//账号 获取账号状态类型
export const getAccountStatusMap = function(){
  return axios.get(baseUrl+'/org/account/account-status-map',{
    params:{
      time:new Date().getTime()
    }
  })
}

//账号 获取账号详情
export const getAccountDetail = function(id){
  return axios.get(baseUrl+'/org/account/'+id,{
    params:{
      time:new Date().getTime()
    }
  })
}

//获取主题类型
export const getThemeMap = function(){
  return axios.get(baseUrl+'/theme/map',{
    params:{
      time:new Date().getTime()
    }
  })
}

//获取账户 单个 模块配置
export const getAccountModularConfig= function(id){
  return axios.get(baseUrl+'/org/account/'+id+'/modular-config',{
    params:{
      time:new Date().getTime()
    }
  })
}
//账户 单个 模块配置修改
export const saveAccountModularConfig = function(id,arr){
  return axios.put(baseUrl+'/org/account/'+id+'/modular-config',arr,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//获取账户 单个 角色配置
export const getAccountRoleConfig= function(id){
  return axios.get(baseUrl+'/org/account/'+id+'/role-config',{
    params:{
      time:new Date().getTime()
    }
  })
}
//账号 角色配置添加
export const addAccountRoleConfig = function(userId,data){
  return axios.post(baseUrl+'/org/account/'+userId+'/role-config',{
    role:data.role,
    roleScope:data.roleScope,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//账号 角色配置修改
export const editAccountRoleConfig = function(userId,id,data){
  return axios.put(baseUrl+'/org/account/'+userId+'/role-config/'+id,{
    role:data.role,
    roleScope:data.roleScope,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//账号 角色配置删除
export const deleteAccountRole= function(userId,id){
  return axios.delete(baseUrl+'/org/account/'+userId+'/role-config/'+id,qs.stringify({
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true})
}

//获取权限组列表
export const getPermissionGroupList = function(data){
  return axios.get(baseUrl+'/permission-group/pagination',{
    params:{
      sort:data.sort,//字符串，可以是数组，排序列名称
      order:data.order,//字符串，可以是数组，排序列顺序或者逆序
      page:data.page,//整数，分页查询第几页
      rows:data.rows,//整数，分页行数
      time:new Date().getTime()
    }
  })
}
//获取权限组 单个
export const getPermissionGroupSingle = function(id){
  return axios.get(baseUrl+'/permission-group/'+id,{
    params:{
      time:new Date().getTime()
    }
  })
}
//权限组-失效
export const disablePermissionGroup = function(id){
  return axios.patch(baseUrl+'/permission-group/'+id+'/disable',qs.stringify({
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true})
}
//权限组-生效
export const enablePermissionGroup = function(id){
  return axios.patch(baseUrl+'/permission-group/'+id+'/enable',qs.stringify({
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true})
}

//权限组-权限组添加
export const addPermissionGroup = function(data){
  return axios.post(baseUrl+'/permission-group',{
    code:data.code,
    name:data.name,
    comments:data.comments,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//权限组-权限组修改
export const editPermissionGroup = function(data){
  return axios.put(baseUrl+'/permission-group/'+data.id,{
    code:data.code,
    name:data.name,
    comments:data.comments,
    valid:data.valid,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//获取权限组 单个 菜单ids
export const getPermissionGroupMenuIds = function(id){
  return axios.get(baseUrl+'/permission-group/'+id+'/menu-ids',{
    params:{
      time:new Date().getTime()
    }
  })
}
//权限组 单个 菜单保存
export const savePermissionGroupMenuIds = function(id,menuIds){
  return axios.put(baseUrl+'/permission-group/'+id+'/menu-ids',qs.stringify({
    menuIds:menuIds,
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true})
}
//获取权限组 单个 模块配置
export const getPermissionGroupModularConfig= function(id){
  return axios.get(baseUrl+'/permission-group/'+id+'/modular-full-config',{
    params:{
      time:new Date().getTime()
    }
  })
}
//权限组 单个 模块配置修改
export const savePermissionGroupModularConfig = function(id,arr){
  return axios.put(baseUrl+'/permission-group/'+id+'/modular-config',arr,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//权限组 查询 成员配置
export const getPermissionGroupMemberConfig= function(id){
  return axios.get(baseUrl+'/permission-group/'+id+'/member-config',{
    params:{
      time:new Date().getTime()
    }
  })
}
//权限组 成员配置修改
export const savePermissionGroupMember= function(id,arr){
  return axios.put(baseUrl+'/permission-group/'+id+'/member-config',arr,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}

//权限组 查询 成员配置
export const getPermissionDeptScopeConfig= function(id){
  return axios.get(baseUrl+'/permission-group/'+id+'/dept-scope',{
    params:{
      time:new Date().getTime()
    }
  })
}
//权限组 成员配置修改
export const savePermissionDeptScope= function(id,arr){
  return axios.put(baseUrl+'/permission-group/'+id+'/dept-scope-config',arr,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}

//获取 机构管理员
export const getDeptManager= function(){
  return axios.get(baseUrl+'/org/dept/manager',{
    params:{
      time:new Date().getTime()
    }
  })
}

//机构管理员 修改
export const editDeptManager = function(arr){
  return axios.post(baseUrl+'/org/dept/manager/refresh',arr,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}

//获取 机构管理员
export const getDeptWatcher= function(){
  return axios.get(baseUrl+'/org/hierarchical-control/granted-view-dept',{
    params:{
      time:new Date().getTime()
    }
  })
}

//机构管理员 修改
export const editDeptWatcher = function(arr){
  return axios.post(baseUrl+'/org/hierarchical-control/granted-view-dept/refresh',arr,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}


//用户-账号引用是否存在
export const isExistAccountRefInOtherUser = function(accountRef,userId){
  return axios.get(baseUrl+'/org/user/is-exist-account-ref-in-other-user',{
    params:{
      accountRef:accountRef,
      userId:userId,
      time:new Date().getTime()
    }
  })
}
//用户-强制关联账号引用
export const linkAccountRefForce = function(accountRef,userId){
  return axios.patch(baseUrl+'/org/user/link-account-ref-force',qs.stringify({
    accountRef:accountRef,
    userId:userId,
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true})
}




export const getOrgsByOrgIds = function(orgIdArray){
  return axios.get(baseUrl+'/org/tree-select',{
        params:{
            orgIds:orgIdArray.join(','),
            time:new Date().getTime()
        }
    })
}

//存在权限或是管理员
export const getRoleExistsAdmin = function(role){
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



//获取某个部门下的部门列表
export const getOrgManageDeptSubList = function(parentDeptId,selectAll){
    return axios.get(baseUrl+'/org/manage/dept/sub-list',{
        params:{
            parentDeptId:parentDeptId,
            selectAll:selectAll,
            time:new Date().getTime()
        }
    })
}


//获取部门详情
export const getOrgSingleDept = function(deptId){
  return axios.get(baseUrl+'/org/dept/single',{
      params:{
          deptId:deptId,
          time:new Date().getTime()
      }
  })
}


//部门模糊搜索
export const searchOrgManageDept = function(searchVal,selectAll){
    return axios.get(baseUrl+'/org/manage/dept/search',{
        params:{
            searchVal:searchVal,
            selectAll:selectAll,
            time:new Date().getTime()
        }
    })
}


//获取部门机构 列表 按父节点查找
export const getOrgManageUserListInDept = function(deptId,selectAll){
    return axios.get(baseUrl+'/org/manage/user/list-in-dept',{
        params:{
              deptId:deptId,
              selectAll:selectAll,
              time:new Date().getTime()
        }
    })
}


//用户模糊搜索
export const searchOrgManageUser = function(searchVal,selectAll){
  return axios.get(baseUrl+'/org/manage/user/search',{
      params:{
          searchVal:searchVal,
          selectAll:selectAll,
          time:new Date().getTime()
      }
  })
}


//人员信息 成员引用删除
export const deleteOrgManageUserLink= function(deptId,userId){
  return axios.delete(baseUrl+'/org/manage/user/dept-link',{
    data:qs.stringify({
        deptId:deptId,
        userId:userId,
        time:new Date().getTime()
    },{arrayFormat:'repeat'}),
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    traditional:true},)
}

//人事信息------导入
export const orgExcelImport= function(){
  return baseUrl+'/org/manage/excel-import'
}
