<template>
<div class="editGudie" v-loading="loading">
    <!-- 上传文档 -->
    <div>
        <el-form label-width="130px" class="demo-ruleForm" label-position="left" :model="form.data" :rules="rules" ref="ruleForm">
            <div class="kmCommon">
                <div class="center">
                    <table>
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
                                    <el-input v-model="form.data.purposeContent" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" resize="none" style="width:500px"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td><i>*</i>初稿完成时间：</td>
                            <td>
                                <el-form-item prop="draftCompleteTime">
                                    <el-date-picker v-model="form.data.draftCompleteTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                                </el-form-item>
                            </td>
                            <td><i>*</i>部门：</td>
                            <td>
                                <el-form-item prop='dept' ref='dept'>
                                    <tag-select placeholder="选择机构" style="width:200px;vertical-align: top;" :initDataStr="deptInitDataStr" :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'dept')}">
                                    </tag-select>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td><i>*</i>会签完成时间：</td>
                            <td>
                                <el-form-item prop="countersignCompleteTime">
                                    <el-date-picker v-model="form.data.countersignCompleteTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                                </el-form-item>
                            </td>
                            <td>科室：</td>
                            <td>
                                <el-form-item ref='office'>
                                    <tag-select placeholder="选择机构" style="width:200px;vertical-align: top;" :initDataStr="officeInitDataStr" :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'office')}">
                                    </tag-select>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td><i>*</i>责任人：</td>
                            <td>
                                <el-form-item>
                                    <tag-select style="width:200px;vertical-align: top;" :initDataStr="responsibleUser" ref="tagSelect" :initOptions="{selectNum:1,selectType:'USER'}" @callBack="responsMember"></tag-select>
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
                                        <el-option v-for="item in youXXList" :key="item.id" :label="item.text" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                            <td>替代版次：</td>
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
                                    <el-input v-model="form.data.comments" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" resize="none" style="width:500px"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td>起草人信息：</td>
                            <td colspan="3">
                                <tag-select style="width:500px;vertical-align:top;" :initDataStr="draftMembers" ref="tagSelect" :initOptions="{selectNum:0,selectType:'user-persion'}" @callBack="draftMember"></tag-select>
                            </td>
                        </tr>
                    </table>

                </div>
            </div>
        </el-form>
        <div style="textAlign:center;margin-top:20px">
            <el-button @click="cancelFunc">取消</el-button>
            <el-button type="primary" @click="editFunc">保存</el-button>
        </div>
    </div>
</div>
</template>

<script>
import tagSelect from '@/components/orgPick/tagSelect.vue'
import EcoUtil from '@/components/util/main.js'
import { getUserInfoByOrgId, getOrgsMemberByIds, getexcellenceSystem, getRevisionType, getYouXX } from '../api/guide.js'
export default {
    name: 'editGudie',
    components: {
        tagSelect,
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
            deptList: '', //部门
            officeList: '', //科室
            responsibleUser: '',
            draftMembers: '', //起草人信息
            loading: false,
            rules: {
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
            deptInitDataStr: '', //部门
            officeInitDataStr: '', //科室
            excellenceSystem: [],
            revisionType: [],
            youXXList: [],
        }
    },
    created() {
        this.getexcellenceSystem()
        this.getRevisionType()
        this.getYouXXList()
    },
    mounted() {},
    methods: {
        //有效性
        getYouXXList() {
            getYouXX().then(res => {
                // console.log(res)
                this.youXXList = res
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
        cancelFunc() {
            EcoUtil.getSysvm().closeDialog();
        },
        editFunc() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    let loadingInstance = Loading.service({ fullscreen: true, text: '正在创建...' });
                    // editCommon(this.data.entity.baseId, this.form).then((res) => {
                    //     this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    //         loadingInstance.close();
                    //         this.$message({ type: 'success', message: '修改成功！' });
                    //         let doObj = {}
                    //         doObj.action = 'addNewFileCallBack';
                    //         doObj.data = {};
                    //         doObj.data.queryObj = this.form;
                    //         doObj.close = true;
                    //         EcoUtil.getSysvm().callBackDialogFunc(doObj);
                    //     });
                    // }).catch(err => {
                    //     this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    //         loadingInstance.close();
                    //     });
                    // });
                } else {
                    return false
                }
            })
        },
    },

}
</script>

<style lang="less" scoped>
.editGudie {
    width: 680px;
    padding: 20px;
    box-sizing: border-box;

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

        /deep/ .el-input__inner {
            width: 200px;
        }

        /deep/ .el-customDiv {
            min-height: 28px;
            line-height: 28px;
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
                        padding: 10px 0;
                        box-sizing: border-box;

                        // &:nth-child(odd) {
                        //     width: 140px;
                        //     padding: 0 5px;
                        //     box-sizing: border-box;
                        // }

                    }
                }
            }
        }
    }

}
</style>
