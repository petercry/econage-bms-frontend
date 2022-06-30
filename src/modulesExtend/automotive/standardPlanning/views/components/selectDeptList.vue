<template>
    <div>
        <div class="table">
            <el-table :data="tableData" style="width: 100%" height="100%" stripe :header-cell-style="{background:'##f5f7fa'}">
                <el-table-column type="index" label="序号" width="80"></el-table-column>
                <el-table-column prop="userName" label="人员"></el-table-column>
                <el-table-column prop="deptName" label="部门"></el-table-column>
            </el-table>
            <div class="btn">
                <el-button type="primary" @click="saveTable">确 定</el-button>
                <el-button @click="onClose">取 消</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import {
  getTranslateInfo,
  issueAjax,
  haveAjax,
  needAjax
} from "../../service/service.js";
import { EcoUtil } from "@/components/util/main.js";
export default {
    name:"",
    data() {
        return {
            tableData: [],
            currendIds: null,
            status: '',
            haveInfo: null,
            needAchieve: null
        }
    },
    created() {
        this.getList(this.$route.params.ids)
        this.currendIds = this.$route.params.ids
        this.status = this.$route.params.status
    },
    mounted() {

    },
    methods: {
        getList(data) {
            getTranslateInfo(data).then(res => {
                if (res.data) {
                    this.tableData = res.data.rows
                }
            })
        },
        saveTable() {
            this.tableData.forEach(x => {
                if(x.userName) {
                    this.issueAjax()
                } else {
                    this.$message.warning("无人员不可下发")
                }
            })
        },
        onClose() {
            EcoUtil.getSysvm().closeDialog();
        },
        issueAjax() {
            if (this.status == 'TECH_INNOVATION_DEPT_CREATE') {
                issueAjax(this.status,this.currendIds).then((res) => {
                    if (res.data.success) {
                        this.$message({
                            message: "下发成功",
                            type: "success",
                        });
                        let doObj = {};
                        doObj.action = "issuePage";
                        doObj.close = true;
                        EcoUtil.getSysvm().callBackDialogFunc(doObj);
                    }
                }).catch(e=>{
                    this.$message.warning("当前状态不可用")
                })
            } else {
                haveAjax(this.status).then((res) => {
                    this.haveInfo = res.data.data;
                    needAjax(this.status).then((res) => {
                    this.needAchieve = res.data.data;
                    // if (this.needAchieve != 0) {
                        if (this.haveInfo == this.needAchieve) {
                            issueAjax(this.status,this.currendIds).then((res) => {
                                if (res.data.success) {
                                    this.$message({
                                        message: "下发成功",
                                        type: "success",
                                    });
                                    let doObj = {};
                                    doObj.action = "issuePage";
                                    doObj.close = true;
                                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
                                }
                                this.getList();
                            });
                        } else {
                        this.$message.error("当前拥有条数未达到需达到条数不可下发！");
                        }
                    // } else {
                    //     this.$message({
                    //     message: "当前无下发规划",
                    //     type: "warning",
                    //     });
                    // }
                    });
                });
            }
        }
    }
}
</script>
<style scoped>
/* @import url(); 引入css类 */
.table {
    position: fixed;
    top: 20px;
    bottom: 80px;
    left: 20px;
    right: 20px;
}
.btn {
    /* margin-top: 25px;
    float: right; */
    position: fixed;
    bottom: 20px;
    right: 20px;
}
</style>
