<template>
    <!-- <eco-content top="0px" bottom="0px" type="tool" style="background-color:#f5f5f5;"> -->
        <div class="taskList">
            <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
            <!-- <eco-content top="70px" height="60px" type="tool" style="border:1px solid #ddd;"> -->
                <el-row style="padding:0 10px;background-color:#fff;border-bottom:1px solid #ddd;">
                    <el-col :span="8">
                        <eco-tool-title style="line-height: 43px;margin-right:50px;" title="我的任务"></eco-tool-title>
                    </el-col>
                    <el-col :span="8" style="text-align:center;">
                        <el-tabs class="listTab" v-model="activeName" @tab-click="handleTabClick">
                            <el-tab-pane label="任务类" name="task"></el-tab-pane>
                            <el-tab-pane label="问题风险类" name="notice"></el-tab-pane>
                            <el-tab-pane label="流程类" name="flowform"></el-tab-pane>
                            <el-tab-pane label="公告类" name="plan"></el-tab-pane>
                        </el-tabs>
                    </el-col>   
                    <el-col :span="8" >   
                        <el-select v-show="activeName == 'task'" style="position:absolute;right:10px;top:8px;width:260px;"  multiple  v-model="baseInfo.status" placeholder="请选择" @change="getDataList">
                            <!-- <el-option label="全部状态" value=""> </el-option> -->
                            <el-option v-for="(item, index) in faw_pm_work_status" :key="index" :label="item.text" :value="item.id"> </el-option>
                        </el-select>
                        
                        <el-radio-group v-show="activeName == 'notice'||activeName == 'plan'" style="position:absolute;right:10px;top:8px;" v-model="baseInfo.click" @change="getDataList">
                            <el-radio-button label="-1">全部</el-radio-button>
                            <el-radio-button label="false">未读</el-radio-button>
                            <el-radio-button label="true">已读</el-radio-button>
                        </el-radio-group>
                    </el-col>
                </el-row>
                <div style="height:232px;" v-loading="loading">
                <el-table @header-dragend="changeColWidth" @row-dblclick='goDetail' header-row-class-name='tableHeader' :data="dataList" v-show="!loading"
                    border tooltip-effect="dark" style="width: 100%;" size="mini" class="ecoList" height="100%" stripe>
                    <el-table-column type="index" label="序号" width='50' min-width="50" fixed='left' :key="1">
                        <template slot-scope="scope">
                            {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="状态" align='center' width="60" fixed='left' :key="2" v-if="activeName == 'task'">
                        <template slot-scope='scope' style='cursor: pointer;'>
                            <span class="statusItem" :class="scope.row.color"></span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="type"
                        label="类别"
                        width="120"
                        v-if="activeName == 'notice'||activeName == 'plan'"
                        :key="8"
                        min-width="120"
                    >
                        <template slot-scope="scope">
                            {{restData("faw_pm_notice_type",scope.row.type)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="groupName"
                        label="类别"
                        width='160'
                        key="10"
                        v-if="activeName == 'flowform'"
                        min-width="160"
                        >
                        <template slot-scope="scope">{{scope.row.groupName + (scope.row.subGroupName? "-" + scope.row.subGroupName :"")}}</template>
                    </el-table-column>
                    <el-table-column prop="name" label="任务名称"  align='center' min-width="120"  :key="3" fixed='left' v-if="activeName == 'task' || activeName == 'notice'||activeName == 'plan'">
                        <template slot-scope='scope' style='cursor: pointer;'>
                             <span @click="goDetail(scope.row)" class="pointerClass">{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="request_desc"
                        label="任务名称"
                        min-width="120"
                        :key="11"
                        v-if="activeName == 'flowform'"
                        >
                        <template slot-scope="scope">
                            <span class="pointerClass" style="display:block;" @click="goDetail(scope.row)">{{ scope.row.requestDesc }} | <i v-if="scope.row.taskName" class="taskName">{{scope.row.taskName}}</i></span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="type" label="任务类型" width='100' min-width="80">
                        <template slot-scope="scope">
                            {{restData("faw_pm_type",scope.row.type)}}
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="projectName" label="所属项目" min-width="100" align='center' v-if="activeName == 'task'">
                        <template slot-scope='scope'>
                          <span>{{scope.row.infoName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="status_id"
                        label="任务状态"
                        width='100'
                        key="12"
                        v-if="activeName == 'flowform'"
                        min-width="100">
                        <template slot-scope="scope"><span class="circle" v-bind:class="scope.row.statusName == '待办'?'red':'blue'"></span> {{ scope.row.statusName }}</template>
                    </el-table-column>
                    <el-table-column prop="planStartDate" :key="5" label="开始时间" v-if="activeName == 'task'" min-width="170" width="170" align='center'>
                    </el-table-column>
                    <el-table-column prop="planEndDate" :key="6" min-width="100" label="计划完成时间" v-if="activeName == 'task'" align='center'>
                    </el-table-column>
                    <el-table-column prop="liableUserName" :key="18" min-width="100" label="责任人" v-if="activeName == 'task'" align='center'>
                    </el-table-column>

                    <el-table-column
                        prop="formUsername"
                        label="来自"
                        width='100'
                        :key="13"
                        min-width="100"
                        v-if="activeName == 'flowform'">
                        <template slot-scope="scope">{{scope.row.formUsername}}</template>
                    </el-table-column>

                    <el-table-column
                        prop="assign_date"
                        label="到达时间"
                        width='180'
                        :key="14"

                        min-width="160"
                        v-if="activeName == 'flowform'">
                        <template slot-scope="scope">{{scope.row.assignDate?scope.row.assignDate.substring(0,16):''}}</template>
                    </el-table-column>
                    <el-table-column
                        prop="createDate"
                        label="到达时间"
                        width='120'

                        key="9"
                        v-if="activeName == 'notice'||activeName == 'plan'"
                        min-width="100"
                        >
                        <template slot-scope="scope">{{scope.row.createDate?scope.row.createDate.substring(0,10):''}}</template>
                    </el-table-column>
                    <el-table-column
                        prop="initUserName"
                        label="启动人员"
                        width='100'
                        :key="15"
                        min-width="160"
                        v-if="activeName == 'flowform'">
                    </el-table-column>
                    <el-table-column
                        prop="init_date"
                        label="启动时间"
                        width='180'

                        :key="17"
                        min-width="160"
                        v-if="activeName == 'flowform'">
                        <template slot-scope="scope">{{ scope.row.initDate?scope.row.initDate.substring(0,16):''}}</template>
                    </el-table-column>
                </el-table>
                </div>
            <!-- </eco-content> -->
            <!-- <eco-content bottom="0px" type="tool" style="padding:5px 0px">
                <el-row>
                    <el-col :span="24" style="text-align:right">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="baseInfo.page" :page-sizes="[10,30,50,100]"
                            :page-size="baseInfo.rows" layout="total, sizes, prev, pager, next, jumper" :total="baseInfo.total"
                            style="margin-right:20px">
                        </el-pagination>
                    </el-col>
                </el-row>
            </eco-content> -->
        </div>
    <!-- </eco-content> -->
</template>
<script>
    let _self;
    import ecoContent from '@/components/pageAb/ecoContent.vue'
    import ecoLoading from '@/components/loading/ecoLoading.vue'
    import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
    import { EcoUtil } from '@/components/util/main.js'
    import { EcoMessageBox } from '@/components/messageBox/main.js'
    import { projectWorkTaskList,projectTaskDoUrl,getTaskNoticeList,getTaskWFModuleAjax,getWFOperateId,readNoticeInfo } from '@/modules/system/service/service.js'
    import { getEnumSelectEnabled, getKVSingleInfo } from '@/modules/projectManager/api/common.js'
import { mapState } from 'vuex';
    export default {
        name: 'taskList',
        components: {
            ecoContent,
            ecoLoading,
            ecoToolTitle
        },
        data() {
            return {
                faw_pm_work_status: [],
                faw_pm_notice_type: [],
                searchContent: {
                    name: '',
                    id: ''
                },
                dataList: [],
                loading:false,
                baseInfo: {
                    page: 1,
                    rows: 9999,
                    total: 0,
                    status:['faw_pm_work_status1','faw_pm_work_status2','faw_pm_work_status3'],
                    userId:"",
                    click:-1,
                    homeType:''
                },
                activeName:'task'
            }
        },
        computed: {
            ...mapState(['loginUser'])
        },
        created() {
            getEnumSelectEnabled('faw_pm_work_status').then(res => {
                this.faw_pm_work_status = res;
            })
            getEnumSelectEnabled('faw_pm_notice_type').then(res => {
                this.faw_pm_notice_type = res;
            })
        },
        mounted() {
            this.baseInfo.homeType = window.projectHomeSetting&&window.projectHomeSetting.id ||'';
            this.resetTaskParams();
            this.getDataList();
        },
        methods: {
            handleTabClick(tab,event){
                if(tab.name === "task"){
                    this.resetTaskParams();
                }else if(tab.name === "notice"||tab.name === "plan"){
                    this.resetNoticeParams();
                }else if(tab.name === "flowform"){
                    this.resetFlowformParams();
                }
                this.getDataList();
            },
            resetTaskParams(){
                this.$set(this.baseInfo,"status",['faw_pm_work_status1','faw_pm_work_status2','faw_pm_work_status3']);
                this.s_dates = [];
                // if (this.$route.name=='projectPortal1'){
                    this.baseInfo.userId = this.loginUser.id;
                // }else{
                //     this.baseInfo.userId = '';
                // }
            },
            resetNoticeParams(){
                this.$set(this.baseInfo,"status",'');
                this.$set(this.baseInfo,"click","-1");
                this.baseInfo.userId = this.loginUser.id;
            },
            resetFlowformParams(){
                this.$set(this.baseInfo,"status",'');
            },
            getDataList(){
                if(this.activeName === 'task'){
                    // this.resetTaskParams();
                    this.getTaskListDataFunc();
                }else if(this.activeName === 'notice'||this.activeName==='plan'){
                    // this.resetNoticeParams();
                    this.getNoticeListDataFunc();
                }else if(this.activeName === 'flowform'){
                    // this.resetFlowformParams();
                    this.getWFToDoFunc();
                }
            },
            getTaskListDataFunc(){
                let baseInfo = JSON.parse(JSON.stringify(this.baseInfo));
                baseInfo.publishStatus = "faw_pm_work_publish_status3";
                this.loading = true;
                projectWorkTaskList(baseInfo).then(res => {
                    this.dataList = res.data.rows;
                    this.baseInfo.total = res.data.total;
                    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        this.loading = false;
                    });
                })
            },
            getNoticeListDataFunc(){
                let baseInfo = JSON.parse(JSON.stringify(this.baseInfo));
                this.loading = true;
                getTaskNoticeList(baseInfo).then(res=>{
                    this.dataList = res.data.rows.filter(item=>{
                        if (this.activeName === 'notice'){
                            return (item.type!='faw_pm_notice_type1')
                        }else{
                            return item.type=='faw_pm_notice_type1'
                        }
                    });
                    this.baseInfo.total = res.data.total;
                    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        //this.$refs.multipleTable.doLayout();
                        this.loading = false;
                    });
                })
            },
            getWFToDoFunc(){
                let baseInfo = JSON.parse(JSON.stringify(this.baseInfo));
                this.loading = true;
                baseInfo.sort='assign_date';
                baseInfo.order='desc';
                getTaskWFModuleAjax(baseInfo).then((res)=>{
                    this.dataList = res.data.list;
                    this.baseInfo.total = res.data.count;
                    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        //this.$refs.multipleTable.doLayout();
                        this.loading = false;
                    });
                }).catch((error)=>{
                });
            },
            goDetail(item) {
                if(this.activeName == 'task'){
                    if(item.status == 'faw_pm_work_status1'){
                        projectTaskDoUrl(item.id).then(res=>{
                            let tabObj = {};
                            let goPage = 'projectManager/index.html#/projectCard/' + item.infoId + '/taskInfo/'+ item.id;
                            tabObj.desc ='任务详情';
                            tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'" + ('任务详情'+ item.id) + "',href_link:'" + goPage + "',fullScreen:false}";
                            window.sysvm.doTab(tabObj);
                        })
                    }else{
                        let tabObj = {};
                        let goPage = 'projectManager/index.html#/projectCard/' + item.infoId + '/taskInfo/'+ item.id;
                        tabObj.desc ='任务详情';
                        tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'" + ('任务详情'+ item.id) + "',href_link:'" + goPage + "',fullScreen:false}";
                        window.sysvm.doTab(tabObj);
                    }
                // projectTaskDoUrl(item.id).then(res=>{
                //     let tabObj = {};
                //     let goPage = res.data;
                //     tabObj.desc = '任务详情';
                //     tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'',href_link:'" + goPage + "',fullScreen:false}";
                //     window.sysvm.doTab(tabObj);
                // }).catch(e=>{})
                }else if(this.activeName == 'notice'||this.activeName == 'plan'){
                readNoticeInfo(item.id).then(res=>{
                    item.click = true;
                })
                if (item.type=='faw_pm_notice_type1'){//计划下发
                
                    let tabObj = {};
                    let goPage = 'projectManager/index.html#/projectCard/' + item.infoId + '/planGantt';
                    tabObj.desc ='项目计划';
                    tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'" + ('项目计划'+ item.infoId) + "',href_link:'" + goPage + "',fullScreen:false}";
                    window.sysvm.doTab(tabObj);

                }
                if (item.type=='faw_pm_notice_type2'){//问题
                
                    let tabObj = {};
                    let goPage = 'projectManager/index.html#/projectCard/' + item.infoId + '/detailProblem/'+ item.modelId;
                    tabObj.desc ='问题详情';
                    tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'" + ('问题详情'+ item.modelId) + "',href_link:'" + goPage + "',fullScreen:false}";
                    window.sysvm.doTab(tabObj);

                }
                if (item.type=='faw_pm_notice_type3'){//风险
                
                
                    let tabObj = {};
                    let goPage = 'projectManager/index.html#/projectCard/' + item.infoId + '/detailRisk/'+ item.modelId;
                    tabObj.desc ='风险详情';
                    tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'" + ('风险详情'+ item.modelId) + "',href_link:'" + goPage + "',fullScreen:false}";
                    window.sysvm.doTab(tabObj);

                }
                }else if(this.activeName == 'flowform'){
                    console.log(item)
                    getWFOperateId(item.id).then((res)=>{
                        let response = res.data;
                        if(response.status == 0){
                            let operateId = response.operate_id;
                            // AlphaManual
                            if(response.remap && response.remap.pc_url){
                                    let tabObj = {};
                                    let goPage = response.remap.pc_url;
                                    let reg = new RegExp("{{taskId}}", "g");
                                    goPage=goPage.replace(reg,response.remap.task_id);
                                    tabObj.desc = response.remap.agent_name;
                                    tabObj.tabKey = "documanageAdd";
                                    tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'documanageAdd"+response.remap.task_id+"',doNothing:'N',cmd:'v3.goPage',goPage:'"+goPage+"'}";
                                    window.parent.window.sysvm.doTab(tabObj);
                            }else{
                                // if(sysEnv == 1){
                                    try {
                                        let tabObj = {};
                                        let goPage = "flowform/index.html#/wfDetail/"+item.id+"/"+operateId;
                                        tabObj.desc = '待办流程';
                                        tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wfDetail"+item.id+"',href_link:'"+goPage+"',fullScreen:true}";
                                        window.parent.window.sysvm.doTab(tabObj); 
                                    } catch (error) {}
                                // }else{
                                //     this.$router.push({name:'wfDetail',params:{taskId:item.id,operateId:operateId}})
                                // }
                            }

                        }else{
                            EcoMessageBox.alert(response.msg);
                        }
                    })
                }
                // let tabObj = {};
                // let goPage = 'projectManager/index.html#/projectCard/' + item.id;
                // tabObj.desc = item.name + '项目详情';
                // tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'" + (item.name + '项目详情') + "',href_link:'" + goPage + "',fullScreen:false}";
                // window.sysvm.doTab(tabObj);
            },
            goPage(type) {
                let tabObj = {};
                let goPage;
                if (type === 'forView') {
                    goPage = 'workHours/index.html#/workHour-forView';
                    tabObj.desc = '工时查看';
                    tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'workHour-forView-user',href_link:'" + goPage + "',fullScreen:false}";
                } else {
                    goPage = 'workHours/index.html#/workHour-forInput';
                    tabObj.desc = '工时填报';
                    tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'workHour-forInput',href_link:'" + goPage + "',fullScreen:false}";
                }
                if (window.sysvm) {
                    window.sysvm.doTab(tabObj);
                } else {
                    window.parent.window.sysvm.doTab(tabObj);
                }
            },
            searchClear() {
                let bool = true;
                for (var key in this.searchContent) {
                    if (this.searchContent[key]) {
                        bool = false;
                    }
                }
                if (bool) {
                    this.requestData('search');
                }
            },
            restData(type, id) {
                let text = '';
                if (type === 'faw_pm_work_status')  {
                    this.faw_pm_work_status.forEach((item, index) => {
                        if (id == item.id) {
                            text = item.text;
                        }
                    })
                }
                if (type === 'faw_pm_notice_type')  {
                    this.faw_pm_notice_type.forEach((item, index) => {
                        if (id == item.id) {
                            text = item.text;
                        }
                    })
                }
                return text;
            },
            handleSizeChange(val) {
                this.baseInfo.rows = val;
                this.requestData('search')
            },
            handleCurrentChange(val) {
                this.baseInfo.page = val;
                this.requestData();
            },
            requestData(type) {
                // this.$refs.ecoLoadingRef.open();
                let params = {
                    rows: this.baseInfo.rows,
                    status: this.baseInfo.status
                }
                if (type === 'search') {
                    this.baseInfo.page = 1;
                    if (this.searchContent.name) {
                        params.name = this.searchContent.name;
                    }
                    if (this.searchContent.id) {
                        params.code = this.searchContent.id;
                    }
                }
                params.page = this.baseInfo.page;
                projectWorkTaskList(params).then(res => {
                    this.dataList = res.data.rows;
                    this.baseInfo.total = res.data.total;
                    // this.$refs.ecoLoadingRef.close();
                    console.log(this.dataList);
                }).catch(err => {
                    this.dataList = [];
                    this.baseInfo.total = 0;
                    // this.$refs.ecoLoadingRef.close();
                })
            },
            changeColWidth(nw, ow, col, evt) {
                if (nw < col.minWidth) {
                    col.width = col.minWidth;
                }
            }
        }
    };
</script>

<style scoped>
    .taskList {
      border:1px solid #ddd;
        /* position: relative;
        height: 96%;
        margin: 0 24px;
        top: 2%;
        overflow-y: hidden;
        min-width: 1131px;
        color: #0f1419; */
    }

    .taskList .plainBtn {
        border-color: #003b90;
        color: #003b90;
        font-size: 12px;
        padding: 8px 25px;
    }

    .taskList .plainBtn:first-of-type {
        margin-left: 80px;
    }

    .taskList .toolBtn {
        margin: 0 10px;
    }

    .taskList .el-table /deep/ .tableHeader th {
        background: #FAFAFA;
        height: 50px;
        color: #000;
    }

    .taskList .el-table /deep/ .tableHeader .cell {
        color: #000;
    }
    .statusItem{
        display: inline-block;
        height: 18px;
        width: 18px;
        border-radius: 9px;
        background-color: #000;
        vertical-align: middle;
    }
    .statusItem.red{
        background-color: red;
    }
    .statusItem.yellow{
        background-color: yellow;
    }
    .statusItem.green{
        background-color: green;
    }
    .listTab{
        display: inline-block;
        width: 324px;
    }
    .listTab >>> .el-tabs__header{
        margin: 0px;
    }
    .listTab >>> .el-tabs__nav-wrap::after{
        height: 0px;
    }
    .listTab >>> .el-tabs__item {
        height: 34px;
    }
</style>