<template>
    <div class='editCommitteeSummary'>
        <div class='addForm'>
            <el-form class="managementForm" :model='formData' ref='committeeForm' :rules='rules' v-loading='loading' label-position='right' label-width='170px'>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='类别:' prop='type'>
                            <el-select v-if='isEdit' v-model='formData.type'>
                                <el-option v-for='(item,index) in GbTypeList' :value='item.id' :label='item.text' :key='item.id'></el-option>
                            </el-select>
                            <span v-else>{{formData.typeName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='TC号:' prop='tcNum'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.tcNum'></el-input>
                            <span class='viewContent' v-else>{{formData.tcNum}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='SC号:' prop='scNum'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.scNum'></el-input>
                            <span class='viewContent' v-else>{{formData.scNum}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='任职的标准化组织:' prop='standardOrganization'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.standardOrganization'></el-input>
                            <span class='viewContent' v-else>{{formData.standardOrganization}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='标准化组织的联系人:' prop='standardContact' ref='selectStandard'>
                            <!-- <tag-select v-if='isEdit' placeholder="选择人员" style="width:93%;vertical-align: top;" :initDataStr="formData.initDataStr" :initOptions="{selectNum:1,selectType:'User'}"
                                @callBack="selectUser">
                            </tag-select> -->
                            <el-input v-if='isEdit' v-model='formData.standardContact'></el-input>
                            <span class='viewContent' v-else>{{formData.standardContact}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='Email' prop='standardEmail'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.standardEmail'></el-input>
                            <span v-else>{{formData.standardEmail}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='标准化组织的联系方式:' prop='standardPhone'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.standardPhone'></el-input>
                            <span v-else>{{formData.standardPhone}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-divider></el-divider>
            <el-table class='infoTable' :data='infoList' border style='width:100%;' :header-cell-style="{background:'#f5f7fa',color:'#000',textAlign:'center'}"
                :cell-style="{textAlign:'center'}">
                <el-table-column label='任职人员' prop='employee' width='150'>
                    <template slot-scope='scope'>
                        <!-- <tag-select v-if='isEdit' placeholder="选择人员" style="width:100%;vertical-align: top;" :initDataStr="scope.row.initDataStr"
                            :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>selectRoleUser(data,scope.$index,'employee')">
                        </tag-select> -->
                        <el-input v-if='isEdit' v-model='scope.row.employee'></el-input>
                        <span v-else>{{scope.row.employee}}</span>
                    </template>
                </el-table-column>
                <el-table-column label='单位' prop='unitInitDataStr' min-width='170'>
                    <template slot-scope='scope'>
                        <!-- <tag-select v-if='isEdit' placeholder="选择机构" style="width:100%;vertical-align: top;" :initDataStr="scope.row.unitInitDataStr"
                            :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>selectRoleUser(data,scope.$index,'unit')">
                        </tag-select> -->
                        <el-input v-if='isEdit' v-model='scope.row.unit'></el-input>
                        <span v-else>{{scope.row.unit}}</span>
                    </template>
                </el-table-column>
                <el-table-column label='部门' prop='deptInitDataStr' min-width='170'>
                    <template slot-scope='scope'>
                        <!-- <tag-select v-if='isEdit' placeholder="选择机构" style="width:100%;vertical-align: top;" :initDataStr="scope.row.deptInitDataStr"
                            :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>selectRoleUser(data,scope.$index,'dept')">
                        </tag-select> -->
                        <el-input v-if='isEdit' v-model='scope.row.dept'></el-input>
                        <span v-else>{{scope.row.dept}}</span>
                    </template>
                </el-table-column>
                <el-table-column label='职务/职称' prop='position' width='130'>
                    <template slot-scope='scope'>
                        <el-input v-if='isEdit' v-model='scope.row.position'></el-input>
                        <span v-else>{{scope.row.position}}</span>
                    </template>
                </el-table-column>
                <el-table-column label='邮箱' prop='email' width='130'>
                    <template slot-scope='scope'>
                        <el-input v-if='isEdit' v-model='scope.row.email'></el-input>
                        <span v-else>{{scope.row.email}}</span>
                    </template>
                </el-table-column>
                <el-table-column label='座机' prop='telephone' width='130'>
                    <template slot-scope='scope'>
                        <el-input v-if='isEdit' v-model='scope.row.telephone'></el-input>
                        <span v-else>{{scope.row.telephone}}</span>
                    </template>
                </el-table-column>
                <el-table-column label='手机' prop='mobilePhone' width='130'>
                    <template slot-scope='scope'>
                        <el-input v-if='isEdit' v-model='scope.row.mobilePhone'></el-input>
                        <span v-else>{{scope.row.mobilePhone}}</span>
                    </template>
                </el-table-column>
                <el-table-column :fixed='(!isEdit?"right":false)' label='备注' prop='notes' width='200'>
                    <template slot-scope='scope'>
                        <el-input v-if='isEdit' type='textarea' :rows='1' resize='none' maxlength="30" show-word-limit v-model='scope.row.notes'></el-input>
                        <span v-else>{{scope.row.notes}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if='isEdit' label='操作' fixed='right'>
                    <template slot-scope='scope'>
                        <i class='el-icon-delete' style='color:red;font-size:14px;' @click='delRowItem(scope.$index)'></i>
                    </template>
                </el-table-column>
            </el-table>
            <div v-if='isEdit' class='caseBtn' @click='addRowItem'>
                <span><i class='el-icon-plus'></i> 添加</span>
            </div>
        </div>
        <div v-if='isEdit' class="btn">
            <el-button size="medium" @click="onCancel">取消</el-button>
            <el-button type="primary" size="medium" @click="onSubmit">保存</el-button>
        </div>
    </div>
</template>
<script>
    import tagSelect from '@/components/orgPick/tagSelect.vue'
    import { EcoUtil } from '@/components/util/main.js'
    import { mapState } from 'vuex'
    import { committeeAddSingle,getUserInfoByOrgId,committeeSelectById,committeeUpdateSingle } from '../../service/service.js'
    export default {
        name: 'editCommitteeSummary',
        data() {
            var validateTelephone = (rule, value, callback) => {
                if (rule.required) {
                    //电话
                    if (!value) {
                        callback(new Error('标准化组织的联系方式为必填项'));
                    } else if (/(^\d{3}-\d{7,8}$)|(^\d{4}-\d{7,8}$)/.test(value) || /^1[3-9]\d{9}$/.test(value)) {
                        callback();
                    } else {
                        callback(new Error('联系电话格式不正确'));
                    }
                }
            }
            return {
                infoList: [{
                    employee: '', //人员姓名linkId
                    unit: '', //单位linkId
                    unitInitDataStr: '',
                    dept: '', //部门linkId
                    deptInitDataStr: '',
                    position: '', //职务/职称
                    email: '', //邮箱
                    telephone: '', //座机
                    mobilePhone: '', //手机
                    notes: '', //备注
                    initDataStr: ''
                }],
                formData: {
                    type:'',
                    tcNum:'',
                    scNum:'',
                    standardOrganization:'',
                    standardContact:'',
                    initDataStr:'',
                    standardEmail:'',
                    standardPhone:''
                },
                rules: {
                    'type': [{ required: true, message: '类别为必选项', trigger: 'change' }],
                    'tcNum': [{ required: true, message: 'TC号为必填项', trigger: 'blur' }],
                    'scNum': [{ required: true, message: 'SC号为必填项', trigger: 'blur' }],
                    'standardOrganization': [{ required: true, message: '任职的标准化组织为必填项', trigger: 'blur' }],
                    'standardContact':[{ required: true, message: '标准化组织的联系人为必选项', trigger: 'blur' }],
                    'standardEmail':[{required:true,message:'Email为必填项',trigger:'blur'},{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
                    'standardPhone':[{required:true,validator:validateTelephone,trigger:'blur'}]
                },
                loading: false,
                id: '',
                caseType: ''
            }
        },
        computed: {
            ...mapState(['GbTypeList']),
            isEdit() {
                return this.caseType !== 'viewCase';
            }
        },
        components: {
            tagSelect
        },
        created() {
            this.id = this.$route.params.id;
            this.caseType = this.$route.params.caseType;
            if (this.id && this.id !== '0') {
                this.getDetailInfo();
            }
        },
        methods: {
            getDetailInfo() {
                this.loading = true;
                committeeSelectById(this.id).then(res=>{
                    res.data.staffList = res.data.staffList || [];
                    // res.data.staffList.forEach((item,index)=>{
                    //     item.unitInitDataStr = '';
                    //     item.deptInitDataStr = '';
                    //     item.initDataStr = '';
                    //     if(item.unit){
                    //         item.unitInitDataStr= `{"type":"DEPT","orgId":"${item.unit}","linkId":"${item.unit}"}`;
                    //     }
                    //     if(item.dept){
                    //         item.deptInitDataStr=  `{"type":"DEPT","orgId":"${item.dept}","linkId":"${item.dept}"}`;
                    //     }
                    //     if(item.employee){
                    //         getUserInfoByOrgId(item.employee).then(userRes=>{
                    //             item.initDataStr = `{"type":"PERSONNEL","orgId":"${userRes.data.departments[0].id}.${userRes.data.id}","linkId":"${userRes.data.id}"}`;
                    //         })
                    //     }  
                    // })
                    this.infoList = res.data.staffList;
                    this.formData = res.data; 
                    this.loading = false;
                    // getUserInfoByOrgId(res.data.standardContact).then(userRes=>{
                    //     
                    //     this.formData.initDataStr = `{"type":"PERSONNEL","orgId":"${userRes.data.departments[userRes.data.departments.length-1].id}","linkId":"${res.data.standardContact}"}`;
                    //     
                    // })

                })
            },
            // selectRoleUser(data, index, type) {
            //     //选择人员
            //     if (!data.id && data.itemArray.length === 0) {
            //         //人员删除
            //         if (type == 'employee') {
            //             //人员姓名
            //             this.infoList[index].initDataStr = '';
            //             this.infoList[index].unitInitDataStr = '';
            //             this.infoList[index].unit = '';
            //             this.infoList[index].deptInitDataStr = '';
            //             this.infoList[index].dept = '';

            //             this.infoList[index].mobilePhone = '';
            //             this.infoList[index].email = '';
            //             this.infoList[index].notes = '';
            //         } else if (type == 'unit') {
            //             //单位
            //             this.infoList[index].unitInitDataStr = '';
            //             this.infoList[index].unit = '';
            //         } else if (type == 'dept') {
            //             //部门
            //             this.infoList[index].deptInitDataStr = '';
            //             this.infoList[index].dept = '';
            //         }
            //     } else {
            //         if (type == 'employee') {
            //             let orgId = data.orgId.split('.')[0];
            //             this.infoList[index].employee = data.itemArray[0].linkId;
            //             getUserInfoByOrgId(data.itemArray[0].linkId).then(res => {
            //                 var len = 0;
            //                 this.infoList[index].dept = orgId; //部门
            //                 if(res.data.departments && res.data.departments.length>1){
            //                     res.data.departments.forEach((item,i)=>{
            //                         if(item.id==orgId){
            //                             len=i;
            //                         }
            //                     })
            //                 }
            //                 if(res.data.departments[len].orgPathDeptList){
            //                     this.infoList[index].unit = res.data.departments[len].orgPathDeptList[0].id;
            //                 }else{
            //                     this.infoList[index].unit = res.data.departments[len].id; // 单位
            //                 }

            //                 this.infoList[index].mobilePhone = res.data.mobilePhone;
            //                 this.infoList[index].email = res.data.email;
            //                 this.infoList[index].notes = res.data.comments;

            //                 this.infoList[index].deptInitDataStr = `{"type":"DEPT","orgId":"${orgId}","linkId":"${orgId}"}`;
            //                 this.infoList[index].unitInitDataStr = `{"type":"DEPT","orgId":"${this.infoList[index].unit}","linkId":"${this.infoList[index].unit}"}`;
            //             })
            //         } else if (type == 'unit') {
            //             //单位
            //             this.infoList[index].unit = data.orgId; // 单位
            //             this.infoList[index].unitInitDataStr = `{"type":"DEPT","orgId":"${data.orgId}","linkId":"${data.orgId}"}`;
            //         } else if (type == 'dept') {
            //             //部门
            //             this.infoList[index].dept = data.orgId;
            //             this.infoList[index].deptInitDataStr = `{"type":"DEPT","orgId":"${data.orgId}","linkId":"${data.orgId}"}`;
            //         }
            //     }
            // },
            // selectUser(data) {
            //     if (!data.id && data.itemArray.length === 0) {
            //         //人员删除
            //         this.formData.initDataStr = '';
            //         this.formData.standardContact = '';
            //         this.$refs.committeeForm.validateField('standardContact');
            //     } else {
            //         this.formData.standardContact = data.itemArray[0].linkId;
            //         this.$refs.selectStandard.clearValidate();
            //     }
            // },
            delRowItem(index) {
                if (this.infoList.length === 0) {
                    return;
                }
                if (!index && index !== 0) {
                    index = (this.infoList.length - 1);
                }
                let i = index;
                this.infoList.splice(i, 1);
            },
            addRowItem() {
                this.infoList.push({
                    employee: '', //人员姓名linkId
                    unit: '', //单位linkId
                    unitInitDataStr: '',
                    dept: '', //部门linkId
                    deptInitDataStr: '',
                    position: '', //职务/职称
                    email: '', //邮箱
                    telephone: '', //座机
                    mobilePhone: '', //手机
                    notes: '', //备注
                    initDataStr: ''
                });
            },
            onCancel() {
                EcoUtil.getSysvm().closeDialog();
            },
            onSubmit() {
                this.$refs.committeeForm.validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        var params = {
                            type:this.formData.type,
                            tcNum:this.formData.tcNum,
                            scNum:this.formData.scNum,
                            standardOrganization:this.formData.standardOrganization,
                            standardContact:this.formData.standardContact,
                            standardPhone:this.formData.standardPhone,
                            standardEmail:this.formData.standardEmail,
                            staffList: []
                        }
                        this.infoList.forEach(item => {
                            if (item.employee || item.unit || item.dept || item.position || item.email || item.telephone || item.mobilePhone || item.notes) {
                                params.staffList.push({
                                    employee: item.employee, //人员姓名linkId
                                    unit: item.unit, //单位linkId
                                    dept: item.dept, //部门linkId
                                    position: item.position, //职务/职称
                                    email: item.email, //邮箱
                                    telephone: item.telephone, //座机
                                    mobilePhone: item.mobilePhone, //手机
                                    notes: item.notes, //备注
                                })
                            }
                        })
                        if (this.id == '0') {
                            //新增
                            committeeAddSingle(params).then(res => {
                                this.loading = false;
                                let doObj = {}
                                doObj.action = 'addCommitteeSummary';
                                doObj.data = {};
                                doObj.close = true;
                                EcoUtil.getSysvm().callBackDialogFunc(doObj);
                            }).catch(err => {
                                this.loading = false;
                            })
                        } else {
                            params.id = this.id;
                            committeeUpdateSingle(params).then(res => {
                                this.loading = false;
                                let doObj = {}
                                doObj.action = 'editCommitteeSummary';
                                doObj.data = {};
                                doObj.close = true;
                                EcoUtil.getSysvm().callBackDialogFunc(doObj);
                            }).catch(err => {
                                this.loading = false;
                            })
                        }
                    } else {
                        return false
                    }
                })
            }
        }
    }
</script>
<style scoped>
    .editCommitteeSummary {
        background: #fff;
        height: 100%;
    }

    .editCommitteeSummary .btn {
        text-align: center;
        padding: 10px;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #ddd;
    }

    .editCommitteeSummary .addForm {
        overflow: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 60px;
        /* padding: 0 10px; */
        /* padding-top: 20px;
        box-sizing: border-box; */
    }

    .editCommitteeSummary .addForm .el-input,
    .editCommitteeSummary .addForm .el-select {
        width: 200px;
    }

    .editCommitteeSummary .infoTable .el-input {
        width: 90%;
    }

    .editCommitteeSummary .caseBtn {
        margin-top: 10px;
        border: 1px dashed #003b90;
        background-color: #fff;
        cursor: pointer;
        text-align: center;
        color: #003b90;
        border-radius: 4px;
        font-size: 14px;
        padding: 5px 0px;
        user-select: none;
    }

    .viewContent {
        color: #606266;
    }
</style>