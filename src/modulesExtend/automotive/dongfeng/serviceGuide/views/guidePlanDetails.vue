<template>
<div class="guideAdd">
    <div class="center">
        <el-form class="demo-ruleForm" label-position="left" :model="formData" ref="ruleForm">
            <div class="basicInfo">
                <el-divider content-position="left">基本信息</el-divider>
                <table>
                    <tr>
                        <td>卓越体系：</td>
                        <td>
                            <el-form-item>
                                <el-input readonly :value='formData.excellenceSystemName'></el-input>
                            </el-form-item>
                        </td>
                        <td>部门：</td>
                        <td>
                            <el-form-item>
                                <el-input readonly :value='formData.deptName'></el-input>
                            </el-form-item>
                        </td>
                        <td>体系码：</td>
                        <td>
                            <el-form-item>
                                <el-input readonly v-model="formData.systemCode"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>业务指南名称：</td>
                        <td>
                            <el-form-item>
                                <el-input readonly v-model="formData.businessGuideName"></el-input>
                            </el-form-item>
                        </td>
                        <td>科室：</td>
                        <td>
                            <el-form-item>
                                <el-input readonly v-model="formData.officeName"></el-input>
                            </el-form-item>
                        </td>
                        <td>制定人：</td>
                        <td>
                            <el-form-item>
                                <el-input readonly v-model="formData.makerName"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>业务指南编制目的及内容简介：</td>
                        <td colspan='5'>
                            <el-form-item>
                                <el-input readonly v-model="formData.purposeContent" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" resize="none"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>初稿完成时间：</td>
                        <td>
                            <el-form-item>
                                <el-input readonly v-model="formData.draftCompleteTime"></el-input>
                            </el-form-item>
                        </td>
                        <td>会签完成时间：</td>
                        <td>
                            <el-form-item>
                                <el-input readonly v-model="formData.countersignCompleteTime"></el-input>
                            </el-form-item>
                        </td>
                        <td>责任人：</td>
                        <td>
                            <el-form-item>
                                <el-input readonly v-model="formData.responsibleUserName"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>制/修订：</td>
                        <td>
                            <el-form-item>
                                <el-input readonly v-model="formData.revisionTypeName"></el-input>
                            </el-form-item>
                        </td>
                        <td>计划类型：</td>
                        <td>
                            <el-form-item>
                                <el-input readonly v-model="formData.planTypeName"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>备注：</td>
                        <td colspan='5'>
                            <el-form-item>
                                <el-input readonly v-model="formData.comments" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" resize="none"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="adjustInfo">
                <el-divider content-position="left">调整信息</el-divider>
                <table>
                    <tr>
                        <td>调整类型：</td>
                        <td>
                            <el-form-item>
                                <el-input readonly v-model="formData.planTypeName"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>原因：</td>
                        <td colspan='5'>
                            <el-form-item>
                                <el-input readonly v-model="formData.cancelReason" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" resize="none"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="approval">
                <el-divider content-position="left">审批节点</el-divider>
                <table>
                    <tr>
                        <td>部门负责人：</td>
                        <td>
                            <el-form-item>
                                <el-input readonly v-model="formData.planTypeName"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>标准法规室科长：</td>
                        <td>
                            <el-form-item>
                                <el-input readonly v-model="formData.planTypeName"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>分标委议长：</td>
                        <td>
                            <el-form-item>
                                <el-input readonly v-model="formData.planTypeName"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>科技创新部部长：</td>
                        <td>
                            <el-form-item>
                                <el-input readonly v-model="formData.planTypeName"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>设计指南管理员：</td>
                        <td>
                            <el-form-item>
                                <el-input readonly v-model="formData.planTypeName"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                </table>
            </div>
        </el-form>
    </div>
</div>
</template>

<script>
import { getGudePlanDetails } from '../api/guide.js';
export default {
    name: 'preparationDetails',
    data() {
        return {
            loading: false,
            formData: {},
            infoList: [],
            modularInnerId: '',
        }
    },
    props: {
        id: String
    },
    created() {
        // console.log(this.id)
        this.getGudePlanDetails()
    },
    methods: {
        getGudePlanDetails() {
            getGudePlanDetails(this.id).then(res => {
                console.log(res.data)
                this.formData = res.data
            })
        }
    }
}
</script>

<style lang="less" scoped>
/deep/ .el-select::placeholder {
    color: red;
}

// /deep/ .el-button {
//     width: 70px;
//     height: 36px;
// }
/deep/ .el-form-item {
    margin-bottom: 0;
}

/deep/ .el-form-item--mini.el-form-item {
    margin-bottom: 0;
}

/deep/ .el-link {
    margin-right: 10px;
    color: #0000ff;
    font-size: 16px;
}

/deep/ .el-input--suffix,
/deep/ .el-form-item {
    width: 140px;
}

/deep/ .el-textarea__inner {
    border: 1px solid #dcdfe6;
    // width: 600px;
}

/deep/ .el-textarea__inner {
    width: 608px;
}

.ecoFileUploadBtn /deep/ .el-button {
    border: none;
}

.guideAdd {
    width: 100%;
    height: 100%;

    .center {
        width: 760px;
        margin: 20px auto;
    }

    /deep/ .el-divider {
        width: 760px;
        margin-left: -21px;
    }

    .basicInfo {
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
        background: white;
        font-size: 12px;
        border-bottom: 1px solid #DCDFE6;
        border-left: 1px solid #DCDFE6;
        border-right: 1px solid #DCDFE6;
        padding-bottom: 20px;
        box-sizing: border-box;

        table {
            width: 100%;
            height: 100%;

            tr {
                td {
                    padding: 5px;
                    box-sizing: border-box;

                    &:nth-child(1) {
                        width: 100px;
                        // padding: 10px;
                        box-sizing: border-box;
                    }

                    &:nth-child(3) {
                        width: 100px;
                        // padding: 10px;
                        box-sizing: border-box;
                    }
                }
            }
        }
    }

    .adjustInfo {
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
        background: white;
        font-size: 12px;
        border-bottom: 1px solid #DCDFE6;
        border-left: 1px solid #DCDFE6;
        border-right: 1px solid #DCDFE6;
        padding-bottom: 20px;
        box-sizing: border-box;

        table {
            width: 100%;
            height: 100%;

            tr {
                td {
                    padding: 5px;
                    box-sizing: border-box;

                    &:nth-child(1) {
                        width: 100px;
                        // padding: 10px;
                        box-sizing: border-box;
                    }

                    &:nth-child(3) {
                        width: 100px;
                        // padding: 10px;
                        box-sizing: border-box;
                    }
                }
            }
        }
    }

    .approval {
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
        background: white;
        font-size: 12px;
        border-bottom: 1px solid #DCDFE6;
        border-left: 1px solid #DCDFE6;
        border-right: 1px solid #DCDFE6;
        padding-bottom: 20px;
        box-sizing: border-box;

        table {
            width: 100%;
            height: 100%;

            tr {
                td {
                    padding: 5px 0px 5px 5px;
                    box-sizing: border-box;

                    &:nth-child(1) {
                        width: 100px;
                        // padding: 10px;
                        white-space: nowrap;
                        box-sizing: border-box;
                    }

                }
            }
        }
    }

    .footer {
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: center;
        margin-top: 10px;
    }
}
</style>
