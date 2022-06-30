<template>
<div class="itemCheckList">
    <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
    <div class="header">
        <div class="left">
            <i></i>
            <span>项目点检清单</span>
        </div>
        <div class="right">
            <el-button type="primary" size="mini" @click="searchShow=(!searchShow)">高级查询</el-button>
            <el-button type='primary' size='mini' @click="exportCase">导出</el-button>
        </div>
    </div>
    <div class="header-input" v-show="searchShow">
        <el-form ref="form" :model="form" style="font-size:12px">
            <el-row>
                <el-col>
                    <el-form-item label="项目编号:">
                        <el-input v-model="form1.projectId"  @click.native="getProject"></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="法规名称:">
                        <el-input v-model="form1.regulation" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="分类:">
                        <el-select v-model="form1.category" placeholder="请选择">
                            <el-option :label="item.text" :value="item.id" v-for="item in categoryList" :key="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="性质:">
                        <el-input v-model="form1.nature" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="部门:">
                        <tag-select placeholder="选择机构" style="min-width:130px;max-width:300px;vertical-align: top;" initDataStr="" ref='selectDept' :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'dept')}">
                        </tag-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="法规编号:">
                        <el-input v-model="form1.regulationCode" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="标准状态:">
                        <el-select v-model="form1.standardStatus" placeholder="请选择">
                            <el-option :value='key' :label='item' v-for='(item,key) in revisionStatus' :key='item'></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="子类:">
                        <el-select v-model="form1.subCategory" placeholder="请选择">
                            <el-option :label="item.text" :value="item.id" v-for="item in subCategoryList" :key="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="专业:">
                        <el-select v-model="form1.profession" placeholder="请选择">
                            <el-option :label="item.text" :value="item.id" v-for="item in professionList" :key="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="科室:">
                        <tag-select placeholder="选择机构" style="width:130px;vertical-align: top;" initDataStr="" ref='selectDffice' :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'office')}">
                        </tag-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="适用车型:">
                        <!-- <el-select v-model="form1.carModel" placeholder="请选择">
                            <el-option :label="item.text" :value="item.id" v-for="item in excellenceSystem" :key="item.id"></el-option>
                        </el-select> -->
                        <el-input v-model="form1.carModel" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="符合性:">
                        <el-input v-model="form1.regulatoryCompliance" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="适用整车/零部件:">
                        <!-- <el-select v-model="form1.applicableType" placeholder="请选择">
                            <el-option :label="item.text" :value="item.id" v-for="item in excellenceSystem" :key="item.id"></el-option>
                        </el-select> -->
                        <el-input v-model="form1.applicableType" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col style="margin-left:20px">
                    <el-button type="primary" size="mini" @click="goSelect">查询</el-button>
                    <el-button type="primary" size="mini" @click="goReset">重置</el-button>
                </el-col>
            </el-row>

        </el-form>
    </div>
    <div class="content">
        <el-table :data="itemList" border style="width:100%;font-size:12px" height="100%" ref="outsideTable" @selection-change="handleSelectionChange">
            <el-table-column prop="projectId" label="项目编号" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="regulationTrackEntity.categoryName" label="分类" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="regulationTrackEntity.subCategoryName" label="子分类" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="regulationCode" label="法规编号" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="regulationName" label="法规名称" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-link @click="getDetail(scope.row)" type="primary">{{scope.row.regulationName}}</el-link>
                </template>
            </el-table-column>
            <el-table-column prop="regulationTrackEntity.standardStatus" label="标准状态" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="regulationTrackEntity.nature" label="性质" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="regulationTrackEntity.applicableType" label="适用整车/零部件" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="regulationTrackEntity.carModelItem" label="适用车型" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="" label="实施时间" align="center" :show-overflow-tooltip="true">
                <el-table-column prop="regulationTrackEntity.implTimeNt" label="TT" align="center"></el-table-column>
                <el-table-column prop="regulationTrackEntity.implTimeTt" label="NT" align="center"></el-table-column>
            </el-table-column>
            <el-table-column prop="deptName" label="部门" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="officeName" label="科室" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="professionName" label="专业" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="regulatoryComplianceName" label="符合性" align="center" :show-overflow-tooltip="true"></el-table-column>
        </el-table>
    </div>
    <div class="footer">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="info.page" :page-sizes="[30, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
</div>
</template>

<script>
import { sysEnv } from '../../config/env.js'
import { EcoFile } from '@/components/file/main.js'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import { EcoUtil } from '@/components/util/main.js'
import tagSelect from '@/components/orgPick/tagSelect.vue'
import { getItemCheckList, getCategory, getRevisionStatus, getMajor, getExport } from '../../api/report.js'
export default {
    data() {
        return {
            form: {},
            form2: {},
            form1: {
                projectId: '', // 项目编号
                regulation: '', // 法规名称
                category: '', // 分类
                subCategory: '', // 子类
                deptId: '', // 部门
                regulationCode: '', //法规编号
                nature: '', //性质
                profession: '', //专业
                officeId: '', //科室
                carModel: '', //适用车型
                applicableType: '', //适用整车零部件
                standardStatus: '', //标准状态
                regulatoryCompliance: '', //法规符合性
            },
            form2: {},
            itemList: [],
            info: {
                page: 1,
                rows: 30,
                sort: 'createDate',
                order: 'desc',
            },
            total: 10,
            excellenceSystem: [],
            multipleSelection: [],
            categoryList: [],
            subCategoryList: [],
            revisionStatus: [],
            professionList: [],
            searchShow: true
        }
    },
    components: {
        tagSelect,
        ecoLoading
    },
    created() {
        this.getItemCheckList()
        this.getCategory()
        this.subCategory()
        this.getRevisionStatus()
        this.getMajorList()
    },
    mounted() {
        this.callAction()
    },
    methods: {
        callAction() {
            let this_ = this
            let callBackDialogFunc = function (obj) {
                if (obj && obj.action === 'projectName') {
                    // console.log(obj.data)
                    this_.form1.projectId = obj.data.id
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'itemCheckResslt')
        },
        getItemCheckList() {
            getItemCheckList(this.info, this.form2).then(res => {
                // console.log(res.rows)
                this.itemList = res.rows
                this.total = res.total
            })
        },
        getMajorList() {
            getMajor().then(res => {
                // console.log(res)
                this.professionList = res
            })
        },
        //制修订审批状态
        getRevisionStatus() {
            getRevisionStatus().then(res => {
                console.log(res)
                this.revisionStatus = res.data
            })
        },
        //分类
        getCategory() {
            getCategory('1002').then(res => {
                // console.log(res)
                this.categoryList = res
            })
        },
        //子类
        subCategory() {
            getCategory('1001').then(res => {
                // console.log(res)
                this.subCategoryList = res
            })
        },
        selectRoleDept(data, type) {
            //责任部门
            if (!data.id && data.itemArray.length === 0) {
                if (type === 'dept') {
                    this.form1.deptId = '';
                } else if (type === 'office') {
                    this.form1.officeId = '';
                }
            } else {
                if (type === 'dept') {
                    this.form1.deptId = data.orgId;
                } else if (type === 'office') {
                    this.form1.officeId = data.orgId;
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
                this.form2 = ''
            }
            this.getItemCheckList()
        },
        goReset() {
            this.$refs.selectDept.initDataStrFunc();
            this.$refs.selectDffice.initDataStrFunc();
            this.form1.projectId = ''
            this.form1.category = ''
            this.form1.regulation = ''
            this.form1.subCategory = ''
            this.form1.deptId = ''
            this.form1.regulationCode = ''
            this.form1.nature = ''
            this.form1.profession = ''
            this.form1.officeId = ''
            this.form1.carModel = ''
            this.form1.applicableType = ''
            this.form1.standardStatus = ''
            this.form1.regulatoryCompliance = ''

            this.form2 = {}
            this.getItemCheckList()
        },
        //导出 
        exportCase() {
            if (this.form1.projectId) {
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
                    EcoFile.downloadFile(blob, "项目点检清单.xls");
                }).catch(() => {
                    this.$refs.refLoading.close();
                })
            } else {
                // console.log(11)
                return this.$message({
                    message: '请选择项目编号',
                    type: 'warning'
                });

            }
        },
        getProject() {
            if (sysEnv === 0) {
                this.$router.push({ name: 'projectList' })
            } else {
                let url = '/reportForms/index.html#/projectList'
                EcoUtil.getSysvm().openDialog('', url, '900', '600', "15vh");
            }
        },
        getDetail(item) {
            console.log(item)
            if (sysEnv === 0) {
                this.$router.push({ name: 'itemCheckDetail', params: { projectId: item.projectId, profession: item.profession, regulationCode: item.regulationCode } })
            } else {
                let url = '/reportForms/index.html#/itemCheckDetail/' + item.projectId + '/' + item.profession + '/' + item.regulationCode
                EcoUtil.getSysvm().openDialog('', url, '900', '600', "15vh");
            }
        },
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.info.rows = val
            this.getItemCheckList()
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.info.page = val
            this.getItemCheckList()
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
    }
}
</script>

<style lang="less" scoped>
.itemCheckList {
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
        padding-bottom: 70px;
        box-sizing: border-box;
    }

    .footer {
        width: 100%;
        height: 50px;
        position: fixed;
        bottom: 0;
        text-align: right;
        background-color: rgb(248, 249, 251);
        padding-top: 10px;
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
        width: 235px;
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
    /deep/ .el-table th.is-center {
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
