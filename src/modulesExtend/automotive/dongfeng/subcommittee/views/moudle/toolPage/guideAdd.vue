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
                <!-- 业务指南制修订 -->
                <div class="center">
                    <table>
                        <tr>
                            <td><i>*</i>卓越体系：</td>
                            <td>
                                <el-form-item prop="excellenceSystem">
                                    <el-select v-model="form.data.excellenceSystem" placeholder="请选择">
                                        <!-- <el-option v-for="item in normalSort" :key="item.value" :label="item.label" :value="item.value"></el-option> -->
                                        <el-option label="卓越体系" value="卓越体系"></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                            <td><i>*</i>业务指南名称：</td>
                            <td>
                                <el-form-item prop="businessGuideName">
                                    <el-input v-model="form.data.businessGuideName"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td><i>*</i>业务指南编制目的及内容简介：</td>
                            <td colspan='3'>
                                <el-form-item prop="purposeContent">
                                    <el-input v-model="form.data.purposeContent" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" resize="none"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td><i>*</i>初稿完成时间：</td>
                            <td>
                                <el-form-item prop="draftCompleteTime">
                                    <el-input prop="name" v-model="form.data.draftCompleteTime" type="date"></el-input>
                                </el-form-item>
                            </td>
                            <td><i>*</i>会签完成时间：</td>
                            <td>
                                <el-form-item prop="countersignCompleteTime">
                                    <el-input prop="name" v-model="form.data.countersignCompleteTime" type="date"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                             <td><i>*</i>部门：</td>
                            <td>
                                <el-form-item prop="dept">
                                    <el-select v-model="form.data.dept" placeholder="请选择部门">
                                        <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.name" @click.native="changeOffice(item)"></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                            <td><i>*</i>科室：</td>
                            <td>
                                <el-form-item prop="office">
                                    <el-select v-model="form.data.office" placeholder="请先选择部门">
                                        <el-option v-for="item in officeList" :key="item.id" :label="item.i18nText" :value="item.i18nText" ></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td><i>*</i>制定人：</td>
                            <td>
                                <el-form-item>
                                    <tag-select style="width:200px;vertical-align: top;" :initDataStr="maker" ref="tagSelect" :initOptions="{selectNum:0,selectType:'user-dept'}" @callBack="makerMember">
                                    </tag-select>
                                </el-form-item>
                            </td>
                            <td><i>*</i>制/修订：</td>
                            <td>
                                <el-form-item prop="revisionType">
                                    <el-select v-model="form.data.revisionType" placeholder="请选择">
                                        <el-option label="制定" value="制定"></el-option>
                                        <el-option label="修订" value="修订"></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td><i>*</i>责任人：</td>
                            <td>
                                <el-form-item>
                                    <tag-select style="width:200px;vertical-align: top;" :initDataStr="responsibleUser" ref="tagSelect" :initOptions="{selectNum:0,selectType:'user-dept'}" @callBack="responsMember"></tag-select>
                                </el-form-item>
                            </td>
                            <td>年度：</td>
                            <td>
                                <el-form-item>
                                    <el-input prop="name" v-model="form.data.year"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td colspan='4'>起草人信息
                                <table style="width:400px;text-align:center;margin-left:120px" border="1">
                                    <tr>
                                        <td>姓名</td>
                                        <td>起草人排序</td>
                                    </tr>
                                    <tr>
                                        <td style="padding-left:10px">
                                           <tag-select style="width:200px;vertical-align: top;" :initDataStr="draftMembers" ref="tagSelect" :initOptions="{selectNum:0,selectType:'user-dept'}" @callBack="draftMember"></tag-select>
                                        </td>
                                        <td>
                                            <el-select v-model="order" placeholder="请先选择起草人姓名" >
                                                <el-option v-for="item in 6" :key="item" :label="item" :value="item" @click.native="changeOrder(item)"></el-option>
                                            </el-select>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td><i>*</i>是否同意：</td>
                            <td>
                                <el-form-item>
                                    <el-select v-model="form.data.approveType" placeholder="请选择">
                                        <el-option label="同意" value="同意"></el-option>
                                        <el-option label="不同意" value="不同意"></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                            <td>替代标准</td>
                            <td>
                                <el-form-item>
                                    <el-select v-model="form.data.substituteCode" placeholder="请选择">
                                        <el-option label="同意" value="同意"></el-option>
                                        <el-option label="不同意" value="不同意"></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td>备注：</td>
                            <td colspan='3'>
                                <el-form-item>
                                    <el-input v-model="form.entity.comments" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" resize="none"></el-input>
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
import { newAddCommon, editCommon,getDept,getOffice } from '../../../api/fileCard.js'
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
                    fileType: '',
                    comments: '', //备注
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
            maker: '',//制定人
            deptList: '',//部门
            officeList: '',//科室
            responsibleUser: '',
            draftMembers:'',//起草人信息
            order:'',
            loading: false,
            modularInnerId: "",
            fileList: [],
            baseId: '',
            rules: {
                file: [
                    { required: true, message: '请选择文件', trigger: 'blur' },
                ],
                excellenceSystem: [
                    { required: true, message: '请选择卓越体系', trigger: 'change' },
                ],
                businessGuideName: [
                    { required: true, message: '请输入业务指南名称', trigger: 'blur' },
                ],
                countersignCompleteTime: [
                    { required: true, message: '会签完成时间', trigger: 'blur' },
                ],
                implementTime: [
                    { required: true, message: '实施时间', trigger: 'blur' },
                ],
                countersignActualTime: [
                    { required: true, message: '实际会签时间', trigger: 'blur' },
                ],
                publishDate: [
                    { required: true, message: '发布日期', trigger: 'blur' },
                ],
                stdCategory: [
                    { required: true, message: '请选择标准分类', trigger: 'change' }
                ],
                stdType: [
                    { required: true, message: '请选择标准类型', trigger: 'change' }
                ],
                stdCode: [
                    { required: true, message: '请选择标准编号', trigger: 'change' }
                ],
                stdName: [
                    { required: true, message: '请输入标准名称', trigger: 'blur' }
                ],
                systemCode: [
                    { required: true, message: '请输入体系码', trigger: 'blur' }
                ],
                purposeContent: [
                    { required: true, message: '请输入体系码', trigger: 'blur' }
                ],
                dept: [
                    { required: true, message: '请选择部门', trigger: 'change' }
                ],
                office: [
                    { required: true, message: '请选择科室', trigger: 'change' }
                ],
                subcommittee: [
                    { required: true, message: '请选择分标委', trigger: 'change' }
                ],
            }
        }
    },
    computed: {
        ...mapState(['fileTableNode', 'fileTreeNode'])
    },
    created() {
        this.getItemFetchId();
        this.baseId = this.$route.params.id
        let entryId = this.$route.params.activeid
        if (entryId == '-1') {
            this.form.parentId = ""
        } else {
            this.form.parentId = entryId
        }
    },
    mounted() {
        if (this.$props.data) {
            // console.log("111")
            this.form = this.$props.data
            // console.log(this.form)
            this.exposeMembers = this.data.exposeMembers
            this.hideMembers = this.data.hideMembers
            this.manageMembers = this.data.manageMembers
            this.fileList.push(this.$props.data.attr)
        }
    },
    methods: {
        getItemFetchId() {
            getItemFetchId().then(res => {
                this.modularInnerId = res;
                // this.form.id = this.modularInnerId;
                this.loading = false;
            })
        },
         //部门
        getDept() {
            getDept().then(res => {
                // console.log(res)
                this.deptList = [res]
            })
        },
        //科室
        changeOffice(data) {
            // console.log(data)
            getOffice().then(res => {
                this.officeList = [res]
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
        // 制定人
        makerMember(data) {
            if (data.itemArray.length > 0) {
                // let linkIds = [];
                // for (let i = 0; i < data.itemArray.length; i++) {
                //   linkIds.push({ 'memberId': data.itemArray[i].linkId });
                // }
                // this.form.exposeMembers = linkIds
                this.form.data.maker = data.itemArray[0].linkId
            } else {
                this.exposeMembers = ''
                this.form.data.maker = ''
            }
        },
        // 责任人
        responsMember(data) {
            if (data.itemArray.length > 0) {
                // let linkIds = [];
                // for (let i = 0; i < data.itemArray.length; i++) {
                //   linkIds.push({ 'memberId': data.itemArray[i].linkId });
                // }
                // this.form.exposeMembers = linkIds
                this.form.data.responsibleUser = data.itemArray[0].linkId
            } else {
                this.exposeMembers = ''
                this.form.data.responsibleUser = ''
            }
        },
        // 起草人
        draftMember(data) {
            if (data.itemArray.length > 0) {
                // let linkIds = [];
                // for (let i = 0; i < data.itemArray.length; i++) {
                //   linkIds.push({ 'memberId': data.itemArray[i].linkId });
                // }
                // this.form.exposeMembers = linkIds
                this.form.data.draftMembers = data.itemArray[0]
            } else {
                this.exposeMembers = ''
                this.form.data.draftMembers = []
            }
        },
        changeOrder(data){
            if(this.form.data.draftMembers!=''){
                this.form.data.draftMembers.order = data
            }
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
            // this.$refs.fileUpload.handleRemove(item, index)
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
