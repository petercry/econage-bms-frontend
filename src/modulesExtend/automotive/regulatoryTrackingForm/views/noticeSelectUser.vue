<template>
    <div class='noticeSelectUser'>
        <div class='addForm' v-loading='loading'>
            <el-form :model='formData' ref='noticeSelectUserForm' :rules='rules' label-position='right' label-width='100px'>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='校对人员' prop='proofreadingAssignee' ref='selectUser'>
                            <tag-select  placeholder="选择人员" style="width:100%;vertical-align: top;" :initDataStr="formData.initDataStr"
                               :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data,'proofreadingAssignee')}">
                            </tag-select>
                        </el-form-item>
                        <el-form-item label='审核人员' prop='approvingAssignee' ref='selectApprovingAssignee'>
                            <tag-select  placeholder="选择人员" style="width:100%;vertical-align: top;" :initDataStr="formData.initApprovingDataStr"
                               :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data,'approvingAssignee')}">
                            </tag-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="btn">
            <el-button size="medium" @click="onCancel">取消</el-button>
            <el-button type="primary" size="medium" @click="onSubmit">确定</el-button>
        </div>
    </div>
</template>
<script>
    import { EcoUtil } from '@/components/util/main.js'
    import tagSelect from '@/components/orgPick/tagSelect.vue'
    import {getUserInfoByOrgId} from '../service/service.js'
    export default {
        data() {
            return {
                loading:false,
                rules: {
                    proofreadingAssignee: [{ required: true, message: '校对人员为必选项', trigger: 'change' }],
                    approvingAssignee: [{ required: true, message: '审核人员为必选项', trigger: 'change' }],
                },
                formData: {
                    proofreadingAssignee: '',
                    initDataStr:'',
                    approvingAssignee:'',
                    initApprovingDataStr:''
                }
            }
        },
        created() {
            if(this.$route.query.proofreadingAssignee && this.$route.query.approvingAssignee){
                //退回项默认上次审批人员
                this.loading = true;
                this.formData.proofreadingAssignee = this.$route.query.proofreadingAssignee;
                this.formData.approvingAssignee = this.$route.query.approvingAssignee;
                Promise.all([
                    getUserInfoByOrgId(this.formData.proofreadingAssignee),
                    getUserInfoByOrgId(this.formData.approvingAssignee)]).then(response => {
                        this.formData.initDataStr = `{"type":"PERSONNEL","orgId":"${response[0].data.departments[0].id}.${response[0].data.id}","linkId":"${response[0].data.id}"}`;
                        this.formData.initApprovingDataStr = `{"type":"PERSONNEL","orgId":"${response[1].data.departments[0].id}.${response[1].data.id}","linkId":"${response[1].data.id}"}`;
                        this.loading = false;
                    })
            }
        },
        components:{
            tagSelect
        },
        methods: {
            onCancel() {
                EcoUtil.getSysvm().closeDialog();
            },
            selectRoleUser(data,type) {
                //选择人员
                if (!data.id && data.itemArray.length === 0) {
                    if(type==='proofreadingAssignee'){
                        this.formData.initDataStr = '';
                        this.formData.proofreadingAssignee = '';
                        this.$refs.noticeSelectUserForm.validateField('proofreadingAssignee'); //必填验证
                    }else{
                        this.formData.initApprovingDataStr = '';
                        this.formData.approvingAssignee = '';
                        this.$refs.noticeSelectUserForm.validateField('approvingAssignee'); //必填验证
                    }
                } else {
                    if(type==='proofreadingAssignee'){
                        this.formData.proofreadingAssignee = data.itemArray[0].linkId;;
                        this.$refs.selectUser.clearValidate();
                    }else{
                        this.formData.approvingAssignee = data.itemArray[0].linkId;;
                        this.$refs.selectApprovingAssignee.clearValidate();
                    }
                }
            },
            onSubmit() {
                this.$refs.noticeSelectUserForm.validate((valid) => {
                    if (valid) {
                        let doObj = {}
                        doObj.action = 'noticeSelectUser';
                        doObj.data = {
                            proofreadingAssignee:this.formData.proofreadingAssignee,
                            approvingAssignee:this.formData.approvingAssignee
                        };
                        doObj.close = true;
                        EcoUtil.getSysvm().callBackDialogFunc(doObj);
                    }else{
                        return false;
                    }
                })
            }
        }
    }
</script>
<style scoped>
    .noticeSelectUser {
        background: #fff;
        height: 100%;
    }

    .noticeSelectUser .btn {
        text-align: center;
        padding: 10px;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #ddd;
    }

    .noticeSelectUser .addForm {
        overflow: auto;
        position: absolute;
        top: 15px;
        left: 0;
        right: 0;
        bottom: 60px;
        padding: 0 10px;
    }
</style>