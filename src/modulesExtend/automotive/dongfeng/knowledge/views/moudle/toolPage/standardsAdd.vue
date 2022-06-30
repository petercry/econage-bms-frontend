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
                <!-- 标准制修订 -->
                <div class="center">
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
                                    <el-input v-model="form.data.stdName"></el-input>
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
                            <!-- <td>制订人：</td>
                            <td>
                                <el-form-item>
                                    <tag-select style="width:200px;vertical-align: top;" :initDataStr="makerMembers" ref="tagSelect" :initOptions="{selectNum:1,selectType:'USER'}" @callBack="makerMember">
                                    </tag-select>
                                </el-form-item>
                            </td> -->
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
                                    <!-- <el-select v-model="form.data.revisionType" placeholder="请选择">
                                        <el-option label="制定" value="制定"></el-option>
                                        <el-option label="修订" value="修订"></el-option>
                                    </el-select> -->
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
                            <td><i>*</i>初稿完成时间：</td>
                            <td>
                                <el-form-item prop="draftCompleteTime">
                                    <!-- <el-input v-model="form.data.draftCompleteTime" type="date" value-format="yyyy-MM-dd"></el-input> -->
                                    <el-date-picker v-model="form.data.draftCompleteTime" type="date" placeholder="选择日期"></el-date-picker>
                                </el-form-item>
                            </td>
                            <td><i>*</i>会签完成时间：</td>
                            <td>
                                <el-form-item prop="countersignCompleteTime">
                                    <!-- <el-input v-model="form.data.countersignCompleteTime" type="date"></el-input> -->
                                    <!-- <el-date-picker v-model="form.data.countersignCompleteTime" type="date" placeholder="选择日期"></el-date-picker> -->
                                    <el-date-picker style="width:100%" v-model="form.data.countersignCompleteTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td><i>*</i>实施时间：</td>
                            <td>

                                <el-form-item prop="implementTime">
                                    <!-- <el-input v-model="form.data.implementTime" type="date"></el-input> -->
                                    <el-date-picker v-model="form.data.implementTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                                </el-form-item>
                            </td>
                            <td><i>*</i>实际会签时间：</td>
                            <td>
                                <el-form-item prop="countersignActualTime">
                                    <!-- <el-input v-model="form.data.countersignActualTime" type="date"></el-input> -->
                                    <el-date-picker v-model="form.data.countersignActualTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td><i>*</i>发布日期：</td>
                            <td>
                                <el-form-item prop="publishDate">
                                    <!-- <el-input v-model="form.data.publishDate" type="date"></el-input> -->
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
                                    <el-input  v-model="form.data.sourceCode"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <!-- <tr>
                            <td>五化领域：</td>
                            <td>
                                <el-form-item>
                                    <el-select v-model="form.data.fiveDomainList" placeholder="请选择" multiple>
                                        <el-option label="电动化领域" value="电动化领域"></el-option>
                                        <el-option label="智能化领域" value="智能化领域"></el-option>
                                        <el-option label="轻量化领域" value="轻量化领域"></el-option>
                                        <el-option label="网联化领域" value="网联化领域"></el-option>
                                        <el-option label="共享化领域" value="共享化领域"></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                            <td>应用领域：</td>
                            <td>
                                <el-form-item>
                                    <el-select v-model="form.data.applicationDomainList" placeholder="请选择" multiple>
                                        <el-option label="JP/RFQ定义需引用的标准" value="JP/RFQ定义需引用的标准"></el-option>
                                        <el-option label="方案设计" value="方案设计"></el-option>
                                        <el-option label="JE图纸定义采用" value="JE图纸定义采用"></el-option>
                                        <el-option label="工艺验证" value="工艺验证"></el-option>
                                        <el-option label="试验验证" value="试验验证"></el-option>
                                        <el-option label="产品认可" value="产品认可"></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td>适用项目：</td>
                            <td>
                                <el-form-item>
                                    <el-select v-model="form.data.applicableProjectList" placeholder="请选择" multiple>
                                        <el-option label="整车开发" value="整车开发"></el-option>
                                        <el-option label="平台开发" value="平台开发"></el-option>
                                        <el-option label="前期开发" value="前期开发"></el-option>
                                        <el-option label="发动机开发" value="发动机开发"></el-option>
                                        <el-option label="动力总成开发" value="动力总成开发"></el-option>
                                        <el-option label="先行技术开发" value="先行技术开发"></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                            <td>应用车型：</td>
                            <td>
                                <el-form-item>
                                    <el-select v-model="form.data.applicationCarModelList" placeholder="请选择" multiple>
                                        <el-option label="技术课题" value="技术课题"></el-option>
                                        <el-option label="技术规划" value="技术规划"></el-option>
                                        <el-option label="质量问题" value="质量问题"></el-option>
                                        <el-option label="国行标布局" value="国行标布局"></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                        </tr> -->
                        <tr>
                            <td>责任人：</td>
                            <td>
                                <el-form-item>
                                    <tag-select style="width:220px;vertical-align: top;" :initDataStr="responsibleUser" ref="tagSelect" :initOptions="{selectNum:1,selectType:'USER'}" @callBack="responsMember"></tag-select>
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
                                <tag-select style="width:400px;vertical-align: top;margin-left:30px" :initDataStr="draftMembers" ref="tagSelect" :initOptions="{selectNum:0,selectType:'user-persion'}" @callBack="draftMember"></tag-select>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <el-form-item label="查看用户">
                <tag-select style="width:400px;vertical-align: top;" :initDataStr="exposeMembers" ref="tagSelect" :initOptions="{selectNum: 2,selectType: 'Dept-User-Role-userGroup'}" @callBack="exposeMember"></tag-select>
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
import { newAddCommon, editCommon, getSubcommittee, getStdCategory } from '../../../api/fileCard.js'
import { getItemFetchId, getYouXX } from '../../../api/common.js'
import ecoFileUploadBtn from '@/components/file/ecoFileUploadBtn.vue'
import tagSelect from '@/components/orgPick/tagSelect.vue'
import EcoUtil from '@/components/util/main.js'
import { Loading } from 'element-ui'
import { mapState, mapMutations } from 'vuex';
import { getUserInfoByOrgId, getOrgsMemberByIds, getRevisionType, getSource } from '../../../api/common.js'
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
    computed: {
        ...mapState(['fileTableNode', 'fileTreeNode'])
    },
    created() {
        // console.log(this.$route.params)
        this.getItemFetchId();
        this.baseId = this.$route.params.id
        let entryId = this.$route.params.activeid
        if (entryId == '-1') {
            this.form.entity.parentId = ""
        } else {
            this.form.entity.parentId = entryId
        }
        this.getSubcommittee()
        this.getYouXXList()
        this.getStdCategory('esProgramClass')
        this.getRevisionType()
        this.getSourceList()

    },
    mounted() {
        // console.log(this.$props)
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
            this.fileList.push(this.form.attr.attr)
        }
        this.callAction()
    },
    methods: {
        callAction() {
            let this_ = this
            let callBackDialogFunc = function (obj) {
                if (obj && (obj.action === 'selectSystemCode')) {
                    this_.form.data.systemCode = obj.data.code;
                    this_.$refs.systemCodeFormItem.clearValidate()
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'editPlanPage');
        },
        selectSystemCode() {
            let url = "/knowledge/index.html#/selectSystemCode";
            EcoUtil.getSysvm().openDialog('企业标准体系树', url, '400', '600', "15vh");
        },
        getYouXXList() {
            getYouXX().then(res => {
                // console.log(res)
                this.youXXList = res
            })
        },
        getSubcommittee() {
            getSubcommittee().then(res => {
                // console.log(res)
                this.subcommitteeList = res.rows
            })
        },
        getStdCategory(parentId) {
            getStdCategory(parentId).then(res => {
                this.stdCategoryList = res
                // console.log(res)
            })
        },
        changeStdCategory(data) {
            // console.log(data)
            this.stdTypeList = []
            this.form.data.stdType = ''
            getStdCategory(data.id).then(res => {
                this.stdTypeList = res
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
        //制/修订
        getRevisionType() {
            getRevisionType().then(res => {
                // console.log(res)
                this.revisionType = res
            })
        },
        getSourceList() {
            getSource().then(res => {
                // console.log(res)
                this.sourceList = res
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
            if (data.itemArray.length > 0) {
                // let linkIds = [];
                // for (let i = 0; i < data.itemArray.length; i++) {
                //     linkIds.push({ 'memberId': data.itemArray[i].linkId });
                // }
                // this.form.exposeMembers = linkIds
                this.form.data.draftMembers = data.itemArray

            } else {
                this.draftMembers = ''
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
            // console.log(this.form)
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
            this.$refs.fileUpload.handleRemove(item, index)
            this.fileList.splice(index, 1);
        },
    },
    watch: {
        data(nv, ov) {
            // console.log(nv)
            if (nv != '') {
                // this.form = nv
                this.form.data = nv.data
                this.form.attr = nv.attr
                this.form.entity = nv.entity
                console.log(nv)
                this.exposeMembers = nv.exposeMembers
                this.hideMembers = nv.hideMembers
                this.manageMembers = nv.manageMembers
                this.cooperateLookupMembers = nv.cooperateLookupMembers
                this.cooperateDownloadMembers = nv.cooperateDownloadMembers
                this.fileList.push(nv.attr)
                // console.log(this.fileList)
                if (nv.data.stdCategory) {
                    getStdCategory(nv.data.stdCategory).then(res => {
                        this.stdTypeList = res
                        // console.log(res)
                    })
                }
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

            }
        },
        fileList(val) {
            if (val.length == 0) {
                this.rules.file.push({ required: true, message: '请选择文件', trigger: 'blur' })
            }
        }
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
