import axios from 'axios'
import {baseUrl,ecoPubAuthToken,sysEnv} from '@/modules/bmsMmm/config/env'
import { OpRole } from "@/modules/bmsMmm/util/OpRole.js"
import qs from 'qs';
//全局设置超时时间 120s
import {EcoUtil} from '@/components/util/main.js'
import { Message } from 'element-ui';
axios.defaults.timeout = 120000;
axios.defaults.withCredentials = false ;

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
        // 在发送请求之前做些什么
        EcoUtil.beforeAjaxDoAction();
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
        console.log("bmsMmm e1e1:"+e1);
      }
      try{
        parent.window.sysvm.logout();
      }catch(e2){
        console.log("bmsMmm e2e2:"+e2);
      }
    }
  }
  return Promise.reject(err);
})



export const loginAjax = function(){
  return axios.post(baseUrl+'/login',qs.stringify({
      //username:'13656645390',//徐镭
      //password:'1234abcd',
      
      username:'15757166451', //小汤
      password:'1234abcd',

      //username:'13588195486',
      //password:'Econage123',
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
//根据项目ID获取特定状态的任务数量
export const getTaskCountByProject = function(projectId , statusStr){
  return axios.get(baseUrl+'/bms/kanban/task/count',{
    params:{
      projectId:projectId,
      statusStr:statusStr,
      time:new Date().getTime()
    }
  })
}
//根据项目ID获取任务列表
export const getTaskListByProject = function(projectId , priorityList , statusStr){
  let priorityStr = null;
  if(priorityList.length<3){
    priorityStr = priorityList.join(',');
  }
  return axios.get(baseUrl+'/bms/kanban/task/search',{
    params:{
      projectId:projectId,
      priorityStr:priorityStr,
      statusStr:statusStr,
      time:new Date().getTime()
    }
  })
}
//搜索任务列表
export const searchTaskList = function(paginationInfo){
  let searchParam = setTaskListSearchParam(paginationInfo);
  return axios.get(baseUrl+'/bms/kanban/task/search',{
    params:searchParam
  })
}
export const setTaskListSearchParam = function(paginationInfo){
  let priorityStr = null;
  if(paginationInfo.priorityList.length<3){
    priorityStr = paginationInfo.priorityList.join(',');
  }
  let statusStr = paginationInfo.statusList.join(',');
  let searchParam = {
    projectId:paginationInfo.projectId,
    priorityStr:priorityStr,
    title:paginationInfo.title,
    userIdStr:paginationInfo.userIdStr,
    statusStr:statusStr,
    expectFinishDate_from:(paginationInfo.fromToExpectFinishDateArray==null||typeof paginationInfo.fromToExpectFinishDateArray[0]=="undefined")?null:paginationInfo.fromToExpectFinishDateArray[0],
    expectFinishDate_to:(paginationInfo.fromToExpectFinishDateArray==null||typeof paginationInfo.fromToExpectFinishDateArray[1]=="undefined")?null:paginationInfo.fromToExpectFinishDateArray[1],
    createDate_from:(paginationInfo.fromToCreateDateArray==null||typeof paginationInfo.fromToCreateDateArray[0]=="undefined")?null:paginationInfo.fromToCreateDateArray[0],
    createDate_to:(paginationInfo.fromToCreateDateArray==null||typeof paginationInfo.fromToCreateDateArray[1]=="undefined")?null:paginationInfo.fromToCreateDateArray[1],
    sort:paginationInfo.sort,//字符串，可以是数组，排序列名称
    order:paginationInfo.order,//字符串，可以是数组，排序列顺序或者逆序
    page:paginationInfo.page,//整数，分页查询第几页
    rows:paginationInfo.rows,//整数，分页行数
    time:new Date().getTime()
  };
  return searchParam;
}
export const dealException = function(error){
  console.log("#########error error::" +  error);
}
let loadingTimer = null;
export const openLoading = function(){
  this.loading = this.$loading({
    fullscreen : true,
    lock: false,
    body: false,
    text: '玩命加载中.....',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
    customClass: 'loadingClass'
  });
  let _this = this;
  loadingTimer = setTimeout(function () {                  // 设定定时器，超时5S后自动关闭遮罩层，避免请求失败时，遮罩层一直存在的问题
    _this.closeLoading();                       // 关闭遮罩层
  },20000);
}
export const closeLoading = function(){
  try{
    this.loading.close();
  }catch(e){}
  clearTimeout(loadingTimer);
}
//添加需求
export const addRequireAjax= function(saveObj){
  return axios.post(baseUrl+'/bms/kanban/require',saveObj,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true})
}
//获取某产品ID向特定状态的需求数量
export const getRequreNumByProduct = function(productId,statusStr){
  return axios.get(baseUrl+'/bms/kanban/require/count',{
    params:{
      productId:productId,
      statusStr:statusStr,
      time:new Date().getTime()
    }
  })
}
//根据产品ID获取需求列表
export const getRequireListByProduct = function(productId,priorityList){
  let priorityStr = null;
  if(priorityList.length<3){
    priorityStr = priorityList.join(',');
  }
  return axios.get(baseUrl+'/bms/kanban/require/search',{
    params:{
      productId:productId,
      priorityStr:priorityStr,
      statusStr:'-1,10,20,30,40,50,60',
      time:new Date().getTime()
    }
  })
}
//根据标题获取需求列表
export const getRequireListByNameQuery = function(nameQuery){
  return axios.get(baseUrl+'/bms/kanban/require/search',{
    params:{
      title:nameQuery,
      time:new Date().getTime()
    }
  })
}
//搜索需求列表
export const searchRequireList = function(productId,paginationInfo){
  let priorityStr = null;
  if(paginationInfo.priorityList.length<3){
    priorityStr = paginationInfo.priorityList.join(',');
  }
  let statusStr = paginationInfo.statusList.join(',');
  //console.log("####fromToExpectFinishDateArray:" + (paginationInfo.fromToExpectFinishDateArray==null||typeof paginationInfo.fromToExpectFinishDateArray[0]=="undefined"?null:paginationInfo.fromToExpectFinishDateArray[0])+"##"+(paginationInfo.fromToExpectFinishDateArray==null||typeof paginationInfo.fromToExpectFinishDateArray[1]=="undefined"?null:paginationInfo.fromToExpectFinishDateArray[1]));
  //console.log("####statusStr:" + statusStr);
  return axios.get(baseUrl+'/bms/kanban/require/search',{
    params:{
      productId:productId,
      priorityStr:priorityStr,
      title:paginationInfo.title,
      statusStr:statusStr,
      expectFinishDate_from:(paginationInfo.fromToExpectFinishDateArray==null||typeof paginationInfo.fromToExpectFinishDateArray[0]=="undefined")?null:paginationInfo.fromToExpectFinishDateArray[0],
      expectFinishDate_to:(paginationInfo.fromToExpectFinishDateArray==null||typeof paginationInfo.fromToExpectFinishDateArray[1]=="undefined")?null:paginationInfo.fromToExpectFinishDateArray[1],
      createDate_from:(paginationInfo.fromToCreateDateArray==null||typeof paginationInfo.fromToCreateDateArray[0]=="undefined")?null:paginationInfo.fromToCreateDateArray[0],
      createDate_to:(paginationInfo.fromToCreateDateArray==null||typeof paginationInfo.fromToCreateDateArray[1]=="undefined")?null:paginationInfo.fromToCreateDateArray[1],
      sort:paginationInfo.sort,//字符串，可以是数组，排序列名称
      order:paginationInfo.order,//字符串，可以是数组，排序列顺序或者逆序
      page:paginationInfo.page,//整数，分页查询第几页
      rows:paginationInfo.rows,//整数，分页行数
      time:new Date().getTime()
    }
  })
}
//获取需求详情
export const getRequireDetail= function(requireId){
  return axios.get(baseUrl+'/bms/kanban/require/'+requireId,{
    params:{
      time:new Date().getTime()
    }
  })
}
//根据需求ID获取任务列表
export const getTaskListByRequire = function(requireId){
  return axios.get(baseUrl+'/bms/kanban/task/search',{
    params:{
      requireId:requireId,
      time:new Date().getTime()
    }
  })
}
//编辑需求
export const updateRequireAjax = function(requireId,saveObj){
  return axios.put(baseUrl+'/bms/kanban/require/'+requireId,saveObj,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//删除需求
export const deleteRequireAjax = function(requireId){
  return axios.patch(baseUrl+'/bms/kanban/require/'+requireId+'/status?action=false',qs.stringify({
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true})
}
//添加任务日程计划
export const addTaskCalendarPlanAjax= function(saveObj){
  return axios.post(baseUrl+'/bms/kanban/taskCalendar/plan',saveObj,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true})
}
//根据姓名关键字获取人员列表
export const getUserListByNameQuery =  async function(nameQuery , vFlag){
  await axios.get(baseUrl+'/bms/public/user',{
    params:{
      nameQuery:nameQuery,
      time:new Date().getTime()
    }
  }).then(response => {
    if(typeof vFlag=="undefined"){
      this.userSearchResultsV = response.data;
    }else{
      this.userSearchResultsV[vFlag] = response.data;
      this.userSearchResultsV = {...this.userSearchResultsV};
      //console.log("this.userSearchResultsV[vFlag]:"+this.userSearchResultsV[vFlag]);
    }
  }).catch(error => {
      dealException(error);
  });
}

//反馈日程修改事件
export const feedbackCalendarTaskAjax = function(taskCalendarId,saveObj){
  return axios.put(baseUrl+'/bms/kanban/taskCalendar/feedback/'+taskCalendarId,saveObj,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//获取任务详情
export const getTaskDetail= async function(taskId){
  return await axios.get(baseUrl+'/bms/kanban/task/'+taskId,{
    params:{
      time:new Date().getTime()
    }
  })
}
//获取任务已用工时
export const getTaskUsedManHour= async function(taskId , exceptCalendarId){
  return await axios.get(baseUrl+'/bms/kanban/task/usedManHour/'+taskId,{
    params:{
      exceptCalendarId: exceptCalendarId,
      time:new Date().getTime()
    }
  })
}
//根据任务ID获取计划列表
export const getPlanListByTaskId = function(taskId){
  return axios.get(baseUrl+'/bms/kanban/taskCalendar/search',{
    params:{
      taskId:taskId,
      sort:'date',
      order:'desc',
      time:new Date().getTime()
    }
  })
}
export const formatDateToMinute = function(time_str){
  if(typeof time_str=="undefined") return "";
  if(time_str == null) return "";
  let return_str = time_str;
  if(return_str.length==19&&return_str.indexOf(":")>0){
      return_str = return_str.substring(0,return_str.lastIndexOf(":"));
  }
  return return_str;
}
//获取任务日程详情
export const getTaskCalendarDetail= function(taskCalendarId){
  return axios.get(baseUrl+'/bms/kanban/taskCalendar/'+taskCalendarId,{
    params:{
      time:new Date().getTime()
    }
  })
}
//编辑任务
export const updateTaskAjax = function(taskId,saveObj){
  return axios.put(baseUrl+'/bms/kanban/task/'+taskId,saveObj,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//任务确认评价
export const leaderConfirmTaskAjax = function(taskId,saveObj){
  return axios.put(baseUrl+'/bms/kanban/task/leaderConfirm/'+taskId,saveObj,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//添加任务
export const addTaskAjax= function(saveObj){
  return axios.post(baseUrl+'/bms/kanban/task',saveObj,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true})
}
//删除任务
export const deleteTaskAjax = function(taskId){
  return axios.patch(baseUrl+'/bms/kanban/task/'+taskId+'/status?action=false',qs.stringify({
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true})
}
//删除任务日程
export const deleteTaskCalendarAjax = function(taskCalendarId){
  return axios.patch(baseUrl+'/bms/kanban/taskCalendar/'+taskCalendarId+'/status?action=false',qs.stringify({
    time:new Date().getTime()
  },{arrayFormat:'repeat'}),{traditional:true})
}
//获取延展的操作记录列表（模块及子模块）
export const extSearchOpAction = function(objType ,  extObjType , objId){
  return axios.get(baseUrl+'/bms/public/action/extSearch',{
    params:{
      objType:objType,
      extObjType:extObjType,
      objId:objId,
      time:new Date().getTime()
    }
  })
}
export const getRequireStatusDesc =  function(statusId){
  let statusDesc = statusId;
  for(let i in requireStatusV){
    if(requireStatusV[i].id == statusId){
      statusDesc = requireStatusV[i].desc;
      break;
    }
  }
  return statusDesc;
}
export const requireStatusV = [
  { "id": -1, "desc": "未开始" },
  { "id": 10, "desc": "已立项" },
  { "id": 20, "desc": "研发中" },
  { "id": 30, "desc": "研发完毕" },
  { "id": 40, "desc": "测试中" },
  { "id": 50, "desc": "测试完毕" },
  { "id": 60, "desc": "已发布" },
  { "id": 70, "desc": "已关闭" }
]
export const getTaskStatusDesc =  function(statusId){
  let statusDesc = statusId;
  for(let i in taskStatusVForLeader){
    if(taskStatusVForLeader[i].id == statusId){
      statusDesc = taskStatusVForLeader[i].desc;
      break;
    }
  }
  return statusDesc;
}
export const taskStatusVForStaff = [
  { "id": 10, "desc": "已安排(待办)" },
  { "id": 20, "desc": "进行中" },
  //{ "id": 30, "desc": "已完成未确认" },
  { "id": 50, "desc": "挂起" },
]
export const taskStatusVForLeader = [
  { "id": -1, "desc": "未安排" },
  { "id": 10, "desc": "已安排(待办)" },
  { "id": 20, "desc": "进行中" },
  { "id": 30, "desc": "已完成未确认" },
  { "id": 40, "desc": "已完成已确认" },
  { "id": 50, "desc": "挂起" },
  { "id": 60, "desc": "取消" },
]
export const opActionObjectTypeV = [
  {"typeId": "taskCalendar", "typeDesc": "任务日程"},
  {"typeId": "task", "typeDesc": "任务"}
]

export const opActionV = [
  {"flag": "create", "desc": "创建"},
  {"flag": "feedback", "desc": "反馈"},
  {"flag": "edit", "desc": "编辑"},
  {"flag": "delete", "desc": "删除"},
  {"flag": "leaderConfirm", "desc": "确认评价"},
]

export const setActionDesc = function(actionNode){
  let desc = '';
  for(let i in opActionV){
    if(actionNode.action == opActionV[i].flag){
      if(actionNode.objectType == 'task'){
        desc = opActionV[i].desc+"任务";
      }else if(actionNode.objectType == 'taskCalendar'){
        desc = opActionV[i].desc+"任务日程计划";
      }else if(actionNode.objectType == 'require'){
        desc = opActionV[i].desc+"需求";
      }
    }
  }
  return desc;
}
export const addActionLogForCreate = function(basedV , dataV , objType , objId , objParentId , action){
  let v = [];
  for(let i in basedV){
    if(typeof  dataV[basedV[i].paramName]!="undefined"){
      let node = {};
      node.field = basedV[i].paramName;
      node.fieldDesc = basedV[i].desc;
      node.oldValue = '';
      node.newValue = dataV[basedV[i].paramName];
      v.push(node);
    }
  }
  let actionObj = {};
  actionObj.objectType = objType;
  actionObj.objectId = objId;
  actionObj.objectParentId = objParentId;
  actionObj.action = action;
  actionObj.detail = v;
  actionObj.time = new Date().getTime();
  axios.post(baseUrl+'/bms/public/action',actionObj,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true});
}
export const addActionLogForEdit = function(basedV , oriDataV , newDataV ,  objType , objId , objParentId , action){
  let v = [];
  for(let i in basedV){
    if(typeof  newDataV[basedV[i].paramName]!="undefined"){
      if(newDataV[basedV[i].paramName]!=oriDataV[basedV[i].paramName]){
        let node = {};
        node.field = basedV[i].paramName;
        node.fieldDesc = basedV[i].desc;
        node.oldValue = oriDataV[basedV[i].paramName];
        node.newValue = newDataV[basedV[i].paramName];
        v.push(node);
      }
    }
  }
  let actionObj = {};
  actionObj.objectType = objType;
  actionObj.objectId = objId;
  actionObj.objectParentId = objParentId;
  actionObj.action = action;
  actionObj.detail = v;
  actionObj.time = new Date().getTime();
  axios.post(baseUrl+'/bms/public/action',actionObj,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true});
}
export const addActionLogForDelete = function( objType , objId , objParentId , action){
  let actionObj = {};
  actionObj.objectType = objType;
  actionObj.objectId = objId;
  actionObj.objectParentId = objParentId;
  actionObj.action = action;
  actionObj.time = new Date().getTime();
  axios.post(baseUrl+'/bms/public/action',actionObj,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true});
}
/*
export const pageViewOptions = [
  {value:'forProduct' , label:'产品需求看板'},
  {value:'forProject' , label:'项目任务状态看板'},
  {value:'forTeam' , label:'团队任务状态看板'},
  {value:'forCalendar' , label:'伙伴任务日程看板'},
  {value:'forPersonal' , label:'个人日程看板'},
]*/
export const getPageViewOptions = function(){
  let pageViewOptionsV = [];
  if(this.opRoleList['mmmForProduct'].flag) pageViewOptionsV.push({value:'forProduct' , label:'产品需求看板'});
  if(this.opRoleList['mmmForProject'].flag) pageViewOptionsV.push({value:'forProject' , label:'项目任务状态看板'});
  if(this.opRoleList['mmmForTeam'].flag) pageViewOptionsV.push({value:'forTeam' , label:'团队任务状态看板'});
  if(this.opRoleList['mmmForCalendar'].flag) pageViewOptionsV.push({value:'forCalendar' , label:'伙伴任务日程看板'});
  if(this.opRoleList['mmmForPersonal'].flag) pageViewOptionsV.push({value:'forPersonal' , label:'个人日程看板'});
  return pageViewOptionsV;
}
export const jumpPage = function(){
  if(this.pageViewFlag == 'forProduct'){
    this.$router.push({
      path: '/mmmForProduct'
    });
  }else if(this.pageViewFlag == 'forProject'){
    this.$router.push({
      path: '/mmmforProject'
    });
  }else if(this.pageViewFlag == 'forTeam'){
    this.$router.push({
      path: '/mmmforTeam'
    });
  }else if(this.pageViewFlag == 'forCalendar'){
    this.$router.push({
      path: '/mmmCalendar/forCalendar'
    });
  }else if(this.pageViewFlag == 'forPersonal'){
    this.$router.push({
      path: '/mmmCalendar/forPersonal'
    });
  }
}
export const jumpToRequireListView = function(){
  this.$router.push({
    path: '/requireList/'+this.productId
  });
}
export const jumpToTaskListView = function(checkProjectId , checkProjectType , checkIsProjectExclusive , checkTeamUserGroupCode , checkIsPersonalExclusive , checkPageViewFlag , checkProjectName){
  let routerName = "taskList";
  if(checkIsProjectExclusive){         //如果是项目查看独占模式，那么是个弹出窗口，走定制路由
    routerName = "taskListInDialog";
  }
  this.$router.push({
    name: routerName,
    //name: 'taskList',
    params: {
      projectIdProp: checkProjectId ,    //默认项目id
      projectNameProp: checkProjectName ,
      proTypeProp: checkProjectType ,    //默认项目类别
      isProjectExclusiveProp: checkIsProjectExclusive ,   //是否仅针对某项目（从项目模块过来的）
      teamUserGroupCodeProp: checkTeamUserGroupCode ,     //团队标识
      isPersonalExclusiveProp: checkIsPersonalExclusive , //是否仅查看个人
      pageViewFlagProp: checkPageViewFlag                     //从某个看板切过来的
    }
  });
}

//获取产品列表
export const getProductList = function(){
  return axios.get(baseUrl+'/bms/kanban/product/search',{
    params:{
      time:new Date().getTime()
    }
  })
}
//获取内部迭代项目列表
export const getIterationProjectList = function(name){
  return axios.get(baseUrl+'/bms/kanban/iterationProject/search',{
    params:{
      name: name,
      time:new Date().getTime()
    }
  })
}
//往map里放obj
export const putObjToMap = function(targetMap , checkKey , checkObj){
  let checkNode = targetMap.get(checkKey);
  //console.log("1.checkNode:" + checkNode);
  if(typeof checkNode == "undefined"){
    targetMap.set(checkKey , checkObj);
  }
  //console.log("2.checkNode:" + targetMap.get(checkKey));
}
export const getObjInMap = function(checkMap , checkKey){
  if(typeof checkMap=="undefined") return null;
  //console.log("checkMap:" + checkMap);
  let checkNode = checkMap.get(checkKey);
  if(typeof checkNode == "undefined"){
    return null;
  }else{
    return checkNode;
  }
}
export const requireSourceFlagV = [
  { "id": 'project', "desc": "项目" },
  { "id": 'boss', "desc": "BOSS" },
  { "id": 'pmo', "desc": "PMO" },
  { "id": 'bug', "desc": "BUG" },
  { "id": 'custom', "desc": "客户" },
  { "id": 'other', "desc": "其他" },
]
export const taskTypeV = [
  { "id": '1', "desc": "常规任务" },
  { "id": '2', "desc": "Bug" },
  { "id": '3', "desc": "测试" },
  { "id": '4', "desc": "运维" },
  { "id": '5', "desc": "UI设计" },
  { "id": '0', "desc": "其他" },
]
//获取需求附件列表
export const getRequireFileList = function(requireId){
  return axios.get(baseUrl + '/file-manager/info/modular/bmsRequire' + "?modularInnerId=" + requireId,{
    time: new Date().getTime()
  },{ traditional: true})
}
//获取任务附件列表
export const getTaskFileList = function(taskId){
  return axios.get(baseUrl + '/file-manager/info/modular/bmsTask' + "?modularInnerId=" + taskId,{
    time: new Date().getTime()
  },{ traditional: true})
}
/*
export const getAuthToken = function(){
  return sessionStorage.getItem("ecoToken");
}
export const formatUrlWithAuthToken = function(url) {
  if (!url) {
    return;
  }
  url +=
    (url.indexOf("?") > 0 ? "&" : "?") +
    "eco-auth-token" +
    "=" +
    getAuthToken();
  return url;
}
export const getDownloadUrl = function(fileId){
  //console.log("#####fileId:"+fileId);
  return this.formatUrlWithAuthToken(baseUrl+'/file-manager/download/'+fileId);
}
export const getPreviewUrl = function(fileId){
  return this.formatUrlWithAuthToken(baseUrl+'/file-manager/preview/'+fileId);
}
*/
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
export const initOpRoleList = function(){
  //console.log("===initOpRoleList===sessionStorage.getItem('myOpRole'):"+sessionStorage.getItem('myOpRole'));
  let myOpRoleObj = window.JSON.parse(sessionStorage.getItem('myOpRole'));
  console.log("myOpRoleObj:" + myOpRoleObj);
  this.opRoleList = new OpRole();
  for(let i in myOpRoleObj){
    this.opRoleList.add(myOpRoleObj[i].role_key , myOpRoleObj[i].role_id , myOpRoleObj[i].flag);
  }
  console.log("this.opRoleList:" + this.opRoleList.getLength());
}

/*
export const getOpRole = async function(){
  for (let i in this.roleList) {
    let node_role_key = this.roleList[i];
    //console.log(i+"@@node_role_key:"+node_role_key.role_id);
    await axios.get(baseUrl+'/org/user/personal/role/is-exists-anyone-or-admin',{
      params:{
        'role-def':node_role_key.role_id,
        time:new Date().getTime()
      }
    }).then(res=>{
      //console.log("getOpRole res:"+res.data);
      node_role_key.flag = res.data;
    }).catch(e=>{
      //console.log("#########error error::" +  e);
    });
    //console.log(i+"====================================");
  }
}*/

//获取任务反馈文档列表
export const getFeedbackFileList = function(taskCalendarId){
  return axios.get(baseUrl + '/file-manager/info/modular/bmsTaskCalendarFeedback' + "?modularInnerId=" + taskCalendarId,{
    time: new Date().getTime()
  },{ traditional: true})
}
//导出指令列表
export const searchTaskListXlsExpAjax = function (paginationInfo) {
let searchParam = setTaskListSearchParam(paginationInfo);
  searchParam.page = 1;
  searchParam.rows = 2000;
  return axios.post(baseUrl + '/bms/kanban/taskListXlsExp',searchParam,  {headers: {'Content-Type': 'application/json;charset=UTF-8'},traditional: true, responseType: 'blob'});
}
//获取团队用户组
export const getUserGroupListForKanban = function(){
  return axios.get(baseUrl + '/bms/public/userGroupListForKanban' ,{
    time: new Date().getTime()
  },{ traditional: true});
}
//获取团队名称
export const getTeamName = function(checkCode , checkList){
  let teamName = '';
  for(let i in checkList){
    if(checkList[i].code == checkCode){
      teamName = checkList[i].name;
      break;
    }
  }
  return teamName;
}