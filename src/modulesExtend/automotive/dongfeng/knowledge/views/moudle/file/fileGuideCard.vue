<template>
<div class="kmGuide" v-if="data!=''">
    <div class="center">
        <el-form label-width="120px" class="demo-ruleForm" label-position="left" :model="form.data">
            <table>

                <tr>
                    <td>业务指南名称：</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.businessGuideName" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                    <td>制/修订：</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.revisionTypeName" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>业务指南编制目的及内容简介：</td>
                    <td colspan='3'>
                        <el-form-item>
                            <el-input v-model="form.data.purposeContent" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" resize="none" readonly="readonly"></el-input>
                        </el-form-item>
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
                    <td>部门：</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.deptName" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                    <td>科室：</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.officeName" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <!-- <td>制定人：</td>
                    <td>
                        <el-form-item>
                            <tag-select style="width:220px;vertical-align: top;" :initDataStr="makerMembers" ref="tagSelect" :initOptions="{selectNum:1,selectType:'USER'}" disabled>
                            </tag-select>
                        </el-form-item>
                    </td> -->
                </tr>
                <tr>
                    <td>责任人：</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.responsibleUserName" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                    <td>年度：</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.year" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>起草人信息</td>
                    <td colspan="3">
                        <tag-select style="width:580px;vertical-align: top;" :initDataStr="draftMembers" ref="tagSelect" :initOptions="{selectNum:0,selectType:'user-persion'}" disabled></tag-select>
                    </td>
                </tr>
                <tr>
                    <td>有效性：</td>
                    <td>
                        <el-form-item>
                            <!-- <el-select v-model="form.data.approveType" placeholder="请选择" disabled>
                                <el-option label="同意" value="同意"></el-option>
                                <el-option label="不同意" value="不同意"></el-option>
                            </el-select> -->
                            <el-input v-model="form.data.approveType" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                    <td>替代版次</td>
                    <td>
                        <el-form-item>
                            <!-- <el-select v-model="form.data.substituteCode" placeholder="请选择" disabled>
                                <el-option label="同意" value="同意"></el-option>
                                <el-option label="不同意" value="不同意"></el-option>
                            </el-select> -->
                            <el-input v-model="form.data.substituteCode" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>备注：</td>
                    <td colspan='3'>
                        <el-form-item>
                            <el-input v-model="form.data.comments" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" resize="none" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                </tr>
            </table>
        </el-form>
    </div>
</div>
</template>

<script>
import { getUserInfoByOrgId, getOrgsMemberByIds } from '../../../api/common.js'
import tagSelect from '@/components/orgPick/tagSelect.vue'
export default {
    props: {
        data: {}
    },
    components: {
        tagSelect
    },
    data() {
        return {
            form: {
                data: { //卡片信息
                    id: '',
                    excellenceSystem: '', //卓越体系
                    businessGuideName: '', //业务指南名称
                    maker: '', //制定人
                    year: '', //年度
                    purposeContent: '', //业务指南编制目的及内容简介
                    dept: '', //部门
                    office: '', //科室
                    responsibleUser: '', //责任人
                    draftCompleteTime: '', //初稿完成时间
                    countersignCompleteTime: '', //会签完成时间
                    revisionType: '', //制/修订
                    drafter: '', //起草人
                    approveType: '', //是否同意
                    substituteId: '', //替代标准id
                    substituteCode: '', //替代标准
                    draftMembers: [] //起草人信息
                }
            },
            type: '',
            exposeMembers: '',
            hideMembers: '',
            manageMembers: '',
            makerMembers: '', //制定人
            deptList: '', //部门
            officeList: '', //科室
            responsibleUser: '',
            draftMembers: '', //起草人信息
            order: '',
            loading: false,
            modularInnerId: "",
            fileList: [],
            baseId: '',
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
        // console.log(this.fileList)
        // }
    },
    watch: {
        data(nv, ov) {
            // console.log(nv)
            if (nv != '') {
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
/deep/ .el-link {
    margin-right: 10px;
    color: #0000ff;
    font-size: 16px;
}

/deep/ .el-input {
    width: 220px;
}

/deep/ .el-textarea {
    width: 580px;
}

.kmGuide {
    width: 720px;
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
                    // padding: 10px;
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
