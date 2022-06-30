<template>
    <div class='appropeUser'>
        <div class='addForm'>
            <el-form :model='formData' ref='appropeForm' :rules='rules' label-position='right' label-width='100px'>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='审批人' prop='assigneeId' ref='selectUser'>
                            <tag-select  placeholder="选择人员" style="width:100%;vertical-align: top;" :initDataStr="formData.initDataStr"
                               :initOptions="{selectNum:1,selectType:'User'}" @callBack="selectRoleUser">
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
                rules: {
                    assigneeId: [{ required: true, message: '审批人为必选项', trigger: 'change' }],
                },
                formData: {
                    assigneeId: '',
                    initDataStr:''
                }
            }
        },
        created() {
            if(this.$route.query.assigneeId){
                //退回项默认上次审批人员
                this.loading = true;
                this.formData.assigneeId = this.$route.query.assigneeId;
                getUserInfoByOrgId(this.formData.assigneeId).then(response => {
                    this.formData.initDataStr = `{"type":"PERSONNEL","orgId":"${response.data.departments[0].id}.${response.data.id}","linkId":"${response.data.id}"}`;
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
            selectRoleUser(data) {
                //选择人员
                if (!data.id && data.itemArray.length === 0) {
                    this.formData.initDataStr = '';
                    this.formData.assigneeId = '';
                    this.$refs.appropeForm.validateField('assigneeId'); //必填验证
                } else {
                    this.formData.assigneeId = data.itemArray[0].linkId;;
                    this.$refs.selectUser.clearValidate();
                }
            },
            onSubmit() {
                this.$refs.appropeForm.validate((valid) => {
                    if (valid) {
                        let doObj = {}
                        doObj.action = 'appropeUser';
                        doObj.data = {assigneeId:this.formData.assigneeId};
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
    .appropeUser {
        background: #fff;
        height: 100%;
    }

    .appropeUser .btn {
        text-align: center;
        padding: 10px;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #ddd;
    }

    .appropeUser .addForm {
        overflow: auto;
        position: absolute;
        top: 15px;
        left: 0;
        right: 0;
        bottom: 60px;
        padding: 0 10px;
    }
</style>