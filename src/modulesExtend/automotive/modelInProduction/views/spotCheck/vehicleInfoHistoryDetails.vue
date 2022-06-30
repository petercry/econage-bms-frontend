<template>
    <eco-content top='0px' bottom='0px' type='tool'>
        <div class='vehicleInfoHistoryDetails'>
            <ecoLoading ref='loading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool' style='overflow:hidden'>
                <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
                    <el-col :span='5' style='height:30px;line-height: 30px;'>
                        <strong></strong>
                    </el-col>
                    <el-col :span='19' style='text-align: right;'>
                        <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                    </el-col>
                </el-row>
            </eco-content> 
            <eco-content v-show='isShowSearch' top='59px' height='90px' type='tool'
                style='border:1px solid #ddd;overflow: hidden;'>
                <el-row class='searchRow'>
                    <el-col :span='24'>
                        <!-- <span class="searchInputLabel">&emsp;&emsp;状态:</span>
                        <el-select filterable v-model='searchContent.status' style='width:150px;' clearable>
                            <el-option v-for='(item,key) in spotCheckStatus' :value='key' :label='item' :key='key'></el-option>
                        </el-select> -->
                        <span class="searchInputLabel">车型型号:</span>
                        <el-input clearable style='width:150px' @keyup.enter.native="requestData('search',true)"
                            v-model='searchContent.carModelCode' placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <!-- <span class="searchInputLabel">项目代号:</span>
                        <el-input clearable style='width:150px' @keyup.enter.native="requestData('search',true)"
                            v-model='searchContent.projectCode' placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input> -->
                        <span class='searchInputLabel'>&emsp;动力类型:</span>
                        <el-select filterable style='width:150px' v-model="searchContent.powerType" placeholder="请选择"
                            clearable>
                            <el-option v-for="(item) in powerType" :key="item.id" :label="item.text" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span='24'>
                        <span class='searchInputLabel'>适用车型:</span>
                        <el-select filterable v-model='searchContent.applicableModel' style='width:150px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item) in applicableModels'
                                :key='item.id'></el-option>
                        </el-select>
                        <el-button @click='requestData("search",true)' type='primary' style='margin-left:5px;'>查询</el-button>
                        <el-button @click='restSearContent'>重置</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table ref='' border  stripe :data='tableData'
                    header-row-class-name='tableHeader' tooltip-effect='dark' height='100%' class='statisticsTable'>
                    <el-table-column type='index' label='序号' align='center'>
                        <template slot-scope='scope'>
                            {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label='状态' prop='status'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.status,'spotCheckStatus')}}</span>
                        </template> 
                    </el-table-column> -->
                    <el-table-column label='车型型号' prop='carModelCode'></el-table-column>
                    <!-- <el-table-column label='项目代号' prop='projectCode'></el-table-column> -->
                    <el-table-column label='适用车型' prop='applicableModel'>
                        <!-- <template slot-scope='scope'>
                             <span>{{restData(scope.row.applicableModel,'modelList')}}</span>
                        </template> -->
                    </el-table-column>
                    <el-table-column label='动力类型' prop='powerType'>
                        <!-- <template slot-scope='scope'>
                            <span>{{restData(scope.row.powerType,'powerList')}}</span>
                       </template> -->
                    </el-table-column>
                    <!-- <el-table-column label='检验项目' prop='inspectionItems'></el-table-column> -->
                    <el-table-column label='依据' prop='basis'></el-table-column>
                    <el-table-column label='应对状态' prop='handleStatusName'></el-table-column>
                    <el-table-column label='应对选择' prop='handleIntentName'></el-table-column>
                    <el-table-column label='材料上传' prop='materialDesc'>
                        <template slot-scope='scope'>
                            <span class='linkBlue' @click='preFile(scope.row)'>{{scope.row.materialDesc}}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label='是否应对' prop='respond'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.respond,'respond')}}</span>
                        </template>
                    </el-table-column> -->
                </el-table>
            </eco-content>
            <eco-content bottom="0px" type="tool" style="padding:5px 0px">
                <el-row>
                    <el-col :span="24" style="text-align:right">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :current-page.sync="baseInfo.page" :page-sizes="[30,50,100]" :page-size="baseInfo.rows"
                            layout="total, sizes, prev, pager, next, jumper" :total="baseInfo.total" style="margin-right:20px">
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
    import { EcoUtil } from '@/components/util/main.js'
    import {productioncarTaskArchiveList } from '../../service/service.js'
    import ecoLoading from "@/components/loading/ecoLoading.vue";
    import { mapState } from 'vuex'
    import { EcoFile } from '@/components/file/main.js'
    export default {
        name: 'vehicleInfoHistoryDetails',
        data() {
            return {
                versionId:'',
                tableData: [],
                searchContent: {
                    // status: '',
                    carModelCode: '',
                    // projectCode: '',
                    applicableModel: '',
                    powerType: ''
                },
                isShowSearch: false,
                baseInfo: {
                    page: 1,
                    rows: 30,
                    total: 0
                }
            }
        },
        created() {
            this.versionId = this.$route.params.versionId;
            _self = this;
        },
        mounted(){
            this.requestData('search',false);
        },
        computed: {
            ...mapState(['spotCheckStatus', 'powerType', 'applicableModels']),
            contentTop() {
                return this.isShowSearch ? "150px" : "59px";
            }
        },
        components: {
            ecoContent,
            ecoLoading
        },
        methods: {
            preFile(row){
                EcoFile.openFileHeaderByView(row.materialFile, row.materialDesc);
            },
            handleCurrentChange(val) {
                this.baseInfo.page = val;
                this.requestData('search',false);
            },
            handleSizeChange(val) {
                this.baseInfo.rows = val;
                this.requestData("search",true);
            },
            restSearContent() {
                this.searchContent = {
                    // status: '',
                    carModelCode: '',
                    // projectCode: '',
                    applicableModel: '',
                    powerType: ''
                }
                this.requestData('search',true);
            },
            changeSearchShow() {
                this.isShowSearch = !this.isShowSearch;
            },
            requestData(type,isFirstPage) {
                this.$refs.loading.open();
                let params = {
                    sort: ['modDate'],
                    order: ['desc'],
                    rows: this.baseInfo.rows,
                    versionId:this.versionId,
                };
                if (type === 'search') {
                    for (var key in this.searchContent) {
                        if (this.searchContent[key]) {
                            params[key] = this.searchContent[key];
                        }
                    }
                }
                if(isFirstPage){
                    this.baseInfo.page = 1;
                }
                params.page = this.baseInfo.page;
                productioncarTaskArchiveList(params).then(res => {
                    this.baseInfo.total = res.data.total;
                    this.tableData = res.data.rows;
                    this.$refs.loading.close();
                }).catch(err => {
                    this.baseInfo.total = 0;
                    this.tableData = [];
                    this.$refs.loading.close();
                })
            },
        }
    }
</script>
<style scoped>
    .vehicleInfoHistoryDetails {
        /* min-width: 1200px; */
        position: relative;
        /* margin: 0 24px; */
        /* top: 2%; */
        height: 98%;
        overflow-y: auto;
        color: #0f1419;
    }

    .vehicleInfoHistoryDetails .searchRow {
        padding: 15px 10px 16px 10px;
        background: #fff
    }
    .vehicleInfoHistoryDetails .searchRow .el-col+.el-col{
        margin-top:5px;
    }
    .vehicleInfoHistoryDetails .searchInputLabel {
        font-size: 14px;
        margin-left: 5px;
    }
</style>