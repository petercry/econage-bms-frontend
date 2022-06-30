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
                    <td>标准大类</td>
                    <td>
                        <el-form-item>
                            <el-select v-model="form.data.stdCategoryName" placeholder="请选择" disabled>
                                <el-option label="国家标准" value="国家标准"></el-option>
                                <el-option label="行业标准" value="行业标准"></el-option>
                                <el-option label="国外标准" value="国外标准"></el-option>
                            </el-select>
                        </el-form-item>
                    </td>
                    <td>标准小类</td>
                    <td>
                        <el-form-item>
                            <el-select v-model="form.data.stdSubCategoryName" placeholder="请选择" disabled>
                                <el-option label="标准小类1" value="标准小类1"></el-option>
                                <el-option label="标准小类2" value="标准小类2"></el-option>
                            </el-select>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>分类号</td>
                    <td>
                        <el-form-item>
                            <!-- <el-select v-model="form.data.categoryNum" placeholder="请选择">
                                <el-option label="有效" value="有效"></el-option>
                                <el-option label="无效" value="无效"></el-option>
                            </el-select> -->
                            <el-input v-model="form.data.categoryNum" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                    <td>标准编号</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.stdCode" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>标准名称</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.stdName" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                    <td>英文名称</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.enName" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>体系码</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.systemCode" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                    <td>补充码</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.supplementaryCode" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>被替代标准</td>
                    <td>
                        <el-select v-model="form.data.substituteIds" placeholder="请选择" multiple disabled>
                            <el-option v-for="item in outSideList" :key="item.id" :label="item.stdName" :value="item.id"></el-option>
                        </el-select>
                    </td>
                    <td>有效性</td>
                    <td>
                        <el-form-item>
                            <el-select v-model="form.data.effectivenessName" disabled>
                                <el-option label="有效" value="有效"></el-option>
                                <el-option label="无效" value="无效"></el-option>
                            </el-select>
                        </el-form-item>
                    </td>
                </tr>
                <!-- <tr>
                    <td>被替换标准ID</td>
                    <td colspan="3">
                        <el-select v-model="form.data.substituteId" multiple disabled>
                            <el-option label="1" value="1"></el-option>
                            <el-option label="2" value="2"></el-option>
                            <el-option label="3" value="3"></el-option>
                        </el-select>
                    </td>
                </tr> -->
                <tr>
                    <td>标准内容简介</td>
                    <td colspan='3'>
                        <el-form-item prop="stdContent">
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
                    <td>采用国际标准编号</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.internationalCode" readonly="readonly"></el-input>
                        </el-form-item>
                    </td>
                    <td>采标关系</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.adoptStdRelationship" readonly="readonly"></el-input>
                        </el-form-item>
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
import { outSideDetails, selectOutsideList } from '../api/outside.js'
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
            outSideList:[]
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
