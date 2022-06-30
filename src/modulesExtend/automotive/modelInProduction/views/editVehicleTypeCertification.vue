<template>
    <div class='editVehicleTypeCertification'>
        <div class='addForm'>
            <el-form :model='formData' ref='VehicleTypeCertificationForm' :rules='rules' v-loading='loading' label-position='right' label-width='130px'>
                <el-row>
                    <el-col :span='9'>
                        <el-form-item label='序号:' prop='seq'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.seq' ></el-input>
                            <span class="viewContent" v-else>{{formData.seq}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='14'>
                        <el-form-item label='检验项目' prop='testProject'>
                            <el-input style='width:100%' v-if='isEdit' placeholder="请输入" v-model='formData.testProject'></el-input>
                            <span class='viewContent' v-else>{{formData.testProject}}</span>
                        </el-form-item>   
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                         <el-form-item label='检验依据:' prop='testAccording'>
                            <el-input v-if='isEdit' v-model='formData.testAccording' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000'
                                placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.testAccording}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='2' style='text-align:right;'>
                        <span class='viewContent leftText'>公告</span>
                    </el-col>
                    <el-col :span='6'>
                        <el-form-item label='是否适用:' label-width='100px' prop='announcementApplicable'>
                            <el-select filterable v-if='isEdit' v-model='formData.announcementApplicable'>
                                <el-option v-for='(item) in isApplicable' :value='item.id' :label='item.text' :key='item.id'></el-option>
                            </el-select>
                            <span class="viewContent" v-else>{{restData(formData.announcementApplicable,'applicable')}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='6' >
                        <el-form-item label-width='100px' label='NT' prop='announcementNt'>
                            <el-date-picker v-if='isEdit' style='width:200px' v-model="formData.announcementNt" value-format='yyyy-MM-dd' type="date" placeholder="选择日期"></el-date-picker>
                            <span class="viewContent" v-else>{{formData.announcementNt}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='6'>
                        <el-form-item label='TT' prop='announcementTt'>
                            <el-date-picker v-if='isEdit' style='width:200px' v-model="formData.announcementTt" value-format='yyyy-MM-dd' type="date" placeholder="选择日期"></el-date-picker>
                            <span class="viewContent" v-else>{{formData.announcementTt}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row> 
                    <el-col :span='6' style='margin-left:47px;'>
                        <el-form-item label='批次:' prop='announcementBatch'>
                            <el-input v-if='isEdit' v-model='formData.announcementBatch' placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.announcementBatch}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='10'>
                        <el-form-item label='计划:' prop='announcementPlan'>
                            <el-input style='width:100%' v-if='isEdit' v-model='formData.announcementPlan' placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.announcementPlan}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='2' style='text-align:right;'>
                        <span class='viewContent leftText'>CCC</span>
                    </el-col>
                    <el-col :span='6'>
                        <el-form-item label='是否适用:' label-width='100px' prop='cccApplicable'>
                            <el-select filterable v-if='isEdit' v-model='formData.cccApplicable'>
                                <el-option v-for='(item) in isApplicable' :value='item.id' :label='item.text' :key='item.id'></el-option>
                            </el-select>
                            <span class="viewContent" v-else>{{restData(formData.cccApplicable,'applicable')}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='6'>
                        <el-form-item label='NT' label-width='100px' prop='cccNt'>
                            <el-date-picker v-if='isEdit' style='width:200px' v-model="formData.cccNt" value-format='yyyy-MM-dd' type="date" placeholder="选择日期"></el-date-picker>
                            <span class="viewContent" v-else>{{formData.cccNt}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='6'>
                        <el-form-item label='TT'  prop='cccTt'>
                            <el-date-picker v-if='isEdit' style='width:200px' v-model="formData.cccTt" value-format='yyyy-MM-dd' type="date" placeholder="选择日期"></el-date-picker>
                            <span class="viewContent" v-else>{{formData.cccTt}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='6'>
                        <el-form-item label='证书编号(版本号):' label-width='175px' prop='cccCertCode'>
                            <el-input v-if='isEdit' v-model='formData.cccCertCode' placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.cccCertCode}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='10' style='margin-left:47px;'>
                        <el-form-item label='计划:' prop='cccPlan'>
                            <el-input v-if='isEdit' style='width:100%' v-model='formData.cccPlan' placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.cccPlan}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                         <el-form-item label='实施情况说明:' prop='implementDescription'>
                            <el-input v-if='isEdit' v-model='formData.implementDescription' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000'
                                placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.implementDescription}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label="申请检验类别" prop='inspectionCategory'>
                            <el-select filterable v-if='isEdit' v-model='formData.inspectionCategory'>
                                <el-option v-for="(item) in ApplicationCategory" :key="item.id" :label="item.text" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='产品ID' prop='productId'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.productId' ></el-input>
                            <span class="viewContent" v-else>{{formData.productId}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='产品型号' prop='productModel'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.productModel' ></el-input>
                            <span class="viewContent" v-else>{{formData.productModel}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='检验报告编号' prop='inspectionReportCode'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.inspectionReportCode' ></el-input>
                            <span class="viewContent" v-else>{{formData.inspectionReportCode}}</span>
                        </el-form-item> 
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='实测项目数' prop='measuredItemsNum'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.measuredItemsNum' ></el-input>
                            <span class="viewContent" v-else>{{formData.measuredItemsNum}}</span>
                        </el-form-item> 
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                         <el-form-item label='配置说明:' prop='configInstruction'>
                            <el-input v-if='isEdit' v-model='formData.configInstruction' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000'
                                placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.configInstruction}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                         <el-form-item label='项目说明:' prop='projectInstruction'>
                            <el-input v-if='isEdit' v-model='formData.projectInstruction' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000'
                                placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.projectInstruction}}</span>
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
    import {pvACarRQueryOne,pvACarRUpdate} from '../service/service.js'
    import { mapState } from 'vuex'
    export default {
        name: 'editVehicleTypeCertification',
        data() {
            return {
                caseType: '',
                formData: {
                   seq:'',
                   testProject:'',
                   testAccording:'',
                   announcementApplicable:'',
                   announcementNt:'',
                   announcementTt:'',
                   announcementPlan:'',
                   announcementBatch:'',
                   cccApplicable:'',
                   cccNt:'',
                   cccTt:'',
                   cccPlan:'',
                   cccCertCode:'',
                   implementDescription:'',
                   inspectionCategory:'',
                   productId:'',
                   productModel:'',
                   inspectionReportCode:'',
                   measuredItemsNum:'',
                   configInstruction:'',
                   projectInstruction:''
                },
                loading: false,
            }
        },
        computed: {
            ...mapState(['isApplicable','ApplicationCategory']),
            isEdit() {
                return this.caseType !== 'viewCase'
            },
            id(){
                return this.$route.params.id;
            },
            rules(){
              let obj={
                   seq:'序号',
                   testProject:'检验项目',
                   testAccording:'检验依据',
                   announcementApplicable:'公告是否适用',
                   announcementNt:'nt',
                   announcementTt:'tt',
                   announcementPlan:'计划',
                   announcementBatch:'批次',
                   cccApplicable:'是否适用',
                   cccNt:'nt',
                   cccTt:'tt',
                   cccPlan:'计划',
                   cccCertCode:'证书编号',
                   implementDescription:'实施情况说明',
                   inspectionCategory:'申请检验类别',
                   productId:'产品ID',
                   productModel:'产品型号',
                   inspectionReportCode:'检验报告编号',
                   measuredItemsNum:'实测项目数',
                   configInstruction:'配置说明',
                   projectInstruction:'项目说明'
              }
              let newObj={}
              for(var key in obj){
                  var trigger = (key.search(/(Applicable)|(Nt)|(Tt)|(Category)/g)!==-1)?'change':'blur'
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
            }
        },
        methods: {
            getDetailsInfo() {
                this.loading = true;
                pvACarRQueryOne(this.id).then(res => {
                    this.formData = res.data;
                    this.loading = false;
                }).catch(err=>{
                    this.loading = false;
                })
            },
            onCancel() {
                EcoUtil.getSysvm().closeDialog();
            },
            onSubmit() {
                this.$refs.VehicleTypeCertificationForm.validate((valid) => {
                    if (valid) {
                            this.loading = true;
                            if (this.caseType === 'editCase') {
                                //修改
                                pvACarRUpdate(this.formData).then(res=>{
                                    this.loading = false;
                                    let doObj = {};
                                    doObj.action = 'edit';
                                    doObj.data = {};
                                    doObj.close = true;
                                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
                                }).catch(err=>{
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
    .editVehicleTypeCertification {
        background: #fff;
        height: 100%;
    }

    .editVehicleTypeCertification .btn {
        text-align: center;
        padding: 10px;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #ddd;
    }

    .editVehicleTypeCertification .addForm {
        overflow: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 60px;
        padding: 0 10px;
    }

    .editVehicleTypeCertification .addForm .el-input,
    .editVehicleTypeCertification .addForm .el-select {
        width: 150px;
    }

    .viewContent {
        color: #606266;
    }
    .viewContent.leftText{
        font-size:14px;
        line-height: 28px;
    }

    .editVehicleTypeCertification .tableRow {
        text-align: right;
    }

    .editVehicleTypeCertification .tableRow span {
        margin-right: 2px;
        font-size: 14px;
        color: #0f1419;
    }
</style>