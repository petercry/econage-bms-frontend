import axios from 'axios'
import {baseUrl,sysEnv} from '@/modules/manage/config/env'
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
    try{
        parent.window.sysvm.$message.error({
          showClose: true,
          message: err.response.data,
          type: 'error'
        })
    }catch(e){}

    if (err.response.status==401){
      try {
        parent.window.sysvm.logout();
      } catch (error) { }
      document.documentElement.className = 'hideVis';
    }

  }
  return Promise.reject(err);
})

export const loginAjax = function(){
  return axios.post(baseUrl+'/login',qs.stringify({
      username:'admin',
      password:'123456',
      time:new Date().getTime()
  }),{traditional:true});
}

//应用分页查询-列表
export const getAppList = function(data){
  return axios.get(baseUrl+'/external-app/pagination',{
    params:{
      sort:data.sort,//字符串，可以是数组，排序列名称
      order:data.order,//字符串，可以是数组，排序列顺序或者逆序
      page:data.page,//整数，分页查询第几页
      rows:data.rows,//整数，分页行数
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
    code:data.code,
    branchDept:data.branchDept,
    portalShow:data.portalShow,
    oauth2:data.oauth2,
    pubKeyStore:data.pubKeyStore,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
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
//应用 公共密钥-添加
export const addAppPubkeyStoreAjax = function(data){
  return axios.post(baseUrl+'/app-pub-key-store',{
    id:data.appId,
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
//应用 公共密钥-修改
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
//应用 oauth2-添加
export const addAppOauth2Ajax = function(data){
  return axios.post(baseUrl+'/app-oauth2',{
    id:data.appId,
    valid:data.valid,
    redirectHost:data.redirectHost,
    secret:data.secret,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
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

//自定义菜单Tree接口
export const getCustomMenuTree = function(){
  return axios.get(baseUrl+'/sys-menu',{
    params:{
      time:new Date().getTime()
    }
  })
}

export const getCustomMenuTreeFacade = function(){
  return axios.get(baseUrl+'/facade-menu',{
    params:{
      time:new Date().getTime()
    }
  })
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
      valid:true,
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
//枚举-分组-查询单个
export const getBasicKvCategorySingle= function(categoryId){
  return axios.get(baseUrl+'/basic/kv/category/'+categoryId,{
    params:{
      time:new Date().getTime()
    }
  })
}
//枚举-分组-查询全部
export const getBasicKvCategoryList= function(){
  return axios.get(baseUrl+'/basic/kv/category',{
    params:{
      time:new Date().getTime()
    }
  })
}
//枚举-分组-添加
export const addBasicKvCategory= function(data){
  return axios.post(baseUrl+'/basic/kv/category',{
    id:data.id,   //ID
    i18nKey:data.i18nKey,   //国际化key
    name:data.name, //名称
    shortName:data.shortName,
    order:data.order,     //序号
    description:data.description, //备注
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;;charset=UTF-8'},
    traditional:true})
}



export const disabledBasicKvCategory = function(ids){
    return axios.patch(baseUrl+'/basic/kv/category/disabled-batch',qs.stringify({
        id: ids,
        time:new Date().getTime()
    },{arrayFormat:'repeat'}),{traditional:true})
}


//枚举-分组-修改
export const updateBasicKvCategory= function(id,data){
  return axios.put(baseUrl+'/basic/kv/category/'+id,{
    name:data.name,   //菜单名称
    i18nKey:data.i18nKey,   //国际化key
    description:data.description, //备注
    order:data.order,     //序号
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;;charset=UTF-8'},
    traditional:true
  })
}





//枚举-分组-下属枚举列表
export const getBasicKvGroupList= function(categoryId){
  return axios.get(baseUrl+'/basic/kv/category/'+categoryId+'/groups',{
    params:{
      time:new Date().getTime()
    }
  })
}




//枚举-添加
export const addBasicKvGroup= function(data){
  return axios.post(baseUrl+'/basic/kv/group',{
    id:data.id,   //ID
    i18nKey:data.i18nKey,   //国际化key
    categoryId:data.categoryId, //分组Id
    name:data.name, //名称
    order:data.order,     //序号
    description:data.description, //备注
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;;charset=UTF-8'},
    traditional:true})
}

//枚举-修改
export const updateBasicKvGroup= function(data){
  return axios.put(baseUrl+'/basic/kv/group/'+data.id,{
    order:data.order,
    name:data.name,   //菜单名称
    i18nKey:data.i18nKey,   //国际化key
    description:data.description, //备注
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;;charset=UTF-8'},
    traditional:true
  })
}

//基础数据分组-拖拉 
export const dndBasicKvGroup= function(data){
  return axios.patch(baseUrl+'/basic/kv/group/'+data.id+'/dnd',qs.stringify({
    targetId: data.targetId,//字符串，目标菜单ID
    point: data.point,//字符串，对应的操作（append：作为放入目标节点子节点；top：与目标节点同级，并前置；bottom：与目标节点同级，并后置）
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true})
}
//基础数据分组-详细数据
export const getBasicKvGroupDetail = function(id){
  return axios.get(baseUrl+'/basic/kv/group/'+id+'/detail',{
      params:{
          time:new Date().getTime()
      }
  })
}

export const disabledBasicKvGroup = function(ids){
    return axios.patch(baseUrl+'/basic/kv/group/disabled-batch',qs.stringify({
        id: ids,
        time:new Date().getTime()
    },{arrayFormat:'repeat'}),{traditional:true})
}

//基础数据------导入
export const basicKvImport= function(){
  return baseUrl+'/basic/kv/imp'
}

//基础数据-添加
export const addBasicKv= function(data){
  return axios.post(baseUrl+'/basic/kv',{
      id:data.id,   //ID
      i18nKey:data.i18nKey,   //国际化key
      text:data.text, //名称
      shortName:data.shortName,
      code:data.code,
      order:data.order,     //序号
      group:data.group, //分组,
      enableInCreate:data.enableInCreate, //
      enableInUpdate:data.enableInUpdate, //
      enableInSelect:data.enableInSelect, //
      time:new Date().getTime()
  },{
      headers: {'Content-Type': 'application/json;;charset=UTF-8'},
      traditional:true})
  }

//基础数据-修改
export const updateBasicKv= function(data){
    return axios.put(baseUrl+'/basic/kv/'+data.id,{
        id:data.id,   //ID
        i18nKey:data.i18nKey,   //国际化key
        text:data.text, //名称
        code:data.code,
        shortName:data.shortName,
        order:data.order,     //序号
        enableInCreate:data.enableInCreate, //
        enableInUpdate:data.enableInUpdate, //
        enableInSelect:data.enableInSelect, //
        time:new Date().getTime()
    },{
        headers: {'Content-Type': 'application/json;;charset=UTF-8'},
        traditional:true
    })
}








//分支机构
export const getBranchDeptList = function(){
  return axios.get(baseUrl+'/org/dept/all-branch-dept',{
    params:{
      time:new Date().getTime()
    }
  })
}



//获取流水号列表
export const getCommonSequenceList = function(data){
  return axios.get(baseUrl+'/common-sequence',{
    params:{
      sort:data.sort,//字符串，可以是数组，排序列名称
      order:data.order,//字符串，可以是数组，排序列顺序或者逆序
      page:data.page,//整数，分页查询第几页
      rows:data.rows,//整数，分页行数
      time:new Date().getTime()
    }
  })
}
//获取流水号 单个
export const getCommonSequenceSingle = function(id){
  return axios.get(baseUrl+'/common-sequence/'+id,{
    params:{
      time:new Date().getTime()
    }
  })
}


//流水号-流水号添加
export const addCommonSequence = function(data){
  return axios.post(baseUrl+'/common-sequence',{
    prefix:data.prefix,
    name:data.name,
    formulaType:data.formulaType,
    formulaSuffix:data.formulaSuffix,
    startIdx:data.startIdx,
    length:data.length,
    isFixLengthShow:data.isFixLengthShow,
    suffix:data.suffix,
    idxResetType:data.idxResetType,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//流水号-流水号修改
export const editCommonSequence = function(id,data){
  return axios.put(baseUrl+'/common-sequence/'+id,{
    prefix:data.prefix,
    name:data.name,
    formulaType:data.formulaType,
    formulaSuffix:data.formulaSuffix,
    startIdx:data.startIdx,
    length:data.length,
    isFixLengthShow:data.isFixLengthShow,
    suffix:data.suffix,
    idxResetType:data.idxResetType,
    version:data.version,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}

//获取流水号 年号规则
export const getCommonSequenceFormuiaType = function(){
  return axios.get(baseUrl+'/common-sequence/formula-type-enum',{
    params:{
      time:new Date().getTime()
    }
  })
}

//获取流水号 重复规则
export const getCommonSequenceIdxRestType = function(){
  return axios.get(baseUrl+'/common-sequence/idx-rest-type-enum',{
    params:{
      time:new Date().getTime()
    }
  })
}

export const previewCommonSequence = function(data){
  return axios.post(baseUrl+'/common-sequence/ticket-preview',{
    prefix:data.prefix,
    name:data.name,
    formulaType:data.formulaType,
    formulaSuffix:data.formulaSuffix,
    startIdx:data.startIdx,
    length:data.length,
    isFixLengthShow:data.isFixLengthShow,
    suffix:data.suffix,
    idxResetType:data.idxResetType,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}






//创建树节点
export const addTreeKv = function(data){
  return axios.post(baseUrl+'/basic/tree-kv',{
        id:data.id,   //ID
        code:data.code,
        parentId:data.parentId,
        i18nKey:data.i18nKey,   //国际化key
        text:data.text, //名称
        shortName:data.shortName, //简称
        group:data.group,
        enableInCreate:data.enableInCreate,
        enableInUpdate:data.enableInUpdate,
        enableInSelect:data.enableInSelect,
        time:new Date().getTime()
    },
    {headers: {'Content-Type': 'application/json;;charset=UTF-8'},traditional:true})
}



//获取treekv 查看可用列表
export const getTreeKvListByParentId= function(parentId,action){
    return axios.get(baseUrl+'/basic/tree-kv/group/'+(action?action:'select-enabled'),{
      params:{
          parentId:parentId,
          time:new Date().getTime()
      }
    })
}


//获取treekv 查看可用列表
export const getTreeKvSingleById= function(id){
  return axios.get(baseUrl+'/basic/tree-kv/single',{
    params:{
        id:id,
        time:new Date().getTime()
    }
  })
}


//创建树节点
export const updateTreeKv = function(data){
  return axios.put(baseUrl+'/basic/tree-kv/single',{
        id:data.id,   //ID
        code:data.code,
        parentId:data.parentId,
        i18nKey:data.i18nKey,   //国际化key
        text:data.text, //名称
        shortName:data.shortName,
        group:data.group,
        enableInCreate:data.enableInCreate,
        enableInUpdate:data.enableInUpdate,
        enableInSelect:data.enableInSelect,
        time:new Date().getTime()
    },
    {headers: {'Content-Type': 'application/json;;charset=UTF-8'},traditional:true})
}


export const sortTreeKv= function(id,targetId,point){
    return axios.patch(baseUrl+'/basic/tree-kv/single/dnd',qs.stringify({
        id: id,
        targetId:targetId,
        point:point,
        time:new Date().getTime()
    },{arrayFormat:'repeat'}),{traditional:true})
}


//获取快捷意见列表
export const getFastOpinionList= function(){
  return axios.get(baseUrl+'/fast-opinion/list',{
    params:{
        time:new Date().getTime()
    }
  })
}

//批量更新快捷意见
export const updateFastOpinionList = function(arr){
  return axios.post(baseUrl+'/fast-opinion/list',arr,
    {headers: {'Content-Type': 'application/json;;charset=UTF-8'},traditional:true})
}

//创建快捷意见
export const fastOpinionAddAjax = function(data){
  return axios.post(baseUrl+'/fast-opinion/single',{
        // id:data.id,
        content:data.content,
        comments:data.comments, 
        time:new Date().getTime()
    },
    {headers: {'Content-Type': 'application/json;;charset=UTF-8'},traditional:true})
}


//编辑快捷意见
export const fastOpinionEditAjax = function(data){
  return axios.put(baseUrl+'/fast-opinion/single',{
        id:data.id,   //ID
        content:data.content,
        comments:data.comments, 
        time:new Date().getTime()
    },
    {headers: {'Content-Type': 'application/json;;charset=UTF-8'},traditional:true})
}

//快捷意见------删除
export const fastOpinionDeleteAjax = function(id){
  return axios.delete(baseUrl+'/fast-opinion/single',{
    params:{
      id:id,
      time:new Date().getTime()
    }
  })
}

//快捷意见----全排序
export const fastOpinionSortAjax = function(ids){
  return axios.post(baseUrl+'/fast-opinion/updateOrder',{
        ids:ids,
        time:new Date().getTime()
    },
    {headers: {'Content-Type': 'application/json;;charset=UTF-8'},traditional:true})
}
// export const sortTreeKv= function(id,targetId,point){
//     return axios.patch(baseUrl+'/basic/tree-kv/single/dnd',qs.stringify({
//         id: id,
//         targetId:targetId,
//         point:point,
//         time:new Date().getTime()
//     },{arrayFormat:'repeat'}),{traditional:true})
// }

//获取用户消息提醒频率
export const getRemindFreq= function(){
  return axios.get(baseUrl+'/remind-freq',{
    params:{
        time:new Date().getTime()
    }
  })
}

//获取提醒频率类型枚举
export const getRemindFreqTypeEnum= function(){
  return axios.get(baseUrl+'/remind-freq/type-enum',{
    params:{
        time:new Date().getTime()
    }
  })
}
//更新用户消息提醒频率
export const updateRemindFreq= function(type){
  return axios.patch(baseUrl+'/remind-freq/update',qs.stringify({
      type: type,
      time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true})
}

//获取用户个人信息
export const getPersonalInfo= function(){
  return axios.get(baseUrl+'/org/user/personal',{
    params:{
        time:new Date().getTime()
    }
  })
}
//更新用户个人信息
export const updatePersonalInfo = function(data){
  return axios.post(baseUrl+'/standard/personal/user-info/update',{
        alias:data.alias,   //ID
        mobilePhone:data.mobilePhone,
        email:data.email, 
        ssn:data.ssn, 
        mi:data.mi, 
        // hrAccount:data.hrAccount, 
        time:new Date().getTime()
    },
    {headers: {'Content-Type': 'application/json;;charset=UTF-8'},traditional:true})
}
//更新用户密码
export const updatePasswordAjax = function(data){
  return axios.patch(baseUrl+'/org/account/personal/updatePassword',{
      oldPass:data.oldPass,   //ID
      newPass:data.newPass,
      time:new Date().getTime()
    },
    {headers: {'Content-Type': 'application/json;;charset=UTF-8'},traditional:true})
}

//获取门户参数
export const getFacadeType = function(){
  return axios.get(baseUrl+'/portal1/facade-type',{
    params:{
      time:new Date().getTime()
    }
  })
}

//配置门户参数
export const editFacadeType = function(viewType){
  return axios.post(baseUrl+'/portal1/facade-type?view-type='+viewType,{
    time:new Date().getTime()
  },{
    // headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}