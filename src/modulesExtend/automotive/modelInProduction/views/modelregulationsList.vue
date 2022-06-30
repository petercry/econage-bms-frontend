<template>
    <eco-content top='0px' bottom='0px' style='background-color:#F5F5F5;'>
        <div class='modelregulationsList'>
            <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool' style='overflow:hidden'>
                <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
                    <el-col :span='5' style='height:30px;line-height: 30px;'>
                        <strong>车型查询法规匹配</strong>
                    </el-col>
                    <el-col :span='19' style='text-align: right;'>
                        <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                        <el-button type='primary' size='small' @click='exportCase' v-show="btnRoleObj['productioncar.carModelSearchRegulation_download']">导出</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content v-show='isShowSearch' top='59px' height='90px' type='tool'
                style='border:1px solid #ddd;overflow: hidden;'>
                <el-row class='searchRow'>
                    <el-col :span='24'>
                        <span class='searchInputLabel'>车型号:</span>
                        <div class='selectBox' @click.stop='selectId'>{{searchContent.carModelCode.split(';')[0]||'请选择'}}</div>
                        <span class='searchInputLabel'>实施时间: TT</span>
                        <el-date-picker style='width:250px' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="searchContent.dateRange1"
                          value-format='yyyy-MM-dd' type="daterange" placeholder="选择日期">
                        </el-date-picker>
                        <el-button @click='requestData("search",true)' type='primary' style='margin-left:5px;'>查询</el-button>
                        <el-button @click='restSearContent'>重置</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table border stripe :data='tableData' header-row-class-name='tableHeader' tooltip-effect='dark'
                    height='100%' class='statisticsTable'>
                    <el-table-column type='index' label='序号' align='center'>
                        <template slot-scope='scope'>
                            {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                        </template>
                    </el-table-column>
                    <el-table-column label='法规编号' prop='regulationCode'></el-table-column>
                    <el-table-column label='法规名称' prop='regulationName'></el-table-column>
                    <!-- <el-table-column label='公告车型号' prop='carModel'></el-table-column> -->
                    <!-- <el-table-column label='项目代号' prop='projectCode'></el-table-column> -->
                    <!-- <el-table-column label="公告" align='center'>
                        <el-table-column label="NT" width='150' prop='announcementNt' align='center'></el-table-column> 
                        <el-table-column label="TT" width='150' prop='announcementTt'  align='center'></el-table-column> 
                    </el-table-column> 
                    <el-table-column label="CCC" align='center'>
                        <el-table-column label="NT" width='150' prop='cccNt' align='center'></el-table-column> 
                        <el-table-column label="TT" width='150' prop='cccTt' align='center'></el-table-column> 
                      </el-table-column>  -->
                      <!-- <el-table-column label='实施时间'  align='center'>
                        <el-table-column label="NT" width='150' prop='implTimeNt' align='center'></el-table-column> 
                        <el-table-column label="TT" width='150' prop='implTimeTt' align='center'></el-table-column> 
                      </el-table-column> -->
                    <!-- <el-table-column label='车型名称' prop='modelName'>
                        <template slot-scope='scope'> 
                            <span>{{restData(scope.row.modelName,'modelName')}}</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column label='实施时间TT' prop='implTimeTT' width='120'></el-table-column>
                    <el-table-column label='适应车型' prop='applicableModel'>
                        <!-- <template slot-scope='scope'>
                            <span>{{restData(scope.row.applicableModel,'modelList')}}</span>
                        </template> -->
                    </el-table-column>
                    <el-table-column label='动力类型' prop='powerType'>
                        <!-- <template slot-scope='scope'>
                            <span>{{restData(scope.row.powerType,'powerList')}}</span>
                        </template> -->
                    </el-table-column>
                    <el-table-column label='应对状态' prop='handleStatusName'></el-table-column>
                    <el-table-column label='应对选择' prop='handleIntentName'></el-table-column>
                    <el-table-column label='支撑材料' prop='materialName'>
                         <template slot-scope='scope'>
                            <span class='linkBlue' @click='preFile(scope.row)'>{{scope.row.materialName}}</span>
                         </template>
                    </el-table-column>
                    <!-- <el-table-column label='检验项目' prop='testProject'></el-table-column>
                    <el-table-column label='依据' prop='testAccording'>  </el-table-column> -->
                    <!-- <el-table-column label='最新法规信息' prop='newestbasis'></el-table-column>
                    <el-table-column label='距离标准实施时间' prop='distanceDate'></el-table-column> -->
                </el-table>
            </eco-content>
            <eco-content bottom="0px" type="tool" style="padding:5px 0px">
                <el-row>
                    <el-col :span="24" style="text-align:right">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :disabled='tableData.length==0' :current-page.sync="baseInfo.page" :page-sizes="[30,50,100]"
                            :page-size="baseInfo.rows" layout="total, sizes, prev, pager, next, jumper"
                            :total="baseInfo.total" style="margin-right:20px">
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
    import { mapState } from "vuex";
    import {getRoleBtnSetting,vehicleAnnounceCarQueryids,vehicleAnnounceCarExcelExport1} from '../service/service.js'
    import { EcoFile } from '@/components/file/main.js'
    export default {
        name: 'modelregulationsList',
        data() {
            return {
                btnRoleObj:{},
                searchContent: {
                    carModelCode:'',
                    dateRange1:[]
                },
                isShowSearch: true,
                tableData: [],
                baseInfo: {
                    page: 1,
                    rows: 30,
                    total: 0
                },
            }
        },
        components: {
            ecoContent,
            ecoLoading,
            ecoToolTitle
        },
        // filters: {
        //     'restId': function (arr) {
        //         var len = arr.length;
        //         var str = '';
        //         if (len > 1) {
        //             str = arr[0] + ` +${len - 1}`
        //         } else if (len == 1) {
        //             str = arr[0]
        //         } else {
        //             str = '请选择'
        //         }
        //         return str;
        //     }
        // },
        created() {
            _self = this;
            this.initRole();
            this.callAction();
        },
        computed: {
            contentTop() {
                return this.isShowSearch ? "120px" : "59px";
            }
        },
        methods: {
            preFile(row){
                EcoFile.openFileHeaderByView(row.materialFile, row.materialName);
            },
            restSearContent() {
                this.searchContent = {
                    carModelCode:'',
                    dateRange1:[]
                };
                this.requestData('search',true);
            },
            initRole() {
                const btn_array = [
                    'productioncar.carModelSearchRegulation_download'
                ];
                getRoleBtnSetting(btn_array).then((res) => {
                    if (res.data) {
                        this.btnRoleObj = res.data.authenticationMap;
                    }
                })
            },
            exportCase() {
                this.$refs.refLoading.open();
                let params = {};
                for(var key in this.searchContent){
                    if(this.searchContent[key]){    
                        if(key==='dateRange1' && this.searchContent.dateRange1 && this.searchContent.dateRange1.length!=0){
                            params.implTimeTtFrom  = this.searchContent.dateRange1[0];
                            params.implTimeTtTo = this.searchContent.dateRange1[1];
                        }else if(key === 'carModelCode'){ 
                            params['announcementId'] = this.searchContent[key].split(';')[1];
                        }
                    } 
                }       
                vehicleAnnounceCarExcelExport1(params).then(res => {
                    if( window.navigator && window.navigator.msSaveOrOpenBlob ) {
                        navigator.msSaveBlob(new Blob([res.data],'车型匹配法规情况.xlsx'));
                        this.$refs.refLoading.close();
                    }else{
                        let blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" }); 
                        let url = window.URL.createObjectURL(blob);  
                        let a = document.createElement("a");
                        a.href = url;
                        a.download = '车型匹配法规情况.xlsx';
                        this.$refs.refLoading.close();
                        a.click();
                        window.URL.revokeObjectURL(url);
                    }
                }).catch(err => {
                    this.$refs.refLoading.close();
                })
            },
            callAction() {
                let callBackDialogFunc = function (obj) {
                    if (obj && (obj.action === 'selectVehicleAnnounce')) {
                       _self.searchContent.carModelCode = obj.dataArr.carModelCode + ';' + obj.dataArr.id ;
                       _self.requestData('search',true);
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'modelregulationsList');
            },
            handleSizeChange(val) {
                this.baseInfo.rows = val;
                this.requestData("search",true);
            },
            handleCurrentChange(val) {
                this.baseInfo.page = val;
                this.requestData('search',false);
            },
            changeSearchShow() {
                this.isShowSearch = !this.isShowSearch;
            },
            selectId() {
                var url = '/modelInProduction/index.html#/vehicleAnnounceCarList/'+true +'/finishList'
                EcoUtil.getSysvm().openDialog('选择车型号', url, 1100, 600, '15vh');
            },
            requestData(type,isFirstPage) {
                this.$refs.refLoading.open();
                let params = {
                    rows: this.baseInfo.rows,
                };
                if (type == 'search') {
                    for(var key in this.searchContent){
                        if(this.searchContent[key]){    
                                if(key==='dateRange1' && this.searchContent.dateRange1 && this.searchContent.dateRange1.length!=0){
                                    params.implTimeTtFrom  = this.searchContent.dateRange1[0];
                                    params.implTimeTtTo = this.searchContent.dateRange1[1];
                                }else if(key === 'carModelCode'){ 
                                    params['announcementId'] = this.searchContent[key].split(';')[1];
                                }
                            } 
                    }    
                }
                if(isFirstPage){
                    this.baseInfo.page = 1;
                }
                params.page = this.baseInfo.page;
                vehicleAnnounceCarQueryids(params).then(res => {
                    this.baseInfo.total = res.data.total;
                    this.tableData = res.data.rows;
                    this.$refs.refLoading.close();
                }).catch(err => {
                    this.baseInfo.total = 0;
                    this.tableData = [];
                    this.$refs.refLoading.close();
                })
            },
        }
    }
</script>
<style scoped>
    .modelregulationsList .searchInputLabel {
        font-size: 14px;
        margin: 0 5px 0px 5px;
    }

    .modelregulationsList .selectBox {
        height: 28px;
        width: 170px;
        border: 1px solid #DCDFE6;
        border-radius: 4px;
        cursor: pointer;
        box-sizing: border-box;
        padding-left: 15px;
        font-size: 12px;
        color: rgb(193, 195, 197);
        line-height: 25px;
        margin-right: 7px;
    }

    .modelregulationsList .searchRow {
        padding: 15px 10px 16px 10px;
        background: #fff
    }

    .modelregulationsList .searchRow .el-col {
        display: flex;
        align-items: center;
    }
</style>