<template>
    <div class="toDoCenter componentPage">
          <div class="pageHeader">
              <div class="pageHeaderBtn active cursorP" >待办<span>任务</span></div>
              <div class="more" @click='goMore()'>more&ensp;></div>
          </div>
          <div class="pageBody">
            <el-table  stripe  @row-click='rowClick' :data='tableData' header-row-class-name='tableHeader' class='toDoTable'  tooltip-effect='dark' height='100%'>
                 <el-table-column label='来源' prop='modularName'></el-table-column>
                 <el-table-column label='标题' prop='menu'>
                     <template slot-scope='scope'>
                         <span class="cursorP linkB" :title="itemTitle[scope.row.menu]">{{itemTitle[scope.row.menu]}}</span>
                     </template>
                 </el-table-column>
                 <el-table-column label='数量' prop='count'></el-table-column>
            </el-table>
          </div>
    </div>
</template>
<script>
    import {queryAssignList} from '../../service/service.js'
    export default {
        data(){
            return {
                itemMenu:'',
                tableData:[],
                descList:{
                    "standardPlanRelease-planIndex-TECH_INNOVATION_DEPT_CREATE":"企业标准计划发布",
                    "standardPlanRelease-planIndex-DEPT_LIAISON_PROOF":"企业标准计划发布",
                    "standardPlanRelease-planIndex-OFFICE_LIAISON_HANDLE":"企业标准计划发布",
                    "standardPlanRelease-planIndex-SPECIFIC_DEPT_SECTION_CHIEF_VERIFY":"企业标准计划发布",
                    "standardPlanRelease-planIndex-DEPT_LIAISON_VERIFY":"企业标准计划发布",
                    "standardPlanRelease-planIndex-STD_REVIEWER_VERIFY":"企业标准计划发布",
                    "standardPlanRelease-planIndex-SPECIFIC_DEPT_MINISTER_VERIFY":"企业标准计划发布",
                    "standardPlanRelease-planIndex-TECH_INNOVATION_DEPT_PENDING":"企业标准计划发布",

                    "businessGuidemanage-businessGuideIndex-STI_DEPT_START":"业务指南规划管理",
                    "businessGuidemanage-businessGuideIndex-DEPT_LIAISON_CONFIRM":"业务指南规划管理",
                    "businessGuidemanage-businessGuideIndex-RESPONSIBLE_USER_CONFIRM":"业务指南规划管理",
                    "businessGuidemanage-businessGuideIndex-SECTION_CHIEF_APPROVE":"业务指南规划管理",
                    "businessGuidemanage-businessGuideIndex-DEPT_LIAISON_APPROVE":"业务指南规划管理",
                    "businessGuidemanage-businessGuideIndex-EXPERT_APPROVE":"业务指南规划管理",
                    "businessGuidemanage-businessGuideIndex-DEPT_MINISTER_APPROVE":"业务指南规划管理",
                    "businessGuidemanage-businessGuideIndex-STI_DEPT_CONFIRM":"业务指南规划管理",
                    "businessGuidemanage-businessGuideIndex-STD_REGULATION_SECTION_CHIEF_APPROVE":"业务指南规划管理",
                    "businessGuidemanage-businessGuideIndex-STI_DEPT_MINISTER_APPROVE":"业务指南规划管理",
                    "businessGuidemanage-businessGuideIndex-CENTER_STD_COMMITTEE_APPROVE":"业务指南规划管理",

                    "businessGuidemanage-businessGuidePlan-STI_DEPT_START":"业务指南计划发布",
                    "businessGuidemanage-businessGuidePlan-DEPT_LIAISON_CONFIRM":"业务指南计划发布",
                    "businessGuidemanage-businessGuidePlan-SECTION_CHIEF_APPROVE":"业务指南计划发布",
                    "businessGuidemanage-businessGuidePlan-DEPT_MINISTER_APPROVE":"业务指南计划发布",
                    "businessGuidemanage-businessGuidePlan-STI_DEPT_PUBLISH":"业务指南计划发布",

                    "serviceGuideGuidePlanIndex":"业务指南计划管理",
                    "serviceGuideGuideReviseIndex":"业务指南制修订",

                    "planManagementPlanManageIndex":"企业标准计划管理",
                    "planManagementReviseIndex":"企业标准制修订",

                    "standardPlanning-confirm-TECH_INNOVATION_DEPT_CREATE":"标准规划维护",
                    "standardPlanning-confirm-DEPT_LIAISON_PROOF":"标准规划维护",
                    "standardPlanning-confirm-OFFICE_LIAISON_CHOOSE":"标准规划维护",
                    "standardPlanning-confirm-RESPONSIBLE_HANDLE":"标准规划维护",
                    "standardPlanning-confirm-DEPT_LIAISON_VERIFY":"标准规划维护",
                    "standardPlanning-confirm-STD_REVIEWER_VERIFY":"标准规划维护",
                    "standardPlanning-confirm-TECH_INNOVATION_DEPT_INITIATE":"标准规划维护",
                    "standardPlanning-confirm-BUSINESS_PLAN_DEPT_INITIATE":"标准规划维护",
                    "standardPlanning-confirm-STD_REGULATIONS_ROOM_SECTION_CHIEF_INITIATE":"标准规划维护",
                    "standardPlanning-confirm-SPECIFIC_DEPT_SECTION_CHIEF_VERIFY":"标准规划维护",
                    "standardPlanning-confirm-SPECIFIC_DEPT_MINISTER_VERIFY":"标准规划维护",
                    "standardPlanning-confirm-SUBCOMMITTEE_VERIFY":"标准规划维护",
                    "standardPlanning-confirm-STD_REGULATIONS_ROOM_SECTION_CHIEF_VERIFY":"标准规划维护",
                    "standardPlanning-confirm-TECH_INNOVATION_DEPT_MINISTER_VERIFY":"标准规划维护",
                    "standardPlanning-confirm-ORG_SYSTEM_ROOM_SECTION_CHIEF_VERIFY":"标准规划维护",
                    "standardPlanning-confirm-BUSINESS_PLAN_DEPT_MINISTER_VERIFY":"标准规划维护",
                    "standardPlanning-confirm-TECH_INNOVATION_DEPT_MINISTER_SECOND_VERIFY":"标准规划维护",
                    "standardPlanning-confirm-CENTER_STD_SUBCOMMITTEE_VERIFY":"标准规划维护",
                    "modelInProduction-organizationList":'公告车型管理编制',
                    "modelInProduction-approveList":"公告车型管理审批",
                    "regulatoryTrackingForm-approve":"法规动态信息审批",
                    "regulatoryTrackingForm-organization":"法规动态信息维护",
                    "regulatoryTrackingForm-notice":"通知单编制",
                    "regulatoryTrackingForm-noticeApprove":"通知单审核",
                    "regulatoryTrackingForm-noticeProofreading":"通知单校对",
                    "regulationStructured-approve": "结构化库审批",
                    "regulationStructured-organization":"结构化编制",
                    "recurrencePreventionList-approve":"再发防止清单库审批",
                    "recurrencePreventionList-organization":"再发防止清单库编制",
                    "rideHailing-approve":"网约车审批",
                    "project-taskList-liaison":"项目开发点检",
                    "project-taskList-designList":"项目开发点检",
                    "project-taskList-departmentHead":'项目开发点检',
                    "project-taskList-DepartmentContact":'项目开发点检',
                    "project-taskList-RegulatoryContact":'项目开发点检',
                    "project-taskList-RegulatoryHead":'项目开发点检',
                    "project-realVehicle-personAudit":'项目开发点检' ,
                    "modelInProduction-spotCheck-pagePage2":'在产车点检清单',
                    "modelInProduction-spotCheck-pagePage3-step3":'在产车点检清单',
                    "modelInProduction-spotCheck-pagePage3-step4":'在产车点检清单',
                    "modelInProduction-spotCheck-pagePage3-step5": '在产车点检清单',
                    "termWorkflow":'待办流程'
                },
                itemTitle:{
                    "standardPlanRelease-planIndex-TECH_INNOVATION_DEPT_CREATE":"企业标准计划发布-科技创新部编制发起",
                    "standardPlanRelease-planIndex-DEPT_LIAISON_PROOF":"企业标准计划发布-部门联络员校对",
                    "standardPlanRelease-planIndex-OFFICE_LIAISON_HANDLE":"企业标准计划发布-科室联络员办理",
                    "standardPlanRelease-planIndex-SPECIFIC_DEPT_SECTION_CHIEF_VERIFY":"企业标准计划发布-业务部门科长审核",
                    "standardPlanRelease-planIndex-DEPT_LIAISON_VERIFY":"企业标准计划发布-部门联络员审核",
                    "standardPlanRelease-planIndex-STD_REVIEWER_VERIFY":"企业标准计划发布-标准审查人员审核",
                    "standardPlanRelease-planIndex-SPECIFIC_DEPT_MINISTER_VERIFY":"企业标准计划发布-业务部门部长审核",
                    "standardPlanRelease-planIndex-TECH_INNOVATION_DEPT_PENDING":"企业标准计划发布-科技创新部-待发布",

                    "businessGuidemanage-businessGuideIndex-STI_DEPT_START":"业务指南规划管理-科技创新部创建",
                    "businessGuidemanage-businessGuideIndex-DEPT_LIAISON_CONFIRM":"业务指南规划管理-部门联络员确认",
                    "businessGuidemanage-businessGuideIndex-RESPONSIBLE_USER_CONFIRM":"业务指南规划管理-责任人确认",
                    "businessGuidemanage-businessGuideIndex-SECTION_CHIEF_APPROVE":"业务指南规划管理-科长审核",
                    "businessGuidemanage-businessGuideIndex-DEPT_LIAISON_APPROVE":"业务指南规划管理-部门联络员审核",
                    "businessGuidemanage-businessGuideIndex-EXPERT_APPROVE":"业务指南规划管理-专家审核",
                    "businessGuidemanage-businessGuideIndex-DEPT_MINISTER_APPROVE":"业务指南规划管理-部长审核",
                    "businessGuidemanage-businessGuideIndex-STI_DEPT_CONFIRM":"业务指南规划管理-科技创新部发起确认",
                    "businessGuidemanage-businessGuideIndex-STD_REGULATION_SECTION_CHIEF_APPROVE":"业务指南规划管理-标准法规室科长审核",
                    "businessGuidemanage-businessGuideIndex-STI_DEPT_MINISTER_APPROVE":"业务指南规划管理-科技创新部部长审核",
                    "businessGuidemanage-businessGuideIndex-CENTER_STD_COMMITTEE_APPROVE":"业务指南规划管理-中心标委会议长审核",

                    "businessGuidemanage-businessGuidePlan-STI_DEPT_START":"业务指南计划发布-科技创新部发起",
                    "businessGuidemanage-businessGuidePlan-DEPT_LIAISON_CONFIRM":"业务指南计划发布-部门联络员确认",
                    "businessGuidemanage-businessGuidePlan-SECTION_CHIEF_APPROVE":"业务指南计划发布-科长审核",
                    "businessGuidemanage-businessGuidePlan-DEPT_MINISTER_APPROVE":"业务指南计划发布-部长审核",
                    "businessGuidemanage-businessGuidePlan-STI_DEPT_PUBLISH":"业务指南计划发布-科技创新部待发布",

                    "serviceGuideGuidePlanIndex":"业务指南计划管理",
                    "serviceGuideGuideReviseIndex":"业务指南制修订",

                    "planManagementPlanManageIndex":"企业标准计划管理",
                    "planManagementReviseIndex":"企业标准制修订",

                    "standardPlanning-confirm-TECH_INNOVATION_DEPT_CREATE":"标准规划维护-科技创新部编制发起",
                    "standardPlanning-confirm-DEPT_LIAISON_PROOF":"标准规划维护-部门联络员校对",
                    "standardPlanning-confirm-OFFICE_LIAISON_CHOOSE":"标准规划维护-业务科室联络员指定责任人",
                    "standardPlanning-confirm-RESPONSIBLE_HANDLE":"标准规划维护-责任人办理",
                    "standardPlanning-confirm-DEPT_LIAISON_VERIFY":"标准规划维护-部门联络员审核",
                    "standardPlanning-confirm-STD_REVIEWER_VERIFY":"标准规划维护-标准审查人员审核",
                    "standardPlanning-confirm-TECH_INNOVATION_DEPT_INITIATE":"标准规划维护-科技创新部发起",
                    "standardPlanning-confirm-BUSINESS_PLAN_DEPT_INITIATE":"标准规划维护-事业计划部发起",
                    "standardPlanning-confirm-STD_REGULATIONS_ROOM_SECTION_CHIEF_INITIATE":"标准规划维护-标准法规室科长发起",
                    "standardPlanning-confirm-SPECIFIC_DEPT_SECTION_CHIEF_VERIFY":"标准规划维护-业务部门科长审核",
                    "standardPlanning-confirm-SPECIFIC_DEPT_MINISTER_VERIFY":"标准规划维护-业务部门部长审核",
                    "standardPlanning-confirm-SUBCOMMITTEE_VERIFY":"标准规划维护-分标委审核",
                    "standardPlanning-confirm-STD_REGULATIONS_ROOM_SECTION_CHIEF_VERIFY":"标准规划维护-标准法规室科长审核",
                    "standardPlanning-confirm-TECH_INNOVATION_DEPT_MINISTER_VERIFY":"标准规划维护-科技创新部部长审核",
                    "standardPlanning-confirm-ORG_SYSTEM_ROOM_SECTION_CHIEF_VERIFY":"标准规划维护-组织体系室科长审核",
                    "standardPlanning-confirm-BUSINESS_PLAN_DEPT_MINISTER_VERIFY":"标准规划维护-事业计划部部长审核",
                    "standardPlanning-confirm-TECH_INNOVATION_DEPT_MINISTER_SECOND_VERIFY":"标准规划维护-科技创新部部长二次审核",
                    "standardPlanning-confirm-CENTER_STD_SUBCOMMITTEE_VERIFY":"标准规划维护-中心标委会议长审核",
                    "modelInProduction-organizationList":'公告车型管理编制',
                    "modelInProduction-approveList":"公告车型管理审批",
                    "regulatoryTrackingForm-approve":"法规动态信息-审批(发放)",
                    "regulatoryTrackingForm-organization":"法规动态信息维护",
                    "regulatoryTrackingForm-notice":"通知单编制",
                    "regulatoryTrackingForm-noticeApprove":"通知单审核",
                    "regulatoryTrackingForm-noticeProofreading":"通知单校对",
                    "regulationStructured-approve": "法规结构化数据库-审批",
                    "regulationStructured-organization":"结构化编制",
                    "recurrencePreventionList-approve":"再发防止清单-提交",
                    "recurrencePreventionList-organization":"再发防止清单-编制",
                    "rideHailing-approve":"网约车-审批",
                    "project-taskList-liaison":"设计法规点检-联络人确认",
                    "project-taskList-designList":"设计法规点检-设计师办理",
                    "project-taskList-departmentHead":'设计法规点检-部门专业负责人审核',
                    "project-taskList-DepartmentContact":'设计法规点检-部门联络人审核',
                    "project-taskList-RegulatoryContact":'设计法规点检-法规项目联络人审核',
                    "project-taskList-RegulatoryHead":'设计法规点检-法规专业负责人审核',
                    "project-realVehicle-personAudit":'实车法规点检-法规专业负责人审核' ,
                    "modelInProduction-spotCheck-pagePage2":'在产车法规点检-设计师办理',
                    "modelInProduction-spotCheck-pagePage3-step3":'在产车法规点检-专业部门审核',
                    "modelInProduction-spotCheck-pagePage3-step4":'在产车法规点检-法规负责人审核',
                    "modelInProduction-spotCheck-pagePage3-step5": '在产车法规点检-标准法规室总师审核',
                    "termWorkflow":'术语流程'
                },
                tabKey:{
                    "standardPlanRelease-planIndex-TECH_INNOVATION_DEPT_CREATE":"SM_1455048752067964930tab",
                    "standardPlanRelease-planIndex-DEPT_LIAISON_PROOF":"SM_1455048752067964930tab",
                    "standardPlanRelease-planIndex-OFFICE_LIAISON_HANDLE":"SM_1455048752067964930tab",
                    "standardPlanRelease-planIndex-SPECIFIC_DEPT_SECTION_CHIEF_VERIFY":"SM_1455048752067964930tab",
                    "standardPlanRelease-planIndex-DEPT_LIAISON_VERIFY":"SM_1455048752067964930tab",
                    "standardPlanRelease-planIndex-STD_REVIEWER_VERIFY":"SM_1455048752067964930tab",
                    "standardPlanRelease-planIndex-SPECIFIC_DEPT_MINISTER_VERIFY":"SM_1455048752067964930tab",
                    "standardPlanRelease-planIndex-TECH_INNOVATION_DEPT_PENDING":"SM_1455048752067964930tab",

                    "planManagementPlanManageIndex":"SM_1457660694955814914tab",
                    "planManagementReviseIndex":"SM_1458640288710033409tab",
                    "serviceGuideGuidePlanIndex":"SM_1461606182193127425tab",
                    "serviceGuideGuideReviseIndex":"SM_1463335369695739906tab",

                    "businessGuidemanage-businessGuideIndex-STI_DEPT_START":"SM_1466606850282291202tab",
                    "businessGuidemanage-businessGuideIndex-DEPT_LIAISON_CONFIRM":"SM_1466606850282291202tab",
                    "businessGuidemanage-businessGuideIndex-RESPONSIBLE_USER_CONFIRM":"SM_1466606850282291202tab",
                    "businessGuidemanage-businessGuideIndex-SECTION_CHIEF_APPROVE":"SM_1466606850282291202tab",
                    "businessGuidemanage-businessGuideIndex-DEPT_LIAISON_APPROVE":"SM_1466606850282291202tab",
                    "businessGuidemanage-businessGuideIndex-EXPERT_APPROVE":"SM_1466606850282291202tab",
                    "businessGuidemanage-businessGuideIndex-DEPT_MINISTER_APPROVE":"SM_1466606850282291202tab",
                    "businessGuidemanage-businessGuideIndex-STI_DEPT_CONFIRM":"SM_1466606850282291202tab",
                    "businessGuidemanage-businessGuideIndex-STD_REGULATION_SECTION_CHIEF_APPROVE":"SM_1466606850282291202tab",
                    "businessGuidemanage-businessGuideIndex-STI_DEPT_MINISTER_APPROVE":"SM_1466606850282291202tab",
                    "businessGuidemanage-businessGuideIndex-CENTER_STD_COMMITTEE_APPROVE":"SM_1466606850282291202tab",
                    "businessGuidemanage-businessGuidePlan-STI_DEPT_START":"SM_1466607048307965954tab",
                    "businessGuidemanage-businessGuidePlan-DEPT_LIAISON_CONFIRM":"SM_1466607048307965954tab",
                    "businessGuidemanage-businessGuidePlan-SECTION_CHIEF_APPROVE":"SM_1466607048307965954tab",
                    "businessGuidemanage-businessGuidePlan-DEPT_MINISTER_APPROVE":"SM_1466607048307965954tab",
                    "businessGuidemanage-businessGuidePlan-STI_DEPT_PUBLISH":"SM_1466607048307965954tab",
                    
                    "standardPlanning-confirm-TECH_INNOVATION_DEPT_CREATE":"SM_1397113730868334593tab",
                    "standardPlanning-confirm-DEPT_LIAISON_PROOF":"SM_1397113730868334593tab",
                    "standardPlanning-confirm-OFFICE_LIAISON_CHOOSE":"SM_1397113730868334593tab",
                    "standardPlanning-confirm-RESPONSIBLE_HANDLE":"SM_1397113730868334593tab",
                    "standardPlanning-confirm-DEPT_LIAISON_VERIFY":"SM_1397113730868334593tab",
                    "standardPlanning-confirm-STD_REVIEWER_VERIFY":"SM_1397113730868334593tab",
                    "standardPlanning-confirm-TECH_INNOVATION_DEPT_INITIATE":"SM_1397113730868334593tab",
                    "standardPlanning-confirm-BUSINESS_PLAN_DEPT_INITIATE":"SM_1397113730868334593tab",
                    "standardPlanning-confirm-STD_REGULATIONS_ROOM_SECTION_CHIEF_INITIATE":"SM_1397113730868334593tab",
                    "standardPlanning-confirm-SPECIFIC_DEPT_SECTION_CHIEF_VERIFY":"SM_1397113730868334593tab",
                    "standardPlanning-confirm-SPECIFIC_DEPT_MINISTER_VERIFY":"SM_1397113730868334593tab",
                    "standardPlanning-confirm-SUBCOMMITTEE_VERIFY":"SM_1397113730868334593tab",
                    "standardPlanning-confirm-STD_REGULATIONS_ROOM_SECTION_CHIEF_VERIFY":"SM_1397113730868334593tab",
                    "standardPlanning-confirm-TECH_INNOVATION_DEPT_MINISTER_VERIFY":"SM_1397113730868334593tab",
                    "standardPlanning-confirm-ORG_SYSTEM_ROOM_SECTION_CHIEF_VERIFY":"SM_1397113730868334593tab",
                    "standardPlanning-confirm-BUSINESS_PLAN_DEPT_MINISTER_VERIFY":"SM_1397113730868334593tab",
                    "standardPlanning-confirm-TECH_INNOVATION_DEPT_MINISTER_SECOND_VERIFY":"SM_1397113730868334593tab",
                    "standardPlanning-confirm-CENTER_STD_SUBCOMMITTEE_VERIFY":"SM_1397113730868334593tab",
                    "modelInProduction-organizationList":'SM_1402837003824422914tab',
                    "modelInProduction-approveList":"SM_1442777443648831490tab",
                    "regulatoryTrackingForm-approve":"SM_1386494415978790914tab",
                    "regulatoryTrackingForm-organization":"SM_1386493647209005057tab",
                    "regulatoryTrackingForm-notice":"SM_1386494904036392962tab",
                    "regulatoryTrackingForm-noticeApprove":"SM_1438761434579369985tab",
                    "regulatoryTrackingForm-noticeProofreading":"SM_1438761532264710145tab",
                    "regulationStructured-approve":"SM_1394909259688493057tab",
                    "regulationStructured-organization":"SM_1394909341255122945tab",
                    "recurrencePreventionList-approve":"SM_1397009403818528770tab",
                    "recurrencePreventionList-organization":"SM_1397009150469984257tab",
                    "rideHailing-approve":"SM_1395581199475974145tab",
                    "project-taskList-liaison":"SM_1396661133911941122tab",
                    "project-taskList-designList":"SM_1396661133911941122tab",
                    "project-taskList-departmentHead":"SM_1396661133911941122tab",
                    "project-taskList-DepartmentContact":"SM_1396661133911941122tab",
                    "project-taskList-RegulatoryContact":"SM_1396661133911941122tab",
                    "project-taskList-RegulatoryHead":"SM_1396661133911941122tab",
                    "project-realVehicle-personAudit":"SM_1396661133911941122tab",
                    "modelInProduction-spotCheck-pagePage2":'SM_1406880734273785857tab',
                    "modelInProduction-spotCheck-pagePage3-step3":'SM_1406880734273785857tab',
                    "modelInProduction-spotCheck-pagePage3-step4":'SM_1406880734273785857tab',
                    "modelInProduction-spotCheck-pagePage3-step5":'SM_1406880734273785857tab',
                    'termWorkflow':'1368759650777477122tab'
                },
            }
        },
        created(){
            this.getData();
        },
        methods:{
            rowClick(item){
                if(item.count==0){
                    return;
                }
                let splitArr = item.menu.split('-');
                let splitLen = splitArr.length;
                let tabObj = {};
                let dialog;
                let goPage; 
                if(splitLen==1){
                   //术语流程
                   if(item.menu == 'termWorkflow') { //术语流程
                        goPage ='flowform/index.html#/wfToDo?templateId='+item.id
                    } else if(item.menu == 'serviceGuideGuidePlanIndex') { //业务指南计划管理
                        goPage ='flowform/index.html#/wfToDo?templateId='+item.id
                    } else if(item.menu == 'serviceGuideGuideReviseIndex') { //业务指南制修订
                        goPage ='flowform/index.html#/wfToDo?templateId='+item.id
                    } else if(item.menu == 'planManagementPlanManageIndex') { //企业标准计划管理
                        goPage ='flowform/index.html#/wfToDo?templateId='+item.id
                    } else if(item.menu == 'planManagementReviseIndex') { //企业标准制修订
                        goPage ='flowform/index.html#/wfToDo?templateId='+item.id
                    }
                }else if(splitLen==2){
                    if(item.menu.indexOf('recurrencePreventionList')!==-1 || item.menu.indexOf('rideHailing')!==-1){
                        goPage = splitArr[0]+"/index.html#/index/"+splitArr[1];
                    }else if(item.menu.indexOf('modelInProduction')!==-1){
                        goPage = splitArr[0]+"/index.html#/vehicleAnnounceCarList/false/"+splitArr[1];
                    }else{
                        goPage = splitArr[0]+"/index.html#/"+splitArr[1]+'List';
                    }
                }else if(item.menu.indexOf('project')!=-1){
                    this.itemMenu = item.menu;
                    dialog = {
                        title:'选择待办项目',
                        show:true,
                        width:'600',
                        height:'500',
                        top:'15vh',
                        url:'/toDoCenter/index.html#/selectProject/' + item.id +'/selectProjectId?isPoralto='+true
                    }
                    this.$emit('changeDialog',dialog)
                    return;
                }else if(item.menu.indexOf('modelInProduction')!=-1){
                    this.itemMenu = item.menu;
                    var url;
                    if(splitArr[splitLen-1]==='pagePage2'){
                        url = '/toDoCenter/index.html#/selectProject/' + item.id +'/STEP2?isPoralto='+true;
                    }else {
                        url = '/toDoCenter/index.html#/selectProject/' + item.id +'/'+ splitArr[splitLen-1].toUpperCase()+'?isPoralto='+true;
                    }
                    dialog = {
                        title:'选择法规待办',
                        show:true,
                        width:'600',
                        height:'500',
                        top:'15vh',
                        url:url
                    }
                    this.$emit('changeDialog',dialog)
                    return;
                }else if(item.menu.indexOf('standardPlanning-confirm')!=-1){
                    //标准规划维护
                    goPage = splitArr[0]+"/index.html#/"+splitArr[1]+"?tableSelect="+splitArr[2];
                }else if(item.menu.indexOf('businessGuidemanage-businessGuideIndex')!=-1){
                    //业务指南规划管理
                    goPage = splitArr[0]+"/index.html#/"+splitArr[1]+"?tableSelect="+splitArr[2];
                }else if(item.menu.indexOf('businessGuidemanage-businessGuidePlan')!=-1){
                    //业务指南计划发布
                    goPage = splitArr[0]+"/index.html#/"+splitArr[1]+"?tableSelect="+splitArr[2];
                }
                else if(item.menu.indexOf('standardPlanRelease-planIndex')!=-1){
                    //企业标准计划发布
                    goPage = splitArr[0]+"/index.html#/"+splitArr[1]+"?tableSelect="+splitArr[2];
                }
                tabObj.desc = this.descList[item.menu];
                tabObj.r_func =`{menuTarget:'IFRAME',tabKey:'${this.tabKey[item.menu]}',href_link:'${goPage}'}`
                localStorage.setItem('ecoSysLoginAction', 'sso')
                localStorage.setItem('ecoSSOTargetURL', JSON.stringify(tabObj))
                localStorage.setItem('ecoSSORequestSource', 'portalTodoCenter')
                window.location.href = '/index.html#/sysInit'  
            },
            callAction(obj){
               console.log(obj,'centerTodo');
               let splitArr = this.itemMenu.split('-');
               let tabObj = {};
               let goPage;
               if (obj && (obj.action === 'selectProjectId')) {
                    goPage = "project/index.html#/proIndex/"+obj.data+"?notDefaultPage="+splitArr[1]+"-"+splitArr[2]; //this.notDefaultPage;
                    tabObj.desc = this.descList[this.itemMenu];
                    tabObj.r_func =`{menuTarget:'IFRAME',tabKey:'${this.itemMenu}',href_link:'${goPage}'}`
                }else if(obj && (obj.action === 'selectStandardRegulationNo')){
                    goPage = splitArr[0]+"/index.html#/taskMaintenanceList?toDoRegulationNo="+encodeURIComponent(obj.data.standardRegulationNo)+'&toDoStep='+obj.data.step;
                    tabObj.desc = this.descList[this.itemMenu];
                    tabObj.r_func =`{menuTarget:'IFRAME',tabKey:'${this.tabKey[this.itemMenu]}',href_link:'${goPage}'}`;
                }
                localStorage.setItem('ecoSysLoginAction', 'sso')
                localStorage.setItem('ecoSSOTargetURL', JSON.stringify(tabObj))
                localStorage.setItem('ecoSSORequestSource', 'portalTodoCenter')
                window.location.href = '/index.html#/sysInit'  
            },
            getData(){
                queryAssignList(6).then(res=>{
                    this.tableData =  res.data;
                })
            },
            goMore(){
                 //跳转oa平台
                // window.location.href = '/index.html#/workPlatform/mainPage'
                // this.$router.push({name: 'planList'})
                localStorage.setItem('ecoSysLoginAction', 'sso')
                localStorage.setItem('ecoSSOTargetURL', '')
                localStorage.setItem('ecoSSORequestSource', 'DongfengOA')
                window.location.href = '/index.html#/sysInit'  
            },
        }
    }
</script>
<style scoped>
.toDoCenter{
    height: 240px;
    width:100%;
    padding: 0px 30px;
    box-sizing: border-box;
}
.toDoCenter .pageBody{
    margin-top:15px;
    height: calc(100% - 55px);
}
</style>