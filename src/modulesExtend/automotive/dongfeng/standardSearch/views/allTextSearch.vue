<template>
<div class="allTextSearch">
    <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
    <div class="header">
        <div class="left">
            <i></i>
            <span>标准全文检索</span>
        </div>
        <div class="right">
        </div>
    </div>
    <div class="center">
        <div class="content-left">
            <el-scrollbar>
                <div class="left-tree">
                    <el-tree :data="searchTree" :props="defaultProps" @node-click="handleNodeClick" style="width:100%"></el-tree>
                </div>
            </el-scrollbar>
        </div>
        <div class="content-right">
            <div class="header-search">
                <el-row style="width:750px;margin-left:10px">
                    <el-input style="width:500px;" v-model="form1.fullText"></el-input>
                    <el-button type="primary" size="mini" @click="goSelect" style="margin-left:20px">查询</el-button>
                    <el-button type="primary" size="mini" @click="goReset">重置</el-button>
                </el-row>
                <el-row style="width:750px;line-height:22px;">
                    <span style="margin-right:10px;margin-left:10px">排序</span>
                    <el-radio-group v-model="info.sort">
                        <el-radio label="__RELEVANCE__">相关性</el-radio>
                        <el-radio label="readCount">浏览量</el-radio>
                        <el-radio label="createDate">发布时间</el-radio>
                    </el-radio-group>
                    <el-link @click="searchShow=(!searchShow)" type="primary" style="margin-left:20px;font-size:12px;">高级检索</el-link>
                </el-row>
            </div>
            <div class="header-input" v-show="searchShow">
                <el-form ref="form" :model="form" style="font-size:12px">
                    <el-row class="row">
                        <el-col>
                            <el-form-item label="标准编号:">
                                <el-input v-model="form1.stdCode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col>
                            <el-form-item label="部门:">
                                <tag-select style="min-width:130px;max-width:300px;vertical-align: top;" initDataStr="" ref='selectDept' :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'dept')}">
                                </tag-select>
                            </el-form-item>
                        </el-col>

                        <el-col>
                            <el-form-item label="体系码:">
                                <el-input v-model="form1.systemCode"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="row">
                        <el-col>
                            <el-form-item label="标准名称:">
                                <el-input v-model="form1.stdName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col>
                            <el-form-item label="科室:">
                                <tag-select style="width:130px;vertical-align: top;" initDataStr="" ref='selectDffice' :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'office')}">
                                </tag-select>
                            </el-form-item>
                        </el-col>
                        <el-col>
                            <el-form-item label="责任人:">
                                <tag-select ref='selectResponsibleUser' initDataStr="" style="width:130px;vertical-align: top;" :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data,'responsibleUser')}">
                                </tag-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="row">
                        <el-col>
                            <el-form-item label="标准类别:">
                                <!-- <el-input v-model="form1.revisionStatus" ></el-input> -->
                                <el-select filterable v-model='form1.classification'>
                                    <el-option v-for="item in classificationList" :key="item.id" :label="item.text" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col>
                            <el-form-item label="分标委:">
                                <!-- <el-input v-model="form1.revisionStatus" ></el-input> -->
                                <el-select filterable v-model='form1.subcommittee'>
                                    <el-option v-for="item in subcommitteeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <el-scrollbar style="width:100%">
                <div class="detail">
                    <el-row class="detail-row" v-for="item in searchList" :key="item.id">
                        <el-col class="title">
                            <span>标题： {{item.stdCode}}</span>
                            <span>标准名称：<el-link type="primary" style="margin-top:-4px;font-size:14px;" @click="getKnowlage(item)">{{item.stdName}}</el-link></span>
                            <span>浏览数： {{item.readCount}}</span>
                        </el-col>
                        <el-col class="text">
                            <span :class="item.showAll?'allText':''" style="margin-left:10px" @click="showAll(item)">全文 : {{item.content}}</span>
                        </el-col>
                    </el-row>
                </div>
            </el-scrollbar>
        </div>
    </div>
    <div class="footer">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="info.page" :page-sizes="[10, 30, 50]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</div>
</template>

<script>
import { sysEnv } from '../config/env.js'
import { EcoFile } from '@/components/file/main.js'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import { EcoUtil } from '@/components/util/main.js'
import tagSelect from '@/components/orgPick/tagSelect.vue'
import { searchAllText, getSubcommittee, getEnumSelectEnabled, searchTree } from '../api/standardSearch.js'
export default {
    data() {
        return {
            form: {},
            form2: {},
            form1: {
                fullText: '',
                stdCode: '', //标准编码
                stdName: '', //标准名称
                systemCode: '', //体系码id
                dept: '', //部门id
                office: '', //科室
                classification: '', //标准分类，基础数据id
                type: '', //标准类型，基础数据id
                subcommittee: '', //分标委，组织架构id
                responsibleUser: '', //责任人id
            },
            info: {
                page: 1,
                rows: 10,
                sort: 'readCount',
                order: 'desc',
            },
            total: 10,
            searchShow: false,
            countersignTime: '',
            draftTime: '',
            searchList: [],
            subcommitteeList: [],
            classificationList: [],
            parentId: '',
            searchTree: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            }
        }
    },
    components: {
        ecoLoading,
        tagSelect
    },
    created() {
        this.getSearchAllText()
        this.getSubcommittee()
        this.getEnumSelectEnabled()
        this.getSearchTree()
    },
    methods: {
        getSearchTree() {
            searchTree().then(res => {
                // console.log(res)
                this.searchTree = [res]
            })
        },
        getSearchAllText() {
            searchAllText(this.info, this.form2, this.parentId).then(res => {
                // console.log(res)
                res.rows.map(item => {
                    this.$set(item, 'showAll', true)
                    return item
                })
                this.searchList = res.rows
                console.log(this.searchList)
            })
        },
        getSubcommittee() {
            getSubcommittee().then(res => {
                // console.log(res)
                this.subcommitteeList = res.rows
            })
        },
        getEnumSelectEnabled() {
            getEnumSelectEnabled().then(res => {
                // console.log(res)
                this.classificationList = res
            })
        },
        showAll(item) {
            item.showAll = !item.showAll
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
            this.getSearchAllText()
        },
        goReset() {
            this.$refs.selectResponsibleUser.initDataStrFunc();
            this.$refs.selectDept.initDataStrFunc();
            this.$refs.selectDffice.initDataStrFunc();
            this.form1.fullText = ''
            this.form1.stdName = ''
            this.form1.stdCode = ''
            this.form1.systemCode = ''
            this.form1.dept = ''
            this.form1.office = ''
            this.form1.classification = ''
            this.form1.subcommittee = ''
            this.form1.responsibleUser = ''

            this.form2 = {}
            this.info.rows = 30;
            this.info.page = 1
            this.parentId = ''
            this.getSearchAllText()
        },
        handleNodeClick(node) {
            this.parentId = node.id
            this.getSearchAllText()
        },
        getKnowlage(item) {
            console.log(item)
            let type = ''
            if (item) {
                type = 1
            } else {
                type = 2
            }
            let tabObj = {};
            tabObj.desc = item.stdName;
            let goPage = "knowledge/index.html#/fileCard" + '/' + item.id + '/' + type;
            tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'fileCard',href_link:'" + goPage + "'}";
            tabObj.reload = true;
            tabObj.clearIframe = true;
            EcoUtil.getSysvm().doTab(tabObj);
        },
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.info.rows = val
            this.getSearchAllText()

        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.info.page = val
            this.getSearchAllText()
        },
    }
}
</script>

<style lang="less" scoped>
.allTextSearch /deep/ .el-input {
    width: 130px;
    height: 28px;
}

.allTextSearch /deep/ .el-date-editor {
    width: 210px;
}

.allTextSearch /deep/ .el-range-editor--mini.el-input__inner {
    width: 200px;
}

.allTextSearch /deep/ .el-col {
    width: 250px;
}

.allTextSearch /deep/ .el-customDiv {
    line-height: 28px;
    min-height: 28px;
    border: 1px solid #dcdfe6;
    border-radius: 5px;
}

.allTextSearch {
    width: 100%;
    height: 100vh;
    // padding-left: 20px;
    // padding-right: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    // overflow: hidden;
    overflow-y: auto;

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

    .center {
        width: 100%;
        height: calc(100% - 50px);
        display: flex;

        .content-left {
            width: 250px;
            height: 100%;
            border-right: 1px solid rgb(221, 221, 221);
        }

        .content-right {
            width: 100%;
            height: 100%;
            padding-left: 20px;
            box-sizing: border-box;

            .header-search {
                width: 100%;
                height: 60px;
                padding-top: 10px;
                font-size: 12px;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                color: #606266;

                /deep/ .el-radio__label {
                    font-size: 12px;
                }

            }

            .header-input {
                width: 100%;
                height: 150px;
                padding-left: 20px;
                padding-top: 10px;
                box-sizing: border-box;
                border-bottom: 1px solid rgb(221, 221, 221);

                /deep/ .el-form-item__label {
                    font-size: 12px;
                }

                .row {
                    width: 750px;
                }
            }

            .detail {
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                color: #606266;
                font-size: 12px;

                .detail-row {
                    width: 750px;
                    min-height: 80px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    border-bottom: 1px dashed #797979;

                    .title {
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-top: 5px;
                        margin-bottom: 5px;
                    }

                    .text {
                        width: 100%;
                        margin-top: 5px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        box-sizing: border-box;
                        padding-bottom: 10px;

                        .allText {
                            white-space: nowrap
                        }
                    }
                }
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
}
</style>
