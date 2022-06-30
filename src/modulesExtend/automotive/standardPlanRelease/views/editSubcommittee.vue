<template>
    <div class='editSubcommittee'>
        <div class='addForm'>
            <el-form :model='formData' ref='subcommitteeForm' :rules='rules' v-loading='loading' label-position='right' label-width='100px'>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='名称' prop='name'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.name'></el-input>
                            <span v-else class='viewContent'>{{formData.name}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='23'>
                        <el-form-item label='责任人' prop='responsibleUser' ref='responsibleUser'>
                                <tag-select v-if='isEdit' placeholder="选择人员" style="width:100%;vertical-align: top;" :initDataStr="formData.initDataStr"
                                    :initOptions="{selectNum:1,selectType:'User'}" @callBack="selectRoleUser">
                                </tag-select>
                            <span v-else class='viewContent'>{{formData.responsibleUserName||'暂无填写'}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='23'>
                        <el-form-item label='序号' prop='order'>
                            <el-input v-if='isEdit' @blur="numberInput('order')" placeholder="请输入"
                                v-model='formData.order'></el-input>
                            <span class='viewContent' v-else>{{formData.order}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="btn">
            <el-button size="medium" @click="onCancel">取消</el-button>
            <el-button type="primary" size="medium" @click="onSubmit">保存</el-button>
        </div>
    </div>
</template>
<script>
    import { EcoUtil } from '@/components/util/main.js'
    import { subStdCommitteeAdd,subStdCommitteeDetails,getUserInfoByOrgId,subStdCommitteeUpdate } from '../service/service.js'
    import tagSelect from '@/components/orgPick/tagSelect.vue'
    export default {
        data() {
            return {
                caseType:'',
                loading: false,
                id: '',
                rules: {
                    name: [{ required: true, message: '名称为必填项', trigger: 'blur' }],
                    responsibleUser: [{ required: true, message: '责任人为必填项', trigger: 'change' }],
                    order: [{ required: true, message: '序号为必填项', trigger: 'blur' }]
                },
                formData: {
                    name:'',
                    responsibleUser:'',
                    initDataStr:'',
                    order:''
                }
            }
        },
        created() {
            this.id = this.$route.params.id;
            this.caseType = this.$route.params.caseType;
            if (this.id && this.id != 0) {         
                this.getDetailsInfo();
            }
        },
        computed:{
            isEdit() {
                return this.caseType !== 'viewCase'
            },
        },
        components:{
            tagSelect
        },
        methods: {
            getDetailsInfo(){
                this.loading = true;
                subStdCommitteeDetails(this.id).then(res=>{
                    if(typeof res.data.order === 'number'){
                        res.data.order += '';
                    }
                    this.formData = res.data;
                    this.$set(this.formData, 'initDataStr', '');
                    if(res.data.responsibleUser){
                        getUserInfoByOrgId(res.data.responsibleUser).then(response => {
                            this.$set(this.formData, 'initDataStr', `{"type":"PERSONNEL","orgId":"${response.data.departments[0].id}.${response.data.id}","linkId":"${response.data.id}"}`);
                            this.loading = false;
                        })
                    }else{
                        this.loading = false;
                    }
                })
            },
            numberInput(key) {
                if (this.formData[key]) {
                    this.formData[key] = this.formData[key].replace(/[^\d]/g, "");
                }
            },
            selectRoleUser(data) {
                //责任人
                if (!data.id && data.itemArray.length === 0) {
                    //人员删除
                    this.formData.responsibleUser = '';
                    this.formData.initDataStr = '';
                    this.$refs.subcommitteeForm.validateField('responsibleUser');
                } else {
                    this.formData.responsibleUser = data.itemArray[0].linkId;
                    this.$refs.responsibleUser.clearValidate();
                }
            },
            onCancel() {
                EcoUtil.getSysvm().closeDialog();
            },
            onSubmit() {
                this.$refs.subcommitteeForm.validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        let params = {
                            name:this.formData.name,
                            responsibleUser:this.formData.responsibleUser,
                            order:this.formData.order
                        };
                        if(this.caseType ==='addCase'){
                            subStdCommitteeAdd(params).then(res => {
                                this.loading = false;
                                let doObj = {}
                                doObj.action = 'addSubcommittee';
                                doObj.data = {};
                                doObj.close = true;
                                EcoUtil.getSysvm().callBackDialogFunc(doObj);
                            })
                        }else{
                            params.id = this.id;
                            subStdCommitteeUpdate(params).then(res => {
                                this.loading = false;
                                let doObj = {}
                                doObj.action = 'editSubcommittee';
                                doObj.data = {};
                                doObj.close = true;
                                EcoUtil.getSysvm().callBackDialogFunc(doObj);
                            })
                        }
                    }else{
                        return false;
                    }
                })
            }
        }
    }
</script>
<style scoped>
    .editSubcommittee {
        background: #fff;
        height: 100%;
    }

    .editSubcommittee .btn {
        text-align: center;
        padding: 10px;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #ddd;
    }

    .editSubcommittee .addForm {
        overflow: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 60px;
        padding: 0 10px;
    }
    .f {
        color: #606266;
    }
</style>