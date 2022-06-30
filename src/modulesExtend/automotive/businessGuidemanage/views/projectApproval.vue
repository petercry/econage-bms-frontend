<template>
    <div class="projectApproval">
        <div class='addForm'>
            <el-form :model='formData' ref='editForm' :rules='rules' v-loading='loading' label-position='right' label-width='145px'>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='业务指南名称:' prop='businessGuideName'>
                            <el-input v-if='isEdit' placeholder='请输入' disabled  v-model='formData.businessGuideName'></el-input>
                            <span class="viewContent" v-else>{{formData.businessGuideName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='起草单位:' prop='draftDept' ref='draftDept'>
                            <tag-select  v-if='isEdit' placeholder="选择机构" style="width:200px;vertical-align: top;" :initDataStr="formData.deptInitDataStr"
                                :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data)}">
                            </tag-select>
                            <span class="viewContent" v-else>{{formData.draftDeptName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='起草人:' prop='draftUser' ref='draftUser'>
                            <tag-select v-if='isEdit' placeholder="选择人员" style="width:200px;vertical-align: top;" :initDataStr="formData.responsibleUserInitDataStr"
                                :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data,'responsibleUser')}">
                            </tag-select>
                            <span v-else class='viewContent'>{{formData.draftUserName}}</span>  
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label='使用范围、目的:' prop='applicationScope'>
                            <el-input v-if='isEdit' v-model='formData.applicationScope' type='textarea' :rows='4' resize='none' show-word-limit maxlength='500'
                                placeholder='请输入'></el-input>
                            <span v-else class='viewContent'>{{formData.applicationScope}}</span>  
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label='业务指南进度计划:' prop='guidelineSchedule'>
                            <el-input v-if='isEdit' v-model='formData.guidelineSchedule' type='textarea' :rows='4' resize='none' show-word-limit maxlength='500'
                                placeholder='请输入'></el-input>
                            <span v-else class='viewContent'>{{formData.guidelineSchedule}}</span>  
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label='对实际工作的指导作用:' prop='guidingFunction'>
                            <el-input v-if='isEdit' v-model='formData.guidingFunction' type='textarea' :rows='4' resize='none' show-word-limit maxlength='500'
                                placeholder='请输入'></el-input>
                            <span v-else class='viewContent'>{{formData.guidingFunction}}</span>  
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label='备注:' prop='comments'>
                            <el-input v-if='isEdit' v-model='formData.comments' type='textarea' :rows='4' resize='none' show-word-limit maxlength='500'
                                placeholder='请输入'></el-input>
                            <span v-else class='viewContent'>{{formData.comments}}</span>  
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='相关文档:'>
                            <upload :isEdit='isEdit' ref='upload' :showList='true' :multiple="false" :modular="modular" :modularInnerId="id"
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
            <el-button type="primary" size="medium" @click="onSubmit">保存</el-button>
            <el-button size="medium" @click="onCancel">取消</el-button>
        </div>
    </div>
</template>
<script>
    import { EcoFile } from '@/components/file/main.js'
    import tagSelect from '@/components/orgPick/tagSelect.vue'
    import upload from './components/upload.vue'
    import { EcoUtil } from '@/components/util/main.js'
    import {programSpecificEstablish,programEstablishUpdate,getUserInfoByOrgId,getOrgsMemberByIds} from '../service/service.js'
    export default {
        name:"projectApproval",
        data(){
            return {
                modular:'projectApproval',
                loading:false,
                formData:{
                    businessGuideName:'',
                    applicationScope:'',
                    guidingFunction:'',
                    comments:'',
                    draftDept:'',
                    deptInitDataStr:'',
                    draftUser:'',
                    responsibleUserInitDataStr:'',
                    guidelineSchedule:'',
                },
                rules:{
                    businessGuideName:[{ required: true, message: '业务指南名称为必填项', trigger: 'blur' }],
                    applicationScope:[{ required: true, message: '使用范围、目的为必填项', trigger: 'blur' }],
                    guidingFunction:[{ required: true, message: '对实际工作的指导作用为必填项', trigger: 'blur' }],
                    // comments:[{ required: true, message: '备注为必填项', trigger: 'blur' }],
                    guidelineSchedule:[{ required: true, message: '业务指南进度计划为必填项', trigger: 'blur' }],
                    draftDept:[{ required: true, message: '起草部门为必填项', trigger: 'change' }],
                    draftUser:[{ required: true, message: '起草人为必填项', trigger: 'change' }]
                }
            }
        },
        computed:{
            id(){
                return this.$route.params.id
            },
            caseType(){
                return this.$route.params.caseType
            },
            isEdit(){
                return this.caseType == 'editCase';
            }
        },
        components:{
            tagSelect,
            upload
        },
        created(){
            this.getData();
        },
        methods:{
            beforeFileUpload(file, callback) {
                callback(true);
            },
            preView(item) {
                EcoFile.openFileHeaderByView(item.id, item.name);
            },
            fileOnSuccess(response) {},
            fileChange(file, fileList) {},
            getData(){
                this.loading = true;
                programSpecificEstablish(this.id).then(res=>{
                    this.formData = res.data.data;
                    this.$set(this.formData, 'responsibleUserInitDataStr', '');
                    this.$set(this.formData,'draftDeptName','');
                    this.$set(this.formData, 'draftUserName' ,'');
                    if(res.data.data.draftDept){
                        getOrgsMemberByIds([
                            {
                                type: "DEPT",
                                orgId: res.data.data.draftDept,
                                linkId: res.data.data.draftDept,
                            }
                        ]).then(response=>{
                            this.$set(this.formData,'draftDeptName',response.data[0]);
                        })
                        this.$set(this.formData,'deptInitDataStr',`{"type":"DEPT","orgId":"${res.data.data.draftDept}","linkId":"${res.data.data.draftDept}"}`);
                    }
                    if(res.data.data.draftUser){
                        getUserInfoByOrgId(res.data.data.draftUser).then(response=>{
                            this.$set(this.formData, 'draftUserName' ,response.data.mi);
                            this.$set(this.formData, 'responsibleUserInitDataStr', `{"type":"PERSONNEL","orgId":"${response.data.departments[0].id}.${response.data.id}","linkId":"${response.data.id}"}`);
                            this.loading = false;
                        })
                    } 
                })
            },
            onCancel() {
                EcoUtil.getSysvm().closeDialog();
            },
            onSubmit(){
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        let params = {
                            draftDept:this.formData.draftDept,
                            draftUser:this.formData.draftUser,
                            guidelineSchedule:this.formData.guidelineSchedule,
                            applicationScope:this.formData.applicationScope,
                            relatedStandard:this.formData.relatedStandard,
                            guidingFunction:this.formData.guidingFunction,
                            comments:this.formData.comments
                        }
                        programEstablishUpdate(this.id,params).then(res=>{
                            this.loading = false;
                            let doObj = {}
                            doObj.action = 'projectApproval';
                            doObj.data = {};
                            doObj.close = true;
                            EcoUtil.getSysvm().callBackDialogFunc(doObj);
                        })
                    }else{
                        return false
                    }
                })
            
            },
            selectRoleDept(data){
                if (!data.id && data.itemArray.length === 0) {
                    this.formData.deptInitDataStr = '';
                    this.formData.draftDept = '';
                    this.$refs.editForm.validateField('draftDept'); //必填验证
                }else{
                    this.formData.draftDept =  data.orgId;
                    this.$refs.draftDept.clearValidate();
                } 
            },
            selectRoleUser(data){
                if (!data.id && data.itemArray.length === 0) {
                     this.formData.draftUser = '';
                     this.formData.responsibleUserInitDataStr = '';
                     this.$refs.editForm.validateField('draftUser'); //必填验证
                }else{
                    this.formData.draftUser =  data.itemArray[0].linkId;
                    this.$refs.draftUser.clearValidate();
                }
            },
        }
    }
</script>
<style scoped>
.projectApproval{
    background: #fff;
    height: 100%;
}
.projectApproval .btn {
        text-align: center;
        padding: 10px;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #ddd;
    }

    .projectApproval .addForm {
        overflow: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 60px;
        padding: 0 10px;
    }

    .projectApproval .addForm .el-input,
    .projectApproval .addForm .el-select {
        width: 200px;
    }
</style>