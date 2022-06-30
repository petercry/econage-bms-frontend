<template>
    <div class='editPage'>
        <div class='addForm' v-loading='loading'>
            <el-form :model='formData' ref='editPageForm' :rules='rules' label-position='right' label-width='130px'>
                <div class='rowTitle'>基本信息</div>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='分类:' prop='category'>
                            <el-select disabled filterable v-if='isEdit' v-model='formData.category'>
                                <el-option v-show='item.enableInCreate' v-for='(item,index) in typeList' :value='item.id' :label='item.text'
                                    :key='item.id'></el-option>
                            </el-select>
                            <span class="viewContent" v-else>{{restData(formData.category,'category')}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label='子类:' prop='subCategory'>
                            <el-select disabled filterable v-if='isEdit' v-model='formData.subCategory'>
                                <el-option v-for='(item,index) in subClassListGroup' :value='item.id' :label='item.text'
                                    :key='item.id'></el-option>
                            </el-select>
                            <span class="viewContent" v-else>{{restData(formData.subCategory,'subCategory')}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='标准法规号:' prop='regulationCode'>
                            <div class='selectStandardRegulationNo' @click.stop='selectStandardRegulationNo'
                                v-if='isEdit'>{{formData.regulationCode||'请选择'}}</div>
                            <span class="viewContent" v-else>{{formData.regulationCode}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label='标准法规名称:' prop='regulationName'>
                            <el-input disabled v-if='isEdit' placeholder='请输入' v-model='formData.regulationName'></el-input>
                            <span class="viewContent" v-else>{{formData.regulationName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='标准简介:' prop='introduction'>
                            <el-input disabled v-if='isEdit' v-model='formData.introduction' type='textarea' :rows='4'
                                resize='none' show-word-limit maxlength='1000' placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.introduction||'暂无填写'}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style='margin-bottom:18px;'>
                    <el-col :span='2' class='tableRow'>
                        <span>实施时间:</span>
                    </el-col>
                    <el-col :span='21' style='padding-left:5px;box-sizing:border-box;'>
                        <el-table :data='infoList' border
                            :header-cell-style="{background:'#f5f7fa',color:'#000',textAlign:'center'}"
                            :cell-style="{textAlign:'center'}">
                            <el-table-column label='序号' type='index' width='50'></el-table-column>
                            <el-table-column prop='nt' label='NT' width='150'>
                                <template slot-scope='scope'>
                                    <el-date-picker disabled v-if='isEdit' style='width:100%' v-model="scope.row.nt"
                                        value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
                                    </el-date-picker>
                                    <span class="viewContent" v-else>{{scope.row.nt}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop='ntComment' label='NT备注' width='200'>
                                <template slot-scope='scope'>
                                    <el-input disabled v-if='isEdit' v-model='scope.row.ntComment' placeholder='请输入'
                                        style='width:100%'></el-input>
                                    <span class="viewContent" v-else>{{scope.row.ntComment}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop='tt' label='TT' width='150'>
                                <template slot-scope='scope'>
                                    <el-date-picker disabled v-if='isEdit' style='width:100%' v-model="scope.row.tt"
                                        value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
                                    </el-date-picker>
                                    <span class="viewContent" v-else>{{scope.row.tt}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop='ttComment' label='TT备注'>
                                <template slot-scope='scope'>
                                    <el-input disabled v-if='isEdit' v-model='scope.row.ttComment' placeholder='请输入'
                                        style='width:100%'></el-input>
                                    <span class="viewContent" v-else>{{scope.row.ttComment}}</span>
                                </template>
                            </el-table-column>
                            <!-- <el-table-column label='操作' v-if='isEdit' fixed='right'>
                                <template slot-scope='scope'>
                                    <el-button @click.native.prevent="delRowItem(scope.$index,'infoList')" type="text"
                                        size="small">删除</el-button>
                                </template>
                            </el-table-column> -->
                        </el-table>
                        <!-- <div v-if='isEdit' class='caseBtn' @click='addRowItem("infoList")'>
                            <span><i class='el-icon-plus'></i>添加</span>
                        </div> -->
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='法规状态:' prop='standardStatus'>
                            <el-select disabled filterable v-if='isEdit' v-model='formData.standardStatus' clearable>
                                <el-option :value='item.id' :label='item.text' v-for='(item,index) in standardState'
                                    :key='item.id'></el-option>
                            </el-select>
                            <span v-else
                                class="viewContent">{{restData(formData.standardStatus,'standardStatus')}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label='性质:' prop='nature'>
                            <el-select disabled filterable v-if='isEdit' v-model='formData.nature' clearable>
                                <el-option :value='item.id' :label='item.text' v-for='(item,index) in natureList'
                                    :key='item.id'></el-option>
                            </el-select>
                            <span v-else class="viewContent">{{restData(formData.nature,'nature')}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='适用车型:' prop='carModelItems'>
                            <el-checkbox-group disabled v-model="formData.carModelItems" v-if='isEdit'>
                                <el-checkbox :label="item.id" v-for='(item,index) in applicableModels' :key='item.id'>
                                    {{item.text}}</el-checkbox>
                            </el-checkbox-group>
                            <span v-else class="viewContent">{{restData(formData.carModelItems,'carModelItems')}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='动力类型:' prop='powerTypeItems'>
                            <el-checkbox-group disabled v-model="formData.powerTypeItems" v-if='isEdit'>
                                <el-checkbox :label="item.id" v-for='(item,index) in powerType' :key='item.id'>
                                    {{item.text}}</el-checkbox>
                            </el-checkbox-group>
                            <span v-else
                                class="viewContent">{{restData(formData.powerTypeItems,'powerTypeItems')}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class='rowTitle'>车型信息</div>
                <el-row>
                    <el-col :span='23' style='padding-left:50px;box-sizing: border-box;'>
                        <el-table :data='infoListTwo' border
                            :header-cell-style="{background:'#f5f7fa',color:'#000',textAlign:'center'}"
                            :cell-style="{textAlign:'center'}">
                            <el-table-column prop='platform' label='所属平台'>
                                <template slot-scope='scope'>
                                    <el-select v-model="scope.row.platform" disabled placeholder="请选择" clearable>
                                        <el-option v-for="(item,index) in proPlatfForm" :key="index"
                                            :label="item.text" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <!-- <el-table-column prop='projectCode' label='项目编号' width='250'>
                                <template slot-scope='scope'>
                                    <div class='selectStandardRegulationNo marAu'   @click.stop = 'selectProjectId(scope.$index)'
                                     v-if='isEdit'>{{scope.row.projectCode||'请选择'}}</div>
                                </template>
                            </el-table-column> -->
                            <el-table-column prop='projectName' label='项目名称' width='250'>
                                <template slot-scope='scope'>
                                    <div class='selectStandardRegulationNo marAu'   @click.stop = 'selectProjectId(scope.$index)'
                                     v-if='isEdit'>{{scope.row.projectName||'请选择'}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column prop='projectLeaderName' label='项目法规负责人'>
                                <template slot-scope='scope'>
                                    <el-input disabled v-if='isEdit' placeholder="请输入" v-model='scope.row.projectLeaderName'></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label='标记'>
                                <template slot-scope='scope'>
                                    <span>{{restMark(scope.row)}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label='操作' v-if='isEdit' width='100'>
                                <template slot-scope='scope'>
                                    <el-button @click.native.prevent="delRowItem(scope.$index,'infoListTwo')"
                                        type="text" size="small">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div v-if='isEdit' class='caseBtn' @click='addRowItem("infoListTwo")'>
                            <span><i class='el-icon-plus'></i>添加</span>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>
<script>
    var _self;
    import { EcoUtil } from '@/components/util/main.js'
    import { projectListSelectByStructure,regulationChangeDetails,regulationChangeAdd,structurebaseSingle,regulationChangeUpdate} from '../service/service.js'
    import { mapState } from 'vuex'
    export default {
        data() {
            return {
                infoListTwo: [],
                infoList: [],
                formData: {
                    structureKey:'',
                    category: '',
                    subCategory: '',
                    regulationCode: '',
                    regulationName: '',
                    introduction: '',
                    standardStatus: '',
                    nature: '',
                    carModelItems: [],
                    powerTypeItems: [],
                    substituteCode:'',//代替法规
                    substituteKey:'',//代替key
                },
                loading: false
            }
        },
        computed: {
            ...mapState(['proPlatfForm', 'typeList', 'subClassList', 'standardState', 'natureList', 'applicableModels', 'powerType']),
            caseType() {
                return this.$route.params.caseType;
            },
            isEdit() {
                return this.caseType !== 'viewCase'
            },
            id() {
                return this.$route.params.id;
            },
            rules() {
                var list = {
                    category: '分类',
                    subCategory: '子类',
                    regulationCode: '标准法规号',
                    regulationName: '标准法规名称',
                    // introduction: '标准简介',
                    standardStatus: '法规状态',
                    nature: '性质',
                    carModelItems: '适用车型',
                    powerTypeItems: '动力类型'
                }
                var obj = {};
                // |(introduction)
                for (var key in list) {
                    var trigger = (key.search(/(regulation)/g) !== -1) ? 'blur' : 'change'
                    obj[key] = [{ required: true, message: `${list[key]}为必填项`, trigger: trigger }];
                }
                return obj;
            },
            subClassListGroup() {
                let data = [];
                if (this.formData.category) {
                    data = this.subClassList[this.formData.category];
                }
                // if(this.caseType != 'addCase'){
                //     this.formData.subCategory = '';
                // }
                return data;
            }
        },
        created() {
            this.init();
        }, methods: {
            restMark(row){
                var str = '';
                if(row.markNew){
                    str = '新'
                }
                if(row.markOld){
                   if(str){
                      str += '、旧'
                   }else{
                      str  = '旧'
                   }
                }
                return str;
            },
            selectProjectId(index){
                var url = '/taskTriggeredRegulation/index.html#/selectProId/' + index;
                EcoUtil.getSysvm().openDialog('选择项目名称', url, 1100, 600, '15vh');
            },
            onSubmit() {
                this.$refs.editPageForm.validate((valid) => {
                    if(valid){
                        if (this.validortFunc('infoList')) {
                            this.loading = true;
                            let params = {
                                structureKey:this.formData.structureKey,
                                category: this.formData.category,
                                subCategory: this.formData.subCategory,
                                regulationCode: this.formData.regulationCode,
                                regulationName: this.formData.regulationName,
                                introduction: this.formData.introduction,
                                standardStatus: this.formData.standardStatus,
                                nature: this.formData.nature,
                                carModelItems: this.formData.carModelItems,
                                powerTypeItems: this.formData.powerTypeItems,
                                substituteCode:this.formData.substituteCode,
                                substituteKey:this.formData.substituteKey,
                                implTimeList: this.infoList,
                                projectList:this.infoListTwo
                            };
                            if (this.caseType === 'editCase') {
                                params.id = this.formData.id;
                                regulationChangeUpdate(params).then(res=>{
                                    this.loading = false;
                                    let doObj = {}
                                    doObj.action = 'edit';
                                    doObj.data = {};
                                    doObj.close = true;
                                    this.$emit('callAction',doObj);
                                })
                            }else{
                                //新增
                                regulationChangeAdd(params).then(res=>{
                                    this.loading = false;
                                    let doObj = {}
                                    doObj.action = 'add';
                                    doObj.data = {};
                                    doObj.close = true;
                                    this.$emit('callAction',doObj);
                                })
                            }
                        }

                    }else{
                        return false;
                    }
                })


            },
            selectStandardRegulationNo() {
                if(this.caseType = 'addCase'){
                    var url = '/modelInProduction/index.html#/structuredLIst/' + false;
                     EcoUtil.getSysvm().openDialog('选择标准法规编号', url, 1100, 600, '15vh');
                }
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
            getDetailsInfo() {
                this.loading = true;
                regulationChangeDetails(this.id).then(res => {
                    this.loading = false;
                    this.formData = res.data;
                    this.infoList = res.data.implTimeList;
                    this.infoListTwo = res.data.projectList;
                })
            },
            callAction2() {
                let callBackDialogFunc = function (obj) {
                    if (obj && (obj.action === 'selectRegulationCode')) {
                        //obj.data  新增 选择法规编号 带入数据
                        _self.formData.structureKey = obj.data.key;
                        _self.formData.regulationCode = obj.data.regulationCode;
                        _self.formData.category = obj.data.category;
                        _self.formData.subCategory = obj.data.subCategory;
                        _self.formData.regulationName = obj.data.regulationName;
                        _self.formData.introduction = obj.data.introduction || '';
                        _self.formData.standardStatus = obj.data.standardStatus;
                        _self.formData.nature = obj.data.nature;
                        _self.formData.substituteCode = obj.data.substituteCode||'';
                        _self.formData.substituteKey = obj.data.substituteKey||'';
                        structurebaseSingle(obj.data.id).then(res => {
                            _self.infoList = res.data.implTimeList;
                            _self.formData.carModelItems = res.data.carModelItems || [];
                            _self.formData.powerTypeItems = res.data.powerTypeItems || [];
                        })
                        projectListSelectByStructure(obj.data.id).then(res=>{
                            if(res.data){
                                var arr=[];
                                res.data.forEach(item=>{
                                    arr.push({
                                        projectId:item.projectId,
                                        platform:item.platform,
                                        projectCode:item.projectCode,
                                        projectName:item.projectName,
                                        projectLeaderId:item.projectLeader&&item.projectLeader.linkId,
                                        projectLeaderName:item.projectLeaderName||'',
                                        markOld:item.markOld,
                                        markNew:item.markNew
                                    })
                                })
                                _self.infoListTwo=arr;
                            }else{
                                _self.infoListTwo=[];
                            }
                        })
                    }else if(obj && (obj.action === 'selectProjectId')){
                       _self.infoListTwo[obj.data.rowIndex].projectId=obj.data.objData.projectId;
                       _self.infoListTwo[obj.data.rowIndex].platform=obj.data.objData.platform;
                       _self.infoListTwo[obj.data.rowIndex].projectCode=obj.data.objData.projectCode;
                       _self.infoListTwo[obj.data.rowIndex].projectName=obj.data.objData.projectName;
                       _self.infoListTwo[obj.data.rowIndex].projectLeaderId=obj.data.objData.projectLeader&&obj.data.objData.projectLeader.linkId;
                       _self.infoListTwo[obj.data.rowIndex].projectLeaderName = obj.data.objData.projectLeaderName||'';
                       _self.infoListTwo[obj.data.rowIndex].markOld=false;
                       _self.infoListTwo[obj.data.rowIndex].markNew=false;
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'editPoint');
            },
            init() {
                _self = this;
                this.callAction2();
                if (this.caseType != 'addCase') {
                    this.getDetailsInfo(); 
                }
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
                        platform:'',
                        projectCode:'',
                        projectName:'',
                        projectLeaderId:'',
                        projectLeaderName:'',
                        markOld:false,
                        markNew:false
                    });
                }
            },
        }
    }
</script>
<style scoped>
    .editPage .tableRow {
        text-align: right;
        margin-left: 30px;
    }

    .editPage .tableRow span {
        /* margin-right: 2px; */
        font-size: 14px;
        color: #0f1419;
    }

    .editPage .selectStandardRegulationNo {
        width: 200px;
        height: 28px;
        border: 1px solid #DCDFE6;
        border-radius: 4px;
        cursor: pointer;
        box-sizing: border-box;
        padding-left: 15px;
        font-size: 12px;
        color: rgb(193, 195, 197);
        line-height: 25px;
    }
   .editPage .selectStandardRegulationNo.marAu{
        margin: 0px auto;
        text-align:left;
    }
</style>