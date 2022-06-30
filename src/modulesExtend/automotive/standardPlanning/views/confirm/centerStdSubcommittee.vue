<template>
  <div class="chiefReview" v-loading="loading">
    <div class="clearfix">
      <div class="btn">
        <el-button class="export" @click="isShow">高级搜索</el-button>
        <el-button class="export" @click="selectAllCase">全选</el-button>
        <el-button class="export" @click="open">驳回</el-button>
        <el-button class="export" @click="issue">同意</el-button>
        <el-button class="export" @click="byExport" style="margin-left: 10px;">导出</el-button>
      </div>
    </div>
    <!-- 全展开搜索区域 -->
    <div class="search" :style="{ 'height': all == 'open' ? null : '40px'}" v-show="show">
      <el-form ref="form" :model="form" label-width="110px" label-position="center">
        <el-row>
          <el-col :span="6">
            <el-form-item label="年度">
              <el-input v-model="form.year" disabled style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="标准分类">
              <el-select v-model="form.classification" placeholder="请选择" style="width:100%">
                <el-option v-for="item in classification" :key="item.id" :label="item.text" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="标准编号">
              <el-input v-model="form.programNumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="标准名称">
              <el-input v-model="form.programName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="all == 'shrink'">
            <el-form-item class="setting" style="float: right;">
              <el-button @click="resetForm">重置</el-button>
              <el-button type="primary" @click="submitForm">查询</el-button>
              <el-button type="text" @click="isAll('open')">展开<i class="el-icon-arrow-down"></i></el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="all == 'open'">
          <el-col :span="6">
            <el-form-item label="部门">
              <tag-select style="width:100%" :initDataStr="deptInitDataStr" :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(val)=>selectRoleDept(val,'dept')">
              </tag-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-show="all == 'open'">
            <el-form-item label="操作类型">
              <el-select v-model="form.operationType" placeholder="请选择" style="width:100%">
                <el-option v-for="(item,key,index) in operationType" :key="index" :label="item" :value="key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="6">
            <el-form-item label="初稿完成时间">
              <el-date-picker style="width:100%" v-model="form.draftTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="会签完成时间">
              <el-date-picker style="width:100%" v-model="form.countersignTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="all == 'open'">
          <el-col :span="6">
            <el-form-item label="科室">
              <tag-select style="width:100%" :initDataStr="deptInitDataStr_office" :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(val)=>selectRoleDept(val,'office')">
              </tag-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="定制人">
              <tag-select style="width:100%" :initDataStr="userInitDataStr_drafter" :initOptions="{selectNum:1,selectType:'User'}" @callBack="(val)=>selectRoleUser(val,'drafter')">
              </tag-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item label="责任人">
              <tag-select style="width:100%" :initDataStr="userInitDataStr_responsibleUser" :initOptions="{selectNum:1,selectType:'User'}" @callBack="(val)=>selectRoleUser(val,'responsibleUser')">
              </tag-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="审批状态">
              <el-select v-model="form.phaseStatus" placeholder="请选择" style="width:100%">
                <el-option v-for="(item,key,index) in phaseStatus" :key="index" :label="item" :value="key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="6">
            <el-form-item label="标准状态标示">
              <el-select v-model="form.status" placeholder="请选择" style="width:100%">
                <el-option v-for="(item,key,index) in status" :key="index" :label="item" :value="key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="all == 'open'">
          <el-col :span="6">
            <el-form-item label="复审年度">
              <el-date-picker style="width:100%" v-model="form.reviewYear" type="year" value-format="yyyy" placeholder="选择年度">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="分标委">
              <el-input v-model="form.subcommittee"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="来源编号">
              <el-input v-model="form.sourceNumber"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="6">
            <el-form-item label="体系码">
              <el-input v-model="form.systemCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="all == 'open'">
          <el-col :span="6">
            <el-form-item label="审批节点">
              <el-select v-model="form.phaseId" placeholder="请选择" style="width:100%" disabled>
                <el-option v-for="(item,key,index) in state_flow" :key="index" :label="item" :value="key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" style="float:right;">
            <el-form-item>
              <el-button @click="resetForm">重置</el-button>
              <el-button type="primary" @click="submitForm">查询</el-button>
              <el-button type="text" @click="isAll('shrink')">收缩<i class="el-icon-arrow-up"></i></el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 表格 -->
    <div class="table" style="display:flex;">
      <el-tree :data="treeData" :props="defaultProps" style="width:20%" @node-click="handleNode"></el-tree>
      <el-table :data="tableData" ref="multipleTable" style="width: 100%" height="100%" stripe :header-cell-style="{background:'##f5f7fa'}" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <!-- <el-table-column prop="year" label="年度">
        </el-table-column> -->
        <el-table-column prop="deptName" label="部门">
        </el-table-column>
        <el-table-column prop="typeName" label="标准类型">
        </el-table-column>
        <el-table-column prop="programNumber" label="标准编号">
        </el-table-column>
        <el-table-column prop="programName" label="标准名称" width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="details(scope.row)">{{scope.row.programName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="draftTime" label="初稿完成时间" width="100">
        </el-table-column>
        <el-table-column prop="countersignTime" label="会签完成时间" width="100">
        </el-table-column>
        <el-table-column prop="officeName" label="科室">
        </el-table-column>
        <!-- <el-table-column prop="drafterName" label="制定人">
        </el-table-column> -->
        <el-table-column prop="responsibleUserName" label="责任人">
        </el-table-column>
        <el-table-column prop="statusName" label="标准状态标识" width="100">
        </el-table-column>
        <el-table-column prop="reviewYear" label="复审年度">
        </el-table-column>
        <el-table-column prop="subcommitteeName" label="分标委">
        </el-table-column>
        <el-table-column prop="sourceNumberName" label="来源编号">
          <template slot-scope="scope">
            <span v-for="(item,index) in scope.row.sourceNumberList" :key="index">
              {{item.code}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="systemCode" label="体系码">
        </el-table-column>
        <el-table-column prop="operationTypeName" label="操作类型"></el-table-column>
        <el-table-column prop="phaseStatusName" label="审批状态">
        </el-table-column>
        <el-table-column prop="phaseIdName" label="审批节点">
        </el-table-column>
        <el-table-column prop="currentAssigneeName" label="当前审批人">
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="300">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="comments(scope.row)">流程历史意见</el-button>
            <el-button type="text" size="small" @click="approval(scope.row)" v-show="scope.row.readStartup">立项</el-button>
            <el-button type="text" size="small" @click="review(scope.row)" v-show="scope.row.readReview">复审</el-button>
            <el-button type="text" size="small" @click="confirm(scope.row)" v-show="scope.row.readOk">确认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.page" :page-sizes="[10, 20, 30, 40]" :page-size="form.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <el-dialog title="审批意见" :visible.sync="dialogVisible" width="30%">
      <el-input v-model="approvalcom" type="textarea" :rows="3"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="reject">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { EcoUtil } from "@/components/util/main.js";
import { EcoFile } from "@/components/file/main.js";
import tagSelect from "@/components/orgPick/tagSelect.vue";
import { sysEnv } from "@/modulesExtend/automotive/standardPlanning/config/env";
import {
  getEnumSelectEnabled,
  getOperationType,
  getStatus,
  getStateFlow,
  getPhaseStatus,
  getStandardList,
  getEnabList,
  deleteAjax,
  confirmAjax,
  startPlanningAjax,
  issueAjax,
  exportAjax,
  orgExcelImport,
  rejectmAjax,
  haveAjax,
  needAjax,
  getDeptArrpStrr
} from "../../service/service.js";
export default {
  components: {
    tagSelect,
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      treeData: null,
      headers: {
        ["eco-auth-token"]: sessionStorage.getItem("ecoToken"),
      },
      dialogVisible: false,
      dialogTitle: "详情",
      loading: true,
      show: false, //展示高级搜索
      all: "shrink", //是否全部展开
      classification: [], //标准分类
      operationType: {}, //操作类型
      status: {}, //标准状态标示
      state_flow: {}, //审批节点
      phaseStatus: {}, //审批状态
      tableData: [],
      selcetrows: [],
      deptInitDataStr: "", //部门初始化
      deptInitDataStr_office: "", //科室初始化
      userInitDataStr_drafter: "", //定制人初始化
      userInitDataStr_responsibleUser: "", //责任人初始化
      form: {
        year: "",
        classification: "",
        programNumber: "",
        programName: "",
        dept: "",
        operationType: "",
        draftTime: "",
        countersignTime: "",
        office: "",
        drafter: "",
        responsibleUser: "",
        phaseStatus: "",
        status: "",
        reviewYear: "",
        subcommittee: "",
        sourceNumber: "",
        systemCode: "",
        phaseId: "CENTER_STD_SUBCOMMITTEE_VERIFY",
        page: 1,
        rows: 10,
      },
      total: 0,
      // 上传工资文件地址
      wageaddress: "",
      // 上传文件列表
      fileList: [],
      dialogVisible: false,
      approvalcom: "",
      haveInfo: 0,
      needAchieve: 0,
    };
  },
  created() {
    this.getyear();
    this.getBaseInfo();
    this.getList();
    this.getDeptArrpStrr()
    this.listAction();
    window.chiefReviewvm = this;
  },
  methods: {
    // 获取基础数据
    getBaseInfo() {
      getEnumSelectEnabled("esProgramClass").then((res) => {
        this.classification = res.data;
      });
      getOperationType().then((res) => {
        this.operationType = res.data.data;
      });
      getStatus().then((res) => {
        this.status = res.data.data;
      });
      getStateFlow().then((res) => {
        this.state_flow = res.data.data;
      });
      getPhaseStatus().then((res) => {
        this.phaseStatus = res.data.data;
      });
    },
    //获取列表数据
    getList() {
      getStandardList(this.form).then((res) => {
        res.data.rows.forEach(x => {
          getEnabList(x.classification).then(response => {
            x.typeName = response.data.find(a => x.type == a.id)
          })
        })
        this.tableData = res.data.rows;
        this.total = res.data.total;
        this.loading = false;
      });
    },
    getDeptArrpStrr() {
      getDeptArrpStrr().then(res => {
        this.doit(res.data)
        this.treeData = res.data.children
      })
    },
    //递归
    doit(node){
        var childrens= node.children;
        if(childrens && childrens.length > 0) {
           for(var i=0;i<childrens.length;i++){
              var arr=[];
              if (childrens[i].count) {
                childrens[i].name = childrens[i].name + '(' + childrens[i].count + ')'
              }
              if(childrens[i].children && childrens[i].children.length>0){
                  this.doit(childrens[i],arr);
              }
          }
        }
    },
    handleNode(data) {
      if (!data.children) {
        this.form.id = data.id
        this.getList();
      }
    },
    // 获取明年
    getyear() {
      let date = new Date();
      this.form.year = date.getFullYear();
    },
    // 选部门组件回调
    selectRoleDept(data, type) {
      if (!data.id && data.itemArray.length === 0) {
        if (type === "dept") {
          this.form.dept = "";
          this.deptInitDataStr = "";
        } else if (type === "office") {
          this.form.office = "";
          this.deptInitDataStr_office = "";
        }
      } else {
        if (type === "dept") {
          this.form.dept = data.orgId;
          this.deptInitDataStr = `{"type":"DEPT","orgId":"${data.orgId}","linkId":"${data.orgId}"}`;
        } else if (type === "office") {
          this.form.office = data.orgId;
          this.deptInitDataStr_office = `{"type":"DEPT","orgId":"${data.orgId}","linkId":"${data.orgId}"}`;
        }
      }
    },
    // 选人组件回调
    selectRoleUser(data, type) {
      if (!data.id && data.itemArray.length === 0) {
        if (type === "drafter") {
          this.form.drafter = "";
          this.userInitDataStr_drafter = "";
        } else if (type === "responsibleUser") {
          this.form.responsibleUser = "";
          this.userInitDataStr_responsibleUser = "";
        }
      } else {
        if (type === "drafter") {
          this.form.drafter = data.itemArray[0].linkId;;
          this.userInitDataStr_drafter = `{"type":"User","orgId":"${data.orgId}","linkId":"${data.orgId}"}`;
        } else if (type === "responsibleUser") {
          this.form.responsibleUser = data.itemArray[0].linkId;;
          this.userInitDataStr_responsibleUser = `{"type":"User","orgId":"${data.orgId}","linkId":"${data.orgId}"}`;
        }
      }
    },
    isShow() {
      this.show = !this.show;
    },
    isAll(val) {
      this.all = val;
    },
    // 查询
    submitForm() {
      // console.log(123);
      this.form.page = 1;
      this.form.rows = 10;
      this.getList();
    },
    // 重置表单
    resetForm() {
      this.form = {
        year: "",
        classification: "",
        programNumber: "",
        programName: "",
        dept: "",
        operationType: "",
        draftTime: "",
        countersignTime: "",
        office: "",
        drafter: "",
        responsibleUser: "",
        phaseStatus: "",
        status: "",
        reviewYear: "",
        subcommittee: "",
        sourceNumber: "",
        systemCode: "",
        phaseId: "CENTER_STD_SUBCOMMITTEE_VERIFY",
        page: 1,
        rows: 10,
      };
      this.getyear()
      this.deptInitDataStr = '', //部门初始化
      this.deptInitDataStr_office = '', //部门初始化
      this.userInitDataStr_drafter = '', //部门初始化
      this.userInitDataStr_responsibleUser = '', //部门初始化
      this.getList();
    },
    // 页码改变
    handleCurrentChange(val) {
      this.form.page = val;
      this.getList();
    },
    // 条数改变
    handleSizeChange(val) {
      this.form.rows = val;
      this.getList();
    },
    // 选择信息
    handleSelectionChange(val) {
      this.selcetrows = val;
    },
    // 详情
    details(val) {
      if (sysEnv !== 1) {
        this.$router.push({
          name: "detail",
          params: { id: val.id },
          query: {
            readStartup: val.readStartup,
            readReview: val.readReview
          }
        });
      } else {
        let _url = "/standardPlanning/index.html#/detail/" + val.id + '?readStartup=' + val.readStartup + '&readReview=' + val.readReview;
        EcoUtil.getSysvm().openDialog("详情", _url, "800", "700", "8hv");
      }
    },
    // details(val) {
    //   if (sysEnv !== 1) {
    //     this.$router.push({
    //       name: "detail",
    //       params: { id: val.id },
    //     });
    //   } else {
    //     let _url = "/standardPlanning/index.html#/detail/" + val.id;
    //     EcoUtil.getSysvm().openDialog("详情", _url, "800", "700", "8hv");
    //   }
    // },
    // 流程意见
    comments(val) {
      if (sysEnv !== 1) {
        this.$router.push({
          name: "historyComments",
          params: { id: val.id },
        });
      } else {
        let _url = "/standardPlanning/index.html#/historyComments/" + val.id;
        EcoUtil.getSysvm().openDialog(
          "流程历史意见",
          _url,
          "1000",
          "800",
          "5vh"
        );
      }
    },
    // 立项
    approval(val) {
      if (sysEnv !== 1) {
        this.$router.push({
          name: "readProjectList",
          params: { id: val.id },
        });
      } else {
        let _url =
          "/standardPlanning/index.html#/readProjectList/" + val.id;
        EcoUtil.getSysvm().openDialog("立项单", _url, "800", "700", "8hv");
      }
    },
    // 复审
    review(val) {
      if (sysEnv !== 1) {
        this.$router.push({
          name: "readReexaminationForm",
          params: { id: val.id },
        });
      } else {
        let _url =
          "/standardPlanning/index.html#/readReexaminationForm/" +
          val.id;
        EcoUtil.getSysvm().openDialog("复审单", _url, "800", "700", "8hv");
      }
    },
    // 确认
    confirm(val) {
      confirmAjax(val.id).then((res) => {
        if (res.data.success) {
          this.$message({
            message: "确认成功",
            type: "success",
          });
        }
        this.getList();
      });
    },
    //全选
    selectAllCase() {
      this.tableData.forEach((x,index) => {
        this.$refs.multipleTable.toggleRowSelection(this.tableData[index],true);
      })
      var params = {
        page: 1,
        rows: 9999,
        year: this.form.year
      }
      getStandardList(params).then(res => {
          this.selcetrows = res.data.rows
      })
    },
    // 下发
    issue() {
      if(this.selcetrows && this.selcetrows.length != 0) {
        var list = []
        this.selcetrows.forEach(x => {
          list.push(x.id)
        })
        if (sysEnv !== 1) {
          this.$router.push({name: "selectDeptList",params: { ids: list.toString(), status: this.form.phaseId },});
        } else {
          let _url = "/standardPlanning/index.html#/selectDeptList/" + list.toString() + '/' + this.form.phaseId;
          EcoUtil.getSysvm().openDialog("部门信息",_url,"800","700","8hv");
        }
      } else {
        this.$message.warning("请选择下发标准")
      }
      // haveAjax(this.form.phaseId).then((res) => {
      //   this.haveInfo = res.data.data;
      //   needAjax(this.form.phaseId).then((res) => {
      //     this.needAchieve = res.data.data;
      //     if (this.needAchieve != 0) {
      //       if (this.haveInfo == this.needAchieve) {
      //         issueAjax(this.form.phaseId).then((res) => {
      //           if (res.data.success) {
      //             this.$message({
      //               message: "提交成功",
      //               type: "success",
      //             });
      //           }
      //           this.getList();
      //         });
      //       } else {
      //         this.$message.error("当前拥有条数未达到需达到条数不可提交！");
      //       }
      //     } else {
      //       this.$message({
      //         message: "当前无提交规划",
      //         type: "warning",
      //       });
      //     }
      //   });
      // });
    },
    // 导出
    byExport() {
      exportAjax(this.form).then((res) => {
        var blob = new Blob([res.data], { type: "application/octet-stream" });
        EcoFile.downloadFile(blob, "download.xlsx");
      });
    },
    open() {
      if (this.selcetrows.length == 0) {
        this.$message({
          message: "请选择规划信息",
          type: "warning",
        });
      } else {
        this.dialogVisible = true;
      }
    },
    // 退回
    reject() {
      if (this.approvalcom == "") {
        this.$message({
          message: "请填写审批意见",
          type: "warning",
        });
      } else {
        let delArr = [];
        for (let i of this.selcetrows.keys()) {
          delArr.push(this.selcetrows[i].id);
        }
        rejectmAjax(this.form.phaseId, delArr, this.approvalcom).then((res) => {
          if (res.data.success) {
            this.$message({
              message: "退回成功",
              type: "success",
            });
          }
          this.dialogVisible = false;
          this.getList();
        });
      }
    },
    listAction() {
      let callBackDialogFunc = function (obj) {
        if (
          obj.action == "addStandard" ||
          obj.action == "ReexaminationForm" ||
          obj.action == "projectList" ||
          obj.action == "editStandard" ||
          obj.action == "issuePage"
        ) {
          window.chiefReviewvm.getList();
        }
      };
      EcoUtil.addCallBackDialogFunc(callBackDialogFunc, "chiefReviewvm");
    },
  },
};
</script>
<style scoped>
.chiefReview .btn {
  float: right;
  margin-right: 20px;
  margin-bottom: 20px;
}
.chiefReview .search {
  background-color: #f5f5f5;
  /* height: 160px; */
  padding-top: 10px;
  padding-right: 10px;
}
.chiefReview .table {
  padding: 20px 20px 0 20px;
  height: 85%;
}
.el-pagination {
  float: right;
}
</style>
<style>
.chiefReview .el-button--primary.is-plain {
  background-color: white;
}
.chiefReview .export {
  color: #409eff;
  border: 1px solid #409eff;
}
.chiefReview .el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 10px;
}
.chiefReview .export:focus {
  outline: none;
  box-shadow: none;
  background-color: transparent;
}
.chiefReview .el-pagination {
  float: right;
  margin-right: 10px !important;
}
.setting .el-form-item__content {
  margin-left: 50px !important;
}
</style>
