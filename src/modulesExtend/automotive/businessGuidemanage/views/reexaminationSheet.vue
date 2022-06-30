<template>
    <div class="reexaminationSheet">
        <div class='addForm'>
            <el-form :model='formData' ref='editForm' :rules='rules' v-loading='loading' label-position='right' label-width='145px'>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='业务指南名称:' prop='businessGuideName'>
                            <el-input v-if='isEdit' placeholder='请输入'  v-model='formData.businessGuideName'></el-input>
                            <span class="viewContent" v-else>{{formData.businessGuideName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='与工作需求比较:' prop='requirementCompare'>
                            <el-select filterable v-if='isEdit' v-model='formData.requirementCompare'>
                                <el-option v-for='(item,index) in requirementCompareList' :value='item.id' :label='item.text' :key='item.id'></el-option>
                            </el-select>        
                            <span class="viewContent" v-else>{{formData.requirementCompareName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='使用情况:' prop='usage'>
                            <el-select filterable v-if='isEdit' v-model='formData.usage'>
                                <el-option v-for='(item,index) in usageList' :value='item.id' :label='item.text' :key='item.id'></el-option>
                            </el-select>        
                            <span class="viewContent" v-else>{{formData.usage}}</span>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span='8'>
                        <el-form-item label='起草单位:' prop='draftDept' ref='draftDept'>
                            <tag-select  v-if='isEdit' placeholder="选择机构" style="width:200px;vertical-align: top;" :initDataStr="formData.deptInitDataStr"
                                :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data)}">
                            </tag-select>
                            <span class="viewContent" v-else>{{formData.draftDept}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='起草人:' prop='draftUser' ref='draftUser'>
                            <tag-select v-if='isEdit' placeholder="选择人员" style="width:200px;vertical-align: top;" :initDataStr="formData.responsibleUserInitDataStr"
                                :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data,'responsibleUser')}">
                            </tag-select>
                            <span v-else class='viewContent'>{{formData.draftUser}}</span>  
                        </el-form-item>
                    </el-col> -->
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='复审结论:' prop='reviewConclusion'>
                            <el-radio-group v-if='isEdit' v-model="formData.reviewConclusion" @change='radioChange'>
                                <el-radio :label="key" v-for='(val,key) in supportReview' :key='key'>{{val}}</el-radio>
                            </el-radio-group>
                            <span class="viewContent" v-else>{{supportReview[formData.reviewConclusion]}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show='["ENABLE","OBSOLETED"].includes(formData.reviewConclusion)' class="backB">
                    <el-col :span='24'>
                        <el-form-item label='标准状况说明:' prop='standardSituation'>
                            <el-input v-if='isEdit' v-model='formData.standardSituation' type='textarea' :rows='4' resize='none' show-word-limit maxlength='500'
                                placeholder='请输入'></el-input>
                            <span v-else class='viewContent'>{{formData.standardSituation}}</span>  
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="formData.reviewConclusion==='MODIFY'" class="backB">
                    <el-col :span='8'>
                        <el-form-item label='修订方案及名称:' prop='revisedProject' :rules="[{ required: true, message: '修订方案及名称为必填项', trigger: 'blur' }]">
                            <el-input v-if='isEdit' placeholder='请输入'  v-model='formData.revisedProject'></el-input>
                            <span class="viewContent" v-else>{{formData.revisedProject}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='修订人:' prop='revisedUser' ref='revisedUser' :rules="[{ required: true, message: '修订人为必选项', trigger: 'change' }]">
                            <tag-select v-if='isEdit' placeholder="选择人员" style="width:200px;vertical-align: top;" :initDataStr="formData.revisedUserInitDataStr"
                                :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data,'revisedUser')}">
                            </tag-select>
                            <span class="viewContent" v-else>{{formData.revisedUserName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='初稿完成时间:' prop='draftCompletionTime' :rules="[{ required: true, message: '初稿完成时间为必选项', trigger: 'change' }]">
                            <el-date-picker v-if='isEdit' style='width:100%' v-model="formData.draftCompletionTime" value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
                            </el-date-picker>
                            <span v-else class='viewContent'>{{formData.draftCompletionTime}}</span>            
                        </el-form-item>
                     </el-col>
                     <el-col :span='24'>
                        <el-form-item label='会签完成时间:' prop='countersignCompleteTime' :rules="[{ required: true, message: '会签完成时间为必选项', trigger: 'change' }]">
                            <el-date-picker v-if='isEdit' v-model="formData.countersignCompleteTime" value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
                            </el-date-picker>
                            <span v-else class='viewContent'>{{formData.countersignCompleteTime}}</span>            
                        </el-form-item>
                     </el-col>
                     <el-col :span='24'>
                        <el-form-item label='内容简介:' prop='introduction'>
                            <el-input v-if='isEdit' v-model='formData.introduction' type='textarea' :rows='4' resize='none' show-word-limit maxlength='500'
                                placeholder='请输入'></el-input>
                            <span v-else class='viewContent'>{{formData.introduction}}</span>  
                        </el-form-item>
                    </el-col>
                        <!-- <el-col :span='8'>
                            <el-form-item label='规划时间:' prop='programTime'>
                                <el-date-picker v-if='isEdit' style='width:100%' v-model="formData.programTime" value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
                                </el-date-picker>
                                <span v-else class='viewContent'>{{formData.programTime}}</span>       
                            </el-form-item>
                        </el-col> -->
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
        <div class="btn" v-if='isEdit'>
            <el-button type="primary" size="medium" @click="onSubmit">保存</el-button>
            <!-- <el-button size="primary">提交</el-button> -->
            <el-button size="medium" @click="onCancel">取消</el-button> 
        </div>
    </div>
</template>
<script>
    import tagSelect from '@/components/orgPick/tagSelect.vue'
    import { EcoUtil } from '@/components/util/main.js'
    import {mapState} from 'vuex'
    import {programSpecificReview,programSpecificUpdate,getUserInfoByOrgId} from '../service/service.js'
    import { EcoMessageBox } from "@/components/messageBox/main.js";
    export default {
        name:"reexaminationSheet",
        data(){
            return {
                reviewConclusionCopy:'',
                loading:false,
                formData:{
                    businessGuideName:'',
                    deptInitDataStr:'',
                    // draftDept:'',
                    // draftUser:'',
                    responsibleUserInitDataStr:'',
                    requirementCompare:'',
                    usage:'',
                    reviewConclusion:'',
                    revisedProject:'',
                    revisedUser:'',
                    revisedUserInitDataStr:'',
                    standardSituation:'',
                    introduction:'',
                    // programTime:'',
                    draftCompletionTime:'',
                    countersignCompleteTime:'',
                    comments:""
                },

            }
        },
        components:{
            tagSelect
        },
        computed:{
            ...mapState(['usageList','supportReview','requirementCompareList']),
            id(){
                return this.$route.params.id
            },
            caseType(){
                return this.$route.params.caseType
            },
            isEdit(){
                return this.caseType == 'editCase';
            },
            rules(){
                let obj = {
                    businessGuideName:'业务指南名称',
                    // draftDept:'起草单位',
                    // draftUser:'起草人',
                    requirementCompare:'与工作需求比较',
                    usage:'使用情况',
                    reviewConclusion:'复审结论',
                    // revisedProject:'修订方案及名称',
                    // revisedUser:'修订人',
                    // standardSituation:'标准状况说明',
                    // introduction:'内容简介',
                    // programTime:'规划时间',
                    // draftCompletionTime:'初稿完成时间',
                    // countersignCompleteTime:'会签完成时间',
                    // comments:"备注"
                }
                let rules = {};
                for(var key in obj){
                    var message = '为必填项';
                    var trigger = 'blur';
                    if(['draftDept','draftUser','usage','reviewConclusion','revisedUser','programTime','draftCompletionTime','countersignCompleteTime'].includes(key)){
                        message = '为必选项';
                        trigger = 'change'
                    }
                    rules[key] = [{ required: true, message: obj[key]+message, trigger: trigger }];
                }
                return  rules;
             
            },
        },
        created(){
            this.getDataInfo();
        },
        methods:{
            radioChange(val){
                let _self = this;
                let cancelFunc = function(){
                    _self.formData.reviewConclusion = _self.reviewConclusionCopy;
                }
                let doit = function(){
                    _self.formData.standardSituation ='';
                    _self.formData.revisedProject = '';
                    _self.formData.revisedUser = '';
                    _self.formData.revisedUserInitDataStr = '';
                    _self.formData.introduction=''
                    _self.formData.draftCompletionTime = '';
                    _self.formData.countersignCompleteTime = '';
                    _self.reviewConclusionCopy = val;
                }
                EcoMessageBox.confirm('修改复审结论会清空此选项卡数据，请确定是否修改?','提示',{ type: 'warning', lockScroll: false }, doit,cancelFunc)    
            },
            getDataInfo(){
                this.loading = true;
                programSpecificReview(this.id).then(res=>{
                    this.formData = res.data.data;
                    this.reviewConclusionCopy = this.formData.reviewConclusion;
                    this.$set(this.formData,'revisedUserInitDataStr','');
                    this.$set(this.formData,'revisedUserName','');
                    if(this.formData.requirementCompare){
                        this.requirementCompareList.forEach(item=>{
                            if(item.id === this.formData.requirementCompare){
                                this.$set(this.formData,'requirementCompareName',item.text);
                            }
                        })
                    }
                    if(res.data.data.revisedUser){
                        getUserInfoByOrgId(res.data.data.revisedUser).then(response=>{
                            this.$set(this.formData,'revisedUserName',response.data.mi);
                            this.$set(this.formData, 'revisedUserInitDataStr', `{"type":"PERSONNEL","orgId":"${response.data.departments[0].id}.${response.data.id}","linkId":"${response.data.id}"}`);
                            this.loading = false;
                        })
                    }else{
                        this.loading = false;
                    }
                
                }).catch(err=>{
                    this.loading = false
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
                            businessGuideName: this.formData.businessGuideName,
                            // draftDept: this.formData.draftDept,
                            // draftUser: this.formData.draftUser,
                            requirementCompare: this.formData.requirementCompare,
                            usage: this.formData.usage,
                            reviewConclusion: this.formData.reviewConclusion,
                            revisedProject: this.formData.revisedProject,
                            revisedUser: this.formData.revisedUser,
                            standardSituation: this.formData.standardSituation,
                            introduction: this.formData.introduction,
                            // programTime: this.formData.programTime,
                            draftCompletionTime: this.formData.draftCompletionTime,
                            countersignCompleteTime: this.formData.countersignCompleteTime,
                            comments: this.formData.comments
                        }
                        programSpecificUpdate(this.id,params).then(res=>{
                            this.loading = false;
                            let doObj = {}
                            doObj.action = 'reexaminationSheet';
                            doObj.data = {};
                            doObj.close = true;
                            EcoUtil.getSysvm().callBackDialogFunc(doObj);
                        })

                    }else{
                        return false;
                    }
                })

            },
            // selectRoleDept(data){
            //     if (!data.id && data.itemArray.length === 0) {
            //         this.formData.deptInitDataStr = '';
            //         this.formData.draftDept = '';
            //         this.$refs.editForm.validateField('draftDept'); //必填验证
            //     }else{
            //         this.formData.draftDept =  data.orgId;
            //         this.$refs.draftDept.clearValidate();
            //     }
            // },
            selectRoleUser(data,type){
                if (!data.id && data.itemArray.length === 0) {
                    if(type=== 'responsibleUser'){
                        this.formData.draftUser = '';
                        this.formData.responsibleUserInitDataStr = '';
                        this.$refs.editForm.validateField('draftUser'); //必填验证
                    }else{
                        this.formData.revisedUser = '';
                        this.formData.revisedUserInitDataStr = '';
                        this.$refs.editForm.validateField('revisedUser'); //必填验证
                    }
                }else{
                    if(type=== 'responsibleUser'){
                        this.formData.draftUser =  data.itemArray[0].linkId;
                        this.$refs.draftUser.clearValidate();
                    }else{
                        this.formData.revisedUser =  data.itemArray[0].linkId;
                        this.$refs.revisedUser.clearValidate();
                    }
                }
              

            },
        }
    }
</script>
<style scoped>
.reexaminationSheet{
    background: #fff;
    height: 100%;
}
.reexaminationSheet .btn {
        text-align: center;
        padding: 10px;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #ddd;
    }

    .reexaminationSheet .addForm {
        overflow: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 60px;
        padding: 0 10px;
    }

    .reexaminationSheet .addForm .el-input,
    .reexaminationSheet .addForm .el-select,
    .reexaminationSheet .addForm .el-date-picker {
        width: 200px;
    }
    .reexaminationSheet .addForm .backB{
        background-color: #eee;
        padding:20px 30px;
        margin-bottom:15px;
    }
</style>