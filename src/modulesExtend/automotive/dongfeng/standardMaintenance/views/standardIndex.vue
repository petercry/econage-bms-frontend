<template>
<div class="standardIndex">
    <div class="header">
        <div class="left">
            <i></i>
            <span>企业标准维护</span>
        </div>
        <div class="right">
            <el-button type="primary" size="mini" @click="searchShow=(!searchShow)">高级查询</el-button>
            <el-button type="primary" size="mini" @click="sideAdd">新增</el-button>
            <el-button type="primary" size="mini" @click="uploadMult">批量上传</el-button>
            <el-button type="primary" size="mini" @click="goDelete">删除</el-button>
        </div>

    </div>
    <div class="header-input" v-show="searchShow">
        <el-form ref="form" :model="form">
            <el-row>
                <el-col>
                    <el-form-item label="标准分类:">
                        <!-- <el-input v-model="form.name" ></el-input> -->
                        <el-select v-model="form1.stdCategory" placeholder="请选择">
                            <el-option v-for="item in stdCategoryList" :key="item.id" :label="item.text" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="标准编号:">
                        <el-input v-model="form1.stdCode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="分标委:">
                        <el-input v-model="form1.categoryNum"></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="部门:">
                        <tag-select placeholder="选择机构" style="min-width:130px;max-width:300px;vertical-align: top;" initDataStr="" ref='selectDept' :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'dept')}">
                        </tag-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="制修订状态:">
                        <el-select filterable v-model='form1.revisionStatus'>
                            <el-option :value='key' :label='item' v-for='(item,key) in revisionStatus' :key='item'></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="来源编号:">
                        <el-input v-model="form1.internationalCode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="标准名称:">
                        <el-input v-model="form1.stdName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="体系码:">
                        <el-input v-model="form1.systemCode"></el-input>
                    </el-form-item>
                </el-col>

                <el-col>
                    <el-form-item label="科室:">
                        <tag-select placeholder="选择机构" style="width:130px;vertical-align: top;" initDataStr="" ref='selectDffice' :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'office')}">
                        </tag-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="当前审批人:">
                        <tag-select ref='selectResponsibleUser' initDataStr="" placeholder="选择人员" style="width:130px;vertical-align: top;" :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data,'responsibleUser')}">
                        </tag-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="替代标准:">
                        <el-input v-model="form1.adoptStdRelationship"></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="制/修订:">
                        <el-select filterable v-model='form1.revisionType'>
                            <el-option :value='item.id' :label='item.text' v-for='(item) in revisionType' :key='item.id'></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="责任人:">
                        <tag-select ref='selectResponsibleUser' initDataStr="" placeholder="选择人员" style="width:130px;vertical-align: top;" :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data,'responsibleUser')}">
                        </tag-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="年度:">
                        <el-input v-model="form1.year"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col style="width:320px">
                    <el-form-item label="初稿完成时间:">
                        <el-date-picker value-format="yyyy-MM-dd" v-model="publishTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col style="width:320px">
                    <el-form-item label="会签完成时间:">
                        <el-date-picker value-format="yyyy-MM-dd" v-model="implementTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col style="width:320px">
                    <el-form-item label="发布时间:">
                        <el-date-picker value-format="yyyy-MM-dd" v-model="implementTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
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

        <el-table :data="outSideList" border style="width:100%;font-size:12px" height="100%" ref="outsideTable">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column type='index' label='序号' align="center"></el-table-column>
            <!-- <el-table-column prop='year' label='年度'></el-table-column> -->
            <el-table-column prop='deptName' label='部门' width='140' show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop='classificationName' label='标准分类' widt='150' show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop='programNumber' label='标准编号' align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop='typeName' label='标准类型' align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop='programName' label='标准名称' width='160' show-overflow-tooltip align="center">
                <template slot-scope='scope'>
                    <span class="linkB cursorP" @click='openWfViewOperate(scope.row.wfId)'>{{scope.row.programName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop='draftTime' width='130' label='初稿完成时间' align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop='countersignTime' width='130' label='会签完成时间' align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop='officeName' label='科室' width='140' align="center" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column prop='drafterName' label='制定人'></el-table-column> -->
            <el-table-column prop='responsibleUserName' label='责任人' align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop='subcommitteeName' label='分标委' width='160' show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop='sourceNumberList' label='来源编号' width='200' show-overflow-tooltip align="center">
                <template slot-scope='scope'>
                    <span>{{restSourceNumberList(scope.row.sourceNumberList)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop='systemCode' label='体系码' align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop='editTypeName' label='制/修订' align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop='editApproveName' label='制修订当前审批人' width='150' show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop='editStatusName' label='制修订状态' width='150' show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop='planApproveName' label='计划当前审批人' width='150' show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop='planStatusName' label='计划审批状态' width='150' show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop='planTypeName' label='计划类型' align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop='approveCompleteTime' label='审批完成日期' width='130' align="center" show-overflow-tooltip></el-table-column>
        </el-table>
    </div>
    <eco-content height='50px' bottom='0'>
        <el-pagination style="float:right;padding-right:50px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="info.page" :page-sizes="[30, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </eco-content>
</div>
</template>

<script>
import { sysEnv } from '../config/env.js'
import { EcoUtil } from '@/components/util/main.js'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import tagSelect from '@/components/orgPick/tagSelect.vue'
import { selectOutsideList, deleteOutside, getstdCategory, getstdSubCategor, getRevisionType, getRevisionStatus } from '../api/standard.js'
export default {
    components: {
        ecoContent,
        tagSelect
    },
    data() {
        return {
            form: {},
            form2: {},
            form1: {
                stdCategory: '', //标准大类
                stdSubCategory: '', //标准小类
                categoryNum: '', //分类号
                stdCode: '', //标准编号
                stdName: '', //标准名称
                enName: '', //英文名称
                systemCode: '', //体系码
                supplementaryCode: '', //补充码
                substituteIds: '', //替代标准id
                substituteCode: '', //替代标准
                effectiveness: '', //有效性
                stdContent: '', //标准内容简介
                publishDate: '', //发布日期
                implementDate: '', //实施时间
                internationalCode: '', //采用国际标准编号
                adoptStdRelationship: '', //采标关系
            },
            info: {
                page: 1,
                rows: 30,
                sort: 'createDate',
                order: 'desc',
            },
            total: 0,
            outSideList: [],
            publishTime: [],
            implementTime: [],
            stdCategoryList: [],
            stdSubCategoryList: [],
            revisionType: [],
            revisionStatus: [],
            searchShow: false
        }
    },
    created() {
        this.getOutsideList()
        this.addMonitor()
        this.getRevisionType()
        this.getRevisionStatus()
    },
    methods: {
        addMonitor() {
            let this_ = this
            let callBackDialogFunc = function (obj) {
                if (obj && (obj.action == 'addNewFileCallBack')) {
                    this_.$message({ type: 'success', message: '创建成功！' });
                    this_.getOutsideList();
                }
            }
            window.tabClickFunc = function () {
                this_.getOutsideList();
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc);
        },
        getOutsideList() {
            selectOutsideList(this.info, this.form2).then(res => {
                // console.log(res.rows)
                this.outSideList = res.rows
                this.total = res.total
                this.$nextTick(() => {
                    this.$refs.outsideTable.doLayout()
                })
            })
        },
        //制/修订
        getRevisionType() {
            getRevisionType().then(res => {
                // console.log(res)
                this.revisionType = res
            })
        },
        //制修订审批状态
        getRevisionStatus() {
            getRevisionStatus().then(res => {
                // console.log(res)
                this.revisionStatus = res
            })
        },
        sideAdd() {
            if (sysEnv !== 1) {
                this.$router.push({ name: 'standardAdd' })
            } else {
                let url = '/standardMaintenance/index.html#/standardAdd';
                EcoUtil.getSysvm().openDialog('企业标准添加', url, 800, 700, '12vh');
            }
        },
        uploadMult() {
            if (sysEnv !== 1) {
                this.$router.push({ name: 'standarduploadMult' })
            } else {
                let tabObj = {};
                tabObj.desc = '批量上传'
                let goPage = "standardMaintenance/index.html#/standarduploadMult";
                tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'standarduploadMult',href_link:'" + goPage + "'}";
                tabObj.reload = true;
                tabObj.clearIframe = true;
                EcoUtil.getSysvm().doTab(tabObj);
            }
        },
        goDelete() {
            let outside = this.$refs.outsideTable.selection.map(item => {
                return item.id
            })
            if (!outside) {
                this.$message({ type: 'warning', message: '请选择要删除的文件！' });
            } else {
                this.$confirm('是否删除记录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteOutside(outside).then(res => {
                        this.$message({ type: 'success', message: '删除成功！' });
                        this.getOutsideList()
                    })
                })
            }
        },
        goDetail(data) {
            // console.log(data)
            if (sysEnv !== 1) {
                this.$router.push({ name: 'standardDetails', params: { id: data.id } })
            } else {
                let url = '/standardMaintenance/index.html#/standardDetails/' + data.id;
                EcoUtil.getSysvm().openDialog('查询详情', url, 800, 700, '12vh');
            }
        },
        goSelect() {
            if (this.publishTime) {
                this.form1.publishDateFrom = this.publishTime[0]
                this.form1.publishDateTo = this.publishTime[1]
            } else {
                this.form1.publishDateFrom = ''
                this.form1.publishDateTo = ''
            }
            if (this.implementTime) {
                this.form1.implementDateFrom = this.implementTime[0]
                this.form1.implementDateTo = this.implementTime[1]
            } else {
                this.form1.implementDateFrom = ''
                this.form1.implementDateTo = ''
            }
            if (this.form1) {
                for (const value in this.form1) {
                    if (this.form1[value]) {
                        this.form2[value] = this.form1[value]
                    }
                }
            } else {
                this.form2 = {}
            }
            this.info.page = 1;
            this.getOutsideList()
        },
        goReset() {
            this.form1.stdCategory = ''
            this.form1.stdSubCategory = ''
            this.form1.categoryNum = ''
            this.form1.stdCode = ''
            this.form1.stdName = ''
            this.form1.enName = ''
            this.form1.systemCode = ''
            this.form1.supplementaryCode = ''
            this.form1.substituteCode = ''
            this.form1.substituteIds = ''
            this.form1.effectiveness = ''
            this.form1.stdContent = ''
            this.form1.publishDate = ''
            this.form1.implementDate = ''
            this.form1.internationalCode = ''
            this.form1.adoptStdRelationship = ''
            this.publishTime = []
            this.implementTime = []
            this.form2 = {}
            this.info.page = 1;
            this.info.rows = 30;

            this.getOutsideList()
        },
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.info.rows = val
            this.getOutsideList()
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.info.page = val
            this.getOutsideList()
        },
        restSourceNumberList(data) {
            let str = '';
            if (!data) {
                return str;
            }
            data.forEach((item, index) => {
                str += (index === 0 ? item.code : `、${item.code}`)
            })
            return str;
        },
        selectRoleUser(data, type) {
            //选择人
            if (!data.id && data.itemArray.length === 0) {
                //人员删除
                if (type === 'maker') {
                    this.form1.maker = '';
                } else if (type === 'responsibleUser') {
                    this.form1.responsibleUser = '';
                } else if (type === 'planApprove') {
                    this.form1.planApprove = '';
                } else if (type === 'revisionApprove') {
                    this.form1.revisionApprove = '';
                }
            } else {
                if (type === 'maker') {
                    this.form1.maker = data.itemArray[0].linkId;
                } else if (type === 'responsibleUser') {
                    this.form1.responsibleUser = data.itemArray[0].linkId;
                } else if (type === 'planApprove') {
                    this.form1.planApprove = data.itemArray[0].linkId;
                } else if (type === 'revisionApprove') {
                    this.form1.revisionApprove = data.itemArray[0].linkId;
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
    }
}
</script>

<style lang="less" scoped>
.standardIndex {
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
    }

    .content {
        width: 100%;
        // height: calc(100% - 200px);
        flex: 1;
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

/deep/ .el-table {
    width: 100%;
    height: 100%;
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
}
</style>
