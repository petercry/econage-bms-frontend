<template>
  <div class="quality">
    <div class="content">
        <el-table ref="quality" height='100%' @selection-change="handleSelectionChange" highlight-current-row stripe :data='tableData'class='qualityTable' header-row-class-name='tableHeader' border tooltip-effect='dark'>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type='index' label='序号'></el-table-column>
          <el-table-column show-overflow-tooltip label='问题编号' prop='problemNo'></el-table-column>
          <el-table-column label='问题名称' prop='problemName' width='200'></el-table-column>
          <el-table-column show-overflow-tooltip label='问题描述' prop='problemDescription'></el-table-column>
          <el-table-column label='责任部门' prop='responsibleDeptName'></el-table-column>
          <el-table-column label='制修订状态' prop='revisionStatus'></el-table-column>
          <el-table-column label='标准名称' prop='standardName'></el-table-column>
          <el-table-column label='责任人' prop='responsibleName'></el-table-column>
        </el-table>
    </div>
    <div class="btn">
      <el-button type="primary" @click="saveInfo" size='small'>确 定</el-button>
      <el-button @click="onClose" size='small'>取 消</el-button>
    </div>
  </div>
</template>
<script>
import { EcoUtil } from "@/components/util/main.js";
import { sysEnv } from "@/modulesExtend/automotive/standardPlanning/config/env";
import {mapState} from 'vuex'
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
    };
  },
  computed: {
     ...mapState(['editType'])
  },
  created() {
    this.getListInfo();
  },
  methods: {
    getListInfo() {
      problemList().then((res) => {
        res.data.rows.forEach((item, index) => {
          item.responsibleName = "";
          item.responsibleDeptName = "";
          if (item.revisionStatus) {
               this.editType.forEach(item2 => {
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
      });
    },
    saveInfo() {
      if(this.checkInfo.length==0){
         this.$message.warning('请至少选择一条数据!');
         return;
      }
      let sourceNumberList = [];
      let sourceNumberItems = [];
      this.checkInfo.forEach(item=>{
        sourceNumberList.push(item.problemNo);
        sourceNumberItems.push(item.id);
      })
      let doObj = {};
      doObj.action = "selectQuality";
      doObj.close = true;
      doObj.data = {
        sourceNumberList,
        sourceNumberItems
      };
      EcoUtil.getSysvm().callBackDialogFunc(doObj);
    },
    onClose() {
      EcoUtil.getSysvm().closeDialog();
    },
    handleSelectionChange(val) {
      this.checkInfo = val;
    },
  },
};
</script>
<style scoped>

.quality {
   position: absolute;
   left:0px;
   right:0px;
   top:0px;
   bottom:0px;
}
.quality .content{
  position: absolute;
  top:0px;
  bottom:60px;
  width:100%
}
.quality .btn {
  position: absolute;
  bottom:10px;
  text-align: right;
  width:100%
}
</style>