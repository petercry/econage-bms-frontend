<template>
  <div class="designList">
    <div class="toolbar">
      <el-button type="primary" @click="searchArea" v-show='initRole.PAGE_DC_DESIGNER.permission.SEARCH'>高级查询</el-button>
      <el-button type="primary" @click="exportFun" v-show='initRole.PAGE_DC_DESIGNER.permission.EXPORT'>导出</el-button>
      <el-button type="primary" @click="reSubmit" v-show='initRole.PAGE_DC_DESIGNER.permission.RECOMMIT'>重新提交</el-button>
    </div>
    <div v-show='flag'>
      <div class="searchBox">
        <span>状态：</span>
        <div class="itemInput">
          <el-select v-model="searchform.status" placeholder="请选择">
            <el-option label="待办" value="waiting"></el-option>
            <el-option label="已办理" value="handled"></el-option>
            <el-option label="已完成" value="complete"></el-option>
          </el-select>
        </div>

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

        <span>标准法规号：</span>
        <div class="itemInput">
          <el-input v-model="searchform.regulationCode" placeholder="请输入内容"></el-input>
        </div>
      </div>

      <div class="searchBox">
        <span>标准法规名称：</span>
        <div class="itemInput">
          <el-input v-model="searchform.regulationName" placeholder="请输入内容"></el-input>
        </div>

        <span>法规符合性：</span>
        <div class="itemInput-short">
          <el-select v-model="searchform.regulatoryCompliance" placeholder="请选择">
            <el-option v-for="item in regulatoryCompliance" :key="item.id" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </div>

        <span>方案类型：</span>
        <div class="itemInput-short">
          <el-select v-model="searchform.schemeType" placeholder="请选择">
            <el-option v-for="item in schemeType" :key="item.id" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </div>

        <el-button type="primary" @click="getListInfo">查询</el-button>
        <el-button type="primary" @click="resetForm">重置</el-button>
      </div>
    </div>

    <eco-content :top="searchHeight" ref="content" bottom="42px" style="padding:0px 15px;">
      <el-table border stripe height="100%" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" class="styleTableDefaulta">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="statusName" label="状态" width="120">
        </el-table-column>
        <el-table-column prop="nodeName" label="所属节点">
        </el-table-column>
        <el-table-column prop="regulation" label="标准法规号">
        </el-table-column>
        <el-table-column prop="regulationName" label="标准法规名称">
        </el-table-column>
        <el-table-column prop="professionName" label="专业" width="160">
        </el-table-column>
        <el-table-column prop="regulatoryCompliance" label="操作" width="60" v-if='initRole.PAGE_DC_DESIGNER.permission.HANDLE'>
          <template slot-scope="scope">
            <span class="detailSpan" @click="Detail(scope.row,'editCase')" v-if='scope.row.statusName=="待办"'>办理</span>
            <span class="detailSpan" @click="Detail(scope.row,'viewCase')" v-else>查看</span>
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
import { EcoFile } from "@/components/file/main.js";
import { sysEnv } from "@/modulesExtend/automotive/dongfeng/project/config/env";
import { mapState, mapActions } from "vuex";
import {
  getEnumSelectEnabled,
  getStatusAjax,
  getGroupingListAjax,
  getIssueAjax,
  getBackAjax,
  getDesignExportAjax,
  reSubmitAjax
} from "../../service/service";
import tagSelect from "@/components/orgPick/tagSelect.vue";
import { EcoUtil } from "@/components/util/main.js";
export default {
  components: {
    ecoContent,
    tagSelect,
  },
  data() {
    return {
      searchHeight:'39px',
      flag:false,
      searchform: {
        sort: 'modDate',     // 排序字段列表
        order: 'desc',    // 排序方式列表，asc升序，desc降序
        phase: "designerHandle",
        projectId: "",
        status: "",
        node: "",
        profession: "",
        regulationCode: "",
        regulationName: "",
        regulatoryCompliance: "",
        schemeType: "",
        page: 1,
        rows: 30,
        total: 0,
      },
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
    };
  },
  computed:{
    ...mapState(['initRole'])
  },
  created() {
    this.searchform.projectId = this.$route.params.proId;
    this.projectId = this.$route.params.proId;
    this.getbaseInfo();
    this.getListInfo();
    this.listAction();
    window.designListvm = this;
  },
  mounted() {},
  methods: {
          // 符合查询区域
     searchArea() {
          this.flag = !(this.flag)
          if (this.flag) {
            this.searchHeight = '125px'
          }else {
            this.searchHeight = '40px'
          }
      },
    // 获取基础数据
    getbaseInfo() {
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
        phase: "designerHandle",
        status: "",
        node: "",
        profession: "",
        regulationCode: "",
        regulationName: "",
        regulatoryCompliance: "",
        schemeType: "",
        page: 1,
        rows: 30,
        total: 0,
      };
      this.searchform.projectId = this.$route.params.proId;
      this.getListInfo();
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
      getIssueAjax(this.searchform.phase, this.searchform.projectId).then(
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
    Detail(row,type) {
      if (sysEnv == 1) {
        let title = type==="editCase"?"办理任务":"查看";
        let url =
          "/project/index.html#/handleStripes/" + row.id + "/" + this.projectId+'/'+type+"?status="+row.status;
        EcoUtil.getSysvm().openDialog(title, url, 1080 , 500, "12vh");//1540
      } else {
        this.$router.push({
          name: "handleStripes",
          params: {
            Id: row.id,
            proId: this.projectId,
            caseType:type
          },
        });
      }
    },
    // 导出
    exportFun() {
      getDesignExportAjax(this.searchform).then((res) => { 
        if( window.navigator && window.navigator.msSaveOrOpenBlob ) {
          navigator.msSaveBlob(new Blob([res.data],"设计师办理.xlsx"));
        }else{
          let blob = new Blob([res.data], { type: "application/octet-stream" });
          EcoFile.downloadFile(blob, "设计师办理.xlsx");
        }
      });
    },
    // 重新提交
    reSubmit() {
      if (this.multipleSelection.length == 0) {
        this.$message.error("请选择一条任务");
        return;
      }
      let _ids = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        _ids.push(this.multipleSelection[i].id);
      }
      reSubmitAjax(this.projectId, _ids).then((res) => {
        if (res.data) {
          this.$message({
            message: "重新提交成功",
            type: "success",
            duration: 1000,
          });
        }
      });
    },
    listAction() {
      let callBackDialogFunc = function (obj) {
        if (obj.action == "editTaskList") {
          window.designListvm.getListInfo();
        }
      };
      EcoUtil.addCallBackDialogFunc(callBackDialogFunc, "designListvm");
    },
  },
};
</script>

<style scoped>
.designList {
  padding: 0px 15px 20px 15px;
  background-color: #fff;
}
.designList .toolbar {
  margin-top: 10px;
  margin-bottom: 10px;
}
.designList .searchBox {
  font-size: 14px;
  padding: 5px 20px;
  line-height: 28px;
  overflow-y: auto;
  background-color: #fafafa;
}
.designList .itemInput {
  display: inline-block;
  width: 160px;
  margin-right: 10px;
}
.designList .itemInputLong {
  display: inline-block;
  width: 240px;
  margin-right: 10px;
}
.designList .itemInput-short {
  display: inline-block;
  width: 130px;
  margin-right: 10px;
}
.designList .itemInputLLong {
  display: inline-block;
  width: 310px;
  margin-right: 10px;
}
.designList .detailSpan {
  cursor: pointer;
  color: #409eff;
}
</style>
