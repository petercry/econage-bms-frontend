<template>
<div class="kmForeign">
    <div class="center">
        <div class="header">
            <!-- <el-button>基本信息</el-button>
            <el-button>操作记录</el-button> -->
        </div>
        <el-form class="demo-ruleForm" label-position="left" :model="form.data">
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
                            <el-input v-model="form.data.subcommitteeName" readonly="readonly"></el-input>
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
                <tr>
                    <td>标准附件</td>
                    <td>
                        <div style="display:inline-block;width:63%" class="fileBox" v-for="item in fileList" :key="item.id">
                            <div class="fileName" style="display:inline-block;">{{item.fileName}}</div>

                        </div>
                    </td>
                    <td>操作：</td>
                    <td colspan='3'>
                        <el-link type="primary" @click.native="goIframe">预览</el-link>
                        <el-link type="primary" @click="fileDownload">下载</el-link>
                        <el-link type="primary">复制链接</el-link>
                    </td>
                </tr>
            </table>

        </el-form>
    </div>
</div>
</template>

<script>
import { outSideDetails, selectOutsideList } from '../api/standard.js'
import { sysEnv } from '../config/env.js'
import { EcoUtil } from '@/components/util/main.js'
import { EcoFile } from '@/components/file/main.js'
export default {
    data() {
        return {
            form: {
                entity: { //节点信息
                    exposeMembers: [],
                    hideMembers: [],
                    manageMembers: [],
                    baseId: '',
                    id: '',
                    parentId: '',
                    fileName: '',
                    fileType: ''
                },
                attr: { //文件属性
                    entryId: '',
                    fileHeaderId: '',
                    fileName: '',
                    name: '',
                    fileType: '',
                    fileCode: '',
                    keyword: '',
                    summary: '',
                    uploadIp: '',
                    uploadIntranet: false,
                    allowDownload: false,
                    allowOnlineEdit: false
                },
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
            id: '',
            fileList: [],
            outSideList: []
        }
    },
    created() {
        // console.log(this.$route.params)
        if (this.$route.params) {
            this.id = this.$route.params.id
        }
        this.getOutSideDetails()
        this.getOutsideList()
    },
    methods: {
        getOutSideDetails() {
            outSideDetails(this.id).then(res => {
                console.log(res)
                this.form = res
                this.fileList.push(res.attr)
            })
        },
        getOutsideList() {
            selectOutsideList(this.info).then(res => {
                // console.log(res.rows)
                this.outSideList = res.rows
            })
        },
        goIframe() {
            EcoFile.openFileHeaderByView(this.form.attr.fileHeaderId, this.form.attr.fileName)
        },
        fileDownload() {
            // console.log(this.form.attr.fileHeaderId,this.form.attr.fileName)
            EcoFile.openFileHeaderByDownload(this.form.attr.fileHeaderId, encodeURIComponent(this.form.attr.fileName));
        },
    }
}
</script>

<style lang="less" scoped>
/deep/ .el-select::placeholder {
    color: red;
}

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

/deep/ .el-input--suffix {
    width: 200px;
}

/deep/ .el-input__inner {
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    // height: 40px;
    line-height: 40px;
    outline: 0;
    padding: 0 15px;
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    width: 100%;
}

/deep/ .el-textarea__inner {
    border: 1px solid #dcdfe6;
    // width: 600px;
}

/deep/ .el-link {
    font-size: 14px;
}

.kmForeign {
    width: 100%;
    height: 100%;

    .center {
        width: 700px;
        margin: 20px auto;
        padding: 20px;
        box-sizing: border-box;
        background: white;
        font-size: 14px;

        table {
            width: 100%;
            height: 100%;

            tr {
                td {
                    padding: 10px;
                    box-sizing: border-box;

                    &:nth-child(odd) {
                        width: 120px;
                        padding: 10px;
                        box-sizing: border-box;
                    }
                }
            }
        }
    }
}
</style>
