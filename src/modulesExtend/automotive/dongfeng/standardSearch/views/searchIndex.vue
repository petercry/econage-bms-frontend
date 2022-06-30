<template>
<div class="searchIndex">
    <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
    <div class="header">
        <div class="left">
            <i></i>
            <span>标准根目录查询</span>
        </div>
        <div class="right">
            <el-button type="primary" size="mini" @click="searchShow=(!searchShow)">高级查询</el-button>
            <el-button type='primary' size='mini' @click="exportCase">导出</el-button>
        </div>
    </div>
    <div class="content-center">
        <el-scrollbar>
            <div class="left-tree">
                <el-tree :data="searchTree" :props="defaultProps" @node-click="handleNodeClick" style="width:100%"></el-tree>
            </div>
        </el-scrollbar>
        <div class="right-content">
            <div class="header-input" v-show="searchShow">
                <el-form ref="form" :model="form" style="font-size:12px">
                    <el-row>
                        <el-col style="width:500px">
                            <el-form-item label="模糊查询:">
                                <el-input v-model="form1.fullText"  style="width:380px"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <el-form-item label="标准编号:">
                                <el-input v-model="form1.stdCode" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col>
                            <el-form-item label="标准名称:">
                                <el-input v-model="form1.stdName" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col>
                            <el-button type="primary" size="mini" @click="goSelect">查询</el-button>
                            <el-button type="primary" size="mini" @click="goReset">重置</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="content">
                <el-table :data="searchList" border style="width:100%;font-size:12px" height="100%" ref="outsideTable" @selection-change="handleSelectionChange">
                    <!-- <el-table-column type="selection" width="40" align="center"></el-table-column> -->
                    <el-table-column prop="" label="序号" width="50" align="center">
                        <template slot-scope="scope">
                            <span>{{scope.$index +1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="stdCode" label="标准编号" align="center"></el-table-column>
                    <el-table-column prop="stdName" label="标准名称" align="center"></el-table-column>
                    <el-table-column prop="effectivenessName" label="有效性" align="center"></el-table-column>
                    <el-table-column prop="readCount" label="点击次数" align="center"></el-table-column>
                    <el-table-column prop="" label="操作" align="center">
                        <template slot-scope='scope'>
                            <el-link type="primary" @click.native="goDetali(scope.row)">查看文本</el-link>
                        </template>
                    </el-table-column>

                </el-table>
            </div>
            <div class="footer">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="info.page" :page-sizes="[30, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { sysEnv } from '../config/env.js'
import { EcoFile } from '@/components/file/main.js'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import { EcoUtil } from '@/components/util/main.js'
import { searchTree, getExport, searchList } from "../api/standardSearch.js";
import tagSelect from '@/components/orgPick/tagSelect.vue'
export default {
    data() {
        return {
            form: {},
            form2: {},
            form1: {
                fullText: '',
                stdCode: '', //标准编号
                stdName: '', //标准名称
            },
            searchList: [],
            info: {
                page: 1,
                rows: 30,
                sort: 'createDate',
                order: 'desc',
            },
            total: 10,
            searchShow: true,
            searchTree: [],
            parentId: '',
            defaultProps: {
                children: 'children',
                label: 'name'
            }
        }
    },
    components: {
        tagSelect,
        ecoLoading
    },
    created() {
        this.getSearchList()
        this.getSearchTree()
    },
    methods: {
        getSearchTree() {
            searchTree().then(res => {
                // console.log(res)
                this.searchTree = [res]
            })
        },
        getSearchList() {
            searchList(this.info, this.form2, this.parentId).then(res => {
                // console.log(res)
                this.searchList = res.rows
                this.total = res.total
            })
        },
        goSelect() {
            if (this.form1) {
                for (const value in this.form1) {
                    if (this.form1[value]) {
                        this.form2[value] = this.form1[value]
                    }
                }
            } else {
                this.form2 = {}
            }
            this.getSearchList()
        },
        goReset() {
            this.form1.fullText = ''
            this.form1.stdCode = ''
            this.form1.stdName = ''
            this.parentId = ''
            this.form2 = {}
            this.getSearchList()
        },
        //导出 
        exportCase() {
            let form2 = {}
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
            getExport(form2).then(res => {
                // console.log(res)
                this.$refs.refLoading.close();
                let blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
                EcoFile.downloadFile(blob, "标准查询.xls");
            }).catch(() => {
                this.$refs.refLoading.close();
            })
        },
        goDetali(item) {
            if (sysEnv === 0) {
                // let _width = '900'
                // let _height = '600'
                // let url = window.location.origin + '/#' + '/searchDetail/' + item.id
                // EcoUtil.getSysvm().openDialog('编辑知识库', url, _width, _height, '8vh')
                this.$router.push('/searchDetail/' + item.id)
            } else {
                let _width = '900'
                let _height = '600'
                let url = '/standardSearch/index.html#/searchDetail/' + item.id
                EcoUtil.getSysvm().openDialog('标准文档详情', url, _width, _height, '8vh')
            }
        },
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.info.rows = val
            this.getSearchList()

        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.info.page = val
            this.getSearchList()
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleNodeClick(node) {
            this.parentId = node.id
            this.getSearchList()
        }
    }
}
</script>

<style lang="less" scoped>
.searchIndex {
    width: 100%;
    height: 100vh;
    // padding-left: 20px;
    // padding-right: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;

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

    .content-center {
        width: 100%;
        flex: 1;
        display: flex;
        overflow: hidden;

        .left-tree {
            width: 250px;
            height: 100%;

        }

        .right-content {
            flex: 1;
            display: flex;
            height: 100%;
            flex-direction: column;

            .header-input {
                width: 100%;
                height: 150px;
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

            .content {
                width: 100%;
                height: 100%;
                // flex: 1;
                overflow: hidden;
                padding-left: 20px;
                padding-right: 20px;
                padding-top: 10px;
                border-left: 1px solid rgb(221, 221, 221);
                border-right: 1px solid rgb(221, 221, 221);
                border-bottom: 1px solid rgb(221, 221, 221);

                box-sizing: border-box;
            }
        }
    }

    .footer {
        width: 100%;
        height: 50px;
        text-align: right;
        background-color: rgb(248, 249, 251);
        padding-top: 5px;
        box-sizing: border-box;
        padding-right: 50px;

        /deep/ .el-pagination__jump .el-input--mini {
            width: 50px;
        }
    }

    /deep/ .el-table__row:nth-of-type(even) {
        background: #f5f7fa;
    }

    /deep/ .el-col {
        width: 250px;
    }

    /deep/ .el-table th {
        font-weight: 600;
        background: #f5f7fa;
    }

    /deep/ .el-table--border:after,
    /deep/ .el-table--group:after,
    /deep/ .el-table:before {
        background-color: #f5f7fa;
    }

    /deep/ .el-table--border,
    /deep/ .el-table--group {
        border-color: #f5f7fa;
    }

    /deep/ .el-table--border {
        border: 1px solid #ebeef5;
    }

    /deep/ .el-table td,
    /deep/ .el-table th.is-leaf {
        border-bottom: 1px solid #ebeef5;
        color: #4f334f;
        font-size: 12px;
    }

    /deep/ .el-table--border th,
    /deep/ .el-table--border th.gutter:last-of-type {
        border-bottom: 1px solid #ebeef5;
    }

    /deep/ .el-table--border td,
    /deep/ .el-table--border th {
        border-right: 1px solid #ebeef5;
    }

    /deep/ .el-input {
        width: 130px;
        height: 28px;
    }

    /deep/ .el-date-editor {
        width: 210px;
    }

    /deep/ .el-customDiv {
        line-height: 28px;
        min-height: 28px;
        border-radius: 4px;
        border: 1px solid #DCDFE6;
    }

    /deep/ .el-customDiv .placeholder {
        position: relative !important;
        color: #ccc;
    }

    /deep/ .el-range-editor--mini.el-input__inner {
        width: 200px;
    }
}
</style>
