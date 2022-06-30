<template>
    <eco-content top='0px' bottom='0px' type='tool' style='background-color:#F5F5F5;'>
        <div class='planManageIndex'>
            <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool' style='overflow: hidden;'>
                <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
                    <el-col :span='5' style='height:30px;line-height: 30px;'>
                        <!-- <eco-tool-title title='标准计划管理'></eco-tool-title> -->
                        <strong>标准计划管理</strong>
                    </el-col>
                    <el-col :span='19' style='text-align:right;margin-top:2px;'>
                        <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                        <el-button type='primary' size='small' @click='editCase({},"editCase")' v-show='btnRoleObj["dongfeng.standardPlan.manage_modify"]'>修改</el-button>
                        <el-button type='primary' size='small' v-for='(item,index) in operationType' v-show="btnRoleObj[btnRoleKey[item.text]]"  @click="initCase(item.id,item.text)" :key='item.id'>{{item.text}}</el-button>
                        <el-button type='primary' size='small' @click="exportCase" v-show='btnRoleObj["dongfeng.standardPlan.manage_upload"]'>导出</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content v-show='isShowSearch' top='59px' height='200px' type='tool' style='border:1px solid #ddd;overflow: hidden;'>
                <el-row class="searchRow">
                    <el-col>
                        <span class='searchInputLabel'>标准分类:</span>
                        <el-select filterable v-model='searchContent.classification' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item) in standardType' :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>标准编号:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true)" v-model='searchContent.programNumber'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>标准名称:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true)" v-model='searchContent.programName'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>&ensp;部门:</span>
                        <tag-select placeholder="选择机构" style="min-width:130px;max-width:300px;vertical-align: top;" initDataStr="" ref='selectDept'
                            :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'dept')}">
                        </tag-select>
                    </el-col>
                    <el-col>
                        <!-- <span class='searchInputLabel'>&ensp;计划当前审批人:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true)" v-model='searchContent.planApproveName'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input> -->
                        <span class='searchInputLabel'>来源编号:</span>
                        <el-input  placeholder='请输入' readonly @click.native.stop='selectQuality' :value='searchContent.sourceNumber'></el-input>
                        <span class='searchInputLabel'>计划类型:</span>
                        <el-select filterable v-model='searchContent.planType' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item) in planType' :key='item.id'></el-option>
                        </el-select>
                        <!-- <span class='searchInputLabel'>&emsp;制定人:</span>
                        <tag-select ref='selectDrafter' initDataStr="" placeholder="选择人员" style="width:150px;vertical-align: top;"  :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data,'drafter')}">
                        </tag-select> -->
                        <span class='searchInputLabel'>计划审批状态:</span>
                        <el-select filterable v-model='searchContent.nodeId' clearable>
                            <el-option :value='item.code' :label='item.text' v-for='(item,index) in planStatusList' :key='item.id'></el-option>
                        </el-select> 
                    </el-col>
                    <el-col>
                        <span class='searchInputLabel' style="float:left;margin-right: 6px;">&emsp;分标委:</span>
                        <div class='selectSubcommittee' style="float:left" @click.stop='selectSubcommittee'>{{searchContent.subcommitteeName||'请选择'}}</div>     
                        <span class='searchInputLabel'>&emsp;体系码:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true)" v-model='searchContent.systemCode'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>&emsp;&emsp;&ensp;科室:</span>
                        <tag-select placeholder="选择机构" style="width:150px;vertical-align: top;" initDataStr="" ref='selectDffice'
                            :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'office')}">
                        </tag-select>
                        <span class='searchInputLabel'>年度:</span>
                        <el-date-picker style='width:160px;' v-model="searchContent.year" type="year" value-format='yyyy' placeholder="选择年">
                        </el-date-picker>
                    </el-col>
                    <el-col>
                        <!-- <span class='searchInputLabel'>制修订审批人:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true)" v-model='searchContent.editApproveName'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input> -->

                        <span class='searchInputLabel'>初稿完成时间:</span>
                        <el-date-picker  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="searchContent.dateRange1"
                            value-format='yyyy-MM-dd' type="daterange" placeholder="选择日期">
                        </el-date-picker>
                        <span class='searchInputLabel'>会签完成时间:</span>
                        <el-date-picker  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="searchContent.dateRange2"
                            value-format='yyyy-MM-dd' type="daterange" placeholder="选择日期">
                        </el-date-picker>
                        <span class='searchInputLabel'>审批完成时间:</span>
                        <el-date-picker  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="searchContent.dateRange3"
                            value-format='yyyy-MM-dd' type="daterange" placeholder="选择日期">
                        </el-date-picker>
                    </el-col>
                    <el-col>
                        <span class='searchInputLabel'>制/修订审批状态:</span>
                        <el-select filterable v-model='searchContent.revisionNodeId' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item,index) in editStatus' :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>责任人:</span>
                        <tag-select ref='selectResponsibleUser' initDataStr="" placeholder="选择人员" style="width:150px;vertical-align: top;"  :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data,'responsibleUser')}">
                        </tag-select>
                        <span class='searchInputLabel'>&emsp;制/修订:</span>
                        <el-select filterable v-model='searchContent.editType'  clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item) in editType' :key='item.id'></el-option>
                        </el-select>
                        <el-button @click='requestData("search",true)' type='primary' style='margin-left:5px;'>查询</el-button>
                        <el-button @click='restSearContent'>重置</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table ref='planManageTab' @selection-change="handleSelectionChange"  highlight-current-row stripe :data='tableData' header-row-class-name='tableHeader'
                    border tooltip-effect='dark' height='100%' class='standardizationTable'>
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column type='index' label='序号'>
                        <template slot-scope='scope'>
                            {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop='year' label='年度'></el-table-column> -->
                    <el-table-column prop='deptName' label='部门' width='140' show-overflow-tooltip></el-table-column>
                    <el-table-column prop='classificationName' label='标准分类' widt='150' show-overflow-tooltip></el-table-column>
                    <el-table-column prop='programNumber' label='标准编号'></el-table-column>
                    <el-table-column prop='typeName' label='标准类型'></el-table-column>
                    <el-table-column prop='programName' label='标准名称' width='160' show-overflow-tooltip>
                        <template slot-scope='scope'>
                            <span class="linkB cursorP" @click='openWfViewOperate(scope.row.wfId)'>{{scope.row.programName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='draftTime' width='130' label='初稿完成时间'></el-table-column>
                    <el-table-column prop='countersignTime' width='130' label='会签完成时间'></el-table-column>
                    <el-table-column prop='officeName' label='科室' width='140' show-overflow-tooltip></el-table-column> 
                    <!-- <el-table-column prop='drafterName' label='制定人'></el-table-column> -->
                    <el-table-column prop='responsibleUserName' label='责任人'></el-table-column>
                    <el-table-column prop='subcommitteeName' label='分标委' width='160' show-overflow-tooltip></el-table-column> 
                    <el-table-column prop='sourceNumberList' label='来源编号' width='200' show-overflow-tooltip>
                        <template slot-scope='scope'>
                            <span>{{restSourceNumberList(scope.row.sourceNumberList)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='systemCode' label='体系码'></el-table-column>
                    <el-table-column prop='editTypeName' label='制/修订'></el-table-column>
                    <el-table-column prop='editApproveName' label='制修订当前审批人' width='150' show-overflow-tooltip></el-table-column>
                    <el-table-column prop='editStatusName' label='制修订状态' width='150' show-overflow-tooltip></el-table-column>
                    <el-table-column prop='planApproveName' label='计划当前审批人' width='150' show-overflow-tooltip></el-table-column>
                    <el-table-column prop='planStatusName' label='计划审批状态' width='150' show-overflow-tooltip></el-table-column>
                    <el-table-column prop='planTypeName' label='计划类型'></el-table-column>
                    <el-table-column prop='approveCompleteTime' label='审批完成日期' width='130'></el-table-column>
                </el-table>
            </eco-content>
            <eco-content bottom="0px" type="tool" style="padding:5px 0px">
                <el-row>
                    <el-col :span="24" style="text-align:right">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="baseInfo.page" :page-sizes="[30,50,100]"
                            :page-size="baseInfo.rows" layout="total, sizes, prev, pager, next, jumper" :total="baseInfo.total"
                            style="margin-right:20px">
                        </el-pagination>
                    </el-col>
                </el-row>
            </eco-content>
        </div>
    </eco-content>
</template>    
<script>
    var _self;
    import ecoContent from '@/components/pageAb/ecoContent.vue'
    import ecoLoading from '@/components/loading/ecoLoading.vue'
    import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
    import tagSelect from '@/components/orgPick/tagSelect.vue'
    import {getRoleBtnSetting,getWFViewOperateId,planManageList,initWorkflowType,planManageExport,getWFOperateId} from '../service/service.js'
    import {EcoMessageBox} from '@/components/messageBox/main.js'
    import { EcoUtil } from "@/components/util/main.js";
    import {mapState} from 'vuex'
    import {sysEnv} from '../config/env.js'
    export default {
        name:'planManageIndex',
        data(){
            return {
                btnRoleKey:{
                    "新增":'dongfeng.standardPlan.manage_create',
                    '延迟':'dongfeng.standardPlan.manage_delay',
                    '变更':'dongfeng.standardPlan.manage_change',
                    '取消':'dongfeng.standardPlan.manage_cancel'
                },
                btnRoleObj:{},
                canclick:true,
                isShowSearch:true,
                baseInfo: {
                    page: 1,
                    rows: 30,
                    total: 0
                },
                searchContent:{
                    classification:'',
                    programNumber:'',
                    programName:'',
                    dept:"",
                    office:"",
                    // planApproveName:"",
                    sourceNumberItems:[],
                    sourceNumber:'',
                    planType:'',
                    dateRange1:[],
                    dateRange2:[],
                    // drafter:'',
                    editType:'',
                    year:'',
                    subcommitteeName:'',
                    subcommittee:'',
                    systemCode:'',
                    // editApproveName:'',
                    dateRange3:[],
                    nodeId:'',
                    revisionNodeId:''
                },
                tableData: [],
                multipleSelection:[],

            }
        },
        components: {
            ecoContent,
            ecoLoading,
            ecoToolTitle,
            tagSelect
        },
        computed:{
            ...mapState(['operationType','standardType','planType','editType','planStatusList','editStatus']),
            contentTop() {
                return this.isShowSearch ? '260px' : '59px';
            },
        },
        created(){
            _self = this;
            this.callAction();
            this.initRole();
        },
        mounted(){
            this.requestData('',false);
        },
        methods:{
            initRole() {
                const btn_array = [
                'dongfeng.standardPlan.manage_create',
                'dongfeng.standardPlan.manage_delay',
                'dongfeng.standardPlan.manage_change',
                'dongfeng.standardPlan.manage_cancel',
                'dongfeng.standardPlan.manage_upload',
                'dongfeng.standardPlan.manage_modify',
                ];
                getRoleBtnSetting(btn_array).then((res) => {
                    if (res.data) {
                        this.btnRoleObj = res.data.authenticationMap;
                    }
                })
            },
            editCase(row,type){
                if(type==="editCase"){
                     if(this.multipleSelection.length!==1){
                         this.$message.warning('请选择一条数据操作!')
                         return;
                     }
                     row.id = this.multipleSelection[0].id;
                }
                let _width = "1100";
                let _height = "500";
                let url  = "/planManagement/index.html#/editPlan/" + row.id + "/" + type;
                let dialogTitle;
                if (type === "editCase") {
                    dialogTitle = "编辑";
                } else if (type === "viewCase") {
                    dialogTitle = "查看";
                    _height = "400";
                }
                EcoUtil.getSysvm().openDialog(dialogTitle, url, _width, _height, "15vh");
            },
            openWfViewOperate(_wfId){
                if(this.canclick){
                    this.$refs.refLoading.open();
                    this.canclick = false;
                    let formView = 1;
                    let _ccId = null;
                    getWFViewOperateId(_wfId,formView,_ccId).then((response)=>{
                            this.$refs.refLoading.close();
                            if(response.data.status == 0){
                                let operateId = response.data.operate_id;
                                if(sysEnv == 1){
                                    let tabObj = {};
                                    let goPage = "flowform/index.html#/wfViewDetail/"+_wfId+"/"+operateId;
                                    tabObj.desc = '流程查看';
                                    tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wfViewDetail"+_wfId+"',href_link:'"+goPage+"',fullScreen:true}";
                                    window.parent.window.sysvm.doTab(tabObj);
                                }else{
                                    this.$router.push({name:'wfViewDetail',params:{wfId:_wfId,operateId:operateId}})
                                }
                            }else{
                                EcoMessageBox.alert(response.data.msg);
                            }
                            this.canclick = true;
                    })
                }
            },
            selectQuality(){
                let url ="/standardPlanRelease/index.html#/quality" ;
                EcoUtil.getSysvm().openDialog('来源编号', url,'900', '600', "15vh");
            },
            restSourceNumberList(data){
                let str = '';
                if(!data){
                   return str;
                }
                data.forEach((item,index)=>{
                    str += (index===0?item.code:`、${item.code}`)
                })
                return str;
            },
            callAction() {
                let callBackDialogFunc = function (obj) {
                if(obj.action==='selectSubcommittee'){
                        //查询条件分标委
                        // _self.searchContent.subcommitteeName
                        _self.searchContent.subcommitteeName =obj.dataArr.name;
                        _self.searchContent.subcommittee = obj.dataArr.id;
                    }else  if (obj && (obj.action === 'selectQuality')) {
                        //来源编号
                        _self.searchContent.sourceNumber = obj.data.sourceNumberList.join('、');
                        _self.searchContent.sourceNumberItems = obj.data.sourceNumberItems;
                    }else if(obj.action==='editPlan'){
                        _self.$message.success('操作成功!')
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'planManageIndex');
            },
            selectSubcommittee(){
                var url = '/standardPlanRelease/index.html#/subcommitteeList/'+true+'?action='+"selectSubcommittee"
                EcoUtil.getSysvm().openDialog('分标委', url, 1000, 600, '15vh');
            },
            selectRoleUser(data,type) {
                //选择人
                if (!data.id && data.itemArray.length === 0) {
                    //人员删除
                    if(type==='drafter'){
                        // this.searchContent.drafter = '';
                    }else if(type === 'responsibleUser'){
                        this.searchContent.responsibleUser='';
                    }
                 
                } else {
                   if(type==='drafter'){
                    //   this.searchContent.drafter = data.itemArray[0].linkId;
                   }else if(type === 'responsibleUser'){
                      this.searchContent.responsibleUser= data.itemArray[0].linkId;
                   }
                }
            },
            selectRoleDept(data,type) {
                //责任部门
                if (!data.id && data.itemArray.length === 0) {
                    if(type==='dept'){
                        this.searchContent.dept = ''; 
                    }else if(type==='office'){
                        this.searchContent.office = '';
                    }
                } else {
                    if(type === 'dept'){
                        this.searchContent.dept = data.orgId;
                    }else if(type==='office'){
                        this.searchContent.office = data.orgId;
                    }
                }
            },
            exportCase(){
                this.$refs.refLoading.open();
                let params = {
                    sort: ['modDate'],
                    order: ['desc']
                };
                for (var key in this.searchContent) {
                        if(key!=='subcommitteeName' && key!=='sourceNumber' && this.searchContent[key]){
                             if(key == 'dateRange1' && this.searchContent[key].length == 2){
                                params.draftTimeFrom = this.searchContent[key][0];
                                params.draftTimeTo = this.searchContent[key][1]; 
                             }else if(key == 'dateRange2' && this.searchContent[key].length == 2){    
                                params.countersignTimeFrom = this.searchContent[key][0];
                                params.countersignTimeTo = this.searchContent[key][1]; 
                             }else if(key == 'dateRange3' && this.searchContent[key].length == 2){     
                                params.approveCompleteTimeFrom = this.searchContent[key][0];
                                params.approveCompleteTimeto = this.searchContent[key][1]; 
                             }else{
                                params[key] = this.searchContent[key];
                             }
                        }
                    }
                planManageExport(params).then(res => {
                    if( window.navigator && window.navigator.msSaveOrOpenBlob ) {
                        navigator.msSaveBlob(new Blob([res.data],'计划管理.xlsx'));
                        this.$refs.refLoading.close();
                    }else{
                        let blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" }); 
                        let url = window.URL.createObjectURL(blob);  
                        let a = document.createElement("a");
                        a.href = url;
                        a.download = '计划管理.xlsx';
                        this.$refs.refLoading.close();
                        a.click();
                        window.URL.revokeObjectURL(url);
                    }
                }).catch(err => {
                    this.$refs.refLoading.close();
                })

            },
            initCase(id,text){
                if(text!=="新增" && this.multipleSelection.length!==1){
                    this.$message.warning('请选择一条数据!');
                    return;    
                }
                this.$refs.refLoading.open();
                // let ids = [];
                let ids = '';
                if(text!=="新增"){
                    // ids.push(this.multipleSelection[0].id);
                    ids = this.multipleSelection[0].id;
                }
                initWorkflowType(id,ids).then(res=>{
                    getWFOperateId(res.data.data.startTaskId).then(response => {
                        this.$refs.refLoading.close();
                        if (response.data.status == 0) {
                        let operateId = response.data.operate_id;
                        if (sysEnv == 1) {
                            let tabObj = {};
                            let goPage = "flowform/index.html#/wfDetail/" + res.data.data.startTaskId + "/" + operateId;
                            tabObj.desc = '新建流程';
                            tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wfDetail" + res.data.data.startTaskId + "',href_link:'" + goPage + "',fullScreen:true}";
                            window.parent.window.sysvm.doTab(tabObj);
                        }
                        } else {
                        EcoMessageBox.alert(response.data.msg);
                        }
                    })
                })
     
            },
            restSearContent() {
                // this.$refs.selectDrafter.initDataStrFunc();
                this.$refs.selectResponsibleUser.initDataStrFunc();
                this.$refs.selectDept.initDataStrFunc();
                this.$refs.selectDffice.initDataStrFunc();
                this.searchContent = {
                    classification:'',
                    programNumber:'',
                    programName:'',
                    dept:"",
                    office:"",
                    // planApproveName:"",
                    sourceNumberItems:[],
                    sourceNumber:'',
                    planType:'',
                    dateRange1:[],
                    dateRange2:[],
                    // drafter:'',
                    editType:'',
                    year:'',
                    subcommitteeName:'',
                    subcommittee:'',
                    systemCode:'',
                    // editApproveName:'',
                    dateRange3:[],
                    nodeId:'',
                    revisionNodeId:''
                };
                this.requestData('search',true);
            },
            requestData(type,isFirstP) {
                this.$refs.refLoading.open();
                let params = {
                    sort: ['modDate'],
                    order: ['desc'],
                    rows: this.baseInfo.rows
                };
                if (type === 'search') {
                    for (var key in this.searchContent) {
                        if(key!=='subcommitteeName' && key!=='sourceNumber' && this.searchContent[key]){
                             if(key == 'dateRange1' && this.searchContent[key].length == 2){
                                params.draftTimeFrom = this.searchContent[key][0];
                                params.draftTimeTo = this.searchContent[key][1]; 
                             }else if(key == 'dateRange2' && this.searchContent[key].length == 2){    
                                params.countersignTimeFrom = this.searchContent[key][0];
                                params.countersignTimeTo = this.searchContent[key][1]; 
                             }else if(key == 'dateRange3' && this.searchContent[key].length == 2){     
                                params.approveCompleteTimeFrom = this.searchContent[key][0];
                                params.approveCompleteTimeto = this.searchContent[key][1]; 
                             }else{
                                params[key] = this.searchContent[key];
                             }
                        }
                    }
                }
                if(isFirstP){
                    this.baseInfo.page = 1;
                }
                params.page = this.baseInfo.page;
                planManageList(params).then(res => {
                    this.baseInfo.total = res.data.total;
                    this.tableData = res.data.rows;
                    this.$refs.refLoading.close();
                }).catch(err => {
                    this.baseInfo.total = 0;
                    this.tableData = [];
                    this.$refs.refLoading.close();
                })
            },
            handleSizeChange(val) {
                this.baseInfo.rows = val;
                this.requestData('search',true)
            },
            handleCurrentChange(val) {
                this.baseInfo.page = val;
                this.requestData("search",false);
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            changeSearchShow() {
                this.isShowSearch = !this.isShowSearch;
            },
        }
    }
</script>
<style scoped>
    .planManageIndex {
        color: #0f1419;
        /* min-width: 1000px; */
        position: relative;
        height: 96%;
        margin: 0 24px;
        top: 2%;
        overflow-y: auto;
        color: #0f1419;
    }
    .planManageIndex .searchInputLabel {
        font-size: 14px;
        margin-left: 8px;
    }

    .standardizationTable /deep/ .el-table__row.el-table__row--striped td {
        background: #f5f7fa !important;
    }

    .standardizationTable /deep/ .tableHeader th {
        background: #f5f7fa;
        color: #000;
        /* border-bottom-width: 0px; */
    }

    /* .standardizationTable /deep/ .el-table__row td {
        border-bottom-width: 0px;
    }
    .standardizationTable  /deep/ .el-table__row td,
    .standardizationTable  /deep/  .tableHeader th {
        border:0px;
    } */
    .planManageIndex .selectSubcommittee{
        width:150px;
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
    .planManageIndex .searchRow{
        padding:15px 10px 16px 10px;
        background:#fff
    }
    .planManageIndex .searchRow .el-input,
    .planManageIndex .searchRow .el-select{
        width:150px;
    }
    .planManageIndex .searchRow .el-date-editor{
        width:200px;
    }
    .planManageIndex .searchRow .el-col+.el-col{
        margin-top:7px;
    }
</style>