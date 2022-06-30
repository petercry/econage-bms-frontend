import axios from 'axios'
import {baseUrl} from '../../standardPlanning/config/env'
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
      parent.window.sysvm.$message.error({
        showClose: true,
        message: err.response.data,
        type: 'error'
      })
      parent.window.sysvm.logout();
    } else if (err.response.status==500){
      parent.window.sysvm.$message.error({
        showClose: true,
        message: err.response.data,
        type: 'error'
      })
    }else{
      parent.window.sysvm.$message.error({
        showClose: true,
        message: err.message,
        type: 'error'
      })
    }
  }
  return Promise.reject(err);
})

export const loginAjax = function(){
  return axios.post(baseUrl+'/login',qs.stringify({
      username:'10011',
      password:'123456',
      time:new Date().getTime()
  }),{traditional:true});
}

//获取树形示例 枚举字段
export const getTreeEnumMap = function(){
  return axios.get(baseUrl+'/demo/tree/enum-map',{
    params:{
      time:new Date().getTime()
    }
  })
}

//获取树形示例 列表 按父节点查找
export const getTreeList = function(id){
  return axios.get(baseUrl+'/demo/tree/'+id+'/sub',{
    params:{
      time:new Date().getTime()
    }
  })
}

//获取树形示例 文件
export const getTreeFileList = function(id){
  return axios.get(baseUrl+'/web/file-manager/info/modular/treeDemo',{
    params:{
      modularInnerId:id,
      time:new Date().getTime()
    }
  })
}
//树形示例-添加
export const treeAddAjax = function(data){
  return axios.post(baseUrl+'/demo/tree',{
    date:data.date,
    dateTime:data.dateTime,
    deptId:data.deptId,
    enumData:data.enumData,
    fileHeaderId:data.fileHeaderId,
    i18nKey:data.i18nKey,
    number:data.number,
    parentId:data.parentId,
    str:data.str,
    userId:data.userId,
    userOrgId:data.userOrgId,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//树形示例-编辑
export const treeEditAjax = function(data,id){
  return axios.put(baseUrl+'/demo/tree/'+id,{
    date:data.date,
    dateTime:data.dateTime,
    deptId:data.deptId,
    enumData:data.enumData,
    fileHeaderId:data.fileHeaderId,
    i18nKey:data.i18nKey,
    number:data.number,
    parentId:data.parentId,
    str:data.str,
    userId:data.userId,
    userOrgId:data.userOrgId,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//通用示例-列表
export const getTableList = function(data){
  return axios.get(baseUrl+'/demo/common/pagination',{
    params:{
      sort:data.sort,//字符串，可以是数组，排序列名称
      order:data.order,//字符串，可以是数组，排序列顺序或者逆序
      page:data.page,//整数，分页查询第几页
      rows:data.rows,//整数，分页行数
      time:new Date().getTime()
    }
  })
}
//通用示例-详情
export const getTableItem = function(id){
  return axios.get(baseUrl+'/demo/common/'+id,{
    params:{
      time:new Date().getTime()
    }
  })
}

//通用示例-添加
export const tableAddAjax = function(data){
  return axios.post(baseUrl+'/demo/common',{
    date:data.date,
    dateTime:data.dateTime,
    deptId:data.deptId,
    enumData:data.enumData,
    fileHeaderId:data.fileHeaderId,
    i18nKey:data.i18nKey,
    number:data.number,
    parentId:data.parentId,
    str:data.str,
    userId:data.userId,
    userOrgId:data.userOrgId,
    demoItems:data.demoItems,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//通用示例-修改
export const tableEditAjax = function(id,data){
  return axios.put(baseUrl+'/demo/common/'+id,{
    date:data.date,
    dateTime:data.dateTime,
    deptId:data.deptId,
    enumData:data.enumData,
    fileHeaderId:data.fileHeaderId,
    i18nKey:data.i18nKey,
    number:data.number,
    parentId:data.parentId,
    str:data.str,
    userId:data.userId,
    userOrgId:data.userOrgId,
    demoItems:data.demoItems,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//通用示例-删除
export const tableDeleteAjax= function(id){
  return axios.delete(baseUrl+'/demo/common/'+id,{traditional:true})
}
//获取基础数据
export const getEnumSelectEnabled = function (id, action = '') {
  return axios.get(baseUrl + '/basic/kv/group/' + id + '/detail/' + action, {
    params: {
      time: new Date().getTime()
    }
  })
}

// 获取操作类型枚举
export const getOperationType = function () {
  return axios.get(baseUrl + '/dongfeng/std/program/enum/operation-type', {
    params: {
      time: new Date().getTime()
    }
  })
}

// 获取状态标示枚举
export const getStatus = function () {
  return axios.get(baseUrl + '/dongfeng/std/program/enum/status', {
    params: {
      time: new Date().getTime()
    }
  })
}

// 获取审批流所有节点枚举
export const getStateFlow = function () {
  return axios.get(baseUrl + '/dongfeng/std/program/enum/state-flow', {
    params: {
      time: new Date().getTime()
    }
  })
}

// 获取审批流状态枚举
export const getPhaseStatus = function () {
  return axios.get(baseUrl + '/dongfeng/std/program/enum/phase-status', {
    params: {
      time: new Date().getTime()
    }
  })
}
// 获取标准规划维护列表
export const getStandardList = function (data) {
  return axios.get(baseUrl + '/dongfeng/std/program/main/list', {
    params: {
      year: data.year,
      classification: data.classification,
      programNumber: data.programNumber,
      programName: data.programName,
      dept: data.dept,
      operationType: data.operationType,
      draftTime: data.draftTime,
      countersignTime:data.countersignTime,
      office: data.office,
      drafter: data.drafter,
      responsibleUser: data.responsibleUser,
      phaseStatus: data.phaseStatus,
      status: data.status,
      reviewYear: data.reviewYear,
      subcommittee: data.subcommittee,
      sourceNumber: data.sourceNumber,
      systemCode: data.systemCode,
      phaseId: data.phaseId,
      page: data.page,
      rows: data.rows,
      ids: data.id,
      time: new Date().getTime()
    }
  })
}

// 添加标准规划
export const saveStandardAddAjax = function(data){
  return axios.post(baseUrl+'/dongfeng/std/program/main/add-single',{
    year: data.year,
    classification: data.classification,
    type: data.type,
    programNumber: data.programNumber,
    programName: data.programName,
    systemCode: data.systemCode,
    drafter: data.drafter,
    dept: data.dept,
    office: data.office,
    responsibleUser: data.responsibleUser,
    draftTime: data.draftTime,
    countersignTime: data.countersignTime,
    reviewYear: data.reviewYear,
    subcommittee: data.subcommittee,
    status:data.status,
    programSource: data.programSource,
    sourceNumberItems: data.sourceNumber,
    purposeContent: data.purposeContent,
    remarks: data.remarks,
    phaseId:data.phaseId,
    fiveAspectsFieldList: data.fiveAspectsFieldList,
    applicationFieldList: data.applicationFieldList,
    applicableProjectList: data.applicableProjectList,
    applicationCarTypeList: data.applicationCarTypeList,
    sourceNumberItems: data.sourceNumberItems,
    // systemCodeItem: data.selectId,
    systemCodeItem: data.systemCodeItem,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//问题清单列表
export const problemList=function(data){
  return axios.get(baseUrl+'/dongfeng/standard-quality-problem-list/pagination',{
    params:{
      time:new Date().getTime(),
      sort: 'modDate',
      order: 'desc',
      page:1,
      rows: 9999,
    },
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}

//根据用户id获取用户信息
export const getUserInfoByOrgId = function(id){
  return axios.get(baseUrl+'/org/user/'+id,{
    params:{
      time:new Date().getTime()
    }
  })
}
//根据orgId 回显部门名称
export const getOrgsMemberByIds = function(orgIdArray){
  return axios.post(baseUrl+'/org/tree-select/member-text-show',orgIdArray,{
      headers: {'Content-Type': 'application/json;charset=UTF-8'},
      traditional:true
    })
}
//问题清单 查看单个
export const problemSelectSingle=function(id){
  return axios.get(baseUrl+'/dongfeng/standard-quality-problem-list/select-single',{
    params:{
      time:new Date().getTime(),
      id:id
    }
  })
}
//流程历史意见列表
export const getHistoryList=function(id){
  return axios.get(baseUrl+'/dongfeng/std/program/main/approve-history',{
    params:{
      programId:id,
      time:new Date().getTime(),
    },
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }   })
}
//获取复审结论枚举
export const getReview=function(){
  return axios.get(baseUrl+'/dongfeng/std/program/enum/review-conclusion',{
    params:{
      time:new Date().getTime(),
    },
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}
// 获取某个规划的复审单
export const getReexaminationForm=function(id){
  return axios.get(baseUrl+'/dongfeng/std/program/review-form/select-single',{
    params:{
      // programNumber:id,
      standardId:id,
      time:new Date().getTime(),
    },
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}
// 保存审批单
export const saveReexaminationAjax = function(data){
  return axios.post(baseUrl+'/dongfeng/std/program/review-form/update-single?standardId=' + data.id,{
    standardId:data.id,
    // programNumber:data.programNumber,
    usage:data.usage,
    reviewConclusion:data.reviewConclusion,
    standardSituation:data.standardSituation,
    revocationReason:data.revocationReason,
    revisedProject:data.revisedProject,
    revisedUser:data.revisedUser,
    introduction:data.introduction,
    draftTime:data.draftTime,
    countersignTime:data.countersignTime,
    remarks:data.remarks,
    time:new Date().getTime(),
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
// 获取某个规划的立项单
export const getProjectList=function(id){
  return axios.get(baseUrl+'/dongfeng/std/program/startup-form/select-single',{
    params:{
      // programNumber:id,
      standardId:id,
      time:new Date().getTime(),
    },
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}
// 保存审批单
export const saveProjectListAjax = function(data){
  return axios.post(baseUrl+'/dongfeng/std/program/startup-form/update-single?standardId=' + data.stdId,{
    programName:data.programName,
    programNumber:data.programNumber,
    // standardId:data.programNumber,
    applicationScope:data.applicationScope,
    mainContent:data.mainContent,
    mainProblem:data.mainProblem,
    relatedStandard:data.relatedStandard,
    guidingFunction:data.guidingFunction,
    remarks:data.remarks,
    time:new Date().getTime(),
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
// 获取查询单个
export const getOnceInfo=function(id){
  return axios.get(baseUrl+'/dongfeng/std/program/main/select-single',{
    params:{
      id:id,
      time:new Date().getTime(),
    },
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}
// 保存修改标准规划
export const saveEditAjax = function(data){
  return axios.patch(baseUrl+'/dongfeng/std/program/main/update-single',{
    id:data.id,
    year: data.year,
    classification: data.classification,
    type: data.type,
    programNumber: data.programNumber,
    programName: data.programName,
    systemCode: data.systemCode,
    drafter: data.drafter,
    dept: data.dept,
    office: data.office,
    responsibleUser: data.responsibleUser,
    draftTime: data.draftTime,
    countersignTime: data.countersignTime,
    reviewYear: data.reviewYear,
    subcommittee: data.subcommittee,
    status:data.status,
    programSource: data.programSource,
    sourceNumberItems: data.sourceNumberItems,
    purposeContent: data.purposeContent,
    remarks: data.remarks,
    phaseId:data.phaseId,
    fiveAspectsFieldList: data.fiveAspectsFieldList,
    applicationFieldList: data.applicationFieldList,
    applicableProjectList: data.applicableProjectList,
    applicationCarTypeList: data.applicationCarTypeList,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
// 删除
export const deleteAjax = function(ids){
  return axios.delete(baseUrl+'/dongfeng/std/program/main/delete-batch?ids='+ids,{
    params: {
      time: new Date().getTime(),
    }
  },{headers: { 'Content-Type': 'text/plain;charset=UTF-8'}}
  )
}
// 责任人确认
export const confirmAjax=function(id){
  return axios.post(baseUrl+'/dongfeng/std/program/responsible-user-handle/ok',qs.stringify({
    programId:id,
    time:new Date().getTime()
  }),{traditional:true});
}
// 启动规划
export const startPlanningAjax = function(){
  // return axios.post(baseUrl+'/dongfeng/std/program/tech-innovation-dept-create/init',{
  return axios.post(baseUrl+'/dongfeng/std/program/main/startup',{
    time:new Date().getTime(),
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
// 下发
export const issueAjax=function(data,ids){
  return axios.post(baseUrl+'/dongfeng/std/program/state-flow/pass',qs.stringify({
    state:data,
    ids: ids,
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true});
}
// 导入
export const orgExcelImport= function(){
  return baseUrl+'/dongfeng/std/program/main/excel-import'
}
// 导出
export const exportAjax = function(data){
  return axios.get(baseUrl+'/dongfeng/std/program/main/excel-export',{
    params:{
      year: data.year,
      classification: data.classification,
      programNumber: data.programNumber,
      programName: data.programName,
      dept: data.dept,
      operationType: data.operationType,
      draftTime: data.draftTime,
      countersignTime:data.countersignTime,
      office: data.office,
      drafter: data.drafter,
      responsibleUser: data.responsibleUser,
      phaseStatus: data.phaseStatus,
      status: data.status,
      reviewYear: data.reviewYear,
      subcommittee: data.subcommittee,
      sourceNumber: data.sourceNumber,
      systemCode: data.systemCode,
      phaseId: data.phaseId,
      page: 1,
      rows: 99999,
      time:new Date().getTime()
    },responseType: 'blob',
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    },
  })
}
// 驳回
export const rejectmAjax=function(state,ids,opinion){
  return axios.post(baseUrl+'/dongfeng/std/program/state-flow/send-back',qs.stringify({
    state:state,
    ids:ids,
    opinion:opinion,
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true});
}
// 查询当前节点拥有的数据行数
export const haveAjax = function(data){
  return axios.get(baseUrl+'/dongfeng/std/program/state-flow/current-count',{
    params:{
      state:data,
      time:new Date().getTime()
    }
  })
}
// 查询当前节点需要到达的数据总行数
export const needAjax = function(data){
  return axios.get(baseUrl+'/dongfeng/std/program/state-flow/total-count',{
    params:{
      state:data,
      time:new Date().getTime()
    }
  })
}

// 获取当前用户可以访问的审批节点列表
export const currentUserStateList = function(){
  return axios.get(baseUrl+'/dongfeng/std/program/state-flow/current-user-state-list',{
    params:{
      time:new Date().getTime()
    }
  })
}

//分标委列表
export const getSubList = function(){
  return axios.get(baseUrl+'/dongfeng/sub-std-committee/list/select',{
    params:{
      time:new Date().getTime()
    }
  })
}

//级联基础数据
export const getEnabList = function(id){
  return axios.get(baseUrl+'/basic/tree-kv/group/select-enabled',{
    params:{
      parentId: id,
      time:new Date().getTime()
    }
  })
}

//查询部门分类树
export const getTranslateGroup = function(){
  return axios.get(baseUrl+'/dongfeng/std/program/main/tree/select-dept-tree',{
    params:{
      time:new Date().getTime()
    }
  })
}


// 标准规划管理-编制-查询部门联络员角色分配信息
export const getTranslateInfo = function(data){
  return axios.get(baseUrl+'/dongfeng/std/program/main/search/dept-liaison-users?ids=' + data,{
    params:{
      time:new Date().getTime()
    }
  })
}

//批量修改部门科室
export const batchModDept=function(data){
  return axios.post(baseUrl+'/dongfeng/std/program/main/list/update-org',{...data},{traditional:true});
}

//根据标准分类获取体系码
export const getSystemCode = function(data){
  return axios.get(baseUrl+'/dongfeng/systreemanage/support/standard/create-full',{
    params:{
      ...data,
      // read: true,
      // id: data,
      time:new Date().getTime()
    }
  })
}

// 获取技术标准体系树
export const technicalStandardTree = function(id){
  return axios.get(baseUrl+'/dongfeng/systreemanage/standardSystem/tree-rows',{
    params:{
      parentId:id,
      time:new Date().getTime()
    }
  })
}

//获取环节统计lie
export const getLinkStatistics = function(data){
  return axios.get(baseUrl+'/dongfeng/std/program/main/statistics/task-count-list',{
    params:{
      ...data,
      time:new Date().getTime()
    }
  })
}

//环节统计导出
export const exportLinkStatistics = function(){
  return axios.get(baseUrl+'/dongfeng/std/program/main/excel/download-task-count-list',{
    params:{
      page: 1,
      rows: 99999,
      time:new Date().getTime()
    },responseType: 'blob',
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    },
  })
}

//查询部门审批树
export const getDeptArrpStrr = function(id){
  return axios.get(baseUrl+'/dongfeng/std/program/main/tree/select-approve-tree',{
    params:{
      time:new Date().getTime()
    }
  })
}


//部门联络员审核table
export const getDeptArrpTable = function(id){
  return axios.get(baseUrl+'/dongfeng/std/program/main/statistics/phase-count-list',{
    params:{
      phase: id,
      time:new Date().getTime()
    }
  })
}

//获取标准类型
export const getStandardTypeList = function(){
  return axios.get(baseUrl+'/basic/tree-kv/group/select-enabled?parentId=esProgramClass',{
    params:{
      time:new Date().getTime()
    }
  })
}

//体系码转换
export const systemCodeList = function(id){
  return axios.get(baseUrl+'/dongfeng/systreemanage/standardSystem/single/select?id=' + id,{
    params:{
      time:new Date().getTime()
    }
  })
}

//知识库数据
export const zhishiKu = function(id){
  return axios.get(baseUrl+'/dongfeng/doc-base/search/file/recursively?baseId=D.4.stdRevision&parentId=D.4.stdRevision&page=1&rows=10&total=0&sort=createDate&order=desc',{
    params:{
      time:new Date().getTime()
    }
  })
}

//获取当前操作人
export const getCurrentActionUser = function(id){
  return axios.get(baseUrl+'/dongfeng/common-support/get-current-user',{
    params:{
      time:new Date().getTime()
    }
  })
}

