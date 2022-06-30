<template>
    <eco-content top='0px' bottom='0px' type='tool' v-loading='loading'>
        <div class='generateTask'>
            <ecoLoading ref='generateTaskLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool' style='overflow:hidden'>
                <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
                    <el-col :span='5' style='height:30px;line-height: 30px;'>
                        <strong></strong>
                    </el-col>
                    <el-col :span='19' style='text-align: right;'>
                        <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                        <el-button type='primary' size='small' @click='generateCase'>生成</el-button>
                        <el-button type='primary' size='small' @click='saveCase'>保存</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content v-show='isShowSearch' top='59px' height='60px' type='tool'
                style='border:1px solid #ddd;overflow: hidden;'>
                <el-row class='searchRow'>
                    <el-col :span='24' style='display: flex;align-items: center;'>
                        <span class='searchInputLabel'>标准法规编号:</span>
                        <div class='standardRegulationNoBox' @click.stop='selectRegulationCode'>
                            {{searchContent.standardRegulationNo||"请选择"}}</div>
                        <span class='searchInputLabel'>标准法规名称:</span>
                        <el-input clearable style='width:170px' v-model='searchContent.nameStandardsRegulations'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <!-- <el-button @click='requestData("search")' type='primary' v-show='!isGenerate'>查询</el-button> -->
                        <el-button @click='restSearContent'  style='margin-left:5px;'>重置</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table stripe border :data='tableData' header-row-class-name='tableHeader' tooltip-effect='dark'
                    height='100%' class='statisticsTable'>
                    <el-table-column width='150' align='center' label='状态' prop='status'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.status,'spotInRegulationStatus')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width='150' align='center' label='车型型号' prop='carModel'></el-table-column>
                    <el-table-column width='150' align='center' label='项目代号' prop='projectCode'></el-table-column>
                    <el-table-column width='150' align='center' label='适用车型' prop='carModelType'></el-table-column>
                    <el-table-column width='150' align='center' label='动力类型' prop='carModelValue'></el-table-column>
                    <el-table-column width='150' align='center' label='检验项目' prop='inspectionItems'></el-table-column>
                    <el-table-column width='150' align='center' label='依据' prop='basis' fixed='right'></el-table-column>
                    </el-table-column>
                </el-table>
            </eco-content>
            <eco-content bottom="0px" type="tool" style="padding:5px 0px">
                <el-row>
                    <el-col :span="24" style="text-align:right">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :disabled='tableData.length==0'  :current-page.sync="baseInfo.page" :page-sizes="[30,50,100]" :page-size="baseInfo.rows"
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
    import { EcoUtil } from '@/components/util/main.js'
    import { spotInRegulationList, spotInRegulationAdded,spotInRegulationSave } from '../../service/service.js'
    import ecoLoading from "@/components/loading/ecoLoading.vue";
    export default {
        name: 'generateTask',
        data() {
            return {
                loading: false,
                baseInfo: {
                    page: 1,
                    rows: 30,
                    total: 0
                },
                tableData: [],
                isShowSearch: true,
                searchContent: {
                    standardRegulationNo: '',
                    nameStandardsRegulations: ''
                }
            }
        },
        created() {
            _self = this;
            this.callAction();
        },
        computed: {
            contentTop() {
                return this.isShowSearch ? "120px" : "59px";
            }
        },
        components: {
            ecoContent,
            ecoLoading
        },
        methods: {
            saveCase(){
                if(this.tableData.length===0){
                    this.$message.warning('暂无数据保存');
                    return;
                }
                spotInRegulationAdded({
                    page:1,
                    rows:this.baseInfo.total,
                    standardRegulationNo: this.searchContent.standardRegulationNo,
                    nameStandardsRegulations: this.searchContent.nameStandardsRegulations
                }).then(res=>{
                    spotInRegulationSave(res.data.rows).then(res2=>{
                        // router-view -> el-drawer -> 主
                        this.$message.success('新增成功!');
                        this.$parent.$parent.initDrawerInfo(true);
                    }) 
                })
            },
            callAction() {
                let callBackDialogFunc = function (obj) {
                    //选择标准法规编号
                    if (obj && (obj.action === 'selectRegulationCode')) {
                        // if (obj.dataArr) {
                        //     var standardRegulationNoList = [];
                        //     var nameStandardsRegulationsList = [];
                        //     obj.dataArr.forEach(item => {
                        //         standardRegulationNoList.push(item.regulationCode);
                        //         nameStandardsRegulationsList.push(item.regulationName);
                        //     });
                        //     _self.searchContent.standardRegulationNo = standardRegulationNoList;
                        //     _self.searchContent.nameStandardsRegulations = nameStandardsRegulationsList;
                        // }
                        _self.searchContent.standardRegulationNo = obj.data.regulationCode;
                        _self.searchContent.nameStandardsRegulations = obj.data.regulationName;
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'generateTaskList');
            },
            selectRegulationCode() {
                var url = '/modelInProduction/index.html#/structuredLIst/'+false;
                EcoUtil.getSysvm().openDialog('选择标准法规编号', url, 1100, 600, '15vh');
            },
            generateCase() {
                if (!this.searchContent.standardRegulationNo) {
                    this.$message.warning('请选择标准法规编号!');
                    return;
                }
                this.requestData('search')
            },
            restSearContent(){
                this.searchContent = {
                    standardRegulationNo:'',
                    nameStandardsRegulations:''
                }
                this.baseInfo.page = 1;
                this.baseInfo.total = 0;
                this.tableData = [];
            },
            changeSearchShow() {
                this.isShowSearch = !this.isShowSearch;
            },
            handleSizeChange(val) {
                this.baseInfo.rows = val;
                this.requestData("search");
            },
            handleCurrentChange(val) {
                this.baseInfo.page = val;
                this.requestData();
            },
            requestData(type) {
                this.loading = true;
                let params = {
                    rows: this.baseInfo.rows,
                };
                if (type == 'search') {
                    this.baseInfo.page = 1;
                }
                for (var key in this.searchContent) {
                    if (this.searchContent[key]) {
                        params[key] = this.searchContent[key];
                    }
                }
                params.page = this.baseInfo.page;
                // params.sort = ['modDate'];
                // params.order = ['desc'];
                // spotInRegulationList(params).then(res => {
                //     this.baseInfo.total = res.data.total;
                //     this.tableData = res.data.rows;
                //     this.loading = false;
                // }).catch(err => {
                //     this.baseInfo.total = 0;
                //     this.tableData = [];
                //     this.loading = false;
                // })

                //生成
                spotInRegulationAdded(params).then(res => {
                    this.baseInfo.total = res.data.total;
                    this.tableData = res.data.rows;
                    this.loading = false;
                }).catch(err => {
                    this.baseInfo.total = 0;
                    this.tableData = [];
                    this.loading = false;
                })
            },
        }
    }
</script>
<style scoped>
    .generateTask {
        /* min-width: 1200px; */
        position: relative;
        /* margin: 0 24px; */
        /* top: 2%; */
        height: 98%;
        overflow-y: auto;
        color: #0f1419;
    }

    .generateTask .searchRow {
        padding: 15px 10px 16px 10px;
        background: #fff;
    }

    .generateTask .searchInputLabel {
        font-size: 14px;
        margin-left: 5px;
    }

    .generateTask .standardRegulationNoBox {
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
</style>