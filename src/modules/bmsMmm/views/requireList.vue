<template>
  <div>
    <div class="kn-header" >
      <eco-content top="0px" height="65px" type="tool" style="position:fixed !important;">
        <el-row style="padding:12px 10px ;background-color:#fff;border-bottom:1px solid #ddd;">
          <el-col :span="16" >
            <eco-tool-title style="line-height: 34px;" :title="'需求列表'+'（'+paginationInfo.total+'）'"></eco-tool-title>
            <el-divider direction="vertical"></el-divider>
            <el-select v-model="productId" @change="changeProductTrigger" style="width:202px;vertical-align:top;" v-if="productDataMount">
              <el-option
                v-for="item in productList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="8" style="text-align:right;padding-right:10px;">
             <el-button type="primary" class="btn"  icon="el-icon-plus" @click.native="toAddRequire" >新建需求</el-button>
             <div class="toolbarDiv" style="display: inline-block;">
             <el-dropdown>
              <el-button size="medium" class="dropDownBtn">...</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item  @click.native="jumpToRequireKanbanView">看板模式查看</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
             </div>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content top="65px" height="95px" type="tool" style="position:fixed !important;">
        <el-row style="padding:5px 5px 5px 25px ;background-color:#fff;">
          <el-col :span="24">
            需求名称：
            <el-input placeholder="请输入需求名称" v-model="paginationInfo.title" style="width:197px;"></el-input>&nbsp;&nbsp;
            阶段：　　　　
            <el-select v-model="paginationInfo.statusList" multiple placeholder="请选择需求阶段" style="width:325px;">
              <el-option
                v-for="item in requireStatusV"
                :key="''+item.id"
                :label="item.desc"
                :value="''+item.id">
              </el-option>
            </el-select>&nbsp;&nbsp;
            <el-button type="warning" icon="el-icon-search" size="medium" @click.native="getRequireListFuncWithPageReset()">搜索</el-button>
            <el-button type="info" size="medium" @click.native="clearSearchParam()">清空条件</el-button>
          </el-col>
          <el-col :span="24" style="padding-top:5px;">
            优先级：　
            <div class="prioritySearchDiv" style="vertical-align:top;padding-top:5px;">
              <el-checkbox-group v-model="paginationInfo.priorityList" >
                <el-checkbox label="1" class="priority1"></el-checkbox>
                <el-checkbox label="2" class="priority2"></el-checkbox>
                <el-checkbox label="3" class="priority3"></el-checkbox>
              </el-checkbox-group>
            </div>&nbsp;&nbsp;
            要求完成日期：
            <el-date-picker 
                v-model="paginationInfo.fromToExpectFinishDateArray"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="—"
                start-placeholder="开始"
                end-placeholder="结束"
                format="yyyy-MM-dd" 
                value-format="yyyy-MM-dd"
                style="width:250px;">
            </el-date-picker>&nbsp;&nbsp;
            录入日期：
            <el-date-picker 
                v-model="paginationInfo.fromToCreateDateArray"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="—"
                start-placeholder="开始"
                end-placeholder="结束"
                format="yyyy-MM-dd" 
                value-format="yyyy-MM-dd"
                style="width:250px;">
            </el-date-picker>&nbsp;&nbsp;&nbsp;&nbsp;
            
          </el-col>    
        </el-row>
      </eco-content>
    </div>
    <ecoContent top="160px" bottom="0px" style="position:fixed !important;">
      <ecoContent top="0px" bottom="42px" ref="content">
          <el-table :data="requireListArray" border stripe style="width: 100%" :height="'100%'" :default-sort = "{prop: 'createDate', order: 'descending'}" @sort-change="changeSort">
            <el-table-column v-for="(colEl,index) in tableColEl" :key="index" :sortable="colEl.isSortable?'custom':false" :fixed="colEl.isColFixed" :prop="colEl.paramName" :label="colEl.desc" :width="colEl.colWidth">
              <template slot-scope="scope"  >
                <div v-if="colEl.isLinkStyle">
                 <el-button @click="showDetWin(scope.row.id)" type="text" >{{scope.row[colEl.paramName]}}</el-button>
                </div>
                <div v-else-if="colEl.paramName=='status'">
                  {{getRequireStatusDesc(scope.row[colEl.paramName])}}
                </div>
                <div v-else-if="colEl.paramName=='createDate'">
                  {{formatDateToMinute(scope.row[colEl.paramName])}}
                </div>
                <div v-else-if="colEl.paramName=='op'">
                  <el-button type="text" @click.native="editRequire(scope.row.id)">编辑</el-button>
                  <el-button type="text" style="color:red;" @click.native="deleteRequire(scope.row.id)">删除</el-button>
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
    <el-drawer :title="detDialogTitle" :with-header="false" :visible.sync="detDialogVisible" direction="rtl" size="70%" :destroy-on-close="true" ref="detDialog" :close-on-click-modal="true" :close-on-press-escape="true" :append-to-body="true">
          <br>
          <requireInfo :requireId="focusRequireId" ></requireInfo>
    </el-drawer>
    <el-dialog width="90%" :title="dialogTitle" :visible.sync="dialogVisible" @open="cleanDialog()" :destroy-on-close="true" ref="dialog" :close-on-click-modal="false" :close-on-press-escape="false" :append-to-body="true" class="trivialDialog">
        <addRequire v-if="dialogTab=='addRequire'" :productIdProp="productId" ref="addRequireWin"></addRequire>
        <editRequire v-if="dialogTab=='editRequire'" ref="editRequireWin"></editRequire>
        <div slot="footer" class="dialog-footer" >
            <el-button @click.native="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click.native="dialogSave()" >保 存</el-button>
        </div>
    </el-dialog>
  </div>
  
</template>
<script>
import axios from 'axios';
import {baseUrl} from '@/modules/bmsMmm/config/env';
import ecoContent from "@/components/pageAb/ecoContent.vue";
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue';
import {openLoading,closeLoading} from "@/modules/bmsBa/service/service.js";
import { formatDateToMinute,searchRequireList,getRequireStatusDesc,requireStatusV,getProductList,getRequireDetail,deleteRequireAjax} from "@/modules/bmsMmm/service/service.js";
import { mapMutations } from "vuex";
import { KvGroup } from "@/modules/bmsBa/util/KvGroup.js";
import { TableColEl } from "@/modules/bmsBa/util/TableColEl.js";
import requireInfo from "@/modules/bmsMmm/component/requireInfo.vue";
import addRequire from "@/modules/bmsMmm/component/addRequire.vue";
import editRequire from "@/modules/bmsMmm/component/editRequire.vue";
export default {
  name: "requireList",
  components: {
    ecoContent,
    ecoToolTitle,
    requireInfo,
    addRequire,
    editRequire
  },
  data() {
    return {
      productId:'',
      productList:[],
      productDataMount:false,   
      loading:true, 
      loadingTimer:null,
      detDialogTitle:'',
      detDialogVisible:false,
      dialogVisible:false,
      dialogTitle:'',
      dialogTab:'',
      focusRequireId:'',
      paginationInfo: {
        title:'',
        priorityList:["1","2","3"],
        statusList:[],
        fromToExpectFinishDateArray:[],//存放日期区间选择组件的值，数组等式存放viewDateFrom和viewDateTo
        fromToCreateDateArray:[],//存放日期区间选择组件的值，数组等式存放viewDateFrom和viewDateTo
        sort: "order_seq_",
        order: "desc",
        page: 1,
        rows: 50,
        total: 0
      },
      requireListArray:[],
      tableColEl: new TableColEl()
        .add("需求名称","title",'650','',true,true,true)  
        .add("优先级","priority",'65',"",false,false,false)
        .add("阶段","status",'80',"",false,false,false)
        .add("要求完成时间","expectFinishDate",'105',"",false,false,false)
        .add("关联任务","childrenCount",'80',"",false,false,false)
        .add("录入人员","createUserName","80",'',false,false,false)
        .add("录入时间","createDate","140",'',false,false,true)
        .add("操作","op","100",'',false,false,false),
/*
     * @param {string} desc  描述
     * @param {string} paramName  值
     * @param {string} kvGroupDesc  如果是个基础数据，此处显示基础数据的group desc
     * @param {boolean} isColFixed  此列是否冻结
     * @param {boolean} isLinkStyle 此列为链接形式
     * @param {boolean} isSortable 此列是否可排序
*/
      requireStatusV
    };
  },
  created(){
    this.productId = this.$route.params.productIdProp;
    //console.log("productId:" + this.productId);
    this.getProductListFunc();
  },
  mounted() {
    this.getRequireListFuncWithPageReset();
  },
  methods: {
    jumpToRequireKanbanView(){
      this.$router.push({
        path: '/mmmForProduct/'+this.productId
      });
    },
    callBackForDialogEdit(checkRequireId){
      this.refreshSingleRowInTable(checkRequireId);
    },
    deleteRequire(requireId){
      this.$confirm('确定要删除此需求吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRequireAjax(requireId).then((res)=>{
          //console.log("submit  done!!");
          this.$message({type: 'success',message: '删除成功！'});
          this.getRequireListFunc();
        }).catch((error)=>{
          this.$parent.$parent.closeLoading();
          console.log("error:"+error);
          this.$message({type: 'error',message: '删除失败！'});
        });
      }).catch((error) => {console.log("error:"+error);});
    },
    editRequire(requireId){
      this.focusRequireId = requireId;
      this.dialogTitle="编辑需求";
      this.dialogTab = 'editRequire';
      this.dialogVisible = true;
    },
    callBackForDialogAdd(){
      this.clearSearchParam();
      this.getRequireListFuncWithPageReset();
    },
    dialogSave(){
        if(this.dialogTab == 'addRequire'){
            this.$refs.addRequireWin.save();
        }else if(this.dialogTab == 'editRequire'){
            this.$refs.editRequireWin.save();    
        }
    },
    cleanDialog(){
      //console.log("#####cleanDialog:");
      if(typeof this.$refs.addRequireWin!="undefined"){
        this.$refs.addRequireWin.cleanInfo();
      }else if(typeof this.$refs.editRequireWin!="undefined"){
        this.$refs.editRequireWin.initData();
      }
    },
    toAddRequire(){
      this.dialogTitle="添加需求";
      this.dialogTab = 'addRequire';
      this.dialogVisible = true;
    },
    showDetWin(requireId){
        this.focusRequireId=requireId;
        this.detDialogTitle="需求详情";
        this.detDialogVisible = true;
    },
    changeProductTrigger(){
      this.clearSearchParam();
      this.getRequireListFuncWithPageReset();
    },
    getProductListFunc() {
      getProductList().then(response => {
        this.productList = response.data.rows;
        this.productDataMount = true;
      })
      .catch(error => {
          dealException(error);
      });
    },
    clearSearchParam(){
      this.paginationInfo.title = '';
      this.paginationInfo.priorityList=["1","2","3"];
      this.paginationInfo.statusList=[];
      this.paginationInfo.fromToExpectFinishDateArray=[];
      this.paginationInfo.fromToCreateDateArray=[];
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
      this.getRequireListFunc();
    },
    getRequireListFuncWithPageReset(){
      this.paginationInfo.page = 1;
      this.getRequireListFunc();
    },
    getRequireListFunc(nextTriggerFlag) {
      this.openLoading();
      searchRequireList(this.productId,this.paginationInfo).then(response => {
          this.requireListArray = response.data.rows;
          this.paginationInfo.total = response.data.total;
          this.closeLoading();
          //console.log("this.requireListArray:" + this.requireListArray.length);
          if(typeof nextTriggerFlag != "undefined"){
            if(nextTriggerFlag.indexOf("showRequireInfo_")==0){
              let opBaId = nextTriggerFlag.substring(nextTriggerFlag.indexOf("_")+1);
              this.showRequireInfo(opBaId);
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
        this.getRequireListFunc();
    },
    handleCurrentChange(val) {
        this.$refs.content.setScollTop(0);
        this.paginationInfo.page = val;
        this.getRequireListFunc();
    },
    hideDialog(){
      this.dialogVisible = false;
    },
    showRequireInfo(require_id){
      this.dialogVisible = true;
      //console.log("333"+ this.$refs.sideRouterViewRef);
      if(typeof this.$refs.sideRouterViewRef=="undefined"){
         this.$router.push({name:'requireInfo',query:{require_id:require_id}});
      }else{
        this.$refs.sideRouterViewRef.getRequireInfo(require_id);
      } 
    },
    cleanDialogData(){
      //console.log("clean data");
      if(typeof this.$refs.sideRouterViewRef!="undefined"){
        this.$refs.sideRouterViewRef.cleanInfo();
      } 
    },
    refreshSingleRowInTable(checkRequireId){
      for (let i in this.requireListArray) {
        let e = this.requireListArray[i];
        if(e.id == checkRequireId){
          getRequireDetail(checkRequireId).then((response)=>{
            if (response.data&&response.data.id){
                e.title = response.data.title;
                e.priority = response.data.priority;
                e.status = response.data.status;
                e.expectFinishDate = response.data.expectFinishDate;
                e.childrenCount = response.data.childrenCount;
            }
          }).catch((error)=>{
            console.log("error:"+error);
          });
          break;
        }
      }
    },
    openLoading,closeLoading,formatDateToMinute,getRequireStatusDesc
  },
  computed:{
  },
  watch: {}
};
</script>
<style >

</style>
