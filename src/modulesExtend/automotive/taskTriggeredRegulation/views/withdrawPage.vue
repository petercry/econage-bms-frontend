<template>
    <div class='withdrawPage'>
        <div class='addForm'>
            <el-form :model='formData' ref='withdrawForm' :rules='rules' v-loading='loading' label-position='right' label-width='100px'>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='不点检说明' prop='content'>
                            <el-input v-model='formData.content' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000' placeholder='请输入'></el-input>
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
    import { regulationChangeNotCheck } from '../service/service.js'
    export default {
        data() {
            return {
                loading: false,
                ids: [],
                rules: {
                    content: [{ required: true, message: '不点检说明为必填项', trigger: 'blur' }],
                },
                formData: {
                    content: ''
                }
            }
        },
        created() {
            this.ids = JSON.parse(this.$route.params.id);
        },
        methods: {
            onCancel() {
                EcoUtil.getSysvm().closeDialog();
            },
            onSubmit() {
                this.$refs.withdrawForm.validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        regulationChangeNotCheck(this.ids,this.formData.content).then(res => {
                            this.loading = false;
                            let doObj = {}
                            doObj.action = 'withdraw';
                            doObj.data = {};
                            doObj.close = true;
                            EcoUtil.getSysvm().callBackDialogFunc(doObj);
                        })
                    }else{
                        return false;
                    }
                })
            }
        }
    }
</script>
<style scoped>
    .withdrawPage {
        background: #fff;
        height: 100%;
    }

    .withdrawPage .btn {
        text-align: center;
        padding: 10px;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #ddd;
    }

    .withdrawPage .addForm {
        overflow: auto;
        position: absolute;
        top: 20px;
        left: 0;
        right: 0;
        bottom: 60px;
        padding: 0 10px;
    }
</style>