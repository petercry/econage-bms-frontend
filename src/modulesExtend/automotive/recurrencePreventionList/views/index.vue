<template>
    <eco-content top='0px' bottom='0px' type='tool' style='background: #f5f5f5'>
        <div class="recurrenceIndex">
            <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool'>
                <el-row style='padding:16px;background: #fff;border:1px solid #ddd;'>
                    <el-col :span='5'>
                        <strong>再发防止清单库{{ecoTitle[pageType]}}</strong>
                    </el-col>
                    <el-col :span='19' style="text-align:right">
                        <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                        <el-button type='primary' size='small' v-show='pageType=="organization" && btnRoleObj["recurrence_prevention.management_CREATE_RECURRENCE"]' @click='editCase({},"addCase")'>新增</el-button>
                        <el-button type='danger' size='small' v-show='(pageType=="organization" && btnRoleObj["recurrence_prevention.management_DELETE_RECURRENCE"]) || (pageType=="finish" && btnRoleObj["recurrence_hailing.finish_DELETE_RECURRENCE"])' @click='deleteCase'>删除</el-button>
                        <el-button type='primary' size='small' v-show='pageType=="organization" && btnRoleObj["recurrence_prevention.management_SUBMIT_RECURRENCE"]' @click='openApprope'>提交</el-button>
                        <el-button type='primary' size='small' v-show='pageType=="organization" && btnRoleObj["recurrence_prevention.management_IMPORT_RECURRENCE"]' @click='importCase'>导入</el-button>
                        <el-upload v-show='false' ref='recurrenceIndexUpload' :auto-upload='true' :http-request="uploadFile" action="" :before-upload='beforeUpload'
                            :show-file-list='false'  accept='.xls,.xlsx'>
                        </el-upload>
                        <el-button type='primary' size='small' v-show='(pageType=="organization" && btnRoleObj["recurrence_prevention.management_EXPORT_RECURRENCE"]) || (pageType=="finish" && btnRoleObj["recurrence_hailing.finish_EXPORT_RECURRENCE"])' @click='exportCase'>导出</el-button>
                        <el-button type='primary' size='small' v-show='pageType==="approve" && btnRoleObj["recurrence_hailing.approve_AGREE_RECURRENCE"]'  @click='appropeCase'>同意</el-button>
                        <el-button type='primary' size='small' v-show='pageType==="approve" && btnRoleObj["recurrence_hailing.approve_REJECT_RECURRENCE"]'  @click='withdrawCase'>退回</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content v-show='isShowSearch' top='59px' height='100px' type='tool' style='border:1px solid #ddd;overflow: hidden;'>
                <el-row class='searchRow'>
                    <el-col :span='24'>
                        <span class='searchInputLabel Tright' style='display: none'>状态:</span>
                        <el-select filterable v-model='searchContent.status' style='width:150px;display: none' multiple>
                            <el-option :value='key' :label='item' v-for='(item,key) in status' :key='key'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>操作类型:</span>
                        <el-select filterable v-model='searchContent.operate' style='width:150px;'>
                            <el-option :value='key' :label='item' v-for='(item,key) in operate' :key='key'></el-option>
                        </el-select>
                       <span class='searchInputLabel Tright'>标题:</span>
                        <el-input v-model='searchContent.title' clearable style='width:150px;' placeholder='请输入' @keyup.enter.native='requestData("search")'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel Tright'>标准编号:</span>
                        <el-input v-model='searchContent.standardNumber' clearable style='width:150px;' placeholder='请输入' @keyup.enter.native='requestData("search")'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel Tright'>标准名称:</span>
                        <el-input v-model='searchContent.standardName' clearable style='width:150px;' placeholder='请输入' @keyup.enter.native='requestData("search")'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel' v-if='pageType==="approve"'>办理状态:</span>
                        <el-select v-if='pageType==="approve"' filterable v-model='searchContent.approveStatus' style='width:120px;' clearable>
                            <el-option value='PENDING' label='待办'></el-option>
                            <el-option value='DONE' label='已办'></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span='24'>
                        <span class='searchInputLabel Tright'>项目名称:</span>
                        <el-input v-model='searchContent.project' clearable style='width:150px;' placeholder='请输入' @keyup.enter.native='requestData("search")'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel Tright'>阶段:</span>
                        <el-input v-model='searchContent.stage' clearable style='width:150px;' placeholder='请输入' @keyup.enter.native='requestData("search")'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                       <span class='searchInputLabel Tright'>年份:</span>
                        <el-input v-model='searchContent.year' clearable style='width:150px;' placeholder='请输入' @keyup.enter.native='requestData("search")'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <el-button @click='requestData("search")' type='primary' style='margin-left:35px;'>查询</el-button>
                        <el-button @click='restSearContent'>重置</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
              <el-row class="modelBox" :class='{"finishList":pageType==="finish"}'>
                <el-col :span='4' class="splitLine" v-if='pageType==="finish"'>
                  <el-scrollbar style='height:100%;'>
                      <div class='noDataTree' v-if='treeData.length==0'>
                          <span>暂无数据</span>
                      </div>
                      <el-tree v-else :default-expand-all='true'   node-key="id" :data="treeData" empty-text='无标题' :props="defaultProps" @node-click="handleNodeClick" highlight-current ref='recurrenceTree'>
                          <span class="custom-tree-node" slot-scope="{ node, data }">
                              <el-tooltip v-if='(node.label.length + parseInt(data.count))>=13'  effect="dark" :content="(node.label+' ('+data.count+')')" placement="right-start">
                                  <span class="nodeText">{{ node.label }}<span style='margin-left:5px;' v-if='!data.leaf'>({{data.count}})</span></span>
                              </el-tooltip>
                              <span class="nodeText" v-else>{{ node.label }}<span  style='margin-left:5px;' v-if='!data.leaf'>({{data.count}})</span></span>
                          </span>
                      </el-tree>
                  </el-scrollbar>
                </el-col>
                <el-col :span='(pageType==="finish"?20:24)' style='height:100%'>
                  <el-table ref='organizationListTable' border @selection-change="handleSelectionChange" stripe :data='tableData' header-row-class-name='tableHeader'
                      tooltip-effect='dark' height='100%' class='standardizationTable'>
                      <el-table-column type='selection' width='55'></el-table-column>
                      <el-table-column type='index' label='序号' align='center'>
                          <template slot-scope='scope'>
                              {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                          </template>
                      </el-table-column>
                      <!-- <el-table-column prop='status' label='状态'>
                          <template slot-scope='scope'>
                              <span>{{restData(scope.row.status,'status')}}</span>
                          </template>
                      </el-table-column> -->
                      <el-table-column prop='title' label='标题'>
                          <template slot-scope='scope'>
                              <span class='cursorP' @click.stop='editCase(scope.row,"viewCase")'>{{scope.row.title}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column prop='problemDesc'  label='问题描述及风险' width='200' show-overflow-tooltip></el-table-column>
                      <el-table-column prop='problemReason' label='问题原因' width='250' show-overflow-tooltip></el-table-column>
                      <!-- <el-table-column prop='solution' label='解决方案'></el-table-column> -->
                      <el-table-column prop='standardNumber' label='标准编号'></el-table-column>
                      <el-table-column prop='standardName' label='标准名称'></el-table-column>
                      <el-table-column prop='standardRequire' label='标准相关要求' show-overflow-tooltip width='120'></el-table-column>
                      <!-- <el-table-column prop='lawsAccumulate' label='法规专业积累' width='130' show-overflow-tooltip></el-table-column> -->
                      <el-table-column prop='project' label='项目名称' width='130'></el-table-column>
                      <el-table-column prop='stage' label='阶段' width='130'></el-table-column>
                      <!-- <el-table-column prop='year' label='年份' width='130'>
                          <template slot-scope='scope'>
                            <span>{{scope.row.year?scope.row.year.split('-')[0]:''}}</span>
                          </template>
                      </el-table-column> -->
                      <el-table-column prop='createUserName' label='发起人'></el-table-column>
                      <el-table-column v-if='pageType=="organization"' prop='createDate' width='160' label='发起时间'></el-table-column>
                      <el-table-column v-if='pageType=="approve"' prop='approveUserAssignTime' width='160' label='到达时间'></el-table-column>
                      <el-table-column  v-if='pageType=="finish"' prop='approveCompleteTime' width='160' label='完成时间'></el-table-column>
                      <el-table-column prop='operate' label='操作类型'>
                          <template slot-scope='scope'>
                              <span>{{restData(scope.row.operate,'operate')}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column v-if='pageType=="organization"' label='退回意见' prop='rejectCause'></el-table-column>
                      <el-table-column label='操作' fixed='right' align='center' width='120' v-if='(pageType==="organization" && btnRoleObj["recurrence_prevention.management_UPDATE_RECURRENCE"]) || (pageType==="finish" && btnRoleObj["recurrence_hailing.finish_UPDATE_RECURRENCE"])'>
                          <template slot-scope='scope'>
                              <el-button type='text' @click.stop='editCase(scope.row,"editCase")'>修改</el-button>
                              <el-button type='text' @click.stop='openHistory(scope.row.id)'>历史版本</el-button>
                          </template>
                      </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </eco-content>
            <eco-content bottom="0px" type="tool" style="padding:5px 0px">
                <el-row>
                    <el-col :span="24" style="text-align:right">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="baseInfo.page" :page-sizes="[30,50,100]"
                            :page-size="baseInfo.rows" layout="total, sizes, prev, pager, next, jumper" :total="baseInfo.total"
                            style="margin-right:20px">
                        </el-pagination>
                    </el-col>
                </el-row>
            </eco-content>
        </div>
    </eco-content>
</template>
<script>
var _self;
import ecoContent from "@/components/pageAb/ecoContent.vue";
import ecoLoading from "@/components/loading/ecoLoading.vue";
import { EcoUtil } from "@/components/util/main.js";
import { EcoMessageBox } from "@/components/messageBox/main.js";
import {recurrencePreventionTree,recurrencePreventionApplyDel,getRoleBtnSetting,recurrencePreventionList,recurrencePreventionDel,recurrencePreventionSubmit,recurrencePreventionAudit,recurrencePreventionImport,recurrencePreventionExport} from "../service/service.js";
import { mapState,mapMutations } from "vuex";
export default {
  name: "recurrenceIndex",
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      treeData: [],
      timer:null,
      ecoTitle: { organization: "编制", approve: "审批", finish: "完成" },
      isShowSearch: true,
      searchContent: {
        status: [],
        operate:'',
        title:'',
        standardNumber:'',
        standardName:'',
        stage:'',
        project:'',
        year:'',
        approveStatus:''
      },
      tableData: [],
      multipleSelection: [],
      baseInfo: {
        page: 1,
        rows: 30,
        total: 0
      },
      btnRoleObj:{}
    };
  },
  components: {
    ecoContent,
    ecoLoading
  },
  computed: {
    ...mapState(['status','operate']),
    pageType() {
      return this.$route.params.pageType;
    },
    contentTop() {
      return this.isShowSearch ? "159px" : "59px";
    }
  },
  created() {
    _self = this;
    this.initRole();
    this.initStatus();
    this.callAction();
  },
  mounted() {
    if(this.pageType==="approve"){
        this.searchContent.approveStatus = 'PENDING';
    }
    if(this.pageType ==='finish'){
      this.getTree();
    }
    this.requestData("search");
  },
  methods: {
    ...mapMutations(["SET_PUBLIC_ROle"]),
    openHistory(id){
         //打开历史列表
         let url = '/recurrencePreventionList/index.html#/historyList/'+id;
         EcoUtil.getSysvm().openDialog('历史版本',url,'1000','700');
      },
    getTree(){
      recurrencePreventionTree().then(res=>{
          this.treeData = res.data.children || [];
      }).catch(err=>{
          this.treeData = [];
      })
    },
    handleNodeClick(data) {
        if(data.leaf){
            this.searchContent.standardNumber = data.name;
            this.requestData('search');
        }
    },
    initRole(){
      let btn_array1=[
        'recurrence_prevention.management_VIEW_RECURRENCE',
        'recurrence_prevention.management_CREATE_RECURRENCE',
        'recurrence_prevention.management_UPDATE_RECURRENCE',
        'recurrence_prevention.management_DELETE_RECURRENCE',
        'recurrence_prevention.management_EXPORT_RECURRENCE',
        'recurrence_prevention.management_IMPORT_RECURRENCE',
        'recurrence_prevention.management_SUBMIT_RECURRENCE',
        'recurrence_prevention.management_AUDIT_RECURRENCE',
      ];//编制
      let btn_array2=[
        'recurrence_hailing.approve_AGREE_RECURRENCE',
        'recurrence_hailing.approve_REJECT_RECURRENCE'
      ];//审批
      let btn_array3=[
         'recurrence_hailing.finish_UPDATE_RECURRENCE',
         'recurrence_hailing.finish_DELETE_RECURRENCE',
         'recurrence_hailing.finish_EXPORT_RECURRENCE'
      ];//完成
      Promise.all([
      getRoleBtnSetting(btn_array1),
      getRoleBtnSetting(btn_array2),
      getRoleBtnSetting(btn_array3)
      ]).then(resArr=>{
        this.btnRoleObj = Object.assign(resArr[0].data.authenticationMap,resArr[1].data.authenticationMap,resArr[2].data.authenticationMap);
        this.SET_PUBLIC_ROle(this.btnRoleObj);
      })
    },
    uploadFile(params){
        this.$refs.refLoading.open();
        var fileObj = params.file;
        var form = new FormData();
        form.append('file',fileObj);
        form.append('time',new Date().getTime());
        recurrencePreventionImport(form).then(res=>{
            this.$message.success('导入成功');
            this.restSearContent();
            this.$refs.refLoading.close();
        }).catch(err=>{
            this.$message.error('导入失败');
            this.$refs.refLoading.close();
        })
    },
    importCase(){
        let doit = function(){
            _self.$refs.recurrenceIndexUpload.$refs['upload-inner'].handleClick();//打开自定义选取文件弹窗
        }
        EcoMessageBox.confirm('导入操作会覆盖原先数据,请确定是否要执行?','提示',{ type: 'warning', lockScroll: false }, doit)
    },
    exportCase(){
        this.$refs.refLoading.open();
        let params ={
            sort: ["modDate"],
            order: ["desc"]
        }
        for (var key in this.searchContent) {
          if (this.searchContent[key]) {
            params[key] = this.searchContent[key];
          }
        }
        recurrencePreventionExport(params).then(res=>{
          if(window.navigator && window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(new Blob([res.data],`再发防止清单库${this.ecoTitle[this.pageType]}.xlsx`));
            this.$refs.refLoading.close();
          }else{
            let blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" }); // 为blob设置文件类型，这里以.xlsx为例
            let url = window.URL.createObjectURL(blob); // 创建一个临时的url指向blob对象
            let a = document.createElement("a");
            a.href = url;
            a.download = `再发防止清单库${this.ecoTitle[this.pageType]}.xlsx`;
            this.$refs.refLoading.close();
            a.click();
            // 释放这个临时的对象url
            window.URL.revokeObjectURL(url);
          }
        }).catch(err=>{
            this.$refs.refLoading.close();
        })
    },
    withdrawCase() {
      if (this.multipleSelection.length === 0) {
        return EcoMessageBox.alert(
          "当前未选中行,请勾选要退回的行再进行操作。",
          "提示"
        );
      }
      // if (this.multipleSelection.length > 1) {
      //   return EcoMessageBox.alert(
      //     "退回操作不能批量处理,请选中一条数据",
      //     "提示"
      //   );
      // }
      // var url ="/recurrencePreventionList/index.html#/withdrawPage/" + this.multipleSelection[0].id;
      var url ="/recurrencePreventionList/index.html#/withdrawPage";
      EcoUtil.getSysvm().openDialog("退回", url, 700, 200, "15vh");
    },
    appropeCase() {
      if (this.multipleSelection.length === 0) {
        return EcoMessageBox.alert(
          "当前未选中行,请勾选要同意的行再进行操作。",
          "提示"
        );
      }
      // if (this.multipleSelection.length > 1) {
      //   return EcoMessageBox.alert(
      //     "同意操作不能批量处理,请选中一条数据",
      //     "提示"
      //   );
      // }
      // var id = this.multipleSelection[0].id;
      this.$refs.refLoading.open();
      this.multipleSelection.forEach(item=>{
        recurrencePreventionAudit(item.id,true).then(res => {
            if(this.timer){
               clearTimeout(this.timer);
               this.timer = null;
            }
            this.timer = setTimeout(function(){
              _self.multipleSelection = [];
              _self.$message.success("同意成功!");
              _self.restSearContent();
            },450)
        })
        // .catch(err => {
        //   this.$refs.refLoading.close();
        // });
      })
    },
    deleteCase() {
      if (this.multipleSelection.length === 0) {
        return EcoMessageBox.alert(
          "当前未选中行,请勾选要删除的行再进行操作。",
          "提示"
        );
      }
      // if (this.multipleSelection.length > 1) {
      //   return EcoMessageBox.alert(
      //     "删除操作不能批量处理,请选择一条数据。",
      //     "提示"
      //   );
      // }
      let doit = function() {
        // var id = _self.multipleSelection[0].id;
        _self.$refs.refLoading.open();
        if (_self.pageType === "organization") {
          _self.multipleSelection.forEach(item=>{
            recurrencePreventionDel(item.id).then(res => {
               if(_self.timer){
                  clearTimeout(_self.timer);
                  _self.timer = null;
               }
               _self.timer = setTimeout(function(){
                  _self.multipleSelection = [];
                  _self.$message.success("删除成功!");
                  _self.restSearContent();
               },450)
            })
            // .catch(err => {
            //   _self.$refs.refLoading.close();
            // });
          })
        }else{
            //申请删除
            _self.multipleSelection.forEach(item=>{
                if(_self.timer){
                    clearTimeout(_self.timer);
                    _self.timer = null;
                }
                _self.timer = setTimeout(function(){
                  recurrencePreventionApplyDel(item.id).then(res => {
                      _self.multipleSelection = [];
                      _self.$message.success("申请删除成功!");
                      _self.restSearContent();
                  }).catch(err => {
                    _self.$refs.refLoading.close();
                  });
                },450)
            })

        }
      };
      let ecoBoxTitle = this.pageType === "organization"? "你确定要删除数据吗?": "删除申请会在'再发防止清单库编制'界面的列表中生成一条记录";
        EcoMessageBox.confirm(
            ecoBoxTitle,
            "提示",
            { type: "warning", lockScroll: false },
            doit
        );
    },
    initStatus() {
      if (this.pageType === "organization") {
        this.searchContent.status = ["SCHEDULE", "REJECT"];
      } else if (this.pageType === "approve") {
        this.searchContent.status = ["AUDITING"];
      } else if (this.pageType === "finish") {
        this.searchContent.status = ["PUBLISHED"];
      }
    },
    openApprope(){
      if (this.multipleSelection.length === 0) {
        return EcoMessageBox.alert(
          "当前未选中行,请勾选要提交的行再进行操作。",
          "提示"
        );
      }
      // if (this.multipleSelection.length > 1) {
      //   return EcoMessageBox.alert(
      //     "提交操作不能批量处理,请选择一条数据。",
      //     "提示"
      //   );
      // }
      this.multipleSelection.forEach(item=>{
        if (item.status !== "REJECT" && item.status !== "SCHEDULE") {
          return EcoMessageBox.alert(
            "状态为编制中、退回的项才可提交审核",
            "提示"
          );
        }
      })
      var url = '/recurrencePreventionList/index.html#/appropeUser';
      EcoUtil.getSysvm().openDialog('选择审批人', url, 700, 200, '15vh');
    },
    submitCase(assigneeId) {
      this.$refs.refLoading.open();
      // var id = this.multipleSelection[0].id;
      this.multipleSelection.forEach(item=>{
        recurrencePreventionSubmit(item.id,assigneeId).then(res => {
          if(this.timer){
             clearTimeout(this.timer);
             this.timer = null;
          }
          this.timer = setTimeout(function(){
              _self.multipleSelection = [];
              _self.$message.success("提交成功!");
              _self.restSearContent();
          },450)
        })
        // .catch(err => {
        //   this.$refs.refLoading.close();
        // });
      })
    },
    doWithdraw(content){
      this.multipleSelection.forEach(item=>{
      recurrencePreventionAudit(item.id,false,content).then(res => {
          if(this.timer){
              clearTimeout(this.timer);
              this.timer = null;
          }
          this.timer = setTimeout(function(){
            _self.multipleSelection = [];
            _self.$message.success("退回成功!");
            _self.requestData("search");
          },450)
        })
      })
    },
    callAction() {
      let callBackDialogFunc = function(obj) {
        //修改
        if (obj && obj.action === "add") {
          _self.multipleSelection = [];
          _self.$message.success("新增成功!");
          _self.restSearContent();
        } else if (obj && obj.action === "edit") {
          _self.multipleSelection = [];
          _self.$message.success("修改成功!");
          _self.requestData();
        } else if (obj && obj.action == "withdraw") {
          _self.doWithdraw(obj.data.content);
        }else if(obj && obj.action == 'applyEdit') {
          _self.multipleSelection = [];
          _self.$message.success("申请修改成功!");
          _self.requestData();
        }else if(obj && (obj.action === 'appropeUser')){
          _self.submitCase(obj.data.assigneeId);
        }else if(obj && (obj.action === 'submitCase')){
          //新增或编辑界面提交
          _self.$message.success('提交成功!');
          _self.restSearContent();
        }
      };
      EcoUtil.addCallBackDialogFunc(callBackDialogFunc, "recurrencePreventionList");
    },
    requestData(type) {
      this.$refs.refLoading.open();
      let params = {
        sort: ["modDate"],
        order: ["desc"],
        rows: this.baseInfo.rows,
        // status: this.searchContent.status //区分页必传字段 (编制、审批、完成)
      };
      if(this.pageType!=='approve'){
        params.status = this.searchContent.status;
      }
      if (type === "search") {
        this.baseInfo.page = 1;
        for (var key in this.searchContent) {
          if (this.searchContent[key] && key!=="status") {
            params[key] = this.searchContent[key];
          }
        }
      }
      params.page = this.baseInfo.page;
      recurrencePreventionList(params,this.pageType).then(res => {
          this.baseInfo.total = res.data.total;
          this.tableData = res.data.rows;
          this.$refs.refLoading.close();
        })
        .catch(err => {
          this.baseInfo.total = 0;
          this.tableData = [];
          this.$refs.refLoading.close();
        });
    },
    editCase(row, type) {
      let _width = "1100";
      let _height = "600";
      let url;
      let dialogTitle;
      if (type === "editCase") {
        url ="/recurrencePreventionList/index.html#/editPage/" +row.id +"/editCase/" + this.pageType + "List";
        dialogTitle = "编辑";
      } else if (type === "viewCase") {
        url ="/recurrencePreventionList/index.html#/editPage/" + row.id +"/viewCase/" +this.pageType +"List";
        dialogTitle = "查看";
        _height = "500";
      } else {
        url = "/recurrencePreventionList/index.html#/editPage/" +0 +"/addCase/" +this.pageType +"List";
        dialogTitle = "新增";
      }
      EcoUtil.getSysvm().openDialog(dialogTitle, url, _width, _height, "15vh");
    },
    handleSizeChange(val) {
      this.baseInfo.rows = val;
      this.requestData("search");
    },
    handleCurrentChange(val) {
      this.baseInfo.page = val;
      this.requestData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    changeSearchShow() {
      this.isShowSearch = !this.isShowSearch;
    },
    restSearContent() {
      this.searchContent ={
          operate:'',
          title:'',
          standardNumber:'',
          standardName:'',
          stage:'',
          project:'',
          year:'',
          approveStatus:''
      };
      if(this.pageType==="approve"){
        this.searchContent.approveStatus = 'PENDING';
      }
      if(this.pageType==='finish' && this.$refs.recurrenceTree.getCurrentNode()){
          this.$refs.recurrenceTree.setCurrentKey();
      }
      this.initStatus();
      this.requestData("search");
    },
    beforeUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
      const extension = testmsg === "xls";
      const extension2 = testmsg === "xlsx";
      if (!extension && !extension2) {
        this.$message({
          message: "导入文件只能是.xls,.xlsx格式!",
          type: "warning"
        });
      }
      return extension || extension2;
    },
  }
};
</script>
<style scoped>
.recurrenceIndex {
  color: #0f1419;
  min-width: 1000px;
  position: relative;
  height: 96%;
  margin: 0 24px;
  top: 2%;
  overflow-y: auto;
  color: #0f1419;
}

.recurrenceIndex .searchInputLabel {
  font-size: 14px;
  margin: 0px 5px 0px 8px;
  width: 75px;
  display: inline-block;
}

.recurrenceIndex .searchInputLabel.Tright {
  text-align: right;
}

.recurrenceIndex .searchRow {
  padding: 18px 10px 16px 10px;
  background: #fff;
}

.recurrenceIndex .searchRow .el-col {
  display: flex;
  align-items: center;
}

.recurrenceIndex .searchRow .el-col + .el-col {
  margin-top: 10px;
}

.recurrenceIndex .cursorP {
  cursor: pointer;
  color:#409eff;
}
.recurrenceIndex .modelBox {
  height: 100%;
}

.recurrenceIndex .modelBox.finishList .el-col {
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 270px;
}

.recurrenceIndex .modelBox.finishList .el-col:last-child {
  padding: 10px 10px 0px 0px;
  box-sizing: border-box;
}

.recurrenceIndex .modelBox.finishList .splitLine {
  top: 10px;
  left: 0px;
  width:265px;
  background-color: #f5f5f5;
}
.recurrenceIndex  .splitLine /deep/ .el-tree{
  background-color: #f5f5f5;
  border:1px solid #EBEEF5
}
.recurrenceIndex .noDataTree {
  text-align: center;
  line-height: 200px;
  color: #909399;
  font-size: 12px;
}
.recurrenceIndex  .custom-tree-node .nodeText{
  width:100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.recurrenceIndex .custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.recurrenceIndex /deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
