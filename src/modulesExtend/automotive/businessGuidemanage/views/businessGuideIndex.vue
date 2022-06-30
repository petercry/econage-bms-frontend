<template>
    <eco-content top='0px' bottom='0px' type='tool' style='background: #f5f5f5'>
        <div class="businessGuideIndex">
            <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool' style='overflow:hidden;'>
                <el-row style='padding:16px;background: #fff;border:1px solid #ddd;'>
                    <el-col :span='5'>
                        <strong>{{stateFlow[selectState]}}</strong>
                    </el-col>
                    <el-col :span='19' style="text-align:right">
                        <el-select v-model="selectState" @change='changePage'>
                            <el-option v-for="(item,index) in stateFlowList" :key="item.id" :label="item.label" :value="item.id">
                            </el-option>
                          </el-select>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content top='60px' height='50px' type='tool' style='border-left:1px solid #ddd;border-right:1px solid #ddd;;overflow:hidden;padding:7px 0px 0px 10px;background-color: #fff'>
                <el-row>
                    <el-col>
                        <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                        <el-button type='primary' size='small' @click='initCase' v-show='selectState==="STI_DEPT_START" && editEnable'>启动规划</el-button>
                        <el-button type='primary' size='small' @click='editCase({},"addCase")' v-show='["STI_DEPT_START","DEPT_LIAISON_CONFIRM","OFFICE_LIAISON_CONFIRM","RESPONSIBLE_USER_CONFIRM"].includes(selectState) && editEnable'>新增</el-button>
                        <el-button type='primary' size='small' @click='doEdit' v-show='["STI_DEPT_START","DEPT_LIAISON_CONFIRM","OFFICE_LIAISON_CONFIRM","RESPONSIBLE_USER_CONFIRM","STI_DEPT_CONFIRM"].includes(selectState) && editEnable'>修改</el-button>
                        <el-button type='primary' size='small' @click='deleteCase' v-show='["STI_DEPT_START","DEPT_LIAISON_CONFIRM","OFFICE_LIAISON_CONFIRM","RESPONSIBLE_USER_CONFIRM"].includes(selectState) && editEnable'>删除</el-button>
                        <el-button type='primary' size='small' @click='passCase' v-show='approveBtn[selectState] && editEnable'>{{approveBtn[selectState]}}</el-button>
                        <el-button type='primary' size='small' @click='withdrawCase' v-show='withdrawBtn[selectState] && editEnable'>{{withdrawBtn[selectState]}}</el-button>
                        <el-button type='primary' size='small' @click="exportCase">导出</el-button>
                        <el-button type='primary' size='small' @click='importCase' v-show='selectState==="STI_DEPT_START" && editEnable'>导入</el-button>
                        <el-upload v-show='false' ref='businessGuideIndexUpload' :auto-upload='true' :http-request="uploadFile" action="" :before-upload='beforeUpload'
                            :show-file-list='false'  accept='.xls,.xlsx'>
                        </el-upload>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content v-show='isShowSearch' top='109px' height='160px' type='tool' style='border:1px solid #ddd;overflow: hidden;'>
                <el-row class="searchRow">
                    <el-col>
                        <span class='searchInputLabel'>年度:</span>
                        <el-date-picker  style='width:160px;' v-model="searchContent.year" type="year" value-format='yyyy' placeholder="选择年">
                        </el-date-picker>
                        <span class='searchInputLabel'>业务指南名称:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.businessGuideName' placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>部门:</span>
                        <tag-select placeholder="选择机构" style="min-width:130px;max-width:300px;vertical-align: top;" initDataStr="" ref='selectDept'
                            :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'dept')}">
                        </tag-select>
                        <span class='searchInputLabel'>操作类型:</span>
                        <el-select filterable v-model='searchContent.operationType'  clearable>
                            <el-option :value='key' :label='val' v-for='(val,key) in operationType' :key='key'></el-option>
                        </el-select>
                    </el-col>
                    <el-col>
                        <span class='searchInputLabel'>状态标示:</span>
                        <el-select filterable v-model='searchContent.status'  clearable>
                            <el-option :value='key' :label='val' v-for='(val,key) in supportStatus' :key='key'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>复审年度:</span>
                        <el-date-picker style='width:160px;' v-model="searchContent.reviewYear" type="year" value-format='yyyy' placeholder="选择年">
                        </el-date-picker>
                        <span class='searchInputLabel'>&emsp;科室:</span>
                        <tag-select placeholder="选择机构" style="width:130px;vertical-align: top;" initDataStr="" ref='selectDffice'
                            :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'office')}">
                        </tag-select>
                        <span class='searchInputLabel'>审批状态:</span>
                        <el-select filterable v-model='searchContent.phaseStatus'  clearable>
                            <el-option :value='key' :label='val' v-for='(val,key) in phaseStatus' :key='key'></el-option>
                        </el-select>
                        <span class='searchInputLabel' v-show='selectState==="END"'>环节节点:</span>
                        <el-select filterable v-model='searchContent.phase' v-show='selectState==="END"' clearable>
                            <el-option :value='key' :label='val' v-for='(val,key) in stateFlow' :key='key'></el-option>
                        </el-select>
                    </el-col>
                    <el-col>
                        <span class='searchInputLabel'>初稿完成时间:</span>
                        <el-date-picker  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="searchContent.dateRange1"
                            value-format='yyyy-MM-dd' type="daterange" placeholder="选择日期">
                        </el-date-picker>
                        <span class='searchInputLabel'>会签完成时间:</span>
                        <el-date-picker  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="searchContent.dateRange2"
                            value-format='yyyy-MM-dd' type="daterange" placeholder="选择日期">
                        </el-date-picker>
                        <span class='searchInputLabel'>责任人:</span>
                        <tag-select ref='selectResponsibleUser' initDataStr="" placeholder="选择人员" style="width:130px;vertical-align: top;"  :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data)}">
                        </tag-select>
                        <el-button @click='requestData("search",true,true)' type='primary' style='margin-left:5px;'>查询</el-button>
                        <el-button @click='restSearContent'>重置</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table row-key='id' border ref='businessGuideTable' @selection-change="handleSelectionChange" stripe
                    :data='tableData' header-row-class-name='tableHeader' tooltip-effect='dark' height='100%' class='businessGuideTableTable'>
                    <el-table-column type="selection" width="55" reserve-selection></el-table-column>
                    <el-table-column type='index' label='序号' align='center'>
                        <template slot-scope='scope'>
                            {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                        </template>
                    </el-table-column>
                    <!-- <el-table-column  label='年度' prop='year'></el-table-column> -->
                    <el-table-column  label='部门' prop='deptName'></el-table-column>
                    <el-table-column  label='业务指南名称' width='150' prop='businessGuideName'>
                        <template slot-scope='scope'>
                            <span class="linkB cursorP" @click='editCase(scope.row,"viewCase")'>{{scope.row.businessGuideName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column  label='环节名称'  width='150'  prop='phaseName'></el-table-column>
                    <el-table-column  label='初稿完成时间'  width='150'  prop='draftCompletionTime'></el-table-column>
                    <el-table-column  label='会签完成时间'  width='150' prop='countersignCompleteTime'></el-table-column>
                    <el-table-column  label='科室' prop='officeName' width='200'></el-table-column>
                    <el-table-column  label='责任人' prop='responsibleUserName' width='170'></el-table-column>
                    <el-table-column  label='状态标示' prop='statusName'  width='170'></el-table-column>
                    <el-table-column  label='复审年度' prop='reviewYear'></el-table-column>
                    <el-table-column  label='操作类型' prop='operationTypeName'></el-table-column>
                    <el-table-column  label='审批状态' prop='phaseStatusName'></el-table-column>
                    <el-table-column  label='当前审批人'  width='150' prop='currentAssigneeName'></el-table-column>
                    <!-- fixed='right' -->
                    <el-table-column  label='流程历史意见' align='center'  width='120' fixed='right'>
                        <template slot-scope='scope'>
                            <span class="linkB cursorP" @click='openHistory(scope.row.id)'>查看</span>
                        </template>
                    </el-table-column>
                    <el-table-column  label='操作' align='center' fixed='right' width='80' v-if='selectState==="RESPONSIBLE_USER_CONFIRM" || isShowViewBtn'>
                        <template slot-scope='scope'>
                            <span class="linkB cursorP" @click='openProjectApproval(scope.row,"editCase")' v-show='("RESPONSIBLE_USER_CONFIRM"===selectState && scope.row.enableStartup)'>立项</span>
                            <span class="linkB cursorP" @click='openReexaminationSheet(scope.row,"editCase")'  v-show='("RESPONSIBLE_USER_CONFIRM"===selectState && scope.row.enableReview)'>复审</span>
                            <!-- <span class="linkB cursorP"  @click='openProjectApproval(scope.row,"viewCase")' v-show='isShowViewBtn && scope.row.readStartup'>立项</span> -->
                            <!-- <span class="linkB cursorP"  @click='openReexaminationSheet(scope.row,"viewCase")' v-show='(isShowViewBtn && scope.row.readReview)'>复审</span> -->
                            <span class="linkB cursorP" v-show='scope.row.enableOk' @click='responsibleUserConfirmCase(scope.row)'>确定</span>
                        </template>
                    </el-table-column>
                </el-table>
            </eco-content>
            <eco-content bottom="0px" type="tool" style="padding:5px 0px">
                <el-row>
                    <el-col :span='10' class='bottomRow' v-show="['DEPT_LIAISON_APPROVE','SECTION_CHIEF_APPROVE','EXPERT_APPROVE'].includes(selectState)">
                        <span>已到达{{currentCount.count1}}条/共{{currentCount.count2}}条(所有条数到达才可提交下一环节,否则只能驳回)</span>
                    </el-col>
                    <el-col :span="['DEPT_LIAISON_APPROVE','SECTION_CHIEF_APPROVE','EXPERT_APPROVE'].includes(selectState)?14:24" style="text-align:right">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :current-page.sync="baseInfo.page" :page-sizes="[30,50,100]" :page-size="baseInfo.rows"
                            layout="total, sizes, prev, pager, next, jumper" :total="baseInfo.total"
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
    import ecoContent from "@/components/pageAb/ecoContent.vue";
    import ecoLoading from "@/components/loading/ecoLoading.vue";
    import ecoToolTitle from "@/components/tool/ecoToolTitle.vue";
    import { EcoUtil } from "@/components/util/main.js";
    import { EcoMessageBox } from "@/components/messageBox/main.js";
    import tagSelect from '@/components/orgPick/tagSelect.vue'
    import {mapState} from 'vuex'
    import {responsibleUserConfirm,programMainStartup,programWithdraw,stateFlowPass,guidelineProgramList,guidelineDelete,programExportExcel,programImportExcel,programCurrentUserState,stateFlowCurrentCount,stateFlowTotalCount} from '../service/service.js'
    export default {
        name:'businessGuideIndex',
        data(){
            return {
                editEnable:true,
                withdrawBtn:{
                    'DEPT_LIAISON_CONFIRM':'退回',
                    'OFFICE_LIAISON_CONFIRM':'退回',
                    'RESPONSIBLE_USER_CONFIRM':'退回',
                    'SECTION_CHIEF_APPROVE':'驳回',
                    'DEPT_LIAISON_APPROVE':'驳回',
                    'DEPT_MINISTER_APPROVE':'驳回',
                    'STD_REGULATION_SECTION_CHIEF_APPROVE':'驳回',
                    'STI_DEPT_MINISTER_APPROVE':'驳回',
                    'STI_DEPT_MINISTER_APPROVE':'驳回',
                    'CENTER_STD_COMMITTEE_APPROVE':'驳回',
                    'EXPERT_APPROVE':'驳回'
                },
                approveBtn:{
                    'STI_DEPT_START':'下发',
                    'DEPT_LIAISON_CONFIRM':'下发',
                    'OFFICE_LIAISON_CONFIRM':'下发',
                    'RESPONSIBLE_USER_CONFIRM':'提交',
                    'SECTION_CHIEF_APPROVE':'同意',
                    'DEPT_LIAISON_APPROVE':'同意',
                    'DEPT_MINISTER_APPROVE':'同意',
                    'STI_DEPT_CONFIRM':'提交',
                    'STD_REGULATION_SECTION_CHIEF_APPROVE':'同意',
                    'STI_DEPT_MINISTER_APPROVE':'同意',
                    'CENTER_STD_COMMITTEE_APPROVE':'同意',
                    'EXPERT_APPROVE':'同意'
                },
                stateFlowList:[],//当前能获取的审批节点
                canClick:true,
                currentCount:{
                    count1:0,
                    count2:0
                },
                selectState:'',
                isShowSearch:false,
                searchContent:{
                    year:(new Date().getFullYear()+''),
                    businessGuideName:'',
                    dept:'',
                    operationType:'',
                    status:"",
                    reviewYear:'',
                    phaseStatus:'',
                    dateRange1:[],
                    dateRange2:[],
                    responsibleUser:'',
                    phase:''
                },
                multipleSelection: [],
                tableData: [],
                baseInfo: {
                    page: 1,
                    rows: 30,
                    total: 0
                },
                tableSelect: null

            }
        },
        components: {
            ecoContent,
            ecoLoading,
            ecoToolTitle,
            tagSelect
        },
        computed: {
            ...mapState(['operationType','supportStatus','phaseStatus','stateFlow']),
            isShowViewBtn(){
                //查看立项或复审
                return ["EXPERT_APPROVE","SECTION_CHIEF_APPROVE","DEPT_LIAISON_APPROVE","STD_REVIEWER_APPROVE","DEPT_MINISTER_APPROVE","STI_DEPT_CONFIRM","STD_REGULATION_SECTION_CHIEF_APPROVE","STI_DEPT_MINISTER_APPROVE","CENTER_STD_COMMITTEE_APPROVE","END"].includes(this.selectState)
            },
            contentTop() {
                return this.isShowSearch ? '270px' : '109px';
            }
        },
        created(){
            this.tableSelect = this.$route.query.tableSelect
            _self = this;
            this.callAction();
        },
        mounted(){
            this.initStateFlow();
        },
        methods:{
            responsibleUserConfirmCase(row){
                this.$refs.refLoading.open();
                responsibleUserConfirm(row.id).then(res=>{
                     this.$message.success('操作成功!');
                     this.restSearContent();
                })
            },
            openReexaminationSheet(row,type){
                let url ="/businessGuidemanage/index.html#/reexaminationSheet/"+row.id+'/'+type;
                EcoUtil.getSysvm().openDialog('复审', url,'1100',(type==="editCase"?'600':'500'), "15vh");
            },
            openProjectApproval(row,type){
                let url ="/businessGuidemanage/index.html#/projectApproval/"+row.id+'/'+type;
                EcoUtil.getSysvm().openDialog('立项', url,'1100',(type==="editCase"?'600':'500'), "15vh");
            },
            withdrawCase(){
                if(this.multipleSelection.length===0){
                    return EcoMessageBox.alert("当前未选中行,请勾选要退回的行再进行操作。","提示");
                }
                let url ="/businessGuidemanage/index.html#/withdrawPage";
                EcoUtil.getSysvm().openDialog('退回', url,'700', '200', "15vh");
            },
            passCase(){
                //下发
                if(['DEPT_LIAISON_APPROVE','SECTION_CHIEF_APPROVE','EXPERT_APPROVE'].includes(this.selectState)  && (this.currentCount.count1 != this.currentCount.count2)){
                    this.$message.warning('当前节点需要到达的数据总行数 小于该数量，无法执行下发操作')
                    return;
                }
                let params = {
                    phase:this.selectState
                }
                if(!['DEPT_LIAISON_APPROVE','SECTION_CHIEF_APPROVE','EXPERT_APPROVE'].includes(this.selectState)){
                    //非汇聚环节
                    if(this.multipleSelection.length===0){
                       this.$message.warning('至少勾选一条数据下发!');
                        return;
                    }
                    let arr = [];
                    let isReturn = false;
                    this.multipleSelection.forEach(item=>{
                        if(this.selectState==="RESPONSIBLE_USER_CONFIRM" && !item.operationTypeName){
                            isReturn= true;
                        }
                        arr.push(item.id);
                    })
                    if(isReturn){
                        this.$message.warning('未操作的数据不能提交!');
                        return;
                    }
                    params.ids = arr;
                }
                stateFlowPass(params).then(res=>{
                    this.restSearContent();
                    if(['DEPT_LIAISON_APPROVE','SECTION_CHIEF_APPROVE','EXPERT_APPROVE'].includes(this.selectState)){
                        this.getCurrentCount();
                    }
                })
            },
            doEdit(){
                if(this.multipleSelection.length!==1){
                    this.$message.warning('请选择一条数据!');
                    return;
                }
                this.editCase(this.multipleSelection[0],'editCase')
            },
            callAction() {
                let callBackDialogFunc = function (obj) {
                    if (obj && (obj.action === 'addBusinessGuide')) {
                        //新增刷新
                        _self.$message.success('新增成功!');
                        _self.restSearContent();
                    }else if(obj && (obj.action === 'editBusinessGuide')){
                        _self.$message.success('更新成功!');
                        _self.requestData('search',false);
                    }else if(obj && (obj.action === 'withdraw')){
                        //执行退回操作
                        _self.doWithdraw(obj.data.content)
                    }else if(obj && (obj.action === "projectApproval")){
                        //立单项
                        _self.$message.success('立项成功');
                        _self.restSearContent();
                    }else if(obj && (obj.action === "reexaminationSheet")){
                        //复单项
                        _self.$message.success('复项成功');
                        _self.restSearContent();

                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'planIndex');
            },
            doWithdraw(content){
                this.$refs.refLoading.open();
                let params = {
                    opinion:content,
                    phase:this.selectState,
                    ids:[]
                }
                this.multipleSelection.forEach(item=>{
                    params.ids.push(item.id);
                })
                programWithdraw(params).then(res=>{
                    this.$message.success('退回成功!');
                    this.restSearContent();
                    this.getCurrentCount();
                })
            },
            openHistory(id){
                let url = '/businessGuidemanage/index.html#/historyList/'+id;
                EcoUtil.getSysvm().openDialog('历史版本',url,'1200','900');
            },
            exportCase(){
                this.$refs.refLoading.open();
                let params = {
                    sort: ['modDate'],
                    order: ['desc'],
                };
                if(this.selectState !== 'STI_DEPT_START'){
                       params.phase = this.selectState
                }
                for (var key in this.searchContent) {
                    if (this.searchContent[key]) {
                        if (key == 'dateRange1' && this.searchContent[key].length == 2) {
                            params.draftCompletionTimeFrom = this.searchContent[key][0];//初稿开始时间
                            params.draftCompletionTimeTo = this.searchContent[key][1]; //初稿结束时间
                        } else if (key == 'dateRange2' && this.searchContent[key].length == 2) {
                            params.countersignCompleteTimeFrom = this.searchContent[key][0]; //会签开始时间
                            params.countersignCompleteTimeTo = this.searchContent[key][1]; //会签结束时间
                        } else {
                            params[key] = this.searchContent[key];
                        }
                    }
                }
                programExportExcel(params).then(res=>{
                    if( window.navigator && window.navigator.msSaveOrOpenBlob ) {
                        navigator.msSaveBlob(new Blob([res.data],'业务指南规划.xlsx'));
                        this.$refs.refLoading.close();
                    }else{
                        let blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
                        let url = window.URL.createObjectURL(blob);
                        let a = document.createElement("a");
                        a.href = url;
                        a.download = '业务指南规划.xlsx';
                        this.$refs.refLoading.close();
                        a.click();
                        // 释放这个临时的对象url
                        window.URL.revokeObjectURL(url);
                    }
                }).catch(err => {
                   this.$refs.refLoading.close();
                })
            },
            initCase(){
                if(this.canClick){
                    this.$refs.refLoading.open();
                    this.canClick = false;
                    programMainStartup().then(res=>{
                        this.restSearContent();
                        this.canClick = true;
                    }).catch(err=>{
                        this.canClick = true;
                        this.$refs.refLoading.close();
                    })
                }
            },
            deleteCase(){
                if(this.multipleSelection.length===0){
                    return EcoMessageBox.alert("当前未选中行,请勾选要删除的行再进行操作。","提示");
                }
                let doit = function () {
                    var ids = _self.multipleSelection.map(item=>{
                        return item.id;
                    })
                    _self.$refs.refLoading.open();
                    guidelineDelete(ids).then(res => {
                        _self.$message.success('删除成功!');
                        _self.restSearContent();
                    }).catch(err => {
                        _self.$refs.refLoading.close();
                    })
                }
                EcoMessageBox.confirm('你确定要删除数据?', '提示', { type: 'warning', lockScroll: false }, doit)
            },
            initStateFlow(){
                programCurrentUserState().then(res=>{
                    let arr = [];
                    if(res.data.data){
                        let isRespon = false; 
                        for(var key in res.data.data){
                            if(key === "RESPONSIBLE_USER_CONFIRM"){
                                //责任人确定默认显示
                                isRespon = true;
                            }
                            if(res.data.data[key]){
                               arr.push({label:res.data.data[key],id:key});
                            }
                        }
                        if(this.tableSelect) {
                            this.selectState = this.tableSelect;
                        } else {
                            this.selectState = isRespon?"RESPONSIBLE_USER_CONFIRM":arr[0].id;
                        }
                        this.stateFlowList = arr;
                        this.requestData('search',false,false);
                    }
                })
            },
            editCase(row,type){
                let _width = "1100";
                let _height = "500";
                let url;
                let dialogTitle;
                if (type === "editCase") {
                    url ="/businessGuidemanage/index.html#/editPage/" +row.id +"/editCase/" + this.selectState;
                    dialogTitle = "编辑";
                } else if (type === "viewCase") {
                    url ="/businessGuidemanage/index.html#/editPage/" + row.id +"/viewCase/" + this.selectState;
                    dialogTitle = "查看";
                    _height = "400";
                } else {
                    url ="/businessGuidemanage/index.html#/editPage/" +0 +"/addCase/" + this.selectState;
                    dialogTitle = "新增";
                }
                EcoUtil.getSysvm().openDialog(dialogTitle, url, _width, _height, "15vh");
            },
            handleSizeChange(val) {
                this.baseInfo.rows = val;
                this.requestData('search',false,true)
            },
            handleCurrentChange(val) {
                this.baseInfo.page = val;
                this.requestData('search',false,false);
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            restSearContent(){
                this.$refs.selectResponsibleUser.initDataStrFunc();
                this.$refs.selectDept.initDataStrFunc();
                this.$refs.selectDffice.initDataStrFunc();
                this.searchContent =  {
                    year:(new Date().getFullYear()+''),
                    businessGuideName:'',
                    dept:'',
                    operationType:'',
                    status:"",
                    reviewYear:'',
                    phaseStatus:'',
                    dateRange1:[],
                    dateRange2:[],
                    responsibleUser:'',
                    phase:''
                };
                this.requestData('',true,true);
            },
            requestData(type,isFirstP,isClearS){
                this.$refs.refLoading.open();
                this.editEnable = this.searchContent.year === (new Date().getFullYear()+'');
                let params = {
                    sort: ['modDate'],
                    order: ['desc'],
                    rows: this.baseInfo.rows
                };
                if(this.selectState !== 'STI_DEPT_START'){
                       params.phase = this.selectState
                }
                if (type === 'search') {
                    for (var key in this.searchContent) {
                        if (this.searchContent[key]) {
                            if (key == 'dateRange1' && this.searchContent[key].length == 2) {
                                params.draftCompletionTimeFrom = this.searchContent[key][0];//初稿开始时间
                                params.draftCompletionTimeTo = this.searchContent[key][1]; //初稿结束时间
                            } else if (key == 'dateRange2' && this.searchContent[key].length == 2) {
                                params.countersignCompleteTimeFrom = this.searchContent[key][0]; //会签开始时间
                                params.countersignCompleteTimeTo = this.searchContent[key][1]; //会签结束时间
                            } else {
                                params[key] = this.searchContent[key];
                            }
                        }
                    }
                }
                if(isFirstP){
                    this.baseInfo.page = 1;
                }
                if(isClearS){
                    this.$refs.businessGuideTable.clearSelection();
                }
                params.page = this.baseInfo.page;
                guidelineProgramList(params).then(res => {
                    this.baseInfo.total = res.data.total;
                    this.tableData = res.data.rows;
                    this.$refs.refLoading.close();
                    if(this.selectState==="RESPONSIBLE_USER_CONFIRM" || this.isShowViewBtn){
                        this.$nextTick(function(){
                            this.$refs.businessGuideTable.doLayout();
                        })
                    }
                }).catch(err => {
                    this.baseInfo.total = 0;
                    this.tableData = [];
                    this.$refs.refLoading.close();
                })

            },
            selectRoleUser(data) {
                //选择人
                if (!data.id && data.itemArray.length === 0) {
                    //人员删除
                   this.searchContent.responsibleUser='';
                } else {
                       this.searchContent.responsibleUser= data.itemArray[0].linkId;
                }
            },
            selectRoleDept(data,type){
                if (!data.id && data.itemArray.length === 0) {
                    if(type==='dept'){
                        this.searchContent.dept = '';
                    }else{
                        this.searchContent.office = '';
                    }
                } else {
                    if(type === 'dept'){
                        this.searchContent.dept = data.orgId;
                    }else{
                        this.searchContent.office = data.orgId;
                    }
                }
            },
            importCase(){
                 let doit = function(){
                    _self.$refs.businessGuideIndexUpload.$refs['upload-inner'].handleClick();//打开自定义选取文件弹窗
                }
                EcoMessageBox.confirm('导入操作会覆盖原先数据,请确定是否要执行?','提示',{ type: 'warning', lockScroll: false }, doit)
            },
            uploadFile(params){
                this.$refs.refLoading.open();
                var fileObj = params.file;
                var form = new FormData();
                form.append('file',fileObj);//file
                form.append('time',new Date().getTime());
                programImportExcel(form).then(res=>{
                    this.$message.success('导入成功');
                    this.restSearContent();
                    this.$refs.refLoading.close();
                }).catch(err=>{
                    this.$message.error('导入失败');
                    this.$refs.refLoading.close();
                })
            },
            beforeUpload(file) {
                var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
                const extension = testmsg === "xls";
                const extension2 = testmsg === "xlsx";
                if (!extension && !extension2) {
                    this.$message({
                    message: "导入文件只能是.xls,.xlsx格式!",
                    type: "warning"
                    });
                }
                return extension || extension2;
            },
            changeSearchShow() {
                this.isShowSearch = !this.isShowSearch;
            },
            changePage(val){
                console.log(val)
                //切换页面
                this.restSearContent();
                if(['DEPT_LIAISON_APPROVE','SECTION_CHIEF_APPROVE','EXPERT_APPROVE'].includes(this.selectState)){
                    this.getCurrentCount();
                }
            },
            getCurrentCount(){
                //获取当前节点拥有条数到以及应到
                Promise.all([
                 stateFlowCurrentCount(this.selectState),
                 stateFlowTotalCount(this.selectState)
                ]).then(res=>{
                    this.currentCount = {
                        count1:res[0].data.data,
                        count2:res[1].data.data //应到
                    }
                })
            },
        }
    }
</script>
<style scoped>
 .businessGuideIndex {
        color: #0f1419;
        min-width: 1000px;
        position: relative;
        height: 96%;
        margin: 0 24px;
        top: 2%;
        overflow-y: auto;
        color: #0f1419;
    }

    .businessGuideIndex .searchInputLabel {
        font-size: 14px;
        margin: 0px 5px 0px 8px;
    }

    .businessGuideIndex .searchRow {
        padding: 16px 10px 16px 10px;
        background: #fff;
    }

  .businessGuideIndex  .searchRow .el-select,
  .businessGuideIndex  .searchRow .el-input{
        width: 130px;
    }
  .businessGuideIndex  .searchRow .el-date-editor{
        width: 210px;
    }

  .businessGuideIndex  .searchRow .el-col+.el-col {
        margin-top: 7px;
    }
  .businessGuideIndex   .bottomRow{
        padding:3px 0px 0px 7px;
        font-size:15px;
        color:red;
        font-weight: 700;
    }
</style>
