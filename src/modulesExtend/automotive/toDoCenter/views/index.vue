<template>
    <eco-content top='0px' bottom='0px' type='tool' style='background-color:#F5F5F5;'>
        <div class='toDoCenter'>
          <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
          <eco-content top='0px' height='59px' type='tool' style='overflow: hidden;'>
            <el-row style='padding: 15px;background:#fff;border: 1px solid #ddd;'>
                <el-col :span='5' style='height: 30px;line-height: 30px;'>
                  <eco-tool-title title='待办任务中心'></eco-tool-title>
                  <span class='sumCount'>任务总数:{{sumCount}}</span>
                </el-col>
                <el-col :span='19' style='text-align: right;'>
                    <el-button type='primary' size='small' @click='reloadCase'>刷新</el-button>
                </el-col>
            </el-row>
          </eco-content>
          <eco-content top='60px' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
            <el-row :gutter="20" class='listRow'>
                <!-- :md="8"  :xs="24" :sm="24" -->
                <el-col  :span='24'  :key='key' v-for="(item,key) in itemList" v-show='typeTitle[key] && emptyList[key]!==0'>
                     <div class='menuBox' v-if='typeTitle[key]'>
                         <div class='menuHeader'>
                            <div class='menuHeaderColumn'>{{typeTitle[key]}}</div>
                            <div class='menuHeaderColumn'>待办数量 {{sumList[key]}}</div>
                         </div>
                         <div class='menuBody' :style='{height:typeHeight[key]+"px"}'>
                             <div v-if='emptyList[key]'>
                                <div class='menuBodyItem' :class='{backgroundShow:item2.backgroundShow}'  v-show='item2.count!=0' v-for='(item2,index2) in item' :key='item.menu+"-"+index2' @click='goDetails(item2)'>
                                    <div class='bodyLeft'></div>
                                    <div class='bodyCenter ellipsis'>{{itemTitle[item2.menu]}}</div>
                                    <div class='bodyRight'>{{item2.count}}</div>
                                </div>
                             </div>
                             <div v-else class='empty'>暂无数据</div>
                         </div>
                         <div v-show='emptyList[key]>10' class="expendBtn" @click="expendCase(key)">{{isExtend[key]?'收起':'展开'}}</div>
                     </div>
                </el-col>
            </el-row>

          </eco-content>
        </div>
    </eco-content>

</template>
<script>
    var _self;
    import ecoContent from '@/components/pageAb/ecoContent.vue'
    import ecoLoading from '@/components/loading/ecoLoading.vue'
    import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
    import { EcoUtil } from '@/components/util/main.js'
    import { EcoMessageBox } from '@/components/messageBox/main.js'
    import {taskAggregationList} from '../service/service.js'
    export default {
        name:"toDoCenter",
        data(){
            return {
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
                isExtend:{
                    baseData:false,
                    regulationPro:false,
                    standardization:false
                },
                typeHeight:{
                    baseData:92,
                    regulationPro:92,
                    standardization:92
                },
                emptyList:{
                    baseData:0,
                    regulationPro:0,
                    standardization:0
                },
                sumList:{
                    baseData:0,
                    regulationPro:0,
                    standardization:0
                },
                itemList:{
                    baseData:[],
                    regulationPro:[],
                    standardization:[]
                },
                typeTitle:{baseData:'基础数据维护待办',regulationPro:'法规项目待办',standardization:'标准化待办'},
                itemMenu:''
            }
        },
        created(){
            _self=this;
            this.callAction();
        },
        mounted(){
            this.requestData();
        },
        computed:{
            sumCount(){
                var sum = 0 ;
                for(var key in this.sumList){
                    sum+= this.sumList[key];
                }
                return  sum;
            }
        },
        components: {
            ecoContent,
            ecoLoading,
            ecoToolTitle
        },
        methods:{
            reloadCase(){
                this.isExtend={
                    baseData:false,
                    regulationPro:false,
                    standardization:false
                };
                this.requestData();
            },
            callAction() {
                let callBackDialogFunc = function (obj) {
                    let splitArr = _self.itemMenu.split('-');
                    let tabObj = {};
                    let goPage;
                    if (obj && (obj.action === 'selectProjectId')) {
                        // let goPage = splitArr[0]+"/index.html#/treeIndex?notDefaultPage="+splitArr[1]+"-"+splitArr[2]+"&toDoProId="+obj.data;
                        goPage = "project/index.html#/proIndex/"+obj.data+"?notDefaultPage="+splitArr[1]+"-"+splitArr[2]; //this.notDefaultPage;
                        tabObj.desc = _self.descList[_self.itemMenu];
                        // tabObj.r_func =`{menuTarget:'IFRAME',tabKey:'${_self.tabKey[_self.itemMenu]}',href_link:'${goPage}'}`
                        tabObj.r_func =`{menuTarget:'IFRAME',tabKey:'${_self.itemMenu}',href_link:'${goPage}'}`
                        tabObj.reload = true;
                        tabObj.clearIframe = true;
                        EcoUtil.getSysvm().doTab(tabObj);
                    }else if(obj && (obj.action === 'selectStandardRegulationNo')){
                        goPage = splitArr[0]+"/index.html#/taskMaintenanceList?toDoRegulationNo="+encodeURIComponent(obj.data.standardRegulationNo)+'&toDoStep='+obj.data.step;
                        tabObj.desc = _self.descList[_self.itemMenu];
                        tabObj.r_func =`{menuTarget:'IFRAME',tabKey:'${_self.tabKey[_self.itemMenu]}',href_link:'${goPage}'}`;
                        tabObj.reload = true;
                        tabObj.clearIframe = true;
                        EcoUtil.getSysvm().doTab(tabObj);
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'toDoCenterIndex');
            },
            requestData(){
                this.$refs.refLoading.open();
                taskAggregationList().then(res=>{
                    res.data.baseData = res.data.baseData||[];
                    res.data.regulationPro = res.data.regulationPro||[];
                    res.data.standardization = res.data.standardization||[];
                    for(var key in res.data){
                        let sum = 0;
                        let Dlength = 0;
                        let i=1;
                        res.data[key].forEach(item=>{
                            sum+=item.count;
                            if(item.count && item.count!=='0'){
                                if(i%2==0){
                                    item.backgroundShow = true;
                                }
                                ++Dlength;
                                ++i;
                            }
                        })
                        this.emptyList[key] = Dlength;
                        this.sumList[key] = sum;
                    }
                    // this.typeHeight={
                    //     baseData:(res.data.baseData.length>10?320:(res.data.baseData.length*32||92)),
                    //     regulationPro:(res.data.regulationPro.length>10?320:(res.data.regulationPro.length*32||92)),
                    //     standardization:(res.data.standardization.length>10?320:(res.data.standardization.length*32||92))
                    // };
                    this.typeHeight={
                        baseData:(this.emptyList['baseData']>10?320:(this.emptyList['baseData']*32||92)),
                        regulationPro:(this.emptyList['regulationPro']>10?320:(this.emptyList['regulationPro']*32||92)),
                        standardization:(this.emptyList['standardization']>10?320:(this.emptyList['standardization']*32||92))
                    };
                    // var newObj = {count: 999,
                    //               id: "1369816792324452955",
                    //               menu: "planManagementPlanManageIndex"
                    //              }
                    // res.data.standardization.push(newObj)
                    // console.log(res.data)
                    this.itemList = res.data;
                    this.$refs.refLoading.close();
                }).catch(err=>{
                    this.$refs.refLoading.close();
                })
            },
            expendCase(type){
                if(this.isExtend[type]){
                    this.typeHeight[type] = 320;
                }else{
                    this.typeHeight[type] = this.emptyList[type]*32; //this.itemList[type].length*32
                }
                this.isExtend[type] = !this.isExtend[type];
            },
            goDetails(item){
                if(item.count==0){
                    return;
                }
                var splitArr = item.menu.split('-');
                var splitLen = splitArr.length;
                let tabObj = {};
                let goPage;
                if(splitLen==1){
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
                    var url = '/toDoCenter/index.html#/selectProject/' + item.id +'/selectProjectId';
                    EcoUtil.getSysvm().openDialog('选择待办项目', url, 600, 500, '15vh');
                    return;
                }else if(item.menu.indexOf('modelInProduction')!=-1){
                    this.itemMenu = item.menu;
                    var url;
                    if(splitArr[splitLen-1]==='pagePage2'){
                        url = '/toDoCenter/index.html#/selectProject/' + item.id +'/STEP2';
                    }else {
                        url = '/toDoCenter/index.html#/selectProject/' + item.id +'/'+ splitArr[splitLen-1].toUpperCase();
                    }
                    EcoUtil.getSysvm().openDialog('选择法规待办', url, 600, 500, '15vh');
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
                // else if(item.menu.indexOf('serviceGuide-guidePlanIndex')!=-1){
                //     //业务指南计划流程图
                //     goPage = splitArr[0]+"/index.html#/"+splitArr[1];
                // }else if(item.menu.indexOf('serviceGuide-guideReviseIndex')!=-1){
                //     //业务指南计划修订流程图
                //     goPage = splitArr[0]+"/index.html#/"+splitArr[1];
                // }
                tabObj.desc = this.descList[item.menu];
                tabObj.r_func =`{menuTarget:'IFRAME',tabKey:'${this.tabKey[item.menu]}',href_link:'${goPage}'}`
                tabObj.reload = true;
                tabObj.clearIframe = true;
                EcoUtil.getSysvm().doTab(tabObj);
            }
        }
    }
</script>
<style scoped>
 .menuBox{
     position:relative;
     box-shadow: 1px 0px  5px 0px rgb(199, 197, 197);
 }
 .menuHeader{
     position: relative;
     display: flex;
     align-items: center;
     justify-content: space-between;
     background-color: #43a4e0;
     height:40px;
     overflow: hidden;
     border-radius: 2px 2px 0 0;
 }
 .menuHeaderColumn{
     /* width:150px; */
     font-size:14px;
     color:#fff;
     text-align:right;
     margin-left:20px;
 }
 .menuHeaderColumn+.menuHeaderColumn{
    /* width:100px; */
    text-align:left;
    margin-right:20px;
 }
 .menuBody{
     position: relative;
     transition:height 0.2s linear;
     overflow: hidden;
 }
 .menuBody .empty{
     position: absolute;
     top:50%;
     left:50%;
     transform: translateX(-50%) translateY(-50%);
     color:#5e6082ab;
     font-size:14px;
     text-shadow: 2px 2px 1px #ddd;
 }
 .menuBodyItem,
 .expendBtn{
    position: relative;
    width:100%;
    height:32px;
    background-color: #fff;
    transition: background 0.3s linear;
 }
 .menuBodyItem{
     font-size:14px;
 }
 .expendBtn{
     cursor: pointer;
     font-size:12px;
     text-align:center;
     line-height:32px;
     color:#999;
     font-weight:500;
     background-color: rgb(250, 250, 250);
     border-bottom:1px solid rgba(221, 220, 220, 0.349);

 }
 .menuBodyItem.backgroundShow{
     background-color: #f0f0f0;
 }
 .menuBodyItem:hover{
    background-color: rgb(204, 232, 211);
 }
 .bodyLeft,
 .bodyCenter,
 .bodyRight{
    position:absolute;
    top:50%;
    transform: translateY(-50%);
    cursor: pointer;
 }
 .bodyLeft{
     left:10px;
     width:12px;
     height:12px;
     background-color: #dfdddd;
     border-radius: 50%;
     box-shadow: 1px 1px  2px 1px #aaa;
 }
 .bodyLeft::after{
     content:'';
     position: absolute;
     background-color: #43a4e0;
     left:2px;
     top:2px;
     width:8px;
     height:8px;
     border-radius: 50%;
 }
 .bodyCenter{
     min-width:100px;
     left:32px;
     right:70px;
     color: #777;
     height:100%;
     line-height: 32px;
 }
 .bodyRight{
     right:0px;
     width: 70px;
     height:100%;
     line-height: 32px;
     text-align:center;
     color:#43a4e0;
 }
 .sumCount{
     font-size:16px;
     margin-left:15px;
     color:#666;
 }
 .listRow .el-col+.el-col{
     margin-top:20px;
 }
</style>
