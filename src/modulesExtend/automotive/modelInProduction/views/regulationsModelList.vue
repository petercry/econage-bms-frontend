<template>
    <eco-content top='0px' bottom='0px' style='background-color:#F5F5F5;'>
        <div class='regulationsModelList'>
            <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool' style='overflow:hidden'>
                <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
                    <el-col :span='5' style='height:30px;line-height: 30px;'>
                        <strong>法规查询车型匹配</strong>
                    </el-col>
                    <el-col :span='19' style='text-align: right;'>
                        <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                        <el-button type='primary' size='small' @click='exportCase' v-show="btnRoleObj['productioncar.regulationSearchCarModel_productioncar.regulationSearchCarModel']">导出</el-button>
                    </el-col>
                </el-row>
            </eco-content> 
            <eco-content v-show='isShowSearch' top='59px' height='90px' type='tool'
                style='border:1px solid #ddd;overflow: hidden;'>
                <el-row class='searchRow'>
                    <el-col :span='24'>
                        <span class='searchInputLabel'>标准法规编号:</span>
                        <div class='regulationCodeBox' @click.stop='selectRegulationCode'>
                            {{searchContent.regulationCode|restRegulationCode}}</div>
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
                    <el-table-column label='标准法规编号' prop='regulationCode'></el-table-column>
                    <el-table-column label='标准法规名称' prop='regulationName'></el-table-column>
                    <el-table-column label='车型型号' prop='carModel'></el-table-column>
                    <el-table-column label='项目代号' prop='projectCode'></el-table-column>
                    <el-table-column label='车型名称' prop='modelName'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.modelName,'modelName')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label='车辆类型' prop='modelList'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.modelList,'modelList')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label='动力类型' prop='powerList'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.powerList,'powerList')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label='检验项目' prop='testProject'></el-table-column>
                    <el-table-column label='依据' prop='testAccording'></el-table-column>
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
    import { getRoleBtnSetting,queryregulationCodesList, vehicleAnnounceCarExcelExport2 } from '../service/service.js'
    export default {
        name: 'regulationsModelList',
        data() {
            return {
                btnRoleObj:{},
                searchContent: {
                    regulationCode: []
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
        filters: {
            'restRegulationCode': function (arr) {
                var len = arr.length;
                var str = '';
                if (len > 1) {
                    str = arr[0] + ` +${len - 1}`
                } else if (len == 1) {
                    str = arr[0]
                } else {
                    str = '请选择'
                }
                return str;
            }
        },
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
            initRole() {
                const btn_array = [
                   'productioncar.regulationSearchCarModel_productioncar.regulationSearchCarModel'
                ];
                getRoleBtnSetting(btn_array).then((res) => {
                    if (res.data) {
                        this.btnRoleObj = res.data.authenticationMap;
                    }
                })
            },
            exportCase() {
                this.$refs.refLoading.open();
                let params = {
                    regulationCode: this.searchContent.regulationCode
                }
                vehicleAnnounceCarExcelExport2(params).then(res => {
                    let blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" }); 
                    let url = window.URL.createObjectURL(blob);  
                    let a = document.createElement("a");
                    a.href = url;
                    a.download = '法规匹配车型情况.xlsx';
                    this.$refs.refLoading.close();
                    a.click();
                    window.URL.revokeObjectURL(url);
                }).catch(err => {
                    this.$refs.refLoading.close();
                })
            },
            callAction() {
                let callBackDialogFunc = function (obj) {
                    if (obj && (obj.action === 'selectRegulationCode')) {
                        _self.searchContent.regulationCode = obj.dataArr.map((item) => {
                            return item.regulationCode
                        })
                        _self.requestData('search');
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'regulationsModelList');
            },
            handleSizeChange(val) {
                this.baseInfo.rows = val;
                this.requestData("search");
            },
            handleCurrentChange(val) {
                this.baseInfo.page = val;
                this.requestData();
            },
            changeSearchShow() {
                this.isShowSearch = !this.isShowSearch;
            },
            selectRegulationCode() {
                var url = '/modelInProduction/index.html#/structuredLIst/' + true;
                EcoUtil.getSysvm().openDialog('选择标准法规编号', url, 1100, 600, '15vh');
            },
            requestData(type) {
                this.$refs.refLoading.open();
                let params = {
                    regulationCode: this.searchContent.regulationCode,
                    rows: this.baseInfo.rows,
                };
                if (type == 'search') {
                    this.baseInfo.page = 1;
                }
                params.page = this.baseInfo.page;
                queryregulationCodesList(params).then(res => {
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
    .regulationsModelList .searchInputLabel {
        font-size: 14px;
        margin: 0 5px 0px 5px;
    }

    .regulationsModelList .regulationCodeBox {
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

    .regulationsModelList .searchRow {
        padding: 15px 10px 16px 10px;
        background: #fff
    }

    .regulationsModelList .searchRow .el-col {
        display: flex;
        align-items: center;
    }
</style>