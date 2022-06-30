<template>
    <eco-content top='0px' bottom='0px' type='tool' style='background: #f5f5f5'>
        <div class="planIndex">
            <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool' style='overflow:hidden;'>
                <el-row style='padding:16px;background: #fff;border:1px solid #ddd;'>
                    <el-col :span='5'>
                        <strong>{{(selectState=="END"?"发布完成":stateFlowList[selectState])}}</strong>
                    </el-col>
                    <el-col :span='19' style="text-align:right">
                        <el-select v-model="selectState" @change='changePage'>
                            <el-option v-for="item in stateList" :key="item.id" :label="item.label" :value="item.id">
                            </el-option>
                          </el-select>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content top='60px' height='50px' type='tool' style='border-left:1px solid #ddd;border-right:1px solid #ddd;;overflow:hidden;padding:7px 0px 0px 10px;background-color: #fff'>
                <el-row>
                    <el-col>
                        <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                        <!-- <el-button type='primary' size='small' @click='openDeptLiaisionProof' v-if='selectState==="DEPT_LIAISON_PROOF"'>指定科室联络员</el-button> -->
                        <el-button type='primary' size='small' @click='initCase' v-if='selectState==="TECH_INNOVATION_DEPT_CREATE"'>启动计划</el-button>
                        <el-button type='primary' size='small' @click='editCase({},"addCase")' v-if='(selectState==="TECH_INNOVATION_DEPT_CREATE"  || selectState==="OFFICE_LIAISON_HANDLE")'>新增</el-button>
                        <el-button type='primary' size='small' @click='getIdDoEdit' v-if='(["TECH_INNOVATION_DEPT_CREATE","DEPT_LIAISON_PROOF","OFFICE_LIAISON_HANDLE"].includes(selectState) || (selectState==="TECH_INNOVATION_DEPT_PENDING" && btnRoleObj["std.plan-publish.publish_modify"]))'>修改</el-button>
                        <el-button type='danger' size='small'  @click='deleteCase' v-if='(selectState==="TECH_INNOVATION_DEPT_CREATE" ||  selectState==="OFFICE_LIAISON_HANDLE")'>删除</el-button>
                        <el-button type='primary' size='small' @click='passCase' v-if='approveBtn[selectState]'>{{approveBtn[selectState]}}</el-button>
                        <el-button type='primary' size='small' @click='withdrawCase' v-if='selectState!="TECH_INNOVATION_DEPT_CREATE" && selectState!="END" && selectState!="TECH_INNOVATION_DEPT_PENDING"'>退回</el-button>
                        <el-button type='primary' size='small' @click='publishCase' v-if='selectState==="TECH_INNOVATION_DEPT_PENDING"'>发布</el-button>
                        <el-button type='primary' size='small' @click='exportCase'>导出</el-button>
                        <el-button type='primary' size='small' @click='importCase' v-if='selectState==="TECH_INNOVATION_DEPT_CREATE"'>导入</el-button>
                        <el-upload v-show='false' ref='planIndexUpload' :auto-upload='true' :http-request="uploadFile" action="" :before-upload='beforeUpload'
                            :show-file-list='false'  accept='.xls,.xlsx'>
                        </el-upload>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content v-show='isShowSearch' top='109px' height='160px' type='tool'
                style='border:1px solid #ddd;overflow: hidden;'>
                <el-row class="searchRow">
                    <el-col>
                        <span class='searchInputLabel'>年度:</span>
                        <el-date-picker style='width:160px;' v-model="searchContent.year" type="year" value-format='yyyy' placeholder="选择年">
                        </el-date-picker>
                        <span class='searchInputLabel'>&ensp;部门:</span>
                        <!-- <el-input clearable @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.dept'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input> -->
                        <tag-select placeholder="选择机构" style="min-width:130px;max-width:300px;vertical-align: top;" initDataStr="" ref='selectDept'
                            :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'dept')}">
                        </tag-select>
                        <span class='searchInputLabel'>标准编号:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.programNumber'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>标准名称:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.programName'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                    </el-col>
                    <el-col>
                        <span class='searchInputLabel'>标准分类:</span>
                        <el-select filterable v-model='searchContent.classification' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item) in standardType' :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>初稿完成时间:</span>
                        <el-date-picker  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="searchContent.dateRange1"
                            value-format='yyyy-MM-dd' type="daterange" placeholder="选择日期">
                        </el-date-picker>
                        <span class='searchInputLabel'>会签完成时间:</span>
                        <el-date-picker  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="searchContent.dateRange2"
                            value-format='yyyy-MM-dd' type="daterange" placeholder="选择日期">
                        </el-date-picker>
                    </el-col>
                    <el-col style='display: flex;align-items: center;'>
                        <span class='searchInputLabel'>&emsp;科室:</span>
                        <!-- <el-input clearable @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.office'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input> -->
                        <tag-select placeholder="选择机构" style="width:130px;vertical-align: top;" initDataStr="" ref='selectDffice'
                            :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'office')}">
                        </tag-select>
                        <span class='searchInputLabel'>责任人:</span>
                        <!-- <el-input clearable @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.responsibleUser'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input> -->
                        <tag-select ref='selectResponsibleUser' initDataStr="" placeholder="选择人员" style="width:130px;vertical-align: top;"  :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data,'responsibleUser')}">
                        </tag-select>

                        <span class='searchInputLabel' style="margin-right: 10px;">&emsp;分标委:</span>
                        <!-- <el-input clearable @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.subcommittee'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input> -->
                        <div class='selectSubcommittee'  @click.stop='selectSubcommittee'>{{searchContent.subcommitteeName||'请选择'}}</div>
                        <span class='searchInputLabel'>&emsp;制/修订:</span>
                        <el-select filterable v-model='searchContent.editType'  clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item) in editType' :key='item.id'></el-option>
                        </el-select>
                    </el-col>
                    <el-col>
                        <span class='searchInputLabel'>&emsp;&ensp;体系码:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.systemCode'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>审批状态:</span>
                        <el-select filterable v-model='searchContent.phaseStatus'  clearable>
                            <el-option :value='key' :label='val' v-for='(val,key) in phaseStatusList' :key='key'></el-option>
                        </el-select>
                        <!-- <span class='searchInputLabel'>制定人:</span> -->
                        <!-- <el-input clearable @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.drafter'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input> -->
                        <!-- <tag-select ref='selectDrafter' initDataStr="" placeholder="选择人员" style="width:130px;vertical-align: top;"  :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data,'drafter')}">
                        </tag-select> -->

                        <!-- <span class='searchInputLabel'>来源编号:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.sourceNumber'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input> -->            
                        <!-- <span class='searchInputLabel'>当前审批人:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.a'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input> -->
                        <span class='searchInputLabel' v-show='selectState==="END"'>环节节点:</span>
                        <el-select filterable v-model='searchContent.phaseId' v-show='selectState==="END"' clearable>
                            <el-option :value='key' :label='val' v-for='(val,key) in stateFlowList' :key='key'></el-option>
                        </el-select>
                        <el-button @click='requestData("search",true,true)' type='primary' style='margin-left:5px;'>查询</el-button>
                        <el-button @click='restSearContent'>重置</el-button>
                    </el-col>

                </el-row>
            </eco-content>
            <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table row-key='id' border ref='planIndexTable' @selection-change="handleSelectionChange" stripe
                    :data='tableData' header-row-class-name='tableHeader' tooltip-effect='dark' height='100%' class='planIndexTable'>
                    <el-table-column type="selection" width="55" reserve-selection></el-table-column>
                    <el-table-column type='index' label='序号' align='center'>
                        <template slot-scope='scope'>
                            {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                        </template>
                    </el-table-column>
                    <el-table-column prop='year' label='年度' width='60'></el-table-column>
                    <el-table-column prop='deptName' label='部门' width='140' show-overflow-tooltip></el-table-column>
                    <el-table-column prop='classificationName' label='标准分类'></el-table-column>
                    <el-table-column prop='typeName' label='标准类型'></el-table-column>
                    <el-table-column prop='programNumber' label='标准编号' width='100'></el-table-column>
                    <el-table-column prop='programName' label='标准名称' width='200' show-overflow-tooltip>
                        <template slot-scope='scope'>
                            <span class='linkB cursorP' @click='editCase(scope.row,"viewCase")'>{{scope.row.programName}}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column  label='环节名称'  width='150'  prop='phaseName'></el-table-column> -->
                    <el-table-column prop='draftTime' label='初稿完成时间' width='95'></el-table-column>
                    <el-table-column prop='countersignTime' label='会签完成时间' width='95'></el-table-column>
                    <el-table-column prop='officeName' label='科室' width='120'></el-table-column>
                    <!-- <el-table-column prop='drafterName' label='制定人'></el-table-column> -->
                    <el-table-column prop='responsibleUserName' label='责任人'></el-table-column>
                    <el-table-column prop='subcommitteeName' label='分标委' width='180'></el-table-column>
                    <el-table-column prop='sourceNumberList' label='来源编号' width='200'>
                        <template slot-scope='scope'>
                            <span>{{restSourceNumberList(scope.row.sourceNumberList)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='editTypeName' label='制/修订'></el-table-column>
                    <el-table-column prop='systemCode' label='体系码' width='170'></el-table-column>
                    <el-table-column prop='phaseIdName' label='审批节点'></el-table-column>
                    <el-table-column prop='phaseStatusName' label='审批状态'></el-table-column>
                    <!-- <el-table-column prop='' label='当前审批人'></el-table-column> -->
                    <el-table-column  label='流程历史意见' align='center' fixed='right' width='120'>
                        <template slot-scope='scope'>
                            <span class="linkB cursorP" @click='openApproveList(scope.row)'>查看</span>
                        </template>
                    </el-table-column>
                </el-table>
            </eco-content>
            <eco-content bottom="0px" type="tool" style="padding:5px 0px">
                <el-row>
                    <el-col :span='10' class='bottomRow'>
                        <span v-if='selectState!=="TECH_INNOVATION_DEPT_CREATE" && selectState!=="END"'>已到达{{currentCount.count1}}条/共{{currentCount.count2}}条(所有条数到达才可提交下一环节,否则只能驳回)</span>
                    </el-col>
                    <el-col :span="14" style="text-align:right">
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
    import {getRoleBtnSetting,techInnovationDeptCreatePublish,stateFlowTotalCount,stateFlowCurrentCount,stateFlowCurrentUserStateList,stateFlowPass,planPublishMainList,innovationDeptCreate,planPublishMainDelete,mainExcelExport,mainExcelImport} from '../service/service.js'
    export default {
        data() {
            return {
                btnRoleObj:{},
                approveBtn:{
                    TECH_INNOVATION_DEPT_CREATE:'下发',
                    DEPT_LIAISON_PROOF:'下发',
                    OFFICE_LIAISON_HANDLE:'提交',
                    SPECIFIC_DEPT_SECTION_CHIEF_VERIFY:'同意',
                    DEPT_LIAISON_VERIFY:'同意',
                    STD_REVIEWER_VERIFY:'同意',
                    SPECIFIC_DEPT_MINISTER_VERIFY:'同意',
                },
                currentCount:{},
                selectState:'',
                stateList:[],
                canClick:true,
                isShowSearch: false,
                searchContent: {
                    classification:'',
                    programNumber:'',
                    programName:'',
                    dept:'',
                    phaseStatus:'',
                    editType:'',
                    dateRange1:[],
                    dateRange2:[],
                    office:'',
                    // drafter:'',
                    responsibleUser:'',
                    year:(new Date().getFullYear())+'',
                    subcommittee:'',
                    subcommitteeName:'',
                    // sourceNumber:'',
                    systemCode:'',
                    phaseId:''
                },
                multipleSelection: [],
                tableData: [],
                baseInfo: {
                    page: 1,
                    rows: 30,
                    total: 0
                }
            }
        },
        created(){
            _self=this;
            if(this.$route.query.tableSelect) {
                this.selectState = this.$route.query.tableSelect
            }
            this.initStateList();
            this.callAction();
            this.initRole();
        },
        mounted(){},
        computed: {
            ...mapState(['phaseStatusList','standardType','editType','stateFlowList']),
            contentTop() {
                return this.isShowSearch ? '270px' : '109px';
            },
        },
        components: {
            ecoContent,
            ecoLoading,
            ecoToolTitle,
            tagSelect
        },
        methods: {
            initRole() {
                const btn_array = [
                  'std.plan-publish.publish_modify'
                ];
                getRoleBtnSetting(btn_array).then(res => {
                    if (res.data) {
                        this.btnRoleObj = res.data.authenticationMap;
                    }
                });
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
            selectSubcommittee(){
                var url = '/standardPlanRelease/index.html#/subcommitteeList/'+true+'?action='+"selectSubcommittee2"
                EcoUtil.getSysvm().openDialog('分标委', url, 1000, 600, '15vh');
            },
            publishCase(){
                this.$refs.refLoading.open();
                techInnovationDeptCreatePublish().then(res=>{
                    this.restSearContent();
                }).catch(err=>{
                    this.$refs.refLoading.close();
                })
            },
            withdrawCase(){
                //退回操作
                if(this.multipleSelection.length===0){
                    return EcoMessageBox.alert("当前未选中行,请勾选要退回的行再进行操作。","提示");
                }
                let arr = this.multipleSelection.map(item=>{
                    return item.id;
                })
                let url ="/standardPlanRelease/index.html#/withdrawPage/" +this.selectState+'/'+ JSON.stringify(arr);
                EcoUtil.getSysvm().openDialog('退回', url,'700', '200', "15vh");
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
            openDeptLiaisionProof(){
                let url ="/standardPlanRelease/index.html#/deptLiaisionProof";
                EcoUtil.getSysvm().openDialog('维护科室联络人', url,'800', '600', "15vh");
            },
            changePage(val){
                //切换页面
                this.restSearContent();
                //!发起
                if(this.selectState!=='TECH_INNOVATION_DEPT_CREATE' && this.selectState!=='END'){
                    this.getCurrentCount();
                }
            },
            initStateList(){
                //节点列表
                stateFlowCurrentUserStateList().then(res=>{
                    let arr = [];
                    if(res.data.data){
                        for(var key in res.data.data){
                            if(res.data.data[key]){
                               arr.push({label:res.data.data[key],id:key});
                            }
                        }
                    }
                    if(!this.selectState) {
                        this.selectState = arr[0].id;
                    }
                    this.stateList = arr;
                    this.requestData('search',false,false);
                })
            },
            openApproveList(row){
                let url ="/standardPlanRelease/index.html#/approveHistory/" +row.id;
                EcoUtil.getSysvm().openDialog('查看', url,'1200', '900', "15vh");//800 600
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
            callAction() {
                let callBackDialogFunc = function (obj) {
                    if (obj && (obj.action === 'addPlan')) {
                        //新增刷新
                        _self.$message.success('新增成功!');
                        _self.restSearContent();
                    } else if (obj.action === 'editPlan') {
                        //编辑刷新
                        _self.$message.success('编辑成功!');
                        _self.requestData('search',false,true);
                    }else if(obj.action==='withdraw'){
                        _self.restSearContent();
                        _self.getCurrentCount();
                    }else if(obj.action==='deptLiaisionProof'){
                        //指定联络人科室
                        _self.$message.success('操作成功!');
                    }else if(obj.action==='selectSubcommittee2'){
                        //查询条件分标委
                        // _self.searchContent.subcommitteeName
                        _self.searchContent.subcommitteeName =obj.dataArr.name;
                        _self.searchContent.subcommittee = obj.dataArr.id;
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'planIndex');
            },
            getIdDoEdit(){
                 if(this.multipleSelection.length===0){
                    this.$message.warning('请至少选择一条数据!');
                    return;
                 }
                 if(this.multipleSelection.length>1){
                    this.$message.warning('请选择一条数据进行操作!');
                    return;
                 }
                 if((this.selectState ==="TECH_INNOVATION_DEPT_CREATE") && (this.multipleSelection[0].phaseId !== this.selectState)){
                    //发起开始环节拥有以后多个环节的数据
                    this.$message.warning('只能修改当前环节的数据!');
                    return;
                 }
                 this.editCase({id:this.multipleSelection[0].id},"editCase")
            },
            editCase(row,type){
                let _width = "1100";
                let _height = "600";
                let url;
                let dialogTitle;
                if (type === "editCase") {
                    url ="/standardPlanRelease/index.html#/editPlanPage/" +row.id +"/editCase/"+this.selectState;
                    dialogTitle = "编辑";
                } else if (type === "viewCase") {
                    url ="/standardPlanRelease/index.html#/editPlanPage/" + row.id +"/viewCase/"+this.selectState;
                    dialogTitle = "查看";
                    _height = "500";
                } else {
                    url ="/standardPlanRelease/index.html#/editPlanPage/" +0 +"/addCase/"+this.selectState;
                    dialogTitle = "新增";
                }
                EcoUtil.getSysvm().openDialog(dialogTitle, url, _width, _height, "15vh");
            },
            passCase(){
                //下发
                if(this.selectState!='TECH_INNOVATION_DEPT_CREATE'  && (this.currentCount.count1 != this.currentCount.count2)){
                    this.$message.warning('当前节点需要到达的数据总行数 小于该数量，无法执行下发操作')
                    return;
                }
                stateFlowPass(this.selectState).then(res=>{
                    this.restSearContent();
                    if(this.selectState!='TECH_INNOVATION_DEPT_CREATE'){
                        this.getCurrentCount();
                    }
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
            uploadFile(params){
                this.$refs.refLoading.open();
                var fileObj = params.file;
                var form = new FormData();
                form.append('file',fileObj);//file
                form.append('time',new Date().getTime());
                mainExcelImport(form).then(res=>{
                    this.$message.success('导入成功');
                    this.restSearContent();
                    this.$refs.refLoading.close();
                }).catch(err=>{
                    this.$message.error('导入失败');
                    this.$refs.refLoading.close();
                })
            },
            importCase(){
                 let doit = function(){
                    _self.$refs.planIndexUpload.$refs['upload-inner'].handleClick();//打开自定义选取文件弹窗
                }
                EcoMessageBox.confirm('导入操作会覆盖原先数据,请确定是否要执行?','提示',{ type: 'warning', lockScroll: false }, doit)
            },
            exportCase(){
                this.$refs.refLoading.open();
                let params = {
                    sort: ['modDate'],     // 排序字段列表
                    order: ['desc'],    // 排序方式列表，asc升序，desc降序
                };
                if(this.selectState !=='TECH_INNOVATION_DEPT_CREATE'){
                    //发起页面 不仅包含此环节的信息
                    params.phaseId = this.selectState;
                }
                for (var key in this.searchContent) {
                    if (this.searchContent[key]) {
                        if (key == 'dateRange1' && this.searchContent[key].length == 2) {
                            params.draftTimeFrom = this.searchContent[key][0];//初稿开始时间
                            params.draftTimeTo = this.searchContent[key][1]; //初稿结束时间
                        } else if (key == 'dateRange2' && this.searchContent[key].length == 2) {
                            params.countersignTimeFrom = this.searchContent[key][0]; //会签开始时间
                            params.countersignTimeTo = this.searchContent[key][1]; //会签结束时间
                        } else {
                            params[key] = this.searchContent[key];
                        }
                    }
                }
                mainExcelExport(params).then(res => {
                    let blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement("a");
                    a.href = url;
                    a.download = '标准计划发布.xlsx';
                    this.$refs.refLoading.close();
                    a.click();
                    // 释放这个临时的对象url
                    window.URL.revokeObjectURL(url);
                }).catch(err => {
                   this.$refs.refLoading.close();
                })

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
                    planPublishMainDelete(ids).then(res => {
                        _self.multipleSelection=[];
                        _self.$message.success('删除成功!');
                        _self.restSearContent();
                    }).catch(err => {
                        _self.$refs.refLoading.close();
                    })
                }
                EcoMessageBox.confirm('你确定要删除数据?', '提示', { type: 'warning', lockScroll: false }, doit)
            },
            initCase(){
                if(this.canClick){
                    this.$refs.refLoading.open();
                    this.canClick = false;
                    innovationDeptCreate().then(res=>{
                        this.restSearContent();
                        this.canClick = true;
                    }).catch(err=>{
                        this.canClick = true;
                        this.$refs.refLoading.close();
                    })
                }
            },
            restSearContent(){
                // this.$refs.selectDrafter.initDataStrFunc();
                this.$refs.selectResponsibleUser.initDataStrFunc();
                this.$refs.selectDept.initDataStrFunc();
                this.$refs.selectDffice.initDataStrFunc();
                this.searchContent =  {
                    classification:'',
                    programNumber:'',
                    programName:'',
                    dept:'',
                    phaseStatus:'',
                    editType:'',
                    dateRange1:[],
                    dateRange2:[],
                    office:'',
                    // drafter:'',
                    responsibleUser:'',
                    year:(new Date().getFullYear())+'',
                    // sourceNumber:'',
                    systemCode:'',
                    subcommitteeName:'',
                    subcommittee:'',
                    phaseId:''
                };
                this.requestData('',true,true);
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            changeSearchShow() {
                this.isShowSearch = !this.isShowSearch;
            },
            handleSizeChange(val) {
                this.baseInfo.rows = val;
                this.requestData('search',false,true)
            },
            handleCurrentChange(val) {
                this.baseInfo.page = val;
                this.requestData('search',false,false);
            },
            requestData(type,isFirstP,isClearSel) {
                this.$refs.refLoading.open();
                let params = {
                    sort: ['modDate'],
                    order: ['desc'],
                    rows: this.baseInfo.rows
                };
                if(this.selectState !=='TECH_INNOVATION_DEPT_CREATE'){
                    //发起页面 不仅包含此环节的信息
                    params.phaseId = this.selectState;
                }
                if (type === 'search') {
                    for (var key in this.searchContent) {
                        if (this.searchContent[key] && key!=='subcommitteeName') {
                            if (key == 'dateRange1' && this.searchContent[key].length == 2) {
                                params.draftTimeFrom = this.searchContent[key][0];//初稿开始时间
                                params.draftTimeTo = this.searchContent[key][1]; //初稿结束时间
                            } else if (key == 'dateRange2' && this.searchContent[key].length == 2) {
                                params.countersignTimeFrom = this.searchContent[key][0]; //会签开始时间
                                params.countersignTimeTo = this.searchContent[key][1]; //会签结束时间
                            } else {
                                params[key] = this.searchContent[key];
                            }
                        }
                    }
                }
                if(isFirstP){
                    this.baseInfo.page = 1;
                }
                if(isClearSel){
                    this.$refs.planIndexTable.clearSelection();
                }
                params.page = this.baseInfo.page;
                planPublishMainList(params).then(res => {
                    // console.log(res);
                    this.baseInfo.total = res.data.total;
                    this.tableData = res.data.rows;
                    this.$refs.refLoading.close();
                }).catch(err => {
                    this.baseInfo.total = 0;
                    this.tableData = [];
                    this.$refs.refLoading.close();
                })
            }
        }

    }
</script>
<style scoped>
    .planIndex {
        color: #0f1419;
        min-width: 1000px;
        position: relative;
        height: 96%;
        margin: 0 24px;
        top: 2%;
        overflow-y: auto;
        color: #0f1419;
    }

    .planIndex .searchInputLabel {
        font-size: 14px;
        margin: 0px 5px 0px 8px;
        /* width: 90px;
        display: inline-block;
        text-align: right; */
    }

    .planIndex .searchRow {
        padding: 16px 10px 16px 10px;
        background: #fff;
    }

    .searchRow .el-select,
    .searchRow .el-input{
        width: 130px;
    }
    .searchRow .el-date-editor{
        width: 210px;
    }

    .searchRow .el-col+.el-col {
        margin-top: 7px;
    }
    .planIndex .bottomRow{
        padding:3px 0px 0px 7px;
        font-size:15px;
        color:red;
        font-weight: 700;
    }
    .planIndex .selectSubcommittee{
        width:130px;
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

    /* .el-date-editor.el-input__inner */
</style>
