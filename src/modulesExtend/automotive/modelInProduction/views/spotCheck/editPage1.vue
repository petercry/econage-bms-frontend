<template>
    <div class='editPage'>
        <div class='addForm'>
            <el-form :model='formData' ref='editPageForm' :rules='rules' v-loading='loading' label-position='right' label-width='130px'>
                <div class='rowTitle'>基本信息</div>
                <el-row>
                    <el-col :span='11'>
                        <el-form-item label='标准法规号:' prop='standardRegulationNo'>
                            <el-input v-if='isEdit' disabled placeholder='请输入' v-model='formData.standardRegulationNo' ></el-input>
                            <span class="viewContent" v-else>{{formData.standardRegulationNo}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='11'>
                        <el-form-item label='标准法规名称:' prop='nameStandardsRegulations'>
                            <el-input v-if='isEdit' disabled placeholder='请输入' v-model='formData.nameStandardsRegulations' ></el-input>
                            <span class="viewContent" v-else>{{formData.nameStandardsRegulations}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='11'>
                        <el-form-item label='车型型号:' prop='carModel'>
                            <el-input v-if='isEdit' disabled placeholder='请输入' v-model='formData.carModel' ></el-input>
                            <span class="viewContent" v-else>{{formData.carModel}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='11'>
                        <el-form-item label='项目代号:' prop='projectCode'>
                            <el-input v-if='isEdit' disabled placeholder='请输入' v-model='formData.projectCode' ></el-input>
                            <span class="viewContent" v-else>{{formData.projectCode}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='11'>
                        <el-form-item label='部门:' prop='deptName'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.deptName' ></el-input>
                            <span class="viewContent" v-else>{{formData.deptName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='11'>
                        <el-form-item label='专业:' prop='major'>
                            <el-select filterable v-model='formData.major' clearable v-if='isEdit' style='width:100%;'>
                                <el-option v-for='(item,index) in professionList' :value='item.id' :label='item.text' :key='"professionList"+index'></el-option>
                            </el-select>
                            <span class="viewContent" v-else>{{formData.major}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='11'>
                        <el-form-item label='设计师:' prop='designer'>
                            <tag-select ref='designerTag' v-if='isEdit' placeholder="选择人员" style="width:100%;vertical-align: top;" :initDataStr="formData.initDataStr"
                                :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data,'designer')}">
                            </tag-select>
                            <span class="viewContent" v-else>{{formData.designerName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='11'>
                        <el-form-item label='部门负责人:' prop='deptLeader'>
                            <tag-select ref='deptLeaderTag' v-if='isEdit' placeholder="选择人员" style="width:100%;vertical-align: top;" :initDataStr="formData.deptLeaderStr"
                                :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data,'deptLeader')}">
                            </tag-select>
                            <span class="viewContent" v-else>{{formData.deptLeaderPerson}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class='rowTitle'>点检结果</div>
                <el-row>
                    <el-col :span='11'>
                        <el-form-item label='符合性:' disabled prop='accordWith'>
                            <el-select disabled filterable v-model='formData.accordWith' clearable v-if='isEdit'>
                                <el-option v-for='(item,key) in dfHandlingInterfaceList' :value='key' :label='item' :key='key'></el-option>
                             </el-select>
                            <span class="viewContent" v-else>{{formData.accordWith}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                   <el-col :span='22'>
                        <el-form-item label='说明:' prop='explain'>
                            <el-input disabled v-if='isEdit' v-model='formData.explain' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000'
                                placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.explain}}</span>
                        </el-form-item>
                   </el-col>
                </el-row>
                <el-row>
                    <el-col :span='22'>
                        <!-- class='is-required' -->
                        <el-form-item label='支撑材料:'>
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
                            <el-input v-if='isEdit' disabled v-model='formData.deptStatusText' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000'
                                 placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.deptStatusText}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='22'>
                        <el-form-item label='法规责任人:' prop='standardRegulationStatusText'>
                            <el-input v-if='isEdit' disabled v-model='formData.standardRegulationStatusText' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000'
                                 placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.standardRegulationStatusText}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='22'>
                        <el-form-item label='标准法规室总师:' prop='engineerStatusText'>
                            <el-input v-if='isEdit' disabled v-model='formData.engineerStatusText' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000'
                                 placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.engineerStatusText}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import {dfHandlingInterfaceQueryOne,dfHandlingInterfaceUpdate,getUserInfoByOrgId} from '../../service/service.js'
    import upload from '../components/upload.vue'
    import { EcoFile } from '@/components/file/main.js'
    import tagSelect from '@/components/orgPick/tagSelect.vue'
    export default {
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
            // this.getDetails();
        },
        activated(){
            this.getDetails();
        },
        components:{
            upload,
            tagSelect
        },
        computed:{
            isEdit(){
                return this.$route.params.caseType !== 'viewCase'
            },
            ...mapState(['dfHandlingInterfaceList','professionList']), 
            id(){
                return this.$route.params.id;
            },
            rules(){
                var list={
                    deptName:'部门',
                    major:'专业',
                    designer:'设计师',
                    deptLeader:'部门责任人',
                    // standardRegulationNo:'标准法规编号',
                    // nameStandardsRegulations:'标准法规名称',
                    // carModel:'车型型号',
                    // projectCode:'项目代号',
                    // accordWith:'符合性',
                    // explain:'说明',
                    // deptStatus:'专业部门审核',
                    // standardRegulationStatus:'法规负责人审核',
                    // engineerStatus:'标准法规室总师审核'
                }
                var obj={};
                for(var key in list){
                    var trigger = (key.search(/(accordWith)|(major)/g)!==-1)?'change':'blur'
                    obj[key] = [{ required: true, message: `${list[key]}为必填项`, trigger: trigger }];
                }
                return obj;
            }
        },
        methods:{
            selectRoleUser(data,type) {
                //设计师
                if (!data.id && data.itemArray.length === 0) {
                    //人员删除
                    if(type=='designer'){
                        this.formData.designer = '';
                        this.formData.designerName ='';
                        this.formData.initDataStr = '';
                    }else{
                        this.formData.deptLeader = '';
                        this.formData.deptLeaderStr='';
                    }    
                } else {
                    if(type=='designer'){
                        this.formData.designer = data.itemArray[0].linkId;
                        this.formData.designerName = data.itemArray[0].name;
                        //部门带出
                        if (this.formData.deptName) {
                            return;
                        }
                        let orgId = data.orgId.split('.')[0];
                        getUserInfoByOrgId(data.itemArray[0].linkId).then(res => {
                            var len = 0;
                            if (res.data.departments && res.data.departments.length > 1) {
                                res.data.departments.forEach((item, i) => {
                                    if (item.id == orgId) {
                                        len = i;
                                    }
                                })
                            }
                            this.formData.deptName = res.data.departments[len].name;//部门
                        })        
                    }else{
                        this.formData.deptLeader = data.itemArray[0].linkId;
                    }
                }
            },
            getDetails(){
                this.loading = true;
                dfHandlingInterfaceQueryOne(this.id).then(res=>{
                    this.copingoutcomesModularInnerId = res.data.id;
                    this.formData = res.data; 
                    this.$set(this.formData,'initDataStr','');   
                    this.$set(this.formData,'deptLeaderStr','');  
                    this.$set(this.formData,'deptStatusText',''); 
                    this.$set(this.formData,'standardRegulationStatusText',''); 
                    this.$set(this.formData,'engineerStatusText',''); 
                    if(res.data.deptLeader){
                        getUserInfoByOrgId(res.data.deptLeader).then(response=>{
                            this.$set(this.formData,'deptLeaderStr',`{"type":"PERSONNEL","orgId":"${response.data.departments[0].id}.${response.data.id}","linkId":"${response.data.id}"}`)
                        })
                    }else{
                        this.$refs.deptLeaderTag.initDataStrFunc('');     
                    }
                    if(res.data.designer){
                        getUserInfoByOrgId(res.data.designer).then(response=>{
                            this.$set(this.formData, 'initDataStr', `{"type":"PERSONNEL","orgId":"${response.data.departments[0].id}.${response.data.id}","linkId":"${response.data.id}"}`);
                            this.loading = false;
                        }).catch(err=>{
                            this.loading = false;
                        })
                    }else{  
                        this.$refs.designerTag.initDataStrFunc('');
                        this.loading = false;
                    }     
                    this.initStatus('deptStatus');
                    this.initStatus('standardRegulationStatus');
                    this.initStatus('engineerStatus');
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
            onSubmit(){
                this.$refs.editPageForm.validate((valid) => {
                    if (valid) {
                        // if(this.fileList.length==0){
                        //     this.$message.warning('支撑材料未上传');
                        //     return;
                        // }
                        dfHandlingInterfaceUpdate(this.formData).then(res=>{
                            this.$message.success('更新成功!');
                            this.$parent.$parent.goBack(false);
                        })
                    }else{

                    }
                })
                
            }
        }
         
    }
</script>
<style scoped>

</style>