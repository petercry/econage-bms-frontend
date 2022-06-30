<template>
    <eco-content top='0px' bottom='0px' type='tool' v-loading='loading' class='historyList'>
        <eco-content top='0px' bottom='42px' >
            <el-table stripe :data='tableData' header-row-class-name='tableHeader' tooltip-effect='dark' height='100%'
                class='statisticsTable'>
                <el-table-column label='检验项目'  align='center' prop='testProject' width='160' fixed='left'></el-table-column>
                <el-table-column label='公告' align='center'>
                    <el-table-column width='150'  align='center' show-overflow-tooltip label='是否适用' prop='announcementApplicable'></el-table-column>
                    <el-table-column width='150'  align='center' label='nt' prop='announcementNt'></el-table-column>
                    <el-table-column width='150'  align='center' label='tt' prop='announcementTt'></el-table-column>
                    <el-table-column width='150'  align='center' label='计划' prop='announcementPlan'></el-table-column>
                    <el-table-column width='150'  align='center' label='批次' prop='announcementBatch'></el-table-column>
                </el-table-column>
                <el-table-column label='CCC' align='center'> 
                    <el-table-column width='150' align='center' label='是否适用' prop='cccApplicable'></el-table-column>
                    <el-table-column width='150' align='center' label='NT' prop='cccNt'></el-table-column>
                    <el-table-column width='170' align='center' label='Tt' prop='cccTt'></el-table-column>
                    <el-table-column width='150' align='center' label='计划' prop='cccPlan'></el-table-column>
                    <el-table-column width='170' align='center' label='证书编号' prop='cccCertCode'></el-table-column>
                </el-table-column>      
                <el-table-column width='150' align='center' label='实施情况说明' prop='implementDescription'></el-table-column>
                <el-table-column width='150' align='center' label='申请检验类别' prop='inspectionCategory'></el-table-column>
                <el-table-column width='150' align='center' label='产品ID' prop='productId'></el-table-column>
                <el-table-column width='150' align='center' label='产品型号' prop='productModel'></el-table-column>
                <el-table-column width='150' align='center' label='检验报告编号' prop='inspectionReportCode'></el-table-column>
                <el-table-column width='150' align='center' label='实测项目数' prop='measuredItemsNum'></el-table-column>
                <el-table-column width='150' align='center' label='配置说明' prop='configInstruction'></el-table-column>
                <el-table-column width='150' align='center' label='version' prop='version' fixed='right'></el-table-column>
            </el-table>
        </eco-content>
        <eco-content bottom="0px" type="tool" style="padding:5px 0px">
            <el-row>
                <el-col :span="24" style="text-align:right">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page.sync="baseInfo.page" :page-sizes="[30,50,100]" :page-size="baseInfo.rows"
                        layout="total, sizes, prev, pager, next, jumper" :total="baseInfo.total"
                        style="margin-right:20px">
                    </el-pagination>
                </el-col>
            </el-row>
        </eco-content>
    </eco-content>
</template>
<script>
    import ecoContent from "@/components/pageAb/ecoContent.vue";
    import { EcoUtil } from '@/components/util/main.js'
    import { historyList } from '../service/service.js'
    export default {
        name:'historyList',
        data() {
            return {
                loading: false,
                baseInfo: {
                    page: 1,
                    rows: 30,
                    total: 0
                },
                tableData: []
            }
        },
        created() {
            this.requestData();
        },
        components:{
            ecoContent
        },
        methods: {
            handleSizeChange(val) {
                this.baseInfo.rows = val;
                this.requestData("search");
            },
            handleCurrentChange(val) {
                this.baseInfo.page = val;
                this.requestData();
            },
            requestData(type) {
                this.loading= true;
                let params = {
                    sort: ['modDate'],
                    order: ['desc'],
                    rows: this.baseInfo.rows,
                };
                if(type=='search'){
                    this.baseInfo.page = 1;
                }
                params.page = this.baseInfo.page;
                historyList(params).then(res => {
                    this.baseInfo.total = res.data.total;
                    this.tableData = res.data.rows;
                    this.loading=false;
                }).catch(err => {
                    this.baseInfo.total = 0;
                    this.tableData = [];
                    this.loading=false;
                })
            },
        }
    }
</script>
<style scoped>

</style>