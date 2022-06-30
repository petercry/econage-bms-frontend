<template>
  <div class="taskList">
    <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
    <div class="toolbar">
      <el-button type="primary" @click="getGenerateTaskList" v-show='initRole.PAGE_DC_TASK_LIST.permission.INIT_TASK_LIST'>生成任务清单</el-button>
      <el-button type="primary" @click="editDetail" v-show='initRole.PAGE_DC_TASK_LIST.permission.EDIT'>修改</el-button>
      <el-button type="primary" @click="Issue" v-show='initRole.PAGE_DC_TASK_LIST.permission.PUBLISH'>下发</el-button>
      <el-button type="primary" @click="searchArea">高级查询</el-button>
      <el-button type="danger" @click="deleteInfo" v-show='initRole.PAGE_DC_TASK_LIST.permission.INVALIDATE'>作废</el-button>
      <el-button type="primary" @click="reloadTask" v-show='initRole.PAGE_DC_TASK_LIST.permission.REFRESH'>刷新任务</el-button>
      <el-button type='primary' size='small' @click='exportCase' v-show='initRole.PAGE_DC_TASK_LIST.permission.EXPORT'>导出</el-button>
    </div>

    <div v-if="flag">
      <div class="searchBox">
        <span>状态：</span>
        <div class="itemInput">
          <el-select v-model="searchform.status" placeholder="请选择">
            <el-option v-for="(value,key,index) in status" :key="index" :label="value" :value="key"></el-option>
          </el-select>
        </div>

        <span>重要类型：</span>
        <div class="itemInput">
          <el-select v-model="searchform.importantType" placeholder="请选择">
            <el-option v-for="item in importantType" :key="item.id" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </div>

        <span>所属节点：</span>
        <div class="itemInput">
          <el-select v-model="searchform.node" placeholder="请选择">
            <el-option v-for="item in node" :key="item.id" :label="item.text" :value="item.text"></el-option>
          </el-select>
        </div>

        <span>类型：</span>
        <div class="itemInput">
          <!-- <el-select v-model="searchform.type" placeholder="请选择">
            <el-option v-for="item in type" :key="item.id" :label="item.text" :value="item.id"></el-option>
          </el-select> -->
          <el-select v-model="searchform.type" placeholder="请选择">
            <el-option v-for="(item,key) in typeList" :key="key" :label="item" :value="key"></el-option>
          </el-select>
        </div>
      </div>

      <div class="searchBox">
        <span>法规编号：</span>
        <div class="itemInput">
          <el-input v-model="searchform.regulationCode" placeholder="请输入内容"></el-input>
        </div>

        <span>法规名称：</span>
        <div class="itemInput">
          <el-input v-model="searchform.regulationName" placeholder="请输入内容"></el-input>
        </div>
        <span>部门：</span>
        <div class="itemInput">
          <tag-select style="width: 100%;vertical-align: top;" ref="tagSelect" :initOptions="{selectNum:1,selectType:'dept'}" @callBack="selectDept">
          </tag-select>
        </div>

        <span>科室：</span>
        <div class="itemInput">
          <tag-select style="width: 100%;vertical-align: top;" ref="tagSelect" :initOptions="{selectNum:1,selectType:'dept'}" @callBack="selectOffice">
          </tag-select>
        </div>
      </div>

      <div class="searchBox">
        <span>设计师：</span>
        <div class="itemInput">
          <tag-select style="width: 100%;vertical-align: top;" ref="tagSelect" :initOptions="{selectNum:1,selectType:'user'}" @callBack="selectProfessionDesigner">
          </tag-select>
        </div>

        <span>专业：</span>
        <div class="itemInput">
          <el-select v-model="searchform.profession" filterable placeholder="请选择">
            <el-option v-for="item in profession" :key="item.id" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </div>

        <span>交付物：</span>
        <!-- itemInputLong -->
        <div class="itemInput-short" style='width:180px'>
          <el-select v-model="searchform.deliverable" placeholder="请选择">
            <el-option v-for="item in deliverable" :key="item.id" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </div>
        <span>法规符合性：</span>
        <div class="itemInput-short">
          <el-select v-model="searchform.regulatoryCompliance" placeholder="请选择">
            <el-option v-for="item in regulatoryCompliance" :key="item.id" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </div>
      </div>

      <div class="searchBox">
        <span>计划开始日期：</span>
        <div class="itemInputLLong">
          <el-date-picker style="width: 130px;vertical-align: top;" value-format="yyyy-MM-dd" v-model="searchform.planStartDateFrom" type="date" placeholder="选择日期">
          </el-date-picker>
          —
          <el-date-picker style="width: 130px;vertical-align: top;" value-format="yyyy-MM-dd" v-model="searchform.planStartDateTo" type="date" placeholder="选择日期">
          </el-date-picker>
        </div>

        <span>计划完成日期：</span>
        <div class="itemInputLLong">
          <el-date-picker style="width: 130px;vertical-align: top;" value-format="yyyy-MM-dd" v-model="searchform.planCompleteDateFrom" type="date" placeholder="选择日期">
          </el-date-picker>
          —
          <el-date-picker style="width: 130px;vertical-align: top;" value-format="yyyy-MM-dd" v-model="searchform.planCompleteDateTo" type="date" placeholder="选择日期">
          </el-date-picker>
        </div>
      </div>

      <div class="searchBox">
        <span>实际完成日期：</span>
        <div class="itemInputLLong">
          <el-date-picker style="width: 130px;vertical-align: top;" value-format="yyyy-MM-dd" v-model="searchform.actualCompleteDateFrom" type="date" placeholder="选择日期">
          </el-date-picker>
          —
          <el-date-picker style="width: 130px;vertical-align: top;" value-format="yyyy-MM-dd" v-model="searchform.actualCompleteDateTo" type="date" placeholder="选择日期">
          </el-date-picker>
        </div>
        <!-- <span>方案类型：</span>
        <div class="itemInput-short">
          <el-select v-model="searchform.schemeType" placeholder="请选择">
            <el-option v-for="item in schemeType" :key="item.id" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </div> -->
        <span>起始条文编号：</span>
        <div class="itemInput-short"> 
          <el-input v-model="searchform.articleRangeFrom" placeholder="请输入内容"></el-input>
        </div>
        <span>结束条文编号：</span>
        <div class="itemInput-short">
          <el-input v-model="searchform.articleRangeTo" placeholder="请输入内容"></el-input>
        </div>
        <el-button type="primary" @click="getListInfo(true)">查询</el-button>
        <el-button type="primary" @click="resetForm">重置</el-button>
        <el-button type="primary" @click="searchDelete">查询作废</el-button>
        <el-button type="primary" @click="exportFun">导出</el-button>
      </div>
    </div>

    <eco-content :top="searchHeight" ref="content" bottom="42px" style="padding:0px 15px;" >
      <el-row class="modelBox">
         <el-col :span='4' class="splitLine" >
            <el-scrollbar style='height:100%;'>
                <div class='noDataTree' v-if='treeData.length==0'>
                    <span>暂无数据</span>
                </div>
                <!-- :default-expanded-keys="expandedKeys" -->
                <el-tree v-else :default-expand-all='true'   node-key="id" :data="treeData" empty-text='无标题' :props="defaultProps" @node-click="handleNodeClick"   >
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <el-tooltip v-if='(node.label.length + parseInt(data.count))>=15'  effect="dark" :content="(node.label+' '+data.count)" placement="right-start">
                            <span class="nodeText">{{ node.label }}<span style='margin-left:5px;' v-if='!data.leaf'>{{data.count}}</span></span>
                        </el-tooltip>
                        <span class="nodeText" v-else>{{ node.label }}<span  style='margin-left:5px;' v-if='!data.leaf'>{{data.count}}</span></span>
                    </span>
                </el-tree>
            </el-scrollbar>
         </el-col>
         <el-col :span='20'>
            <el-table @select='selectCase' border ref='table' @select-all='selectAll' row-key='id' stripe :data="tableData" height="100%" style="width: 100%" @selection-change="handleSelectionChange" class="styleTableDefaulta">
              <el-table-column type="selection" width="55" reserve-selection>
              </el-table-column>
              <el-table-column type="index" label="序号" width="50">
              </el-table-column>
              <el-table-column prop="regulationCode" label="法规编号">
              </el-table-column>
              <el-table-column prop="regulationName" label="法规名称" width="95">
              </el-table-column>
              <el-table-column prop="articleCode" label="条文号">
              </el-table-column>
              <el-table-column prop='articleContent' label='条文内容' width='250'>
                <template slot-scope='scope'>
                  <div class="articleContentBox"  v-ckeditor='scope.row.articleContent' ></div>
                  </template>
              </el-table-column>
              <el-table-column prop='articleInterpretation' label='条文释义' width='250'></el-table-column>
              <el-table-column prop="statusName" label="状态" width="120">
              </el-table-column>
              <!-- <el-table-column prop="importantTypeName" label="重要类型">
              </el-table-column> -->
              <el-table-column prop="nodeName" label="所属节点">
              </el-table-column>
              <el-table-column prop="typeName" label="类型">
              </el-table-column>
              <el-table-column prop="planStartDate" label="计划开始日期" width="95">
              </el-table-column>
              <el-table-column prop="planCompleteDate" label="计划完成日期" width="95">
              </el-table-column>
              <el-table-column prop="actualCompleteDate" label="实际完成日期" width="95">
              </el-table-column>
              <!-- <el-table-column prop="deptName" label="所属部门">
              </el-table-column>
              <el-table-column prop="officeName" label="所属科室">
              </el-table-column> -->
              <el-table-column prop="professionName" label="专业" width="160">
              </el-table-column>
              <el-table-column prop="contactUserName" label="联络人">
              </el-table-column>
              <el-table-column prop="designerUserName" label="设计师">
              </el-table-column>
              <el-table-column prop="deliverableName" label="交付物">
              </el-table-column>
              <el-table-column prop="regulatoryComplianceName" label="法规符合性">
              </el-table-column>
              <el-table-column label="操作" width="80" fixed='right' align='center'>
                <template slot-scope="scope">
                  <span class="detailSpan" @click="detailItem(scope.row.id)">详情</span>
                </template>
              </el-table-column>
            </el-table>
         </el-col>
      </el-row>
    </eco-content>
    <eco-content bottom="0px" type="tool" style="padding:5px 0px" ref="multipleTable">
      <el-row>
        <el-col :span="24" style="text-align:right">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="searchform.page" :page-sizes="[10,30,50,100]" :page-size="searchform.rows" layout="total, sizes, prev, pager, next, jumper" :total="searchform.total" style="margin-right:20px">
          </el-pagination>
        </el-col>
      </el-row>
    </eco-content>
  </div>
</template>
<script>
import ecoContent from "@/components/pageAb/ecoContent.vue";
import { EcoMessageBox } from "@/components/messageBox/main.js";
import { EcoFile } from "@/components/file/main.js";
import { sysEnv } from "@/modulesExtend/automotive/dongfeng/project/config/env";
import { mapState, mapActions } from "vuex";
import {
  designcheckDeleteByCondition,
  designcheckTaskListExport,
  designcheckTree,
  projectRefreshMembers,
  getEnumSelectEnabled,
  getStatusAjax,
  getTaskListAjax,
  getGenerateTaskListAjax,
  getIssueAjax,
  deleteTask,
  getTaskListExportAjax
} from "../../service/service";
import ecoLoading from "@/components/loading/ecoLoading.vue";
import tagSelect from "@/components/orgPick/tagSelect.vue";
import { EcoUtil } from "@/components/util/main.js";
export default {
  components: {
    ecoContent,
    tagSelect,
    ecoLoading
  },
  computed:{
    ...mapState(['typeList','initRole'])
  },
  data() {
    return {
      expandedKeys:[],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      treeData: [],
      canClick:true,
      searchform: {
        sort: 'modDate',     // 排序字段列表
        order: 'desc',    // 排序方式列表，asc升序，desc降序
        phase: "checklist",
        projectId: "",
        status: "",
        importantType: "",
        node: "",
        type: "",
        regulationCode: "",
        regulationName: "",
        deptId: "",
        officeId: "",
        designerUserId: "",
        profession: "",
        deliverable: "",
        planStartDateFrom: "",
        planStartDateTo: "",
        planCompleteDateFrom: "",
        planCompleteDateTo: "",
        actualCompleteDateFrom: "",
        actualCompleteDateTo: "",
        regulatoryCompliance: "",
        schemeType: "",
        articleRangeFrom:"",
        articleRangeTo:"",
        page: 1,
        rows: 30,
        total: 0,
      },
      status: [],
      importantType: [],
      node: [],
      type: [],
      profession: [],
      deliverable: [],
      regulatoryCompliance: [],
      schemeType: [],
      tableData: [],
      multipleSelection: [],
      projectId: "",
      flag: false,
      searchHeight:'39px',
      selectAllData:[],
      isCheckAll:false
    };
  },
  created() {
    this.searchform.projectId = this.$route.params.proId;
    this.projectId = this.$route.params.proId;
    this.getbaseInfo();
    this.getListInfo(true);
    this.listAction();
    window.taskListvm = this;
  },
  mounted() {
    this.getTree(false);//true
  },
  methods: {
    handleSelectionChange(rows) {
      // this.multipleSelection = rows;
    },
    selectCase(selection, row){
        // let obj = {};
        // let bool = selection.some((item,index)=>{
        //     if(obj[item.id]){
        //       obj[item.id]++;
        //       console.log(index,'页数：',parseInt((index+1)/this.searchform.rows)+1,'index:',(index+1)%this.searchform.rows)
        //     }else{
        //       obj[item.id]=1
        //     }
        //     return item.id===row.id;
        // }) 检测数据有无问题
        this.multipleSelection = selection;
    },
    selectAll(selection){
        this.isCheckAll = !this.isCheckAll;
        if(this.isCheckAll){
            let multipleData = this.multipleSelection.map(item=>{
                return item.id;
            });
            this.multipleSelection = this.selectAllData;
            let nowStart =this.searchform.rows*(this.searchform.page-1);
            let endStart = nowStart + (this.searchform.rows-1);
            this.selectAllData.forEach((row,index)=>{
              //去除单选中的数据，否则会出现重复数据
              if(!(index>=nowStart && index<=endStart) && !multipleData.includes(row.id)){
                this.$refs.table.toggleRowSelection(row,true);
              }
            })
        }else{
            this.$refs.table.clearSelection();
            this.multipleSelection = [];
        }
    },
    searchDelete(){
      let doit = function () {
        let params = {};
        window.taskListvm.$refs.refLoading.open();
        for(var key in window.taskListvm.searchform){
             if(window.taskListvm.searchform[key]){
                 params[key] = window.taskListvm.searchform[key];
             }
        }
        designcheckDeleteByCondition(params).then(res=>{
          window.taskListvm.$message.success('作废成功');
          window.taskListvm.getListInfo(true);
          window.taskListvm.$refs.refLoading.close();
        }).catch(err=>{
          window.taskListvm.$refs.refLoading.close();
        })   
      }
      EcoMessageBox.confirm(`您确定要删除当前查询条件的数据吗?`, '提示', { type: 'warning', lockScroll: false }, doit)
    },
    exportCase() {
      this.$refs.refLoading.open();
      let params = {};
      for (var key in this.searchform) {
          if (!(['page','rows','total'].includes(key)) && this.searchform[key]) {
              params[key] = this.searchform[key];
          }
      }
      designcheckTaskListExport(params).then(res => {
        if( window.navigator && window.navigator.msSaveOrOpenBlob ) {
            navigator.msSaveBlob(new Blob([res.data],'点检任务清单.xlsx'));
            this.$refs.refLoading.close();
        }else{
          let blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement("a");
          a.href = url;
          a.download = '点检任务清单.xlsx';
          this.$refs.refLoading.close();
          a.click();
          window.URL.revokeObjectURL(url);
        }
      }).catch(err => {
          this.$refs.refLoading.close();
      })
    },
    handleNodeClick(data) {
      if(data.leaf){
          this.searchform.regulationCode = data.name;
          this.getListInfo(true);
        }
    },
    reloadTask(){
      if(this.canClick){
        this.$refs.refLoading.open();
         this.canClick=false;
         projectRefreshMembers(this.searchform.projectId).then(res=>{
            if(res.data==='ok'){
              this.getListInfo(true);
            }else{
              this.$message.warning('刷新任务失败!');
            }
            this.canClick = true;
            this.$refs.refLoading.close();
        })
      }
    },
    // 获取基础数据
    getbaseInfo() {
      // 状态
      getStatusAjax().then((res) => {
        this.status = res.data;
      });
      // 重要类型
      getEnumSelectEnabled("ZYLX").then((res) => {
        this.importantType = res.data;
      });
      // 所属节点
      getEnumSelectEnabled("SSJD").then((res) => {
        this.node = res.data;
      });
      // 类型
      getEnumSelectEnabled("LX").then((res) => {
        this.type = res.data;
      });
      // 专业
      getEnumSelectEnabled("1372459642503467009").then((res) => {
        this.profession = res.data;
      });
      // 交付物
      getEnumSelectEnabled("FG002").then((res) => {
        this.deliverable = res.data;
      });
      // 法规符合性
      getEnumSelectEnabled("FGFHX").then((res) => {
        this.regulatoryCompliance = res.data;
      });
      // 方案类型
      getEnumSelectEnabled("FALX").then((res) => {
        this.schemeType = res.data;
      });
    },
    //递归
    getNodeKey(){
        let arr = [];
        this.treeData.forEach(item => {
          arr.push(item.id);
          if(item.children && item.children.length!==0){
             this.getChildRenKey(item.children,arr,item.id,true);
          }
        });
        this.expandedKeys = arr;
        this.$refs.refLoading.close();
    },
    getChildRenKey(data,arr,parentId,isAppend){
       data.forEach(item=>{
         item.parentId = parentId; //最上父级id
         if(isAppend){
           arr.push(item.id);
         }
         if(item.children && item.children.length!==0){
             this.getChildRenKey(item.children,arr,parentId,isAppend);
         }
       })
    },
    //获取某个节点下的key
    getParenKey(parentId){
      let arr= [];
      this.treeData.forEach(item=>{
          if(item.id === parentId){
              arr.push(item.id);
              this.getChildRenKey(item.children,arr,item.id,true);
          }else{
              this.getChildRenKey(item.children,arr,item.id,false);
          }
      })
      this.expandedKeys = arr;
      this.$refs.refLoading.close();
    },
    //
    getTree(isGetNodeKey,parentId){
      this.$refs.refLoading.open();
      designcheckTree({
        projectId:this.searchform.projectId,
        // regulationCode:this.searchform.regulationCode
      }).then(res=>{
        this.treeData = res.data?[res.data]:[];//res.data.children || []
        if(isGetNodeKey){
           if(parentId){
              this.getParenKey(parentId);
           }else{
             this.getNodeKey();//全展开
           }
        }else{
          this.expandedKeys = [];
          this.$refs.refLoading.close();
        }
      }).catch(err=>{
        this.treeData = [];
        this.$refs.refLoading.close();
      })
    },
    // 获取列表数据
    getListInfo(isGetAllData) {
      if(isGetAllData){
        this.getAllData();
      }
      getTaskListAjax(this.searchform).then((res) => {
        this.tableData = res.data.rows;
        this.searchform.total = res.data.total;
      });
    },
    getAllData(){
      if(this.$refs.table){
        this.$refs.table.clearSelection();
      }
      let params={
        page: 1,
        rows: 999999,
      };
      for(var key in this.searchform){
           if(!['page','rows','total'].includes(key) && this.searchform[key]){
              params[key] = this.searchform[key];
           }
      }
      getTaskListAjax(params).then((res) => {
        // let map = res.data.rows.map(item=>{
        //   return item.id
        // })
        this.selectAllData = res.data.rows;
      });
    },
    // 符合查询区域
    searchArea() {
      this.flag = !(this.flag)
      if (this.flag) {
        this.searchHeight = '249px'
      }else {
        this.searchHeight = '39px'
      }
    },
    // 重置
    resetForm() {
      this.searchform = {
        sort: 'modDate',     // 排序字段列表
        order: 'desc',    // 排序方式列表，asc升序，desc降序
        phase: "checklist",
        status: "",
        importantType: "",
        node: "",
        type: "",
        regulationCode: "",
        regulationName: "",
        deptId: "",
        officeId: "",
        designerUserId: "",
        profession: "",
        deliverable: "",
        planStartDateFrom: "",
        planStartDateTo: "",
        planCompleteDateFrom: "",
        planCompleteDateTo: "",
        actualCompleteDateFrom: "",
        actualCompleteDateTo: "",
        regulatoryCompliance: "",
        schemeType: "",
        articleRangeFrom:'',
        articleRangeTo:'',
        page: 1,
        rows: 30,
        total: 0,
      };
      this.searchform.projectId = this.$route.params.proId;
      // this.getTree(false);
      this.getListInfo(true);
    },
    // 选择部门
    selectDept(data) {
      if (data.itemArray.length > 0) {
        this.searchform.deptId = data.itemArray[0].linkId;
      } else {
        this.searchform.deptId = null;
      }
    },
    // 选择科室
    selectOffice(data) {
      if (data.itemArray.length > 0) {
        this.searchform.officeId = data.itemArray[0].linkId;
      } else {
        this.searchform.officeId = null;
      }
    },
    // 选择科室
    selectProfessionDesigner(data) {
      if (data.itemArray.length > 0) {
        this.searchform.designerUserId = data.itemArray[0].linkId;
      } else {
        this.searchform.designerUserId = null;
      }
    },
    handleSizeChange(val) {
      this.$refs.content.scrollTop = 0;
      this.searchform.rows = val;
      this.searchform.page = 1;
      this.getListInfo();
    },
    handleCurrentChange(val) {
      this.$refs.content.scrollTop = 0;
      this.searchform.page = val;
      this.getListInfo();
    },
    // 生成任务清单
    getGenerateTaskList() {
      getGenerateTaskListAjax(this.searchform.projectId).then((res) => {
        this.getListInfo(true);
      });
    },
    // 下发
    Issue() {
      getIssueAjax(this.searchform.phase, this.searchform.projectId).then(
        (res) => {
          if (res.data == "success") {
            this.$message({
              message: "下发成功",
              type: "success",
              duration: 1000,
            });
            this.getListInfo(true);
          }
        }
      );
    },
    // 修改
    editDetail() {
      if (this.multipleSelection.length == 0) {
        this.$message.error("请选择一条任务");
        return;
      }
      if (this.multipleSelection.length > 1) {
        this.$message.error("仅可选择一条任务进行修改");
        return;
      }
      if (sysEnv == 1) {
        let url =
          "/project/index.html#/editTaskList/" +
          this.multipleSelection[0].id +
          "/checklist/" +
          this.projectId;
        EcoUtil.getSysvm().openDialog("编辑任务", url, 800, 500, "12vh");
      } else {
        this.$router.push({
          name: "editTaskList",
          params: {
            taskId: this.multipleSelection[0].id,
            stage: "checklist",
            proId: this.projectId,
          },
        });
      }
    },
    // 作废
    deleteInfo() {
      if (this.multipleSelection.length == 0) {
        this.$message.error("请选择一条任务");
        return;
      }
      // let _ids = new FormData();
      // for (let i = 0; i < this.multipleSelection.length; i++) {
      //   _ids.append('ids',this.multipleSelection[i].id);
      // }
      // _ids.append('time', new Date().getTime());
      let _ids = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        _ids.push(this.multipleSelection[i].id);
      }
      deleteTask(_ids,this.projectId).then((res) => {
        if (res.data) {
          this.$message({
            message: "作废成功",
            type: "success",
          });
          this.getListInfo(true)
        }
      });
    },
    detailItem(id) {
      if (sysEnv == 1) {
        let url = "/project/index.html#/detailTaskInfo/" + id+"?phase="+this.searchform.phase;
        EcoUtil.getSysvm().openDialog("任务详情", url, 800, 500, "12vh");
      } else {
        this.$router.push({
          name: "detailTaskInfo",
          params: { taskId: id },
        });
      }
    },
    // 导出
    exportFun() {
      getTaskListExportAjax(this.searchform).then((res) => {
        if( window.navigator && window.navigator.msSaveOrOpenBlob ) {
          navigator.msSaveBlob(new Blob([res.data],"点检任务清单.xlsx"));
        }else{
          let blob = new Blob([res.data], { type: 'application/octet-stream' });
          EcoFile.downloadFile(blob, "点检任务清单.xlsx");
        }
       
      })
    },
    listAction() {
      let callBackDialogFunc = function (obj) {
        if (obj.action == "editTaskList") {
          window.taskListvm.getListInfo();
        }
      };
      EcoUtil.addCallBackDialogFunc(callBackDialogFunc, "taskListvm");
    },
  },
};
</script>

<style scoped>
.taskList {
  padding: 0px 15px 20px 15px;
  background-color: #fff;
}
.taskList .toolbar {
  margin-top: 10px;
  margin-bottom: 10px;
}
.taskList .searchBox {
  font-size: 14px;
  padding: 5px 15px;
  line-height: 28px;
  overflow-y: auto;
  background-color: #fafafa;
}
.taskList .itemInput {
  display: inline-block;
  width: 160px;
  margin-right: 10px;
}
.taskList .itemInput-short {
  display: inline-block;
  width: 120px;
  margin-right: 10px;
}
.taskList .itemInputLong {
  display: inline-block;
  width: 240px;
  margin-right: 10px;
}
.taskList .itemInputLLong {
  display: inline-block;
  width: 290px;
  margin-right: 10px;
}
.taskList .detailSpan {
  cursor: pointer;
  color: #409eff;
}
.taskList .modelBox {
  height: 100%;
}

.taskList .modelBox .el-col {
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 275px;
}

.taskList .modelBox .el-col:last-child {
  padding: 10px 10px 0px 0px;
  box-sizing: border-box;
}

.taskList .modelBox .splitLine {
  top: 10px;
  left: 0px;
  width:265px;
  background-color: #f5f5f5;
}
.taskList  .splitLine /deep/ .el-tree{
  background-color: #f5f5f5;
  border:1px solid #EBEEF5
}
.taskList .noDataTree {
  text-align: center;
  line-height: 200px;
  color: #909399;
  font-size: 12px;
}
.taskList  .custom-tree-node .nodeText{
  width:100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.taskList .custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.taskList /deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
