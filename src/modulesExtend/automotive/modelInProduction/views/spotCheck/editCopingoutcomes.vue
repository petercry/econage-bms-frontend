<template>
    <div class='editCopingoutcomes'>
        <div class='addForm'>
            <el-form :model='formData' ref='copingoutForm' :rules='rules' v-loading='loading' label-position='right' label-width='130px'>
                <div class='rowTitle'>基本信息</div>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item class='is-required'  label='标准法规号:' prop='standardRegulationNo'>
                            <el-input  placeholder='请输入' disabled v-model='formData.standardRegulationNo' ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item  class='is-required' label='标准法规名称:' prop='nameStandardsRegulations'>
                            <el-input  placeholder='请输入' disabled v-model='formData.nameStandardsRegulations' ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item class='is-required' label='车型型号:' prop='carModel'>
                            <el-input  placeholder='请输入' disabled v-model='formData.carModel' ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item class='is-required' label='项目代号:' prop='projectCode'>
                            <el-input  placeholder='请输入' disabled v-model='formData.projectCode' ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item class='is-required' label='适用车型:' prop='carModelType'>
                            <el-checkbox-group v-model="formData.carModelType" disabled>
                                <el-checkbox :label="item.id" v-for='(item) in applicableModels' :key='item.id'>{{item.text}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item class='is-required' label='动力类型:' prop='carModelValue'>
                            <el-checkbox-group v-model="formData.carModelValue" disabled>
                                <el-checkbox :label="item.id" v-for='(item) in powerType' :key='item.id'>{{item.text}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item class='is-required' label='检验项目:' prop='inspectionItems'>
                            <el-input  placeholder='请输入' disabled v-model='formData.inspectionItems' ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item class='is-required' label='依据:' prop='basis'>
                            <el-input  placeholder='请输入' disabled v-model='formData.basis' ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class='rowTitle'>点检结果</div>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='应对情况:' prop='respond'>
                            <el-select filterable v-model='formData.respond' clearable>
                                <el-option :value='key' :label='item' v-for='(item,key) in respondList'
                                    :key='key'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='22'>
                          <el-form-item class='is-required' label='说明:' prop='explain'>
                            <el-input  v-model='formData.explain'  type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000'
                               placeholder='请输入'></el-input>
                          </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='22'>
                        <el-form-item label='支撑材料:' class='is-required'>
                            <upload :isEdit='true'  :showList='true' :multiple="false" :modular="modular"
                                :modularInnerId="copingoutcomesModularInnerId" @fileChange="fileChange"
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
    </div>
</template>
<script>
    import {mapState} from "vuex"
    import upload from '../components/upload.vue'
    import { EcoFile } from '@/components/file/main.js'
    import {responseResultInterfaceQueryOne,responseResultInterfaceUpdate} from '../../service/service.js'
    export default {
        data(){
            return {
                fileList:[],
                modular:"copingoutcomes_document",
                copingoutcomesModularInnerId:'',
                formData:{
                    standardRegulationNo:"",
                    nameStandardsRegulations:"",
                    carModel:"",
                    projectCode:"",
                    carModelType:"",
                    carModelValue:"",
                    inspectionItems:"",
                    basis:"",
                    respond:"",
                    explain:"", 
                },
                rules:{
                    respond:[{ required: true, message: '应对情况为必选', trigger:'blur' }]
                },
                loading:false
            }
        },
        components:{
            upload,
        },
        created(){
            // this.getDetails();
        },
        activated(){
            this.getDetails();
        },
        computed:{
            ...mapState(['applicableModels','powerType','respondList']),
            id(){
                return this.$route.params.id;
            }
        },
        methods:{
            onSubmit(){
                this.$refs.copingoutForm.validate((valid) => {
                    if (valid) {
                        if(this.fileList.length==0){
                            this.$message.warning('支撑材料未上传');
                            return;
                        }
                        this.loading=true;
                        responseResultInterfaceUpdate(this.formData).then(res=>{
                            this.loading = false;
                            this.$message.success('更新成功!');
                            this.$parent.$parent.goBack(false);
                        })
                    }else{
                        return false
                    }
                })
            },
            getDetails(){
                  this.loading=true;
                  responseResultInterfaceQueryOne(this.id).then(res=>{
                       this.formData = res.data;
                       this.copingoutcomesModularInnerId = res.data.id;
                       this.loading = false;
                  })

            },
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
        }
    }
</script>
<style scoped>
    .editCopingoutcomes {
        background: #fff;
        height: 100%;
    }

    /* .editCopingoutcomes .btn {
        text-align: center;
        padding: 10px;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #ddd;
    } */

    .editCopingoutcomes .addForm {
        overflow: auto;
        position: absolute;
        top: 0px;
        left: 0;
        right: 0;
        bottom: 60px;
        padding: 0;
    }

    .editCopingoutcomes .addForm .el-input,
    .editCopingoutcomes .addForm .el-select {
        width: 150px;
    }
    .editCopingoutcomes .uploadBtn {
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
  .editCopingoutcomes  .rowTitle {
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: #fff;
        font-size: 14px;
        background: rgb(103, 112, 126);
        margin-bottom: 20px;
    }
</style>