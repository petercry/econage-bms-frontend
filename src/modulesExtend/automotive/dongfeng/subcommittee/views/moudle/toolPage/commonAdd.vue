<template>
<div class="fileUpload" v-loading="loading">
    <!-- 上传文档 -->
    <div>
        <el-form label-width="120px" class="demo-ruleForm" label-position="left" :model="form.data" :rules="rules" ref="ruleForm">
            <el-form-item label="文件">
                <eco-file-upload-btn :showList="false" :multiple="false" :modular="'knowledge'" ref="fileUpload" :modularInnerId="modularInnerId" @fileChange="fileChange" style="width:142px;display:inline-block;" @fileOnSuccess="fileOnSuccess"></eco-file-upload-btn>
                <div style="display:inline-block;width:63%" class="fileBox" v-for="(item,index) in fileList" :key="item.id">
                    <div class="fileName" style="display:inline-block;">
                        {{item.name || item.fileName}}
                    </div>
                    <i v-show="item.name!=''" class="el-icon-close" style="float:right;line-height:36px;cursor:pointer" @click="deleteFile(item,index)"></i>
                </div>
            </el-form-item>

            <div class="kmCommon">
                <!-- 通用文档 -->
                <div class="center">
                    <table>
                        <tr>
                            <td><i>*</i>标准分类：</td>
                            <td>
                                <el-form-item prop="stdCategory">
                                    <el-select v-model="form.data.stdCategory" placeholder="请选择">
                                        <el-option v-for="item in stdCategoryList" :key="item.id" :label="item.text" :value="item.text" ></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                            <td><i>*</i>标准编号：</td>
                            <td>
                                <el-form-item prop="stdCode">
                                    <el-input v-model="form.data.stdCode"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td><i>*</i>标准名称：</td>
                            <td>
                                <el-form-item prop="stdName">
                                    <el-input v-model="form.data.stdName"></el-input>
                                </el-form-item>
                            </td>
                            <td>英文名称：</td>
                            <td>
                                <el-form-item>
                                    <el-input v-model="form.data.enName"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td><i>*</i>体系码：</td>
                            <td>
                                <el-form-item prop="systemCode">
                                    <el-input v-model="form.data.systemCode"></el-input>
                                </el-form-item>
                            </td>
                            <td><i>*</i>补充码：</td>
                            <td>
                                <el-form-item prop="supplementaryCode">
                                    <el-select v-model="form.data.supplementaryCode" placeholder="请选择">
                                       <el-option v-for="item in supplementaryCodeList" :key="item.id" :label="item.text" :value="item.text"></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                        <tr>
                            <td><i>*</i>被替代标准：</td>
                            <td>
                                <el-form-item>
                                    <el-select v-model="form.data.substituteCode" placeholder="请选择">
                                      <el-option v-for="item in supplementaryCodeList" :key="item.id" :label="item.text" :value="item.text"></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                            <td><i>*</i>有效性：</td>
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
                            <td><i>*</i>标准内容简介：</td>
                            <td colspan='3'>
                                <el-form-item prop="stdContent">
                                    <el-input v-model="form.data.stdContent" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" resize="none"></el-input>
                                </el-form-item>
                            </td>
                        <tr>
                            <td><i>*</i>发布日期：</td>
                            <td>
                                <el-form-item prop="publishDate">
                                    <el-input v-model="form.data.publishDate" type="date"></el-input>
                                </el-form-item>
                            </td>
                            <td><i>*</i>实施时间：</td>
                            <td>
                                <el-form-item prop="implementDate">
                                    <el-input v-model="form.data.implementDate" type="date"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <el-form-item label="查看用户">
                <tag-select style="width:400px;vertical-align: top;" :initDataStr="exposeMembers" ref="tagSelect" :initOptions="{selectNum:0,selectType:'user-dept'}" @callBack="exposeMember">
                </tag-select>
            </el-form-item>
            <el-form-item label="查看用户安全设置">
                <el-checkbox v-model="form.attr.allowDownload">允许下载</el-checkbox>
                <el-checkbox v-model="form.attr.allowOnlineEdit">允许在线编辑</el-checkbox>
            </el-form-item>
            <el-form-item label="隐藏用户">
                <tag-select style="width:400px;vertical-align: top;" :initDataStr="hideMembers" ref="tagSelect" :initOptions="{selectNum:0,selectType:'user-dept'}" @callBack="hideMember">
                </tag-select>
            </el-form-item>
            <el-form-item label="管理用户">
                <tag-select style="width:400px;vertical-align: top;" :initDataStr="manageMembers" ref="tagSelect" :initOptions="{selectNum:0,selectType:'user-dept'}" @callBack="manageMember">
                </tag-select>
            </el-form-item>
        </el-form>
        <div style="textAlign:center;margin-top:20px">
            <el-button @click="cancelFunc">取消</el-button>
            <el-button type="primary" @click="editFunc" v-if="data">保存</el-button>
            <el-button type="primary" @click="createFunc" v-else>确定</el-button>
        </div>
    </div>
</div>
</template>

<script>
import { newAddCommon, editCommon,getSupplementaryCode,getStdCategory } from '../../../api/fileCard.js'
import { getItemFetchId } from '@/modules/knowledge/api/common.js'
import ecoFileUploadBtn from '@/components/file/ecoFileUploadBtn.vue'
import tagSelect from '@/components/orgPick/tagSelect.vue'
import EcoUtil from '@/components/util/main.js'
import { Loading } from 'element-ui'
import { mapState, mapMutations } from 'vuex';
export default {
    name: 'fileUpload',
    components: {
        tagSelect,
        ecoFileUploadBtn,
    },
    props: {
        data: {}
    },
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
                    stdCategory: '', //标准分类
                    stdCode: '', //标准编号
                    stdName: '', //标准名称
                    enName: '', //英文名称
                    systemCode: '', //体系码
                    supplementaryCode: '', //补充码
                    substituteCode: '', //替代标准
                    substituteId: '', //替代标准id
                    stdContent: '', //标准内容简介
                    publishDate: '', //发布日期
                    implementDate: '', //实施日期
                    effectiveness: '' //有效性
                }
            },
            exposeMembers: '',
            hideMembers: '',
            manageMembers: '',
            loading: false,
            modularInnerId: "",
            fileList: [],
            baseId: '',
            rules: {
                file: [
                    { required: true, message: '请选择文件', trigger: 'blur' },
                ],
                stdCategory: [
                    { required: true, message: '请选择标准分类', trigger: 'change' }
                ],
                stdCode: [
                    { required: true, message: '请输入标准编号', trigger: 'blur' },
                ],
                stdName: [
                    { required: true, message: '请输入标准名称', trigger: 'blur' },
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
                stdContent: [
                    { required: true, message: '请输入标准内容简介', trigger: 'blur' },
                ],
            },
            supplementaryCodeList:[],
            stdCategoryList:[]
        }
    },
    computed: {
        ...mapState(['fileTableNode', 'fileTreeNode'])
    },
    created() {
        // console.log(this.$route)
        this.getItemFetchId();
        this.baseId = this.$route.params.id
        let entryId = this.$route.params.activeid
        if (entryId == '-1') {
            this.form.entity.parentId = ""
        } else {
            this.form.entity.parentId = entryId
        }
    },
    mounted() {
        //  console.log(this.$props)
        if (this.$props.data) {
            // console.log("111")
            this.form = this.$props.data
            this.exposeMembers = this.data.exposeMembers
            this.hideMembers = this.data.hideMembers
            this.manageMembers = this.data.manageMembers
            // console.log(this.form)
            this.fileList.push(this.$props.data.attr)
        }
        this.getSupplementaryCode();
        this.getStdCategory('esProgramClass')
    },
    methods: {
         getStdCategory(parentId) {
            getStdCategory(parentId).then(res => {
                this.stdCategoryList = res
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
        getSupplementaryCode(){
            getSupplementaryCode().then(res=>{
                this.supplementaryCodeList=res    
            })
        },
        // 查看用户
        exposeMember(data) {
            if (data.itemArray.length > 0) {
                // let linkIds = [];
                // for (let i = 0; i < data.itemArray.length; i++) {
                //   linkIds.push({ 'memberId': data.itemArray[i].linkId });
                // }
                // this.form.exposeMembers = linkIds
                this.form.entity.exposeMembers = data.itemArray
            } else {
                this.exposeMembers = ''
                this.form.entity.exposeMembers = []
            }
        },
        // 隐藏用户
        hideMember(data) {
            if (data.itemArray.length > 0) {
                // let linkIds = [];
                // for (let i = 0; i < data.itemArray.length; i++) {
                //   linkIds.push({ 'memberId': data.itemArray[i].linkId });
                // }
                // this.form.hideMembers = linkIds
                this.form.entity.hideMembers = data.itemArray
            } else {
                this.hideMembers = ''
                this.form.entity.hideMembers = []
            }
        },
        // 管理用户
        manageMember(data) {
            if (data.itemArray.length > 0) {
                // let linkIds = [];
                // for (let i = 0; i < data.itemArray.length; i++) {
                //   linkIds.push({ 'memberId': data.itemArray[i].linkId });
                // }
                // this.form.manageMembers = linkIds
                this.form.entity.manageMembers = data.itemArray
            } else {
                this.manageMembers = ''
                this.form.entity.manageMembers = []
            }
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
        cancelFunc() {
            EcoUtil.getSysvm().closeDialog();
        },
        createFunc() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    let loadingInstance = Loading.service({ fullscreen: true, text: '正在创建...' });
                    newAddCommon(this.baseId, this.form).then((res) => {
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
        editFunc() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    let loadingInstance = Loading.service({ fullscreen: true, text: '正在创建...' });
                    editCommon(this.data.entity.baseId, this.form).then((res) => {
                        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                            loadingInstance.close();
                            this.$message({ type: 'success', message: '修改成功！' });
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
    },
    watch: {
        fileList(val) {
            if (val.length == 0) {
                this.rules.file.push({ required: true, message: '请选择文件', trigger: 'blur' })
            }
        },
        data(nv, ov) {
            if (nv != '') {
                this.form = nv
                // console.log(nv)
                this.exposeMembers = this.data.exposeMembers
                this.hideMembers = this.data.hideMembers
                this.manageMembers = this.data.manageMembers
                this.fileList.push(nv.attr)
                // console.log(this.fileList)
            }
        }
    },
}
</script>

<style lang="less" scoped>
.fileUpload {
    width: 600px;
    padding: 20px;
    box-sizing: border-box;
}

.ecoFileUploadBtn /deep/ .btn {
    margin-left: 0 !important;
}

.el-form .el-form-item /deep/ .fileBox:hover {
    background-color: #f5f7fa;
    border-radius: 4px;
    color: #409eff;
}

.kmCommon {
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
            width: 100%;
            height: 100%;

            tr {
                td {
                    padding: 10px;
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
