<template>
  <div class="layoutOutDiv confirm">
    <div class="layoutInnerAbsoluteDiv">
      <eco-content top="0px" height="55px" type="tool" style="border-bottom:1px solid #ddd;background-color:#fff;">
        <el-row style="padding:12px 20px;background-color:#fff;">
          <el-col :span="12">
            <eco-tool-title style="font-weight: 700;line-height: 30px;" :title="'环节统计'"></eco-tool-title>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content top="70px" bottom="0px" type="tool" style="background-color:#fff;">
        <div class="standard" v-loading="loading">
            <div class="clearfix">
                <div class="btn">
                    <el-upload :action="wageaddress" accept=".xlsx" :headers="headers" :file-list="fileList" :on-change="getList" style="display: inline-block;" :show-file-list=false>
                    <!-- <el-button ref="upload" class="export" @click='importWage' style="margin-left: 10px;">导入</el-button> -->
                    </el-upload>
                    <el-button class="export" @click="byExport" style="margin-left: 10px;">导出</el-button>
                </div>
            </div>
            <!-- 表格 -->
            <div class="table">
                <el-table :data="tableData" style="width: 100%" height="100%" stripe :header-cell-style="{background:'##f5f7fa'}" @selection-change="handleSelectionChange">
                    <el-table-column prop="DEPT" label="部门"></el-table-column>
                    <el-table-column prop="DEPT_LIAISON" label="部门联络人"></el-table-column>
                    <el-table-column prop="TASK01" label="科技创新部编制发起" width="130"></el-table-column>
                    <el-table-column prop="TASK02" label="部门联络员校对" width="130"></el-table-column>
                    <el-table-column prop="TASK03" label="业务科室联络员指定责任人" width="170"></el-table-column>
                    <el-table-column prop="TASK04" label="责任人办理"></el-table-column>
                    <el-table-column prop="TASK05" label="业务部门科长审核" width="130"></el-table-column>
                    <el-table-column prop="TASK06" label="部门联络员审核" width="130"></el-table-column>
                    <el-table-column prop="TASK07" label="标准审查人员审核" width="130"></el-table-column>
                    <el-table-column prop="TASK08" label="业务部门部长审核" width="130"></el-table-column>
                    <el-table-column prop="TASK09" label="分标委审核"></el-table-column>
                    <el-table-column prop="TASK10" label="科技创新部发起" width="130"></el-table-column>
                    <el-table-column prop="TASK11" label="标准法规室科长审核" width="130"></el-table-column>
                    <el-table-column prop="TASK12" label="科技创新部部长审核" width="130"></el-table-column>
                    <el-table-column prop="TASK13" label="标准法规室科长发起" width="130"></el-table-column>
                    <el-table-column prop="TASK14" label="科技创新部部长二次审核" width="160"></el-table-column>
                    <el-table-column prop="TASK15" label="中心标委会议长审核" width="130"></el-table-column>
                    <el-table-column prop="END" label="完成"></el-table-column>
                    <el-table-column prop="TOTAL" label="总计"></el-table-column>
                </el-table>
            </div>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.page" :page-sizes="[10, 20, 30, 40]" :page-size="form.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
      </eco-content>
    </div>
  </div>
</template>
<script>
import { EcoUtil } from "@/components/util/main.js";
import { EcoFile } from "@/components/file/main.js";
import ecoContent from "@/components/pageAb/ecoContent.vue";
import ecoToolTitle from "@/components/tool/ecoToolTitle.vue";
import { sysEnv } from "@/modulesExtend/automotive/standardPlanning/config/env";
import {
  getLinkStatistics,
  exportLinkStatistics
} from "../service/service.js";
export default {
  components: {
    ecoContent,
    ecoToolTitle
  },
  data() {
    return {
        tableData: [],
        loading: false,
        // 上传工资文件地址
        wageaddress: "",
        // 上传文件列表
        fileList: [],
        headers: {
            ["eco-auth-token"]: sessionStorage.getItem("ecoToken"),
        },
        form: {
            page: 1,
            rows: 10,
        },
        total: 0,
    };
  },
  created() {
      this.getList()
  },
  methods: {
    getList() {
        getLinkStatistics(this.form).then(res => {
            this.tableData = res.data.rows
            this.total = res.data.total
        })
    },
    // 页码改变
    handleCurrentChange(val) {
      this.form.page = val;
      this.getList();
    },
    handleSelectionChange(val) {
    },
    // 条数改变
    handleSizeChange(val) {
      this.form.rows = val;
      this.getList();
    },
    // 导入
    importWage() {
      this.wageaddress = orgExcelImport();
    },
    // 上传文件成功的时候
    handleChange(response) {
      if (response.success) {
        this.$message({
          message: "上传成功",
          type: "success",
        });
        // this.getList();
      } else {
        let errmsg = response.msgDesc;
        this.$message.error(errmsg);
      }
    },
    // 导出
    byExport() {
      exportLinkStatistics(this.form).then((res) => {
        var blob = new Blob([res.data], { type: "application/octet-stream" });
        EcoFile.downloadFile(blob, "环节统计.xlsx");
      });
    },
  },
};
</script>
<style scoped>
.standard {
  height: 100%;
}
.deptConfirmation {
  height: 100%;
}
.officeConfim {
  height: 100%;
}
.personConfirm {
  height: 100%;
}
.chiefReview {
  height: 100%;
}
.deptLiaison {
  height: 100%;
}
.table {
  height: 100%;
}
.standard .btn {
  float: right;
  margin-right: 20px;
  margin-bottom: 20px;
}
.standard .search {
  background-color: #f5f5f5;
  /* height: 160px; */
  padding-top: 10px;
  padding-right: 10px;
}
.standard .table {
  padding: 20px 20px 0 20px;
  height: 85%;
}
.el-pagination {
  float: right;
}
</style>
<style>
.standard .el-button--primary.is-plain {
  background-color: white;
}
.standard .export {
  color: #409eff;
  border: 1px solid #409eff;
}
.standard .el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 10px;
}
.standard .export:focus {
  outline: none;
  box-shadow: none;
  background-color: transparent;
}
.standard .el-pagination {
  float: right;
  margin-right: 10px !important;
}
.setting .el-form-item__content {
  margin-left: 50px !important;
}

</style>
