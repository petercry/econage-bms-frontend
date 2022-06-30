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
                <!-- 标准制修订 -->
                <div class="center">
                    <table>
                        <tr>
                            <td><i>*</i>标准分类：</td>
                            <td>
                                <el-form-item prop="stdCategory">
                                    <el-select v-model="form.data.stdCategory" placeholder="请选择">
                                        <el-option v-for="item in stdCategoryList" :key="item.id" :label="item.text" :value="item.text" @click.native="changeStdCategory(item)"></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                            <td><i>*</i>标准类型：</td>
                            <td>
                                <el-form-item prop="stdType">
                                    <el-select v-model="form.data.stdType" placeholder="请先选择标准分类">
                                        <el-option v-for="item in stdTypeList" :key="item.id" :label="item.text" :value="item.text"></el-option>
                                    </el-select>
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
                            <td><i>*</i>标准名称：</td>
                            <td>
                                <el-form-item prop="stdName">
                                    <el-input v-model="form.data.stdName"></el-input>
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
                            <td><i>*</i>制订人：</td>
                            <td>
                                <el-form-item>
                                    <!-- <el-input v-model="form.data.maker"></el-input> -->
                                    <tag-select style="width:200px;vertical-align: top;" :initDataStr="maker" ref="tagSelect" :initOptions="{selectNum:0,selectType:'user-dept'}" @callBack="makerMember">
                                    </tag-select>
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
                                    <el-select v-model="form.standard_type_" placeholder="请选择">
                                        <el-option label="制定" value="制定"></el-option>
                                        <el-option label="修订" value="修订"></el-option>
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
                            <td><i>*</i>初稿完成时间：</td>
                            <td>
                                <el-form-item prop="draftCompleteTime">
                                    <el-input v-model="form.data.draftCompleteTime" type="date"></el-input>
                                </el-form-item>
                            </td>
                            <td><i>*</i>会签完成时间：</td>
                            <td>
                                <el-form-item prop="countersignCompleteTime">
                                    <el-input v-model="form.data.countersignCompleteTime" type="date"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td><i>*</i>实施时间：</td>
                            <td>

                                <el-form-item prop="implementTime"> 
                                    <el-input v-model="form.data.implementTime" type="date"></el-input>
                                </el-form-item>
                            </td>
                            <td><i>*</i>实际会签时间：</td>
                            <td>
                                <el-form-item prop="countersignActualTime">
                                    <el-input v-model="form.data.countersignActualTime" type="date"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td><i>*</i>发布日期：</td>
                            <td>
                                <el-form-item prop="publishDate">
                                    <el-input v-model="form.data.publishDate" type="date"></el-input>
                                </el-form-item>
                            </td>
                            <td><i>*</i>分标委：</td>
                            <td>
                                <el-form-item prop="subcommittee">
                                    <el-select v-model="form.subcommittee" placeholder="请选择">
                                        <el-option v-for="item in subcommitteeList" :key="item.id" :label="item.name" :value="item.name"></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td>规划来源：</td>
                            <td>
                                <el-form-item>
                                    <el-select v-model="form.data.planSource" placeholder="请选择">
                                        <el-option label="技术课题" value="技术课题"></el-option>
                                        <el-option label="技术规划" value="技术规划"></el-option>
                                        <el-option label="质量问题" value="质量问题"></el-option>
                                        <el-option label="国行标布局" value="国行标布局"></el-option>
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
                        </tr>
                        <tr>
                            <td>责任人：</td>
                            <td>
                                <el-form-item>
                                    <tag-select style="width:200px;vertical-align: top;" :initDataStr="responsibleUser" ref="tagSelect" :initOptions="{selectNum:0,selectType:'user-dept'}" @callBack="responsMember"></tag-select>
                                </el-form-item>
                            </td>
                            <td>有效性：</td>
                            <td>
                                <el-form-item>
                                    <el-select v-model="form.data.standardtype" placeholder="请选择">
                                        <el-option label="有效" value="有效"></el-option>
                                        <el-option label="无效" value="无效"></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td colspan='4'>起草人信息
                                <table style="width:460px;text-align:center;margin-left:120px" border="1">
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
import { newAddCommon, editCommon, getSubcommittee, getStdCategory, getDept,getOffice } from '../../../api/fileCard.js'
import { getItemFetchId } from '../../../api/common.js'
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
                    standardtype: '' //有效性
                }
            },
            exposeMembers: '',
            hideMembers: '',
            manageMembers: '',
            maker: '',
            deptList: '',
            officeList: '',
            responsibleUser: '',
            draftMembers:'',
            order:'',
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
            },
            subcommitteeList: [], //分标委
            stdCategoryList: [], //标准分类
            stdTypeList: [], //标准类型
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
        this.getStdCategory('esProgramClass')
        this.getDept()
    },
    mounted() {
        // console.log(this.$props)
        if (this.$props.data) {
            // console.log("111")
            this.form = this.$props.data
            // console.log(this.form)
            this.exposeMembers = this.data.exposeMembers
            this.hideMembers = this.data.hideMembers
            this.manageMembers = this.data.manageMembers
            this.maker = this.form.data.maker
            this.responsibleUser = this.form.data.responsibleUser
            this.fileList.push(nv.attr)
        }
    },
    methods: {
        //部门
        getDept() {
            getDept().then(res => {
                // console.log(res)
                this.deptList = [res]
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
            this.stdTypeList=[]
            this.form.data.stdType=''
            getStdCategory(data.id).then(res => {
                this.stdTypeList = res
                // console.log(res)
            })
        },
        //科室
        changeOffice(data) {
            // console.log(data)
            getOffice().then(res => {
                this.officeList = [res]
                console.log(res)
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
                this.form.hideMembers = data.itemArray
            } else {
                this.hideMembers = ''
                this.form.hideMembers = []
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
            console.log(this.fileList)
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
            console.log(nv)
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
