<template>
    <!-- <eco-content top="0px" bottom="0px" type="tool" style="background-color:#f5f5f5;"> -->
        <div class="projectList">
            <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
            <!-- <eco-content top="70px" height="60px" type="tool" style="border:1px solid #ddd;"> -->
                <el-row style="padding:4px 10px;background-color:#fff;border-bottom:1px solid #ddd;">
                    <el-col :span="24">
                        <eco-tool-title style="line-height: 34px;margin-right:50px;" title="项目列表"></eco-tool-title>
                        <span style='font-size:14px'>项目名称：</span>
                        <el-input @keyup.enter.native='requestData("search")' clearable @clear='searchClear' v-model='searchContent.name' placeholder='请输入'
                            style='width:200px;' size='small'>
                            <i class="el-icon-search  el-input__icon" slot="suffix"></i>
                        </el-input>
                        <span style='margin-left:10px;font-size:14px'>项目编码：</span>
                        <el-input @keyup.enter.native='requestData("search")' clearable @clear='searchClear' v-model='searchContent.id' placeholder='请输入'
                            style='width:200px' size='small'>
                            <i class="el-icon-search  el-input__icon" slot="suffix"></i>
                        </el-input>
                        <el-button type='primary' size='mini' style='margin-left:10px' @click='requestData("search")'>搜索</el-button>
                    </el-col>
                </el-row>
                <div style="height:232px;">
                <el-table @header-dragend="changeColWidth" @row-dblclick='goDetail' header-row-class-name='tableHeader' :data="dataList"
                    border tooltip-effect="dark" style="width: 100%;" size="mini" class="ecoList" height="100%" stripe>
                    <el-table-column type="index" label="序号" width='50' min-width="50" fixed='left'>
                        <template slot-scope="scope">
                            {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="项目名称" align='center' min-width="120" fixed='left'>
                        <template slot-scope='scope' style='cursor: pointer;'>
                            <span>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="code" label="项目编码" min-width="100" align='center'>
                    </el-table-column>
                    <el-table-column prop="pdtManagerName" min-width="100" label="PDT经理" align='center'>
                    </el-table-column>
                    <el-table-column prop="type" label="项目类型" width='100' min-width="80">
                        <template slot-scope="scope">
                            {{restData("faw_pm_type",scope.row.type)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="stage" label="项目阶段" min-width="100" align='center'>
                        <template slot-scope='scope'>
                            {{restData('stage',scope.row.stage)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="项目状态" min-width="100" align='center'>
                        <template slot-scope='scope'>
                            {{restData('status',scope.row.status)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="productionBase" min-width="100" label="生产基地" align='center'>
                        <template slot-scope='scope'>
                            {{restData('productionBase',scope.row.productionBase)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="createDate" label="创建日期" min-width="170" width="170" align='center'>
                    </el-table-column>
                    <el-table-column prop="planGa" min-width="100" label="计划GA时间" align='center'>
                    </el-table-column>
                    <el-table-column prop="closeDate" min-width="170" label="项目关闭时间" align='center'>
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
    import { projectList } from '@/modules/system/service/service.js'
    import { getEnumSelectEnabled, getKVSingleInfo } from '@/modules/projectManager/api/common.js'
    export default {
        name: 'projectList',
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
                    total: 0
                }
            }
        },
        created() {
            getEnumSelectEnabled('faw_pm_stage').then(res => {
                this.faw_pm_stage = res;
            })
            getEnumSelectEnabled('faw_pm_production').then(res => {
                this.faw_pm_production = res;
            })
            getEnumSelectEnabled('faw_pm_status').then(res => {
                this.faw_pm_status = res;
            })
            getEnumSelectEnabled('faw_pm_type').then(res => {
                this.faw_pm_type = res;
            })
            
        },
        mounted() {
            this.baseInfo.homeType = window.projectHomeSetting&&window.projectHomeSetting.id ||''; 
            this.requestData();
        },
        methods: {
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
                projectList(params).then(res => {
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
    .projectList {
      border:1px solid #ddd;
        /* position: relative;
        height: 96%;
        margin: 0 24px;
        top: 2%;
        overflow-y: hidden;
        min-width: 1131px;
        color: #0f1419; */
    }

    .projectList .plainBtn {
        border-color: #003b90;
        color: #003b90;
        font-size: 12px;
        padding: 8px 25px;
    }

    .projectList .plainBtn:first-of-type {
        margin-left: 80px;
    }

    .projectList .toolBtn {
        margin: 0 10px;
    }

    .projectList .el-table /deep/ .tableHeader th {
        background: #FAFAFA;
        height: 50px;
        color: #000;
    }

    .projectList .el-table /deep/ .tableHeader .cell {
        color: #000;
    }
</style>