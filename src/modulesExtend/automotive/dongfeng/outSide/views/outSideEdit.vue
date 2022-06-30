<template>
<div class="kmAdd">
    <div class="center">
        <el-form class="demo-ruleForm" label-position="left" :model="form.data" :rules="rules" ref="ruleForm">
            <table>
                <tr>
                    <td>标准大类</td>
                    <td>
                        <el-form-item prop="stdCategory">
                            <el-select v-model="form.data.stdCategory" placeholder="请选择">
                                <el-option label="国家标准" value="国家标准"></el-option>
                                <el-option label="行业标准" value="行业标准"></el-option>
                                <el-option label="国外标准" value="国外标准"></el-option>
                            </el-select>
                        </el-form-item>
                    </td>
                    <td>标准小类</td>
                    <td>
                        <el-form-item prop="stdSubCategory">
                            <el-select v-model="form.data.stdSubCategory" placeholder="请选择">
                                <el-option label="制定" value="制定"></el-option>
                                <el-option label="修订" value="修订"></el-option>
                            </el-select>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>分类号</td>
                    <td>
                        <el-form-item prop="categoryNum">
                            <el-select v-model="form.data.categoryNum" placeholder="请选择">
                                <el-option label="有效" value="有效"></el-option>
                                <el-option label="无效" value="无效"></el-option>
                            </el-select>
                        </el-form-item>
                    </td>
                    <td>标准编号</td>
                    <td>
                        <el-form-item prop="stdCode">
                            <el-input v-model="form.data.stdCode"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>标准名称</td>
                    <td colspan="3">
                        <el-form-item prop="stdName">
                            <el-input v-model="form.data.stdName"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>英文名称</td>
                    <td colspan="3">
                        <el-form-item>
                            <el-input v-model="form.data.enName"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>体系码</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.systemCode"></el-input>
                        </el-form-item>
                    </td>
                    <td>补充码</td>
                    <td>
                        <el-form-item prop="supplementaryCode">
                            <el-input v-model="form.data.supplementaryCode"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>被替代标准</td>
                    <td>
                        <el-form-item prop="substituteCode">
                            <el-select v-model="form.data.substituteCode" placeholder="请选择">
                                <el-option label="同意" value="同意"></el-option>
                                <el-option label="不同意" value="不同意"></el-option>
                            </el-select>
                        </el-form-item>
                    </td>
                    <td>有效性</td>
                    <td>
                        <el-form-item prop="effectiveness">
                            <el-select v-model="form.data.effectiveness" placeholder="请选择">
                                <el-option label="有效" value="有效"></el-option>
                                <el-option label="无效" value="无效"></el-option>
                            </el-select>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>标准内容简介</td>
                    <td colspan='3'>
                        <el-form-item prop="stdContent">
                            <el-input v-model="form.data.stdContent" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" resize="none"></el-input>
                        </el-form-item>

                    </td>
                </tr>
                <tr>
                    <td>发布日期：</td>
                    <td>
                        <el-form-item prop="publishDate">
                            <el-input v-model="form.data.publishDate" type="date"></el-input>
                        </el-form-item>
                    </td>
                    <td>实施时间：</td>
                    <td>
                        <el-form-item prop="implementDate">
                            <el-input v-model="form.data.implementDate" type="date"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>采用国际标准编号</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.internationalCode"></el-input>
                        </el-form-item>
                    </td>
                    <td>采标关系</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.adoptStdRelationship"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>标准附件</td>
                    <td>
                        <eco-file-upload-btn :showList="false" :multiple="false" :modular="'outside'" ref="fileUpload" :modularInnerId="modularInnerId" @fileChange="fileChange" style="width:142px;display:inline-block;" @fileOnSuccess="fileOnSuccess"></eco-file-upload-btn>
                    </td>
                    <td colspan="2">
                        <div style="display:inline-block;width:63%" class="fileBox" v-for="(item,index) in fileList" :key="item.id">
                            <div class="fileName" style="display:inline-block;">{{item.name}}</div>
                            <i v-show="item.name!=''" class="el-icon-close" style="float:right;line-height:36px;cursor:pointer" @click="deleteFile(item,index)"></i>
                        </div>
                    </td>
                </tr>

            </table>

        </el-form>
        <div class="footer">
            <el-button type="primary" @click="createFunc">保存</el-button>
            <el-button type="primary" @click="cancelFunc">关闭</el-button>
        </div>
    </div>
</div>
</template>

<script>
import ecoFileUploadBtn from '@/components/file/ecoFileUploadBtn.vue'
import EcoUtil from '@/components/util/main.js'
import { Loading } from 'element-ui'
import { newAddOutside,selectOutsideList } from '../api/outside.js'
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
            allowOnlineEdit: '',
            fileList: [],
            loading: false,
            outSideList:[],
            modularInnerId: "",
            rules: {
                file: [
                    { required: true, message: '请选择文件', trigger: 'blur' },
                ],
                stdCategory: [
                    { required: true, message: '请选择标准大类', trigger: 'change' }
                ],
                stdSubCategory: [
                    { required: true, message: '请选择标准小类', trigger: 'change' }
                ],
                stdCode: [
                    { required: true, message: '请输入标准编号', trigger: 'blur' },
                ],
                stdContent: [
                    { required: true, message: '请输入标准内容简介', trigger: 'blur' },
                ],
                stdName: [
                    { required: true, message: '请输入标准名称', trigger: 'blur' },
                ],
                categoryNum: [
                    { required: true, message: '请选择分类号', trigger: 'change' },
                ],
                publishDate: [
                    { required: true, message: '请选择发布日期', trigger: 'blur' },
                ],
                implementDate: [
                    { required: true, message: '请选择实施日期', trigger: 'blur' },
                ],
                supplementaryCode: [
                    { required: true, message: '请选择补充码', trigger: 'change' }
                ],
                effectiveness: [
                    { required: true, message: '请选择有效性', trigger: 'change' }
                ],
            }
        }
    },
    components: {
        ecoFileUploadBtn
    },
    created() {
        console.log(this.$route)
        if (this.$route.params.id) {
            this.form.data.id = this.$route.params.id
        }
        this.getOutsideList()
    },
    methods: {
        getOutsideList() {
            selectOutsideList(this.info).then(res => {
                // console.log(res.rows)
                this.outSideList = res.rows
            })
        },
        uploadAdd() {
            console.log(this.$refs['fileUpload'])
            this.$refs['fileUpload'].uploadclick()
        },
        fileChange(file, fileList) {
            this.loading = true;
        },
        fileOnSuccess(response, file, fileList) {
            this.loading = false;
            this.fileList.push(response)
            // console.log(this.fileList)
            this.form.attr.fileHeaderId = response.id;
            this.form.attr.fileName = response.name;
            this.form.attr.name = response.name;
            this.form.entity.name = response.name;
            this.form.attr.fileType = response.fileType;
            this.form.entity.fileType = response.fileType;
            this.form.data.id = response.modularInnerId;
            this.rules.file = []
            this.$refs.ruleForm.clearValidate()
        },
        createFunc() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    let loadingInstance = Loading.service({ fullscreen: true, text: '正在创建...' });
                    newAddOutside(this.form).then((res) => {
                        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                            loadingInstance.close();
                            this.$message({ type: 'success', message: '创建成功！' });
                            let doObj = {}
                            doObj.action = 'addNewFileCallBack';
                            doObj.data = {};
                            doObj.data.queryObj = this.form;
                            doObj.close = true;
                            EcoUtil.getSysvm().callBackDialogFunc(doObj);
                        });
                    });
                } else {
                    return false
                }
            })
        },
        deleteFile(item, index) {
            this.$refs.fileUpload.handleRemove(item, index)
            this.fileList.splice(index, 1);
        },
        cancelFunc() {
            EcoUtil.getSysvm().closeDialog();
        },
    },
    watch: {
        fileList(val) {
            if (val.length == 0) {
                this.rules.file.push({ required: true, message: '请选择文件', trigger: 'blur' })
            }
        }
    },
}
</script>

<style lang="less" scoped>
/deep/ .el-select::placeholder {
    color: red;
}

/deep/ .el-button {
    width: 70px;
    height: 36px;
}

/deep/ .el-form-item {
    margin-bottom: 0;
}

/deep/ .el-link {
    margin-right: 10px;
    color: #0000ff;
    font-size: 16px;
}

/deep/ .el-input--suffix {
    width: 250px;
}

/deep/ .el-input__inner {
    // width: 200px;
    // height: 30px;
    border: 1px solid #797979;
}

/deep/ .el-textarea__inner {
    border: 1px solid #797979;
    // width: 600px;
}

.ecoFileUploadBtn /deep/ .el-button {
    border: none;
}

.kmAdd {
    width: 100%;
    height: 100%;

    .center {
        width: 820px;
        margin: 20px auto;
        padding: 20px;
        box-sizing: border-box;
        background: white;
        border: 1px solid #797979;

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

        .footer {
            width: 100%;
            height: 50px;
            line-height: 50px;
            text-align: center;
            margin-top: 10px;
        }
    }
}
</style>
