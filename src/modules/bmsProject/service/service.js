import axios from 'axios'
import {baseUrl,ecoPubAuthToken,sysEnv} from '@/modules/bmsMmm/config/env'
import qs from 'qs';
//全局设置超时时间 120s
import {EcoUtil} from '@/components/util/main.js';
import { Message } from 'element-ui';
axios.defaults.timeout = 120000;
axios.defaults.withCredentials = false ;

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
      // 在发送请求之前做些什么
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
        console.log("bmsProject e1e1:"+e1);
      }
      try{
        parent.window.sysvm.logout();
      }catch(e2){
        console.log("bmsProject e2e2:"+e2);
      }
    }
  }
  return Promise.reject(err);
})

export const loginAjax = function(){
  return axios.post(baseUrl+'/login',qs.stringify({
      //username:'13656645390',//徐镭
      //username:'15558135790', //王道义
      username:'13588195486',
      password:'Econage123',
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
//获取项目详情
export const getProjectDetail= function(projectId){
  return axios.get(baseUrl+'/bms/project/'+projectId,{
    params:{
      time:new Date().getTime()
    }
  })
}
//获取项目列表
export const getProjectList = function(data , sl_projectViewType){
    return axios.get(baseUrl+'/bms/project/search',{
      params:{
        fuzzyKeywords:data.fuzzyKeywords,
        projectName:data.projectName,
        projectType:data.projectType,
        activeParam:data.activeParam,
        hasBidHitDoc:data.hasBidHitDoc,
        hasContractDoc:data.hasContractDoc,
        hasCheckAcceptDoc:data.hasCheckAcceptDoc,
        sort:data.sort,//字符串，可以是数组，排序列名称
        order:data.order,//字符串，可以是数组，排序列顺序或者逆序
        page:data.page,//整数，分页查询第几页
        rows:data.rows,//整数，分页行数
        sl_projectViewType:sl_projectViewType,
        time:new Date().getTime()
      }
    })
}
export const getValueByV = function(keyId , checkV){
  let re = keyId;
  for(let i in checkV){
    if(checkV[i].id == keyId){
      re = checkV[i].desc;
      break;
    }
  }
  return re;
}
//项目类别
export const projectTypeV = [
  { "id": 3, "desc": "实施项目" },
  { "id": 4, "desc": "维保项目" },
  { "id": 2, "desc": "售前项目" },
  { "id": 1, "desc": "研发项目" },
  { "id": 0, "desc": "其他项目" },
]
//项目优先级
export const projectPriorityV = [
  { "id": 5, "desc": "战略" },
  { "id": 4, "desc": "重要" },
  { "id": 3, "desc": "常规" },
  { "id": 2, "desc": "小项目" },
]
//维保项目阶段
export const projectPhaseForMaintain = [
  { "id": 60, "desc": "免费维保" },
  { "id": 70, "desc": "有偿维保" },
]
//售前项目阶段
export const projectPhaseForSales = [
  { "id": 100, "desc": "培育" },
  { "id": 110, "desc": "立项" },
  { "id": 120, "desc": "竞标" },
  { "id": 130, "desc": "签定合同" },
  { "id": 140, "desc": "首付收到" },
  { "id": 150, "desc": "实施" },
  { "id": 160, "desc": "项目暂缓" },
  { "id": 170, "desc": "主动放弃" },
  { "id": 180, "desc": "竞争失利" },
]
//实施项目阶段
export const projectPhaseForCommon = [
  { "id": 10, "desc": "项目启动" },
  { "id": 20, "desc": "需求调研" },
  { "id": 30, "desc": "系统搭建" },
  { "id": 40, "desc": "二次开发" },
  { "id": 50, "desc": "培训试运行" },
  { "id": 60, "desc": "免费维保" },
  { "id": 70, "desc": "有偿维保" },
]
//添加
export const addProjectAjax= function(saveObj){
  return axios.post(baseUrl+'/bms/project',saveObj,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true})
}
//失效
export const deleteProjectAjax = function(id){
  return axios.patch(baseUrl+'/bms/project/'+id+'/status?action=false',qs.stringify({
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true})
}
//修改
export const editProjectAjax = function(projectId,saveObj){
  return axios.put(baseUrl+'/bms/project/'+projectId,saveObj,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//添加团队成员
export const addProjectTeamMemberAjax= function(saveObj){
  let postData = qs.stringify({
    roleKey : saveObj.roleKey ,
    roleUser : saveObj.roleUser ,
    projectId : saveObj.projectId,
    time:new Date().getTime()
  });
  return axios.post(baseUrl+'/bms/project/auth',postData,{
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    traditional:true})
}
export const getRoleDescByKey = function(key){
  if(key == 'owner') return "负责人";
  else if(key == 'collabrator') return "工作人员";
  else if(key == 'flowup') return "督办员";
  else if(key == 'guest') return "访客";
  else return "未知";
}
//获取团队成员列表
export const getProjectTeamMemberList = function(projectId){
  return axios.get(baseUrl+'/bms/project/auth/search/'+projectId,{
    params:{
      time:new Date().getTime()
    }
  })
}
//删除团队成员
export const deleteTeamMemberAjax = function(id){
  return axios.patch(baseUrl+'/bms/project/auth/'+id+'/status?action=false',qs.stringify({
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true})
}
//获取文档列表
export const getProjectFileList = function(projectId){
  return axios.get(baseUrl + '/file-manager/info/modular/bmsProject' + "?modularInnerId=" + projectId,{
    time: new Date().getTime()
  },{ traditional: true})
}
//添加项目事件
export const addProjectEventAjax= function(saveObj){
  return axios.post(baseUrl+'/bms/project/event',saveObj,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true})
}
//失效项目事件
export const deleteProjectEventAjax = function(id){
  return axios.patch(baseUrl+'/bms/project/event/'+id+'/status?action=false',qs.stringify({
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true})
}
//修改项目事件
export const editProjectEventAjax = function(eventId,saveObj){
  return axios.put(baseUrl+'/bms/project/event/'+eventId,saveObj,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//获取项目事件详情
export const getProjectEventDetail= function(eventId){
  return axios.get(baseUrl+'/bms/project/event/'+eventId,{
    params:{
      time:new Date().getTime()
    }
  })
}
//获取项目事件列表
export const getProjectEventList = function(projectId , categoryId){
  return axios.get(baseUrl+'/bms/project/event/search/'+projectId,{
    params:{
      categoryId : categoryId,
      time:new Date().getTime()
    }
  })
}
//获取项目事件附件
export const getEventFileList = function(eventId){
  return axios.get(baseUrl + '/file-manager/info/modular/bmsProjectEvent' + "?modularInnerId=" + eventId,{
    time: new Date().getTime()
  },{ traditional: true})
}
//实施项目阶段
export const projectPaymentTypeV = [
  { "id": 0, "desc": "收款" },
  //{ "id": 1, "desc": "付款" },
  { "id": 2, "desc": "开票" }
]

export const searchProjectFinXlsExpAjax = function (fromToDate) {
  let _saveData = {
        fromDate: fromToDate[0],
        toDate: fromToDate[1],
        time: new Date().getTime()
  };
  return axios.post(baseUrl + '/bms/finCompute/projectFinXlsExp',qs.stringify(_saveData,{arrayFormat: 'repeat'}),  {traditional: true, responseType: 'blob'});
}
//获取财务数据列表
export const getFinDataList = function(data ){
  return axios.get(baseUrl+'/bms/finCompute/search',{
    params:{
      searchFromDate:data.searchFromDate,
      searchToDate:data.searchToDate,
      page:data.page,//整数，分页查询第几页
      rows:data.rows,//整数，分页行数
      time:new Date().getTime()
    }
  })
}
export const setDefaultTaxAmt= function(){
  //console.log("this.paymentInfoObj.taxType:" + this.paymentInfoObj.taxType);
  if(this.paymentInfoObj.taxType == 'TAX_TYPE_PRODUCT'){
    //到款额/(1+13%)*3%
    let valueAddedTaxAmt = (this.paymentInfoObj.paymtAmt / 1.13)*0.03;
    this.paymentInfoObj.valueAddedTaxAmt = valueAddedTaxAmt.toFixed(2);
    let superTaxAmt = (this.paymentInfoObj.paymtAmt / 1.13)*0.13 * 0.12;
    this.paymentInfoObj.superTaxAmt = superTaxAmt.toFixed(2);
    let stampTaxAmt = (this.paymentInfoObj.paymtAmt / 1.13)*0.0005;
    this.paymentInfoObj.stampTaxAmt = stampTaxAmt.toFixed(2);
  }else if(this.paymentInfoObj.taxType == 'TAX_TYPE_SERVICE'){
    //到款额/(1+6%)*6%
    let valueAddedTaxAmt = (this.paymentInfoObj.paymtAmt / 1.06)*0.06;
    this.paymentInfoObj.valueAddedTaxAmt = valueAddedTaxAmt.toFixed(2);
    let superTaxAmt = valueAddedTaxAmt * 0.12;
    this.paymentInfoObj.superTaxAmt = superTaxAmt.toFixed(2);
    let stampTaxAmt = (this.paymentInfoObj.paymtAmt / 1.06)*0.0005;
    this.paymentInfoObj.stampTaxAmt = stampTaxAmt.toFixed(2);
  }else {
    //到款额/(1+1%)*1%
    /*
    let valueAddedTaxAmt = (this.paymentInfoObj.paymtAmt / 1.01)*0.01;
    this.paymentInfoObj.valueAddedTaxAmt = valueAddedTaxAmt.toFixed(2);
    let superTaxAmt = valueAddedTaxAmt * 0.12;
    this.paymentInfoObj.superTaxAmt = superTaxAmt.toFixed(2);
    let stampTaxAmt = (this.paymentInfoObj.paymtAmt / 1.01)*0.0005;
    this.paymentInfoObj.stampTaxAmt = stampTaxAmt.toFixed(2);
    */
    this.paymentInfoObj.valueAddedTaxAmt = '';
    this.paymentInfoObj.superTaxAmt = '';
    this.paymentInfoObj.stampTaxAmt = '';
  }
  this.paymentInfoObj = {...this.paymentInfoObj};
}
export const setPaymentTypeStyle= function(){
  //console.log("this.$refs.i_taxType:"+this.$refs.i_taxType[0].outerHTML);
  if(this.paymentInfoObj.paymtType == '0'){
    this.$refs.i_taxType[0].style.display='';
  }else{
    this.paymentInfoObj.taxType = '';
    this.paymentInfoObj.valueAddedTaxAmt = '';
    this.paymentInfoObj.superTaxAmt = '';
    this.paymentInfoObj.stampTaxAmt = '';
    this.$refs.i_taxType[0].style.display='none';
  }
}

//-------------以下是关于员工考核模块-------------
export const EMPLOYEE_GRADE_MODEL_OBJ = {
  EMPLOYEE_GRADE_MODEL_FOR_AF_DEV:"EMPLOYEE_GRADE_MODEL_FOR_AF_DEV",
  EMPLOYEE_GRADE_MODEL_FOR_IBPM_DEV : "EMPLOYEE_GRADE_MODEL_FOR_IBPM_DEV",
  EMPLOYEE_GRADE_MODEL_FOR_IT_SUPPORT : "EMPLOYEE_GRADE_MODEL_FOR_IT_SUPPORT",
  EMPLOYEE_GRADE_MODEL_FOR_ROOKIE : "EMPLOYEE_GRADE_MODEL_FOR_ROOKIE"
}
export const getEmployeeExamineList = function(data ){
  return axios.post(baseUrl+'/bms/employeeManage/searchEmployee',data,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true})
}
export const searchEmployeeExamineXlsExpAjax = function (data) {
  return axios.post(baseUrl + '/bms/employeeManage/employeeExamineListXlsExp',data,  {headers: {'Content-Type': 'application/json;charset=UTF-8'},traditional: true, responseType: 'blob'});
}
export const setProjectFile = function(projectId , opFlag , fileId){
  /*
  return axios.post(baseUrl+'/bms/project/setProjectFile',{
    params:{
      projectId : projectId ,
      opFlag : opFlag ,
      fileId : fileId ,
      time:new Date().getTime()
    }
  })*/
  return axios.post(baseUrl+'/bms/project/setProjectFile',qs.stringify({
    projectId : projectId ,
    opFlag : opFlag ,
    fileId : fileId ,
    time:new Date().getTime()
  }),{traditional:true});
}