<template>
<div class="outSideIndex">
    <div class="header">
        <div class="left">
            <i></i>
            <span>外来标准管理</span>
        </div>
        <div class="right">
            <!-- <el-button type="primary" size="mini" @click="searchShow=(!searchShow)">高级查询</el-button> -->
            <el-button type="primary" size="mini" @click="sideAdd">新增</el-button>
            <el-button type="primary" size="mini" @click="uploadMult">批量上传</el-button>
            <el-button type="primary" size="mini" @click="goDelete">删除</el-button>
        </div>

    </div>
    <div class="header-input">
        <el-form ref="form" :model="form">
            <el-row>
                <el-col>
                    <el-form-item label="标准大类:">
                        <!-- <el-input v-model="form.name" ></el-input> -->
                        <el-select v-model="form1.stdCategory" placeholder="请选择">
                            <el-option v-for="item in stdCategoryList" :key="item.id" :label="item.text" :value="item.id" @click.native="changeStdCategory(item)"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="标准小类:">
                        <el-select v-model="form1.stdSubCategory" placeholder="请选择">
                            <el-option v-for="item in stdSubCategoryList" :key="item.id" :label="item.text" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="分类号:">
                        <el-input v-model="form1.categoryNum" ></el-input>
                    </el-form-item>
                </el-col>
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
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="英文名称:">
                        <el-input v-model="form1.enName" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="体系码:">
                        <el-input v-model="form1.systemCode" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="补充码:">
                        <el-input v-model="form1.supplementaryCode" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="有效性:">
                        <el-select v-model="form1.effectiveness" placeholder="请选择">
                            <el-option v-for="item in youXXList" :key="item.id" :label="item.text" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="国际编号:">
                        <el-input v-model="form1.internationalCode" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="采标关系:">
                        <el-input v-model="form1.adoptStdRelationship" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col style="width:300px">
                    <el-form-item label="发布日期:">
                        <!-- <el-input v-model="form1.publishDate" type="date"></el-input> -->
                        <el-date-picker value-format="yyyy-MM-dd" v-model="publishTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col style="width:300px">
                    <el-form-item label="实施日期:">
                        <!-- <el-input v-model="form1.implementDate" type="date"></el-input> -->
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
    <!-- <div class="content"> -->
    <eco-content top='205px' bottom='50px'>
        <el-table :data="outSideList" border style="width:100%;font-size:12px" height="100%" ref="outsideTable">
            <el-table-column type="selection" width="40" align="center"></el-table-column>
            <el-table-column prop="" label="序号" width="50" align="center">
                <template slot-scope="scope">
                    <span>{{scope.$index +1}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="stdCategoryName" label="标准大类" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="stdSubCategoryName" label="标准小类" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="categoryNum" label="分类号" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="stdCode" label="标准编号" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="stdName" label="标准名称" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="enName" label="英文名称" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="stdContent" label="标准内容简介" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="systemCode" label="体系码" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="supplementaryCode" label="补充码" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="substituteCode" label="被替代标准" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <p v-for="item in scope.row.substituteList" :key="item.id">{{item.name}}</p>
                </template>
            </el-table-column>
            <el-table-column prop="effectivenessName" label="有效性" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="publishDate" label="发布日期" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="implementDate" label="实施日期" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="internationalCode" label="采用国际标准编号" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="adoptStdRelationship" label="采标关系" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="操作" align="center" fixed="right" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-link type="primary" style="font-size:12px;" @click.native="goDetail(scope.row)">查看详情</el-link>
                </template>
            </el-table-column>
        </el-table>
    </eco-content>
    <!-- </div> -->
    <eco-content height='45px' bottom='0'>
        <el-pagination style="float:right" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="info.page" :page-sizes="[30, 55, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </eco-content>
</div>
</template>

<script>
import { sysEnv } from '../config/env.js'
import { EcoUtil } from '@/components/util/main.js'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import { selectOutsideList, deleteOutside, getstdCategory, getstdSubCategor, getYouXX, getstdSubCategory } from '../api/outside.js'
export default {
    components: {
        ecoContent
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
            youXXList: [],
            searchShow: true
        }
    },
    created() {
        this.getOutsideList()
        this.addMonitor()
        this.getstdCategory()
        this.getYouXXList()
    },
    methods: {
        getYouXXList() {
            getYouXX().then(res => {
                // console.log(res)
                this.youXXList = res
            })
        },
        getstdCategory() {
            getstdCategory().then(res => {
                // console.log(res)
                this.stdCategoryList = res
            })
        },
        changeStdCategory(data) {
            // console.log(data.id)
            this.stdSubCategoryList = []
            this.form1.stdSubCategory = ''
            // console.log(this.stdSubCategoryList)
            getstdSubCategory(data.id).then(res => {
                // console.log(res)
                this.stdSubCategoryList = res
            })
        },
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
        sideAdd() {
            if (sysEnv !== 1) {
                this.$router.push({ name: 'outSideAdd' })
            } else {
                let url = '/outSide/index.html#/outSideAdd';
                EcoUtil.getSysvm().openDialog('外来标准添加', url, 800, 700, '12vh');
            }
        },
        uploadMult() {
            if (sysEnv !== 1) {
                this.$router.push({ name: 'outSideuploadMult' })
            } else {
                let tabObj = {};
                tabObj.desc = '批量上传'
                let goPage = "outSide/index.html#/outSideuploadMult";
                tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'outSideuploadMult',href_link:'" + goPage + "'}";
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
                this.$router.push({ name: 'outSideDetails', params: { id: data.id } })
            } else {
                // let tabObj = {};
                // tabObj.desc = '查询详情'
                // let goPage = "outSide/index.html#/outSideDetails/" + data.id;
                // tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'outSideDetails',href_link:'" + goPage + "'}";
                // tabObj.reload = true;
                // tabObj.clearIframe = true;
                // EcoUtil.getSysvm().doTab(tabObj);

                let url = '/outSide/index.html#/outSideDetails/' + data.id;
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
    }
}
</script>

<style lang="less" scoped>
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
    // overflow: hidden;
    // overflow-y: auto;
    //  overflow-x: auto;
}

// /deep/.el-table--scrollable-x .el-table__body-wrapper {
//     z-index: 1;
//   }
// /deep/ .el-table .el-table__body-wrapper {
//     height: 100%;
//     // padding-bottom: 60px;
//     box-sizing: border-box;
//     overflow-y: auto;
// }

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

.outSideIndex {
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
        height: 150px;
        padding-left: 20px;
        padding-top: 10px;
        box-sizing: border-box;
        border-left: 1px solid rgb(221, 221, 221);
        border-right: 1px solid rgb(221, 221, 221);
        border-bottom: 1px solid rgb(221, 221, 221);
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
}
</style>
