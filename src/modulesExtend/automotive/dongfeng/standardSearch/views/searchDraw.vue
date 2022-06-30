<template>
<div class="searchDraw">
    <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
    <div class="header">
        <div class="left">
            <i></i>
            <span>标准引用图纸查询</span>
        </div>
        <div class="right">
            <el-button type="primary" size="mini" @click="searchShow=(!searchShow)">高级查询</el-button>
            <el-button type='primary' size='mini' @click="exportCase">导出</el-button>
        </div>
    </div>
    <div class="header-input" v-show="searchShow">
        <el-form ref="form" :model="form" style="font-size:12px" label-width="65px">
            <el-row>
                <el-col>
                    <el-form-item label="标准编号:">
                        <el-input v-model="form1.standardCode" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="标准名称:">
                        <el-input v-model="form1.standardName" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="分标委:">
                        <el-select v-model="form1.subcommittee" placeholder="请选择">
                            <el-option v-for="item in subcommitteeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="部门:">
                        <tag-select style="min-width:130px;max-width:300px;vertical-align: top;" initDataStr="" ref='selectDept' :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'dept')}">
                        </tag-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="标准分类:">
                        <el-select v-model="form1.stdCategory" placeholder="请选择">
                            <el-option v-for="item in stdCategoryList" :key="item.id" :label="item.text" :value="item.id" @click.native="changeStdCategory(item)"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="标准类型:">
                        <el-select v-model="form1.stdType" placeholder="请选择">
                            <el-option v-for="item in stdTypeList" :key="item.id" :label="item.text" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="数据来源:">
                        <el-select v-model="form1.planSource" placeholder="请选择">
                            <el-option v-for="item in sourceList" :key="item.id" :label="item.text" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="科室:">
                        <tag-select style="width:130px;vertical-align: top;" initDataStr="" ref='selectDffice' :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'office')}">
                        </tag-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="图纸编号:">
                        <el-input v-model="form1.drawNum" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="图纸名称:">
                        <el-input v-model="form1.drawName" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="责任人:">
                        <tag-select ref='selectResponsibleUser' initDataStr="" style="width:130px;vertical-align: top;" :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data,'responsibleUser')}">
                        </tag-select>
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
        <el-table :data="drawList" border style="width:100%;font-size:12px" height="100%" ref="outsideTable" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40" align="center"></el-table-column>
            <el-table-column prop="" label="序号" width="50" align="center" type="index" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="standardCode" label="标准编号" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="standardName" label="标准名称" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="drawNum" label="图纸编号" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="drawName" label="图纸名称" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="stdCategoryName" label="标准分类" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="stdTypeName" label="标准类型" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="deptName" label="部门" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="officeName" label="科室" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="responsibleUserName" label="责任人" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="subcommitteeName" label="分标委" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="planSourceName" label="数据来源" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="" label="操作" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-link type="primary" style="font-size:12px;" @click.native="goDetali(scope.row)">查看</el-link>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="footer">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="info.page" :page-sizes="[30, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</div>
</template>

<script>
import { sysEnv } from '../config/env.js'
import { EcoFile } from '@/components/file/main.js'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import { EcoUtil } from '@/components/util/main.js'
import { getStarchDraw, getStdCategory, getSource, getSubcommittee } from '../api/standardSearch'
import tagSelect from '@/components/orgPick/tagSelect.vue'
export default {
    data() {
        return {
            form: {},
            form2: {},
            form1: {
                standardCode: '', //标准编号
                standardName: '', //标准名称
                drawNum: '', //图纸编号
                drawName: '', //图纸名称
                stdCategory: '', //标准分类
                stdType: '', //标准类型
                responsibleUser: '', //责任人，科室中的具体负责人，用户id
                dept: '', //部门，组织架构id
                office: '', // 科室，组织架构id
                subcommittee: '', // 分标委
                planSource: '', // 	数据来源
            },
            drawList: [],
            info: {
                page: 1,
                rows: 30,
                sort: 'createDate',
                order: 'desc',
            },
            total: 10,
            multipleSelection: [],
            searchShow: false,
            stdCategoryList: [],
            stdTypeList: [],
            sourceList: [],
            subcommitteeList: [],
        }
    },
    components: {
        tagSelect,
        ecoLoading
    },
    created() {
        this.getDrawList()
        this.getSourceList()
        this.getSubcommittee()
        this.getStdCategory('esProgramClass')
    },
    methods: {
        getDrawList() {
            getStarchDraw(this.info, this.form2).then(res => {
                console.log(res)
                this.drawList = res.rows
                this.total = res.total
            })
        },
        //标准分类
        getStdCategory(parentId) {
            getStdCategory(parentId).then(res => {
                this.stdCategoryList = res
                // console.log(res)
            })
        },
        //标准类型
        changeStdCategory(data) {
            // console.log(data)
            this.stdTypeList = []
            this.form.stdType = ''
            getStdCategory(data.id).then(res => {
                this.stdTypeList = res
                // console.log(res)
            })
        },
        //数据来源
        getSourceList() {
            getSource().then(res => {
                // console.log(res)
                this.sourceList = res
            })
        },
        //分标委
        getSubcommittee() {
            getSubcommittee().then(res => {
                // console.log(res)
                this.subcommitteeList = res.rows
            })
        },
        selectRoleUser(data, type) {
            //选择人
            if (!data.id && data.itemArray.length === 0) {
                //人员删除
                if (type === 'responsibleUser') {
                    this.form1.responsibleUser = '';
                }
            } else {
                if (type === 'responsibleUser') {
                    this.form1.responsibleUser = data.itemArray[0].linkId;
                }
            }
        },
        selectRoleDept(data, type) {
            //责任部门
            if (!data.id && data.itemArray.length === 0) {
                if (type === 'dept') {
                    this.form1.dept = '';
                } else if (type === 'office') {
                    this.form1.office = '';
                }
            } else {
                if (type === 'dept') {
                    this.form1.dept = data.orgId;
                } else if (type === 'office') {
                    this.form1.office = data.orgId;
                }
            }
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
            this.info.page = 1
            this.getDrawList()
        },
        goReset() {

            this.$refs.selectResponsibleUser.initDataStrFunc();
            this.$refs.selectDept.initDataStrFunc();
            this.$refs.selectDffice.initDataStrFunc();

            this.form1.standardCode = ''
            this.form1.standardName = ''
            this.form1.drawNum = ''
            this.form1.drawName = ''
            this.form1.stdCategory = ''
            this.form1.stdType = ''
            this.form1.responsibleUser = ''
            this.form1.dept = ''
            this.form1.office = ''
            this.form1.subcommittee = ''
            this.form1.planSource = ''

            this.form2 = {}
            this.info.page = 1
            this.info.rows = 30
            this.getDrawList()
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
                EcoFile.downloadFile(blob, "业务指南计划.xls");
            }).catch(() => {
                this.$refs.refLoading.close();
            })
        },
        goDetali(item) {
            console.log(item)
            EcoFile.openFileHeaderByView(item.fileHeaderId, item.fileName);
        },
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.info.rows = val
            this.getDrawList()
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.info.page = val
            this.getDrawList()
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
    }
}
</script>

<style lang="less" scoped>
.searchDraw {
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

    .header-input {
        width: 100%;
        height: 200px;
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
        width: 220px;
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

    /deep/ .el-range-editor--mini.el-input__inner {
        width: 200px;
    }

    /deep/ .el-customDiv {
        line-height: 28px;
        min-height: 28px;
        border-radius: 4px;
        border: 1px solid #DCDFE6;
    }

}
</style>
