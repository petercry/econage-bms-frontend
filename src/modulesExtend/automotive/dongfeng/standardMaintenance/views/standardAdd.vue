<template>
<div class="kmAdd">
    <div class="center">
        <el-form class="demo-ruleForm" label-position="left" :model="form.data" :rules="rules" ref="ruleForm">
            <el-form-item label="文件" style="margin-left:15px;" label-width="60px">
                <eco-file-upload-btn :showList="false" :multiple="false" :modular="'knowledge'" ref="fileUpload" :modularInnerId="modularInnerId" @fileChange="fileChange" style="width:142px;display:inline-block;" @fileOnSuccess="fileOnSuccess"></eco-file-upload-btn>
                <div style="display:inline-block;width:30%" class="fileBox" v-for="(item,index) in fileList" :key="item.id">
                    <div class="fileName" style="display:inline-block;">
                        {{item.name || item.fileName}}
                    </div>
                    <i v-show="item.fileName!=''" class="el-icon-close" style="float:right;line-height:30px;cursor:pointer" @click="deleteFile(item,index)"></i>
                </div>
            </el-form-item>
            <table>
                <tr>
                    <td><i>*</i>标准分类：</td>
                    <td>
                        <el-form-item prop="stdCategory">
                            <el-select v-model="form.data.stdCategory" placeholder="请选择">
                                <el-option v-for="item in stdCategoryList" :key="item.id" :label="item.text" :value="item.id" @click.native="changeStdCategory(item)"></el-option>
                            </el-select>
                        </el-form-item>
                    </td>
                    <td><i>*</i>标准类型：</td>
                    <td>
                        <el-form-item prop="stdType">
                            <el-select v-model="form.data.stdType" placeholder="请先选择标准分类">
                                <el-option v-for="item in stdTypeList" :key="item.id" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td><i>*</i>标准名称：</td>
                    <td colspan="3">
                        <el-form-item prop="stdName">
                            <el-input v-model="form.data.stdName" style="width:530px;"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td><i>*</i>标准编号：</td>
                    <td>
                        <el-form-item prop="stdCode">
                            <el-input v-model="form.data.stdCode"></el-input>
                        </el-form-item>
                    </td>
                    <td><i>*</i>体系码：</td>
                    <td>
                        <el-form-item prop="systemCode" ref='systemCodeFormItem'>
                            <el-input @click.native.stop='selectSystemCode' placeholder='请输入' v-model='form.data.systemCode'></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>年度：</td>
                    <td>
                        <el-form-item>
                            <el-input v-model="form.data.year"></el-input>
                        </el-form-item>
                    </td>
                    <td>制/修订</td>
                    <td>
                        <el-form-item>
                            <el-select v-model="form.data.revisionType" placeholder="请选择">
                                <el-option :value='item.id' :label='item.text' v-for='(item) in revisionType' :key='item.id'></el-option>
                            </el-select>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td><i>*</i>标准编制目的及内容简介：</td>
                    <td colspan='3'>
                        <el-form-item prop="purposeContent">
                            <el-input v-model="form.data.purposeContent" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" resize="none"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td><i>*</i>部门：</td>
                    <td>
                        <el-form-item prop='dept' ref='dept'>
                            <tag-select placeholder="选择机构" style="width:200px;vertical-align: top;" :initDataStr="deptInitDataStr" :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'dept')}">
                            </tag-select>
                        </el-form-item>
                    </td>
                    <td><i>*</i>科室：</td>
                    <td>
                        <el-form-item prop='office' ref='office'>
                            <tag-select placeholder="选择机构" style="width:200px;vertical-align: top;" :initDataStr="officeInitDataStr" :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'office')}">
                            </tag-select>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td><i>*</i>初稿完成时间：</td>
                    <td>
                        <el-form-item prop="draftCompleteTime">
                            <el-date-picker v-model="form.data.draftCompleteTime" type="date" placeholder="选择日期"></el-date-picker>
                        </el-form-item>
                    </td>
                    <td><i>*</i>会签完成时间：</td>
                    <td>
                        <el-form-item prop="countersignCompleteTime">
                            <el-date-picker v-model="form.data.countersignCompleteTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td><i>*</i>实施时间：</td>
                    <td>

                        <el-form-item prop="implementTime">
                            <el-date-picker v-model="form.data.implementTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                        </el-form-item>
                    </td>
                    <td><i>*</i>实际会签时间：</td>
                    <td>
                        <el-form-item prop="countersignActualTime">
                            <el-date-picker v-model="form.data.countersignActualTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td><i>*</i>发布日期：</td>
                    <td>
                        <el-form-item prop="publishDate">
                            <el-date-picker v-model="form.data.publishDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                        </el-form-item>
                    </td>
                    <td><i>*</i>分标委：</td>
                    <td>
                        <el-form-item prop="subcommittee">
                            <el-select v-model="form.data.subcommittee" placeholder="请选择">
                                <el-option v-for="item in subcommitteeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>规划来源：</td>
                    <td>
                        <el-form-item>
                            <el-select v-model="form.data.planSource" placeholder="请选择">
                                <el-option v-for="item in sourceList" :key="item.id" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </td>
                    <td>来源编号：</td>
                    <td>
                        <el-form-item>
                            <el-input prop="name" v-model="form.data.sourceCode"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>责任人：</td>
                    <td>
                        <el-form-item>
                            <tag-select style="width:200px;vertical-align: top;" :initDataStr="responsibleUser" ref="responsibleUser" :initOptions="{selectNum:1,selectType:'USER'}" @callBack="(data)=>{selectRoleUser(data,'responsibleUser')}"></tag-select>
                        </el-form-item>
                    </td>
                    <td>有效性：</td>
                    <td>
                        <el-form-item>

                            <el-select v-model="form.data.effectiveness" placeholder="请选择">
                                <el-option v-for="item in youXXList" :key="item.id" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </td>
                </tr>
                <tr>
                    <td>起草人信息</td>
                    <td colspan="3">
                        <tag-select style="width:530px;vertical-align:top;" :initDataStr="draftMembers" ref="draftMembersUser" :initOptions="{selectNum:0,selectType:'user-persion'}" @callBack="(data)=>{selectRoleUser(data,'draftMembersUser')}"></tag-select>
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
import tagSelect from '@/components/orgPick/tagSelect.vue'
import { Loading } from 'element-ui'
import { newAddOutside, getItemFetchId, getYouXX, getstdCategory, getstdSubCategory, selectOutsideList, getStdCategory } from '../api/standard.js'
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
                    fileType: '',
                    cooperateLookupMembers: [],
                    cooperateDownloadMembers: [],
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
                    effectiveness: '' //有效性
                }
            },
            exposeMembers: '',
            hideMembers: '',
            manageMembers: '',
            makerMembers: '',
            responsibleUser: '',
            draftMembers: '',
            cooperateLookupMembers: '',
            cooperateDownloadMembers: '',
            order: '',
            loading: false,
            modularInnerId: "",
            fileList: [],
            baseId: '',
            rules: {
                file: [
                    { required: true, message: '请选择文件', trigger: 'blur' },
                ],
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                ],
                draftCompleteTime: [
                    { required: true, message: '初稿完成时间', trigger: 'blur' },
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
                    { required: true, message: '请输入标准编制目的及内容简介：', trigger: 'blur' }
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
            },
            subcommitteeList: [], //分标委
            stdCategoryList: [], //标准分类
            stdTypeList: [], //标准类型,
            deptInitDataStr: '', //部门
            officeInitDataStr: '', //科室
            youXXList: [],
            sourceList: [],
            revisionType: [],
        }
    },
    components: {
        ecoFileUploadBtn,
        tagSelect
    },
    created() {
        this.getItemFetchId()
        this.getOutsideList()
        this.getYouXXList()
        this.getStdCategory('esProgramClass')
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
            let url = "/standardMaintenance/index.html#/selectSystemCode";
            EcoUtil.getSysvm().openDialog('企业标准体系树', url, '400', '600', "15vh");
        },
        //标准分类
        getStdCategory(parentId) {
            getStdCategory(parentId).then(res => {
                this.stdCategoryList = res
                // console.log(res)
            })
        },
        //标准类型
        changeStdCategory(data) {
            // console.log(data)
            this.stdTypeList = []
            this.form.data.stdType = ''
            getStdCategory(data.id).then(res => {
                this.stdTypeList = res
                // console.log(res)
            })
        },
        //有效性
        getYouXXList() {
            getYouXX().then(res => {
                // console.log(res)
                this.youXXList = res
            })
        },
        doitKnowCase(data) {
            //归档
            let loadingInstance = Loading.service({ fullscreen: true, text: '正在创建...' });
            newAddOutside(this.form, data.parentId).then((res) => {
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
            let url = "/standardMaintenance/index.html#/knowLedgeIndex";
            EcoUtil.getSysvm().openDialog('知识库', url, '900', '600', "15vh");
        },
        deleteFile(item, index) {
            this.$refs.fileUpload.handleRemove(item, index)
            this.fileList.splice(index, 1);
        },
        cancelFunc() {
            EcoUtil.getSysvm().closeDialog();
        },
        selectRoleUser(data, type) {
            //选择人
            if (!data.id && data.itemArray.length === 0) {
                //人员删除
                if (type === 'responsibleUser') {
                    this.form1.responsibleUser = '';
                } else if (type === 'draftMembersUser') {
                    this.form1.draftMembers = '';
                }
            } else {
                if (type === 'responsibleUser') {
                    this.form1.responsibleUser = data.itemArray[0].linkId;
                } else if (type === 'draftMembersUser') {
                    this.form1.draftMembers = data.itemArray[0].linkId;
                }
            }
        },
        selectRoleDept(data, type) {
            //责任部门
            if (!data.id && data.itemArray.length === 0) {
                if (type === 'dept') {
                    this.deptInitDataStr = '';
                    this.form.data.dept = '';
                    this.$refs.ruleForm.validateField('dept'); //必填验证
                } else if (type === 'office') {
                    this.officeInitDataStr = '';
                    this.form.data.office = '';
                    this.$refs.ruleForm.validateField('office');
                }
            } else {
                if (type === 'dept') {
                    this.form.data.dept = data.orgId;
                    this.$refs.dept.clearValidate();
                } else if (type === 'office') {
                    this.form.data.office = data.orgId;
                    this.$refs.office.clearValidate();
                }
            }
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
    // padding: 0 15px;
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    width: 200px;
}

/deep/ .el-textarea__inner {
    border: 1px solid #dcdfe6;
    // width: 600px;
    width: 530px;
}

/deep/ .el-customDiv {
    line-height: 28px;
    min-height: 28px;
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
                    padding: 5px 0;
                    // box-sizing: border-box;

                    &:nth-child(odd) {
                        width: 100px;
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
