import axios from 'axios';
import {baseUrl,ecoPubAuthToken,sysEnv} from '@/modules/bmsMmm/config/env';
import { OpRole } from "@/modules/bmsMmm/util/OpRole.js";
import qs from 'qs';
import {EcoFile} from '@/components/file/main.js';
export const loadOpRole = async function(resetFlag){  // resetFlag: 0,如果session里已有，则返回；1,强制再取一次
    console.log("sessionStorage ecoToken : " + sessionStorage.getItem('ecoToken'));
    if(sessionStorage.getItem('ecoToken')==null) return;  //session中还没有ecoToken,说明还没登录，所以不取权限
    console.log("sessionStorage myOpRole : " + sessionStorage.getItem('myOpRole'));
    if(typeof resetFlag!="undefined" && resetFlag){
      console.log("应该是刚登录，强制获取myOpRole！！！");
    }else{
      if(sessionStorage.getItem('myOpRole')!=null){
        console.log("myOpRole 已存在，不重复获取");
        return;  //如果session中已存在myOpRole,说明已取过权限，所以不用再走
      }else{
        console.log("myOpRole 不存在，将进行获取");
      }
    }
    let roleNameList = Array(roleList.getLength());
    for (let i in roleList) {
      let node_role_key = roleList[i];
      //console.log(i+"@@node_role_key:"+node_role_key.role_id);
      roleNameList.push(node_role_key.role_id);
    }

    //console.log(i+"@@node_role_key:"+node_role_key.role_id);
    await axios.get(baseUrl+'/org/user/personal/role/is-exists-one-by-one',{
      params:{
        'ref':roleNameList,
        time:new Date().getTime()
      },
      paramsSerializer: function(params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      },
    }).then(res=>{
      //console.log("getOpRole res:"+res.data);
      //console.log("getOpRole isAdmin:"+res.data.admin);
      //console.log("getOpRole authenticationMap:"+res.data.authenticationMap);
      if(res.data.admin){  //是系统管理员，则全部为true
        for(let j in roleList){
          roleList[j].flag = true;
        }
      }else{
        for(let i in res.data.authenticationMap){
          //console.log(i+"getOpRole authenticationMap node:"+res.data.authenticationMap[i]);
          for(let j in roleList){
            if(roleList[j].role_id == i){
              roleList[j].flag = res.data.authenticationMap[i];
            }
          }
        }
      }

    }).catch(e=>{
      console.log("#########error error::" +  e);
    });
    //console.log(i+"====================================");
    let roleListValue = window.JSON.stringify(roleList);
    //console.log("====================================set to session======roleListValue:"+roleListValue);
    sessionStorage.setItem('myOpRole',roleListValue);
    console.log("获取myOpRole完毕 *^_^* ");
}

  export const roleList = new OpRole()
  .add("addTask" , "bms.task.bmsDevTask_bms.task.addTask" , false)
  .add("editTask" , "bms.task.bmsDevTask_bms.task.editTask" , false)
  .add("deleteTask" , "bms.task.bmsDevTask_bms.task.deleteTask" , false)
  .add("assignTask" , "bms.task.bmsDevTask_bms.task.assignTask" , false)
  .add("addCalendar" , "bms.task.bmsDevTask_bms.task.addCalendar" , false)
  .add("addFeedback" , "bms.task.bmsDevTask_bms.task.addFeedback" , false)
  .add("deleteCalendar" , "bms.task.bmsDevTask_bms.task.deleteCalendar" , false)
  .add("leaderConfirm" , "bms.task.bmsDevTask_bms.task.leaderConfirm" , false)
  .add("mmmForProduct" , "bms.kanban.viewPage_bms.task.mmmForProductTab" , false)
  .add("mmmForProject" , "bms.kanban.viewPage_bms.task.mmmForProjectTab" , false)
  .add("mmmForTeam" , "bms.kanban.viewPage_bms.task.mmmForTeamTab" , false)
  .add("mmmForCalendar" , "bms.kanban.viewPage_bms.task.mmmForCalendarTab" , false)
  .add("mmmForPersonal" , "bms.kanban.viewPage_bms.task.mmmForPersonalTab" , false)
  .add("afTeamView" , "bms.kanban.teamView_bms.task.afTeamViewTab" , false)
  .add("iBpmTeamView" , "bms.kanban.teamView_bms.task.iBpmTeamViewTab" , false)
  .add("addProject" , "bms.project_bms.project.addProject" , false)
  .add("deleteProject" , "bms.project_bms.project.deleteProject" , false)
  .add("viewAllProject" , "bms.project_bms.project.viewAllProject" , false)
  .add("projectAdmin" , "bms.project_bms.project.projectAdmin" , false)
  .add("addCustomer" , "bms.customer_bms.customer.addCustomer" , false)
  .add("deleteCustomer" , "bms.customer_bms.customer.deleteCustomer" , false)
  .add("viewAllCustomer" , "bms.customer_bms.customer.viewAllCustomer" , false)
  .add("customerAdmin" , "bms.customer_bms.customer.customerAdmin" , false)
  .add("customerFinAdmin" , "bms.customer_bms.customer.customerFinancialAdmin" , false)
  .add("projectFinAdmin" , "bms.project_bms.project.projectFinancialAdmin" , false)

//获取关联数据的数值总和
export const getDataJournalSumByFinalRelatedProject= function(finalRelatedProjectId , funcFlagStr){
  return axios.get(baseUrl+'/bms/public/dataJournal/sumByFinalRelatedProject',{
    params:{
      final_related_project_id : finalRelatedProjectId ,
      func_flag_str : funcFlagStr,
      time:new Date().getTime()
    }
  })
}
//获取只关联了客户，未关联最终项目的数值总和
export const getDataJournalSumByNoFinalRelatedProjectJustBa= function(baId , funcFlagStr){
  return axios.get(baseUrl+'/bms/public/dataJournal/sumByNoFinalRelatedProjectJustBa',{
    params:{
      ba_id : baId ,
      func_flag_str : funcFlagStr,
      time:new Date().getTime()
    }
  })
}
//获取关联数据列表
export const getDataJournalList = function(paginationInfo , modular , modularInnerId , funcFlagStr){
  return axios.get(baseUrl+'/bms/public/dataJournal/search',{
    params:{
      modular : modular ,
      modular_inner_id : modularInnerId ,
      func_flag_str : funcFlagStr,

      sort:paginationInfo.sort,//字符串，可以是数组，排序列名称
      order:paginationInfo.order,//字符串，可以是数组，排序列顺序或者逆序
      page:paginationInfo.page,//整数，分页查询第几页
      rows:paginationInfo.rows,//整数，分页行数

      time:new Date().getTime()
    }
  })
}
//根据finalRelatedProjectId获取关联数据列表
export const getDataJournalListByFinalRelatedProjectId = function(paginationInfo , finalRelatedProjectId , funcFlagStr){
  return axios.get(baseUrl+'/bms/public/dataJournal/search',{
    params:{
      finalRelatedProjectId : finalRelatedProjectId ,
      func_flag_str : funcFlagStr,
      sort:paginationInfo.sort,//字符串，可以是数组，排序列名称
      order:paginationInfo.order,//字符串，可以是数组，排序列顺序或者逆序
      page:paginationInfo.page,//整数，分页查询第几页
      rows:paginationInfo.rows,//整数，分页行数

      time:new Date().getTime()
    }
  })
}

//获取只关联了客户，没有关联finalRelatedProjectId的关联数据列表
export const getDataJournalListByNoFinalRelatedProjectIdJustBa = function(paginationInfo , baId , funcFlagStr){
  return axios.get(baseUrl+'/bms/public/dataJournal/search',{
    params:{
      modular : 'ba',
      isNoFinalRelatedProjectJustBaFlag : 1,
      modular_inner_id : baId ,
      func_flag_str : funcFlagStr,
      sort:paginationInfo.sort,//字符串，可以是数组，排序列名称
      order:paginationInfo.order,//字符串，可以是数组，排序列顺序或者逆序
      page:paginationInfo.page,//整数，分页查询第几页
      rows:paginationInfo.rows,//整数，分页行数

      time:new Date().getTime()
    }
  })
}

export const formatDateToDay = function(time_str){
  let return_str = time_str;
  if(return_str.length==19&&return_str.indexOf(" ")>0){
      return_str = return_str.substring(0,return_str.lastIndexOf(" "));
  }
  return return_str;
}
export const handleDataJournalExtContent = function(extContent){
  let op_content = extContent;
  if(extContent!=null && extContent.indexOf("*c*")>0){
    let rowInfoList = extContent.split("*c*");
    //console.log("@rowInfoList:" + rowInfoList.length);
    //op_content = rowInfoList.join("<br>");
    let tmpArray = [];
    for(let i in rowInfoList){
      let checkLine = rowInfoList[i];
      if(checkLine.indexOf("*s*")>0){
        let checkLineList = checkLine.split("*s*");
        let newLineContent = checkLineList[0] + ": ";
        for(let j=1;j<checkLineList.length;j++){
          newLineContent += checkLineList[j] + " , ";
        }
        newLineContent = newLineContent.substring(0,newLineContent.lastIndexOf(","));
        checkLine = newLineContent;
      }
      tmpArray.push(checkLine);
    }
    op_content = tmpArray.join("<br>");
  }
  return op_content;
}
/*附件预览*/
export const doFilePreviewAction = function(obj){
  EcoFile.openFileHeaderByView(obj.id,obj.name);
}
/*附件下载*/
export const doFileDownloadAction = function(obj){
  EcoFile.openFileHeaderByDownload(obj.id,obj.name);
}
export const handleCommentsInfo = function(commentsInfo){
  let op_commentsInfo = commentsInfo;
  op_commentsInfo = op_commentsInfo.replace(/\n/g,'<br/>');
  //console.log("##op_commentsInfo:" + op_commentsInfo);
  return op_commentsInfo;
}
export const formatDateToMinute = function(time_str){
  var return_str = time_str;
  if(return_str.length==19&&return_str.indexOf(":")>0){
      return_str = return_str.substring(0,return_str.lastIndexOf(":"));
  }
  return return_str;
}
export const formatBrText = function(checkStr){
  let opText = checkStr;
  opText = opText.replace(/\r\n/g,"<br>");
  opText = opText.replace(/\n/g,"<br>");
  return opText;
}
export const getCurrDateMinute = function(){
  let yy = new Date().getFullYear();
  var mm =
    new Date().getMonth() < 9
      ? "0" + (new Date().getMonth() + 1)
      : new Date().getMonth() + 1;
  var dd =
    new Date().getDate() < 10
      ? "0" + new Date().getDate()
      : new Date().getDate();
  var hh = new Date().getHours() < 10 ? "0" + (new Date().getHours()) : (new Date().getHours()) ;
  //console.log("hhhh:" + hh);
  var mf =
    new Date().getMinutes() < 10
      ? "0" + new Date().getMinutes()
      : new Date().getMinutes();
  return yy + "-" + mm + "-" + dd + " " + hh + ":" + mf ;
}
export const getCurrDateSecond = function(){
  let yy = new Date().getFullYear();
  var mm =
    new Date().getMonth() < 9
      ? "0" + (new Date().getMonth() + 1)
      : new Date().getMonth() + 1;
  var dd =
    new Date().getDate() < 10
      ? "0" + new Date().getDate()
      : new Date().getDate();
  var hh = new Date().getHours() < 10 ? "0" + (new Date().getHours()) : (new Date().getHours()) ;
  //console.log("hhhh:" + hh);
  var mf =
    new Date().getMinutes() < 10
      ? "0" + new Date().getMinutes()
      : new Date().getMinutes();
  var se =
      new Date().getSeconds() < 10
        ? "0" + new Date().getSeconds()
        : new Date().getSeconds();
  return yy + mm + dd + hh + mf + se ;
}
export const relatedDataFuncFlagWfForBa = [
  { "id": 21, "desc": "Call-in客户处理流程" },
  { "id": 22, "desc": "有效商机处理流程" },
  { "id": 52, "desc": "大客户协助流程" },
  { "id": 23, "desc": "客户初次拜访流程" },
  { "id": 46, "desc": "销售客户拜访记录" },
  { "id": 25, "desc": "合同文件审批流程" },
  { "id": 29, "desc": "实施外出联系单" },
  { "id": 31, "desc": "客户诉求流程" },
  { "id": 38, "desc": "开票申请流程" },
  { "id": 40, "desc": "外出联系单" },
  { "id": 41, "desc": "工作联系流程" },
  { "id": 43, "desc": "技术人员外派申请流程" },
  { "id": 8, "desc": "88wh老平台Call-in流程" },
  { "id": 9, "desc": "88wh老平台商机流程" },
  { "id": 10, "desc": "88crm老平台Call-in流程" },
  { "id": 11, "desc": "88crm老平台商机流程" },
  { "id": 54, "desc": "AF注册客户处理流程" }
]
export const relatedDataFuncFlagWfForProject = [
  { "id": 26, "desc": "销售转实施工作移交流程" },
  { "id": 27, "desc": "实施版本申请流程" },
  { "id": 28, "desc": "实施服务流程" },
  { "id": 30, "desc": "项目实施转维护流程" },
  { "id": 39, "desc": "开票申请流程" },
  { "id": 42, "desc": "工作联系流程" },
  { "id": 44, "desc": "技术人员外派申请流程" },
  { "id": 49, "desc": "实施项目日报" },
  { "id": 50, "desc": "实施项目周报" }
]
//=============================标签==================================
export const getTagOption = async function(tagKvGroupId){
  let kvList = await axios.get(baseUrl+'/basic/kv/group/'+tagKvGroupId+'/detail/select-enabled',{
    params:{
      time:new Date().getTime()
    }
  }).then(res=>{
    //console.log("res.data:" + res.data.length)
    return res.data;
  }).catch(e=>{console.log("errorrrrrr!")});
  //console.log("kvListkvListkvList:" + kvList.length)
  let dynamicTags = [];
  for (let x = 0; x < kvList.length; x++) {
    let tagobj = {};
    tagobj.name = kvList[x].text;
    tagobj.id = kvList[x].id;
    tagobj.type = "info";
    dynamicTags.push(tagobj);
  }
  return dynamicTags;
}

export const setSelectedTag = function(dynamicTags , i){
  dynamicTags[i].type ? (dynamicTags[i].type = "") : (dynamicTags[i].type = "info");
  let selectedTag = [];
  for (let z = 0; z < dynamicTags.length; z++) {
    if (dynamicTags[z].type != "info") {
      let zobj = {};
      zobj.tagKeyId = dynamicTags[z].id;
      selectedTag.push(zobj);
    }
  }
  return selectedTag;
}
// 添加标签输入框失去焦点或按下回车键
export const handleTagInputConfirm = function(){
  //console.log("1111111111111111")
  let inputValueb = {};
  inputValueb.name = this.dynamicTagInputValue;
  inputValueb.type = "info";
  if (inputValueb.name) {
    addTag(this.TAG_GROUP_ID , inputValueb.name , this.dynamicTags.length+1).then((res) => {
      let addTagobj = {};
      addTagobj.name = res.data.text;
      addTagobj.id = res.data.id;
      addTagobj.type = "info";
      this.dynamicTags.push(addTagobj);
    });
  }
  this.dynamicTagInputVisible = false;
  this.dynamicTagInputValue = "";
}
export const showTagInput = function(){
  this.dynamicTagInputVisible = true;
  this.$nextTick((_) => {
    //console.log( this.$refs.newTagInput[0].focus());
    // console.log("this.$refs.newTagInput.$refs:" + this.$refs.newTagInput[0].$refs.input);
    this.$refs.newTagInput[0].focus();
  });
}
// 添加标签
export const addTag= function(groupId , msg , order){
  return axios.post(baseUrl+'/bms/public/addTag',{
    group: groupId ,
    text:msg,
    order: order ,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;;charset=UTF-8'},
    traditional:true})
}
//根据fileId获取文件详情
export const getFileDetail= async function(fileId){
  return await axios.get(baseUrl+'/bms/project/getFileInfo/'+fileId,{
    params:{
      time:new Date().getTime()
    }
  })
}