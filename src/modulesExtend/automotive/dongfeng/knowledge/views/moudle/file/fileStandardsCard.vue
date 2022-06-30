<template>
<div class="kmStandards" v-if="data!=''">
    <div class="center">
        <el-form label-width="120px" class="demo-ruleForm" label-position="left" :model="form.data">
            <table>
                <tr>
                    <td>标准分类：</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.stdCategoryName" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                    <td>标准类型：</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.stdTypeName" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>标准名称：</td>
                    <td colspan="3">
                        <el-form-item>
                            <el-input v-model="form.data.stdName" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>标准编号：</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.stdCode" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                    <td>体系码：</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.systemCode"></el-input>
                        </el-form-item>
                    </td>
                    <!-- <td>制订人：</td>
                    <td>
                        <el-form-item>
                            <tag-select style="width:220px;vertical-align: top;" :initDataStr="makerMembers" ref="tagSelect" :initOptions="{selectNum:1,selectType:'USER'}" disabled></tag-select>
                        </el-form-item>
                    </td> -->
                </tr>
                <tr>
                    <td>年度：</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.year" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                    <td>制/修订</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.revisionTypeName" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td><i>*</i>标准编制目的及内容简介：</td>
                    <td colspan='3'>
                        <el-form-item>
                            <el-input v-model="form.data.purposeContent" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" resize="none" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>部门：</td>
                    <td>
                        <el-input v-model="form.data.deptName" readonly="readonly"></el-input>
                    </td>
                    <td>科室：</td>
                    <td>
                        <el-input v-model="form.data.officeName" readonly="readonly"></el-input>
                    </td>
                </tr>
                <tr>
                    <td>初稿完成时间：</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.draftCompleteTime" type="date" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                    <td>会签完成时间：</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.countersignCompleteTime" type="date" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>实施时间：</td>
                    <td>

                        <el-form-item>
                            <el-input v-model="form.data.implementTime" type="date" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                    <td>实际会签时间：</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.countersignActualTime" type="date" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>发布日期：</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.publishDate" type="date" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                    <td>分标委：</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.subcommitteeName"  readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>规划来源：</td>
                    <td>
                        <el-input v-model="form.data.planSourceName" readonly="readonly"></el-input>
                    </td>
                    <td>来源编号：</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.sourceCode" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>责任人：</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.responsibleUserName" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                    <td>有效性：</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.effectivenessName" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>起草人信息</td>
                    <td colspan="3">
                        <tag-select style="width:570px;vertical-align: top;" :initDataStr="draftMembers" ref="tagSelect" :initOptions="{selectNum:0,selectType:'user-persion'}" disabled></tag-select>
                    </td>
                </tr>
            </table>
        </el-form>
    </div>
    <!-- <div class="footer">
            <el-button type="primary">关闭</el-button>
        </div> -->
</div>
</template>

<script>
import { getUserInfoByOrgId, getOrgsMemberByIds } from '../../../api/common.js'
import tagSelect from '@/components/orgPick/tagSelect.vue'
import { newAddCommon, editCommon, getSubcommittee, getStdCategory } from '../../../api/fileCard.js'
export default {
    props: {
        data: {}
    },
    components: { tagSelect },
    data() {
        return {
            form: {
                data: { //卡片信息
                    id: '',
                    stdCategory: '', //标准分类
                    stdType: '', //标准类型
                    stdCode: '', //标准编号
                    stdName: '', //标准名称
                    systemCode: '', //体系码
                    maker: '', //制定人
                    year: '', //年度
                    purposeContent: '', //标准编制目的及内容简介
                    dept: '', //部门
                    office: '', //科室
                    responsibleUser: '', //责任人
                    draftCompleteTime: '', //初稿完成时间
                    countersignCompleteTime: '', //会签完成时间
                    implementTime: '', //实施时间
                    countersignActualTime: '', //实际会签时间
                    publishDate: '', //发布日期
                    subcommittee: '', //分标委
                    revisionType: '', //制/修订
                    substituteCode: '', //替代标准id
                    substituteId: '', //替代标准
                    planSource: '', //规划来源
                    sourceCode: '', //来源编号
                    fiveDomainList: '', //五化领域
                    applicationDomainList: '', //应用领域
                    applicableProjectList: '', //适用项目
                    applicationCarModelList: '', //应用车型
                    draftMembers: [], //起草人信息
                    standardtype: '' //有效性
                }
            },
            exposeMembers: '',
            hideMembers: '',
            manageMembers: '',
            makerMembers: '',
            responsibleUser: '',
            draftMembers: '',
            order: '',
            loading: false,
            modularInnerId: "",
            fileList: [],
            baseId: '',
            subcommitteeList: [], //分标委
            stdCategoryList: [], //标准分类
            stdTypeList: [], //标准类型,
            deptInitDataStr: '', //部门
            officeInitDataStr: '', //科室
        }
    },
    mounted() {
        // console.log(this.$props)
        // if (this.$props.data) {
        //     this.form.data = this.$props.data
        //     if (this.$props.data.draftMembers) {
        //         let draftArr = []
        //         this.$props.data.draftMembers.map(item => {
        //             let obj = {}
        //             obj.type = item.type
        //             obj.orgId = item.orgId
        //             obj.linkId = item.linkId
        //             draftArr.push(JSON.stringify(obj))
        //         })
        //         let draftStr = draftArr.join('|')
        //         this.draftMembers = draftStr
        //     }
        // }
    },
    created() {
        this.getSubcommittee()
        this.getStdCategory('esProgramClass')
    },
    methods: {
        getSubcommittee() {
            getSubcommittee().then(res => {
                // console.log(res)
                this.subcommitteeList = res.rows
            })
        },
        getStdCategory(parentId) {
            getStdCategory(parentId).then(res => {
                this.stdCategoryList = res
                // console.log(res)
            })
        },
        changeStdCategory(data) {
            // console.log(data)
            this.stdTypeList = []
            this.form.data.stdType = ''
            getStdCategory(data.id).then(res => {
                this.stdTypeList = res
                // console.log(res)
            })
        },
        getItemFetchId() {
            getItemFetchId().then(res => {
                this.modularInnerId = res;
                // this.form.id = this.modularInnerId;
                this.loading = false;
            })
        },
    },
    watch: {
        data(nv, ov) {
            console.log(nv)
            if (nv != '') {
                // console.log("111")
                // this.form = nv
                this.form.data = nv
                if (nv.draftMembers) {
                    let draftArr = []
                    nv.data.draftMembers.map(item => {
                        let obj = {}
                        obj.type = item.type
                        obj.orgId = item.orgId
                        obj.linkId = item.linkId
                        draftArr.push(JSON.stringify(obj))
                    })
                    let draftStr = draftArr.join('|')
                    this.draftMembers = draftStr
                }

            }
        }
    }
}
</script>

<style lang="less" scoped>
/deep/ .el-button {
    width: 70px;
    height: 36px;
}

/deep/ .el-link {
    margin-right: 10px;
    color: #0000ff;
    font-size: 16px;
}

.kmStandards {
    width: 700px;
    height: 100%;
    margin: 0 auto;

    /deep/ .el-form-item {
        margin-bottom: 0;
    }

    /deep/ .el-form-item__content {
        margin-left: 0 !important;
    }

    /deep/ .el-button {
        width: 70px;
        height: 36px;
    }

    /deep/ .el-link {
        margin-right: 10px;
        color: #0000ff;
        font-size: 16px;
    }

    .center {
        width: 100%;
        font-size: 14px;
        color: #606266;
        box-sizing: border-box;

        table {
            width: 100%;
            height: 100%;

            tr {
                td {
                    padding-bottom: 10px;
                    padding-top: 10px;
                    box-sizing: border-box;

                    &:nth-child(odd) {
                        width: 135px;
                        // padding: 10px;
                        box-sizing: border-box;
                    }

                    &:nth-child(1) {
                        // width: 135px;
                        // padding: 10px;
                        padding-left: 0;
                        box-sizing: border-box;
                    }

                    &:nth-child(3) {
                        // width: 135px;
                        // padding: 10px;
                        padding-left: 10px;
                        box-sizing: border-box;
                    }

                    table {
                        tr {
                            &:nth-child(1) {
                                background: #d7d7d7;
                            }

                            &:nth-child(2) {
                                background: white;
                            }

                            &:nth-child(3) {
                                background: #f2f2f2;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
