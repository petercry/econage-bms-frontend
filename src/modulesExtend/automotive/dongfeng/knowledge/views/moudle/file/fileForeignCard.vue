<template>
<div class="kmForeign" v-show="data!=''">
    <div class="center">
        <el-form label-width="120px" class="demo-ruleForm" label-position="left" :model="form.data">
            <div class="center">
                <table>
                    <tr>
                        <td>标准大类：</td>
                        <td>
                            <el-form-item>
                                <el-input v-model="form.data.stdCategoryName" readonly="readonly"></el-input>
                            </el-form-item>
                        </td>
                        <td>标准小类：</td>
                        <td>
                            <el-form-item>
                                <el-input v-model="form.data.stdSubCategoryName" readonly="readonly"></el-input>
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
                        <td>分类号：</td>
                        <td>
                            <el-form-item>
                                <!-- <el-select v-model="form.data.categoryNum" placeholder="请选择" disabled>
                                    <el-option label="有效" value="有效"></el-option>
                                    <el-option label="无效" value="无效"></el-option>
                                </el-select> -->
                                <el-input v-model="form.data.categoryNum" readonly="readonly"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>标准名称：</td>
                        <td>
                            <el-form-item>
                                <el-input v-model="form.data.stdName" readonly="readonly"></el-input>
                            </el-form-item>
                        </td>
                        <td>英文名称：</td>
                        <td>
                            <el-form-item>
                                <el-input v-model="form.data.enName" readonly="readonly"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>体系码：</td>
                        <td>
                            <el-form-item>
                                <el-input v-model="form.data.systemCode" readonly="readonly"></el-input>
                            </el-form-item>
                        </td>
                        <td>补充码：</td>
                        <td>
                            <el-form-item>
                                <el-input v-model="form.data.supplementaryCode" readonly="readonly"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>被替代标准：</td>
                        <td>
                            <el-form-item>
                                <el-input v-model="form.data.substituteCode" readonly="readonly"></el-input>
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
                        <td>标准内容简介：</td>
                        <td colspan='3'>
                            <el-form-item>
                                <el-input v-model="form.data.stdContent" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" resize="none" readonly="readonly"></el-input>
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
                        <td>实施时间：</td>
                        <td>
                            <el-form-item>
                                <el-input v-model="form.data.implementDate" type="date" readonly="readonly"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>采用国际编号：</td>
                        <td>
                            <el-form-item>
                                <el-input v-model="form.data.internationalCode" readonly="readonly"></el-input>
                            </el-form-item>
                        </td>
                        <td>采标关系：</td>
                        <td>
                            <el-form-item>
                                <el-input v-model="form.data.adoptStdRelationship" readonly="readonly"></el-input>
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
export default {
    props: {
        data: {}
    },
    data() {
        return {
            form: {
                data: { //卡片信息
                    id: '',
                    stdCategory: '', //标准大类
                    stdSubCategory: '', //标准小类
                    categoryNum: '', //分类号
                    systemCode: '', //标准编号
                    stdName: '', //标准名称
                    enName: '', //英文名称
                    systemCode: '', //体系码
                    supplementaryCode: '', //补充码
                    substituteId: '', //替代标准id
                    substituteCode: '', //替代标准
                    effectiveness: '', //有效性
                    stdContent: '', //标准内容简介
                    publishDate: '', //发布日期
                    implementDate: '', //实施时间
                    internationalCode: '', //采用国际标准编号
                    adoptStdRelationship: '', //采标关系
                }
            },
            type: '',
            exposeMembers: '',
            hideMembers: '',
            manageMembers: '',
            loading: false,
            modularInnerId: "",
            fileList: [],
            baseId: '',
        }
    },
    mounted() {
        console.log(this.$props)
        if (this.$props.data) {
            // console.log("111")
            this.form.data = this.$props.data
        }
    },
    watch: {
        data(nv, ov) {
            // console.log(nv)
            this.form.data = nv
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

.kmForeign {
    width: 100%;
    height: 100%;

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
            width: 700px;
            height: 100%;
            margin: 0 auto;

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
