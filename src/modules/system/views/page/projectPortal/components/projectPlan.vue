<template>
        <div class="projectPlan" style="height:181px;overflow:hidden;">
            <!-- <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading> -->
                <el-row style="padding:4px 10px;background-color:#fff;border-bottom:1px solid #ddd;">
                    <el-col :span="8">
                        <eco-tool-title style="line-height: 34px;margin-right:50px;" title="项目计划总览"></eco-tool-title>
                    </el-col>
                    <div style="position:absolute;left:150px;right:150px;top:0;text-align:center;" >
                        <el-tabs class="listTab" v-model="baseInfo.type" @tab-click="handleTabClick">
                            <el-tab-pane v-for="(item, index) in faw_pm_type" :key="index" :label="item.text" :name="item.id"></el-tab-pane>
                        </el-tabs>
                    </div>
                </el-row>
                <!-- <div style="height:138px;"> -->
                <el-scrollbar style="height:147px;" v-loading="loading">
                    <div class="graphFlexBox cpointer" v-for="(item,index) in dataList" @click="goDetail(item)" :key="index">
                        <div class="graphFlexBoxLeft">
                            <div class="ellipsis" style="padding:0 6px;line-height:20px;">
                                <span class="ellipsis" title="项目名称">{{item.infoName}}</span>
                            </div>
                        </div>
                        <div class="graphFlexBoxMain">
                            <div class="graph">
                                <div class="item pointerClass" v-for="(mileItem,index) in item.miles" :key="index" v-bind:class="mileItem.color||''">
                                    <div class="ellipsis" :title="mileItem.name">{{mileItem.name}}</div>
                                    <div>{{mileItem.planDate}}</div>
                                </div>
                            </div>
                        </div>
                        <!-- <div class="graphFlexBoxRight"> -->
                            <!-- <el-button type='primary' size='mini' style='margin-left:10px'>商业指标</el-button>
                            <el-button type='primary' size='mini' style='margin-left:10px'>工程指标</el-button> -->
                        <!-- </div> -->
                    </div>
                    <!-- <div class="graphFlexBox">
                        <div class="graphFlexBoxLeft">
                            <div class="ellipsis" style="padding:0 6px;line-height:20px;">
                                <span title="项目名称">项目名称</span>
                            </div>
                        </div>
                        <div class="graphFlexBoxMain">
                            <div class="graph">
                                <div class="item pointerClass" v-for="(item,index) in dataList" :key="index" v-bind:class="item.color||'green'">
                                    <span>name</span>
                                </div>
                            </div>
                        </div>
                        <div class="graphFlexBoxRight">
                            <el-button type='primary' size='mini' style='margin-left:10px'>商业指标</el-button>
                            <el-button type='primary' size='mini' style='margin-left:10px'>工程指标</el-button>
                        </div>
                    </div> -->
                </el-scrollbar>
                <!-- </div> -->
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
    import { projectList, projectMilesShow } from '@/modules/system/service/service.js'
    import { getEnumSelectEnabled, getKVSingleInfo } from '@/modules/projectManager/api/common.js'
    import { mapState } from 'vuex';
    export default {
        name: 'projectPlan',
        components: {
            ecoContent,
            ecoLoading,
            ecoToolTitle
        },
        data() {
            return {
                faw_pm_type:[],
                faw_pm_status: [],
                faw_pm_production: [],
                faw_pm_stage: [],
                searchContent: {
                    name: '',
                    id: ''
                },
                loading:false,
                dataList: [],
                baseInfo: {
                    page: 1,
                    rows: 9999,
                    total: 0,
                    status:'',
                    type:'',
                    homeType:'',
                },
            }
        },
        computed: {
            ...mapState(['loginUser'])
        },
        created() {
        },
        mounted() {
            this.baseInfo.homeType = window.projectHomeSetting&&window.projectHomeSetting.id ||'';
            getEnumSelectEnabled('faw_pm_type').then(res => {
                this.faw_pm_type = res;
                if (res.length&&res.length>0){
                    this.baseInfo.type = res[0].id;
                }
                this.requestData();
            })
        },
        methods: {
            handleTabClick(tab,event){
                this.baseInfo.type = tab.name;
                this.requestData();
            },
            goDetail(item) {
                let tabObj = {};
                let goPage = 'projectManager/index.html#/projectCard/' + item.infoId;
                tabObj.desc = item.infoName + '项目详情';
                tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'" + (item.infoName + '项目详情') + "',href_link:'" + goPage + "',fullScreen:false}";
                window.sysvm.doTab(tabObj);
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
                if (type === 'stage') {
                    this.faw_pm_stage.forEach((item, index) => {
                        if (id == item.id) {
                            text = item.text;
                        }
                    })
                } else if (type === 'productionBase') {
                    this.faw_pm_production.forEach((item, index) => {
                        if (id == item.id) {
                            text = item.text;
                        }
                    })
                } else if(type === 'faw_pm_type'){
                    this.faw_pm_type.forEach((item, index) => {
                        if (id == item.id) {
                            text = item.text;
                        }
                    })
                } else {
                    this.faw_pm_status.forEach((item, index) => {
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
                    type: this.baseInfo.type,
                    currUserId:this.loginUser.id,
                    homeType:this.baseInfo.homeType,
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
                this.loading = true;
                projectMilesShow(params).then(res => {
                    this.dataList = res.data.rows;
                    this.baseInfo.total = res.data.total;
                    // this.$refs.ecoLoadingRef.close();
                    console.log(this.dataList);
                    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        this.loading = false;
                    });
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
    .projectPlan {
      border:1px solid #ddd;
      background-color:#fff;
        /* position: relative;
        height: 96%;
        margin: 0 24px;
        top: 2%;
        overflow-y: hidden;
        min-width: 1131px;
        color: #0f1419; */
    }

    .projectPlan .plainBtn {
        border-color: #003b90;
        color: #003b90;
        font-size: 12px;
        padding: 8px 25px;
    }

    .projectPlan .plainBtn:first-of-type {
        margin-left: 80px;
    }

    .projectPlan .toolBtn {
        margin: 0 10px;
    }

    .projectPlan .el-table /deep/ .tableHeader th {
        background: #FAFAFA;
        height: 50px;
        color: #000;
    }

    .projectPlan .el-table /deep/ .tableHeader .cell {
        color: #000;
    }

    .projectPlan .graph{
        height: 100%;
        overflow-y:hidden;
        overflow-x:auto;
        background-color: #fafafa;
        white-space: nowrap;
    }
    .projectPlan .graph .item{
        display: inline-block;
        height: 36px;
        width: 74px;
        border: 1px solid #ddd;
        border-radius: 5px;
        text-align: center;
        margin: 3px 0;
        background: #fff;
        color:#595959;
        font-size: 12px;
        position: relative;
        margin-left: 26px;
    }
    .projectPlan .graph .item:first-of-type{
        margin-left: 20px;
    }
    .projectPlan .graph .item:last-of-type{
        margin-right: 20px;
    }
    .projectPlan .graph .item span{
        display: block;
        line-height: 30px;
        height: 30px;
    }
    .projectPlan .graph .item:not(:first-of-type):before{
        content: "";
        border-top: 1px solid #ddd;
        width: 26px;
        position: absolute;
        left: -27px;
        top: 15px;
    }
    .projectPlan .graph .item.green{
        background-color: green;
        color:#fff;
    }
    .projectPlan .graph .item.yellow{
        background-color: yellow;
    }
    .projectPlan .graph .item.red{
        background-color: red;
        color:#fff;
    }
    .projectPlan .graph .item.active{
        box-shadow: 0 4px 12px 0 rgba(0,0,0,.1);
    }
    .graphFlexBox{
        display: flex;
        margin: 10px;
        border: 1px solid #ccc;
        height: 52px;
        background-color: #fafafa;
    }
    .graphFlexBox .graphFlexBoxLeft{
        flex-basis: 120px;
        min-width: 0;
        align-self: center;
        font-size: 14px;
    }
    .graphFlexBox .graphFlexBoxLeft span{
        padding: 7px;
        display: inline-block;
        max-width: 94px;
        background-color: #fff;
    }
    .graphFlexBox .graphFlexBoxMain{
        flex: 1;
        min-width: 0;
    }
    .graphFlexBox .graphFlexBoxRight{
        flex-basis: 200px;
        min-width: 0;
        align-self: center;
    }
    .listTab{
        display: inline-block;
        width: 100%;
        text-align: center;
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
