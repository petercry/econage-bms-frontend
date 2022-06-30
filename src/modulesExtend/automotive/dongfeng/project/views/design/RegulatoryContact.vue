<template>
  <div class="taskList">
    <div class="toolbar">
      <el-button type="primary" @click="Issue" v-show='initRole.PAGE_DC_REGULATION_PROJECT_CONTACT.permission.AGREE'>同意</el-button>
      <el-button type="primary" @click="searchArea">高级查询</el-button>
      <el-button type="primary" @click="getListInfo">查询</el-button>
      <el-button type="primary" @click="resetForm">重置</el-button>
    </div>

    <div v-show='flag'>
      <div class="searchBox">
        <span>状态：</span>
        <div class="itemInput">
          <el-select v-model="searchform.status" placeholder="请选择">
            <el-option v-for="(value,key) in designStatusList" :key="key" :label="value" :value="key"></el-option>
          </el-select>
        </div>

        <!-- <span>重要类型：</span>
        <div class="itemInput">
          <el-select v-model="searchform.importantType" placeholder="请选择">
            <el-option v-for="item in importantType" :key="item.id" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </div> -->

        <span>所属节点：</span>
        <div class="itemInput">
          <el-select v-model="searchform.node" placeholder="请选择">
            <el-option v-for="item in node" :key="item.id" :label="item.text" :value="item.text"></el-option>
          </el-select>
        </div>

        <span>专业：</span>
        <div class="itemInput">
          <el-select v-model="searchform.profession" filterable placeholder="请选择">
            <el-option v-for="item in profession" :key="item.id" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </div>
        <!-- <span>类型：</span>
        <div class="itemInput">
          <el-select v-model="searchform.type" placeholder="请选择">
            <el-option v-for="(item,key) in typeList" :key="key" :label="item" :value="key"></el-option>
          </el-select>
        </div> -->
      </div>

      <div class="searchBox">
        <span>标准法规号：</span>
        <div class="itemInput">
          <el-input v-model="searchform.regulationCode" placeholder="请输入内容"></el-input>
        </div>

        <span>标准法规名称：</span>
        <div class="itemInput">
          <el-input v-model="searchform.regulationName" placeholder="请输入内容"></el-input>
        </div>


        <!-- <span>计划开始日期：</span>
        <div class="itemInputLLong">
          <el-date-picker style="width: 130px;vertical-align: top;" value-format="yyyy-MM-dd" v-model="searchform.planStartDateFrom" type="date" placeholder="选择日期">
          </el-date-picker>
          —
          <el-date-picker style="width: 130px;vertical-align: top;" value-format="yyyy-MM-dd" v-model="searchform.planStartDateTo" type="date" placeholder="选择日期">
          </el-date-picker>
        </div> -->
      </div>

      <!-- <div class="searchBox">
        <span>计划完成日期：</span>
        <div class="itemInputLLong">
          <el-date-picker style="width: 130px;vertical-align: top;" value-format="yyyy-MM-dd" v-model="searchform.planCompleteDateFrom" type="date" placeholder="选择日期">
          </el-date-picker>
          —
          <el-date-picker style="width: 130px;vertical-align: top;" value-format="yyyy-MM-dd" v-model="searchform.planCompleteDateTo" type="date" placeholder="选择日期">
          </el-date-picker>
        </div>

        <span>实际完成日期：</span>
        <div class="itemInputLLong">
          <el-date-picker style="width: 130px;vertical-align: top;" value-format="yyyy-MM-dd" v-model="searchform.actualCompleteDateFrom" type="date" placeholder="选择日期">
          </el-date-picker>
          —
          <el-date-picker style="width: 130px;vertical-align: top;" value-format="yyyy-MM-dd" v-model="searchform.actualCompleteDateTo" type="date" placeholder="选择日期">
          </el-date-picker>
        </div>
      </div> -->

      <div class="searchBox">
        <!-- <span>法规符合性：</span>
        <div class="itemInput">
          <el-select v-model="searchform.regulatoryCompliance" placeholder="请选择">
            <el-option v-for="item in regulatoryCompliance" :key="item.id" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </div> -->

        <!-- <span>方案类型：</span>
        <div class="itemInput">
          <el-select v-model="searchform.schemeType" placeholder="请选择">
            <el-option v-for="item in schemeType" :key="item.id" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </div> -->
      </div>
    </div>

    <eco-content ref="content" :top="searchHeight" bottom="42px" style="padding:0px 15px;">
      <el-table border stripe height="100%" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" class="styleTableDefaulta">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="statusName" label="状态" width="120">
        </el-table-column>
        <el-table-column prop="nodeName" label="所属节点">
        </el-table-column>
        <!-- <el-table-column prop="typeName" label="类型">
        </el-table-column> -->
        <el-table-column prop="regulation" label="标准法规号">
        </el-table-column>
        <el-table-column prop="regulationName" label="标准法规名称">
        </el-table-column>
        <el-table-column prop="professionName" label="专业" width="160">
        </el-table-column>
        <el-table-column prop="regulatoryCompliance" label="操作" width="60" v-if='initRole.PAGE_DC_REGULATION_PROJECT_CONTACT.permission.HANDLE'>
          <template slot-scope="scope">
            <span class="detailSpan" :class='{gary:(scope.row.itemCount!=scope.row.itemReceived)}' @click="Detail(scope.row,(scope.row.itemCount!=scope.row.itemReceived))">{{scope.row.status!='waiting'?"查看":"办理"}}</span>
          </template>
        </el-table-column>
      </el-table>
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
import { sysEnv } from "@/modulesExtend/automotive/dongfeng/project/config/env";
import { mapState, mapActions } from "vuex";
import {
  getEnumSelectEnabled,
  getStatusAjax,
  getGroupingListAjax,
  getGenerateTaskListAjax,
  getIssueAjax,
  deleteTask,
} from "../../service/service";
import tagSelect from "@/components/orgPick/tagSelect.vue";
import { EcoUtil } from "@/components/util/main.js";
export default {
  components: {
    ecoContent,
    tagSelect,
  },
  computed:{
    ...mapState(['typeList','designStatusList','initRole'])
  },
  data() {
    return {
      searchform: {
        sort: 'modDate',     // 排序字段列表
        order: 'desc',    // 排序方式列表，asc升序，desc降序
        phase: "regulationContactApproval",
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
      searchHeight:'39px',
      flag:false,
    };
  },
  created() {
    this.searchform.projectId = this.$route.params.proId;
    this.projectId = this.$route.params.proId;
    this.getbaseInfo();
    this.getListInfo();
    this.listAction();
    window.taskListvm = this;
  },
  mounted() {},
  methods: {
      // 符合查询区域
      searchArea() {
          this.flag = !(this.flag)
          if (this.flag) {
            this.searchHeight = '135px'
          }else {
            this.searchHeight = '39px'
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
    // 获取列表数据
    getListInfo() {
      getGroupingListAjax(this.searchform).then((res) => {
        this.tableData = res.data.rows;
        this.searchform.total = res.data.total;
      });
    },
    // 重置
    resetForm() {
      this.searchform = {
        sort: 'modDate',     // 排序字段列表
        order: 'desc',    // 排序方式列表，asc升序，desc降序
        phase: "regulationContactApproval",
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
        page: 1,
        rows: 30,
        total: 0,
      };
      this.searchform.projectId = this.$route.params.proId;
      this.getListInfo();
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
    handleSelectionChange(rows) {
      this.multipleSelection = rows;
    },
    // 下发
    Issue() {
      let _ids = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        _ids.push(this.multipleSelection[i].id);
      }
      getIssueAjax(this.searchform.phase, this.searchform.projectId,_ids).then(
        (res) => {
          if (res.data == "success") {
            this.$message({
              message: "下发成功",
              type: "success",
              duration: 1000,
            });
            this.getListInfo();
          }
        }
      );
    },
    // 修改
    Detail(row,isReturn) {
      if(isReturn){
        return
      }
      if (sysEnv == 1) {
        let url =
          "/project/index.html#/handleStripesExamine/" + row.id + '/' + this.searchform.phase + '/' + this.projectId+"?status="+row.status;
        EcoUtil.getSysvm().openDialog("任务办理", url, 1080, 500, "12vh"); //1540
      } else {
        this.$router.push({
          name: "handleStripesExamine",
          params: {
            Id: row.id,
            phase: this.searchform.phase,
            proId: this.projectId
          },
        });
      }
    },
    listAction() {
      let callBackDialogFunc = function (obj) {
        if (obj.action == "moreList") {
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
  padding: 5px 20px;
  line-height: 28px;
  overflow-y: auto;
  background-color: #fafafa;
}
.taskList .itemInput {
  display: inline-block;
  width: 150px;
  margin-right: 10px;
}
.taskList .itemInputLong {
  display: inline-block;
  width: 230px;
  margin-right: 10px;
}
.taskList .itemInputLLong {
  display: inline-block;
  width: 310px;
  margin-right: 10px;
}
.taskList .detailSpan {
  cursor: pointer;
  color: #409eff;
}
.detailSpan.gary{
  color: #c8c9cc;
}
</style>
