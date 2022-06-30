<template>
    <div class='editCertificate'>
        <div class='addForm'>
            <el-form :model='formData' ref='certificateForm' :rules='rules' v-loading='loading' label-position='right' label-width='130px'>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='类别:' prop='category'>
                            <el-select filterable v-if='isEdit' v-model='formData.category'>
                                <el-option v-for='(item,index) in typeList' :value='item.id' :label='item.text' :key='item.id'></el-option>
                            </el-select>
                            <span class='viewContent' v-else>{{formData.category|restData}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label='代号:' prop='codeName'>
                            <el-input clearable v-if='isEdit' placeholder='请输入' v-model='formData.codeName'></el-input>
                            <span class="viewContent" v-else>{{formData.codeName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='证书编号:' prop='certificateNo'>
                            <el-input clearable v-if='isEdit' placeholder='请输入' v-model='formData.certificateNo'></el-input>
                            <span class="viewContent" v-else>{{formData.certificateNo}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label='车辆品牌:' prop='vehicleBrand'>
                            <el-input clearable v-if='isEdit' placeholder='请输入' v-model='formData.vehicleBrand'></el-input>
                            <span class="viewContent" v-else>{{formData.vehicleBrand}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row>
                    <el-col :span='23'>
                        <el-form-item label='车辆类型:' prop='vehicleType'>
                            <el-input clearable style='width:98%' v-if='isEdit' placeholder='请输入' v-model='formData.vehicleType'></el-input>
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='证书有效开始日期:' prop='validityStartDate'>
                            <el-date-picker v-if='isEdit' v-model="formData.validityStartDate" value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
                            </el-date-picker>
                            <span class="viewContent" v-else>{{formData.validityStartDate}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label='证书有效截止日期:' prop='validityEndDate'>
                            <el-date-picker v-if='isEdit' v-model="formData.validityEndDate" value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
                            </el-date-picker>
                            <span class="viewContent" v-else>{{formData.validityEndDate}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='相关文档:'>
                            <!-- accept='.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.pdf' -->
                            <upload style='width:98%' :isEdit='isEdit' :showList='true' :multiple="false" :modular="modular" :modularInnerId="certificateModularInnerId"
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
    var _self;
    import { EcoUtil } from '@/components/util/main.js'
    import { EcoFile } from '@/components/file/main.js'
    import { getItemFetchId, certificateSingle, certificateUpdate, certificateAdd } from '../service/service.js'
    import ecoFileUploadBtn from '@/components/file/ecoFileUploadBtn.vue'
    import upload from '../../regulatoryTrackingForm/views/components/upload.vue'
    import { mapState } from 'vuex'
    export default {
        name: 'editCertificate',
        data() {
            return {
                modular: 'certificate',
                certificateModularInnerId: '',
                id: "",
                caseType: '',
                formData: {
                    category: '',
                    codeName: '',
                    certificateNo: '',
                    vehicleBrand: '',
                    validityStartDate: '',
                    validityEndDate: ''
                },
                rules: {
                    category: [{ required: true, message: '类别为必填项', trigger: 'blur' }],
                    codeName: [{ required: true, message: '代号为必填项', trigger: 'blur' }]
                },
                loading: false,
                fileList: []
            }
        },
        computed: {
            ...mapState(['typeList']),
            isEdit() {
                return this.caseType !== 'viewCase'
            },
        },
        components: {
            ecoFileUploadBtn,
            upload
        },
        created() {
            _self=this;
            this.id = this.$route.params.id;
            this.caseType = this.$route.params.caseType;
            if (this.id && this.id != 0) {
                this.getDetailsInfo();
            } else {
                getItemFetchId().then(res => {
                    this.certificateModularInnerId = res.data;
                })
            }
        },
        filters: {
            restData: function (data) {
                var str = '';
                _self.typeList.forEach(item => {
                    if (item.id === data) {
                        str = item.text;
                    }
                })
                return str;
            }
        },
        methods: {
            preView(item) {
                EcoFile.openFileHeaderByView(item.id, item.name);
            },
            beforeFileUpload(file, callback) {
                // var testmsg = (file.name.substring(file.name.lastIndexOf('.') + 1)).toLocaleLowerCase();
                // // const isLt2M = file.size/1024/1024<6
                // const extension = testmsg === 'doc';
                // const extension2 = testmsg === 'docx';
                // const extension3 = testmsg === 'xls';
                // const extension4 = testmsg === 'xlsx';
                // const extension5 = testmsg === 'ppt';
                // const extension6 = testmsg === 'pptx';
                // const extension7 = testmsg === 'txt';
                // const extension8 = testmsg === 'pdf';
                // if (!extension && !extension2 && !extension3 && !extension4 && !extension5 && !extension6 && !extension7 && !extension8) {
                //     this.$message({
                //         message: '上传文件只能是.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.pdf格式!',
                //         type: 'warning',
                //         customClass: 'message',
                //         offset: 160
                //     });
                // }
                // if(!isLt2M){
                //     this.$message({
                //         message: '上传文件不能超过6MB!',
                //         type: 'warning',
                //         customClass: 'message',
                //         offset: 160
                //     })
                // }
                // callback((extension || extension2 || extension3 || extension4 || extension5 || extension6 || extension7 || extension8));
                callback(true);
            },
            fileOnSuccess(response) {

            },
            fileChange(file, fileList) {
                this.fileList = fileList;
            },
            getDetailsInfo() {
                this.loading = true;
                certificateSingle(this.id).then(res => {
                    this.formData = res.data;
                    this.certificateModularInnerId = res.data.id;
                    this.loading = false;
                }).catch(err => {
                    this.loading = false;
                })

            },
            onCancel() {
                EcoUtil.getSysvm().closeDialog();
            },
            onSubmit() {
                this.$refs.certificateForm.validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        let params = {
                            category: this.formData.category,
                            codeName: this.formData.codeName,
                            certificateNo: this.formData.certificateNo,
                            vehicleBrand: this.formData.vehicleBrand,
                            validityStartDate: this.formData.validityStartDate || '',
                            validityEndDate: this.formData.validityEndDate || ''
                        }
                        if (this.caseType === 'editCase') {
                            params.id = this.id;
                            certificateUpdate(params).then(res => {
                                this.loading = false;
                                let doObj = {}
                                doObj.action = 'editCertificate';
                                doObj.data = {};
                                doObj.close = true;
                                EcoUtil.getSysvm().callBackDialogFunc(doObj);
                            }).catch(err => {
                                this.loading = false;
                            })
                        } else if (this.caseType === 'addCase') {
                            params.id = this.certificateModularInnerId;
                            certificateAdd(params).then(res => {
                                this.loading = false;
                                let doObj = {}
                                doObj.action = 'addCertificate';
                                doObj.data = {};
                                doObj.close = true;
                                EcoUtil.getSysvm().callBackDialogFunc(doObj);
                            }).catch(err => {
                                this.loading = false;
                            })
                        }

                    } else {
                        return false;
                    }
                })
            }
        }
    }
</script>
<style scoped>
    .editCertificate {
        background: #fff;
        height: 100%;
    }

    .editCertificate .btn {
        text-align: center;
        padding: 10px;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #ddd;
    }

    .editCertificate .addForm {
        overflow: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 60px;
        padding: 0 10px;
        padding-top: 20px;
    }

    .editCertificate .addForm .el-input,
    .editCertificate .addForm .el-select {
        width: 200px;
    }

    .viewContent {
        color: #606266;
    }

    .editCertificate .uploadBtn {
        position: absolute;
        left: 0px;
        right: 0px;
        top: 0px;
        bottom: 0px;
        width: 100%;
        background: transparent;
        color: #409EFF;
        border: 0;
        padding: 5px 20px;
    }

    /* .editCertificate .certificateUpload /deep/ .btn{
        margin-left:0px;
        padding:7px 10px;
    } */
</style>