<template>
    <div class='editPageDetails'>
        <div class='addForm'>
            <el-form :model='formData' ref='editPageDetailsForm'  v-loading='loading' label-position='right' label-width='130px'>
                <div class='rowTitle'>基本信息</div>
                <el-row>
                    <el-col :span='11'>
                        <el-form-item label='标准法规号:' prop='standardRegulationNo'>
                            <span class="viewContent">{{formData.standardRegulationNo}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='11'>
                        <el-form-item label='标准法规名称:' prop='nameStandardsRegulations'>
                            <span class="viewContent">{{formData.nameStandardsRegulations}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='11'>
                        <el-form-item label='车型型号:' prop='carModel'>
                            <span class="viewContent">{{formData.carModel}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='11'>
                        <el-form-item label='项目代号:' prop='projectCode'>
                            <span class="viewContent">{{formData.projectCode}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='11'>
                        <el-form-item class="is-required" label='部门:' prop='deptName'>
                            <span class="viewContent" >{{formData.deptName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='11'>
                        <el-form-item label='专业:' class="is-required" prop='major'>
                            <span class="viewContent" >{{restData(formData.major,'major')}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='11'>
                        <el-form-item label='设计师:' prop='designerName' class="is-required">
                            <span class="viewContent">{{formData.designerName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='11'>
                        <el-form-item label='部门负责人:' prop='deptLeader' class="is-required">
                            <span class="viewContent">{{formData.deptLeaderPerson}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class='rowTitle'>点检结果</div>
                <el-row>
                    <el-col :span='11'>
                        <el-form-item label='符合性:' disabled prop='accordWith' class="is-required">
                            <span class="viewContent">{{restData(formData.accordWith,'accordWith')}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                   <el-col :span='22'>
                        <el-form-item label='说明:' prop='explain'>
                            <span class="viewContent">{{formData.explain}}</span>
                        </el-form-item>
                   </el-col>
                </el-row>
                <el-row>
                    <el-col :span='22'>
                        <el-form-item label='支撑材料:' class='is-required'>
                            <upload :isEdit='false'  :showList='true' :multiple="false" :modular="modular"
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
                <div class='rowTitle'>审批结果</div>
                <el-row>
                    <el-col :span='22'>
                        <el-form-item label='专业部门科长:' prop='deptStatusText'>
                            <span class="viewContent">{{formData.deptStatusText}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='22'>
                        <el-form-item label='法规责任人:' prop='standardRegulationStatusText'>
                            <span class="viewContent">{{formData.standardRegulationStatusText}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='22'>
                        <el-form-item label='标准法规室总师:' prop='engineerStatusText'>
                            <span class="viewContent">{{formData.engineerStatusText}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>
<script>
    import {individualetails} from '../../service/service.js'
    import upload from '../components/upload.vue'
    import { EcoFile } from '@/components/file/main.js'
    export default {
        name:'editPageDetails',
        data(){
            return {
                fileList:[],
                modular:"copingoutcomes_document",
                copingoutcomesModularInnerId:'',
                formData:{
                    standardRegulationNo:'',
                    nameStandardsRegulations:'',
                    carModel:'',
                    projectCode:'',
                    deptName:'',
                    major:'',
                    designer:'',
                    designerName:'',
                    accordWith:'',
                    explain:'',
                    deptStatus:'',
                    deptStatusText:'',
                    standardRegulationStatus:'',
                    standardRegulationStatusText:'',
                    engineerStatus:'',
                    engineerStatusText:'',
                    initDataStr:'',
                    deptLeaderStr:''
                },
                loading:false
            }
        },
        created(){
            this.getDetails();
        },
        components:{
            upload
        },
        computed:{
            id(){
                return this.$route.params.id;
            },
            stepStatus(){
                return this.$route.params.stepStatus
            }
        },
        methods:{
            getDetails(){
                this.loading = true;
                individualetails(this.id).then(res=>{
                    this.copingoutcomesModularInnerId = res.data.id;
                    this.formData = res.data; 
                    this.$set(this.formData,'deptStatusText',''); 
                    this.$set(this.formData,'standardRegulationStatusText',''); 
                    this.$set(this.formData,'engineerStatusText','');      
                    this.initStatus('deptStatus');
                    this.initStatus('standardRegulationStatus');
                    this.initStatus('engineerStatus');
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

</style>