<template>
    <div class='editTerminlogy'>
        <div class='addForm'>
            <el-form :model='formData' ref='terminlogyForm' :rules='rules' v-loading='loading' label-position='right' label-width='110px'>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='术语名称:' prop='termName'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.termName'></el-input>
                            <span class='viewContent' v-else>{{formData.termName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='缩略语:' prop='abbreviations'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.abbreviations'></el-input>
                            <span class='viewContent' v-else>{{formData.abbreviations}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>                
                        <el-form-item label='英文名称:' prop='enName'>
                            <el-input v-if='isEdit' placeholder='请输入' type='textarea' rows='1' resize='none' v-model='formData.enName'></el-input>
                            <span class='viewContent' v-else>{{formData.enName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='提出部门:' prop='proposeDept' ref='selectDept'>
                            <tag-select v-if='isEdit' placeholder="选择部门" style="width:98%;vertical-align: top;" :initDataStr="formData.initDataStrDept"
                                :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="selectRoleDept">
                            </tag-select>
                            <span class='viewContent' v-else>{{formData.proposeDeptName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <!-- <el-form-item label='所属专业:' prop='profession'>
                            <el-select filterable v-if='isEdit' v-model='formData.profession'>
                                <el-option :value='item.id' :label='item.text' v-for='(item,index) in professionList' :key='item.id'></el-option>
                            </el-select>
                            <span class='viewContent' v-else>{{formData.professionName||'暂无填写'}}</span>
                        </el-form-item> -->
                        <el-form-item label='所属领域:'>
                            <span class='viewContent'>{{formData.subProfessionalDomainName}}</span>
                        </el-form-item> 
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='提出人:' prop='proposeUser' ref='selectUser'>
                            <tag-select v-if='isEdit' placeholder="选择人员" style="width:98%;vertical-align: top;" :initDataStr="formData.initDataStrUser"
                                :initOptions="{selectNum:1,selectType:'User'}" @callBack="selectRoleUser">
                            </tag-select>
                            <span class='viewContent' v-else>{{formData.proposeUserName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='来源:' prop='sourceName'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.sourceName'></el-input>
                            <span class='viewContent' v-else>{{formData.sourceName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='类型:' prop='professionalDomainName'>
                            <!-- <el-select filterable v-if='isEdit' v-model='formData.termType'>
                                <el-option :value='item.id' :label='item.text' v-for='(item,index) in termTypeList' :key='item.id'></el-option>
                            </el-select> -->
                            <span class='viewContent'>{{formData.professionalDomainName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='状态:' prop='status'>
                            <el-select filterable v-if='isEdit' v-model='formData.status' clearable>
                                <el-option value='VALID' label='有效'></el-option>
                                <el-option value='INVALID ' label='作废'></el-option>
                            </el-select>
                            <span class='viewContent' v-else>{{formData.statusName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label='定义:' prop='definition'>
                            <el-input v-if='isEdit' placeholder='请输入' type='textarea' rows='4' resize='none' v-model='formData.definition'></el-input>
                            <span class='viewContent' v-else>{{formData.definition}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row>
                    <el-col :span='24'>
                        <el-form-item label='调整原因简述:' prop='a'>
                            <el-input placeholder='请输入'  type='textarea' rows='4' resize='none' v-model='formData.a'></el-input>
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <!-- <el-row>
                    <el-col :span='24'>
                        <el-form-item label='科室负责人审批:' prop='a'>
                            <el-input placeholder='请输入'  type='textarea' rows='4' resize='none' v-model='formData.a'></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label='部长审批:' prop='a'>
                            <el-input placeholder='请输入'  type='textarea' rows='4' resize='none' v-model='formData.a'></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label='相关部门会签:' prop='a'>
                            <el-input placeholder='请输入'  type='textarea' rows='4' resize='none' v-model='formData.a'></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label='专业部门会签稿修改:' prop='a'>
                            <el-input placeholder='请输入'  type='textarea' rows='4' resize='none' v-model='formData.a'></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label='标准化审查:' prop='a'>
                            <el-input placeholder='请输入'  type='textarea' rows='4' resize='none' v-model='formData.a'></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label='总师(科技创新部)审批:' prop='a'>
                            <el-input placeholder='请输入'  type='textarea' rows='4' resize='none' v-model='formData.a'></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label='事业计划表审批:' prop='a'>
                            <el-input placeholder='请输入'  type='textarea' rows='4' resize='none' v-model='formData.a'></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label='总师(事业计划部)审批:' prop='a'>
                            <el-input placeholder='请输入'  type='textarea' rows='4' resize='none' v-model='formData.a'></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label='科技创新部发布:' prop='a'>
                            <el-input placeholder='请输入'  type='textarea' rows='4' resize='none' v-model='formData.a'></el-input>
                        </el-form-item>
                    </el-col>
                </el-row> -->
            </el-form>
        </div>
        <div class="btn" v-if='isEdit'>
            <el-button size="medium" @click="onCancel">取消</el-button>
            <el-button type="primary" size="medium" @click="onSubmit">保存</el-button>
        </div>
    </div>
</template>
<script>
    import tagSelect from '@/components/orgPick/tagSelect.vue'
    import { EcoUtil } from '@/components/util/main.js'
    import { termSelectById } from '../service/service.js'
    import { mapState } from 'vuex'
    export default {
        name: 'editTerminlogy',
        data() {
            return {
                formData: {
                    termName: '',
                    abbreviations: '',
                    enName: '',
                    definition: '',
                    proposeDept: '',
                    profession: '',
                    proposeUser: '',
                    sourceName: '',
                    termType: '',
                    status: '',
                    initDataStrDept: '',
                    initDataStrUser: ''
                },
                rules: {
                    termName: [{ required: true, message: '术语名称为必填项', trigger: 'blur' }],
                    abbreviations: [{ required: true, message: '缩略语为必填项', trigger: 'blur' }],
                    definition: [{ required: true, message: '定义为必填项', trigger: 'blur' }],
                    proposeDept: [{ required: true, message: '提出部门为必选项', trigger: 'change' }],
                    profession: [{ required: true, message: '所属专业为必选项', trigger: 'change' }],
                    proposeUser: [{ required: true, message: '提出人为必选项', trigger: 'change' }],
                    sourceName: [{ required: true, message: '来源为必填项', trigger: 'blur' }],
                    termType: [{ required: true, message: '类型为必选项', trigger: 'change' }],
                    status: [{ required: true, message: '状态为必选项', trigger: 'change' }]
                },
                loading: false,
                id: '',
                caseType: ''
            }
        },
        components: {
            tagSelect
        },
        computed: {
            ...mapState(['professionList', 'termTypeList']),
            isEdit() {
                return this.caseType !== 'viewCase'
            }
        },
        created() {
            this.id = this.$route.params.id;
            this.caseType = this.$route.params.caseType;
            if (this.id && this.id != 0) {
                this.getDeatilInfo();
            }
        },
        methods: {
            selectRoleUser(data) {
                //选择人员
                if (!data.id && data.itemArray.length === 0) {
                    this.formData.proposeUser = '';
                    this.formData.initDataStrUser = '';
                    this.$refs.terminlogyForm.validateField('proposeUser');
                } else {
                    this.formData.proposeUser = data.itemArray[0].linkId;
                    this.formData.initDataStrUser = data.id;
                    this.$refs.selectUser.clearValidate();
                }
            },
            selectRoleDept(data) {
                //选择机构
                if (!data.id && data.itemArray.length === 0) {
                    //人员删除
                    this.formData.initDataStrDept = '';
                    this.formData.proposeDept = '';
                    this.$refs.terminlogyForm.validateField('proposeDept')
                } else {
                    //data.name  data.orgId
                    this.formData.initDataStrDept = data.id;
                    this.formData.proposeDept = data.orgId;
                    this.$refs.selectDept.clearValidate();
                }
            },
            getDeatilInfo() {
                this.loading = true;
                termSelectById(this.id).then(res => {
                    this.loading = false;
                    this.formData = res.data;
                }).catch(err => {
                    this.loading = false;
                })

            },
            onCancel() {
                EcoUtil.getSysvm().closeDialog();
            },
            onSubmit() {
                // this.$refs.terminlogyForm.validate((valid) => {
                //     if (valid) {
                //         this.loading = true;
                //         let params = {
                //             termName: this.formData.termName,
                //             abbreviations: this.formData.abbreviations,
                //             enName: this.formData.enName,
                //             definition: this.formData.definition,
                //             proposeDept: this.formData.proposeDept,
                //             profession: this.formData.profession,
                //             proposeUser: this.formData.proposeUser,
                //             source: this.formData.source,
                //             termType: this.formData.termType,
                //             status: this.formData.status,
                //         }
                //         console.log(params);
                //         termManageAdd(params).then(res => {
                //             this.loading = false;
                //             let doObj = {}
                //             doObj.action = 'addTerminlogy';
                //             doObj.data = {};
                //             doObj.close = true;
                //             EcoUtil.getSysvm().callBackDialogFunc(doObj);
                //         })
                //     } else {
                //         return false
                //     }
                // })
            }
        }
    }
</script>
<style scoped>
    .editTerminlogy {
        background: #fff;
        height: 100%;
    }

    .editTerminlogy .btn {
        text-align: center;
        padding: 10px;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #ddd;
    }

    .editTerminlogy .addForm {
        overflow: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 60px;
        padding: 0 10px;
        padding-top: 20px;
    }

    .editTerminlogy .addForm .el-input,
    .editTerminlogy .addForm .el-select {
        width: 200px;
    }

    .viewContent {
        color: #606266;
    }
</style>