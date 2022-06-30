<template>
    <eco-content top='0px' bottom='0px ' type='tool' style='background-color: #f5f5f5;'>
        <div class="flowHistory" v-loading='loading'>
            <!-- <eco-content top='0px' height='60px' type='tool'>
                <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
                   <el-col>
                       <strong>流程历史记录</strong>
                   </el-col>
                </el-row>
            </eco-content>  -->
            <eco-content top='0px' bottom='0px' style='padding:10px 15px;border:1px solid #ddd;' v-if='pageType==="flowList"'>
                <el-table ref='historyTab'  stripe :data='tableData' header-row-class-name='tableHeader'
                    border tooltip-effect='dark' height='100%' class='standardizationTable'>
                    <el-table-column label='序号' type='index'>
                        <!-- <template slot-scope='scope'>
                            {{(baseInfo.page-1*baseInfo.rows)+(scope.$index+1)}}
                        </template> -->
                    </el-table-column>
                    <el-table-column prop='taskName' label='流程环节'></el-table-column>
                    <el-table-column prop='taskAssigneeName' label='环节操作人'></el-table-column>
                    <el-table-column prop='actionTime' label='操作时间'></el-table-column>
                    <el-table-column prop='opinion' label='审批意见' width='250' show-overflow-tooltip></el-table-column>
                    <el-table-column prop='approveDesc' label='审批结果'></el-table-column>
                </el-table> 
            </eco-content>
            <eco-content top='0px' bottom='0px' style='padding:10px 15px;' v-else>
                <el-form :model='formData'   v-loading='loading' label-width='200px' label-position='right'>
                    <el-row>
                        <el-col :span='22'>
                            <el-form-item label='标题:' class='is-required' prop='title'>
                                <span class="viewContent">{{formData.title}}</span>
                            </el-form-item>
                        </el-col>     
                    </el-row>
                    <el-row>
                        <el-col :span='22'>
                            <el-form-item label='问题描述及风险:' prop='problemDesc'  class='is-required'>
                                <span class="viewContent">{{formData.problemDesc}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                   <el-row>
                        <el-col :span='22'>
                            <el-form-item label='问题原因:' prop='problemReason'  class='is-required'>
                                <span class="viewContent">{{formData.problemReason}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span='22'>
                            <el-form-item  class='is-required' label='解决方案:' prop='solution'>
                                <span class="viewContent">{{formData.solution}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span='12'>
                            <el-form-item label='标准编号:' prop='standardNumber'  class='is-required'>
                                <span class="viewContent">{{formData.standardNumber}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span='12'>
                            <el-form-item label='标准名称:' prop='standardName'  class='is-required'>
                                <span class="viewContent" >{{formData.standardName}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span='22'>
                            <el-form-item label='标准相关要求:' prop='standardRequire'  class='is-required'>
                                <span class="viewContent">{{formData.standardRequire}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span='22'>
                            <el-form-item label='法规专业积累(再发防止):' prop='lawsAccumulate'  class='is-required'>
                                <span class="viewContent">{{formData.lawsAccumulate}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span='22'>
                            <el-form-item label='项目:' prop='project'  class='is-required'>
                                <span class="viewContent">{{formData.project}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span='12'>
                            <el-form-item label='阶段:' prop='stage'  class='is-required'>
                                <span class="viewContent">{{formData.stage}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span='12'>
                            <el-form-item label='年份:' prop='year'  class='is-required'>
                                <span class="viewContent">{{formData.year}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span='22'>
                            <el-form-item label='法规文档:'>
                              <!-- .doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.pdf -->
                                <upload :isEdit='false' :showList='true' :multiple="false" :modular="modular" :modularInnerId="recurrenceModularInnerId"
                                    @fileChange="fileChange" @preView='preView' accept=''>
                                    <el-button slot="uploadBtn" size="medium" class="uploadBtn">
                                        <i class="el-icon-plus"></i> 上传附件</el-button>
                                </upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </eco-content>
           <!-- <eco-content bottom='0px' type='tool' style='padding: 5px 0px;'>
                 <el-row>
                      <el-col>
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="baseInfo.page" :page-sizes="[30,50,100]"
                            :page-size="baseInfo.rows" layout="total, sizes, prev, pager, next, jumper" :total="baseInfo.total"
                            style="margin-right:20px">
                        </el-pagination>
                      </el-col>
                 </el-row>
           </eco-content> -->
        </div>
    </eco-content>
</template>
<script>
    var _self;
    import upload from './components/upload.vue'
    import ecoContent from '@/components/pageAb/ecoContent.vue'
    import tagSelect from '@/components/orgPick/tagSelect.vue'
    import { EcoUtil } from '@/components/util/main.js'
    import { EcoFile } from '@/components/file/main.js'
    import { EcoMessageBox } from '@/components/messageBox/main.js'
    import {recurrencePreventionHistoryList,recurrencePreventionArchiveDetails,getUserInfoByOrgId} from '../service/service.js'
    export default {
        name:'flowHistory',
        data(){
            return {
                fileList: [],
                modular: "recurrence_documents",
                recurrenceModularInnerId: "",
                formData: {
                    title: "",
                    problemDesc: "",
                    problemReason:"",
                    solution: "",
                    standardNumber: "",
                    standardName: "",
                    standardRequire: "",
                    lawsAccumulate: "",
                    project: "",
                    stage: "",
                    year: ""
                },
                loading:false,
                tableData:[],
                baseInfo:{
                    rows:30,
                    page:1,
                    total:0,
                }
            }
        },
        components:{
            ecoContent,
            upload,
            tagSelect
        },
        computed:{
            id(){
               return  this.$route.params.id
            },
            pageType(){
                return this.$route.params.pageType
            }
        },
        mounted(){
            _self = this;
            if(this.pageType === 'details'){
                this.loading = true;
                setTimeout(function(){
                    _self.getDetails();
                },500)
              
            }else{
                this.requestData();
            }
          
        },
        methods:{
            preView(item) {
                EcoFile.openFileHeaderByView(item.id, item.name);
            },
            fileChange(file, fileList) {
                this.fileList = fileList;
            },
            getDetails(){
                recurrencePreventionArchiveDetails(this.id).then(res=>{
                    this.formData = res.data;
                    this.recurrenceModularInnerId = res.data.id;
                    this.loading = false;
                })
            },
            handleSizeChange(val) {
                this.baseInfo.rows = val;
                this.requestData(true)
            },
            handleCurrentChange(val) {
                this.baseInfo.page = val;
                this.requestData();
            },
            requestData(isFirstPage){
               this.loading = true;
               if(isFirstPage){
                   this.baseInfo.page = 1;
               }
             //    params.page = this.baseInfo.page;
             recurrencePreventionHistoryList(this.id).then(res=>{
                    this.tableData = res.data;
                    this.loading = false;
              }).catch(err=>{
                    this.tableData = [];
                    this.loading = false;
              })
            },
        }
    }
</script>
<style scoped>
    .flowHistory{
        position: relative;
        overflow-y: auto;
        height: 100%;
        color: #0f1419;
    }
    .flowHistory /deep/ .tableHeader th {
            background: #f5f7fa;
            color: #000;
    }
    .flowHistory .standardizationTable /deep/ .el-table__row.el-table__row--striped td {
            background: #f5f7fa !important;
        }

    .flowHistory .standardizationTable /deep/ .tableHeader th {
            background: #f5f7fa;
            color: #000;
    }
    
    .flowHistory .rowTitle {
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: #fff;
        font-size: 14px;
        background: rgb(103, 112, 126);
        margin-bottom: 20px;
    }
    .mT2{
        margin-top: 20px;
    }
    .flowHistory .tableRow {
        text-align: right;
    }

    .flowHistory .tableRow span {
        margin-right: 2px;
        font-size: 14px;
        color: #0f1419;
    }
    .flowHistory .viewContent {
        color: #606266;
    }
</style>