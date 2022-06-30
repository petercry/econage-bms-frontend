<template>
    <!-- <eco-content top="0px" bottom="0px" type="tool" style="background-color:#f5f5f5;"> -->
        <div class="taskList">
            <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
            <!-- <eco-content top="70px" height="60px" type="tool" style="border:1px solid #ddd;"> -->
                <el-row style="padding:4px 10px;background-color:#fff;border-bottom:1px solid #ddd;">
                    <el-col :span="4">
                        <eco-tool-title style="line-height: 34px;margin-right:50px;" title="项目问题"></eco-tool-title>
                    </el-col>
                    
                    <el-col :span="12" >
                        <el-tabs class="listTab" v-model="infoName">
                            <el-tab-pane v-for="(item,key, index) in dataList" v-if="index<5" :key="index" :label="key" :name="key"></el-tab-pane>
                        </el-tabs>
                    </el-col>
                    <el-dropdown  v-if="Object.keys(dataList).length>5"   style="position: absolute;top: 8px;right: 24px;z-index:9999999;" size="medium">
                        <span class="el-dropdown-link" style="font-size:16px;">
                        更多<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(item, key, index) in dataList" v-if="index>4"  :key="index" @click.native="setProject(key)">{{key}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-row>
                <div>
                <el-table @header-dragend="changeColWidth" @row-dblclick='goDetail' header-row-class-name='' :cell-class-name="(data)=>data.column.property=='status'?'green':''" :data="list"
                    border tooltip-effect="dark" style="width: 100%;" height="146" size="mini" class="ecoList projectProTable" stripe>
                    <el-table-column type="index" label="序号" width='50' min-width="50">
                        <template slot-scope="scope">
                            {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="infoName" label="项目名称" min-width="100" align='center'>
                        <template slot-scope='scope'>
                          <span>{{scope.row.infoName}}</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="name" label="问题名称" align='center' min-width="120">
                        <template slot-scope='scope' style='cursor: pointer;'>
                            <span>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="attention" label="关注级别" align='center' min-width="80">
                        <template slot-scope="scope">
                            {{restData("faw_pm_pro_attention",scope.row.attention)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="importantLevel" label="问题重要性" width='100' min-width="80">
                        <template slot-scope="scope">
                            {{restData("faw_pm_pro_important",scope.row.importantLevel)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="urgent" label="问题紧急度" width='100' min-width="80">
                        <template slot-scope="scope">
                            {{restData("faw_pm_pro_urgent",scope.row.urgent)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="dutyUserName" label="责任人" min-width="100" align='center'>
                    </el-table-column>
                    <el-table-column prop="describe" label="问题描述" min-width="100" align='center'>
                    </el-table-column>
                    <el-table-column prop="startDate" label="开始时间" min-width="170" width="170" align='center'>
                    </el-table-column>
                    <el-table-column prop="status" width="80" label="状态" align='center'>
                        <template slot-scope="scope">
                            {{restData("faw_pm_pro_status",scope.row.status)}}
                        </template>
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
    import { projectProblemList } from '@/modules/system/service/service.js'
    import { getEnumSelectEnabled, getKVSingleInfo } from '@/modules/projectManager/api/common.js'
    export default {
        name: 'problemList',
        components: {
            ecoContent,
            ecoLoading,
            ecoToolTitle
        },
        data() {
            return {
                faw_pm_pro_urgent:[],
                faw_pm_pro_important:[],
                faw_pm_pro_status: [],
                faw_pm_production: [],
                faw_pm_pro_attention:[],
                faw_pm_stage: [],
                searchContent: {
                    name: '',
                    id: ''
                },
                dataList: {},
                baseInfo: {
                    page: 1,
                    rows: 9999,
                    total: 2,
                    homeType:'',
                },
                infoName:'',
                list:[],
            }
        },
        created() {
            getEnumSelectEnabled('faw_pm_pro_urgent').then(res => {
                this.faw_pm_pro_urgent = res;
            })
            getEnumSelectEnabled('faw_pm_pro_important').then(res => {
                this.faw_pm_pro_important = res;
            })
            getEnumSelectEnabled('faw_pm_pro_status').then(res => {
                this.faw_pm_pro_status = res;
            })
            getEnumSelectEnabled('faw_pm_pro_attention').then(res => {
                this.faw_pm_pro_attention = res;
            })
            
        },
        mounted() {
            this.baseInfo.homeType = window.projectHomeSetting&&window.projectHomeSetting.id ||''; 
            this.requestData();
        },
        methods: {
            setProject(key){
                this.infoName = key;
            },
            goDetail(item) {
                let tabObj = {};
                let goPage = 'projectManager/index.html#/projectCard/' + item.infoId + '/detailProblem/'+ item.id;
                tabObj.desc = item.infoName + '项目问题详情';
                tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'" + (item.infoName + '项目问题详情'+ item.id) + "',href_link:'" + goPage + "',fullScreen:false}";
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
                } else if (type === 'faw_pm_pro_status') {
                    this.faw_pm_pro_status.forEach((item, index) => {
                        if (id == item.id) {
                            text = item.text;
                        }
                    })
                } else if(type === 'faw_pm_pro_urgent'){
                    this.faw_pm_pro_urgent.forEach((item, index) => {
                        if (id == item.id) {
                            text = item.text;
                        }
                    })
                }  else if(type === 'faw_pm_pro_important'){
                    this.faw_pm_pro_important.forEach((item, index) => {
                        if (id == item.id) {
                            text = item.text;
                        }
                    })
                } else if(type === 'faw_pm_pro_attention'){
                    this.faw_pm_pro_attention.forEach((item, index) => {
                        if (id == item.id) {
                            text = item.text;
                        }
                    })
                } 
                else {
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
                projectProblemList(params).then(res => {
                    this.dataList = res.data;
                    if (Object.keys(res.data).length){
                        let key = Object.keys(res.data)[0];
                        this.list = res.data[key];
                        this.infoName = key;
                    }
                    // this.baseInfo.total = res.data.total;
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
        },
        watch: {
            'infoName'(key){
                this.list = this.dataList[key]||[];
            }
        },
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