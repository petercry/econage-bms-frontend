<template>
    <div class='editColl'>
        <div class='addForm'>
            <el-form :model='formData' ref='editCollForm' :rules='rules' v-loading='loading' label-position='right' label-width='145px'>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label='编号:' prop='code'>
                            <el-input  v-if='isEdit' placeholder='请输入' v-model='formData.code'></el-input>
                            <span class="viewContent" v-else>{{formData.code}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label='协同项目:' prop='projectName'>
                            <el-input  v-if='isEdit' placeholder='请输入' v-model='formData.projectName'></el-input>
                            <span class="viewContent" v-else>{{formData.projectName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label='开始时间:' prop='startDate'>
                            <el-date-picker v-if='isEdit'  v-model="formData.startDate" value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
                            </el-date-picker>
                            <span v-else class='viewContent'>{{formData.startDate}}</span>            
                        </el-form-item>
                     </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label='结束时间:' prop='endDate'>
                            <el-date-picker v-if='isEdit'  v-model="formData.endDate" value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
                            </el-date-picker>
                            <span v-else class='viewContent'>{{formData.endDate}}</span>            
                        </el-form-item>
                     </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item label='协同状态' prop='status' class='is-required'>
                            <el-radio-group  v-if='isEdit' v-model="formData.status">
                                <el-radio :label="key" v-for='(val,key) in statusList' :key='key'>{{val}}</el-radio>
                            </el-radio-group>
                            <span v-else class="viewContent">{{formData.status}}</span>
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
    import {cooperateManageSingle,cooperateManageAdd,cooperateManageUpdate} from '../../service/service.js'
    import { EcoUtil } from '@/components/util/main.js'
    import { mapState } from "vuex";
    export default {
        name:'editColl',
        data(){
            return {
                loading:false,
                formData:{
                    code:'',
                    projectName:'',
                    startDate: "", //开始时间
                    endDate: "", //结束时间
                    status: "" //状态
                },
                rules:{
                    code:[{required: true,message: '编号为必填项',trigger: 'blur'}],
                    projectName:[{required: true,message: '协同项目为必填项',trigger: 'blur'}],
                    startDate: [{required: true,message: '开始时间为必选项',trigger: 'change'}] , 
                    endDate: [{required: true,message: '结束时间为必选项',trigger: 'change'}], 
                }
            }
        },
        computed:{
            ...mapState(['statusList']),
            id(){
                return this.$route.params.id;
            },
            caseType(){
                return this.$route.params.caseType
            },
            isEdit() {
                return this.caseType !== 'viewCase'
            }
        },
        created(){
            if (this.id && this.id != 0) {
                this.getDetailsInfo(); 
            }
        },
        methods:{
            getDetailsInfo(){
                this.loading = true;
                cooperateManageSingle(this.id).then(res=>{
                    this.loading = false;
                    this.formData.code = res.data.code;  
                    this.formData.projectName=res.data.projectName;   
                    this.formData.startDate = res.data.startDate;    
                    this.formData.endDate = res.data.endDate;     
                    this.formData.status = res.data.status;    
                })

            },
            onCancel() {
                EcoUtil.getSysvm().closeDialog();
            },
            onSubmit() {
                this.$refs.editCollForm.validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        let params = {
                            "code": this.formData.code, //编号
                            "projectName": this.formData.projectName, //协同项目
                            "startDate": this.formData.startDate, //开始时间
                            "endDate": this.formData.endDate, //结束时间
                            "status": this.formData.status //状态
                        }
                        if (this.caseType === 'editCase') {
                            params.id = this.id;
                            cooperateManageUpdate(params).then(res=>{
                                this.loading = false;
                                let doObj = {};
                                doObj.action = 'editColl';
                                doObj.data = {};
                                doObj.close = true;
                                EcoUtil.getSysvm().callBackDialogFunc(doObj);
                            })

                        }else{
                            cooperateManageAdd(params).then(res=>{
                                this.loading = false;
                                let doObj = {};
                                doObj.action = 'addColl';
                                doObj.data = {};
                                doObj.close = true;
                                EcoUtil.getSysvm().callBackDialogFunc(doObj);
                            })   
                        }


                    }else{
                        return false
                    }
                })
            }
        }
    }
</script>
<style scoped>
    .editColl {
        background: #fff;
        height: 100%;
    }

    .editColl .btn {
        text-align: center;
        padding: 10px;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #ddd;
    }

    .editColl .addForm {
        overflow: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 60px;
        padding: 0 10px;
    }

    .editColl .addForm .el-input,
    .editColl .addForm .el-select,
    .editColl .addForm .el-date-editor {
        width: 270px;
    }

    .editColl .viewContent {
        color: #606266;
    }

</style>