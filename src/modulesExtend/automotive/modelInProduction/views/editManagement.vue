<template>
    <div class='editManagement'>
        <div class='addForm'>
            <el-form :model='formData' ref='managementForm' :rules='rules' v-loading='loading' label-position='right'
                label-width='180px'>
                <el-row>
                    <el-col :span='10'>
                        <el-form-item label='申请单编号:' prop='applicationCode'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.applicationCode'></el-input>
                            <span class="viewContent" v-else>{{formData.applicationCode}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='10'>
                        <el-form-item label='认证政策/法规编号:' prop='certPolicyCode'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.certPolicyCode'></el-input>
                            <span class="viewContent" v-else>{{formData.certPolicyCode}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='20'>
                        <el-form-item label='认证政策/法规名称:' prop='certPolicyName'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.certPolicyName'></el-input>
                            <span class="viewContent" v-else>{{formData.certPolicyName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='10'>
                        <el-form-item label='发起日期:' prop='startDate'>
                            <el-date-picker v-if='isEdit' v-model="formData.startDate"
                                value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
                            </el-date-picker>
                            <span class="viewContent" v-else>{{formData.startDate}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='10'>
                        <el-form-item label='跟踪人:' prop='initDataStr'>
                            <tag-select v-if='isEdit' placeholder="选择人员" style="width:100%;vertical-align: top;"
                                :initDataStr="formData.initDataStr" :initOptions="{selectNum:1,selectType:'User'}"
                                @callBack="selectRoleUser">
                            </tag-select>
                            <span class='viewContent' v-else>{{formData.trackerName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='20'>
                        <el-form-item label='主要涉及标准:' prop='mainlyStandard'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.mainlyStandard'></el-input>
                            <span class='viewContent' v-else>{{formData.mainlyStandard}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='10'>
                        <el-form-item label='公告应对状态:' prop='annoucementCopeStatus'>
                            <el-select filterable v-if='isEdit' v-model='formData.annoucementCopeStatus'>
                                <el-option v-for='(item,key) in copeStatus' :value='key' :label='item' :key='key'>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span='10'>
                        <el-form-item label='CCC应对状态:' prop='cccCopeStatus'>
                            <el-select filterable v-if='isEdit' v-model='formData.cccCopeStatus'>
                                <el-option v-for='(item,key) in copeStatus' :value='key' :label='item' :key='key'>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='20'>
                        <el-form-item label='整改会签文件:'>
                            <upload :isEdit='isEdit' :showList='true' :multiple="false" :modular="modular"
                                :modularInnerId="rectificationModularInnerId" @fileChange="fileChange"
                                @preView='preView' @fileOnSuccess="fileOnSuccess"
                                accept=''
                                @beforeFileUpload="beforeFileUpload">
                                <el-button slot="uploadBtn" size="medium" class="uploadBtn">
                                    <i class="el-icon-plus"></i> 上传附件
                                </el-button>
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
    import upload from './components/upload.vue'
    import tagSelect from '@/components/orgPick/tagSelect.vue'
    import { EcoUtil } from '@/components/util/main.js'
    import { EcoFile } from '@/components/file/main.js'
    import { getUserInfoByOrgId,getItemFetchId, productioncarVcmAdd, productioncarVcmUpdate, productioncarVcmDetails } from '../service/service.js'
    import { mapState } from 'vuex'
    export default {
        name: 'editManagement',
        data() {
            return {
                rectificationModularInnerId: '',
                modular: 'rectificationManagement_document',
                caseType: '',
                formData: {
                    applicationCode: '',
                    certPolicyCode: '',
                    certPolicyName: '',
                    startDate: '',
                    tracker: '',
                    mainlyStandard: '',
                    annoucementCopeStatus: '',
                    cccCopeStatus: '',
                    initDataStr: ''
                },
                loading: false,
                fileList: []
            }
        },
        components: {
            upload,
            tagSelect
        },
        computed: {
            ...mapState(['copeStatus']),
            isEdit() {
                return this.caseType !== 'viewCase'
            },
            id() {
                return this.$route.params.id;
            },
            rules() {
                let obj = {
                    applicationCode: '申请单编号',
                    certPolicyCode: '认证政策/法规编号',
                    certPolicyName: '认证政策/法规名称',
                    startDate: '发起日期',
                    tracker: '跟踪人',
                    mainlyStandard: '主要涉及标准',
                    annoucementCopeStatus: '公告应对状态',
                    cccCopeStatus: 'CCC应对状态'
                }
                let newObj = {}
                for (var key in obj) {
                    var trigger = (key.search(/(CopeStatus)/g) !== -1) ? 'change' : 'blur'
                    newObj[key] = [{ required: true, message: `${obj[key]}为必填项`, trigger: trigger }];
                }
                return newObj;
            }
        },
        created() {
            _self = this;
            this.caseType = this.$route.params.caseType;
            if (this.id && this.id != 0) {
                this.getDetailsInfo();
            } else {
                getItemFetchId().then(res => {
                    this.rectificationModularInnerId = res.data;
                })
            }
        },
        methods: {
            beforeFileUpload(file, callback) {
                // var testmsg = (file.name.substring(file.name.lastIndexOf('.') + 1)).toLocaleLowerCase();
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
                // callback((extension || extension2 || extension3 || extension4 || extension5 || extension6 || extension7 || extension8));
                callback(true);
            },
            fileOnSuccess(response) {

            },
            preView(item) {
                EcoFile.openFileHeaderByView(item.id, item.name);
            },
            fileChange(file, fileList) {
                this.fileList = fileList;
            },
            selectRoleUser(data) {
                //跟踪人
                if (!data.id && data.itemArray.length === 0) {
                    //人员删除
                    this.formData.tracker = '';
                    this.formData.initDataStr = '';
                } else {
                    this.formData.tracker = data.itemArray[0].linkId;
                }
            },
            getDetailsInfo() {
                this.loading = true;
                productioncarVcmDetails(this.id).then(res => {
                    this.formData = res.data;
                    this.rectificationModularInnerId = res.data.id;
                    this.$set(this.formData, 'initDataStr', '');
                    this.$set(this.formData, 'trackerName', '');
                     if(this.formData.tracker){
                        getUserInfoByOrgId(this.formData.tracker).then(response => {
                            //联系人
                            this.$set(this.formData, 'initDataStr', `{"type":"PERSONNEL","orgId":"${response.data.departments[0].id}.${response.data.id}","linkId":"${response.data.id}"}`);
                            this.$set(this.formData, 'trackerName', response.data.mi);
                        })
                     }
                    this.loading = false;
                }).catch(err => {
                    this.loading = false;
                })
            },
            onCancel() {
                EcoUtil.getSysvm().closeDialog();
            },
            onSubmit() {
                this.$refs.managementForm.validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        let params = {
                            applicationCode: this.formData.applicationCode,
                            certPolicyCode: this.formData.certPolicyCode,
                            certPolicyName: this.formData.certPolicyName,
                            startDate: this.formData.startDate,
                            tracker: this.formData.tracker,
                            mainlyStandard: this.formData.mainlyStandard,
                            annoucementCopeStatus: this.formData.annoucementCopeStatus,
                            cccCopeStatus: this.formData.cccCopeStatus,
                        }
                        if (this.caseType === 'editCase') {
                            params.id = this.id;
                            //修改
                            productioncarVcmUpdate(params).then(res => {
                                this.loading = false;
                                let doObj = {};
                                doObj.action = 'edit';
                                doObj.data = {};
                                doObj.close = true;
                                EcoUtil.getSysvm().callBackDialogFunc(doObj);
                            }).catch(err => {
                                this.loading = false;
                            })
                        } else if (this.caseType === 'addCase') {
                            params.id = this.rectificationModularInnerId;
                            productioncarVcmAdd(params).then(res => {
                                this.loading = false;
                                let doObj = {}
                                doObj.action = 'add';
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
        top: 20px;
        left: 0;
        right: 0;
        bottom: 60px;
        padding: 0 10px;
    }

    .editManagement .addForm .el-input,
    .editManagement .addForm .el-select {
        width: 100%;
    }

    .viewContent {
        color: #606266;
    }

    .viewContent.leftText {
        font-size: 14px;
        line-height: 28px;
    }

    .editManagement .tableRow {
        text-align: right;
    }

    .editManagement .tableRow span {
        margin-right: 2px;
        font-size: 14px;
        color: #0f1419;
    }

    .editManagement .uploadBtn {
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
</style>