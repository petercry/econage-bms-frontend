<template>
    <div class="editPlanPage">
        <div class='addForm'>
            <el-form :model='formData' ref='editPlanForm' :rules='rules' v-loading='loading' label-position='right' label-width='145px'>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='部门:' prop='dept' ref='dept'>
                            <tag-select :disabled='(!["STI_DEPT_START"].includes(phase) && caseType=="editCase")' v-if='isEdit' placeholder="选择机构" style="width:200px;vertical-align: top;" :initDataStr="formData.deptInitDataStr"
                                :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'dept')}">
                            </tag-select>
                            <span class="viewContent" v-else>{{formData.deptName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='科室:' prop='office' ref='office'>
                            <tag-select :disabled='(!["STI_DEPT_START","DEPT_LIAISON_CONFIRM"].includes(phase) && caseType=="editCase")'  v-if='isEdit' placeholder="选择机构" style="width:200px;vertical-align: top;" :initDataStr="formData.officeInitDataStr"
                                :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'office')}">
                            </tag-select>
                            <span class="viewContent" v-else>{{formData.officeName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='业务指南名称:' prop='businessGuideName'>
                            <el-input v-if='isEdit' placeholder='请输入'  v-model='formData.businessGuideName'></el-input>
                            <span class="viewContent" v-else>{{formData.businessGuideName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='年度:' prop='year'>
                            <el-date-picker disabled v-if='isEdit' v-model="formData.year" value-format='yyyy'  type="year" placeholder="选择年">
                            </el-date-picker>
                            <span v-else class='viewContent'>{{formData.year}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='责任人:' prop='responsibleUser' ref='responsibleUser'>
                            <tag-select v-if='isEdit' placeholder="选择人员" style="width:200px;vertical-align: top;" :initDataStr="formData.responsibleUserInitDataStr"
                                :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data,'responsibleUser')}">
                            </tag-select>
                            <span v-else class='viewContent'>{{formData.responsibleUser}}</span>  
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='制/修订:' prop='editType'>
                            <el-select filterable v-if='isEdit' v-model='formData.editType'>
                                <el-option v-for='(item,index) in editType' :value='item.id' :label='item.text' :key='item.id'></el-option>
                            </el-select>  
                            <span v-else class='viewContent'>{{formData.editType}}</span>  
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label='业务指南编制目的及内容简介:' prop='purposeContent'>
                            <el-input v-if='isEdit' v-model='formData.purposeContent' type='textarea' :rows='4' resize='none' show-word-limit maxlength='500'
                                placeholder='请输入'></el-input>
                            <span v-else class='viewContent'>{{formData.purposeContent}}</span>  
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='初稿完成时间:' prop='draftCompletionTime'>
                            <el-date-picker v-if='isEdit' style='width:100%' v-model="formData.draftCompletionTime" value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
                            </el-date-picker>
                            <span v-else class='viewContent'>{{formData.draftCompletionTime}}</span>            
                        </el-form-item>
                     </el-col>
                     <el-col :span='8'>
                        <el-form-item label='会签完成时间:' prop='countersignCompleteTime'>
                            <el-date-picker v-if='isEdit' style='width:100%' v-model="formData.countersignCompleteTime" value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
                            </el-date-picker>
                            <span v-else class='viewContent'>{{formData.countersignCompleteTime}}</span>            
                        </el-form-item>
                     </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label='备注:' prop='comments'>
                            <el-input v-if='isEdit' v-model='formData.comments' type='textarea' :rows='4' resize='none' show-word-limit maxlength='500'
                                placeholder='请输入'></el-input>
                            <span v-else class='viewContent'>{{formData.comments||"暂无填写"}}</span>  
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='相关文档:'>
                            <upload :isEdit='isEdit' ref='upload' :showList='true' :multiple="false" :modular="modular" :modularInnerId="modularInnerId"
                                @fileChange="fileChange" @preView='preView' @fileOnSuccess="fileOnSuccess" accept=''
                                @beforeFileUpload="beforeFileUpload">
                                <el-button slot="uploadBtn" size="medium" class="uploadBtn">
                                    <i class="el-icon-plus"></i> 上传附件</el-button>
                            </upload>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="btn" v-if='isEdit'>
            <el-button size="medium" @click="onCancel">取消</el-button>
            <el-button type="primary" size="medium" @click="onSubmit">保存</el-button>
        </div>
    </div>
</template>
<script>
    import { EcoFile } from '@/components/file/main.js'
    import tagSelect from '@/components/orgPick/tagSelect.vue'
    import { EcoUtil } from '@/components/util/main.js'
    import upload from '../components/upload.vue'
    import {mapState} from 'vuex'
    import { getItemFetchId,planPublishAdd,planPublishUpdate,planPublishDetails,getUserInfoByOrgId} from  '../../service/service.js'
    export default {
        data(){
            return {
                modularInnerId:'',
                modular:'business_guidePlan',
                formData:{
                    dept:'',
                    deptInitDataStr:'',
                    office:'',
                    officeInitDataStr:'',
                    businessGuideName:'',
                    responsibleUserInitDataStr:'',
                    responsibleUser:'',
                    editType:'',
                    year: (new Date().getFullYear()+''),
                    purposeContent:'',
                    draftCompletionTime:'',
                    countersignCompleteTime:'',
                    comments:''
                },
                rules:{
                    dept: [{ required: true, message: '部门为必选项', trigger: 'change' }],
                    office: [{ required: true, message: '科室为必选项', trigger: 'change' }],
                    responsibleUser: [{ required: true, message: '责任人为必选项', trigger: 'change' }],
                    editType: [{ required: true, message: '制修订为必选项', trigger: 'change' }],
                    year:[{ required: true, message: '年度为必选项', trigger: 'change' }],
                    businessGuideName : [{ required: true, message: '业务指南名称为必填项', trigger: 'blur' }],
                    // purposeContent:[{ required: true, message: '业务指南编制目的及内容简介为必填项', trigger: 'blur' }],
                    draftCompletionTime:[{ required: true, message: '初稿完成时间为必选项', trigger: 'change' }],
                    countersignCompleteTime:[{ required: true, message: '会签完成时间为必选项', trigger: 'change' }],
                    // comments: [{ required: true, message: '备注为必填项', trigger: 'blur' }]
                },
                loading:false
            }
        },
        components:{
            upload,
            tagSelect
        },
        computed: {
            ...mapState(['editType']),
            id(){
                return this.$route.params.id;
            },
            caseType(){
                return this.$route.params.caseType;
            },
            phase(){
                return this.$route.params.phase;
            },
            isEdit() {
                return this.caseType !== 'viewCase'
            }
        },
        created(){
            if (this.id && this.id != 0) {
                this.getDetailData();
            }else {
                getItemFetchId().then(res => {
                    this.modularInnerId = res.data;
                })
            }
        },
        methods:{
            getDetailData(){
                this.loading = true;
                planPublishDetails(this.id).then(res=>{
                   res.data.data.year+=''; 
                   res.data.data.deptInitDataStr = `{"type":"DEPT","orgId":"${res.data.data.dept}","linkId":"${res.data.data.dept}"}`
                   res.data.data.officeInitDataStr = `{"type":"DEPT","orgId":"${res.data.data.office}","linkId":"${res.data.data.office}"}`
                   this.formData = res.data.data;
                   this.$set(this.formData,'responsibleUserInitDataStr','');
                   getUserInfoByOrgId(this.formData.responsibleUser).then(response=>{
                        this.$set(this.formData, 'responsibleUserInitDataStr', `{"type":"PERSONNEL","orgId":"${response.data.departments[0].id}.${response.data.id}","linkId":"${response.data.id}"}`);
                   })
                   this.loading = false;
                })
            },
            onCancel() {
                EcoUtil.getSysvm().closeDialog();
            },
            onSubmit(){
                this.$refs.editPlanForm.validate((valid) => {
                    if (valid) {
                         this.loading = true;
                         let params = {
                            phase:this.phase,
                            dept:this.formData.dept,
                            office:this.formData.office,
                            businessGuideName:this.formData.businessGuideName,
                            responsibleUser:this.formData.responsibleUser,
                            editType:this.formData.editType,
                            year: this.formData.year,
                            purposeContent:this.formData.purposeContent,
                            draftCompletionTime:this.formData.draftCompletionTime,
                            countersignCompleteTime:this.formData.countersignCompleteTime,
                            comments:this.formData.comments
                         }
                         if(this.caseType === 'editCase'){
                            params.id = this.id;
                            planPublishUpdate(params).then(res=>{
                                this.loading = false;
                                let doObj = {}
                                doObj.action = 'editBusinessGuidePlan';
                                doObj.data = {};
                                doObj.close = true;
                                EcoUtil.getSysvm().callBackDialogFunc(doObj);
                            })
                         }else{
                            params.id = this.modularInnerId;
                            planPublishAdd(params).then(res=>{
                                this.loading = false;
                                let doObj = {}
                                doObj.action = 'addBusinessGuidePlan';
                                doObj.data = {};
                                doObj.close = true;
                                EcoUtil.getSysvm().callBackDialogFunc(doObj);
                            }).catch(err=>{
                                this.loading = false;
                            })
                         }
                    }else{
                        return false;
                    }
                })

            },
            beforeFileUpload(file, callback) {
                callback(true);
            },
            preView(item) {
                EcoFile.openFileHeaderByView(item.id, item.name);
            },
            fileOnSuccess(response) {},
            fileChange(file, fileList) {},
            selectRoleUser(data) {
                //选择人
                if (!data.id && data.itemArray.length === 0) {
                    //人员删除
                    this.formData.responsibleUser='';
                    this.formData.responsibleUserInitDataStr = '';
                    this.$refs.editPlanForm.validateField('responsibleUser');
                } else {
                    this.formData.responsibleUser= data.itemArray[0].linkId;
                    this.$refs.responsibleUser.clearValidate();

                    try{
                    let orgId = data.orgId.split('.')[0];
                    getUserInfoByOrgId(data.itemArray[0].linkId).then(res => {
                        var len = 0;
                        if (res.data.departments && res.data.departments.length > 1) {
                            res.data.departments.forEach((item, i) => {
                                if (item.id == orgId) {
                                    len = i;
                                }
                            })
                        }

                        if(res.data.departments[len].levelV2 === "dept_class"){
                            //部门
                            this.formData.dept = res.data.departments[len].id;
                        }else if(res.data.departments[len].levelV2 === "dept_office"){
                            //科室
                            this.formData.office = res.data.departments[len].id; 
                            res.data.departments[len].orgPathDeptList.forEach(item=>{
                                if(item.levelV2 === 'dept_class'){
                                    this.formData.dept = item.id;
                                }
                            })
                        }
                        if(this.formData.office){
                            this.formData.officeInitDataStr = `{"type":"DEPT","orgId":"${this.formData.office}","linkId":"${this.formData.office}"}`;
                        }
                        if(this.formData.dept){
                            this.formData.deptInitDataStr = `{"type":"DEPT","orgId":"${this.formData.dept}","linkId":"${this.formData.dept}"}`;
                        }
                    })
                    }catch(err){console.log(err)}


                }
            },
            selectRoleDept(data,type){
                if (!data.id && data.itemArray.length === 0) {
                    if(type==='dept'){
                        this.formData.deptInitDataStr = '';
                        this.formData.dept = '';
                        this.$refs.editPlanForm.validateField('dept'); //必填验证
                    }else if(type==='office'){
                        this.formData.officeInitDataStr = '';
                        this.formData.office = '';
                        this.$refs.editPlanForm.validateField('office'); //必填验证
                    }
                } else {
                    if(type === 'dept'){
                        this.formData.dept = data.orgId;
                        this.$refs.dept.clearValidate();
                    }else if(type==='office'){
                        this.formData.office = data.orgId;
                        this.$refs.office.clearValidate();
                    }
                }

            }
        }
    }
</script>
<style scoped>
 .editPlanPage {
        background: #fff;
        height: 100%;
    }

    .editPlanPage .btn {
        text-align: center;
        padding: 10px;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #ddd;
    }

    .editPlanPage .addForm {
        overflow: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 60px;
        padding: 0 10px;
    }

    .editPlanPage .addForm .el-input,
    .editPlanPage .addForm .el-select {
        width: 200px;
    }
</style>