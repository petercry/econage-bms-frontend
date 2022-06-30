<template>
  <div>
    <div class="kn-header" >
      <eco-content top="0px" height="47px" type="tool" style="position:fixed !important;">
        <el-row style="padding:3px 10px ;background-color:#fff;border-bottom:1px solid #ddd;">
          <el-col :span="12" >
            <eco-tool-title style="line-height: 34px;" :title="'客户列表'+'（'+paginationInfo.total+'）'"></eco-tool-title>
             <el-divider direction="vertical"></el-divider>
             <el-select v-model="sl_baViewType" style="width:125px;" size="mini" @change="getBaListFuncWithPageReset">
              <el-option label="全部客户" value="1" v-if="opRoleList['viewAllCustomer'].flag"></el-option>
              <el-option label="我负责的客户" value="2"></el-option>
              <el-option label="我协助的客户" value="3"></el-option>
              <el-option label="我查看的客户" value="4"></el-option>
            </el-select>
            <el-divider direction="vertical"></el-divider>
            <div style="display: inline-block;padding-left:0px;">
            <el-form >
            <el-form-item label="" prop="warningView" style="margin-bottom:0px;">
              <el-checkbox label="仅显示亟待联系的客户" name="warningViewCheck" @change="checkWarningView" v-model="doWarningViewFlag"></el-checkbox>
              <el-tooltip class="item" effect="dark" placement="right">
                <div slot="content" style="line-height:20px;">当前规则：<br/>
                  1. A类客户超过7天未联系<br/>
                  2. B类客户超过30天未联系<br/>
                  3. C类客户超过半年未联系<br/>
                  4. 已到达预设的“下次联系时间”
                </div>
                 <i class="fa fa-question-circle-o " style="color:#606266;cursor:pointer;"></i>
              </el-tooltip>
            </el-form-item>
            </el-form>
            </div>
          </el-col>
          <el-col :span="12" style="text-align:right;padding-right:10px;padding-top:5px;">
             <el-input placeholder="请输入客户名称" class="input-with-select searchBaHeaderInput" v-model="paginationInfo.name" @keyup.enter.native="getBaListFuncWithPageReset()" clearable style="width:250px;margin-right:5px" v-show="!this.searchShow" size="mini">
              <el-select slot="prepend" v-model="sl_searchBaName" style="width:85px;padding-left:0px;margin-left:-30px">
                <el-option label="客户名称" value="1"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click.native="getBaListFuncWithPageReset()" style=""></el-button>
            </el-input>
            <el-button type="warning" @click.native="searchShowFunc" icon="el-icon-search" size="mini">复合查询</el-button>
            <el-divider direction="vertical" v-if="opRoleList['customerAdmin'].flag"></el-divider>
            <el-button type="success" class="btn"  icon="el-icon-user" @click.native="setRoleBatch" v-if="opRoleList['customerAdmin'].flag" size="mini">批量赋权</el-button>
            <el-divider direction="vertical" v-if="opRoleList['addCustomer'].flag"></el-divider>
            <el-button type="primary" class="btn"  icon="el-icon-plus" @click.native="addBa" v-if="opRoleList['addCustomer'].flag" size="mini">新建客户</el-button>
            <el-dropdown>
              <el-button size="medium" class="dropDownBtn">...</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item  @click.native="showAllBaForView">查询全部客户（仅供搜索查重）</el-dropdown-item>
                <el-dropdown-item  @click.native="expSalesProjectReport">导出销售项目穿透分析表</el-dropdown-item>
                <el-dropdown-item  @click.native="showReportExpDialog" v-if="opRoleList['customerAdmin'].flag">导出客户拜访记录报表</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content top="47px" height="110px" type="tool" v-show="this.searchShow" style="position:fixed !important;overflow-y:hidden;" class="baSearchArea">
        <el-row style="padding:5px ;background-color:#fff;">
          <el-col :span="24">
            名称：<el-input placeholder="请输入客户名称" v-model="paginationInfo.name" style="width:150px;margin-left:0px;" size="mini" clearable @keyup.enter.native="getBaListFuncWithPageReset()"></el-input>
            行业：
            <el-select  placeholder="请选择行业" v-model="paginationInfo.industryCode" style="width: 120px;margin-left:10px;" size="mini" clearable>
                <el-option v-for="(kvEl,index) in kvInfo.getKvListByGroupDesc('industryCode')" :key="index" :label="kvEl.text" :value="kvEl.id"></el-option>
            </el-select>
            价值：
            <el-select  placeholder="请选择价值" v-model="paginationInfo.valueCode" style="width: 132px;margin-left:28px;" size="mini" clearable>
                <el-option v-for="(kvEl,index) in kvInfo.getKvListByGroupDesc('valueCode')" :key="index" :label="kvEl.text" :value="kvEl.id"></el-option>
            </el-select>
            来源：
            <el-select  placeholder="请选择来源" v-model="paginationInfo.sourceCode" style="width: 119px;margin-left:11px;" size="mini" clearable>
                <el-option v-for="(kvEl,index) in kvInfo.getKvListByGroupDesc('sourceCode')" :key="index" :label="kvEl.text" :value="kvEl.id"></el-option>
            </el-select>
            商机时间：
            <el-date-picker
              v-model="paginationInfo.fromToBizOppoTime"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              size="mini" style="width:197px;padding-right:0px;">
            </el-date-picker>
            超过
            <el-input-number v-model="paginationInfo.expireContactDay" controls-position="right" :min="0" :max="1000" style="width:60px;" class="tinyInputNumber" size="mini"></el-input-number>
            天未联系&nbsp;&nbsp;&nbsp;
            <el-button type="warning" icon="el-icon-search" size="mini" @click.native="getBaListFuncWithPageReset()">搜索</el-button>
            <el-button type="info" size="mini" @click.native="clearSearchParam()">清空条件</el-button>
          </el-col>
        </el-row>
        <el-row style="padding:0px 5px 5px 5px ;background-color:#fff;" >
          <el-col :span="24">
            标签：<el-select
              v-model="paginationInfo.baTags"
              multiple
              collapse-tags
              clearable
              size="mini"
              style="width:150px;margin-left:0px;"
              placeholder="请选择标签">
               <el-option
                v-for="item in dynamicTags"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            所在地：<el-input placeholder="请输入所在地" v-model="paginationInfo.locationAreaDesc" style="width:120px;" size="mini" clearable @keyup.enter.native="getBaListFuncWithPageReset()"></el-input>
            数据状态：
            <el-select  placeholder="请选择数据状态" v-model="paginationInfo.firstStatus" style="width: 133px;" size="mini" clearable>
                <el-option v-for="(kvEl,index) in kvInfo.getKvListByGroupDesc('firstStatus')" :key="index" :label="kvEl.text" :value="kvEl.id"></el-option>
            </el-select>
            所有制：
            <el-select  placeholder="请选择所有制" v-model="paginationInfo.ownershipCode" style="width: 120px;margin-left:-4px;" size="mini" clearable>
                <el-option v-for="(kvEl,index) in kvInfo.getKvListByGroupDesc('ownershipCode')" :key="index" :label="kvEl.text" :value="kvEl.id"></el-option>
            </el-select>
            下次联系时间：
            <el-date-picker
              v-model="paginationInfo.fromToNextContactDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              size="mini" style="width:197px;padding-right:0px;">
            </el-date-picker>
            已联系时间：
            <el-date-picker
              v-model="paginationInfo.fromToAlreadyContactDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              size="mini" style="width:197px;padding-right:0px;">
            </el-date-picker>
          </el-col>
        </el-row>
        <el-row style="padding:0px 5px 5px 5px ;background-color:#fff;border-bottom:1px solid #ddd;">
          <el-col :span="24">
            规模：<el-select  placeholder="请选择规模" v-model="paginationInfo.scaleCode" style="width: 150px;margin-left:0px;" size="mini" clearable>
                <el-option v-for="(kvEl,index) in kvInfo.getKvListByGroupDesc('scaleCode')" :key="index" :label="kvEl.text" :value="kvEl.id"></el-option>
            </el-select>
            排名：
            <el-select  placeholder="请选择排名" v-model="paginationInfo.posCode" style="width: 120px;margin-left:10px;" size="mini" clearable>
                <el-option v-for="(kvEl,index) in kvInfo.getKvListByGroupDesc('posCode')" :key="index" :label="kvEl.text" :value="kvEl.id"></el-option>
            </el-select>
            <span v-if="true||opRoleList['customerAdmin'].flag">
            负责人：<tag-select
                  placeholder="请选择负责人"
                  style="width: 133px;vertical-align: top;margin-left:18px;"
                  :initDataStr="paginationInfo.searchOwnerUserStr"
                  :initOptions="{selectNum:1,selectType:'User',maxOrgPathLevel:0,idSplit:','}"
                  @callBack="selectOwnerRoleUserForSearch" >
            </tag-select>
            <el-checkbox style="margin-right:15px;" v-model="paginationInfo.searchOwnerEmptyFlag">为空</el-checkbox>
            工作人员：<tag-select
                  placeholder="请选择工作人员"
                  style="width: 128px;vertical-align: top;"
                  :initDataStr="paginationInfo.searchCollaboratorUserStr"
                  :initOptions="{selectNum:1,selectType:'User',maxOrgPathLevel:0,idSplit:','}"
                  @callBack="selectCollaboratorRoleUserForSearch" >
            </tag-select>
            <el-checkbox v-model="paginationInfo.searchCollaboratorEmptyFlag" style="margin-right:15px;">为空</el-checkbox>
            访客：<tag-select
                  placeholder="请选择访客"
                  style="width: 140px;vertical-align: top;"
                  :initDataStr="paginationInfo.searchGuestUserStr"
                  :initOptions="{selectNum:1,selectType:'User',maxOrgPathLevel:0,idSplit:','}"
                  @callBack="selectGuestRoleUserForSearch" >
            </tag-select>
            <el-checkbox v-model="paginationInfo.searchGuestEmptyFlag">为空</el-checkbox>
            </span>
          </el-col>
        </el-row>
      </eco-content>
    </div>
    <ecoContent :top="getContentTop" bottom="0" style="position:fixed !important;">
      <ecoContent top="0px" bottom="42px" ref="content">
          <el-table :data="baListArray" border stripe style="width: 100%" :height="'100%'" :default-sort = "{prop: 'lastContactTime', order: 'descending'}" @sort-change="changeSort" size="mini" class="baTable" @selection-change="handleTableSelectionChange">
            <el-table-column
              type="selection"
              width="39"
              v-if="opRoleList['customerAdmin'].flag"
              >
            </el-table-column>
            <el-table-column v-for="(colEl,index) in tableColEl" :key="index" :sortable="colEl.isSortable?'custom':false" :fixed="colEl.isColFixed" :prop="colEl.paramName" :label="colEl.desc" :width="colEl.colWidth">
              <template slot-scope="scope"  >
                <div v-if="colEl.isLinkStyle">
                 <el-button @click="showBaInfo(scope.row.id)" type="text" >{{scope.row[colEl.paramName]}}</el-button>
                </div>
                <div v-else-if="colEl.kvGroupDesc!=''">
                  {{getEnumText(scope.row[colEl.paramName],colEl.kvGroupDesc)}}
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
        <addBa v-show="trivialDialogTab=='addBa'" ref="addBaWin"></addBa>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="trivialDialogVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click.native="trivialDialogSave()" size="mini">保 存</el-button>
        </div>
    </el-dialog>
    <el-dialog title="批量赋权" :visible.sync="setBaRoleBatchDialogVisible" @open="cleanSetBaRoleBatchDialog()" :destroy-on-close="false" ref="setBaRoleBatchDialog" :close-on-click-modal="false" :close-on-press-escape="false" class="setBaRoleBatchDialog">
        <setBaRoleBatch  ref="setBaRoleBatchWin"></setBaRoleBatch>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="setBaRoleBatchDialogVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click.native="setBaRoleBatchDialogSave()" size="mini">保 存</el-button>
        </div>
    </el-dialog>
    <el-dialog title="全部客户（仅供搜索查重）" :visible.sync="showAllBaForViewDialogVisible" @open="cleanShowAllBaForViewDialog()" :destroy-on-close="false" ref="showAllBaForViewDialog" :close-on-click-modal="false" :close-on-press-escape="false" class="showAllBaForViewDialog">
        <showAllBaForView  ref="showAllBaForViewWin"></showAllBaForView>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="showAllBaForViewDialogVisible = false" size="mini">关 闭</el-button>
        </div>
    </el-dialog>
    <el-dialog :title="baReportExpDialogTitle" :visible.sync="showReportExpDialogVisible" @open="cleanShowReportExpDialog()" :destroy-on-close="false" ref="showReportExpDialog" :close-on-click-modal="false" :close-on-press-escape="false" class="showReportExpDialog">
        <baVisitReportExpSet  ref="baVisitReportExpSetWin"></baVisitReportExpSet>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="showReportExpDialogVisible = false" size="mini" style="margin-bottom:10px;margin-right:5px;">关 闭</el-button>
        </div>
    </el-dialog>
  </div>

</template>
<script>
import axios from 'axios';
import {baseUrl} from '@/modules/bmsMmm/config/env';
import ecoContent from "@/components/pageAb/ecoContent.vue";
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue';
import baInfo from "@/modules/bmsBa/views/baInfo.vue";
import { initOpRoleList,formatDateToMinute} from "@/modules/bmsMmm/service/service.js";
import { getBaList,getEnumSelectEnabled,getKvListEnabled,getEnumText,getBaDetail,openLoading,closeLoading,searchBaSalesProjectReportXlsExpAjax } from "@/modules/bmsBa/service/service.js";
import {getTagOption,getCurrDateSecond} from "@/modules/bmsMmm/util/utility.js";
import { mapMutations } from "vuex";
import { KvGroup } from "@/modules/bmsBa/util/KvGroup.js";
import { TableColEl } from "@/modules/bmsBa/util/TableColEl.js";
import addBa from "@/modules/bmsBa/views/addBa.vue";
import setBaRoleBatch from "@/modules/bmsBa/views/setBaRoleBatch.vue";
import showAllBaForView from "@/modules/bmsBa/views/showAllBaForView.vue";
import baVisitReportExpSet from "@/modules/bmsBa/views/baVisitReportExpSet.vue";
import EcoOrgPick from '@/components/orgPick/main.js';
import tagSelect from '@/components/orgPick/tagSelect.vue';
import {EcoFile} from '@/components/file/main.js';
export default {
  name: "baList",
  components: {
    ecoContent,
    ecoToolTitle,
    baInfo,
    addBa,
    setBaRoleBatch,
    showAllBaForView,
    baVisitReportExpSet,
    tagSelect
  },
  data() {
    return {
      loading:true,
      loadingTimer:null,
      dialogVisible:false,
      trivialDialogVisible:false,
      trivialDialogTab:'',
      trivialDialogTitle:'',
      setBaRoleBatchDialogVisible:false,
      doWarningViewFlag: false,
      sl_baViewType : "2",
      sl_searchBaName : "1",
      paginationInfo: {
        name : "",
        baTags : [],
        industryCode : "",
        sourceCode : "",
        expireContactDay:0,
        locationAreaDesc: "",
        firstStatus : "",
        fromToBizOppoTime:[],
        fromToNextContactDate:[],
        fromToAlreadyContactDate:[],
        valueCode : "" ,

        scaleCode : "" ,
        ownershipCode : "" ,
        posCode : "" ,

        searchOwnerUserStr : "" ,
        searchOwnerEmptyFlag : false ,
        searchCollaboratorUserStr : '',
        searchCollaboratorEmptyFlag : false ,
        searchGuestUserStr : "",
        searchGuestEmptyFlag : false ,

        sort: "last_contact_time_,order_seq_",
        order: "desc,desc",
        page: 1,
        rows: 50,
        total: 0
      },
      baListArray:[],
      searchShow: false,
      openedDialog:0,
      kvInfo: new KvGroup()
        .add("relationCode",'706')//协作要求
        .add("scaleCode",'724')//规模
        .add("firstStatus",'716')//TSR数据状态1
        .add("valueCode",'700')//价值
        .add("baEventType",'713')//客户事件--联系方式
        .add("baContactValueCode",'714')//客户联系人价值
        .add("industryCode",'708')//行业
        .add("contactsStatus",'730')//联系人状态
        .add("sourceCode",'704')//来源
        .add("ownershipCode",'710')//所有制
        .add("posCode",'702')//排名
        .add("productDirection",'1479407429412118529')//产品方向
        .add("currentPhase",'1479407488723771394'),//当前阶段
      tableColEl: new TableColEl()
        .add("客户名称","baName",'500','',true,true,true)
        .add("协作要求","relationCode",'100',"relationCode",false,false,false)
        .add("规模","scaleCode",'100',"scaleCode",false,false,false)
        .add("数据状态","firstStatus",'135',"firstStatus",false,false,false)
        .add("价值","valueCode",'50',"valueCode",false,false,false)
        .add("所在地","stateAreaDesc",'160',"",false,false,false)

        .add("当前阶段","currentPhase",'70',"currentPhase",false,false,false)
        .add("产品方向","productDirectionStr",'85',"",false,false,false)
        .add("项目预算(万元)","projectBudget",'105',"",false,false,false)
        .add("预期定标时间","expectTenderTime",'120',"",false,false,true)

        .add("最后经办人","lastActionUser","85",'',false,false,false)
        .add("商机时间","bizOppoTime","125",'',false,false,false)
        .add("最后联系日期","lastContactTime","120",'',false,false,true)
        .add("下次联系日期","nextContactTime","120",'',false,false,true),
/*
     * @param {string} desc  描述
     * @param {string} paramName  值
     * @param {string} kvGroupDesc  如果是个基础数据，此处显示基础数据的group desc
     * @param {boolean} isColFixed  此列是否冻结
     * @param {boolean} isLinkStyle 此列为链接形式
     * @param {boolean} isSortable 此列是否可排序
*/
        opRoleList:null,
        multipleTableSelection: [] ,
        showAllBaForViewDialogVisible : false ,
        dynamicTags: [], //多选标签
        TAG_GROUP_ID: "BMS_BA_TAG" ,
        showReportExpDialogVisible : false ,
        baReportExpDialogTitle: "导出报表",
    };
  },
  created(){
    this.initOpRoleList();
    this.initKvList();
    if(this.opRoleList['viewAllCustomer'].flag){
      this.sl_baViewType = '1';
    }
  },
  mounted() {
    this.getBaListFuncWithPageReset();
  },
  methods: {
    async initDynamicTags(){
      this.dynamicTags = await getTagOption(this.TAG_GROUP_ID);
    },
    clearSearchParam(){
      this.paginationInfo.name = "";
      this.paginationInfo.baTags = [];
      this.paginationInfo.city = "";
      this.paginationInfo.expireContactDay = 0;
      this.paginationInfo.industryCode = "";
      this.paginationInfo.sourceCode = "";
      this.paginationInfo.locationAreaDesc = "";
      this.paginationInfo.firstStatus = "";
      this.paginationInfo.fromToBizOppoTime=[];
      this.paginationInfo.fromToNextContactDate=[];
      this.paginationInfo.fromToAlreadyContactDate=[];
      this.paginationInfo.valueCode = "";

      this.paginationInfo.scaleCode = "";
      this.paginationInfo.ownershipCode = "";
      this.paginationInfo.posCode = "";

      this.paginationInfo.searchOwnerUserStr = "" ;
      this.paginationInfo.searchOwnerEmptyFlag = false ;
      this.paginationInfo.searchCollaboratorUserStr = '';
      this.paginationInfo.searchCollaboratorEmptyFlag = false ;
      this.paginationInfo.searchGuestUserStr = "";
      this.paginationInfo.searchGuestEmptyFlag = false ;
      this.paginationInfo.sort = "lastContactTime,orderSeq";
      this.paginationInfo.order = "desc,desc";
    },
    changeSort(val){
      //console.log("##changeSort##:"+val.prop+"##"+val.order);
      if(val.order == null){
          this.paginationInfo.sort = "lastContactTime,orderSeq";
          this.paginationInfo.order = "desc,desc";
          val.prop = "lastContactTime";
          val.order = "descending";
      }else{
        this.paginationInfo.sort = val.prop+",orderSeq";
        if(val.order == "ascending") this.paginationInfo.order = "asc,desc";
        else this.paginationInfo.order = "desc,desc";
      }
      this.getBaListFunc();
    },
    getBaListFuncWithPageReset(){
      this.paginationInfo.page = 1;
      this.getBaListFunc();
    },
    getBaListFunc(nextTriggerFlag) {
      this.openLoading();
      this.initDynamicTags();
      getBaList(this.paginationInfo,this.sl_baViewType,this.doWarningViewFlag).then(response => {
          this.baListArray = response.data.rows;
          this.paginationInfo.total = response.data.total;
          this.closeLoading();
          for(let i in this.baListArray){
            this.baListArray[i].bizOppoTime = formatDateToMinute(this.baListArray[i].bizOppoTime);
            if(this.baListArray[i].expectTenderTime!=null && this.baListArray[i].expectTenderTime!='' && this.baListArray[i].expectTenderTime.length == 10){
              this.baListArray[i].expectTenderTime = this.baListArray[i].expectTenderTime.substring(0,7);
            }
          }
          //console.log("nextTriggerFlag:" + nextTriggerFlag);
          if(typeof nextTriggerFlag != "undefined"){
            if(nextTriggerFlag.indexOf("showBaInfo_")==0){
              let opBaId = nextTriggerFlag.substring(nextTriggerFlag.indexOf("_")+1);
              this.showBaInfo(opBaId);
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
        this.getBaListFunc();
    },
    handleCurrentChange(val) {
        this.$refs.content.setScollTop(0);
        this.paginationInfo.page = val;
        this.getBaListFunc();
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
    showBaInfo(ba_id){
      this.dialogVisible = true;
      if(typeof this.$refs.sideRouterViewRef=="undefined"){
         this.$router.push({name:'baInfo',query:{ba_id:ba_id}});
      }else{
        this.$refs.sideRouterViewRef.getBaInfo(ba_id);
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
        /*
        if(e.groupDesc=='scaleCode'){
          e.kvList.push({id: "1",text:"未知"});
        }*/
      }
    },
    addBa(){
      //this.openOrgChooser();
      //return;
      this.trivialDialogTitle="新建客户";
      this.trivialDialogTab = 'addBa';
      this.trivialDialogVisible = true;
    },
    openOrgChooser(){
      var that  = this;
      let options = {
          title:'选择人员',
          selectMulti:true,
          // selectType:'User-userGroup',
          selectType:'User-Dept-userGroup-Role',
          selectObj:that.content,
          deptScopeType:'MANAGE',
      }
      let callBack = function(callObj){
        that.content = callObj;
        that.$forceUpdate();
      }
      EcoOrgPick.searchReceiver(options,callBack);
    },
    cleanTrivialDialog(){
      if(typeof this.$refs.addBaWin!="undefined"){
        this.$refs.addBaWin.cleanInfo();
      }
    },
    trivialDialogSave(){
      if(this.trivialDialogTab == 'addBa'){
        this.$refs.addBaWin.save();
      }
    },
    cleanSetBaRoleBatchDialog(){
      if(typeof this.$refs.setBaRoleBatchWin!="undefined"){
        this.$refs.setBaRoleBatchWin.cleanInfo();
      }
    },
    setBaRoleBatchDialogSave(){
      this.$refs.setBaRoleBatchWin.save();
    },
    refreshSingleRowInTable(checkbaId){
      for (let i in this.baListArray) {
        let e = this.baListArray[i];
        if(e.id == checkbaId){
          getBaDetail(checkbaId).then((response)=>{
            if (response.data&&response.data.id){
                //console.log("getBaInfo:" + response.data);
                e.baName = response.data.baName;
                e.relationCode = response.data.relationCode;
                e.scaleCode = response.data.scaleCode;
                e.firstStatus = response.data.firstStatus;
                e.valueCode = response.data.valueCode;
                e.stateAreaDesc = response.data.stateAreaDesc;
                e.lastActionUser = response.data.lastActionUser;
                e.bizOppoTime = formatDateToMinute(response.data.bizOppoTime);
                e.lastContactTime = response.data.lastContactTime;
                e.nextContactTime = response.data.nextContactTime;

                e.currentPhase = response.data.currentPhase;
                e.productDirectionStr = response.data.productDirectionStr;
                e.projectBudget = response.data.projectBudget;
                e.expectTenderTime = response.data.expectTenderTime;
                if(e.expectTenderTime!=null && e.expectTenderTime!='' && e.expectTenderTime.length == 10){
                  e.expectTenderTime = e.expectTenderTime.substring(0,7);
                }

            }
          }).catch((error)=>{
            console.log("error:"+error);
          });
          break;
        }
      }
    },
    checkWarningView(){
      //console.log("checkWarningViewcheckWarningView:" + this.doWarningViewFlag);
      this.getBaListFuncWithPageReset();
    },
    selectOwnerRoleUserForSearch(data){
      //console.log(data)
      //console.log("aaaa"+data.orgId);
      //aaaa1292475767718883331.1292475792939233282,1292475767718883331.1292475793580961793,1292475767966347266.1292475809762586626 赖明桃、周彩霞、王珂伟
      this.paginationInfo.searchOwnerUserStr = data.orgId;
    },
    selectCollaboratorRoleUserForSearch(data){
      //console.log("aaaa"+data.orgId);
      //aaaa1292475767718883331.1292475792939233282,1292475767718883331.1292475793580961793,1292475767966347266.1292475809762586626 赖明桃、周彩霞、王珂伟
      this.paginationInfo.searchCollaboratorUserStr = data.orgId;
    },
    selectGuestRoleUserForSearch(data){
      //console.log("aaaa"+data.orgId);
      //aaaa1292475767718883331.1292475792939233282,1292475767718883331.1292475793580961793,1292475767966347266.1292475809762586626 赖明桃、周彩霞、王珂伟
      this.paginationInfo.searchGuestUserStr = data.orgId;
    },
    handleTableSelectionChange(val){
      this.multipleTableSelection = val;
      //console.log("this.multipleTableSelection:"+this.multipleTableSelection);
    },
    setRoleBatch(){
      if(this.multipleTableSelection != null && this.multipleTableSelection != "" && this.multipleTableSelection.length>0){
      }else{
        this.$message({
          message: '请至少选择一条客户记录！',
          type: 'warning'
        });
        return;
      }
      this.setBaRoleBatchDialogVisible = true;
    },
    showAllBaForView(){
      this.showAllBaForViewDialogVisible = true;
    },
    cleanShowAllBaForViewDialog(){
      //console.log("clean data");
      if(typeof this.$refs.showAllBaForViewWin!="undefined"){
        this.$refs.showAllBaForViewWin.cleanInfo();
      }
    },
    showReportExpDialog(){
      this.baReportExpDialogTitle = "导出客户拜访记录报表";
      this.showReportExpDialogVisible = true;
    },
    cleanShowReportExpDialog(){
      if(typeof this.$refs.baVisitReportExpSetWin!="undefined"){
        this.$refs.baVisitReportExpSetWin.cleanInfo();
      }
    },
    expSalesProjectReport(){
      searchBaSalesProjectReportXlsExpAjax(this.paginationInfo,this.sl_baViewType,this.doWarningViewFlag).then((response)=>{
        var blob = new Blob([response.data], { type: 'application/octet-stream' });
        EcoFile.downloadFile(blob, "销售项目穿透分析表"+getCurrDateSecond()+".xlsx");
      });
    },
    getEnumText,
    openLoading,closeLoading,initOpRoleList
  },
  computed:{
    getContentTop:function(){
        if(this.searchShow){
          return '158px';
        }else{
          return '46px';
        }
    }
  },
  watch: {}
};
</script>
<style >

</style>
