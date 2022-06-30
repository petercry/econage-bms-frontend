<template>
    <div class='uploadDialog'>
        <el-form :model='formData' ref='uploadForm' :rules='rules' label-position='right' label-width='100px'>
            <el-row>
                <el-col :span='24'>
                    <el-form-item label='起始页码' prop='firstPage'>
                        <el-input v-model='formData.firstPage'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='24'>
                    <el-form-item label='结束页码' prop='endPage'>
                        <el-input v-model='formData.endPage'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class='tip'>为OCR识别准确请输入有效内容的范围编码</div>
        <div class='tipRed'>*点击确定按钮上传文件,且拆解处理会覆盖原数据</div>

        <div class="btn">
            <el-button size="mini" @click="onCancel">取消</el-button>
            <el-button type="primary" size="mini" @click="onSubmit">确定</el-button>
        </div>

    </div>
</template>
<script>
    import { EcoUtil } from '@/components/util/main.js'
    export default {
        data() {
            return {
                rules: {
                    firstPage: [{ required: true, message: '起始页码为必填项', trigger: 'blur' }],
                    endPage: [{ required: true, message: '结束页码为必填项', trigger: 'blur' }]
                },
                formData: {
                    firstPage: '',
                    endPage: ''
                }
            }
        },
        methods: {
            onCancel() {
                EcoUtil.getSysvm().closeDialog();
            },
            onSubmit() {
                this.$refs.uploadForm.validate((valid) => {
                    if (valid) {
                        let doObj = {};
                        doObj.action = 'uploadDialog';
                        doObj.data = {};
                        doObj.close = true;
                        doObj.firstPage = this.formData.firstPage
                        doObj.endPage = this.formData.endPage
                        EcoUtil.getSysvm().callBackDialogFunc(doObj);
                    } else {
                        return false;
                    }

                })
            }
        },
        watch: {
            'formData.firstPage'(newV, oldV) {
                if (/^(\d*)$/ig.test(newV)) {
                    this.formData.firstPage = newV;
                } else {
                    this.formData.firstPage = oldV;
                }
            },
            'formData.endPage'(newV, oldV) {
                if (/^(\d*)$/ig.test(newV)) {
                    this.formData.endPage = newV;
                } else {
                    this.formData.endPage = oldV;
                }
            }
        }
    }
</script>
<style scoped>
    .uploadDialog {
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
    }

    .uploadDialog .tip,
    .uploadDialog .tipRed {
        font-size: 12px;
        color: rgb(176, 177, 179);

    }

    .uploadDialog .tip {
        margin: 0px 0px 5px 20px;
    }

    .uploadDialog .tipRed {
        margin: 0px 0px 20px 20px;
        color: #F56C6C;
    }

    .uploadDialog .btn {
        position: absolute;
        right: 0px;
        bottom: 0px;
    }
</style>