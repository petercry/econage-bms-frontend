<template>
<div class="fileUpload" v-loading="loading">
    <!-- 上传文档 -->
    <div>
        <el-form label-width="130px" class="demo-ruleForm" label-position="left" :model="form.data" :rules="rules" ref="ruleForm">
            <el-form-item label="文件">
                <eco-file-upload-btn :showList="false" :multiple="false" :modular="'knowledge'" ref="fileUpload" :modularInnerId="modularInnerId" @fileChange="fileChange" style="width:142px;display:inline-block;" @fileOnSuccess="fileOnSuccess"></eco-file-upload-btn>
                <div style="display:inline-block;width:63%" class="fileBox" v-for="item in fileList" :key="item.id">
                    <div class="fileName" style="display:inline-block;">
                        {{item.name || item.fileName}}
                    </div>
                    <!-- <i v-show="item.fileName!=''" class="el-icon-close" style="float:right;line-height:36px;cursor:pointer" @click="deleteFile(item,index)"></i> -->
                </div>
            </el-form-item>
            <div class="kmCommon">
                <!-- 业务指南制修订 -->
                <div class="center">
                    <table>
                        <tr>
                            <!-- <td><i>*</i>卓越体系：</td>
                            <td>
                                <el-form-item prop="excellenceSystem">
                                    <el-select v-model="form.data.excellenceSystem" placeholder="请选择">
                                        <el-option :label="item.text" :value="item.id" v-for="item in excellenceSystem" :key="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </td> -->
                        </tr>
                        <tr>
                            <td><i>*</i>业务指南名称：</td>
                            <td>
                                <el-form-item prop="businessGuideName">
                                    <el-input v-model="form.data.businessGuideName"></el-input>
                                </el-form-item>
                            </td>
                            <td><i>*</i>制/修订：</td>
                            <td>
                                <el-form-item prop="revisionType">
                                    <el-select v-model="form.data.revisionType" placeholder="请选择">
                                        <el-option :value='item.id' :label='item.text' v-for='(item) in revisionType' :key='item.id'></el-option>
                                    </el-select>
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
                                    <!-- <el-input prop="name" v-model="form.data.draftCompleteTime" type="date"></el-input> -->
                                    <el-date-picker v-model="form.data.draftCompleteTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                                </el-form-item>
                            </td>
                            <td><i>*</i>会签完成时间：</td>
                            <td>
                                <el-form-item prop="countersignCompleteTime">
                                    <!-- <el-input prop="name" v-model="form.data.countersignCompleteTime" type="date"></el-input> -->
                                    <el-date-picker v-model="form.data.countersignCompleteTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td><i>*</i>部门：</td>
                            <td>
                                <el-form-item prop='dept' ref='dept'>
                                    <tag-select placeholder="选择机构" style="width:220px;vertical-align: top;" :initDataStr="deptInitDataStr" :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'dept')}">
                                    </tag-select>
                                </el-form-item>
                            </td>
                            <td>科室：</td>
                            <td>
                                <el-form-item  ref='office'>
                                    <tag-select placeholder="选择机构" style="width:220px;vertical-align: top;" :initDataStr="officeInitDataStr" :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'office')}">
                                    </tag-select>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <!-- <td><i>*</i>制定人：</td>
                            <td>
                                <el-form-item>
                                    <tag-select style="width:220px;vertical-align: top;" :initDataStr="makerMembers" ref="tagSelect" :initOptions="{selectNum:1,selectType:'USER'}" @callBack="makerMember">
                                    </tag-select>
                                </el-form-item>
                            </td> -->
                        </tr>
                        <tr>
                            <td><i>*</i>责任人：</td>
                            <td>
                                <el-form-item>
                                    <tag-select style="width:220px;vertical-align: top;" :initDataStr="responsibleUser" ref="tagSelect" :initOptions="{selectNum:1,selectType:'USER'}" @callBack="responsMember"></tag-select>
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
                            <td><i>*</i>有效性：</td>
                            <td>
                                <el-form-item>
                                    <el-select v-model="form.data.effectiveness" placeholder="请选择">
                                        <!-- <el-option label="同意" value="同意"></el-option>
                                        <el-option label="不同意" value="不同意"></el-option> -->
                                        <el-option v-for="item in youXXList" :key="item.id" :label="item.text" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                            <td>替代版次</td>
                            <td>
                                <el-form-item>
                                    <el-input v-model="form.data.substituteCode"></el-input>
                                    <!-- <el-select v-model="form.data.substituteCode" placeholder="请选择">
                                        <el-option label="同意" value="同意"></el-option>
                                        <el-option label="不同意" value="不同意"></el-option>
                                    </el-select> -->
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td>备注：</td>
                            <td colspan='3'>
                                <el-form-item>
                                    <el-input v-model="form.data.comments" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" resize="none"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td>起草人信息</td>
                            <td colspan="3">
                                <tag-select style="width:400px;vertical-align: top;margin-left:30px" :initDataStr="draftMembers" ref="tagSelect" :initOptions="{selectNum:0,selectType:'user-persion'}" @callBack="draftMember"></tag-select>
                            </td>
                        </tr>
                    </table>

                </div>
            </div>
            <el-form-item label="查看用户">
                <tag-select style="width:400px;vertical-align: top;" :initDataStr="exposeMembers" ref="tagSelect" :initOptions="{selectNum: 2,selectType: 'Dept-User-Role-userGroup'}" @callBack="exposeMember">
                </tag-select>
            </el-form-item>
            <el-form-item label="查看用户安全设置">
                <el-checkbox v-model="form.attr.allowDownload">允许下载</el-checkbox>
                <el-checkbox v-model="form.attr.allowOnlineEdit">允许在线编辑</el-checkbox>
            </el-form-item>
            <el-form-item label="隐藏用户">
                <tag-select style="width:400px;vertical-align: top;" :initDataStr="hideMembers" ref="tagSelect" :initOptions="{selectNum: 2,selectType: 'Dept-User-Role-userGroup'}" @callBack="hideMember">
                </tag-select>
            </el-form-item>
            <el-form-item label="管理用户">
                <tag-select style="width:400px;vertical-align: top;" :initDataStr="manageMembers" ref="tagSelect" :initOptions="{selectNum: 2,selectType: 'Dept-User-Role-userGroup'}" @callBack="manageMember">
                </tag-select>
            </el-form-item>
            <el-form-item label="协同查看">
                <tag-select style="width:400px;vertical-align: top;" :initDataStr="cooperateLookupMembers" ref="tagSelect" :initOptions="{selectNum: 2,selectType: 'Dept-User-Role-userGroup'}" @callBack="cooperateLookMembers"></tag-select>
            </el-form-item>
            <el-form-item label="协同下载">
                <tag-select style="width:400px;vertical-align: top;" :initDataStr="cooperateDownloadMembers" ref="tagSelect" :initOptions="{selectNum: 2,selectType: 'Dept-User-Role-userGroup'}" @callBack="cooperateDowndMembers"></tag-select>
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
import { newAddCommon, editCommon } from '../../../api/fileCard.js'
import { getItemFetchId } from '../../../api/common.js'
import ecoFileUploadBtn from '@/components/file/ecoFileUploadBtn.vue'
import tagSelect from '@/components/orgPick/tagSelect.vue'
import EcoUtil from '@/components/util/main.js'
import { Loading } from 'element-ui'
import { mapState, mapMutations } from 'vuex';
import { getUserInfoByOrgId, getOrgsMemberByIds, getexcellenceSystem, getRevisionType, getYouXX } from '../../../api/common.js'
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
                    effectiveness: '', //有效性
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
                subcommittee: [
                    { required: true, message: '请选择分标委', trigger: 'change' }
                ],
            },
            draftList: [],
            orderList: [{ 'order': '' }],
            deptInitDataStr: '', //部门
            officeInitDataStr: '', //科室
            excellenceSystem: [],
            revisionType: [],
            youXXList: [],
        }
    },
    computed: {
        ...mapState(['fileTableNode', 'fileTreeNode'])
    },
    created() {
        this.getItemFetchId();
        this.getexcellenceSystem()
        this.getRevisionType()
        this.getYouXXList()
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
            this.form.data = this.$props.data.data
            this.form.attr = this.$props.data.attr
            this.form.entity = this.$props.data.entity
            // console.log(this.form)
            this.exposeMembers = this.$props.data.exposeMembers
            this.hideMembers = this.$props.data.hideMembers
            this.manageMembers = this.$props.data.manageMembers
            this.cooperateLookupMembers = this.$props.data.cooperateLookupMembers
            this.cooperateDownloadMembers = this.$props.data.cooperateDownloadMembers
            this.fileList.push(this.$props.data.attr)
        }
    },
    methods: {
        getYouXXList() {
            getYouXX().then(res => {
                // console.log(res)
                this.youXXList = res
            })
        },
        getItemFetchId() {
            getItemFetchId().then(res => {
                this.modularInnerId = res;
                // this.form.id = this.modularInnerId;
                this.loading = false;
            })
        },
        //制/修订
        getRevisionType() {
            getRevisionType().then(res => {
                // console.log(res)
                this.revisionType = res
            })
        },
        //卓越体系
        getexcellenceSystem() {
            getexcellenceSystem().then(res => {
                // console.log(res)
                this.excellenceSystem = res
            })
        },
        // 制定人
        makerMember(data) {
            if (data.itemArray.length > 0) {
                this.form.data.maker = data.itemArray[0].linkId
            } else {
                this.makerMembers = ''
                this.form.data.maker = ''
            }
        },
        // 责任人
        responsMember(data) {
            // console.log(data)
            if (data.itemArray.length > 0) {
                this.form.data.responsibleUser = data.itemArray[0].linkId
                this.responsibleUser = `{"type":"PERSONNEL","orgId":"${data.orgId}","linkId":"${data.orgId}"}`;
                let orgId = data.orgId.split('.')[0];
                getUserInfoByOrgId(data.itemArray[0].linkId).then(res => {
                    // console.log(res,'111')
                    var len = 0;
                    if (res.departments && res.departments.length > 1) {
                        res.departments.forEach((item, i) => {
                            if (item.id == orgId) {
                                len = i;
                            }
                        })
                    }
                    //如果没单位就给部门
                    if (res.departments[len].orgPathDeptList) {
                        var length = res.departments[len].orgPathDeptList.length
                        if (length > 1) {
                            this.form.data.dept = res.departments[len].orgPathDeptList[length - 1].id; //部门
                            this.form.data.office = res.departments[len].id; //科室
                        } else if (length = 1) {
                            this.form.data.dept = res.departments[len].id; //部门
                            this.form.data.office = null; //科室
                        } else {
                            this.form.data.dept = null; //部门
                            this.form.data.office = null; //科室
                        }
                    }
                    if (this.form.data.dept) {
                        //部门deptInitDataStr
                        this.deptInitDataStr = `{"type":"DEPT","orgId":"${this.form.data.dept}","linkId":"${this.form.data.dept}"}`;
                    } else {
                        this.deptInitDataStr = null;
                    }
                    if (this.form.data.office) {
                        //科室deptInitDataStr_office
                        this.officeInitDataStr = `{"type":"DEPT","orgId":"${this.form.data.office}","linkId":"${this.form.data.office}"}`;
                    } else {
                        this.officeInitDataStr = null;
                    }
                })

            } else {
                this.responsibleUser = ''
                this.form.data.responsibleUser = ''
            }
        },
        selectRoleDept(data, type) {
            //责任部门
            // console.log(data, type)
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
        // 起草人
        draftMember(data) {
            // console.log(data)
            if (data.itemArray.length > 0) {
                // let linkIds = [];
                // for (let i = 0; i < data.itemArray.length; i++) {
                //   linkIds.push({ 'memberId': data.itemArray[i].linkId });
                // }
                // this.form.exposeMembers = linkIds
                this.form.data.draftMembers = data.itemArray
            } else {
                this.exposeMembers = ''
                this.form.data.draftMembers = ''
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
        // 协同查看
        cooperateLookMembers(data) {
            if (data.itemArray.length > 0) {
                // let linkIds = [];
                // for (let i = 0; i < data.itemArray.length; i++) {
                //   linkIds.push({ 'memberId': data.itemArray[i].linkId });
                // }
                // this.form.manageMembers = linkIds
                this.form.entity.cooperateLookupMembers = data.itemArray
            } else {
                this.cooperateLookupMembers = ''
                this.form.entity.cooperateLookupMembers = []
            }
        },
        fileChange(file, fileList) {
            this.loading = true;
        },
        fileOnSuccess(response, file, fileList) {
            this.loading = false;
            this.fileList = []
            this.fileList.push(response)
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
            if (this.fileList.length == 0) {
                this.$message({ type: 'warning', message: '请上传文件文件！' });
                return ''
            }
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
                    }).catch(err => {
                        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                            loadingInstance.close();
                        });
                    });
                } else {
                    return false
                }
            })
        },
        editFunc() {
            if (this.fileList.length == 0) {
                this.$message({ type: 'warning', message: '请上传文件文件！' });
                return ''
            }
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
                    }).catch(err => {
                        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                            loadingInstance.close();
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
        data(nv, ov) {
            if (nv != '') {
                // this.form = nv
                this.form.data = nv.data
                this.form.attr = nv.attr
                this.form.entity = nv.entity
                // console.log(nv)
                this.exposeMembers = nv.exposeMembers
                this.hideMembers = nv.hideMembers
                this.manageMembers = nv.manageMembers
                this.cooperateLookupMembers = nv.cooperateLookupMembers
                this.cooperateDownloadMembers = nv.cooperateDownloadMembers
                if (nv.data.responsibleUser) {
                    getUserInfoByOrgId(nv.data.responsibleUser).then(res => {
                        // console.log(res)
                        let obj = {}
                        obj.type = 'PERSONNEL'
                        let orgArr = []
                        res.departments.forEach((item) => {
                            orgArr.push(item.id);
                        })
                        orgArr.push(res.id);
                        obj.orgId = orgArr.join('.')
                        obj.linkId = res.id
                        this.responsibleUser = JSON.stringify(obj)
                    })
                }
                if (nv.data.maker) {
                    getUserInfoByOrgId(nv.data.maker).then(res => {
                        // console.log(res)
                        let obj1 = {}
                        obj1.type = 'PERSONNEL'
                        let orgArr1 = []
                        res.departments.forEach((item) => {
                            orgArr1.push(item.id);
                        })
                        orgArr1.push(res.id);
                        obj1.orgId = orgArr1.join('.')
                        obj1.linkId = res.id
                        this.makerMembers = JSON.stringify(obj1)
                        // console.log(obj1)
                    })
                }
                if (nv.data.dept) {
                    var arr = [{ type: "DEPT", orgId: nv.data.dept, linkId: nv.data.dept }];
                    getOrgsMemberByIds(arr).then(res => {
                        // console.log(res)
                        this.deptInitDataStr = `{"type":"DEPT","orgId":"${nv.data.dept}","linkId":"${nv.data.dept}"}`;
                    })
                }
                if (nv.data.office) {
                    var arr = [{ type: "DEPT", orgId: nv.data.office, linkId: nv.data.office }];
                    getOrgsMemberByIds(arr).then(res => {
                        // console.log(res)
                        this.officeInitDataStr = `{"type":"DEPT","orgId":"${nv.data.office}","linkId":"${nv.data.office}"}`;
                    })
                }
                if (nv.data.draftMembers) {
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
                this.fileList.push(nv.attr)
                // console.log(this.fileList)
            }
        },
        fileList(val) {
            if (val.length == 0) {
                this.rules.file.push({ required: true, message: '请选择文件', trigger: 'blur' })
            }
        },
    },
}
</script>

<style lang="less" scoped>
.fileUpload {
    width: 680px;
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
