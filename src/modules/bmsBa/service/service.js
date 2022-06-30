import axios from 'axios'
import {baseUrl,ecoPubAuthToken,sysEnv} from '@/modules/bmsMmm/config/env'
import qs from 'qs';
import {EcoUtil} from '@/components/util/main.js'
import { Message } from 'element-ui';
//全局设置超时时间 120s

axios.defaults.timeout = 120000;
axios.defaults.withCredentials = false ;

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
        EcoUtil.beforeAjaxDoAction();
        // 在发送请求之前做些什么
        if(config.url && (config.url.indexOf('/login') == -1 && config.url.indexOf('/dingding-login')== -1 && config.url.indexOf('/hr/dingding/open/setting')== -1 && config.url.indexOf('/public/setting/union') == -1)){
          config.headers['eco-auth-token'] =  sessionStorage.getItem('ecoToken')||'';
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
      err.message = err.message + err.response.data
  }

   Message.error({
        showClose: true,
        message: err.response.data,
        type: 'error'
   })
    if (err.response.status==401){
      try{
        parent.window.sysvm.$message.error({
          showClose: true,
          message: err.response.data,
          type: 'error'
        });
      }catch(e1){
        console.log("bmsBa e1e1:"+e1);
      }
      try{
        parent.window.sysvm.logout();
      }catch(e2){
        console.log("bmsBa e2e2:"+e2);
      }
    }
  }
  return Promise.reject(err);
})



export const loginAjax = function(){
  return axios.post(baseUrl+'/login',qs.stringify({
      username:'13588195486',
      password:'Econage123',
      //username:'13867475816',
      //password:'1234abcd',
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
export const setBaSearchParam = function(data,sl_baViewType,doWarningViewFlag){
  let searchParam = {
      name:data.name,
      baTags: data.baTags,
      city:data.city,
      expireContactDay : data.expireContactDay <= 0 ?"": data.expireContactDay,
      locationAreaDesc:data.locationAreaDesc,
      firstStatus : data.firstStatus,
      industryCode : data.industryCode,
      sourceCode : data.sourceCode,
      valueCode : data.valueCode,

      scaleCode : data.scaleCode ,
      ownershipCode : data.ownershipCode ,
      posCode : data.posCode ,

      bizOppoTime_from:(data.fromToBizOppoTime==null||typeof data.fromToBizOppoTime[0]=="undefined")?null:data.fromToBizOppoTime[0],
      bizOppoTime_to:(data.fromToBizOppoTime==null||typeof data.fromToBizOppoTime[1]=="undefined")?null:data.fromToBizOppoTime[1],

      nextContactDate_from:(data.fromToNextContactDate==null||typeof data.fromToNextContactDate[0]=="undefined")?null:data.fromToNextContactDate[0],
      nextContactDate_to:(data.fromToNextContactDate==null||typeof data.fromToNextContactDate[1]=="undefined")?null:data.fromToNextContactDate[1],
      alreadyContactDate_from:(data.fromToAlreadyContactDate==null||typeof data.fromToAlreadyContactDate[0]=="undefined")?null:data.fromToAlreadyContactDate[0],
      alreadyContactDate_to:(data.fromToAlreadyContactDate==null||typeof data.fromToAlreadyContactDate[1]=="undefined")?null:data.fromToAlreadyContactDate[1],

      searchOwnerEmptyFlag : data.searchOwnerEmptyFlag ,
      searchCollaboratorEmptyFlag : data.searchCollaboratorEmptyFlag ,
      searchGuestEmptyFlag : data.searchGuestEmptyFlag ,
      searchOwnerUserStr : data.searchOwnerUserStr ,
      searchCollaboratorUserStr : data.searchCollaboratorUserStr ,
      searchGuestUserStr : data.searchGuestUserStr ,

      sort:data.sort,//字符串，可以是数组，排序列名称
      order:data.order,//字符串，可以是数组，排序列顺序或者逆序
      //page:data.page,//整数，分页查询第几页
      //rows:data.rows,//整数，分页行数
      sl_baViewType:sl_baViewType,
      doWarningViewFlag:doWarningViewFlag,
      time:new Date().getTime()
  };
  return searchParam;
}
//获取客户列表
export const getBaList = function(data,sl_baViewType,doWarningViewFlag){
  let searchParam = setBaSearchParam(data,sl_baViewType,doWarningViewFlag);
  searchParam.page = data.page;
  searchParam.rows = data.rows;
  return axios.get(baseUrl+'/bms/ba/search',{
    params : searchParam
    /*
    params:{
      name:data.name,
      baTags: data.baTags,
      city:data.city,
      expireContactDay : data.expireContactDay <= 0 ?"": data.expireContactDay,
      locationAreaDesc:data.locationAreaDesc,
      firstStatus : data.firstStatus,
      industryCode : data.industryCode,
      sourceCode : data.sourceCode,
      valueCode : data.valueCode,

      scaleCode : data.scaleCode ,
      ownershipCode : data.ownershipCode ,
      posCode : data.posCode ,

      bizOppoTime_from:(data.fromToBizOppoTime==null||typeof data.fromToBizOppoTime[0]=="undefined")?null:data.fromToBizOppoTime[0],
      bizOppoTime_to:(data.fromToBizOppoTime==null||typeof data.fromToBizOppoTime[1]=="undefined")?null:data.fromToBizOppoTime[1],

      nextContactDate_from:(data.fromToNextContactDate==null||typeof data.fromToNextContactDate[0]=="undefined")?null:data.fromToNextContactDate[0],
      nextContactDate_to:(data.fromToNextContactDate==null||typeof data.fromToNextContactDate[1]=="undefined")?null:data.fromToNextContactDate[1],
      alreadyContactDate_from:(data.fromToAlreadyContactDate==null||typeof data.fromToAlreadyContactDate[0]=="undefined")?null:data.fromToAlreadyContactDate[0],
      alreadyContactDate_to:(data.fromToAlreadyContactDate==null||typeof data.fromToAlreadyContactDate[1]=="undefined")?null:data.fromToAlreadyContactDate[1],

      searchOwnerEmptyFlag : data.searchOwnerEmptyFlag ,
      searchCollaboratorEmptyFlag : data.searchCollaboratorEmptyFlag ,
      searchGuestEmptyFlag : data.searchGuestEmptyFlag ,
      searchOwnerUserStr : data.searchOwnerUserStr ,
      searchCollaboratorUserStr : data.searchCollaboratorUserStr ,
      searchGuestUserStr : data.searchGuestUserStr ,

      sort:data.sort,//字符串，可以是数组，排序列名称
      order:data.order,//字符串，可以是数组，排序列顺序或者逆序
      page:data.page,//整数，分页查询第几页
      rows:data.rows,//整数，分页行数
      sl_baViewType:sl_baViewType,
      doWarningViewFlag:doWarningViewFlag,
      time:new Date().getTime()
    }*/
  })
}
//获取客户详情
export const getBaDetail= function(baId){
  return axios.get(baseUrl+'/bms/ba/'+baId,{
    params:{
      time:new Date().getTime()
    }
  })
}

//获取客户事件列表
export const getBaEventList = function(baId,data){
  return axios.get(baseUrl+'/bms/ba/event/search/'+baId,{
    params:{
      sort:data.sort,//字符串，可以是数组，排序列名称
      order:data.order,//字符串，可以是数组，排序列顺序或者逆序
      page:data.page,//整数，分页查询第几页
      rows:data.rows,//整数，分页行数
      time:new Date().getTime()
    }
  })
}
//获取客户联系人列表
export const getBaContactList = function(baId,data){
  return axios.get(baseUrl+'/bms/ba/contact/search/'+baId,{
    params:{
      sort:data.sort,//字符串，可以是数组，排序列名称
      order:data.order,//字符串，可以是数组，排序列顺序或者逆序
      page:data.page,//整数，分页查询第几页
      rows:data.rows,//整数，分页行数
      time:new Date().getTime()
    }
  })
}
export const getEnumText = function(id,groupDesc){
  return this.kvInfo.getValueByKeyId(id,groupDesc);
}

//修改
export const editBaAjax = function(baId,saveObj){
  return axios.put(baseUrl+'/bms/ba/'+baId,saveObj,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
  /*
  return axios.put(baseUrl+'/bms/ba/'+baId,{
    baName:data.baName,
    relationCode:data.relationCode,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })*/
}
//添加
export const addBaAjax= function(saveObj){
  return axios.post(baseUrl+'/bms/ba',saveObj,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true})
}
//失效
export const deleteBaAjax = function(id){
  return axios.patch(baseUrl+'/bms/ba/'+id+'/status?action=false',qs.stringify({
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true})
}
let loadingTimer;
let loading;
export const openLoading = function(){
  loading = this.$loading({
    fullscreen : true,
    lock: false,
    body: false,
    text: '玩命加载中.....',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
    customClass: 'loadingClass'
  });
  loadingTimer = setTimeout(function () {                  // 设定定时器，超时5S后自动关闭遮罩层，避免请求失败时，遮罩层一直存在的问题
    closeLoading();                       // 关闭遮罩层
  },20000);
}
export const closeLoading = function(){
  try{loading.close();}catch(e){}
  window.clearTimeout(loadingTimer);
}
//添加事件
export const addBaEventAjax= function(saveObj){
  return axios.post(baseUrl+'/bms/ba/event',saveObj,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true})
}
//修改事件
export const editBaEventAjax = function(eventId,saveObj){
  return axios.put(baseUrl+'/bms/ba/event/'+eventId,saveObj,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//删除事件
export const deleteBaEventAjax = function(id){
  return axios.patch(baseUrl+'/bms/ba/event/'+id+'/status?action=false',qs.stringify({
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true})
}
//获取事件详情
export const getEventDetail= function(eventId){
  return axios.get(baseUrl+'/bms/ba/event/'+eventId,{
    params:{
      time:new Date().getTime()
    }
  })
}
//添加联系人
export const addBaContactAjax= function(saveObj){
  return axios.post(baseUrl+'/bms/ba/contact',saveObj,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true})
}
//修改联系人
export const editBaContactAjax = function(contactId,saveObj){
  return axios.put(baseUrl+'/bms/ba/contact/'+contactId,saveObj,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//删除联系人
export const deleteBaContactAjax = function(id){
  return axios.patch(baseUrl+'/bms/ba/contact/'+id+'/status?action=false',qs.stringify({
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true})
}
//获取联系人详情
export const getContactDetail= function(contactId){
  return axios.get(baseUrl+'/bms/ba/contact/'+contactId,{
    params:{
      time:new Date().getTime()
    }
  })
}
//获取文档列表
export const getBaFileList = function(baId){
  return axios.get(baseUrl + '/file-manager/info/modular/bmsBa' + "?modularInnerId=" + baId,{
    time: new Date().getTime()
  },{ traditional: true})
}
//删除文档
export const deleteFileDataServer = function(id){
  return axios.delete(baseUrl + '/file-manager/info/'+id,{ traditional: true})
}
//转换文件大小描述
export const formatFileSize = function(fileS){
  let fileSizeString = "";
  let wrongSize="0B";
  if(fileS==0){
    return wrongSize;
  }
  if (fileS < 1024){
    fileSizeString = fileS + "B";
  }else if (fileS < 1048576){
    fileSizeString = parseFloat(fileS / 1024).toFixed(1) + "KB";
  }else if (fileS < 1073741824){
    fileSizeString = parseFloat(fileS / 1048576).toFixed(1) + "MB";
  }else{
    fileSizeString = parseFloat(fileS / 1073741824).toFixed(1) + "GB";
  }
  return fileSizeString;
}
//获取团队成员列表
export const getBaTeamMemberList = function(baId){
  return axios.get(baseUrl+'/bms/ba/auth/search/'+baId,{
    params:{
      time:new Date().getTime()
    }
  })
}
//删除团队成员
export const deleteTeamMemberAjax = function(id){
  return axios.patch(baseUrl+'/bms/ba/auth/'+id+'/status?action=false',qs.stringify({
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true})
}
export const getRoleDescByKey = function(key){
  if(key == 'owner') return "负责人";
  else if(key == 'collabrator') return "工作人员";
  else if(key == 'guest') return "访客";
  else return "未知";
}
//添加团队成员
export const addBaTeamMemberAjax= function(saveObj){
  let postData = qs.stringify({
    roleKey : saveObj.roleKey ,
    roleUser : saveObj.roleUser ,
    baId : saveObj.baId,
    time:new Date().getTime()
  });
  return axios.post(baseUrl+'/bms/ba/auth',postData,{
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    traditional:true})
}
export const _isPreviewFile = function(fileType) {
  var officeFileTypeStr = [
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
    "txt",
    "pdf"
  ].join(",");
  if (fileType) {
    fileType = fileType.toLowerCase();
    if (officeFileTypeStr.indexOf(fileType) >= 0) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
export const getDownloadUrl = function(fileId){
  return this.formatUrlWithAuthToken(baseUrl+'/file-manager/download/'+fileId);
}
export const getPreviewUrl = function(fileId){
  return this.formatUrlWithAuthToken(baseUrl+'/file-manager/preview/'+fileId);
}
export const formatUrlWithAuthToken = function(url) {
  if (!url) {
    return;
  }
  url +=
    (url.indexOf("?") > 0 ? "&" : "?") +
    this.tokenNameInStore +
    "=" +
    sessionStorage.getItem("ecoToken");
  return url;
}
//获取客户事件附件
export const getEventFileList = function(eventId){
  return axios.get(baseUrl + '/file-manager/info/modular/bmsBaEvent' + "?modularInnerId=" + eventId,{
    time: new Date().getTime()
  },{ traditional: true})
}
//添加
export const setBaRoleBatchAjax = function(saveObj){
  let postData = qs.stringify({
    op : saveObj.op ,
    oldRole : saveObj.oldRole ,
    newRole : saveObj.newRole,
    oldRoleUser : saveObj.oldRoleUser,
    newRoleUser : saveObj.newRoleUser,
    baIdStr : saveObj.baIdStr,
    time:new Date().getTime()
  });
  return axios.post(baseUrl+'/bms/ba/auth/setBatch',postData,{
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    traditional:true});
}
export const getBizOppoList = function(data){
  return axios.get(baseUrl+'/bms/ba/bizOppo/search',{
    params:{
      sourceFlag:data.sourceFlag,
      sort:data.sort,//字符串，可以是数组，排序列名称
      order:data.order,//字符串，可以是数组，排序列顺序或者逆序
      page:data.page,//整数，分页查询第几页
      rows:data.rows,//整数，分页行数
      time:new Date().getTime()
    }
  })
}
export const getBizOppoSourceFlagDesc =  function(sourceFlag){
  let sourceFlagDesc = sourceFlag;
  for(let i in bizOppoSourceFlagV){
    if(bizOppoSourceFlagV[i].id == sourceFlag){
      sourceFlagDesc = bizOppoSourceFlagV[i].desc;
      break;
    }
  }
  return sourceFlagDesc;
}
export const bizOppoSourceFlagV = [
  { "id": 1, "desc": "“Alpha审批”注册" },
  { "id": 2, "desc": "alphaflow.cn预约演示" },
  { "id": 3, "desc": "flowyun.com申请试用" },
]
export const getBizOppoStatisticsCountList = function(){
  return axios.get(baseUrl+'/bms/ba/bizOppo/statisticsCount',{
    params:{
      time:new Date().getTime()
    }
  })
}
export const searchBaVisitReportXlsExpAjax = function (fromToDateArray,sourceCode,valueCode,baTags,searchOwnerUserStr,searchOwnerEmptyFlag) {
  let _saveData = {
        fromDate: fromToDateArray[0],
        toDate: fromToDateArray[1],
        sourceCode: sourceCode,
        valueCode: valueCode,
        baTags: baTags,
        searchOwnerUserStr: searchOwnerUserStr,
        searchOwnerEmptyFlag: searchOwnerEmptyFlag,
        time: new Date().getTime()
  };
  return axios.post(baseUrl + '/bms/ba/baVisitReportXlsExp',qs.stringify(_saveData,{arrayFormat: 'repeat'}),  {traditional: true, responseType: 'blob'});
}
//导出销售项目穿透分析表
export const searchBaSalesProjectReportXlsExpAjax = function (data,sl_baViewType,doWarningViewFlag) {
  let searchParam = setBaSearchParam(data,sl_baViewType,doWarningViewFlag);
  searchParam.page = 1;
  searchParam.rows = 2000;
  return axios.post(baseUrl + '/bms/ba/salesProjectReportXlsExp',searchParam,  {headers: {'Content-Type': 'application/json;charset=UTF-8'},traditional: true, responseType: 'blob'});
}
