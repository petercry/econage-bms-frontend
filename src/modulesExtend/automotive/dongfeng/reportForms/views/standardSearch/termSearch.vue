<template>
<div class="termSearch">
    <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
    <div class="header">
        <div class="left">
            <i></i>
            <span>术语查询</span>
        </div>
        <div class="right">
            <el-button type="primary" size="mini" @click="searchShow=(!searchShow)">高级查询</el-button>
            <el-button type='primary' size='mini' @click="exportCase">导出</el-button>
        </div>
    </div>
    <div class="header-input" v-show="searchShow">
        <el-form ref="form" :model="form" style="font-size:12px">
            <el-row style="display:flex;justify-content: center;">
                <el-col>
                    <el-form-item label="查询类别:">
                        <el-select v-model="form.typeId" placeholder="请选择">
                            <el-option :label="item.text" :value="item.id" v-for="item in technicalList" :key="item.id"></el-option>
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
            <el-descriptions-item label="类别" :contentStyle="{'background': '#f5f7fa','color':'#000'}">数量</el-descriptions-item>
            <el-descriptions-item :label="item.typeName" :contentStyle="{'color':'#3333ff'}" v-for="(item,index) in termList" :key="index">{{item.count}}</el-descriptions-item>
            <!-- <el-descriptions-item label="管理类" :contentStyle="{'color':'#3333ff'}">6216</el-descriptions-item>
            <el-descriptions-item label="党工团类" :contentStyle="{'color':'#3333ff'}">6216</el-descriptions-item> -->
        </el-descriptions>
    </div>
</div>
</template>

<script>
import { getStandQuery, getTechnical, getTermExport } from '../../api/report'
import { EcoFile } from '@/components/file/main.js'
import ecoLoading from '@/components/loading/ecoLoading.vue'
export default {
    data() {
        return {
            form: {
                typeId: ''
            },
            searchShow: true,
            termList: [],
            technicalList: []

        }
    },
    mounted() {
        this.getStandQuery()
        this.getTechnical()
    },
    components: {
        ecoLoading
    },
    methods: {
        getStandQuery() {
            getStandQuery(this.form.typeId).then(res => {
                // console.log(res)
                this.termList = res
            })
        },
        //技术类、管理类
        getTechnical() {
            getTechnical('JS0001').then(res => {
                // console.log(res)
                this.technicalList.push(...res)
            })
            getTechnical('GL0002').then(res => {
                // console.log(res)
                this.technicalList.push(...res)
            })
            // console.log(this.technicalList)
        },
        exportCase() {
            this.$refs.refLoading.open();
            getTermExport(this.form).then(res => {
                // console.log(res)
                this.$refs.refLoading.close();
                let blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
                EcoFile.downloadFile(blob, "术语统计.xls");
            }).catch(() => {
                this.$refs.refLoading.close();
            })
        },
        goSelect() {
            this.getStandQuery()
        },
        goReset() {
            this.form.typeId = ''
            this.getStandQuery()
        }
    }
}
</script>

<style lang="less" scoped>
.termSearch {
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
