<template>
  <div class="quality">
    <el-table ref="quality" @selection-change="handleSelectionChange" highlight-current-row stripe :data='tableData' header-row-class-name='tableHeader' border tooltip-effect='dark'>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type='index' label='序号'></el-table-column>
      <el-table-column show-overflow-tooltip label='问题编号' prop='problemNo'></el-table-column>
      <el-table-column label='问题名称' prop='problemName'></el-table-column>
      <el-table-column show-overflow-tooltip label='问题描述' prop='problemDescription'></el-table-column>
      <el-table-column label='责任部门' prop='responsibleDeptName'></el-table-column>
      <el-table-column label='制修订状态' prop='revisionStatus'></el-table-column>
      <el-table-column label='标准名称' prop='standardName'></el-table-column>
      <el-table-column label='责任人' prop='responsibleName'></el-table-column>
      <el-table-column label='操作' fixed='right' align='center' width='100'>
        <template slot-scope='scope'>
          <el-button type='text' @click.stop='editCase(scope.row,"viewCase")'>查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="btn">
      <el-button type="primary" @click="saveInfo">保 存</el-button>
      <el-button @click="onClose">取 消</el-button>
    </div>
  </div>
</template>
<script>
import { EcoUtil } from "@/components/util/main.js";
import { sysEnv } from "@/modulesExtend/automotive/standardPlanning/config/env";
import { mapMutations, mapActions, mapState } from "vuex";
import {
  problemList,
  getUserInfoByOrgId,
  getOrgsMemberByIds,
} from "../../service/service.js";
export default {
  data() {
    return {
      tableData: [],
      checkInfo: [],
      // _storeKey: "",
    };
  },
  computed: {
    ...mapState(["revisionTypeList"]),
  },
  created() {
    this.setRevisiontype();
    this.getListInfo();
    // this._storeKey = this.$route.params.key;
  },
  methods: {
    ...mapActions(["setRevisiontype"]),
    getListInfo() {
      problemList().then((res) => {
        res.data.rows.forEach((item, index) => {
          item.responsibleName = "";
          item.responsibleDeptName = "";
          if (item.revisionStatus) {
            this.revisionTypeList.forEach((item2) => {
              if (item2.id == item.revisionStatus) {
                item.revisionStatus = item2.text;
              }
            });
          }
          getUserInfoByOrgId(item.responsible).then((userRes) => {
            item.responsibleName = userRes.data.mi;
          });
          getOrgsMemberByIds([
            {
              type: "DEPT",
              orgId: item.responsibleDept,
              linkId: item.responsibleDept,
            },
          ]).then((deptRes) => {
            item.responsibleDeptName = deptRes.data[0];
          });
        });
        this.tableData = res.data.rows;
        // let _storeData = EcoUtil.objDeepCopy(
        //   EcoUtil.getSysvm().getTempStore(this._storeKey)
        // );
        // let SelectArr = [];
        // for (let i of _storeData.keys()) {
        //   for (let j of this.tableData.keys()) {
        //     if (_storeData[i].id == this.tableData[j].id) {
        //       SelectArr.push(this.tableData[j]);
        //     }
        //   }
        // }
        // SelectArr.forEach((row) => {
        //   this.$refs.quality.toggleRowSelection(row);
        // });
        // console.log(this.checkInfo);
        // EcoUtil.getSysvm().deleteTempStore(this._storeKey);
      });
    },
    saveInfo() {
      let dataArr = [];
      for (let i of this.checkInfo.keys()) {
        dataArr[i] = {};
        dataArr[i].problemNo = this.checkInfo[i].problemNo;
        dataArr[i].id = this.checkInfo[i].id;
      }
      let doObj = {};
      doObj.action = "quality";
      doObj.close = true;
      doObj.data = dataArr;
      EcoUtil.getSysvm().callBackDialogFunc(doObj);
    },
    onClose() {
      EcoUtil.getSysvm().closeDialog();
    },
    editCase(row, type) {
      if (sysEnv !== 1) {
        this.$router.push({
          name: "questionDetails",
          params: { id: row.id, caseType: "viewCase" },
        });
      } else {
        let _width = "800";
        let _height = "600";
        let url;
        let dialogTitle;
        if (type === "viewCase") {
          url =
            "/standardPlanning/index.html#/questionDetails/" +
            row.id +
            "/viewCase";
          dialogTitle = "查看";
          _height = "500";
        }
        EcoUtil.getSysvm().openDialog(
          dialogTitle,
          url,
          _width,
          _height,
          "15vh"
        );
      }
    },
    handleSelectionChange(val) {
      this.checkInfo = val;
      // console.log(val)
    },
  },
};
</script>
<style scoped>
.quality .btn {
  text-align: right;
  margin: 20px 10px;
}
.quality {
  margin: 10px 20px;
}
</style>
