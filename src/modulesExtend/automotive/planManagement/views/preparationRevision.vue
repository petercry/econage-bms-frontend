<template>
    <eco-content top='0px' bottom='0px' type='tool' style='background-color:#F5F5F5;'>
        <div class='preparationRevision'>
            <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool' style='overflow: hidden;'>
                <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
                    <el-col :span='5' style='height:30px;line-height: 30px;'>
                        <!-- <eco-tool-title title='标准计划制修订'></eco-tool-title> -->
                        <strong>{{titleList[pageType]}}</strong>
                    </el-col>
                    <el-col :span='19' style='text-align:right;margin-top:2px;'>
                        <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                        <el-button type='primary' size='small' @click="openKnow" v-show='pageType==="archive"'>存档</el-button>
                        <el-button type='primary' size='small' @click="initCase"  v-show='pageType==="revision"'>启动</el-button>
                        <!-- <el-button type='primary' size='small' @click="exportCase">导出</el-button> -->
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content v-show='isShowSearch' top='59px' height='200px' type='tool' style='border:1px solid #ddd;overflow: hidden;'>
                <el-row class="searchRow">
                    <el-col>
                        <span class='searchInputLabel'>标准分类:</span>
                        <el-select filterable v-model='searchContent.stdCategory' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item) in standardType' :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>标准编号:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.stdCode'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>标准名称:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.stdName'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>&ensp;部门:</span>
                        <tag-select placeholder="选择机构" style="min-width:130px;max-width:300px;vertical-align: top;" initDataStr="" ref='selectDept'
                            :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'dept')}">
                        </tag-select>
                    </el-col>
                    <el-col>
                        <span class='searchInputLabel'>&ensp;替代标准:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.substituteCode'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>&ensp;当前审批人:</span>
                        <tag-select ref='selectCurrApprovalUser' initDataStr="" placeholder="选择人员" style="width:150px;vertical-align: top;"  :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data,'currApprovalUser')}">
                        </tag-select>
                   
                        <span class='searchInputLabel'>来源编号:</span>
                        <el-input  placeholder='请输入' readonly @click.native.stop='selectQuality' :value='searchContent.sourceCode'></el-input>
                        <!-- <span class='searchInputLabel'>&emsp;制定人:</span>
                        <tag-select ref='selectDrafter' initDataStr="" placeholder="选择人员" style="width:150px;vertical-align: top;"  :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data,'drafter')}">
                        </tag-select> -->
                        <span class='searchInputLabel'  v-show='pageType==="archive"'>归档状态:</span>
                        <el-select v-show='pageType==="archive"' filterable v-model='searchContent.archiveStatus' clearable>
                            <el-option value='DOING' label='未完成'></el-option>
                            <el-option value='DONE' label='已完成'></el-option>
                        </el-select>
                    </el-col>
                    <el-col>
                        <span class='searchInputLabel' style="float:left;margin-right: 6px;">&emsp;分标委:</span>
                        <div class='selectSubcommittee' style="float:left" @click.stop='selectSubcommittee'>{{searchContent.subcommitteeName||'请选择'}}</div>     
                        <span class='searchInputLabel'>&emsp;体系码:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.systemCode'
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
                        <span class='searchInputLabel'>初稿完成时间:</span>
                        <el-date-picker  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="searchContent.dateRange1"
                            value-format='yyyy-MM-dd' type="daterange" placeholder="选择日期">
                        </el-date-picker>
                        <span class='searchInputLabel'>会签完成时间:</span>
                        <el-date-picker  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="searchContent.dateRange2"
                            value-format='yyyy-MM-dd' type="daterange" placeholder="选择日期">
                        </el-date-picker>
                        <span class='searchInputLabel'>发布时间:</span>
                        <el-date-picker  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="searchContent.dateRange3"
                            value-format='yyyy-MM-dd' type="daterange" placeholder="选择日期">
                        </el-date-picker>
                    </el-col>
                    <el-col>
                        <span class='searchInputLabel'>制/修订状态:</span>
                        <el-select filterable v-model='searchContent.revisionStatus' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item,index) in editStatus' :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>责任人:</span>
                        <tag-select ref='selectResponsibleUser' initDataStr="" placeholder="选择人员" style="width:150px;vertical-align: top;"  :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data,'responsibleUser')}">
                        </tag-select>
                        <span class='searchInputLabel'>&emsp;制/修订:</span>
                        <el-select filterable v-model='searchContent.revisionType'  clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item) in editType' :key='item.id'></el-option>
                        </el-select>
                        <el-button @click='requestData("search",true,true)' type='primary' style='margin-left:5px;'>查询</el-button>
                        <el-button @click='restSearContent'>重置</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table row-key='id' ref='planManageTab' @selection-change="handleSelectionChange"  highlight-current-row stripe :data='tableData' header-row-class-name='tableHeader'
                    border tooltip-effect='dark' height='100%' class='standardizationTable'>
                    <el-table-column type="selection" width="55" reserve-selection>
                    </el-table-column>
                    <el-table-column type='index' label='序号'>
                        <template slot-scope='scope'>
                            {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop='year' label='年度'></el-table-column> -->
                    <el-table-column prop='deptName' width='140' show-overflow-tooltip label='部门'></el-table-column>
                    <el-table-column prop='stdCategoryName' label='标准分类'></el-table-column>
                    <el-table-column prop='stdCode' label='标准编号' width='160' show-overflow-tooltip></el-table-column>
                    <el-table-column prop='stdTypeName' label='标准类型'></el-table-column>
                    <el-table-column prop='stdName' label='标准名称' show-overflow-tooltip width='150'>
                        <!-- <template slot-scope='scope'>
                            <span class="linkB cursorP" @click='openWfViewOperate(scope.row.wfId)'>{{scope.row.stdName}}</span>
                        </template> -->
                    </el-table-column>
                    <el-table-column prop='archiveStatusName' v-if='pageType==="archive"' label='归档状态' width='150'></el-table-column>
                    <el-table-column prop='draftCompleteTime' width='150' label='初稿完成时间'></el-table-column>
                    <el-table-column prop='countersignCompleteTime' width='150' label='会签完成时间'></el-table-column>
                    <el-table-column prop='officeName' label='科室' width='140' show-overflow-tooltip></el-table-column> 
                    <!-- <el-table-column prop='' label='制定人'></el-table-column> -->
                    <el-table-column prop='responsibleUserName' label='责任人'></el-table-column>
                    <el-table-column prop='subcommitteeName' label='分标委' width='200' show-overflow-tooltip></el-table-column> 
                    <el-table-column prop='sourceCode' label='来源编号' width='200' show-overflow-tooltip>
                        <!-- <template slot-scope='scope'>
                            <span>{{restSourceNumberList(scope.row.sourceNumberList)}}</span>
                        </template> -->
                    </el-table-column>
                    <el-table-column prop='systemCode' width='150' label='体系码'></el-table-column>
                    <el-table-column prop='revisionTypeName' label='制/修订'></el-table-column>
                    <el-table-column prop='currApprovalUser' label='当前审批人' width='150'></el-table-column>
                    <el-table-column prop='revisionStatusName' label='制修订状态' width='150'></el-table-column>
                    <el-table-column prop='publishDate' label='发布时间' width='150'></el-table-column>
                    <el-table-column label='操作' fixed='right' width='160'>
                        <template slot-scope='scope'>
                            <span class="linkB cursorP" v-if='pageType==="archive"'  @click='viewCase(scope.row.substituteId)'>替代版次</span>
                            <span class="linkB cursorP" v-if='pageType==="archive"' @click='historyList(scope.row.wfId)'>流程历史</span>
                            <span class="linkB cursorP" v-if='pageType==="archive"' @click='viewFileCase(scope.row.id)'>文档</span>
                            <span class="linkB cursorP" v-if='pageType==="revision"'  @click='openWfViewOperate(scope.row.wfId)'>流程查看</span>
                        </template>
                    </el-table-column>
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
    import {stdRevisionList,getWFOperateId,stdRevisionStart,stdRevisionArchiveFile,getWFViewOperateId} from '../service/service.js'
    import {EcoMessageBox} from '@/components/messageBox/main.js'
    import { EcoUtil } from "@/components/util/main.js";
    import {mapState} from 'vuex'
    import {sysEnv} from '../config/env.js'
    export default {
        name:'preparationRevision',
        data(){
            return {
                canclick:true,
                titleList:{
                    revision:'标准计划制修订',
                    archive:'归档'
                },
                isShowSearch:true,
                baseInfo: {
                    page: 1,
                    rows: 30,
                    total: 0
                },
                searchContent:{
                    stdCategory:'',
                    stdCode:'',
                    stdName:'',
                    dept:"",
                    office:"",
                    sourceCodeItems:[],
                    sourceCode:'',
                    dateRange1:[],
                    dateRange2:[],
                    dateRange3:[],
                    drafter:'',
                    currApprovalUser:'',
                    revisionType:'',
                    year:'',
                    subcommitteeName:'',
                    subcommittee:'',
                    systemCode:'',
                    // editApproveName:'',
                    revisionStatus:'',
                    substituteCode:'',
                    archiveStatus:''
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
            ...mapState(['standardType','editType','editStatus']),
            contentTop() {
                return this.isShowSearch ? '260px' : '59px';
            },
            pageType(){
                return this.$route.params.pageType;
            }
        },
        created(){
            _self = this;
            this.callAction();
            if(this.pageType === 'archive'){
                this.searchContent.archiveStatus = 'DOING';
                this.searchContent.revisionStatus = 'DONE'; 
            }
        },
        mounted(){
            this.requestData('search',false,false);
        },
        methods:{
            viewFileCase(id){
                let url ="/planManagement/index.html#/fileView/"+id+"/stdPlanRevision";
                EcoUtil.getSysvm().openDialog('附件查看', url,'400', '300', "15vh");
            },
            historyList(_wfId){
                if(this.canclick){
                    this.$refs.refLoading.open();
                    this.canclick = false;
                    let formView = 1;
                    let _ccId = null;
                    getWFViewOperateId(_wfId,formView,_ccId).then((response)=>{
                        if(response.data.status == 0){
                            let operateId = response.data.operate_id;
                            EcoUtil.getSysvm().showFlowHis(operateId);
                        }else{
                            EcoMessageBox.alert(response.data.msg);
                        } 
                        this.$refs.refLoading.close();
                        this.canclick = true;
                    }) 
                }
            },
            openWfViewOperate(_wfId){
                if(!_wfId){
                    this.$message.warning('流程未发起!');
                    return;
                }
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
            viewCase(id){
                if(id){
                    let url ="/planManagement/index.html#/preparationDetails/"+id ;
                    EcoUtil.getSysvm().openDialog('查看', url,'800', '700', "15vh");
                }else{
                    this.$message.warning('该标准暂无替代版次');
                }
            },
            openKnow(){
                if(this.multipleSelection.length===0){
                    this.$message.warning('请至少选择一条数据!');
                    return ;
                }
                let bool = this.multipleSelection.some(item=>{
                    return item.archiveStatus === 'DONE'
                });
                if(bool){
                    this.$message.warning('勾选中有归档完成的数据,请取消勾选!');
                    return ;  
                }
                let url ="/planManagement/index.html#/knowLedgeIndex" ;
                EcoUtil.getSysvm().openDialog('知识库', url,'900', '600', "15vh");
            },
            doitKnowCase(data){
                //归档
                let params = {
                    parentId:data.parentId,
                    baseId:data.baseId,
                    id:[]
                }
                this.multipleSelection.forEach(item=>{
                    params.id.push(item.id);
                })
                stdRevisionArchiveFile(params).then(res=>{
                    console.log(res);
                    this.$message.success('归档成功!');
                    this.restSearContent();
                })
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
                        _self.searchContent.sourceCode = obj.data.sourceNumberList.join('、');
                        _self.searchContent.sourceCodeItems = obj.data.sourceNumberItems;
                    }else  if(obj && (obj.action === 'selectKnowLib')){
                         _self.doitKnowCase(obj.data);
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'preparationRevision');
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
                        this.searchContent.drafter = '';
                    }else if(type === 'responsibleUser'){
                        this.searchContent.responsibleUser='';
                    }else{
                        this.searchContent.currApprovalUser='';
                    }
                } else {
                   if(type==='drafter'){
                      this.searchContent.drafter = data.itemArray[0].linkId;
                   }else if(type === 'responsibleUser'){
                      this.searchContent.responsibleUser = data.itemArray[0].linkId;
                   }else{
                        this.searchContent.currApprovalUser = data.itemArray[0].linkId;
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
                        if(key!=='subcommitteeName' && key!=='sourceCode' && this.searchContent[key]){
                             if(key == 'dateRange1' && this.searchContent[key].length == 2){
                                params.draftCompleteTimeFrom = this.searchContent[key][0];
                                params.draftCompleteTimeTo = this.searchContent[key][1]; 
                             }else if(key == 'dateRange2' && this.searchContent[key].length == 2){    
                                params.countersignCompleteTimeFrom = this.searchContent[key][0];
                                params.countersignCompleteTimeTo = this.searchContent[key][1]; 
                             }else if(key == 'dateRange3' && this.searchContent[key].length == 2){    
                                params.publishDateFrom = this.searchContent[key][0];
                                params.publishDateTo = this.searchContent[key][1]; 
                             }else{
                                params[key] = this.searchContent[key];
                             }
                        }
                    }
                (params).then(res => {
                    if( window.navigator && window.navigator.msSaveOrOpenBlob ) {
                        navigator.msSaveBlob(new Blob([res.data],'标准制修订.xlsx'));
                        this.$refs.refLoading.close();
                    }else{
                        let blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" }); 
                        let url = window.URL.createObjectURL(blob);  
                        let a = document.createElement("a");
                        a.href = url;
                        a.download = '标准制修订.xlsx';
                        this.$refs.refLoading.close();
                        a.click();
                        window.URL.revokeObjectURL(url);
                    }
                }).catch(err => {
                    this.$refs.refLoading.close();
                })

            },
            initCase(){
                if(this.multipleSelection.length!==1){
                    this.$message.warning('请选择一条数据!');
                    return;    
                }
                if(this.multipleSelection[0].revisionStatus!=="WAITING"){
                    this.$message.warning('制修订状态不是未开始状态不能启动!');
                    return;    
                }
                this.$refs.refLoading.open();
                stdRevisionStart(this.multipleSelection[0].id).then(res=>{
                    getWFOperateId(res.data.startTaskId).then(response => {
                        this.$refs.refLoading.close();
                        if (response.data.status == 0) {
                        let operateId = response.data.operate_id;
                        if (sysEnv == 1) {
                            let tabObj = {};
                            let goPage = "flowform/index.html#/wfDetail/" + res.data.startTaskId + "/" + operateId;
                            tabObj.desc = '新建流程';
                            tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wfDetail" + res.data.startTaskId + "',href_link:'" + goPage + "',fullScreen:true}";
                            window.parent.window.sysvm.doTab(tabObj);
                        }
                        } else {
                        EcoMessageBox.alert(response.data.msg);
                        }
                    })
                })
            },
            restSearContent() {
                this.$refs.selectCurrApprovalUser.initDataStrFunc();
                // this.$refs.selectDrafter.initDataStrFunc();
                this.$refs.selectResponsibleUser.initDataStrFunc();
                this.$refs.selectDept.initDataStrFunc();
                this.$refs.selectDffice.initDataStrFunc();
                this.searchContent = {
                    stdCategory:'',
                    stdCode:'',
                    stdName:'',
                    dept:"",
                    office:"",
                    sourceCodeItems:[],
                    sourceCode:'',
                    dateRange1:[],
                    dateRange2:[],
                    dateRange3:[],
                    drafter:'',
                    currApprovalUser:'',
                    revisionType:'',
                    year:'',
                    subcommitteeName:'',
                    subcommittee:'',
                    systemCode:'',
                    // editApproveName:'',
                    revisionStatus:'',
                    substituteCode:'',
                    archiveStatus:''
                };
                this.requestData('search',true,true);
            },
            requestData(type,isFirstP,isClearS) {
                this.$refs.refLoading.open();
                let params = {
                    sort: ['modDate'],
                    order: ['desc'],
                    rows: this.baseInfo.rows
                };
                if (type === 'search') {
                    for (var key in this.searchContent) {
                        if(key!=='subcommitteeName' && key!=='sourceCode' && this.searchContent[key]){
                             if(key == 'dateRange1' && this.searchContent[key].length == 2){
                                params.draftCompleteTimeFrom = this.searchContent[key][0];
                                params.draftCompleteTimeTo = this.searchContent[key][1]; 
                             }else if(key == 'dateRange2' && this.searchContent[key].length == 2){    
                                params.countersignCompleteTimeFrom = this.searchContent[key][0];
                                params.countersignCompleteTimeTo = this.searchContent[key][1]; 
                             }else if(key == 'dateRange3' && this.searchContent[key].length == 2){    
                                params.publishDateFrom = this.searchContent[key][0];
                                params.publishDateTo = this.searchContent[key][1]; 
                             }else{
                                params[key] = this.searchContent[key];
                             }
                        }
                    }
                }
                if(isClearS){
                    this.$refs.planManageTab.clearSelection();
                }
                if(isFirstP){
                    this.baseInfo.page = 1;
                }
                params.page = this.baseInfo.page;
                stdRevisionList(params).then(res => {
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
                this.requestData('search',true,false)
            },
            handleCurrentChange(val) {
                this.baseInfo.page = val;
                this.requestData("search",false,false);
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
    .preparationRevision {
        color: #0f1419;
        /* min-width: 1000px; */
        position: relative;
        height: 96%;
        margin: 0 24px;
        top: 2%;
        overflow-y: auto;
        color: #0f1419;
    }
    .preparationRevision .searchInputLabel {
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
    .preparationRevision .selectSubcommittee{
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
    .preparationRevision .searchRow{
        padding:15px 10px 16px 10px;
        background:#fff
    }
    .preparationRevision .searchRow .el-input,
    .preparationRevision .searchRow .el-select{
        width:150px;
    }
    .preparationRevision .searchRow .el-date-editor{
        width:200px;
    }
    .preparationRevision .searchRow .el-col+.el-col{
        margin-top:7px;
    }
</style>