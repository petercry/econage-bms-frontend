<template>
<div class="standardDirectorySearch">
    <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
    <div class="header">
        <div class="left">
            <i></i>
            <span>标准目录查询</span>
        </div>
        <div class="right">
            <el-button type="primary" size="mini" @click="searchShow=(!searchShow)">高级查询</el-button>
            <el-button type='primary' size='mini' @click="exportCase">导出</el-button>
        </div>
    </div>
    <div class="header-input" v-show="searchShow">
        <el-form ref="form" :model="form" style="font-size:12px">
            <el-row style="display:flex;justify-content: center;">
                <el-col style="width:320px">
                    <el-form-item label="上传日期:">
                        <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="publishTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="查询类别:">
                        <el-select v-model="form1.category" placeholder="请选择">
                            <el-option label="大类" value="大类"></el-option>
                            <el-option label="小类" value="小类"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-button type="primary" size="mini" @click="goSelect">查询</el-button>
                    <el-button type="primary" size="mini" @click="goReset">重置</el-button>
                </el-col>
            </el-row>
        </el-form>
    </div>
    <div style="width:600px;height:600px;margin:20px auto;">
        <el-descriptions :column="1" border>
            <el-descriptions-item label="类别名称" :contentStyle="{'background': '#f5f7fa','color':'#000'}">现有标准数</el-descriptions-item>
            <el-descriptions-item :label="item.typeName" :contentStyle="{'color':'#3333ff'}" v-for="(item,index) in DirList" :key="index">{{item.count}}</el-descriptions-item>
        </el-descriptions>
    </div>
</div>
</template>

<script>
import { getSearchDir, getDirectoryExport } from '../../api/report'
import { EcoFile } from '@/components/file/main.js'
import ecoLoading from '@/components/loading/ecoLoading.vue'
export default {
    data() {
        return {
            form: {},
            form2: {},
            form1: {
                category: '', //类别
                publishStartDate: '', //上传日期-开始
                publishEndDate: '', //上传日期-结束
            },
            searchShow: true,
            publishTime: [],
            DirList: [],
            getCategory: []
        }
    },
    components: {
        ecoLoading
    },
    mounted() {
        this.getSearchDirList()
    },
    methods: {
        getSearchDirList() {
            getSearchDir(this.form2).then(res => {
                console.log(res)
                this.DirList = res
            })
        },
        exportCase() {
            let form2 = {}
            if (this.publishTime) {
                this.form1.publishStartDate = this.publishTime[0]
                this.form1.publishEndDate = this.publishTime[1]
            } else {
                this.form1.publishStartDate = ''
                this.form1.publishEndDate = ''
            }
            if (this.form1) {
                for (const value in this.form1) {
                    if (this.form1[value]) {
                        form2[value] = this.form1[value]
                    }
                }
            } else {
                form2 = ''
            }
            this.$refs.refLoading.open();
            getDirectoryExport(form2).then(res => {
                // console.log(res)
                this.$refs.refLoading.close();
                let blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
                EcoFile.downloadFile(blob, "标准目录.xls");
            }).catch(() => {
                this.$refs.refLoading.close();
            })
        },
        goSelect() {
            if (this.publishTime) {
                this.form1.publishStartDate = this.publishTime[0]
                this.form1.publishEndDate = this.publishTime[1]
            } else {
                this.form1.publishStartDate = ''
                this.form1.publishEndDate = ''
            }
            if (this.form1) {
                for (const value in this.form1) {
                    if (this.form1[value]) {
                        this.form2[value] = this.form1[value]
                    }
                }
            } else {
                this.form2 = ''
            }
            this.getSearchDirList()
        },
        goReset() {
            this.form1.category = ''
            this.form1.publishStartDate = ''
            this.form1.publishEndDate = ''
            this.form2 = {}

            this.getSearchDirList()
        }
    }
}
</script>

<style lang="less" scoped>
.standardDirectorySearch {
    width: 100%;
    height: 100vh;
    // padding-left: 20px;
    // padding-right: 20px;
    box-sizing: border-box;

    /deep/ .el-col {
        width: 280px;
    }

    /deep/ .el-date-editor {
        width: 210px;
    }

    .header {
        width: 100%;
        height: 50px;
        padding-left: 20px;
        padding-right: 20px;
        box-sizing: border-box;
        line-height: 50px;
        border-left: 1px solid rgb(221, 221, 221);
        border-right: 1px solid rgb(221, 221, 221);
        border-bottom: 1px solid rgb(221, 221, 221);
        display: flex;
        justify-content: space-between;
        align-items: center;

        .left {
            display: flex;
            align-items: center;

            i {
                width: 5px;
                height: 16px;
                line-height: 16px;
                background: #409eff;
                margin-right: 5px;
            }
        }
    }

    .header-input {
        width: 100%;
        height: 50px;
        padding-left: 20px;
        padding-top: 10px;
        box-sizing: border-box;
        border-left: 1px solid rgb(221, 221, 221);
        border-right: 1px solid rgb(221, 221, 221);
        border-bottom: 1px solid rgb(221, 221, 221);

        /deep/ .el-form-item__label {
            font-size: 12px;
        }
    }

    /deep/ .el-descriptions-item__label {
        background-color: #f5f7fa;
        color: #000;
    }
}
</style>
