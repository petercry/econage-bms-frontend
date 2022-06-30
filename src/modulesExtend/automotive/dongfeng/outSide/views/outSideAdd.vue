<template>
<div class="kmAdd">
    <div class="center">
        <el-form class="demo-ruleForm" label-position="left" :model="form.data" :rules="rules" ref="ruleForm">
            <table>
                <tr>
                    <td><i>*</i>标准大类</td>
                    <td>
                        <el-form-item prop="stdCategory">
                            <el-select v-model="form.data.stdCategory" placeholder="请选择">
                                <el-option v-for="item in stdCategoryList" :key="item.id" :label="item.text" :value="item.id" @click.native="changeStdCategory(item)"></el-option>
                            </el-select>
                        </el-form-item>
                    </td>
                    <td><i>*</i>标准小类</td>
                    <td>
                        <el-form-item prop="stdSubCategory">
                            <el-select v-model="form.data.stdSubCategory" placeholder="请选择">
                                <el-option v-for="item in stdSubCategoryList" :key="item.id" :label="item.text" :value="item.id"></el-option>
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
                            <el-input v-model="form.data.categoryNum"></el-input>
                        </el-form-item>
                    </td>
                    <td><i>*</i>标准编号</td>
                    <td>
                        <el-form-item prop="stdCode">
                            <el-input v-model="form.data.stdCode"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td><i>*</i>标准名称</td>
                    <td>
                        <el-form-item prop="stdName">
                            <el-input v-model="form.data.stdName"></el-input>
                        </el-form-item>
                    </td>
                    <td>英文名称</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.enName"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>体系码</td>
                    <td>
                        <el-form-item ref='systemCodeFormItem'>
                            <!-- <el-input v-model="form.data.systemCode"></el-input> -->
                            <el-input @click.native.stop='selectSystemCode' placeholder='请输入' v-model='form.data.systemCode'></el-input>
                        </el-form-item>

                    </td>
                    <td>补充码</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.supplementaryCode"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>被替代标准</td>
                    <td>
                        <el-form-item>
                            <el-select v-model="form.data.substituteIds" placeholder="请选择" multiple>
                                <el-option v-for="item in outSideList" :key="item.id" :label="item.stdName" :value="item.id"></el-option>
                            </el-select>
                            <!-- <el-input v-model="form.data.substituteCode"></el-input> -->
                        </el-form-item>
                    </td>
                    <td><i>*</i>有效性</td>
                    <td>
                        <el-form-item prop="effectiveness">
                            <el-select v-model="form.data.effectiveness" placeholder="请选择">
                                <!-- <el-option label="有效" value="有效"></el-option>
                                <el-option label="无效" value="无效"></el-option> -->
                                <el-option v-for="item in youXXList" :key="item.id" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td><i>*</i>标准内容简介</td>
                    <td colspan='3'>
                        <el-form-item prop="stdContent">
                            <el-input v-model="form.data.stdContent" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" resize="none"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>发布日期：</td>
                    <td>
                        <el-form-item>
                            <!-- <el-input v-model="form.data.publishDate" type="date"></el-input> -->
                            <el-date-picker style="width:200px" v-model="form.data.publishDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                        </el-form-item>
                    </td>
                    <td>实施时间：</td>
                    <td>
                        <el-form-item>
                            <!-- <el-input v-model="form.data.implementDate" type="date"></el-input> -->
                            <el-date-picker style="width:200px" v-model="form.data.implementDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
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
import { newAddOutside, getItemFetchId, getYouXX, getstdCategory, getstdSubCategory, selectOutsideList } from '../api/outside.js'
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
                }
            },
            allowOnlineEdit: '',
            fileList: [],
            youXXList: [],
            outSideList: [],
            loading: false,
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
                effectiveness: [
                    { required: true, message: '请选择有效性', trigger: 'change' }
                ]
            },
            stdCategoryList: [],
            stdSubCategoryList: []
        }
    },
    components: {
        ecoFileUploadBtn
    },
    created() {
        this.getItemFetchId()
        this.getYouXXList()
        this.getstdCategory()
        this.getOutsideList()
    },
    mounted() {
        this.callAction();
    },
    methods: {
        callAction() {
            let this_ = this
            let callBackDialogFunc = function (obj) {
                if (obj && (obj.action === 'selectSystemCode')) {
                    this_.form.data.systemCode = obj.data.code;
                    this_.$refs.systemCodeFormItem.clearValidate()
                }
                if (obj && (obj.action === 'selectKnowLib')) {
                    this_.doitKnowCase(obj.data);
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'editPlanPage');
        },
        selectSystemCode() {
            let url = "/outSide/index.html#/selectSystemCode";
            EcoUtil.getSysvm().openDialog('外来标准体系树', url, '400', '600', "15vh");
        },
        doitKnowCase(data) {
            //归档
            let loadingInstance = Loading.service({ fullscreen: true, text: '正在创建...' });
            newAddOutside(this.form,data.parentId).then((res) => {
                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close();
                    let doObj = {}
                    doObj.action = 'addNewFileCallBack';
                    doObj.data = {};
                    doObj.data.queryObj = this.form;
                    doObj.close = true;
                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
                });
            }).catch(err => {
                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close();
                });
            });
        },
        getOutsideList() {
            selectOutsideList(this.info).then(res => {
                // console.log(res.rows)
                this.outSideList = res.rows
            })
        },
        // 关联id
        getItemFetchId() {
            getItemFetchId().then(res => {
                this.modularInnerId = res
            })
        },
        fileChange(file, fileList) {
            this.loading = true;
        },
        fileOnSuccess(response, file, fileList) {
            this.fileList = []
            // console.log(response)
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
            // console.log(this.fileList)
            // console.log(this.form.data.substituteIds)
            if (this.fileList.length == 0) {
                this.$message({ type: 'warning', message: '请上传文件文件！' });
                return ''
            }
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.openKnow()
                } else {
                    return false
                }
            })
        },
        openKnow() {
            // this.$router.push({ name: 'knowLedgeIndex' })
            let url = "/outSide/index.html#/knowLedgeIndex";
            EcoUtil.getSysvm().openDialog('知识库', url, '900', '600', "15vh");
        },
        deleteFile(item, index) {
            this.$refs.fileUpload.handleRemove(item, index)
            this.fileList.splice(index, 1);
        },
        cancelFunc() {
            EcoUtil.getSysvm().closeDialog();
        },
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
            this.form.data.stdSubCategory = ''
            // console.log(this.stdSubCategoryList)
            getstdSubCategory(data.id).then(res => {
                // console.log(res)
                this.stdSubCategoryList = res
            })
        }
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

/deep/ .el-input--mini {
    width: 200px;
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
    width: 530px;
}

.ecoFileUploadBtn /deep/ .el-button {
    border: none;
}

.kmAdd {
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
                i {
                    color: red;
                }
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
