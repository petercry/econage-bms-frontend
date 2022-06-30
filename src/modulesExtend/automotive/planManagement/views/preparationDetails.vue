<template>
    <div class="preparationDetails">
        <el-form :model='formData' ref='preparationDetailsForm'   v-loading='loading' label-width='100px' label-position='right'>
            <el-row>
                <el-col :span='8'>
                    <el-form-item label='标准名称:' prop='stdName'>
                        <el-input readonly placeholder='暂无数据' :value='formData.stdName'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label='标准类型:' prop='stdTypeName'>
                        <el-input readonly placeholder='暂无数据' :value='formData.stdTypeName'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label='体系码:' prop='systemCode'>
                        <el-input readonly placeholder='暂无数据' :value='formData.systemCode'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>
                    <el-form-item label='标准编号:' prop='stdCode'>
                        <el-input readonly placeholder='暂无数据' :value='formData.stdCode'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label='标准分类:' prop='stdCategoryName'>
                        <el-input readonly placeholder='暂无数据' :value='formData.stdCategoryName'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>
                    <el-form-item label='年度:' prop='year'>
                        <el-input readonly placeholder='暂无数据' :value='formData.year'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label='制/修订:' prop='revisionTypeName'>
                        <el-input readonly placeholder='暂无数据' :value='formData.revisionTypeName'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='24'>
                    <el-form-item label='标准编制目的及内容简介:' prop='purposeContent'>
                        <el-input  :value='formData.purposeContent' readonly  type='textarea' :rows='4' resize='none'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>
                    <el-form-item label='部门:' prop='deptName'>
                        <el-input readonly placeholder='暂无数据' :value='formData.deptName'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label='科室:' prop='officeName'>
                        <el-input readonly placeholder='暂无数据' :value='formData.officeName'></el-input>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span='8'>
                    <el-form-item label='零部件项目:' prop=''>
                        <el-input readonly placeholder='暂无数据' :value='formData.'></el-input>
                    </el-form-item>
                </el-col> -->
            </el-row>
            <el-row>
                <el-col :span='8'>
                    <el-form-item label='初稿完成时间:' prop='draftCompleteTime'>
                        <el-input readonly placeholder='暂无数据' :value='formData.draftCompleteTime'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label='分标委:' prop='subcommitteeName'>
                        <el-input readonly placeholder='暂无数据' :value='formData.subcommitteeName'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label='规划来源:' prop='planSourceName'>
                        <el-input readonly placeholder='暂无数据' :value='formData.planSourceName'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>
                    <el-form-item label='来源编号:' prop='sourceCode'>
                        <el-input readonly placeholder='暂无数据' :value='formData.sourceCode'></el-input>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span='8'>
                    <el-form-item label='五化领域:' prop=''>
                        <el-input readonly placeholder='暂无数据' :value='formData.'></el-input>
                    </el-form-item>
                </el-col> -->
                <!-- <el-col :span='8'>
                    <el-form-item label='应用领域:' prop=''>
                        <el-input readonly placeholder='暂无数据' :value='formData.'></el-input>
                    </el-form-item>
                </el-col> -->
            </el-row>
            <el-row>
                <!-- <el-col :span='8'>
                    <el-form-item label='适用项目:' prop=''>
                        <el-input readonly placeholder='暂无数据' :value='formData.'></el-input>
                    </el-form-item>
                </el-col> -->
                <el-col :span='8'>
                    <el-form-item label='替代标准:' prop='substituteCode'>
                        <el-input readonly placeholder='暂无数据' :value='formData.substituteCode'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row style="margin-bottom:20px;">
                <el-col :span='3' class='tableRow'>
                    <span>起草人信息:</span>
                </el-col>
                <el-col :span='20' style='box-sizing:border-box;padding-left: 3px;'>
                    <el-table :data='infoList' border :header-cell-style="{background:'#f5f7fa',color:'#000',textAlign:'center'}" :cell-style="{textAlign:'center'}">
                        <el-table-column label='序号' type='index' width='50'></el-table-column>
                        <el-table-column label='姓名'></el-table-column>
                        <el-table-column label='起草人排序'></el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <!-- <el-row>
                <el-col :span='24'>
                    <el-form-item label='备注:' prop=''>
                        <el-input  :value='formData.' readonly  type='textarea' :rows='4' resize='none'></el-input>
                    </el-form-item>
                </el-col>
            </el-row> -->
            <el-row>
                <el-col :span='23'>
                    <el-form-item label='标准文档:'>
                        <upload :isEdit='false'  :showList='true' :multiple="false" :modular="modular" :modularInnerId="modularInnerId"
                            @fileChange="fileChange" @preView='preView' accept=''>
                            <el-button slot="uploadBtn" size="medium" class="uploadBtn">
                                <i class="el-icon-plus"></i> 上传附件</el-button>
                        </upload>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

    </div>
</template>
<script>
    import { EcoFile } from '@/components/file/main.js'
    import { stdRevisionSigleDetails } from '../service/service.js'
    import upload from './components/upload.vue'
    export default {
        name:'preparationDetails',
        data(){
            return {
                loading:false,
                formData:{},
                infoList:[],
                modularInnerId:'',
                modular:"stdPlanRevision"
            }
        },
        components:{
            upload
        },
        computed:{
            id(){
                return  this.$route.params.id;
            }
        },methods:{
            initData(){
                this.loading = true;
                stdRevisionSigleDetails(this.id).then(res=>{
                    this.formData = res.data;
                    console.log(res)
                    this.infoList = res.data.draftMembers||[];
                    this.loading = false;
                })
            },
            fileChange(file,fileList){

            },
            preView(item) {
                EcoFile.openFileHeaderByView(item.id, item.name);
            },
        },created(){
            this.modularInnerId = this.id;
            this.initData();
        }
    }
</script>
<style scoped>
    .preparationDetails .tableRow {
        text-align: right;
        /* margin-left:15px; */
    }

    .preparationDetails .tableRow span {
        margin-right: 2px;
        font-size: 14px;
        color: #0f1419;
    }
</style>