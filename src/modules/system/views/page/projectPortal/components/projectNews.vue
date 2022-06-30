<template>
    <!-- <eco-content top="0px" bottom="0px" type="tool" style="background-color:#f5f5f5;"> -->
        <div class="taskList">
            <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
            <!-- <eco-content top="70px" height="60px" type="tool" style="border:1px solid #ddd;"> -->
                <el-row style="padding:4px 10px;background-color:#fff;border-bottom:1px solid #ddd;">
                    <el-col :span="24">
                        <eco-tool-title style="line-height: 34px;margin-right:50px;" title="项目动态"></eco-tool-title>
                    </el-col>
                </el-row>
                <ul style="height:138px;overflow-y: auto;">
                    <li class="newsItem" v-for="(item, index) in dataList" :key="index" @click="goProject(item)">{{item.content}}</li>
                </ul>
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
    import { projectProgressList } from '@/modules/system/service/service.js'
    import { getEnumSelectEnabled, getKVSingleInfo } from '@/modules/projectManager/api/common.js'
    import { EcoDate } from '@/components/date/main.js'
    export default {
        name: 'taskList',
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
                dataList: [],
                baseInfo: {
                    page: 1,
                    rows: 9999,
                    total: 0,
                    status:'',
                    month:'',
                    homeType:''
                },
                timer:null
            }
        },
        created() {
        },
        mounted() {
            this.baseInfo.homeType = window.projectHomeSetting&&window.projectHomeSetting.id ||''; 
            this.getDataInTime();
        },
        methods: {
            getDataInTime(){
                this.requestData();
                if (this.timer){
                    clearTimeout(this.timer)
                }
                this.timer = setTimeout(()=>{
                    this.getDataInTime();
                },60000)
            },
            goDetail(item) {
                let tabObj = {};
                let goPage = 'projectManager/index.html#/projectCard/' + item.id;
                tabObj.desc = item.name + '项目详情';
                tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'" + (item.name + '项目详情') + "',href_link:'" + goPage + "',fullScreen:false}";
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
                var month = EcoDate.formatDateDefault(new Date()).slice(0,7);
                // var month = '';
                let params = {
                    rows: this.baseInfo.rows,
                    month:month,
                    homeType: this.baseInfo.homeType,
                    sort:'modDate',
                    order:'desc'
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
                projectProgressList(params).then(res => {
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
            goProject(item){
                let tabObj = {};
                let goPage = 'projectManager/index.html#/projectCard/' + item.infoId;
                tabObj.desc = '项目详情';
                tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'" + ('项目详情') + "',href_link:'" + goPage + "',fullScreen:false}";
                window.sysvm.doTab(tabObj);
            },
            changeColWidth(nw, ow, col, evt) {
                if (nw < col.minWidth) {
                    col.width = col.minWidth;
                }
            }
        },
        beforeDestroy() {
            if (this.timer){
                clearTimeout(this.timer)
            }
        },
    };
</script>

<style scoped>
    .taskList {
      border:1px solid #ddd;
      background-color: #fff;
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
    .newsItem{
        padding-left: 8px;
        list-style: none;
        border-bottom: 1px dashed #ddd;
        line-height: 33px;
        font-size: 14px;
        cursor: pointer;
    }
    .newsItem:last-child{
        border-bottom: none;
    }
    .newsItem::before{
        display: inline-block;
        content: '';
        height: 4px;
        width: 4px;
        background-color: #003b90;
        border-radius: 2px;
        margin-right: 6px;
    }
</style>