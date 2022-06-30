<template>
    <div class='editPage'>
        <div class='addForm initCase' v-loading='loading' v-if='caseType==="initCase"'>
            <el-form :model='formData1' ref='editPageForm' :rules='rules1'  label-position='right' label-width='130px'>
                <el-row>
                    <el-col :span='22'>
                        <el-form-item label='计划开始日期:' prop='planStartDate'>
                            <el-date-picker style="vertical-align: top;" value-format="yyyy-MM-dd" v-model="formData1.planStartDate" type="date" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span='22'>
                        <el-form-item label='计划完成日期:' prop='planCompleteDate'>
                            <el-date-picker style="vertical-align: top;" value-format="yyyy-MM-dd" v-model="formData1.planCompleteDate" type="date" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div v-else class="addForm" v-loading='loading'>
            <el-table ref='editCheckTab' v-if='isEdit' @selection-change="handleSelectionChange" @row-click="rowClick" highlight-current-row  :data='tableData' style='width:97%;margin:0 auto 20px;' header-row-class-name='tableHeader' height='150px' tooltip-effect='dark'>
                <el-table-column type="selection" width="55" v-if='tableData.length>1'></el-table-column>
                <el-table-column label='序号' type='index'></el-table-column>
                <el-table-column label='标准法规号' prop='regulationCode'></el-table-column>
                <el-table-column label='标准法规名称' prop='regulationName'></el-table-column>
                <el-table-column label='条文号' prop='articleCode'></el-table-column>
                <el-table-column label='符合性' prop='regulatoryCompliance'>
                    <template slot-scope='scope'>
                        <span>{{restData(scope.row.regulatoryCompliance,'regulatoryCompliance')}}</span>
                    </template>
                </el-table-column>
                <el-table-column label='意见说明' prop='opinion'></el-table-column>
             </el-table>
             <el-form v-show='(caseType==="editCase" && tableData.length!==0) || (caseType==="viewCase")' :model='formData' ref='editPageForm' :rules='rules2'  label-position='right' label-width='130px'>
                <div class='rowTitle'>基本信息</div>
                <!-- <el-row>
                    <el-col :span='11'>
                        <el-form-item label='所属平台:' prop=''>
                            <el-input disabled v-if='isEdit' placeholder='请输入' v-model='formData.' ></el-input>
                            <span class="viewContent" v-else>{{formData.}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='11'>
                        <el-form-item label='项目名称:' prop=''>
                            <el-input disabled v-if='isEdit' placeholder='请输入' v-model='formData.' ></el-input>
                            <span class="viewContent" v-else>{{formData.}}</span>
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <!-- <el-row>
                    <el-col :span="22">
                        <el-form-item label='任务名称:' prop=''>
                            <el-input disabled v-if='isEdit' placeholder='请输入' v-model='formData.' ></el-input>
                            <span class="viewContent" v-else>{{formData.}}</span>
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <el-row>
                    <el-col :span='11'>
                        <el-form-item label='计划开始日期:' prop='planStartDate'>
                            <el-date-picker disabled v-if='isEdit'  value-format="yyyy-MM-dd" v-model="formData.planStartDate" type="date" placeholder="选择日期">
                            </el-date-picker>
                            <span class="viewContent" v-else>{{formData.planStartDate}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='11'>
                        <el-form-item label='计划完成日期:' prop='planCompleteDate'>
                            <el-date-picker disabled v-if='isEdit'  value-format="yyyy-MM-dd" v-model="formData.planCompleteDate" type="date" placeholder="选择日期">
                            </el-date-picker>
                            <span class="viewContent" v-else>{{formData.planCompleteDate}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='11'>
                        <el-form-item label='实际开始日期:' prop='actualCompleteDate'>
                            <el-date-picker disabled v-if='isEdit'  value-format="yyyy-MM-dd" v-model="formData.actualCompleteDate" type="date" placeholder="选择日期">
                            </el-date-picker>
                            <span class="viewContent" v-else>{{formData.actualCompleteDate}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row>
                    <el-col :span='11'>
                        <el-form-item label='专业:' prop=''>
                            <el-input disabled v-if='isEdit' placeholder='请输入' v-model='formData.' ></el-input>
                            <span class="viewContent" v-else>{{formData.}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='11'>
                        <el-form-item label='交付物:' prop=''>
                            <el-input disabled v-if='isEdit' placeholder='请输入' v-model='formData.' ></el-input>
                            <span class="viewContent" v-else>{{formData.}}</span>
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <!-- <el-row>
                    <el-col :span='11'>
                        <el-form-item label='联络人:' prop=''>
                            <el-input disabled v-if='isEdit' placeholder='请输入' v-model='formData.' ></el-input>
                            <span class="viewContent" v-else>{{formData.}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='11'>
                        <el-form-item label='责任人:' prop=''>
                            <el-input disabled v-if='isEdit' placeholder='请输入' v-model='formData.' ></el-input>
                            <span class="viewContent" v-else>{{formData.}}</span>
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <el-row>
                    <el-col :span='11'>
                        <el-form-item label='标准法规号:' prop='regulationCode'>
                            <el-input disabled v-if='isEdit' placeholder='请输入' v-model='formData.regulationCode' ></el-input>
                            <span class="viewContent" v-else>{{formData.regulationCode}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='11'>
                        <el-form-item label='标准法规名称:' prop='regulationName'>
                            <el-input disabled v-if='isEdit' placeholder='请输入' v-model='formData.regulationName' ></el-input>
                            <span class="viewContent" v-else>{{formData.regulationName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='11'>
                        <el-form-item label='条文号:' prop='articleCode'>
                            <el-input disabled v-if='isEdit' placeholder='请输入' v-model='formData.articleCode' ></el-input>
                            <span class="viewContent" v-else>{{formData.articleCode}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='22'>
                        <el-form-item label='条文内容:' prop='articleContent'>
                            <!-- <el-input disabled  v-if='isEdit' v-model='formData.articleContent' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000'
                             placeholder='请输入'></el-input>
                               <span class="viewContent" v-else v-html='formData.articleContent'></span>
                            -->
                            <ckeditor v-if='isEdit' disabled :readOnly='true'  ref="articleEditor" :content="formData.articleContent" height='200px' style='margin-bottom:43px'></ckeditor>
                            <div class="viewContent" v-else v-ckeditor='formData.articleContent' ></div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class='rowTitle'>反馈结果</div>
                <el-row>
                    <el-col :span='11'>
                        <el-form-item label='法规符合性:' prop='regulatoryCompliance'>
                             <el-select v-if='isEdit' filterable clearable v-model='formData.regulatoryCompliance' >
                                 <el-option v-for="(item,index) in regulatoryComplianceList" :value='item.id' :label='item.text' :key='item.id'></el-option>
                             </el-select>
                             <span class="viewContent" v-else>{{restData(formData.regulatoryCompliance,'regulatoryCompliance')}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='22'>
                        <el-form-item label='说明:' prop='opinion'>
                            <el-input   v-if='isEdit' v-model='formData.opinion' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000'
                               placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.opinion}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='22'>
                        <el-form-item label='支撑材料:' class='is-required'>
                            <upload :isEdit='isEdit'  :showList='true' :multiple="false" :modular="modular"
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
        <div class="btn" v-if='isEdit'>
            <el-button size="medium" @click="onCancel">取消</el-button>
            <el-button type="primary" size="medium" @click="onSubmit">{{caseType==="initCase"?"确定":"提交"}}</el-button>
        </div>
    </div>
</template>
<script>
    import { EcoUtil } from '@/components/util/main.js'
    import {carcheckFeedbackList,carcheckBatch,carcheckTaskDetails} from '../../service/service.js'
    import { EcoFile } from '@/components/file/main.js'
    import ckeditor from '../components/ckeditor.vue'
    import upload from '../components/upload.vue'
    import {mapState} from 'vuex'
    export default {
        data(){
            return {
                fileList:[],
                modular:"copingoutcomes_document",
                copingoutcomesModularInnerId:'',
                loading:false,
                multipleSelection:[],
                rowClickTable:[],
                tableData:[],
                formData1:{
                    planStartDate:'',
                    planCompleteDate:''
                },
                formData:{
                    planStartDate:'',
                    planCompleteDate:'',
                    actualCompleteDate:'',
                    regulationCode:'',
                    regulationName:'',
                    articleCode:'',
                    articleContent:'',
                    regulatoryCompliance:''
                }
            }
        },
        components:{
            upload,
            ckeditor
        },
        computed:{
            ...mapState(['regulatoryComplianceList']),
            id(){
                return this.$route.params.id;
            },
            caseType(){
                return  this.$route.params.caseType;
            },
            isEdit() {
                return this.caseType !== 'viewCase'
            },
            isBatchProcessing(){
                return (this.id.indexOf('[')!==-1);
            },
            rules1(){
                let list={
                    planStartDate:'计划开始日期',
                    planCompleteDate:'计划完成日期'
                };
                let obj={};
                for(var key in list){
                    obj[key] = [{ required: true, message: `${list[key]}为必选项`, trigger: 'change' }];
                }
                return obj;
            },
            rules2(){
                let list = {
                    regulatoryCompliance:'法规符合性',
                    opinion:'说明'

                }
                let obj={};
                for(var key in list){
                    obj[key] = [{ required: true, message: `${list[key]}为必选项`, trigger: (key==='regulatoryCompliance')?'change':'blur'}];
                }
                return obj;
            }
        },
        created(){
            if(this.id!=0){
                this.loading=true;
                if(this.isBatchProcessing){
                    //批量办理
                    var ids = JSON.parse(this.id);
                    carcheckFeedbackList(ids).then(res=>{
                        this.tableData = res.data;
                        if(this.tableData.length!==0){
                            this.copingoutcomesModularInnerId = this.tableData[0].taskId;
                            this.tableData.forEach((item,index)=>{
                                carcheckTaskDetails(item.taskId).then(res2=>{
                                    this.rowClickTable[index] = res2.data;
                                    if(index==0){
                                        this.formData=res2.data;
                                    }
                                    if((this.tableData.length-1)===index){
                                        this.loading=false;
                                    }

                                })
                            })
                            this.$refs.editCheckTab.setCurrentRow(this.tableData[0]);
                        }else{
                            this.loading=false;
                        }
                    }).catch(err=>{
                        this.loading=false;
                    })
                }else{
                   //查看
                   this.copingoutcomesModularInnerId = this.id;
                   carcheckTaskDetails(this.id).then(res=>{
                        this.formData=res.data;
                        this.loading=false;
                   }).catch(err=>{
                        this.loading=false;
                   })
                }
            }
        },
        methods:{
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
            rowClick(row){
                if(this.formData.id == row.taskId){
                    return;
                }
                this.loading=true;
                this.copingoutcomesModularInnerId = row.taskId;
                this.rowClickTable.forEach(item=>{
                    if(item.id == row.taskId){
                        this.formData = item;
                    }
                })
                this.loading=false;
                // carcheckTaskDetails(row.taskId).then(res=>{
                //     this.formData = res.data;
                //     this.loading=false;
                // }).catch(err=>{
                //     this.loading=false;
                // })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            onCancel() {
                EcoUtil.getSysvm().closeDialog();
            },
            onSubmit() {
                if(this.caseType==='initCase'){
                    this.$refs.editPageForm.validate((valid) => {
                        if (valid) {
                            let doObj = {};
                            doObj.action = 'initCase';
                            doObj.data = this.formData1;
                            doObj.close = true;
                            EcoUtil.getSysvm().callBackDialogFunc(doObj);
                        }else{
                            return false
                        }
                    })
                }else {
                    if(this.tableData.length===0){
                        return;
                    }
                    if(this.isBatchProcessing && this.tableData.length>1 && this.multipleSelection.length===0){
                        this.$message.warning('请选择要提交的数据!');
                        return;
                    }
                    this.loading=true;
                    let data=[];
                    if(this.tableData.length>1){
                        this.multipleSelection.forEach(item=>{
                            this.rowClickTable.forEach(item2=>{
                                if(item.taskId === item2.id){
                                    data.push({
                                        "taskId":item.taskId,
                                        "regulationCode":item2.regulationCode,
                                        "regulationName":item2.regulationName,
                                        "articleCode":item2.articleCode,
                                        "regulatoryCompliance":item2.regulatoryCompliance,
                                        "opinion":item2.opinion,
                                        "projectId":item2.projectId
                                    })
                                }
                            })
                        })
                    }else{
                        data.push({
                            "taskId":this.rowClickTable[0].id,
                            "regulationCode":this.rowClickTable[0].regulationCode,
                            "regulationName":this.rowClickTable[0].regulationName,
                            "articleCode":this.rowClickTable[0].articleCode,
                            "regulatoryCompliance":this.rowClickTable[0].regulatoryCompliance,
                            "opinion":this.rowClickTable[0].opinion,
                            "projectId":this.rowClickTable[0].projectId
                        })
                    }
                    carcheckBatch(data).then(res=>{
                        this.loading=false;
                        let doObj = {};
                        doObj.action = 'editCase';
                        doObj.data = {};
                        doObj.close = true;
                        EcoUtil.getSysvm().callBackDialogFunc(doObj);
                    }).catch(err=>{
                        this.loading=false;
                    })
                }
            }
        }
    }
</script>
<style scoped>
   .editPage .addForm.initCase{
       top:50px;
   }
</style>
