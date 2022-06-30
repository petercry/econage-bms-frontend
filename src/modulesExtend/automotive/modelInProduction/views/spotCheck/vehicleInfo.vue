<template>
    <eco-content top='0px' bottom='0px' type='tool'>
        <div class='vehicleInfo'>
            <ecoLoading ref='vehicleInfoLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool' style='overflow:hidden'>
                <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
                    <el-col :span='5' style='height:30px;line-height: 30px;'>
                        <strong></strong>
                    </el-col>
                    <el-col :span='19' style='text-align: right;'>
                        <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                        <el-button type='primary' size='small' @click='exportCase' v-show='btnRoleObj["productioncar.productionModelCheck_download"]'>导出</el-button>
                        <el-button type='primary' size='small' @click='doProcess(true)' v-show='btnRoleObj["productioncar.productionModelCheck_dealWith"]'>应对</el-button>
                        <el-button type='primary' size='small' @click='doProcess(false)' v-show='btnRoleObj["productioncar.productionModelCheck_notDeal"]'>不应对</el-button>
                        <!-- <el-button type='primary' size='small' @click='correspondCase'>对应结果反馈</el-button> -->
                        <el-button type='primary' size='small' @click='refshList' v-show='btnRoleObj["productioncar.productionModelCheck_matchModel"]'>法规车型匹配</el-button>
                        <el-button type='primary' size='small' @click='openHistory'>版本历史</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content v-show='isShowSearch' top='59px' height='60px' type='tool'
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
                        <span class='searchInputLabel'>适用车型:</span>
                        <el-select filterable v-model='searchContent.applicableModel' style='width:150px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item) in applicableModels'
                                :key='item.id'></el-option>
                        </el-select>
                        <el-button @click='requestData("search",true)' type='primary' style='margin-left:5px;'>查询</el-button>
                        <el-button @click='restSearContent'>重置</el-button>
                    </el-col>
                    <!-- <el-col :span='24'>
  
                    </el-col> -->
                </el-row>
            </eco-content>
            <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table ref='' border @selection-change="handleSelectionChange" stripe :data='tableData'
                    header-row-class-name='tableHeader' tooltip-effect='dark' height='100%' class='statisticsTable'>
                    <el-table-column type="selection" width="55">
                    </el-table-column>
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
                    <el-table-column label='车型型号' prop='carModelCode' min-width='120'></el-table-column>
                    <!-- <el-table-column label='项目代号' prop='projectCode'></el-table-column> -->
                    <el-table-column label='适用车型' prop='applicableModel' min-width='120'>
                        <!-- <template slot-scope='scope'>
                             <span>{{restData(scope.row.applicableModel,'modelList')}}</span>
                        </template> -->
                    </el-table-column>
                    <el-table-column label='动力类型' prop='powerType' min-width='120'>
                        <!-- <template slot-scope='scope'>
                            <span>{{restData(scope.row.powerType,'powerList')}}</span>
                       </template> -->
                    </el-table-column>
                    <!-- <el-table-column label='检验项目' prop='inspectionItems'></el-table-column> -->
                    <el-table-column label='依据' prop='according' min-width='120'></el-table-column>
                    <el-table-column label='应对状态' prop='handleStatusName' min-width='120'></el-table-column>
                    <el-table-column label='应对选择' prop='handleIntentName' min-width='120'></el-table-column>
                    <el-table-column label='材料上传' min-width='300' fixed='right'>
                        <template slot-scope='scope'>
                            <upload v-if='(scope.row.handleStatus==="PENDING")' styleType='cutsom' :isEdit='!(scope.row.materialFile)' :showList='true' :multiple="false" modular="vehicleInfoFile"
                                :modularInnerId="scope.row.id" @fileChange="fileChange"
                                @preView='preView' accept='' @beforeFileUpload="beforeFileUpload" @fileOnSuccess="fileOnSuccess">
                                <el-button slot="uploadBtn" size="medium" type='text'>
                                    <span style='font-size:13px'><i class="isRequired">*</i>上传</span> 
                                </el-button>
                            </upload>
                            <span v-if='((scope.row.handleStatus==="PROCESSED" && (scope.row.handleIntent=="OK" || (scope.row.handleIntent=="DO_PROCESS" && !scope.row.materialFile))))'>无需上传</span>
                            <span v-if='(scope.row.handleStatus==="PROCESSED" && scope.row.handleIntent=="NOT_PROCESS") || (scope.row.handleIntent=="DO_PROCESS" && scope.row.materialFile)' class='linkBlue' @click='preFile(scope.row)'>{{scope.row.materialDesc}}</span>
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
    import {getRoleBtnSetting, productioncarRefreshAll,productioncarCheckNotProcess,productioncarCheckDoProcess,responseResultInterfaceList,dfHandlingInterfaceExport} from '../../service/service.js'
    import ecoLoading from "@/components/loading/ecoLoading.vue";
    import upload from '../components/upload.vue'
    import { mapState } from 'vuex'
    import { EcoFile } from '@/components/file/main.js'
    import { EcoMessageBox } from "@/components/messageBox/main.js";
    export default {
        name: 'vehicleInfoList',
        data() {
            return {
                btnRoleObj:{},
                masterId:'',
                tableData: [],
                searchContent: {
                    // status: '',
                    carModelCode: '',
                    projectCode: '',
                    applicableModel: '',
                    powerType: ''
                },
                isShowSearch: false,
                baseInfo: {
                    page: 1,
                    rows: 30,
                    total: 0
                },
                multipleSelection: []
            }
        },
        created() {
            this.initRole();
            this.masterId = this.$route.params.masterId;
            _self = this;
        },
        activated(){
            this.requestData('search',false);
        },
        mounted(){
            //  this.requestData();
        },
        computed: {
            ...mapState(['spotCheckStatus', 'powerType', 'applicableModels']),
            contentTop() {
                return this.isShowSearch ? "119px" : "59px";
            }
        },
        components: {
            ecoContent,
            ecoLoading,
            upload
        },
        methods: {
            initRole() {
                const btn_array = [
                'productioncar.productionModelCheck_download',
                'productioncar.productionModelCheck_dealWith',
                'productioncar.productionModelCheck_notDeal',
                'productioncar.productionModelCheck_matchModel',
                ];
                getRoleBtnSetting(btn_array).then((res) => {
                    if (res.data) {
                        this.btnRoleObj = res.data.authenticationMap;
                    }
                })
            },
            fileOnSuccess(){
                this.requestData('search',false);
            },
            preFile(row){
                EcoFile.openFileHeaderByView(row.materialFile, row.materialDesc);
            },
            beforeFileUpload(file, callback) {
                callback(true);
            },
            preView(item) {
                EcoFile.openFileHeaderByView(item.id, item.name);
            },
            fileChange(file, fileList) {
             
            },
            refshList(){
                let doit = function () {
                    _self.$refs.vehicleInfoLoading.open();
                    productioncarRefreshAll(_self.masterId).then(res=>{
                        _self.restSearContent();
                    }).catch(()=>{
                        _self.$refs.vehicleInfoLoading.close();
                    })
                }
                EcoMessageBox.confirm(`点击后刷新当前页面任务,谨慎操作`, '提示', { type: 'warning', lockScroll: false }, doit)
            },
            openHistory(){
                let url = '/modelInProduction/index.html#/vehicleInfoHistoryList/'+this.masterId
                EcoUtil.getSysvm().openDialog('历史版本', url, 800, 500, '15vh'); 
            },
            doProcess(type){
                if(this.multipleSelection.length===0){
                    this.$message.warning('请至少选择一条数据!');
                    return;
                }
                this.$refs.vehicleInfoLoading.open();
                let ids = this.multipleSelection.map(item=>{
                    return item.id
                })
                if(type){
                    //应对
                    productioncarCheckDoProcess(ids).then(res=>{
                        this.$message.success('操作成功');
                        this.restSearContent();
                        // this.$refs.vehicleInfoLoading.close();
                    }).catch(err=>{
                        this.$refs.vehicleInfoLoading.close();
                    })
                }else{
                    productioncarCheckNotProcess(ids).then(res=>{
                        this.$message.success('操作成功');
                        this.restSearContent();
                        // this.$refs.vehicleInfoLoading.close();
                    }).catch(err=>{
                        this.$refs.vehicleInfoLoading.close();
                    })
                }
                
            },
            exportCase(){
                this.$refs.vehicleInfoLoading.open();
                let params = {
                    sort: ['modDate'],     // 排序字段列表
                    order: ['desc'],    // 排序方式列表，asc升序，desc降序
                    masterId:this.masterId
                    // standardRegulationNo: this.$route.params.standardRegulationNo //标准法规名称
                };
                for (var key in this.searchContent) {
                    if (this.searchContent[key]) {
                        params[key] = this.searchContent[key];
                    }
                }
                dfHandlingInterfaceExport(params).then(res => {
                        if( window.navigator && window.navigator.msSaveOrOpenBlob ) {
                            navigator.msSaveBlob(new Blob([res.data],'车型信息.xlsx'));
                            this.$refs.vehicleInfoLoading.close();
                        }else{
                            let blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" }); // 为blob设置文件类型，这里以.xlsx为例
                            let url = window.URL.createObjectURL(blob); // 创建一个临时的url指向blob对象
                            let a = document.createElement("a");
                            a.href = url;
                            a.download = '车型信息.xlsx';
                            this.$refs.vehicleInfoLoading.close();
                            a.click();
                            // 释放这个临时的对象url
                            window.URL.revokeObjectURL(url);
                        }
                    }).catch(err => {
                        this.$refs.vehicleInfoLoading.close();
                    })
            },
            correspondCase(){
                if(this.multipleSelection.length===0 || this.multipleSelection.length>1){
                    this.$message.warning('请选择一条数据!');
                    return;
                }
                this.$parent.$parent.changeDrawerInfo({
                    goRoute:'editCopingoutcomes',
                    caseType:'editCase',
                    drawerTitle:"应对结果反馈",
                    paramsValue:{
                        id:this.multipleSelection[0].id,
                        standardRegulationNo: this.$route.params.standardRegulationNo
                    }
                })
            },
            handleCurrentChange(val) {
                this.baseInfo.page = val;
                this.requestData('search',false);
            },
            handleSizeChange(val) {
                this.baseInfo.rows = val;
                this.requestData("search",true);
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            restSearContent() {
                this.searchContent = {
                    // status: '',
                    carModelCode: '',
                    projectCode: '',
                    applicableModel: '',
                    powerType: ''
                }
                this.requestData('search',true);
            },
            changeSearchShow() {
                this.isShowSearch = !this.isShowSearch;
            },
            requestData(type,isFirstPage) {
                this.$refs.vehicleInfoLoading.open();
                let params = {
                    sort: ['modDate'],
                    order: ['desc'],
                    rows: this.baseInfo.rows,
                    masterId:this.masterId,
                    // standardRegulationNo: this.$route.params.standardRegulationNo //标准法规名称
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
                responseResultInterfaceList(params).then(res => {
                    this.baseInfo.total = res.data.total;
                    this.tableData = res.data.rows;
                    this.$refs.vehicleInfoLoading.close();
                }).catch(err => {
                    this.baseInfo.total = 0;
                    this.tableData = [];
                    this.$refs.vehicleInfoLoading.close();
                })
            },
        }
    }
</script>
<style scoped>
    .vehicleInfo {
        /* min-width: 1200px; */
        position: relative;
        /* margin: 0 24px; */
        /* top: 2%; */
        height: 98%;
        overflow-y: auto;
        color: #0f1419;
    }

    .vehicleInfo .searchRow {
        padding: 15px 10px 16px 10px;
        background: #fff
    }
    .vehicleInfo .searchRow .el-col+.el-col{
        margin-top:5px;
    }
    .vehicleInfo .searchInputLabel {
        font-size: 14px;
        margin-left: 5px;
    }
    .vehicleInfo .isRequired{
        color: #f56c6c;
        margin-right:4px;
    }
</style>