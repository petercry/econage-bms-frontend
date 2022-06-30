<template>
    <eco-content top='0px' bottom='0px ' type='tool' style='background-color: #f5f5f5;'>
        <div class="flowHistory" v-loading='loading'>
            <!-- <eco-content top='0px' height='60px' type='tool'>
                <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
                   <el-col>
                       <strong>流程历史记录</strong>
                   </el-col>
                </el-row>
            </eco-content>  -->
            <eco-content top='0px' bottom='0px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table ref='historyTab'  stripe :data='tableData' header-row-class-name='tableHeader'
                    border tooltip-effect='dark' height='100%' class='standardizationTable'>
                    <el-table-column label='序号' type='index'>
                        <!-- <template slot-scope='scope'>
                            {{(baseInfo.page-1*baseInfo.rows)+(scope.$index+1)}}
                        </template> -->
                    </el-table-column>
                    <el-table-column prop='taskName' label='流程环节'></el-table-column>
                    <el-table-column prop='taskAssigneeName' label='环节操作人'></el-table-column>
                    <el-table-column prop='actionTime' label='操作时间'></el-table-column>
                    <el-table-column prop='opinion' label='审批意见' width='250' show-overflow-tooltip></el-table-column>
                    <el-table-column prop='approveDesc' label='审批结果'></el-table-column>
                </el-table> 
            </eco-content>
           <!-- <eco-content bottom='0px' type='tool' style='padding: 5px 0px;'>
                 <el-row>
                      <el-col>
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="baseInfo.page" :page-sizes="[30,50,100]"
                            :page-size="baseInfo.rows" layout="total, sizes, prev, pager, next, jumper" :total="baseInfo.total"
                            style="margin-right:20px">
                        </el-pagination>
                      </el-col>
                 </el-row>
           </eco-content> -->
        </div>
    </eco-content>
</template>
<script>
    var _self;
    import ecoContent from '@/components/pageAb/ecoContent.vue'
    import { EcoUtil } from '@/components/util/main.js'
    import {designcheckApproveHistoryList} from '../../service/service.js'
    export default {
        name:'flowHistory',
        data(){
            return {
                loading:false,
                tableData:[],
                baseInfo:{
                    rows:30,
                    page:1,
                    total:0,
                }
            }
        },
        components:{
            ecoContent,
        },
        computed:{
            id(){
               return  this.$route.params.id
            }
        },
        mounted(){
            _self = this;
            this.requestData();
        },
        methods:{
            handleSizeChange(val) {
                this.baseInfo.rows = val;
                this.requestData(true)
            },
            handleCurrentChange(val) {
                this.baseInfo.page = val;
                this.requestData();
            },
            requestData(isFirstPage){
               this.loading = true;
               if(isFirstPage){
                   this.baseInfo.page = 1;
               }
             //    params.page = this.baseInfo.page;
             designcheckApproveHistoryList(this.id).then(res=>{
                    this.tableData = res.data;
                    this.loading = false;
              }).catch(err=>{
                    this.tableData = [];
                    this.loading = false;
              })
            },
        }
    }
</script>
<style scoped>
    .flowHistory{
        position: relative;
        overflow-y: auto;
        height: 100%;
        color: #0f1419;
    }
    .flowHistory /deep/ .tableHeader th {
            background: #f5f7fa;
            color: #000;
    }
    .flowHistory .standardizationTable /deep/ .el-table__row.el-table__row--striped td {
            background: #f5f7fa !important;
        }

    .flowHistory .standardizationTable /deep/ .tableHeader th {
            background: #f5f7fa;
            color: #000;
    }
    
    .flowHistory .rowTitle {
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: #fff;
        font-size: 14px;
        background: rgb(103, 112, 126);
        margin-bottom: 20px;
    }
    .mT2{
        margin-top: 20px;
    }
    .flowHistory .tableRow {
        text-align: right;
    }

    .flowHistory .tableRow span {
        margin-right: 2px;
        font-size: 14px;
        color: #0f1419;
    }
    .flowHistory .viewContent {
        color: #606266;
    }
</style>