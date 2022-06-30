<template>
    <div class='editPage'>
        <div class='addForm'>
            <el-form :model='formData' ref='editForm' :rules='rules' v-loading='loading' label-position='right' label-width='145px'>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='部门:' prop='dept' ref='dept'>
                            <tag-select :disabled='(!["STI_DEPT_START","STI_DEPT_CONFIRM"].includes(phase) && caseType=="editCase")'  v-if='isEdit' placeholder="选择机构" style="width:200px;vertical-align: top;" :initDataStr="formData.deptInitDataStr"
                                :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'dept')}">
                            </tag-select>
                            <span class="viewContent" v-else>{{formData.deptName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='科室:' prop='office' ref='office'>
                            <tag-select  v-if='isEdit' placeholder="选择机构" style="width:200px;vertical-align: top;" :initDataStr="formData.officeInitDataStr"
                                :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'office')}">
                            </tag-select>
                            <span class="viewContent" v-else>{{formData.officeName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='责任人:' prop='responsibleUser' ref='responsibleUser'>
                            <tag-select v-if='isEdit' :disabled='((phase=="RESPONSIBLE_USER_CONFIRM" || phase == "DEPT_LIAISON_APPROVE") && caseType=="editCase")'  placeholder="选择人员" style="width:200px;vertical-align: top;" :initDataStr="formData.responsibleUserInitDataStr"
                                :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data)}">
                            </tag-select>
                            <span v-else class='viewContent'>{{formData.responsibleUserName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='年度:' prop='year'>
                            <el-date-picker disabled v-if='isEdit' v-model="formData.year" value-format='yyyy'  type="year" placeholder="选择年">
                            </el-date-picker>
                            <span v-else class='viewContent'>{{formData.year}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='业务指南名称:' prop='businessGuideName'>
                            <el-input v-if='isEdit' placeholder='请输入'  v-model='formData.businessGuideName'></el-input>
                            <span class="viewContent" v-else>{{formData.businessGuideName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label='业务指南编制目的及内容简介:' prop='purposeContent'>
                            <el-input v-if='isEdit' v-model='formData.purposeContent' type='textarea' :rows='4' resize='none' show-word-limit maxlength='500'
                                placeholder='请输入'></el-input>
                            <span v-else class='viewContent'>{{formData.purposeContent}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='初稿完成时间:' prop='draftCompletionTime'>
                            <el-date-picker v-if='isEdit' style='width:100%' v-model="formData.draftCompletionTime" value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
                            </el-date-picker>
                            <span v-else class='viewContent'>{{formData.draftCompletionTime}}</span>
                        </el-form-item>
                     </el-col>
                     <el-col :span='8'>
                        <el-form-item label='会签完成时间:' prop='countersignCompleteTime'>
                            <el-date-picker v-if='isEdit' style='width:100%' v-model="formData.countersignCompleteTime" value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
                            </el-date-picker>
                            <span v-else class='viewContent'>{{formData.countersignCompleteTime}}</span>
                        </el-form-item>
                     </el-col>
                     <el-col :span='8'>
                        <el-form-item label='复审年度:' prop='reviewYear'>
                            <el-input v-if='isEdit' :disabled='(phase!=="STI_DEPT_START" && caseType=="editCase")' v-model='formData.reviewYear' placeholder='请输入'></el-input>
                            <span v-else class='viewContent'>{{formData.reviewYear}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item label='状态标示:' prop='status'>
                            <el-select filterable v-if='isEdit' v-model='formData.status' @change='statusChange' :disabled="caseType !== 'addCase' && phase !=='STI_DEPT_START'">
                                <el-option v-for='(val,key) in supportStatus' :value='key' :label='val' :key='key' v-show="(phase ==='STI_DEPT_START' || key==='INITIAL')"></el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{formData.statusName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label='备注:' prop='comments'>
                            <el-input v-if='isEdit' v-model='formData.comments' type='textarea' :rows='4' resize='none' show-word-limit maxlength='500'
                                placeholder='请输入'></el-input>
                            <span v-else class='viewContent'>{{formData.comments}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="btn">
            <el-button  v-if='isEdit' size="medium" @click="onCancel">取消</el-button>
            <el-button  v-if='isEdit' type="primary" size="medium" @click="onSubmit">保存</el-button>
            <el-button v-if='caseType === "viewCase" && isShowViewBtn && formData.readReview' @click='openReexaminationSheet'>复审</el-button>
            <el-button v-if='caseType === "viewCase" && isShowViewBtn && formData.readStartup' @click='openProjectApproval'>立项</el-button>
        </div>
    </div>
</template>
<script>
     import tagSelect from '@/components/orgPick/tagSelect.vue'
     import { EcoUtil } from '@/components/util/main.js'
     import {mapState} from 'vuex'
     import {programDetails,programMainAdd,getUserInfoByOrgId,programMainUpdate} from '../service/service.js'
     export default {
         name:'editPage',
         data(){
             return {
                isShowViewBtn:false,//复审 立项 查看权限
                loading:false,
                formData:{
                    deptInitDataStr:'',
                    dept:'',
                    officeInitDataStr:'',
                    office:'',
                    responsibleUserInitDataStr:'',
                    responsibleUser:'',
                    year: (new Date().getFullYear()+''),
                    purposeContent:'',
                    draftCompletionTime:'',
                    countersignCompleteTime:'',
                    reviewYear:"",
                    status:'',
                    comments:'',
                    businessGuideName:''
                },
                rules:{
                    businessGuideName : [{ required: true, message: '业务指南名称为必填项', trigger: 'blur' }],
                    year: [{ required: true, message: '年度为必选项', trigger: 'change' }],
                    // purposeContent: [{ required: true, message: '编制目的及内容简介为必填项', trigger: 'blur' }],
                    dept: [{ required: true, message: '部门为必选项', trigger: 'change' }],
                    office: [{ required: true, message: '科室为必选项', trigger: 'change' }],
                    responsibleUser: [{ required: true, message: '责任人为必选项', trigger: 'change' }],
                    draftCompletionTime: [{ required: false, message: '初稿完成时间为必选项', trigger: 'change' }],
                    countersignCompleteTime: [{ required: false, message: '会签完成时间为必选项', trigger: 'change' }],
                    reviewYear: [{ required: false, message: '复审年度为必填项', trigger: 'blur' }],
                    status: [{ required: true, message: '状态标示为必选项', trigger: 'change' }],
                    // comments: [{ required: true, message: '备注为必填项', trigger: 'blur' }]
                }

             }
         },
         computed: {
            ...mapState(['supportStatus']),
            id(){
                return this.$route.params.id;
            },
            caseType(){
                return this.$route.params.caseType;
            },
            isEdit() {
                return this.caseType !== 'viewCase'
            },
            phase(){
                return this.$route.params.phase;
            }
        },
         components:{
            tagSelect
         },
         created(){
              if(this.caseType === 'addCase' && this.phase !=='STI_DEPT_START'){
                 this.formData.status = 'INITIAL';
              }
              if (this.id && this.id != 0) {
                this.getDetailData();
              }
         },
         methods:{
            openReexaminationSheet(){
                let url ="/businessGuidemanage/index.html#/reexaminationSheet/"+this.id+'/viewCase';
                EcoUtil.getSysvm().openDialog('复审', url,'1100','500', "15vh");
            },
            openProjectApproval(){
                let url ="/businessGuidemanage/index.html#/projectApproval/"+this.id+'/viewCase';
                EcoUtil.getSysvm().openDialog('立项', url,'1100','500', "15vh");
            },
            statusChange(val){
                if(val){
                    if(val === 'INITIAL'){
                       //a
                       this.rules.draftCompletionTime[0].required = true;
                       this.rules.countersignCompleteTime[0].required = true;
                       this.rules.reviewYear[0].required = false;
                    }else if(val === 'KEEP_ALIVE'){
                       //b
                       this.rules.draftCompletionTime[0].required = false;
                       this.rules.countersignCompleteTime[0].required = false;
                        this.rules.reviewYear[0].required = true;
                    }else if(val === 'NEED_MODIFY'){
                       //c
                       this.rules.draftCompletionTime[0].required = true;
                       this.rules.countersignCompleteTime[0].required = true;
                        this.rules.reviewYear[0].required = true;
                    }else{
                       //d
                       this.rules.draftCompletionTime[0].required = false;
                       this.rules.countersignCompleteTime[0].required = false;
                       this.rules.reviewYear[0].required = true;
                    }
                    this.$refs.editForm.validateField('draftCompletionTime');
                    this.$refs.editForm.validateField('countersignCompleteTime');
                    this.$refs.editForm.validateField('reviewYear');
                }
            },
            getDetailData(){
                this.loading = true;
                programDetails(this.id).then(res=>{
                   res.data.data.year+='';
                   res.data.data.reviewYear+='';
                   res.data.data.deptInitDataStr = `{"type":"DEPT","orgId":"${res.data.data.dept}","linkId":"${res.data.data.dept}"}`
                   res.data.data.officeInitDataStr = `{"type":"DEPT","orgId":"${res.data.data.office}","linkId":"${res.data.data.office}"}`
                   this.formData = res.data.data;
                   this.isShowViewBtn = ["EXPERT_APPROVE","SECTION_CHIEF_APPROVE","DEPT_LIAISON_APPROVE","STD_REVIEWER_APPROVE","DEPT_MINISTER_APPROVE","STI_DEPT_CONFIRM","STD_REGULATION_SECTION_CHIEF_APPROVE","STI_DEPT_MINISTER_APPROVE","CENTER_STD_COMMITTEE_APPROVE","END"].includes(this.formData.phase);
                   this.$set(this.formData,'responsibleUserInitDataStr','');
                   getUserInfoByOrgId(this.formData.responsibleUser).then(response=>{
                        this.$set(this.formData, 'responsibleUserInitDataStr', `{"type":"PERSONNEL","orgId":"${response.data.departments[0].id}.${response.data.id}","linkId":"${response.data.id}"}`);
                   })
                   this.loading = false;
                })
            },
            onCancel() {
                EcoUtil.getSysvm().closeDialog();
            },
            onSubmit(){
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                       this.loading = true;
                       let params = {
                            phase:this.phase,
                            dept:this.formData.dept,
                            office:this.formData.office,
                            responsibleUser:this.formData.responsibleUser,
                            year:this.formData.year,
                            businessGuideName:this.formData.businessGuideName,
                            purposeContent:this.formData.purposeContent,
                            draftCompletionTime:this.formData.draftCompletionTime,
                            countersignCompleteTime:this.formData.countersignCompleteTime,
                            reviewYear:this.formData.reviewYear,
                            status:this.formData.status,
                            comments:this.formData.comments
                       }
                       if (this.caseType === 'editCase') {
                            params.id = this.id;
                            programMainUpdate(params).then(res=>{
                                this.loading = false;
                                let doObj = {}
                                doObj.action = 'editBusinessGuide';
                                doObj.data = {};
                                doObj.close = true;
                                EcoUtil.getSysvm().callBackDialogFunc(doObj);
                            }).catch(err=>{
                                this.loading = false;
                            })
                       }else{
                            programMainAdd(params).then(res=>{
                                this.loading = false;
                                let doObj = {}
                                doObj.action = 'addBusinessGuide';
                                doObj.data = {};
                                doObj.close = true;
                                EcoUtil.getSysvm().callBackDialogFunc(doObj);
                            }).catch(err=>{
                                this.loading = false;
                            })
                       }
                    }else{
                        return false
                    }
                })

            },
            selectRoleUser(data) {
                //选择人
                if (!data.id && data.itemArray.length === 0) {
                    //人员删除
                      this.formData.responsibleUser='';
                      this.formData.responsibleUserInitDataStr = '';
                      this.$refs.editForm.validateField('responsibleUser');

                } else {
                     this.formData.responsibleUser= data.itemArray[0].linkId;
                     this.$refs.responsibleUser.clearValidate();

                    //部门和科室联动
                    // if (this.formData.office && this.formData.dept) {
                    //     return;
                    // }
                    try{
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
                        if(res.data.departments[len].levelV2 === "dept_class"){
                            //部门
                            this.formData.dept = res.data.departments[len].id;
                        }else if(res.data.departments[len].levelV2 === "dept_office"){
                            //科室
                            this.formData.office = res.data.departments[len].id; 
                            res.data.departments[len].orgPathDeptList.forEach(item=>{
                                if(item.levelV2 === 'dept_class'){
                                    this.formData.dept = item.id;
                                }
                            })
                        }
                        if(this.formData.office){
                            this.formData.officeInitDataStr = `{"type":"DEPT","orgId":"${this.formData.office}","linkId":"${this.formData.office}"}`;
                        }
                        if(this.formData.dept){
                            this.formData.deptInitDataStr = `{"type":"DEPT","orgId":"${this.formData.dept}","linkId":"${this.formData.dept}"}`;
                        }
                    })
                    }catch(err){console.log(err)}

                }
            },
            selectRoleDept(data,type){
                if (!data.id && data.itemArray.length === 0) {
                    if(type==='dept'){
                        this.formData.deptInitDataStr = '';
                        this.formData.dept = '';
                        this.$refs.editForm.validateField('dept'); //必填验证
                    }else if(type==='office'){
                        this.formData.officeInitDataStr = '';
                        this.formData.office = '';
                        this.$refs.editForm.validateField('office'); //必填验证
                    }
                } else {
                    if(type === 'dept'){
                        this.formData.dept = data.orgId;
                        this.$refs.dept.clearValidate();
                    }else if(type==='office'){
                        this.formData.office = data.orgId;
                        this.$refs.office.clearValidate();
                    }
                }

            }
         }
     }
</script>
<style scoped>
 .editPage {
        background: #fff;
        height: 100%;
    }

    .editPage .btn {
        text-align: center;
        padding: 10px;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #ddd;
    }

    .editPage .addForm {
        overflow: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 60px;
        padding: 0 10px;
    }

    .editPage .addForm .el-input,
    .editPage .addForm .el-select {
        width: 200px;
    }
</style>
