<template>
  <div>
    <div class="kn-header" >
      <eco-content top="0px" height="42px" type="tool" style="position:fixed !important;">
        <el-row style="padding:3px 10px ;background-color:#fff;border-bottom:1px solid #ddd;">
          <el-col :span="8" >
            <eco-tool-title style="line-height: 34px;" :title="'项目列表'+'（'+paginationInfo.total+'）'"></eco-tool-title>
             <el-divider direction="vertical"></el-divider>
             <el-select v-model="sl_projectViewType" style="width:130px;" @change="getProjectListFuncWithPageReset" size="mini">
              <el-option label="全部项目" value="1" v-if="opRoleList['viewAllProject'].flag"></el-option>
              <el-option label="我的项目" value="2"></el-option>
            </el-select>
            <el-divider direction="vertical"></el-divider>
            <div style="display: inline-block;padding-left:0px;">
            </div>
          </el-col>
          <el-col :span="16" style="text-align:right;padding-right:10px;">
             <el-input placeholder="项目名称 / 合同编号 / 客户全称" class="input-with-select searchProjectHeaderInput" v-model="paginationInfo.fuzzyKeywords" @keyup.enter.native="getProjectListFuncWithPageReset()" clearable style="width:250px;margin-right:10px" v-show="!this.searchShow" size="mini">
              <el-button slot="append" icon="el-icon-search" @click.native="getProjectListFuncWithPageReset()" ></el-button>
            </el-input>
            <el-button type="warning" @click.native="searchShowFunc" icon="el-icon-search" size="mini">复合查询</el-button>
            <el-divider direction="vertical" v-if="opRoleList['addProject'].flag"></el-divider>
            <el-button type="primary" class="btn"  icon="el-icon-plus" @click.native="addProject" v-if="opRoleList['addProject'].flag" size="mini">新建项目</el-button>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content top="41px" height="76px" type="tool" v-show="this.searchShow" style="position:fixed !important;">
        <el-row style="padding:5px ;background-color:#fff;">
          <el-col :span="24">
            项目名称：
            <el-input placeholder="请输入项目名称" v-model="paginationInfo.projectName" style="width:141px;" size="mini" clearable></el-input>
            是否活跃项目：
            <el-select v-model="paginationInfo.activeParam" style="width:130px;" size="mini">
              <el-option label="不限" value="-1"></el-option>
              <el-option label="活跃项目" value="1"></el-option>
              <el-option label="非活跃项目" value="0"></el-option>
            </el-select>
            项目类别：
            <el-select  placeholder="请选择项目类别" v-model="paginationInfo.projectType" style="width: 140px;" size="mini" clearable>
                <el-option v-for="(kvEl,index) in projectTypeV" :key="index" :label="kvEl.desc" :value="kvEl.id"></el-option>
            </el-select>
            <el-button type="warning" icon="el-icon-search" size="mini" @click.native="getProjectListFuncWithPageReset()" style="margin-left:10px;">搜索</el-button>
            <el-button type="info" size="mini" @click.native="clearSearchParam()">清空条件</el-button>
          </el-col>
        </el-row>
        <el-row style="padding:0px 5px 5px 5px ;background-color:#fff;border-bottom:1px solid #ddd;">
          <el-col :span="24">
            是否有中标通知书：
            <el-select v-model="paginationInfo.hasBidHitDoc" style="width:85px;" size="mini">
              <el-option label="不限" value="-1"></el-option>
              <el-option label="有" value="1"></el-option>
              <el-option label="无" value="0"></el-option>
            </el-select>
            是否有合同文件：
            <el-select v-model="paginationInfo.hasContractDoc" style="width:88px;" size="mini">
              <el-option label="不限" value="-1"></el-option>
              <el-option label="有" value="1"></el-option>
              <el-option label="无" value="0"></el-option>
            </el-select>
            是否有验收单：
            <el-select v-model="paginationInfo.hasCheckAcceptDoc" style="width:85px;" size="mini">
              <el-option label="不限" value="-1"></el-option>
              <el-option label="有" value="1"></el-option>
              <el-option label="无" value="0"></el-option>
            </el-select>
          </el-col>
        </el-row>
      </eco-content>
    </div>
    <ecoContent :top="getContentTop" bottom="0" style="position:fixed !important;">
      <ecoContent top="0px" bottom="42px" ref="content">
          <el-table :data="projectListArray" border stripe style="width: 100%" :height="'100%'" :default-sort = "{prop: 'createDate', order: 'descending'}" @sort-change="changeSort" size="mini" class="projectTable">
            <el-table-column v-for="(colEl,index) in tableColEl" :key="index" :sortable="colEl.isSortable?'custom':false" :fixed="colEl.isColFixed" :prop="colEl.paramName" :label="colEl.desc" :width="colEl.colWidth">
              <template slot-scope="scope"  >
                <div v-if="colEl.isLinkStyle">
                 <el-button @click="showProjectInfo(scope.row.id)" type="text" >{{scope.row[colEl.paramName]}}
                   <el-tooltip class="item" effect="dark" content="活跃项目" placement="right" v-if="scope.row.activeFlag">
                    <i class="el-icon-star-on starOnSpanForList"></i>
                   </el-tooltip>
                   <el-tooltip class="item" effect="dark" content="非活跃项目" placement="right" v-if="!scope.row.activeFlag">
                    <i class="el-icon-star-off starOffSpanForList"></i>
                   </el-tooltip>
                 </el-button>
                </div>
                <div v-else-if="colEl.paramName=='contractNature'">
                  {{getEnumText(scope.row[colEl.paramName],colEl.kvGroupDesc)}}
                  <span v-if="(scope.row.contractNature!=null && (scope.row.contractNature=='1499698890439356417'||scope.row.contractNature=='1499698945393127426'||scope.row.contractNature=='1499698972526080001'))&&scope.row.contractValidDateFrom!=null && scope.row.contractValidDateFrom!=''"><br>(&nbsp;{{scope.row.contractValidDateFrom}}&nbsp;至&nbsp;{{scope.row.contractValidDateTo}}&nbsp;)</span>
                </div>  
                <div v-else-if="colEl.kvGroupDesc!=''">
                  {{getEnumText(scope.row[colEl.paramName],colEl.kvGroupDesc)}}
                </div>
                <div v-else-if="colEl.paramName=='createDate'">
                  {{formatDateToMinute(scope.row[colEl.paramName])}}
                </div>
                <div v-else-if="colEl.paramName=='projectType'">
                  {{getValueByV(scope.row[colEl.paramName],projectTypeV)}}
                </div>
                <div v-else-if="colEl.paramName=='priority'">
                  {{getValueByV(scope.row[colEl.paramName],projectPriorityV)}}
                </div>
                <div v-else>
                  {{scope.row[colEl.paramName]}}
                </div>
              </template>
            </el-table-column>
          </el-table>

      </ecoContent>

      <eco-content  bottom="0px" type="tool" style="padding:5px 0px">
          <div style="text-align: right;">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="paginationInfo.page"
              :page-sizes="[20,30,50,100]"
              :page-size="paginationInfo.rows"
              layout="total, sizes, prev, pager, next, jumper"
              :total="paginationInfo.total">
            </el-pagination>
          </div>
      </eco-content>
    </ecoContent>
    <el-dialog
        :visible="dialogVisible"
        :show-close="true"
        width="75%"
        top="0"
        :modal="false"
        :append-to-body="false"
        :modal-append-to-body="false"
        :destroy-on-close="false"
        @close="hideDialog()"
        @open="cleanDialogData()"
        class="attrDialog"
        >
        <router-view name="sideRouterView" ref="sideRouterViewRef"></router-view>
    </el-dialog>
    <el-dialog :title="trivialDialogTitle" :visible.sync="trivialDialogVisible" @open="cleanTrivialDialog()" :destroy-on-close="false" ref="trivialDialog" :close-on-click-modal="false" :close-on-press-escape="false" class="trivialDialog">
        <addProject v-show="trivialDialogTab=='addProject'" ref="addProjectWin"></addProject>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="trivialDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click.native="trivialDialogSave()">保 存</el-button>
        </div>
    </el-dialog>
  </div>

</template>
<script>
import axios from 'axios';
import {baseUrl} from '@/modules/bmsMmm/config/env';
import ecoContent from "@/components/pageAb/ecoContent.vue";
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue';
import { getEnumSelectEnabled,getKvListEnabled,getEnumText,openLoading,closeLoading} from "@/modules/bmsBa/service/service.js";
import { formatDateToMinute,initOpRoleList} from "@/modules/bmsMmm/service/service.js";
import { getProjectList,getProjectDetail,projectTypeV,projectPriorityV,getValueByV } from "@/modules/bmsProject/service/service.js";
import { mapMutations } from "vuex";
import { KvGroup } from "@/modules/bmsBa/util/KvGroup.js";
import { TableColEl } from "@/modules/bmsBa/util/TableColEl.js";
import addProject from "@/modules/bmsProject/views/addProject.vue";
import projectInfo from "@/modules/bmsProject/views/projectInfo.vue";
export default {
  name: "projectList",
  components: {
    ecoContent,
    ecoToolTitle,
    addProject,
    projectInfo
  },
  data() {
    return {
      loading:true,
      loadingTimer:null,
      dialogVisible:false,
      trivialDialogVisible:false,
      trivialDialogTab:'',
      trivialDialogTitle:'',
      sl_projectViewType : "2",
      sl_searchProjectName : "1",
      paginationInfo: {
        fuzzyKeywords : "",
        projectName : "",
        projectType : "",
        activeParam : "-1",
        hasBidHitDoc : "-1",
        hasContractDoc : "-1",
        hasCheckAcceptDoc : "-1",
        sort: "order_seq_",
        order: "desc",
        page: 1,
        rows: 50,
        total: 0
      },
      projectListArray:[],
      searchShow: false,
      openedDialog:0,
      kvInfo: new KvGroup()
        .add("projectStatus",'671')//项目\收款状态
        .add("productType",'612')//产品类别
        .add("paymentStage",'614')//项目财务-款项种类
        .add("taxType",'TAX_TYPE')//项目财务-款费类别
        .add("eventContactType",'513')//项目事件-联系方式
        .add("contractStatus",'PROJECT_CONTRACT_STATUS')//合同状态
        .add("contractNature",'PROJECT_CONTRACT_NATURE')//合同性质
        .add("totalStatus",'PROJECT_TOTAL_STATUS'),//项目整体状态
      tableColEl: new TableColEl()
        .add("项目名称","projectName",'550','',true,true,true)
        .add("客户全称","customerDesc",'255',"",false,false,false)
        .add("合同编号","contractNo",'100',"",false,false,false)
        .add("签约时间","contractSignDate",'95',"",false,false,false)
        .add("合同状态","contractStatus",'70',"contractStatus",false,false,false)
        .add("合同性质","contractNature",'205',"contractNature",false,false,false)
        .add("结算状态","totalStatus",'70',"totalStatus",false,false,false)
        /*
        .add("项目状态","projectStatus",'80',"projectStatus",false,false,false)
        .add("项目类别","projectType",'80',"",false,false,false)
        .add("优先级","priority",'65',"",false,false,false)
        .add("当前阶段","projectPhaseName",'95',"",false,false,false)
        .add("产品类别","productType","80",'productType',false,false,false)
        */
        .add("开始时间","startDate","105",'',false,false,true)
        .add("录入人员","createUserName","70",'',false,false,false)
        .add("录入时间","createDate","135",'',false,false,true),
/*
     * @param {string} desc  描述
     * @param {string} paramName  值
     * @param {string} kvGroupDesc  如果是个基础数据，此处显示基础数据的group desc
     * @param {boolean} isColFixed  此列是否冻结
     * @param {boolean} isLinkStyle 此列为链接形式
     * @param {boolean} isSortable 此列是否可排序
*/
      opRoleList:null,
      projectTypeV,projectPriorityV
    };
  },
  created(){
    this.initOpRoleList();
    this.initKvList();
    if(this.opRoleList['viewAllProject'].flag){
      this.sl_projectViewType = '1';
    }
  },
  mounted() {
    this.getProjectListFuncWithPageReset();
  },
  methods: {
    clearSearchParam(){
      this.paginationInfo.projectName = "";
      this.paginationInfo.projectType = "";
      this.paginationInfo.activeParam = "-1";
      this.paginationInfo.hasBidHitDoc = "-1";
      this.paginationInfo.hasContractDoc = "-1";
      this.paginationInfo.hasCheckAcceptDoc = "-1";
      this.paginationInfo.sort = "orderSeq";
      this.paginationInfo.order = "desc";
    },
    changeSort(val){
      //console.log("##changeSort##:"+val.prop+"##"+val.order);
      if(val.order == null){
          this.paginationInfo.sort = "orderSeq";
          this.paginationInfo.order = "desc";
          val.prop = "createDate";
          val.order = "descending";
      }else{
        this.paginationInfo.sort = val.prop+",orderSeq";
        if(val.order == "ascending") this.paginationInfo.order = "asc,desc";
        else this.paginationInfo.order = "desc,desc";
      }
      //console.log("$$$$$this.paginationInfo:" + this.paginationInfo.sort);
      this.getProjectListFunc();
    },
    getProjectListFuncWithPageReset(){
      this.paginationInfo.page = 1;
      this.getProjectListFunc();
    },
    getProjectListFunc(nextTriggerFlag) {
      this.openLoading();
      getProjectList(this.paginationInfo,this.sl_projectViewType).then(response => {
          this.projectListArray = response.data.rows;
          this.paginationInfo.total = response.data.total;
          this.closeLoading();
          //console.log("nextTriggerFlag:" + nextTriggerFlag);
          if(typeof nextTriggerFlag != "undefined"){
            if(nextTriggerFlag.indexOf("showProjectInfo_")==0){
              let opBaId = nextTriggerFlag.substring(nextTriggerFlag.indexOf("_")+1);
              this.showProjectInfo(opBaId);
            }
          }
        }).catch(error => {
          this.closeLoading();
        });
    },
    handleSizeChange(val) {
        this.$refs.content.setScollTop(0);
        this.paginationInfo.rows = val;
        this.paginationInfo.page = 1;
        this.getProjectListFunc();
    },
    handleCurrentChange(val) {
        this.$refs.content.setScollTop(0);
        this.paginationInfo.page = val;
        this.getProjectListFunc();
    },
    searchShowFunc(){
        if(this.searchShow){
            this.searchShow = false;
        }else{
            this.searchShow = true;
        }
    },
    hideDialog(){
      this.dialogVisible = false;
    },
    showProjectInfo(project_id){
      this.dialogVisible = true;
      //console.log("333"+ this.$refs.sideRouterViewRef);
      if(typeof this.$refs.sideRouterViewRef=="undefined"){
         this.$router.push({name:'projectInfo',query:{project_id:project_id}});
      }else{
        this.$refs.sideRouterViewRef.getProjectInfo(project_id);
      }
    },
    cleanDialogData(){
      //console.log("clean data");
      if(typeof this.$refs.sideRouterViewRef!="undefined"){
        this.$refs.sideRouterViewRef.cleanInfo();
      }
    },
    async initKvList(){
      for (let i in this.kvInfo) {
        let e = this.kvInfo[i];
        e.kvList = await axios.get(baseUrl+'/basic/kv/group/'+e.groupId+'/detail/select-enabled',{
          params:{
            time:new Date().getTime()
          }
        }).then(res=>{
          return res.data;
        }).catch(e=>{console.log("errorrrrrr!")});
        if(e.groupDesc=='scaleCode'){
          e.kvList.push({id: "1",text:"未知"});
        }
      }
    },
    addProject(){
      //this.openOrgChooser();
      //return;
      this.trivialDialogTitle="新建项目";
      this.trivialDialogTab = 'addProject';
      this.trivialDialogVisible = true;
    },
    cleanTrivialDialog(){
      if(typeof this.$refs.addProjectWin!="undefined"){
        this.$refs.addProjectWin.cleanInfo();
      }
    },
    trivialDialogSave(){
      if(this.trivialDialogTab == 'addProject'){
        this.$refs.addProjectWin.save();
      }
    },
    refreshSingleRowInTable(checkProjectId){
      for (let i in this.projectListArray) {
        let e = this.projectListArray[i];
        if(e.id == checkProjectId){
          getProjectDetail(checkProjectId).then((response)=>{
            if (response.data&&response.data.id){
                //console.log("getBaInfo:" + response.data);
                e.projectName = response.data.projectName;
                e.projectStatus = response.data.projectStatus;
                e.projectType = response.data.projectType;
                e.priority = response.data.priority;
                e.projectPhaseName = response.data.projectPhaseName;
                e.productType = response.data.productType;
                e.startDate = response.data.startDate;
                e.activeFlag = response.data.activeFlag;

                e.customerDesc = response.data.customerDesc;
                e.contractNo = response.data.contractNo;
                e.contractSignDate = response.data.contractSignDate;
                e.contractStatus = response.data.contractStatus;
                e.contractNature = response.data.contractNature;
                e.contractValidDateFrom = response.data.contractValidDateFrom;
                e.contractValidDateTo = response.data.contractValidDateTo;
                e.totalStatus = response.data.totalStatus;
            }
          }).catch((error)=>{
            console.log("error:"+error);
          });
          break;
        }
      }
    },
    getValueByV,
    getEnumText,
    openLoading,closeLoading,formatDateToMinute,initOpRoleList
  },
  computed:{
    getContentTop:function(){
        if(this.searchShow){
            return '116px';
        }else{
            return '41px';
        }
    }
  },
  watch: {}
};
</script>
<style >

</style>
