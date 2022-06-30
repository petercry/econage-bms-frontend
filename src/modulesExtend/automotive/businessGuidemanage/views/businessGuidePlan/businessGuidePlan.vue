<template>
    <eco-content top='0px' bottom='0px' type='tool' style='background: #f5f5f5'>
        <div class="businessGuidePlan">
            <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool' style='overflow:hidden;'>
                <el-row style='padding:16px;background: #fff;border:1px solid #ddd;'>
                    <el-col :span='5'>
                        <strong>{{statePlanFlow[selectState]}}</strong>
                    </el-col>
                    <el-col :span='19' style="text-align:right">
                        <el-select v-model="selectState" @change='changePage'>
                            <el-option v-for="(item,index) in stateFlowList" :key="item.id" :label="item.label"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content top='60px' height='50px' type='tool'
                style='border-left:1px solid #ddd;border-right:1px solid #ddd;;overflow:hidden;padding:7px 0px 0px 10px;background-color: #fff'>
                <el-row>
                    <el-col>
                        <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                        <el-button type='primary' size='small' @click='initCase'
                            v-show='selectState==="STI_DEPT_START"'>启动计划</el-button>
                        <el-button type='primary' size='small'
                            v-show='["STI_DEPT_START","DEPT_LIAISON_CONFIRM","STI_DEPT_PUBLISH"].includes(selectState)'
                            @click='editCase({},"addCase")'>新增</el-button>
                        <el-button type='primary' size='small' @click='doEdit'
                            v-show='["STI_DEPT_START","DEPT_LIAISON_CONFIRM","STI_DEPT_PUBLISH"].includes(selectState)'>
                            修改</el-button>
                        <el-button type='primary' size='small'
                            v-show='["STI_DEPT_START","DEPT_LIAISON_CONFIRM"].includes(selectState)' @click='deleteCase'>删除</el-button>
                        <el-button type='primary' size='small' @click='passCase' v-show='selectState!=="END"'>{{approveBtn[selectState]}}</el-button>
                        <el-button type='primary' size='small' @click='withdrawCase' v-show='selectState!=="STI_DEPT_START" && selectState!=="END"'>退回</el-button>
                        <el-button type='primary' size='small' @click='exportCase'>导出</el-button>
                        <el-button type='primary' size='small' @click='importCase' v-show='selectState==="STI_DEPT_START"'>导入</el-button>
                        <el-upload v-show='false' ref='businessGuidePlanUpload' :auto-upload='true' :http-request="uploadFile" action="" :before-upload='beforeUpload'
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
                        <el-date-picker style='width:160px;' v-model="searchContent.year" type="year"
                            value-format='yyyy' placeholder="选择年">
                        </el-date-picker>
                        <span class='searchInputLabel'>业务指南名称:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true,true)"
                            v-model='searchContent.businessGuideName' placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>部门:</span>
                        <tag-select placeholder="选择机构" style="min-width:130px;max-width:300px;vertical-align: top;"
                            initDataStr="" ref='selectDept' :initOptions="{selectNum:1,selectType:'Dept'}"
                            @callBack="(data)=>{selectRoleDept(data,'dept')}">
                        </tag-select>
                        <span class='searchInputLabel'>&emsp;科室:</span>
                        <tag-select placeholder="选择机构" style="width:130px;vertical-align: top;" initDataStr=""
                            ref='selectDffice' :initOptions="{selectNum:1,selectType:'Dept'}"
                            @callBack="(data)=>{selectRoleDept(data,'office')}">
                        </tag-select>
                    </el-col>
                    <el-col>
                        <span class='searchInputLabel'>初稿完成时间:</span>
                        <el-date-picker range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                            v-model="searchContent.dateRange1" value-format='yyyy-MM-dd' type="daterange"
                            placeholder="选择日期">
                        </el-date-picker>
                        <span class='searchInputLabel'>会签完成时间:</span>
                        <el-date-picker range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                            v-model="searchContent.dateRange2" value-format='yyyy-MM-dd' type="daterange"
                            placeholder="选择日期">
                        </el-date-picker>
                        <span class='searchInputLabel'>责任人:</span>
                        <tag-select ref='selectResponsibleUser' initDataStr="" placeholder="选择人员"
                            style="width:130px;vertical-align: top;" :initOptions="{selectNum:1,selectType:'User'}"
                            @callBack="(data)=>{selectRoleUser(data)}">
                        </tag-select>
                    </el-col>
                    <el-col>
                        <span class='searchInputLabel'>审批状态:</span>
                        <el-select filterable v-model='searchContent.phaseStatus' clearable>
                            <el-option :value='key' :label='val' v-for='(val,key) in planPhaseStatus' :key='key'>
                            </el-option>
                        </el-select>
                        <span class='searchInputLabel'>制/修订:</span>
                        <el-select filterable v-model='searchContent.editType' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item,index) in editType'
                                :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel' v-show='selectState==="END"'>环节节点:</span>
                        <el-select filterable v-model='searchContent.phase' v-show='selectState==="END"' clearable>
                            <el-option :value='key' :label='val' v-for='(val,key) in statePlanFlow' :key='key'></el-option>
                        </el-select>
                        <el-button @click='requestData("search",true,true)' type='primary' style='margin-left:5px;'>查询
                        </el-button>
                        <el-button @click='restSearContent'>重置</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table row-key='id' border ref='businessGuidePlanTable' @selection-change="handleSelectionChange"
                    stripe :data='tableData' header-row-class-name='tableHeader' tooltip-effect='dark' height='100%'
                    class='businessGuidePlanTableTable'>
                    <el-table-column type="selection" width="55" reserve-selection></el-table-column>
                    <el-table-column type='index' label='序号' align='center'>
                        <template slot-scope='scope'>
                            {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                        </template>
                    </el-table-column>
                    <el-table-column label='年度' prop='year'></el-table-column>
                    <el-table-column label='部门' prop='deptName'></el-table-column>
                    <el-table-column label='业务指南名称' prop='businessGuideName'>
                        <template slot-scope='scope'>
                             <span class="linkB cursorP" @click='editCase(scope.row,"viewCase")'>{{scope.row.businessGuideName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column  label='环节名称'  width='150'  prop='phaseName'></el-table-column>
                    <el-table-column label='初稿完成时间' prop='draftCompletionTime'></el-table-column>
                    <el-table-column label='会签完成时间' prop='countersignCompleteTime'></el-table-column>
                    <el-table-column label='科室' prop='officeName' width='200' show-overflow-tooltip></el-table-column>
                    <el-table-column label='制/修订' prop='editTypeName'></el-table-column>
                    <el-table-column label='责任人' prop='responsibleUserName'></el-table-column>
                    <el-table-column label='审批状态' prop='phaseStatusName'></el-table-column>
                    <el-table-column label='当前审批人' prop='currentAssigneeName'></el-table-column>
                    <el-table-column label='流程历史意见' align='center' fixed='right' width='120'>
                        <template slot-scope='scope'>
                            <span class="linkB cursorP" @click='openHistory(scope.row.id)'>查看</span>
                        </template>
                    </el-table-column>
                </el-table>
            </eco-content>
            <eco-content bottom="0px" type="tool" style="padding:5px 0px">
                <el-row>
                    <el-col :span='10' class='bottomRow'
                        v-show="selectState!=='END'">
                        <span>已到达{{currentCount.count1}}条/共{{currentCount.count2}}条(所有条数到达才可提交下一环节,否则只能驳回)</span>
                    </el-col>
                    <el-col :span="selectState!=='END'?14:24" style="text-align:right">
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
    import { mapState } from 'vuex'
    import {planPublishSendBack,planPublishExcelImport,planPublishExcelExport,planPublishFlowPass, planPublishDelete, planPublishTotalCount, planPublishCurrentCount, planPublishMainList, planPublishCurrentState, planPublishStartup } from '../../service/service.js'
    export default {
        name: 'businessGuidePlan',
        data() {
            return {
                approveBtn:{
                    DEPT_LIAISON_CONFIRM:"提交",
                    DEPT_MINISTER_APPROVE:'同意',
                    SECTION_CHIEF_APPROVE:'同意',
                    STI_DEPT_PUBLISH:'发起',
                    STI_DEPT_START:"提交"
                },
                canClick: true,
                stateFlowList: [],
                baseInfo: {
                    page: 1,
                    rows: 30,
                    total: 0
                },
                currentCount: {
                    count1: 0,
                    count2: 0
                },
                multipleSelection: [],
                tableData: [],
                selectState: '',
                isShowSearch: false,
                searchContent: {
                    year: (new Date().getFullYear() + ''),
                    businessGuideName: '',
                    dept: '',
                    office: '',
                    dateRange1: [],
                    dateRange2: [],
                    responsibleUser: '',
                    phaseStatus: '',
                    editType: "",
                    phase:''
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
        created() {
            this.tableSelect = this.$route.query.tableSelect
            _self = this;
            this.callAction();
        },
        mounted() {
            this.initStateFlow();
        },
        computed: {
            ...mapState(['statePlanFlow', 'planPhaseStatus', 'editType']),
            contentTop() {
                return this.isShowSearch ? '270px' : '109px';
            },
        },
        methods: {
            callAction() {
                let callBackDialogFunc = function (obj) {
                    if(obj && (obj.action === 'withdraw')){
                        //执行退回操作
                        _self.doWithdraw(obj.data.content)
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'businessGuidePlan');
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
                planPublishSendBack(params).then(res=>{
                    this.$message.success('退回成功!');
                    this.restSearContent();
                    this.getCurrentCount();
                })
            },
            withdrawCase(){
                if(this.multipleSelection.length===0){
                    return EcoMessageBox.alert("当前未选中行,请勾选要退回的行再进行操作。","提示");
                }
                let url ="/businessGuidemanage/index.html#/withdrawPage";
                EcoUtil.getSysvm().openDialog('退回', url,'700', '200', "15vh");
            },
            openHistory(id){
                let url = '/businessGuidemanage/index.html#/planHistoryList/'+id;
                EcoUtil.getSysvm().openDialog('历史版本',url,'1200','900');
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
                planPublishExcelImport(form).then(res=>{
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
                    _self.$refs.businessGuidePlanUpload.$refs['upload-inner'].handleClick();//打开自定义选取文件弹窗
                }
                EcoMessageBox.confirm('导入操作会覆盖原先数据,请确定是否要执行?','提示',{ type: 'warning', lockScroll: false }, doit)
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
                planPublishExcelExport(params).then(res=>{
                    if( window.navigator && window.navigator.msSaveOrOpenBlob ) {
                        navigator.msSaveBlob(new Blob([res.data],'业务指南计划发布.xlsx'));
                        this.$refs.refLoading.close();
                    }else{
                        let blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
                        let url = window.URL.createObjectURL(blob);
                        let a = document.createElement("a");
                        a.href = url;
                        a.download = '业务指南计划发布.xlsx';
                        this.$refs.refLoading.close();
                        a.click();
                        // 释放这个临时的对象url
                        window.URL.revokeObjectURL(url);
                    }
                }).catch(err => {
                   this.$refs.refLoading.close();
                })
            },
            passCase() {
                //下发
                if ((this.currentCount.count1 != this.currentCount.count2)) {
                    this.$message.warning('当前节点需要到达的数据总行数 小于该数量，无法执行下发操作')
                    return;
                }
                let params = {
                    phase: this.selectState
                }
                // if (this.selectState === 'STI_DEPT_START') {
                //     //非汇聚环节
                //     if (this.multipleSelection.length === 0) {
                //         this.$message.warning('至少勾选一条数据下发!');
                //         return;
                //     }
                //     let arr = [];
                //     this.multipleSelection.forEach(item => {
                //         arr.push(item.id);
                //     })
                //     params.ids = arr;
                // }
                planPublishFlowPass(params).then(res => {
                    this.restSearContent();
                    this.getCurrentCount();
                })

            },
            deleteCase() {
                if (this.multipleSelection.length === 0) {
                    return EcoMessageBox.alert("当前未选中行,请勾选要删除的行再进行操作。", "提示");
                }
                let doit = function () {
                    var ids = _self.multipleSelection.map(item => {
                        return item.id;
                    })
                    _self.$refs.refLoading.open();
                    planPublishDelete(ids).then(res => {
                        _self.$message.success('删除成功!');
                        _self.restSearContent();
                    }).catch(err => {
                        _self.$refs.refLoading.close();
                    })
                }
                EcoMessageBox.confirm('你确定要删除数据?', '提示', { type: 'warning', lockScroll: false }, doit)
            },
            doEdit() {
                if (this.multipleSelection.length !== 1) {
                    this.$message.warning('请选择一条数据!');
                    return;
                }
                this.editCase(this.multipleSelection[0], 'editCase')
            },
            initCase() {
                if (this.canClick) {
                    this.$refs.refLoading.open();
                    this.canClick = false;
                    planPublishStartup().then(res => {
                        this.restSearContent();
                        this.canClick = true;
                    }).catch(err => {
                        this.canClick = true;
                        this.$refs.refLoading.close();
                    })
                }
            },
            initStateFlow() {
                planPublishCurrentState().then(res => {
                    let arr = [];
                    if (res.data.data) {
                        for (var key in res.data.data) {
                            if (res.data.data[key]) {
                                arr.push({ label: res.data.data[key], id: key });
                            }
                        }
                        // this.selectState = arr[0].id;
                        if(this.tableSelect) {
                            this.selectState = this.tableSelect;
                        } else {
                            this.selectState = arr[0].id;
                        }
                        this.stateFlowList = arr;
                        this.requestData('', false, false);
                    }
                })
            },
            handleSizeChange(val) {
                this.baseInfo.rows = val;
                this.requestData('search', false, true)
            },
            handleCurrentChange(val) {
                this.baseInfo.page = val;
                this.requestData('search', false, false);
            },
            restSearContent() {
                this.$refs.selectResponsibleUser.initDataStrFunc();
                this.$refs.selectDept.initDataStrFunc();
                this.$refs.selectDffice.initDataStrFunc();
                this.searchContent = {
                    year: (new Date().getFullYear() + ''),
                    businessGuideName: '',
                    dept: '',
                    office: '',
                    dateRange1: [],
                    dateRange2: [],
                    responsibleUser: '',
                    phaseStatus: '',
                    editType: "",
                    phase:''
                };
                this.requestData('', true, true);
            },
            requestData(type, isFirstP, isClearS) {
                this.$refs.refLoading.open();
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
                if (isFirstP) {
                    this.baseInfo.page = 1;
                }
                if (isClearS) {
                    this.$refs.businessGuidePlanTable.clearSelection();
                }
                params.page = this.baseInfo.page;
                planPublishMainList(params).then(res => {
                    this.baseInfo.total = res.data.total;
                    res.data.rows.forEach(item=>{
                        this.editType.forEach(item2=>{
                            if(item.editType === item2.id){
                                item.editTypeName = item2.text;
                            }
                        })
                    })
                    this.tableData = res.data.rows;
                    this.$refs.refLoading.close();
                }).catch(err => {
                    this.baseInfo.total = 0;
                    this.tableData = [];
                    this.$refs.refLoading.close();
                })

            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            selectRoleUser(data) {
                //选择人
                if (!data.id && data.itemArray.length === 0) {
                    //人员删除
                    this.searchContent.responsibleUser = '';

                } else {
                    this.searchContent.responsibleUser = data.itemArray[0].linkId;
                }
            },
            selectRoleDept(data, type) {
                if (!data.id && data.itemArray.length === 0) {
                    if (type === 'dept') {
                        this.searchContent.dept = '';
                    } else {
                        this.searchContent.office = '';
                    }
                } else {
                    if (type === 'dept') {
                        this.searchContent.dept = data.orgId;
                    } else {
                        this.searchContent.office = data.orgId;
                    }
                }
            },
            editCase(row, type) {
                let _width = "1100";
                let _height = "500";
                let url;
                let dialogTitle;
                if (type === "editCase") {
                    url = "/businessGuidemanage/index.html#/editPlan/" + row.id + "/editCase/" + this.selectState;
                    dialogTitle = "编辑";
                } else if (type === "viewCase") {
                    url = "/businessGuidemanage/index.html#/editPlan/" + row.id + "/viewCase/" + this.selectState;
                    dialogTitle = "查看";
                    _height = "400";
                } else {
                    url = "/businessGuidemanage/index.html#/editPlan/" + 0 + "/addCase/" + this.selectState;
                    dialogTitle = "新增";
                }
                EcoUtil.getSysvm().openDialog(dialogTitle, url, _width, _height, "15vh");
            },
            changePage(val) {
                //切换页面
                this.restSearContent();
                //!发起
                if (this.selectState !== 'END') {
                    this.getCurrentCount();
                }
            },
            getCurrentCount() {
                //获取当前节点拥有条数到以及应到
                Promise.all([
                    planPublishCurrentCount(this.selectState),
                    planPublishTotalCount(this.selectState)
                ]).then(res => {
                    this.currentCount = {
                        count1: res[0].data.data,
                        count2: res[1].data.data //应到
                    }
                })
            },
            changeSearchShow() {
                this.isShowSearch = !this.isShowSearch;
            },
        }
    }
</script>
<style scoped>
    .businessGuidePlan {
        color: #0f1419;
        min-width: 1000px;
        position: relative;
        height: 96%;
        margin: 0 24px;
        top: 2%;
        overflow-y: auto;
        color: #0f1419;
    }

    .businessGuidePlan .searchInputLabel {
        font-size: 14px;
        margin: 0px 5px 0px 8px;
    }

    .businessGuidePlan .searchRow {
        padding: 16px 10px 16px 10px;
        background: #fff;
    }

    .businessGuidePlan .searchRow .el-select,
    .businessGuidePlan .searchRow .el-input {
        width: 130px;
    }

    .businessGuidePlan .searchRow .el-date-editor {
        width: 210px;
    }

    .businessGuidePlan .searchRow .el-col+.el-col {
        margin-top: 7px;
    }

    .businessGuidePlan .bottomRow {
        padding: 3px 0px 0px 7px;
        font-size: 15px;
        color: red;
        font-weight: 700;
    }
</style>
