<template>
    <div class="editPlan">
        <div class='addForm'>
            <el-form :model='formData' ref='editForm' :rules='rules' v-loading='loading' label-position='right'
                label-width='145px'>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='标准分类:' prop='classification'>
                            <el-select v-if='isEdit' filterable v-model='formData.classification' clearable
                                @change='ficationChange'>
                                <el-option :value='item.id' :label='item.text' v-for='(item) in standardType'
                                    :key='item.id'></el-option>
                            </el-select>
                            <span class="viewContent" v-else>{{formData.classificationName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='标准类型:' prop='type'>
                            <el-select v-if='isEdit' filterable v-model='formData.type' clearable>
                                <el-option :value='item.id' :label='item.text' v-for='(item) in typeList'
                                    :key='item.id'></el-option>
                            </el-select>
                            <span class="viewContent" v-else>{{formData.typeName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='体系码:' prop='systemCode' ref='systemCodeFormItem'>
                            <el-input  readonly @click.native.stop='selectSystemCode' v-if='isEdit' placeholder='请输入' v-model='formData.systemCode'></el-input>
                            <span class="viewContent" v-else>{{formData.systemCode}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='标准编号:' prop='programNumber'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.programNumber'></el-input>
                            <span class="viewContent" v-else>{{formData.programNumber}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='标准名称:' prop='programName'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.programName'></el-input>
                            <span class="viewContent" v-else>{{formData.programName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='年度:' prop='year'>
                            <el-date-picker disabled v-if='isEdit' v-model="formData.year" value-format='yyyy'
                                type="year" placeholder="选择年">
                            </el-date-picker>
                            <span v-else class='viewContent'>{{formData.year}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='制修订状态' prop='editType'>
                            <el-select v-if='isEdit' filterable v-model='formData.editType' clearable>
                                <el-option :value='item.id' :label='item.text' v-for='(item,index) in editType' :key='item.id'></el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{formData.editTypeName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='计划类型' prop='planType'>
                            <el-select v-if='isEdit' filterable v-model='formData.planType' clearable>
                                <el-option :value='item.id' :label='item.text' v-for='(item,index) in planType' :key='item.id'></el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{formData.planTypeName}}</span>
                        </el-form-item>
                    </el-col> 
                </el-row>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label='标准编制目的及内容简介:' prop='purposeContent'>
                            <el-input v-if='isEdit' v-model='formData.purposeContent' type='textarea' :rows='4' resize='none' show-word-limit maxlength='500'
                                placeholder='请输入'></el-input>
                            <span v-else class='viewContent'>{{formData.purposeContent}}</span>  
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='部门:' prop='dept' ref='dept'>
                            <tag-select   v-if='isEdit' placeholder="选择机构" style="width:200px;vertical-align: top;" :initDataStr="formData.deptInitDataStr"
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
                            <tag-select v-if='isEdit'  placeholder="选择人员" style="width:200px;vertical-align: top;" :initDataStr="formData.responsibleUserInitDataStr"
                                :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data)}">
                            </tag-select>
                            <span v-else class='viewContent'>{{formData.responsibleUserName}}</span>  
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='初稿完成时间:' prop='draftTime'>
                            <el-date-picker v-if='isEdit' style='width:100%' v-model="formData.draftTime" value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
                            </el-date-picker>
                            <span v-else class='viewContent'>{{formData.draftTime}}</span>            
                        </el-form-item>
                     </el-col>
                     <el-col :span='8'>
                        <el-form-item label='会签完成时间:' prop='countersignTime'>
                            <el-date-picker v-if='isEdit' style='width:100%' v-model="formData.countersignTime" value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
                            </el-date-picker>
                            <span v-else class='viewContent'>{{formData.countersignTime}}</span>            
                        </el-form-item>
                     </el-col>
                     <el-col :span='8'>
                        <el-form-item label='分标委:' prop='subcommittee'>
                            <div class='selectSubcommittee' v-if='isEdit' style="float:left" @click.stop='selectSubcommittee'>{{formData.subcommitteeName||'请选择'}}</div>  
                            <span v-else class='viewContent'>{{formData.subcommitteeName}}</span>      
                        </el-form-item>
                     </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='规划来源:' prop='programSource'>
                            <el-select filterable v-if='isEdit' v-model='formData.programSource' @change='programSourceChange'>
                                <el-option v-for='(item,index) in programSource' :value='item.id' :label='item.text' :key='item.id'></el-option>
                            </el-select>        
                            <span class="viewContent" v-else>{{formData.programSourceName||'暂无填写'}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item prop='sourceNumber' label='来源编号' v-show='formData.programSource=="zhiliangwenti"'>
                           <el-input v-if='isEdit'   placeholder='请输入' readonly @click.native.stop='selectQuality' :value='formData.sourceNumber'></el-input>
                           <span v-else class='viewContent'>{{formData.sourceNumber}}</span>            
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
    import { EcoUtil } from "@/components/util/main.js";
    import tagSelect from '@/components/orgPick/tagSelect.vue'
    import { mapState } from 'vuex'
    import { getTreeSelectEnabled,getUserInfoByOrgId,planModifySingleUpdate,planModifySelectDetails} from '../service/service.js'
    export default {
        data() {
            return {
                typeList: [],
                loading: false,
                formData: {
                    classification: '',
                    type: '',
                    systemCode: '',
                    programNumber: '',
                    programName: '',
                    year: (new Date().getFullYear() + ''),
                    editType:'',
                    planType:"",
                    purposeContent:'',
                    responsibleUser:'',
                    responsibleUserInitDataStr:'',
                    dept:'',
                    deptInitDataStr:'',
                    office:'',
                    officeInitDataStr:'',
                    draftTime:'',
                    countersignTime:'',
                    sourceNumber:'',
                    sourceNumberItems:null,
                    subcommitteeName:'',
                    subcommittee:'',
                    programSource:'',

                },
                rules: {
                    classification: [{ required: true, message: '标准分类为必选项', trigger: 'change' }],
                    type: [{ required: true, message: '标准类型为必选项', trigger: 'change' }],
                    programNumber: [{ required: true, message: '标准编号为必填项', trigger: 'blur' }],
                    systemCode:[{ required: true, message: '体系码为必填项', trigger: 'change' }],
                    purposeContent:[{ required: true, message: '标准编制目的及内容简介为必填项', trigger: 'blur' }],
                    dept:[{ required: true, message: '部门为必选项', trigger: 'change' }],
                    office:[{ required: true, message: '科室为必选项', trigger: 'change' }],
                    responsibleUser:[{ required: true, message: '责任人为必选项', trigger: 'change' }],
                    draftTime:[{ required: true, message: '初稿完成时间为必选项', trigger: 'change' }],
                    countersignTime:[{ required: true, message: '会签完成时间为必选项', trigger: 'change' }],
                    subcommittee:[{ required: true, message: '分标委为必选项', trigger: 'change' }],
                    editType:[{ required: false, message: '制/修订为必选项', trigger: 'change' }],//在各业务科室联络员编辑必填，其他选填

                }
            }
        },
        components:{
            tagSelect
        },
        computed: {
            ...mapState(['programSource','standardType','editType','planType']),
            id() {
                return this.$route.params.id;
            },
            caseType() {
                return this.$route.params.caseType;
            },
            isEdit() {
                return this.caseType !== 'viewCase'
            }
        },
        created(){
            _self = this;
            this.callAction();
            this.getDetails();
        },
        methods: {
            selectSystemCode(){
                let url ="/standardPlanRelease/index.html#/selectSystemCode" ;
                let baseParams = ''
                let data1 = '';
                let data2 = "";
                if(this.formData.classification){
             
                    this.standardType.forEach(item=>{
                        if(item.id === this.formData.classification){
                            data1 = item.text;
                        }
                    })
                    baseParams = "?classification="+data1;
                }
                if(this.formData.type){
                 
                    this.typeList.forEach(item=>{
                        if(item.id === this.formData.type){
                            data2 = item.text;
                        }
                    })
                    baseParams = "?type="+data2;
                }
                if(this.formData.classification && this.formData.type){
                    baseParams = `?classification=${data1}&type=${data2}`;
                }
                url +=baseParams;
                EcoUtil.getSysvm().openDialog('标准体系树', url,'400', '600', "15vh");
            },
            restSourceNumberList(data){
                let str = '';
                if(!data){
                   return '暂无填写';
                }
                data.forEach((item,index)=>{
                    str += (index===0?item.code:`、${item.code}`)
                })
                return str;
            },
            getInfo(resId,name){
                getUserInfoByOrgId(resId).then(response => {
                    this.$set(this.formData, (name+'InitDataStr'), `{"type":"PERSONNEL","orgId":"${response.data.departments[0].id}.${response.data.id}","linkId":"${response.data.id}"}`);
                    this.$set(this.formData, (name+'Name'), response.data.mi);
                })  
            },
            getDetails(){
                this.loading = true;
                planModifySelectDetails(this.id).then(res=>{
                    getTreeSelectEnabled(res.data.data.classification).then(res2=>{
                        this.typeList = res2.data;
                        if(res.data.data.sourceNumberList){
                            res.data.data.sourceNumber = this.restSourceNumberList(res.data.data.sourceNumberList);
                        } 
                        res.data.data.year = res.data.data.year+'';
                        this.formData = res.data.data;
                        this.$set(this.formData, 'responsibleUserInitDataStr', '');
                        this.$set(this.formData, 'deptInitDataStr', `{"type":"DEPT","orgId":"${res.data.data.dept}","linkId":"${res.data.data.dept}"}`);
                        this.$set(this.formData, 'officeInitDataStr',  `{"type":"DEPT","orgId":"${res.data.data.office}","linkId":"${res.data.data.office}"}`);
                        this.getInfo(res.data.data.responsibleUser,'responsibleUser');
                        this.loading = false;
                    })
                })
            },
            onSubmit(){
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                            this.loading = true;
                            let params = {
                                id:this.id,
                                classification:this.formData.classification,
                                type:this.formData.type,
                                systemCode:this.formData.systemCode,
                                programNumber:this.formData.programNumber,
                                programName:this.formData.programName,
                                year: this.formData.year,
                                editType:this.formData.editType,
                                planType:this.formData.planType,
                                purposeContent:this.formData.purposeContent,
                                dept:this.formData.dept,
                                office:this.formData.office,
                                responsibleUser:this.formData.responsibleUser,
                                draftTime:this.formData.draftTime,
                                countersignTime:this.formData.countersignTime,
                                subcommittee:this.formData.subcommittee,
                                programSource:this.formData.programSource,
                                sourceNumberItems:this.formData.sourceNumberItems,
                            }
                            planModifySingleUpdate(params).then(res=>{
                                    this.loading = false;
                                    let doObj = {};
                                    doObj.action = 'editPlan';
                                    doObj.data = {};
                                    doObj.close = true;
                                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
                                }).catch(err=>{
                                    this.loading = false;
                                })
                    } else {
                        return false;
                    }
                })
            },
            onCancel() {
                EcoUtil.getSysvm().closeDialog();
            },
            programSourceChange(val){
                if(this.formData.sourceNumber){
                    this.formData.sourceNumber = '';
                    this.formData.sourceNumberItems = [];
                }
            },
            callAction() {
                let callBackDialogFunc = function (obj) {
                if(obj.action==='selectSubcommittee'){
                        //查询条件分标委
                        // _self.searchContent.subcommitteeName
                        _self.formData.subcommitteeName =obj.dataArr.name;
                        _self.formData.subcommittee = obj.dataArr.id;
                    }else  if (obj && (obj.action === 'selectQuality')) {
                        //来源编号
                        _self.formData.sourceNumber = obj.data.sourceNumberList.join('、');
                        _self.formData.sourceNumberItems = obj.data.sourceNumberItems;
                    }else if(obj && (obj.action === 'selectSystemCode')){
                        _self.formData.systemCode = obj.data.code; 
                        if(obj.data.matchType && !_self.formData.classification){
                            _self.formData.classification = obj.data.matchType;
                            getTreeSelectEnabled(obj.data.matchType).then(res2=>{
                                _self.typeList = res2.data;
                                if(obj.data.matchSubType){
                                    _self.formData.type =  obj.data.matchSubType;
                                }
                            })
                        }
                        _self.formData.selectId = obj.data.selectId;
                        _self.$refs.systemCodeFormItem.clearValidate()
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'planManageIndex');
            },
            selectSubcommittee(){
                var url = '/standardPlanRelease/index.html#/subcommitteeList/'+true+'?action='+"selectSubcommittee"
                EcoUtil.getSysvm().openDialog('分标委', url, 1000, 600, '15vh');
            },
            selectQuality(){
                let url ="/standardPlanRelease/index.html#/quality" ;
                EcoUtil.getSysvm().openDialog('来源编号', url,'900', '600', "15vh");
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
            },
            ficationChange(val) {
                this.formData.type = '';
                if (val) {
                    getTreeSelectEnabled(val).then(res => {
                        this.typeList = res.data;
                    })
                } else {
                    this.typeList = [];
                }
            }
        }
    }
</script>
<style scoped>
    .editPlan {
        background: #fff;
        height: 100%;
    }

    .editPlan .btn {
        text-align: center;
        padding: 10px;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #ddd;
    }

    .editPlan .addForm {
        overflow: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 60px;
        padding: 0 10px;
    }

    .editPlan .addForm .el-input,
    .editPlan .addForm .el-select {
        width: 200px;
    }
    .editPlan .selectSubcommittee{
        width:200px;
        height:28px;
        border:1px solid #DCDFE6;
        border-radius:4px;
        cursor: pointer;
        box-sizing: border-box;
        padding-left: 15px;
        font-size:12px;
        color:rgb(193, 195, 197);
        line-height:25px;
        overflow:hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
</style>