<template>
    <div class='editPlanPage'>
        <div class='addForm'>
            <el-form :model='formData' ref='editPlanForm' :rules='rules' v-loading='loading' label-position='right' label-width='145px'>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='标准分类:' prop='classification'>
                            <el-select :disabled="(caseType === 'editCase' && phaseId ==='OFFICE_LIAISON_HANDLE')" filterable v-if='isEdit' v-model='formData.classification' @change='selectStandardType'>
                                <el-option :disabled='isDeptPending' v-for='(item,index) in standardType' :value='item.id' :label='item.text' :key='item.id'></el-option>
                            </el-select>        
                            <span class="viewContent" v-else>{{formData.classificationName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='标准类型:' prop='type'>
                            <el-select :disabled='isDeptPending || (caseType === "editCase" && phaseId ==="OFFICE_LIAISON_HANDLE")' filterable v-if='isEdit' v-model='formData.type'>
                                <el-option v-for='(item,index) in childrenTypeList' :value='item.id' :label='item.text' :key='item.id'></el-option>
                            </el-select>
                            <span class="viewContent" v-else>{{formData.typeName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='体系码:' prop='systemCode' ref='systemCodeFormItem'>
                            <el-input :disabled='!["TECH_INNOVATION_DEPT_CREATE","OFFICE_LIAISON_HANDLE"].includes(phaseId) || caseType==="editCase"' readonly @click.native.stop='selectSystemCode' v-if='isEdit' placeholder='请输入' v-model='formData.systemCode'></el-input>
                            <span class="viewContent" v-else>{{formData.systemCode}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='标准编号:' prop='programNumber'>
                            <el-input v-if='isEdit' :disabled='phaseId==="DEPT_LIAISON_PROOF"' placeholder='请输入' v-model='formData.programNumber'></el-input>
                            <span class="viewContent" v-else>{{formData.programNumber}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='标准名称:' prop='programName'>
                            <el-input :disabled='isDeptPending || phaseId==="DEPT_LIAISON_PROOF"' v-if='isEdit' placeholder='请输入' v-model='formData.programName'></el-input>
                            <span class="viewContent" v-else>{{formData.programName||'暂无填写'}}</span>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span='8'>
                        <el-form-item label='制定人:' prop='drafter' ref='drafter'>
                            <tag-select :disabled='(phaseId!=="TECH_INNOVATION_DEPT_CREATE" && caseType =="editCase")' v-if='isEdit' placeholder="选择人员" style="width:200px;vertical-align: top;" :initDataStr="formData.drafterInitDataStr"
                                :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data,'drafter')}">
                            </tag-select>
                            <span v-else class='viewContent'>{{formData.drafterName||'暂无填写'}}</span>
                        </el-form-item>
                    </el-col> -->
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
                        <el-form-item label='制/修订:' prop='editType'>
                            <el-select :disabled='isDeptPending || (caseType === "editCase" && phaseId ==="OFFICE_LIAISON_HANDLE")' v-if='isEdit' filterable v-model='formData.editType'  clearable>
                                <el-option :value='item.id' :label='item.text' v-for='(item) in editType' :key='item.id'></el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{formData.editTypeName||'暂无填写'}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label='标准编制目的及内容简介:' prop='purposeContent'>
                            <el-input :disabled='isDeptPending' v-if='isEdit' v-model='formData.purposeContent' type='textarea' :rows='4' resize='none' show-word-limit maxlength='500'
                                placeholder='请输入'></el-input>
                            <span v-else class='viewContent'>{{formData.purposeContent}}</span>  
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                     <el-col :span='8'>
                        <el-form-item label='部门:' prop='dept' ref='dept'>
                            <tag-select :disabled='(phaseId!=="TECH_INNOVATION_DEPT_CREATE" && caseType=="editCase")' v-if='isEdit' placeholder="选择机构" style="width:200px;vertical-align: top;" :initDataStr="formData.deptInitDataStr"
                                :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'dept')}">
                            </tag-select>
                            <span v-else class='viewContent'>{{formData.deptName}}</span>  
                        </el-form-item>
                     </el-col>
                     <el-col :span='8'>
                        <el-form-item label='科室:' prop='office' ref='office'>
                            <tag-select  :disabled='((phaseId==="OFFICE_LIAISON_HANDLE" && caseType=="editCase") || isDeptPending)' v-if='isEdit' placeholder="选择机构" style="width:200px;vertical-align: top;" :initDataStr="formData.officeInitDataStr"
                             :initOptions="{selectNum:1,selectType:'Dept',begin_id:beginId}" @callBack="(data)=>{selectRoleDept(data,'office')}">
                            </tag-select>
                            <span v-else class='viewContent'>{{formData.officeName}}</span>  
                        </el-form-item>
                     </el-col>
                     <el-col :span='8'>
                            <el-form-item label='责任人:' prop='responsibleUser' ref='responsibleUser'>
                                <tag-select :disabled='isDeptPending' v-if='isEdit' placeholder="选择人员" style="width:200px;vertical-align: top;" :initDataStr="formData.responsibleUserInitDataStr"
                                    :initOptions="{selectNum:1,selectType:'User',begin_id:liaisonHandleFilterTag?liaisonHandleBeginId:beginId}" @callBack="(data)=>{selectRoleUser(data,'responsibleUser')}">
                                </tag-select>
                                <span v-else class='viewContent'>{{formData.responsibleUserName}}</span>  
                        </el-form-item>
                     </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='初稿完成时间:' prop='draftTime'>
                            <el-date-picker :disabled='isDeptPending' v-if='isEdit' style='width:100%' v-model="formData.draftTime" value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
                            </el-date-picker>
                            <span v-else class='viewContent'>{{formData.draftTime}}</span>            
                        </el-form-item>
                     </el-col>
                     <el-col :span='8'>
                        <el-form-item label='会签完成时间:' prop='countersignTime'>
                            <el-date-picker :disabled='isDeptPending' v-if='isEdit' style='width:100%' v-model="formData.countersignTime" value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
                            </el-date-picker>
                            <span v-else class='viewContent'>{{formData.countersignTime}}</span>            
                        </el-form-item>
                     </el-col>
                     <el-col :span='8'>
                        <el-form-item label='分标委:' prop='subcommittee' ref='subcommittee'> 
                            <div class='selectSubcommittee' @click.stop='selectSubcommittee' v-if='isEdit'>{{formData.subcommitteeName||'请选择'}}</div>     
                            <span class="viewContent" v-else>{{formData.subcommitteeName}}</span>
                        </el-form-item>
                     </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='规划来源:' prop='programSource'>
                            <el-select :disabled='isDeptPending' filterable v-if='isEdit' v-model='formData.programSource' @change='programSourceChange'>
                                <el-option v-for='(item,index) in programSource' :value='item.id' :label='item.text' :key='item.id'></el-option>
                            </el-select>        
                            <span class="viewContent" v-else>{{formData.programSourceName||'暂无填写'}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='16'>
                        <el-form-item label='来源编号:' prop='sourceNumber' v-show='formData.programSource=="zhiliangwenti"'>
                            <el-input v-if='isEdit' :disabled='isDeptPending' placeholder='请输入' readonly @click.native.stop='selectQuality' v-model='formData.sourceNumber'></el-input>
                            <span class="viewContent" v-else>{{formData.sourceNumber}}</span>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span='8'>
                        <el-form-item label='五化领域:' prop='fiveAspectsFieldData'>
                            <el-select filterable v-if='isEdit' v-model='formData.fiveAspectsFieldData' multiple collapse-tags>
                                <el-option v-for='(item,index) in fiveAspectsField' :value='item.id' :label='item.text' :key='item.id'></el-option>
                            </el-select>        
                            <span class="viewContent" v-else>{{restData(formData.fiveAspectsFieldList,'fiveAspectsFieldList')}}</span>
                        </el-form-item>
                    </el-col> -->
                </el-row>
                <el-row>
                    <!-- <el-col :span='8'>
                        <el-form-item label='应用领域:' prop='applicationFieldData'>
                            <el-select filterable v-if='isEdit' v-model='formData.applicationFieldData' multiple collapse-tags>
                                <el-option v-for='(item,index) in applicationField' :value='item.id' :label='item.text' :key='item.id'></el-option>
                            </el-select>        
                            <span class="viewContent" v-else>{{restData(formData.applicationFieldList,'applicationFieldList')}}</span>
                        </el-form-item>
                    </el-col> -->
                    <!-- <el-col :span='8'>
                        <el-form-item label='适用项目:' prop='applicableProjectData'>
                            <el-select filterable v-if='isEdit' v-model='formData.applicableProjectData' multiple collapse-tags>
                                <el-option v-for='(item,index) in applicableProject' :value='item.id' :label='item.text' :key='item.id'></el-option>
                            </el-select>        
                            <span class="viewContent" v-else>{{restData(formData.applicableProjectList,'applicableProjectList')}}</span>
                        </el-form-item>
                    </el-col> -->
                </el-row>
                <!-- <el-row>
                    <el-col :span="24">
                        <el-form-item label="应用车型" prop='applicationCarTypeData'>
                            <el-checkbox-group v-model="formData.applicationCarTypeData" v-if='isEdit'>
                                <el-checkbox :label="item.id" v-for='(item,index) in applicationCarType' :key='item.id'>{{item.text}}</el-checkbox>
                            </el-checkbox-group>
                            <span class="viewContent" v-else>{{restData(formData.applicationCarTypeList,'applicationCarTypeList')}}</span>
                        </el-form-item>
                      </el-col>
                </el-row> -->
                <el-row>    
                    <el-col :span='24'>
                        <el-form-item label='相关文档:'>
                            <upload ref='planUpload' :isEdit='isEdit && !isDeptPending' :showList='true' :multiple="false" :modular="modular" :modularInnerId="planModularInnerId"
                                @fileChange="fileChange" @preView='preView' @fileOnSuccess="fileOnSuccess" accept=''
                                @beforeFileUpload="beforeFileUpload">
                                <el-button slot="uploadBtn" size="medium" class="uploadBtn">
                                    <i class="el-icon-plus"></i> 上传附件</el-button>
                            </upload>
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
    import { getTreeSelectEnabled,planPublishMainUpdate,getItemFetchId,getUserInfoByOrgId,planPublishMainAdd,planPublishMainDeatils } from '../service/service.js'
    import upload from './components/upload.vue'
    import tagSelect from '@/components/orgPick/tagSelect.vue'
    import { mapState } from 'vuex'
    export default {
        name: 'editPlanPage',
        data() {
            return {
                liaisonHandleFilterTag:false,
                isFilterTag:false,
                beginId:'',
                liaisonHandleBeginId:'',
                childrenTypeList:[],//标准类型 子集
                fileList: [],
                modular: 'standardPlanRelease_plan',
                planModularInnerId: '',
                id: "",
                caseType: '',
                phaseId:'',
                formData: {
                    classification:'',
                    type:'',
                    systemCode:'',
                    programNumber:'',
                    programName:'',
                    // drafter:'',
                    year: (new Date().getFullYear())+'',
                    editType:'',
                    purposeContent:'',
                    dept:'',
                    office:'',
                    responsibleUser:'',
                    draftTime:'',
                    countersignTime:'',
                    subcommittee:'',
                    subcommitteeName:'',
                    programSource:'',
                    sourceNumberList:[],
                    sourceNumberItems:[],
                    sourceNumber:'', //只用来展示
                    // fiveAspectsFieldList:[],
                    // fiveAspectsFieldData:[],
                    // applicationFieldList:[],
                    // applicationFieldData:[],
                    // applicableProjectList:[],
                    // applicableProjectData:[],
                    // applicationCarTypeList:[],
                    // applicationCarTypeData:[],
                    // drafterInitDataStr:'',//制定人
                    deptInitDataStr:'',//部门
                    officeInitDataStr:'',//科室
                    responsibleUserInitDataStr:'',//责任人
                    selectId:'',//体系码是否被使用
                },
                rules: {
                    classification: [{ required: true, message: '标准分类为必选项', trigger: 'change' }],
                    type: [{ required: true, message: '标准类型为必选项', trigger: 'change' }],
                    programNumber: [{ required: true, message: '标准编号为必填项', trigger: 'blur' }],
                    systemCode:[{ required: true, message: '体系码为必填项', trigger: 'change' }],
                    // drafter:[{ required: true, message: '制定人为必选项', trigger: 'change' }],
                    // purposeContent:[{ required: true, message: '标准编制目的及内容简介为必填项', trigger: 'blur' }],
                    dept:[{ required: true, message: '部门为必选项', trigger: 'change' }],
                    office:[{ required: true, message: '科室为必选项', trigger: 'change' }],
                    responsibleUser:[{ required: true, message: '责任人为必选项', trigger: 'change' }],
                    draftTime:[{ required: true, message: '初稿完成时间为必选项', trigger: 'change' }],
                    countersignTime:[{ required: true, message: '会签完成时间为必选项', trigger: 'change' }],
                    subcommittee:[{ required: true, message: '分标委为必选项', trigger: 'change' }],
                    editType:[{ required: false, message: '制/修订为必选项', trigger: 'change' }],//在各业务科室联络员编辑必填，其他选填
                },
                loading: false,
            }
        },
        computed: {
            ...mapState(['applicationCarType','editType','standardType','programSource','fiveAspectsField','applicationField','applicableProject']),
            isEdit() {
                return this.caseType !== 'viewCase'
            },
            isDeptPending(){
                //待发布 只能修改标准编号
                return this.phaseId === 'TECH_INNOVATION_DEPT_PENDING';
            }
        },
        components: {
            upload,
            tagSelect
        },
        created() {
            _self = this;
            this.id = this.$route.params.id;
            this.caseType = this.$route.params.caseType;
            this.phaseId = this.$route.params.phaseId;
            this.isFilterTag = (this.caseType === "editCase" && this.phaseId === "DEPT_LIAISON_PROOF");
            if(this.phaseId=='OFFICE_LIAISON_HANDLE'){
                //在各业务科室联络员编辑必填，其他选填
                this.rules.editType[0].required=true;
                if(this.caseType === "editCase"){
                    this.liaisonHandleFilterTag = true;
                }
            }
            if (this.id && this.id != 0) {
                this.getDetailsInfo();
            } else {
                getItemFetchId().then(res => {
                    this.planModularInnerId = res.data;
                })
            }
            this.callAction();
        },
        methods: {
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
            selectSystemCode(){
                if(!["TECH_INNOVATION_DEPT_CREATE","OFFICE_LIAISON_HANDLE"].includes(this.phaseId) || this.caseType === 'editCase'){
                    return
                }
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
                    this.childrenTypeList.forEach(item=>{
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
                console.log(baseParams)
                EcoUtil.getSysvm().openDialog('标准体系树', url,'400', '600', "15vh");
            },
            programSourceChange(val){
                if(this.formData.sourceNumber){
                    this.formData.sourceNumberList = [];
                    this.formData.sourceNumber = '';
                    this.formData.sourceNumberItems = [];
                }
            },
            selectQuality(){
                if(this.isDeptPending){
                    return
                }
                let url ="/standardPlanRelease/index.html#/quality" ;
                EcoUtil.getSysvm().openDialog('来源编号', url,'900', '600', "15vh");
            },
            selectStandardType(val){
                console.log(val,'分类父类change');
                this.formData.type='';
                if(val){
                    getTreeSelectEnabled(val).then(res=>{
                        this.childrenTypeList = res.data;
                    })
                }else{
                    this.childrenTypeList = [];
                }
            },
            callAction() {
                let callBackDialogFunc = function (obj) {
                    if (obj && (obj.action === 'selectSubcommittee')) {
                        _self.formData.subcommitteeName =obj.dataArr.name;
                        _self.formData.subcommittee = obj.dataArr.id;
                        _self.$refs.subcommittee.clearValidate();
                    }else  if (obj && (obj.action === 'selectQuality')) {
                        //来源编号
                        _self.formData.sourceNumberList = obj.data.sourceNumberList;
                        _self.formData.sourceNumber = obj.data.sourceNumberList.join('、');
                        _self.formData.sourceNumberItems = obj.data.sourceNumberItems;
                    }else if(obj && (obj.action === 'selectSystemCode')){
                        _self.formData.systemCode = obj.data.code; 
                        if(obj.data.matchType && !_self.formData.classification){
                            _self.formData.classification = obj.data.matchType;
                            getTreeSelectEnabled(obj.data.matchType).then(res2=>{
                                _self.childrenTypeList = res2.data;
                                if(obj.data.matchSubType){
                                    _self.formData.type =  obj.data.matchSubType;
                                }
                            })
                        }
                        _self.formData.selectId = obj.data.selectId;
                        _self.$refs.systemCodeFormItem.clearValidate()
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'editPlanPage');
            },
            selectSubcommittee(){
                if(this.isDeptPending){
                    return
                }
                var url = '/standardPlanRelease/index.html#/subcommitteeList/'+true+'?action='+'selectSubcommittee'
                EcoUtil.getSysvm().openDialog('分标委', url, 1000, 600, '15vh');
            },
            restData(data,type){
                var str ='';
                if(type==='fiveAspectsFieldList' || type=='applicationFieldList' || type==='applicableProjectList' || type ==='applicationCarTypeList'){
                    let arr = data.map(item=>{
                        return item.dataIdName
                    })
                    str=arr.join('、')   
                }
                return str;
            },
            preView(item) {
                EcoFile.openFileHeaderByView(item.id, item.name);
            },
            selectRoleDept(data,type) {
                //责任部门
                if (!data.id && data.itemArray.length === 0) {
                    if(type==='dept'){
                        this.formData.deptInitDataStr = '';
                        this.formData.dept = '';
                        this.$refs.editPlanForm.validateField('dept'); //必填验证
                    }else if(type==='office'){
                        this.formData.officeInitDataStr = '';
                        this.formData.office = '';
                        this.$refs.editPlanForm.validateField('office'); 
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
            selectRoleUser(data,type) {
                //选择人
                if (!data.id && data.itemArray.length === 0) {
                    //人员删除
                    if(type==='drafter'){
                        // this.formData.drafter = '';
                        // this.formData.drafterInitDataStr = '';
                        // this.$refs.editPlanForm.validateField('drafter');
                    }else if(type === 'responsibleUser'){
                        this.formData.responsibleUser='';
                        this.formData.responsibleUserInitDataStr = '';
                        this.$refs.editPlanForm.validateField('responsibleUser');
                    }
                 
                } else {
                   if(type==='drafter'){
                    //   this.formData.drafter = data.itemArray[0].linkId;
                    //   this.$refs.drafter.clearValidate();
                   }else if(type === 'responsibleUser'){
                      this.formData.responsibleUser= data.itemArray[0].linkId;
                      this.$refs.responsibleUser.clearValidate();
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
                  
                }
            },
            beforeFileUpload(file, callback) {
                callback(true);
            },
            fileOnSuccess(response) {

            },
            fileChange(file, fileList) {
                this.fileList = fileList;
            },
            getInfo(resId,name){
                getUserInfoByOrgId(resId).then(response => {
                    this.$set(this.formData, (name+'InitDataStr'), `{"type":"PERSONNEL","orgId":"${response.data.departments[0].id}.${response.data.id}","linkId":"${response.data.id}"}`);
                    this.$set(this.formData, (name+'Name'), response.data.mi);
                })  
            },
            initList(dataList,name){
                let arr = dataList.map(item=>{
                    return item.dataId;
                })
                this.$set(this.formData,name+'Data',arr);
            },
            getDetailsInfo() {
                this.loading = true;
                planPublishMainDeatils(this.id).then(res => {
                    getTreeSelectEnabled(res.data.data.classification).then(res2=>{
                        this.childrenTypeList = res2.data;
                        if(res.data.data.sourceNumberList){
                            res.data.data.sourceNumber = this.restSourceNumberList(res.data.data.sourceNumberList);
                        } 
                        res.data.data.year = res.data.data.year+'';
                         // res.data.data.fiveAspectsFieldList = res.data.data.fiveAspectsFieldList ||[];
                        // res.data.data.applicationFieldList = res.data.data.applicationFieldList ||[];
                        // res.data.data.applicableProjectList = res.data.data.applicableProjectList ||[];
                        // res.data.data.applicationCarTypeList = res.data.data.applicationCarTypeList ||[];
                        if(this.isFilterTag){
                            this.beginId= res.data.data.dept;
                        }
                        if(this.liaisonHandleFilterTag){
                            this.liaisonHandleBeginId = res.data.data.office;
                        }
                        this.formData = res.data.data;
                        // this.$set(this.formData, 'drafterInitDataStr', '');
                        this.$set(this.formData, 'responsibleUserInitDataStr', '');
                        this.$set(this.formData, 'deptInitDataStr', `{"type":"DEPT","orgId":"${res.data.data.dept}","linkId":"${res.data.data.dept}"}`);
                        this.$set(this.formData, 'officeInitDataStr',  `{"type":"DEPT","orgId":"${res.data.data.office}","linkId":"${res.data.data.office}"}`);
                        // this.initList(res.data.data.fiveAspectsFieldList,'fiveAspectsField');
                        // this.initList(res.data.data.applicationFieldList,'applicationField');
                        // this.initList(res.data.data.applicableProjectList,'applicableProject');
                        // this.initList(res.data.data.applicationCarTypeList,'applicationCarType');
                        this.planModularInnerId = res.data.data.id;
                        // this.getInfo(res.data.data.drafter,'drafter');
                        this.getInfo(res.data.data.responsibleUser,'responsibleUser');
                        this.loading = false;
                    })
                })
            },
            onCancel() {
                EcoUtil.getSysvm().closeDialog();
            },
            onSubmit() {
                this.$refs.editPlanForm.validate((valid) => {
                    if (valid) {
                            this.loading = true;
                            let params = {
                                phaseId:this.phaseId,
                                classification:this.formData.classification,
                                type:this.formData.type,
                                // systemCode:this.formData.systemCode,
                                programNumber:this.formData.programNumber,
                                programName:this.formData.programName,
                                // drafter:this.formData.drafter,
                                year: this.formData.year,
                                editType:this.formData.editType,
                                purposeContent:this.formData.purposeContent,
                                dept:this.formData.dept,
                                office:this.formData.office,
                                responsibleUser:this.formData.responsibleUser,
                                draftTime:this.formData.draftTime,
                                countersignTime:this.formData.countersignTime,
                                subcommittee:this.formData.subcommittee,
                                programSource:this.formData.programSource,
                                sourceNumberItems:this.formData.sourceNumberItems,
                                // sourceNumberList:this.formData.sourceNumberList,
                                // fiveAspectsFieldList:this.formData.fiveAspectsFieldData,
                                // applicationFieldList:this.formData.applicationFieldData,
                                // applicableProjectList:this.formData.applicableProjectData,
                                // applicationCarTypeList:this.formData.applicationCarTypeData
                            }
                            if (this.caseType === 'editCase') {
                                params.id = this.id;
                                params.systemCode=this.formData.systemCode;
                                planPublishMainUpdate(params).then(res=>{
                                    this.loading = false;
                                    let doObj = {};
                                    doObj.action = 'editPlan';
                                    doObj.data = {};
                                    doObj.close = true;
                                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
                                }).catch(err=>{
                                    this.loading = false;
                                })
                            } else if (this.caseType === 'addCase') {
                                params.id = this.planModularInnerId;
                                params.systemCodeItem = this.formData.selectId;
                                planPublishMainAdd(params).then(res => {
                                    this.loading = false;
                                    let doObj = {}
                                    doObj.action = 'addPlan';
                                    doObj.data = {};
                                    doObj.close = true;
                                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
                                }).catch(err => {
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
    .editPlanPage {
        background: #fff;
        height: 100%;
    }

    .editPlanPage .btn {
        text-align: center;
        padding: 10px;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #ddd;
    }

    .editPlanPage .addForm {
        overflow: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 60px;
        padding: 0 10px;
    }

    .editPlanPage .addForm .el-input,
    .editPlanPage .addForm .el-select {
        width: 200px;
    }

    .viewContent {
        color: #606266;
    }

    .editPlanPage .tableRow {
        text-align: right;
    }

    .editPlanPage .tableRow span {
        margin-right: 2px;
        font-size: 14px;
        color: #0f1419;
    }

    .editPlanPage .uploadBtn {
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
    .editPlanPage .selectSubcommittee{
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
    }
</style>
