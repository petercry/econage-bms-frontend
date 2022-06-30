<template>
    <div class='editRegulationStructured'>
        <div class='addForm'>
            <el-form :model='formData' ref='regulatoryForm' :rules='rules' v-loading='loading' label-position='right' label-width='130px'>
                <div class='rowTitle'>法规信息</div>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='分类:' prop='category'>
                            <el-select filterable v-if='isEdit' v-model='formData.category'>
                                <el-option v-show='item.enableInCreate' v-for='(item,index) in typeList' :value='item.id' :label='item.text' :key='item.id'></el-option>
                            </el-select>
                            <span class="viewContent" v-else>{{restData(formData.category,'category')}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label='子类:' prop='subCategory'>
                            <el-select filterable v-if='isEdit' v-model='formData.subCategory'>
                                <el-option v-for='(item,index) in subClassListGroup' :value='item.id' :label='item.text' :key='item.id'></el-option>
                            </el-select>
                            <span class="viewContent" v-else>{{restData(formData.subCategory,'subCategory')}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='法规编号:' prop='regulationCode'>
                            <!-- <el-input v-if='isEdit'  placeholder='请选择' v-model='formData.regulationCode' :disabled='this.caseType=="editCase"'></el-input> -->
                            <div class='selectRegulationCode' @click.stop='selectRegulationCode' v-if='isEdit'>{{formData.regulationCode||'请选择'}}</div>
                            <span class="viewContent" v-else>{{formData.regulationCode}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label='法规名称:' prop='regulationName'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.regulationName'></el-input>
                            <span class="viewContent" v-else>{{formData.regulationName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='标准简介:' prop='introduction'>
                            <el-input v-if='isEdit' v-model='formData.introduction' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000'
                                placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.introduction||'暂无填写'}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style='margin-bottom:18px;'>
                    <el-col :span='3' class='tableRow'>
                        <span>实施时间:</span>
                    </el-col>
                    <el-col :span='20' style='padding-left:15px;box-sizing:border-box;'>
                        <el-table :data='infoList' border :header-cell-style="{background:'#f5f7fa',color:'#000',textAlign:'center'}" :cell-style="{textAlign:'center'}">
                            <el-table-column label='序号' type='index' width='50'></el-table-column>
                            <el-table-column prop='nt' label='NT' width='150'>
                                <template slot-scope='scope'>
                                    <el-date-picker v-if='isEdit' style='width:100%' v-model="scope.row.nt" value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
                                    </el-date-picker>
                                    <span class="viewContent" v-else>{{scope.row.nt}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop='ntComment' label='NT备注' width='200'>
                                <template slot-scope='scope'>
                                    <el-input v-if='isEdit' v-model='scope.row.ntComment' placeholder='请输入' style='width:100%'></el-input>
                                    <span class="viewContent" v-else>{{scope.row.ntComment}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop='tt' label='TT' width='150'>
                                <template slot-scope='scope'>
                                    <el-date-picker v-if='isEdit' style='width:100%' v-model="scope.row.tt" value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
                                    </el-date-picker>
                                    <span class="viewContent" v-else>{{scope.row.tt}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop='ttComment' label='TT备注'>
                                <template slot-scope='scope'>
                                    <el-input v-if='isEdit' v-model='scope.row.ttComment' placeholder='请输入' style='width:100%'></el-input>
                                    <span class="viewContent" v-else>{{scope.row.ttComment}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label='操作' v-if='isEdit' fixed='right'>
                                <template slot-scope='scope'>
                                    <el-button @click.native.prevent="delRowItem(scope.$index,'infoList')" type="text" size="small">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div v-if='isEdit' class='caseBtn' @click='addRowItem("infoList")'>
                            <span>
                                <i class='el-icon-plus'></i>添加</span>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='法规状态:' prop='standardStatus'>
                            <el-select filterable v-if='isEdit' v-model='formData.standardStatus' clearable>
                                <el-option :value='item.id' :label='item.text' v-for='(item,index) in standardState' :key='item.id'></el-option>
                            </el-select>
                            <span v-else class="viewContent">{{restData(formData.standardStatus,'standardStatus')}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label='性质:' prop='nature'>
                            <el-select filterable v-if='isEdit' v-model='formData.nature' clearable>
                                <el-option :value='item.id' :label='item.text' v-for='(item,index) in natureList' :key='item.id'></el-option>
                            </el-select>
                            <span v-else class="viewContent">{{restData(formData.nature,'nature')}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='适用整车/零部件:' prop='applicableType'>
                            <el-select filterable v-if='isEdit' v-model='formData.applicableType' style='width:200px;' clearable>
                                <el-option :value='item.id' :label='item.text' v-for='(item,index) in vehicleList' :key='item.id'></el-option>
                            </el-select>
                            <span v-else class="viewContent">{{restData(formData.applicableType,'applicableType')}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label='代替法规:' prop='substituteCode'>
                            <div class='selectRegulationCode' @click.stop='selectSubstituteCode' v-if='isEdit'>{{formData.substituteCode||'请选择'}}</div>
                            <span class="viewContent" v-else>{{formData.substituteCode}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='认证管理分类:' prop='certificationTypeItems'>
                            <el-checkbox-group v-model="formData.certificationTypeItems" v-if='isEdit'>
                                <el-checkbox :label="item.id" v-for='(item,index) in authenticationList' :key='item.id'>{{item.text}}</el-checkbox>
                            </el-checkbox-group>
                            <span v-else class="viewContent">{{restData(formData.certificationTypeItems,'certificationTypeItems')}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='适用车型:' prop='carModelItems'>
                            <el-checkbox-group v-model="formData.carModelItems" v-if='isEdit'>
                                <el-checkbox :label="item.id" v-for='(item,index) in applicableModels' :key='item.id'>{{item.text}}</el-checkbox>
                            </el-checkbox-group>
                            <span v-else class="viewContent">{{restData(formData.carModelItems,'carModelItems')}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='动力类型:' prop='powerTypeItems'>
                            <el-checkbox-group v-model="formData.powerTypeItems" v-if='isEdit'>
                                <el-checkbox :label="item.id" v-for='(item,index) in powerType' :key='item.id'>{{item.text}}</el-checkbox>
                            </el-checkbox-group>
                            <span v-else class="viewContent">{{restData(formData.powerTypeItems,'powerTypeItems')}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='气体燃料专用:' prop='gasFuelItems'>
                            <el-checkbox-group v-model="formData.gasFuelItems" v-if='isEdit'>
                                <el-checkbox :label="item.id" v-for='(item,index) in gasList' :key='item.id'>{{item.text}}</el-checkbox>
                            </el-checkbox-group>
                            <span v-else class="viewContent">{{restData(formData.gasFuelItems,'gasFuelItems')}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='法规引用:' prop='regulatoryReferences'>
                            <el-input v-if='isEdit' v-model='formData.regulatoryReferences' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000'
                                placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.regulatoryReferences||'暂无填写'}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='标准文档:'>
                            <upload :isEdit='isEdit' ref='upload1' :showList='true' :multiple="false" :modular="modular" :modularInnerId="structurebaseModularInnerId"
                                @fileChange="fileChange" @preView='preView' @fileOnSuccess="fileOnSuccess" accept=''
                                @beforeFileUpload="beforeFileUpload">
                                <el-button slot="uploadBtn" size="medium" class="uploadBtn">
                                    <i class="el-icon-plus"></i> 上传附件</el-button>
                            </upload>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='相关文件:'>
                            <upload :isEdit='isEdit'  ref='upload2'  :showList='true' :multiple="false" :modular="modular2" :modularInnerId="structurebaseModularInnerId"
                                @preView='preView' @fileChange="fileChange2" @fileOnSuccess="fileOnSuccess" accept=''
                                @beforeFileUpload="beforeFileUpload">
                                <el-button slot="uploadBtn" size="medium" class="uploadBtn">
                                    <i class="el-icon-plus"></i> 上传附件</el-button>
                            </upload>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='关联产品技术路线:' prop='technicalRoute'>
                            <el-input v-if='isEdit' v-model='formData.technicalRoute' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000'
                                placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.technicalRoute||'暂无填写'}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='技术路线:'>
                            <upload :isEdit='isEdit'  :showList='true' :multiple="false" :modular="modular3" :modularInnerId="structurebaseModularInnerId"
                                @preView='preView' @fileChange="fileChange3" @fileOnSuccess="fileOnSuccess" accept=''
                                @beforeFileUpload="beforeFileUpload">
                                <el-button slot="uploadBtn" size="medium" class="uploadBtn">
                                    <i class="el-icon-plus"></i> 上传附件</el-button>
                            </upload>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class='rowTitle'>法规政策起草单位信息</div>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='跟踪方式:' prop='trackMethod'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.trackMethod'></el-input>
                            <span v-else class="viewContent">{{formData.trackMethod||'暂无填写'}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label='跟踪频率:' prop='trackFrequency'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.trackFrequency'></el-input>
                            <span v-else class="viewContent">{{formData.trackFrequency||'暂无填写'}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='联系人:' prop='contactPerson'>
                            <!-- <tag-select v-if='isEdit' placeholder="选择人员" style="width:200px;vertical-align: top;" :initDataStr="formData.initDataStr"
                                :initOptions="{selectNum:1,selectType:'User'}" @callBack="selectRoleUser">
                            </tag-select>
                            <span v-else class='viewContent'>{{formData.contactPersonName||'暂无填写'}}</span> -->
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.contactPerson'></el-input>
                            <span v-else class='viewContent'>{{formData.contactPerson||'暂无填写'}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label='联系人单位:' ref='selectDept' prop='contactUnit'>
                            <!-- <tag-select v-if='isEdit' placeholder="选择机构" style="width:200px;vertical-align: top;" :initDataStr="formData.deptInitDataStr"
                                :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="selectRoleDept">
                            </tag-select>
                            <span v-else class='viewContent'>{{formData.contactUnitName||'暂无填写'}}</span> -->

                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.contactUnit'></el-input>
                            <span v-else class='viewContent'>{{formData.contactUnit||'暂无填写'}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='联系方式:' prop='contactDetails'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.contactDetails'></el-input>
                            <span v-else class='viewContent'>{{formData.contactDetails||'暂无填写'}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class='rowTitle'>RP-CFT</div>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='法规负责人:' prop='regulationLeader' ref='selectRegulation'>
                            <tag-select v-if='isEdit' placeholder="选择人员" style="width:200px;vertical-align: top;" :initDataStr="formData.regulationLeaderInitDataStr"
                                :initOptions="{selectNum:1,selectType:'User'}" @callBack="selectRegulationLeader">
                            </tag-select>
                            <span v-else class='viewContent'>{{formData.regulationLeaderName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23' style='padding-left:50px;box-sizing: border-box;'>
                        <el-table :data='infoListTwo' border :header-cell-style="{background:'#f5f7fa',color:'#000',textAlign:'center'}" :cell-style="{textAlign:'center'}">
                            <el-table-column prop='deptInitDataStr' label='部门' width='160'>
                                <template slot-scope='scope'>
                                    <tag-select :disabled='!isEdit' placeholder="选择部门" style="width:100%;vertical-align: top;" :initDataStr="scope.row.deptInitDataStr"
                                        :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>selectRow(data,scope.$index,'dept')">
                                    </tag-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop='contactInitDataStr' label='应对小组成员/联系人'>
                                <template slot-scope='scope'>
                                    <tag-select :disabled='!isEdit' placeholder="选择人员" style="width:100%;vertical-align: top;" :initDataStr="scope.row.contactInitDataStr"
                                        :initOptions="{selectNum:2,selectType:'User'}" @callBack="(data)=>selectRow(data,scope.$index,'contact')">
                                    </tag-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop='ccInitDataStr' label='抄送人员'>
                                <template slot-scope='scope'>
                                    <tag-select :disabled='!isEdit' placeholder="选择人员" style="width:100%;vertical-align: top;" :initDataStr="scope.row.ccInitDataStr"
                                        :initOptions="{selectNum:2,selectType:'User'}" @callBack="(data)=>selectRow(data,scope.$index,'cc')">
                                    </tag-select>
                                </template>
                            </el-table-column>
                            <el-table-column label='操作' v-if='isEdit' width='100'>
                                <template slot-scope='scope'>
                                    <el-button @click.native.prevent="delRowItem(scope.$index,'infoListTwo')" type="text" size="small">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div v-if='isEdit' class='caseBtn' @click='addRowItem("infoListTwo")'>
                            <span>
                                <i class='el-icon-plus'></i>添加</span>
                        </div>
                    </el-col>
                </el-row>
                <div class='rowTitle mT2' v-if='((fromPage==="approveList" && formData.approveStatus==="PENDING") || fromPage==="organizationList") && !isEdit'>审批意见</div>
                <el-row class="mT2" v-if='((fromPage==="approveList" && formData.approveStatus==="PENDING") || fromPage==="organizationList") && !isEdit'>
                    <el-col :span='23'>
                        <el-form-item  label='' prop='content' class="is-required">
                            <el-input :disabled="fromPage==='organizationList'" v-model='formData.content' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000' placeholder='请输入'></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>
<script>
    var _self;
    import { EcoUtil } from '@/components/util/main.js'
    import { EcoFile } from '@/components/file/main.js'
    import { structurebaseWithdraw,structurebaseApprove,supportFile,regulationtrackSelectSingle,structurebaseApplyModify,getOrgsMemberByIds, getItemFetchId, structurebaseAdd, getUserInfoByOrgId, structurebaseSingle, structurebaseUpdate } from '../service/service.js'
    import upload from './components/upload.vue'
    import tagSelect from '@/components/orgPick/tagSelect.vue'
    import { mapState } from 'vuex'
    import { EcoMessageBox } from "@/components/messageBox/main.js";
    export default {
        name: 'EditRegulationStructured',
        data() {
            var validatePhone = (rule, value, callback) => {
                //电话
                if (!rule.required || /(^\d{3}-\d{7,8}$)|(^\d{4}-\d{7,8}$)/.test(value) || /^1[3-9]\d{9}$/.test(value)) {
                    callback();
                } else {
                    callback(new Error('联系电话格式不正确'));
                }
            }
            return {
                fileList: [],
                fileList2: [],
                fileList3:[],
                modular: 'structurebase_regulatory_documents',
                modular2: 'structurebase_related_documents',
                modular3: 'structurebase_techonlogy_documents',
                structurebaseModularInnerId: '',
                infoList: [],
                infoListTwo: [],
                formData: {
                    regulationKey:'', //关联法规跟踪表的key
                    category: '',
                    subCategory: '',
                    regulationCode: '',
                    substituteCode:'',//代替法规
                    substituteKey:'',//代替key
                    regulationName: '',
                    introduction: '',
                    standardStatus: '',
                    nature: '',
                    applicableType: '',
                    trackMethod: '',
                    trackFrequency: '',
                    contactPerson: '',
                    contactUnit: '',
                    contactDetails: '',
                    regulationLeader: '',
                    rpList: [],
                    certificationTypeItems: [],
                    carModelItems: [],
                    powerTypeItems: [],
                    gasFuelItems: [],
                    initDataStr: '',
                    deptInitDataStr: '',
                    regulationLeaderInitDataStr: '',
                    regulatoryReferences:'',
                    technicalRoute:'',
                    content:''
                },
                rules: {
                    category: [{ required: true, message: '分类为必选项', trigger: 'change' }],
                    subCategory: [{ required: true, message: '分类为必选项', trigger: 'change' }],
                    regulationCode: [{ required: true, message: '法规编号为必填项', trigger: 'change' }],
                    // substituteCode:[{ required: true, message: '代替法规编号为必填项', trigger: 'change' }],
                    regulationName: [{ required: true, message: '法规名称为必填项', trigger: 'blur' }],
                    standardStatus: [{ required: true, message: '法规状态为必选项', trigger: 'change' }],
                    nature: [{ required: true, message: '性质为必选项', trigger: 'change' }],
                    applicableType: [{ required: true, message: '适用整车/零部件为必选项', trigger: 'change' }],
                    certificationTypeItems: [{ required: true, message: '认证管理分类为必选项', trigger: 'change' }],
                    carModelItems: [{ required: true, message: '适用车型为必选项', trigger: 'change' }],
                    // powerTypeItems: [{ required: true, message: '动力类型为必选项', trigger: 'change' }],
                    // gasFuelItems: [{ required: true, message: '气体燃料为必选项', trigger: 'change' }],
                    regulationLeader: [{ required: true, message: '法规责任人为必选项', trigger: 'blur' }],
                    contactDetails: [{ required: false, validator: validatePhone, trigger: 'blur' }]
                },
                loading: false,
            }
        },
        props:{
            id:{
                type:String,
                default:'0'
            },
            caseType:{
                type:String,
                default:''
            },
            fromPage:{
                type:String,
                default:''
            }
        },
        computed: {
            ...mapState(['gasList', 'typeList', 'subClassList', 'natureList', 'vehicleList', 'authenticationList', 'applicableModels', 'powerType', 'standardState']),
            isEdit() {
                return this.caseType !== 'viewCase'
            },
            subClassListGroup(){
                let data = [];
                if(this.formData.category){
                    data = this.subClassList[this.formData.category];
                }
                if(this.caseType==='addCase'){
                    // this.formData.subCategory='';
                }

                return data;
            }
        },
        components: {
            upload,
            tagSelect
        },
        created() {
            this.init();
        },
        methods: {
            appropeCase(type){
                if(!this.formData.content){
                    return EcoMessageBox.alert('请填写审批意见!', '提示');
                }
                this.loading = true;
                if(type){
                    //同意
                    structurebaseApprove(this.id,this.formData.content).then(res=>{
                        this.loading = false;
                        let doObj = {};
                        doObj.action = 'onlyApprove';
                        doObj.data = {};
                        doObj.close = true;
                        this.$emit('callActionDraw',doObj) 
                    })
                }else{
                    //退回
                    structurebaseWithdraw({
                        id: this.id,
                        content: this.formData.content
                    }).then(res=>{
                        this.loading = false;
                        let doObj = {};
                        doObj.action = 'onlyWithdraw';
                        doObj.data = {};
                        doObj.close = true;
                        this.$emit('callActionDraw',doObj)
                    })
                }
                
            },
            init(){
                _self = this;
                if (this.id && this.id != 0) {
                    this.getDetailsInfo();
                } else {
                    getItemFetchId().then(res => {
                        this.structurebaseModularInnerId = res.data;
                    })
                }
                // if(this.caseType==='addCase'){

                // }
                this.callAction2();
            },
            callAction2() {
                let callBackDialogFunc = function (obj) {
                    //选择法规编号
                    if (obj && (obj.action === 'selectRegulationCode')) {
                        //复制附件
                        var modular= 'regulatory_documents';
                        var modular2= 'related_documents';
                        supportFile({
                            innerIdFrom:obj.data.id,
                            modularFrom:modular,
                            innerIdTo:_self.structurebaseModularInnerId,
                            modularTo:_self.modular
                        }).then(res=>{
                            _self.$refs.upload1.initFile();//刷新组件
                        })
                        supportFile({
                            innerIdFrom:obj.data.id,
                            modularFrom:modular2,
                            innerIdTo:_self.structurebaseModularInnerId,
                            modularTo:_self.modular2
                        }).then(res=>{
                            _self.$refs.upload2.initFile();//刷新组件
                        })
                        _self.formData.regulationCode = obj.data.regulationCode;
                        _self.formData.category = obj.data.category;
                        _self.formData.subCategory = obj.data.subCategory;
                        _self.formData.regulationName = obj.data.regulationName;
                        _self.formData.introduction = obj.data.introduction||'';
                        _self.formData.standardStatus = obj.data.standardStatus;
                        _self.formData.nature = obj.data.nature;
                        _self.formData.applicableType = obj.data.applicableType;
                        regulationtrackSelectSingle(obj.data.id).then(res=>{
                               _self.formData.rpList = res.data.rpList||[];
                               _self.formData.regulationLeader = res.data.regulationLeader;
                               _self.formData.contactPerson = res.data.contactPerson;
                               _self.formData.contactUnit = res.data.contactUnit;
                               _self.initUserOrDeptSelect(res);
                               _self.initInfoListTwo();
                               _self.infoList = res.data.implTimeList;
                               _self.formData.certificationTypeItems = res.data.certificationTypeItems||[];
                               _self.formData.carModelItems = res.data.carModelItems||[];
                               _self.formData.powerTypeItems = res.data.powerTypeItems||[];
                               _self.formData.gasFuelItems = res.data.gasFuelItems||[];
                               _self.formData.trackMethod = res.data.trackMethod;
                               _self.formData.trackFrequency = res.data.trackFrequency;
                               _self.formData.contactDetails = res.data.contactDetails;
                               _self.formData.regulationKey = res.data.key;
                        })
                    }else if(obj && (obj.action === 'selectSubstituteCode')){
                        _self.formData.substituteCode = obj.dataObj.regulationCode;
                        _self.formData.substituteKey =   obj.dataObj.key;
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc, this.fromPage+'Edit');
            },
            selectRegulationCode(){
                if(this.caseType==='addCase'){
                   var url = '/regulationStructured/index.html#/regulatoryFormList'
                   EcoUtil.getSysvm().openDialog('法规跟踪表', url, 1000, 600, '15vh');
                }
            },
            selectSubstituteCode(){
                var url = '/regulationStructured/index.html#/finishList/true'
                EcoUtil.getSysvm().openDialog('选择代替法规', url, 1200, 700, '15vh');
            },
            preView(item) {
                EcoFile.openFileHeaderByView(item.id, item.name);
            },
            initInfoListTwo() {
                let arr = [];
                if (this.formData.rpList) {
                    this.formData.rpList.forEach(item => {
                        var ccInitDataStr = '';
                        var contactInitDataStr = '';
                        var obj = {
                            department: item.department,
                            deptInitDataStr: `{"type":"DEPT","orgId":"${item.department}","linkId":"${item.department}"}`,
                            contactList: item.contactList || [],
                            ccList: item.ccList || [],
                        }
                        obj.contactList.forEach((item2, index2) => {
                            if (index2 == 0) {
                                contactInitDataStr = `{"type":"${item2.type}","orgId":"${item2.orgId}","linkId":"${item2.linkId}"}`;
                            } else {
                                contactInitDataStr += `|{"type":"${item2.type}","orgId":"${item2.orgId}","linkId":"${item2.linkId}"}`;
                            }
                        })
                        obj.ccList.forEach((item2, index2) => {
                            if (index2 == 0) {
                                ccInitDataStr = `{"type":"${item2.type}","orgId":"${item2.orgId}","linkId":"${item2.linkId}"}`;
                            } else {
                                ccInitDataStr += `|{"type":"${item2.type}","orgId":"${item2.orgId}","linkId":"${item2.linkId}"}`;
                            }
                        })
                        if (!item.department) {
                            obj.department = '';
                            obj.deptInitDataStr = '';
                        }
                        obj.contactInitDataStr = contactInitDataStr;
                        obj.ccInitDataStr = ccInitDataStr;
                        arr.push(obj);
                    })
                }
                this.infoListTwo = arr;
            },
            selectRow(data, index, type) {
                if (!data.id && data.itemArray.length === 0) {
                    //删除
                    if (type === 'dept') {
                        this.infoListTwo[index].deptInitDataStr = '';
                        this.infoListTwo[index].department = '';
                    } else if (type === 'contact') {
                        this.infoListTwo[index].contactInitDataStr = '';
                        this.infoListTwo[index].contactList = [];
                    } else if (type === 'cc') {
                        this.infoListTwo[index].ccInitDataStr = '';
                        this.infoListTwo[index].ccList = [];
                    }
                } else {
                    if (type === 'dept') {
                        this.infoListTwo[index].department = data.orgId;
                    } else if (type === 'contact') {
                        this.infoListTwo[index].contactList = data.itemArray;
                    } else if (type === 'cc') {
                        this.infoListTwo[index].ccList = data.itemArray;
                    }
                }
            },
            selectRegulationLeader(data) {
                //责任人
                if (!data.id && data.itemArray.length === 0) {
                    //人员删除
                    this.formData.regulationLeader = '';
                    this.formData.regulationLeaderInitDataStr = '';
                    this.$refs.regulatoryForm.validateField('regulationLeader');
                } else {
                    this.formData.regulationLeader = data.itemArray[0].linkId;
                    this.$refs.selectRegulation.clearValidate();
                }
            },
            selectRoleDept(data) {
                //责任部门
                if (!data.id && data.itemArray.length === 0) {
                    this.formData.deptInitDataStr = '';
                    this.formData.contactUnit = '';
                    // this.$refs.regulatoryForm.validateField('contactUnit'); //必填验证
                } else {
                    this.formData.contactUnit = data.orgId;
                    // this.$refs.selectDept.clearValidate();
                }
            },
            selectRoleUser(data) {
                //责任人
                if (!data.id && data.itemArray.length === 0) {
                    //人员删除
                    this.formData.contactPerson = '';
                    this.formData.initDataStr = '';
                } else {
                    this.formData.contactPerson = data.itemArray[0].linkId;
                    //联系单位和联系方式联动
                    if (this.formData.contactDetails && this.formData.contactUnit) {
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
                        if (!this.formData.contactUnit) {
                            //如果没单位就给部门
                            if (res.data.departments[len].orgPathDeptList) {
                                this.formData.contactUnit = res.data.departments[len].orgPathDeptList[0].id; //单位
                            } else {
                                this.formData.contactUnit = res.data.departments[len].id;//部门
                            }
                            this.formData.deptInitDataStr = `{"type":"DEPT","orgId":"${this.formData.contactUnit}","linkId":"${this.formData.contactUnit}"}`;
                        }
                        if (!this.formData.contactDetails) {
                            this.formData.contactDetails = res.data.mobilePhone;//联系方式
                        }
                    })
                }
            },
            beforeFileUpload(file, callback) {
                // var testmsg = (file.name.substring(file.name.lastIndexOf('.') + 1)).toLocaleLowerCase();
                // // const isLt2M = file.size/1024/1024<6
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
                // // if(!isLt2M){
                // //     this.$message({
                // //         message: '上传文件不能超过6MB!',
                // //         type: 'warning',
                // //         customClass: 'message',
                // //         offset: 160
                // //     })
                // // }
                // callback((extension || extension2 || extension3 || extension4 || extension5 || extension6 || extension7 || extension8));
                callback(true);
            },
            fileOnSuccess(response) {

            },
            fileChange(file, fileList) {
                this.fileList = fileList;
            },
            fileChange2(file, fileList) {
                this.fileList2 = fileList;
            },
            fileChange3(file, fileList) {
                this.fileList3 = fileList;
            },
            initUserOrDeptSelect(res){
                //选人或选组织初始化
                this.$set(this.formData, 'deptInitDataStr', '');
                this.$set(this.formData, 'initDataStr', '');
                // this.$set(this.formData, 'contactPersonName', '');
                // this.$set(this.formData, 'contactUnitName', '');
                this.$set(this.formData, 'regulationLeaderInitDataStr', '');
                this.$set(this.formData, 'regulationLeaderName', '');
                // if (res.data.contactPerson) {
                //     getUserInfoByOrgId(res.data.contactPerson).then(response => {
                //             //联系人
                //             // this.formData.initDataStr = `{"type":"PERSONNEL","orgId":"${response.data.departments[0].id}.${response.data.id}","linkId":"${response.data.id}"}`;
                //             // this.formData.contactPersonName = response.data.mi;
                //             this.$set(this.formData, 'initDataStr', `{"type":"PERSONNEL","orgId":"${response.data.departments[0].id}.${response.data.id}","linkId":"${response.data.id}"}`);
                //             this.$set(this.formData, 'contactPersonName', response.data.mi)
                //         })
                // }
                // if (res.data.contactUnit) {
                //     getOrgsMemberByIds([{ type: "DEPT", orgId: res.data.contactUnit, linkId: res.data.contactUnit }]).then(response => {
                //             // this.formData.contactUnitName = response.data[0];
                //             this.$set(this.formData, 'contactUnitName', response.data[0])
                //     })
                //     this.formData.deptInitDataStr = `{"type":"DEPT","orgId":"${res.data.contactUnit}","linkId":"${res.data.contactUnit}"}`;
                // }
                getUserInfoByOrgId(res.data.regulationLeader).then(response => {
                    // this.formData.regulationLeaderInitDataStr = `{"type":"PERSONNEL","orgId":"${response.data.departments[0].id}.${response.data.id}","linkId":"${response.data.id}"}`;
                    // this.formData.regulationLeaderName = response.data.mi;
                    this.$set(this.formData, 'regulationLeaderInitDataStr', `{"type":"PERSONNEL","orgId":"${response.data.departments[0].id}.${response.data.id}","linkId":"${response.data.id}"}`);
                    this.$set(this.formData, 'regulationLeaderName', response.data.mi);
                })
            },
            getDetailsInfo() {
                this.loading = true;
                structurebaseSingle(this.id,this.fromPage,this.isEdit).then(res => {
                    res.data.carModelItems = res.data.carModelItems||[];
                    res.data.certificationTypeItems = res.data.certificationTypeItems||[];
                    res.data.powerTypeItems = res.data.powerTypeItems||[];
                    res.data.gasFuelItems = res.data.gasFuelItems||[];
                    this.formData = res.data;
                    this.initUserOrDeptSelect(res);
                    this.infoList = res.data.implTimeList;
                    this.structurebaseModularInnerId = res.data.id;
                    this.initInfoListTwo();
                    this.loading = false;
                })
            },
            delRowItem(index, type) {
                if ((type == 'infoList' && this.infoList.length === 0) || (type == 'infoListTwo' && this.infoListTwo.length === 0)) {
                    return;
                }
                if (type === 'infoList') {
                    this.infoList.splice(index, 1);
                } else {
                    this.infoListTwo.splice(index, 1);
                }
            },
            addRowItem(type) {
                if (type == 'infoList') {
                    this.infoList.push({
                        nt: '',
                        ntComment: '',
                        tt: '',
                        ttComment: ''
                    });
                } else {
                    this.infoListTwo.push({
                        deptInitDataStr: '',
                        ccInitDataStr: '',
                        contactInitDataStr: '',
                        department: '',
                        contactList: [],
                        ccList: []
                    });
                }
            },
            onCancel() {

            },
            validortFunc(type) {
                if (type === 'infoList') {
                    var len = this.infoList.length;
                    if (len === 0) {
                        this.$message.warning('实施时间至少增加一条数据!');
                        return false;
                    }
                    for (var i = 0; i < len; i++) {
                        if (!this.infoList[i].nt) {
                            this.$message.warning('NT为必填项,请完善信息!');
                            return false;
                        }
                    }
                    return true;
                }
            },
            onSubmit() {
                this.$refs.regulatoryForm.validate((valid) => {
                    if (valid) {
                        if (this.validortFunc('infoList')) {
                            this.loading = true;
                            let rpList = [];
                            this.infoListTwo.forEach((item, index) => {
                                if (item.department || item.contactList.length !== 0 || item.ccList.length !== 0) {
                                    rpList.push({
                                        department: item.department,
                                        contactList: item.contactList,
                                        ccList: item.ccList
                                    })
                                }
                            })
                            let params = {
                                regulationKey:this.formData.regulationKey,
                                category: this.formData.category,
                                subCategory: this.formData.subCategory,
                                regulationCode: this.formData.regulationCode,
                                substituteCode:this.formData.substituteCode,
                                substituteKey:this.formData.substituteKey,
                                regulationName: this.formData.regulationName,
                                introduction: this.formData.introduction,
                                standardStatus: this.formData.standardStatus,
                                nature: this.formData.nature,
                                applicableType: this.formData.applicableType,
                                trackMethod: this.formData.trackMethod,
                                trackFrequency: this.formData.trackFrequency,
                                contactPerson: this.formData.contactPerson,
                                contactUnit: this.formData.contactUnit,
                                contactDetails: this.formData.contactDetails,
                                regulationLeader: this.formData.regulationLeader,
                                certificationTypeItems: this.formData.certificationTypeItems,
                                carModelItems: this.formData.carModelItems,
                                powerTypeItems: this.formData.powerTypeItems,
                                gasFuelItems: this.formData.gasFuelItems,
                                regulatoryReferences:this.formData.regulatoryReferences,
                                technicalRoute:this.formData.technicalRoute,
                                rpList: rpList,
                                implTimeList: this.infoList
                            }
                            if (this.caseType === 'editCase') {
                                params.key = this.formData.key;
                                if(this.fromPage==='finishList'){
                                    //申请修改
                                    params.id = this.formData.id;
                                    structurebaseApplyModify(params,this.id).then(res=>{
                                        this.loading = false;
                                        let doObj = {};
                                        doObj.action = 'edit';
                                        doObj.data = {};
                                        doObj.close = true;
                                        this.$emit('callAction',doObj)
                                    }).catch(err=>{
                                        this.loading = false;
                                    })
                                }else{
                                    params.id = this.id;
                                    structurebaseUpdate(params).then(res => {
                                        this.loading = false;
                                        let doObj = {};
                                        doObj.action = 'edit';
                                        doObj.data = {};
                                        doObj.close = true;
                                        this.$emit('callAction',doObj)
                                    }).catch(err => {
                                        this.loading = false;
                                    })
                                }
                            } else if (this.caseType === 'addCase') {
                                params.id = this.structurebaseModularInnerId;
                                structurebaseAdd(params).then(res => {
                                    this.loading = false;
                                    let doObj = {}
                                    doObj.action = 'add';
                                    doObj.data = {};
                                    doObj.close = true;
                                    this.$emit('callAction',doObj)
                                }).catch(err => {
                                    this.loading = false;
                                })
                            }
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
    .el-form-item{
        padding-left:20px;
        box-sizing: border-box;
    }
    .editRegulationStructured {
        background: #fff;
        height: 100%;
    }

    .editRegulationStructured .btn {
        text-align: center;
        padding: 10px;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #ddd;
    }

    .editRegulationStructured .addForm {
        overflow: auto;
        position: absolute;
        top: 51px;
        left: 0;
        right: 0;
        bottom: 60px;
        border-top:1px solid #f0f0f0;
        /* padding: 0 10px; */
    }

    .editRegulationStructured .addForm .el-input,
    .editRegulationStructured .addForm .el-select {
        width: 200px;
    }

    .viewContent {
        color: #606266;
    }

    .editRegulationStructured .tableRow {
        text-align: right;
        margin-left:15px;
    }

    .editRegulationStructured .tableRow span {
        margin-right: 2px;
        font-size: 14px;
        color: #0f1419;
    }

    .editRegulationStructured .uploadBtn {
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
    .editRegulationStructured .selectRegulationCode{
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

    .rowTitle {
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: #fff;
        font-size: 14px;
        background: rgb(103, 112, 126);
        margin-bottom: 20px;
    }
    .mT2{
        margin-top:20px;
    }
</style>
