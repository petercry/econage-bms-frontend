<template>
    <div class='editManagement'>
        <div class='addForm'>
            <el-form class='managementForm' :model='formData' ref='managementForm' :rules='rules' v-loading='loading' label-position='right'
                label-width='140px'>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='标准类型:' prop='standardType'>
                            <el-select v-if='isEdit'  v-model='formData.standardType'>
                                <el-option  v-for='(item,index) in standardTypeList' :value='item.id' :label='item.text' :key='item.id'></el-option>
                            </el-select>
                            <span class='viewContent' v-else>{{formData.standardTypeName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='标准颁布状态:' prop='standardStatus'>
                            <el-select v-if='isEdit' v-model='formData.standardStatus'>
                                <el-option v-for='(item,index) in standardStatusNameList' :value='item.id' :label='item.text' :key='item.id'></el-option>
                            </el-select>
                            <span class='viewContent' v-else>{{formData.standardStatusName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='标准名称:' prop='standardName' ref='selectDept'>
                            <!-- <tag-select v-if='isEdit' placeholder="选择机构" style="width:95%;vertical-align: top;" :initDataStr="formData.initDataStr" :initOptions="{selectNum:1,selectType:'Dept'}"
                                @callBack="selectRoleDept">
                            </tag-select> -->
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.standardName'></el-input>
                            <span class='viewContent' v-else>{{formData.standardName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='标准编号/计划号:' prop='standardCode'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.standardCode'></el-input>
                            <span class='viewContent' v-else>{{formData.standardCode}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='起草单位:' prop='draftUnit'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.draftUnit'></el-input>
                            <span class='viewContent' v-else>{{formData.draftUnit}}</span>
                        </el-form-item>  
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='科技创新部联络员:' prop='liaisonUser' ref='liaisonUser'>
                             <tag-select v-if='isEdit' placeholder="选择人员" style="width:94%;vertical-align: top;" :initDataStr="formData.initDataStr" :initOptions="{selectNum:1,selectType:'User'}"
                                @callBack="(data)=>selectRoleUser(data)">
                            </tag-select>
                            <span v-else class='viewContent'>{{formData.liaisonUserName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='颁布时间:' prop='promulgatedDate'>
                            <el-date-picker v-if='isEdit' value-format='yyyy-MM-dd' v-model="formData.promulgatedDate" type="date" placeholder="选择日期" clearable></el-date-picker>
                            <span class='viewContent' v-else>{{formData.promulgatedDate||'暂无填写'}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='实施时间:' prop='forecastImplementTime'>
                            <el-date-picker v-if='isEdit' value-format='yyyy-MM-dd' v-model="formData.forecastImplementTime" type="date" placeholder="选择日期" clearable></el-date-picker>
                            <span class='viewContent' v-else>{{formData.forecastImplementTime||'暂无填写'}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='领域:' prop='profession'>
                            <el-select v-if='isEdit' v-model='formData.profession'>
                                <el-option v-for='(item,index) in professionList' :value='item.id' :label='item.text' :key='item.id'></el-option>
                            </el-select>
                            <span class='viewContent' v-else>{{formData.professionName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='制/修订:' prop='revisionType'>
                            <el-select v-if='isEdit' v-model='formData.revisionType'>
                                <el-option v-for='(item,index) in revisionTypeNameList' :value='item.id' :label='item.text' :key='item.id'></el-option>
                            </el-select>
                            <span class='viewContent' v-else>{{formData.revisionTypeName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='参与形式:' prop='participationForm'>
                            <el-select v-if='isEdit'  v-model='formData.participationForm'>
                                <el-option v-for='(item,index) in participationFormList' :value='item.id' :label='item.text' :key='item.id'></el-option>
                            </el-select>
                            <span class='viewContent' v-else>{{formData.participationFormName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='所属分标委:' prop='subcommittee'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.subcommittee'></el-input>
                            <span class='viewContent' v-else>{{formData.subcommittee}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-divider></el-divider>
            <el-table class='infoTable' :data='infoList' border style='width:100%;' :header-cell-style="{background:'#f5f7fa',color:'#000',textAlign:'center'}"
                :cell-style="{textAlign:'center'}">
                <el-table-column label='人员姓名' prop='employee' width='150'>
                    <template slot-scope='scope'>
                        <!-- <tag-select v-if='isEdit' placeholder="选择人员" style="width:100%;vertical-align: top;" :initDataStr="scope.row.initDataStr" :initOptions="{selectNum:1,selectType:'User'}"
                            @callBack="(data)=>selectRoleUser(data,scope.$index,'employee')">
                        </tag-select> -->
                        <el-input v-if='isEdit'  v-model='scope.row.employee'></el-input>
                        <span  v-else>{{scope.row.employee}}</span>
                    </template>
                </el-table-column>
                <el-table-column label='工号' prop='employeeNum' width='130'>
                    <template slot-scope='scope'>
                        <el-input v-if='isEdit' v-model='scope.row.employeeNum'></el-input>
                        <span  v-else>{{scope.row.employeeNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column label='起草人位列排序' prop='rankOrder' width='130'>
                    <template slot-scope='scope'>
                        <el-input v-if='isEdit' v-model='scope.row.rankOrder'></el-input>
                        <span v-else>{{scope.row.rankOrder}}</span>
                    </template>
                </el-table-column>
                <el-table-column label='单位' prop='unitInitDataStr' min-width='170'>
                    <template slot-scope='scope'>
                        <!-- <tag-select v-if='isEdit' placeholder="选择机构" style="width:100%;vertical-align: top;" :initDataStr="scope.row.unitInitDataStr" :initOptions="{selectNum:1,selectType:'Dept'}"
                            @callBack="(data)=>selectRoleUser(data,scope.$index,'unit')">
                        </tag-select> -->
                        <el-input v-if='isEdit' placeholder='请输入' v-model='scope.row.unit'></el-input>
                        <span  v-else>{{scope.row.unit}}</span>
                    </template>
                </el-table-column>
                <el-table-column label='分中心/部门' prop='deptInitDataStr' min-width='170'>
                    <template slot-scope='scope'>
                        <!-- <tag-select v-if='isEdit' placeholder="选择机构" style="width:100%;vertical-align: top;" :initDataStr="scope.row.deptInitDataStr" :initOptions="{selectNum:1,selectType:'Dept'}"
                            @callBack="(data)=>selectRoleUser(data,scope.$index,'dept')">
                        </tag-select> -->
                        <el-input v-if='isEdit' placeholder='请输入' v-model='scope.row.dept'></el-input>
                        <span  v-else>{{scope.row.dept}}</span>
                    </template>
                </el-table-column>
                <el-table-column label='职务/职称' prop='position' width='130'>
                    <template slot-scope='scope'>
                        <el-input v-if='isEdit' v-model='scope.row.position'></el-input>
                        <span  v-else>{{scope.row.position}}</span>
                    </template>
                </el-table-column>
                <el-table-column label='邮箱' prop='email' width='130'>
                    <template slot-scope='scope'>
                        <el-input v-if='isEdit' v-model='scope.row.email'></el-input>
                        <span  v-else>{{scope.row.email}}</span>
                    </template>
                </el-table-column>
                <el-table-column label='座机' prop='telephone' width='130'>
                    <template slot-scope='scope'>
                        <el-input v-if='isEdit' v-model='scope.row.telephone'></el-input>
                        <span  v-else>{{scope.row.telephone}}</span>
                    </template>
                </el-table-column>
                <el-table-column label='手机' prop='mobilePhone' width='130'>
                    <template slot-scope='scope'>
                        <el-input v-if='isEdit' v-model='scope.row.mobilePhone'></el-input>
                        <span  v-else>{{scope.row.mobilePhone}}</span>
                    </template>
                </el-table-column>
                <el-table-column :fixed='(!isEdit?"right":false)' label='备注' prop='notes' width='200'>
                    <template slot-scope='scope'>
                        <el-input v-if='isEdit' type='textarea' :rows='1' resize='none' maxlength="30" show-word-limit v-model='scope.row.notes'></el-input>
                        <span  v-else>{{scope.row.notes}}</span>
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
    import { standardAddSingle, standardSelectById, getUserInfoByOrgId, standardUpdateSingle } from '../../service/service.js'
    export default {
        name: 'editManagement',
        data() {
            return {
                infoList: [{
                    employeeNum: '', //工号
                    rankOrder: '', //起草人位列排序
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
                    standardCode: '',
                    standardType: '',
                    standardStatus: '',
                    standardName: '',
                    promulgatedDate: '',
                    forecastImplementTime: '',
                    participationForm: '',
                    subcommittee: '',
                    revisionType: '',
                    initDataStr: '',
                    draftUnit:'',//起草单位
                    liaisonUser:'', //科技创新员
                    // standardOrgId: ''  //标准名称id
                    profession:'' //领域
                },
                rules: {
                    'draftUnit':[{ required: true, message: '起草单位为必填', trigger: 'blur' }],
                    'standardCode': [{ required: true, message: '标准编号/计划号为必填', trigger: 'blur' }],
                    'standardType': [{ required: true, message: '标准类型为必填', trigger: 'change' }],
                    'standardStatus': [{ required: true, message: '标准颁布状态为必填', trigger: 'change' }],
                    'revisionType': [{ required: true, message: '制/修订为必填', trigger: 'change' }],
                    'participationForm': [{ required: true, message: '参与形式为必填', trigger: 'change' }],
                    'subcommittee': [{ required: true, message: '所属分标委为必填', trigger: 'blur' }],
                    'standardName': [{ required: true, message: '标准名称为必选', trigger: 'blur' }],
                    'liaisonUser':[{ required: true, message: '科技创新部联络员为必选', trigger: 'change' }],
                    'promulgatedDate':[{ required: true, message: '颁布时间为必填', trigger: 'change' }],
                    'forecastImplementTime':[{ required: true, message: '实施时间为必填', trigger: 'change' }]
                },
                loading: false,
                id: '',
                caseType:''
            }
        },
        computed: {
            ...mapState(['professionList','standardTypeList', 'standardStatusNameList', 'participationFormList', 'revisionTypeNameList']),
            isEdit(){
                return this.caseType!=='viewCase';
            }
        },
        components: {
            tagSelect
        },
        created() {
            this.id = this.$route.params.id;
            this.caseType= this.$route.params.caseType;
            if (this.id && this.id !== '0') {
                this.getDetailsInfo();
            }
        },
        methods: {
            infoListValidate(){
                var bool = true;
                this.infoList.forEach(item=>{
                    if(!(item.employeeNum && item.rankOrder  && item.employee && item.unit  && item.dept  && item.position)){
                        bool = false
                    }
                })
                if(!bool){
                    this.$message.warning('人员姓名、工号、起草人位列排序、单位、分中心/部门、职务/职称为必填项!');
                }
                return bool;
            },
            getDetailsInfo(id) {
                this.loading = true;
                standardSelectById(this.id).then(res => {
                    res.data.forecastImplementTime = res.data.forecastImplementTime || '';
                    res.data.promulgatedDate = res.data.promulgatedDate || '';
                    res.data.staffList = res.data.staffList || [];
                    // res.data.staffList.forEach((item,index)=>{
                    //     item.unitInitDataStr= '';
                    //     item.deptInitDataStr='';
                    //     item.initDataStr='';
                    //     if(item.unit){
                    //         item.unitInitDataStr= `{"type":"DEPT","orgId":"${item.unit}","linkId":"${item.unit}"}`;
                    //     }
                    //     if(item.dept){
                    //         item.deptInitDataStr=  `{"type":"DEPT","orgId":"${item.dept}","linkId":"${item.dept}"}`;
                    //     }
                    //     if(item.employee){
                    //         getUserInfoByOrgId(item.employee).then(res=>{
                    //             item.initDataStr= `{"type":"PERSONNEL","orgId":"${res.data.departments[0].id}.${res.data.id}","linkId":"${res.data.id}"}`;
                    //         })
                    //     }
                    // }) 
                    this.formData = res.data;
                    getUserInfoByOrgId(res.data.liaisonUser).then(res=>{
                        this.$set(this.formData,'initDataStr',`{"type":"PERSONNEL","orgId":"${res.data.departments[0].id}.${res.data.id}","linkId":"${res.data.id}"}`);
                        this.loading = false;
                    })
                    this.infoList=res.data.staffList;
                })
            },
            selectRoleUser(data) {
                //选择人员
                if (!data.id && data.itemArray.length === 0) {
                    //人员删除
                    this.formData.initDataStr = '';
                    this.formData.liaisonUser = '';
                    this.$refs.managementForm.validateField('liaisonUser');  
                }else{
                    this.formData.liaisonUser = data.itemArray[0].linkId;
                    this.$refs.liaisonUser.clearValidate();
                }
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
            //             this.infoList[index].employeeNum = '';
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
            //                 this.infoList[index].employeeNum = res.data.emId;
            //                 this.infoList[index].email = res.data.email;
            //                 this.infoList[index].notes = res.data.comments;

            //                 this.infoList[index].deptInitDataStr= `{"type":"DEPT","orgId":"${orgId}","linkId":"${orgId}"}`;
            //                 this.infoList[index].unitInitDataStr= `{"type":"DEPT","orgId":"${this.infoList[index].unit}","linkId":"${this.infoList[index].unit}"}`;
            //             })
            //         } else if (type == 'unit') {
            //             //单位
            //             this.infoList[index].unit = data.orgId; // 单位
            //             this.infoList[index].unitInitDataStr= `{"type":"DEPT","orgId":"${data.orgId}","linkId":"${data.orgId}"}`;
            //         } else if (type == 'dept') {
            //             //部门
            //             this.infoList[index].dept = data.orgId;
            //             this.infoList[index].deptInitDataStr= `{"type":"DEPT","orgId":"${data.orgId}","linkId":"${data.orgId}"}`;
            //         }
            //     }
            // },
            // selectRoleDept(data) {
            //     //选择机构
            //     if (!data.id && data.itemArray.length === 0) {
            //         //人员删除
            //         this.formData.initDataStr = '';
            //         this.formData.standardName = '';
            //         this.formData.standardOrgId = '';
            //         this.$refs.managementForm.validateField('standardName')
            //     } else {
            //         this.formData.standardName = data.name;
            //         this.formData.standardOrgId = data.orgId;
            //         this.$refs.selectDept.clearValidate();
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
                    employeeNum: '', //工号
                    rankOrder: '', //起草人位列排序
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
                this.$refs.managementForm.validate((valid) => {
                    if (valid && this.infoListValidate()) {
                        this.loading = true;
                        var params = {
                            standardCode: this.formData.standardCode,
                            standardType: this.formData.standardType,
                            standardStatus: this.formData.standardStatus,
                            standardName: this.formData.standardName,
                            draftUnit:this.formData.draftUnit,
                            // standardOrgId: this.formData.standardOrgId,
                            participationForm: this.formData.participationForm,
                            subcommittee: this.formData.subcommittee,
                            revisionType: this.formData.revisionType,
                            promulgatedDate: this.formData.promulgatedDate || '',
                            forecastImplementTime: this.formData.forecastImplementTime || '',
                            profession:this.formData.profession||'',
                            liaisonUser:this.formData.liaisonUser,
                            staffList: []
                        }
                        this.infoList.forEach(item => {
                            if (item.employeeNum || item.rankOrder || item.employee || item.unit || item.dept || item.position || item.email || item.telephone || item.mobilePhone || item.notes) {
                                params.staffList.push({
                                    employeeNum: item.employeeNum, //工号
                                    rankOrder: item.rankOrder, //起草人位列排序
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
                            standardAddSingle(params).then(res => {
                                this.loading = false;
                                let doObj = {}
                                doObj.action = 'addManagement';
                                doObj.data = {};
                                doObj.close = true;
                                EcoUtil.getSysvm().callBackDialogFunc(doObj);
                            }).catch(err => {
                                this.loading = false;
                            })
                        } else {
                            params.id = this.id;
                            standardUpdateSingle(params).then(res => {
                                this.loading = false;
                                let doObj = {}
                                doObj.action = 'editManagement';
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
    .editManagement {
        background: #fff;
        height: 100%;
    }

    .editManagement .btn {
        text-align: center;
        padding: 10px;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #ddd;
    }

    .editManagement .addForm {
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

    .editManagement .addForm .el-input,
    .editManagement .addForm .el-select {
        width: 200px;
    }

    .editManagement .infoTable .el-input {
        width: 90%;
    }

    .editManagement .caseBtn {
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
    .viewContent{
        color:#606266;
    }
    .editManagement /deep/ .el-table__empty-text{
        width:35%;
        text-align:left;
    }
</style>