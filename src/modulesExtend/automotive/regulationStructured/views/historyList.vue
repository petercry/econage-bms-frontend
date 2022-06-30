<template>
    <eco-content top='0px' bottom='0px ' type='tool' style='background-color: #f5f5f5;'>
        <div class="historyList" v-loading='loading'>
            <!-- <eco-content top='0px' height='60px' type='tool'>
                <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
                   <el-col>
                       <strong>历史版本</strong>
                   </el-col>
                </el-row>
            </eco-content>  -->
            <eco-content top='0px' bottom='0px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table ref='historyTab'  stripe :data='tableData' header-row-class-name='tableHeader'
                    border tooltip-effect='dark' height='100%' class='standardizationTable'>
                    <el-table-column label='序号' type='index' min-width='60' max-width='160'>
                        <!-- <template slot-scope='scope'>
                            {{(baseInfo.page-1*baseInfo.rows)+(scope.$index+1)}}
                        </template> -->
                    </el-table-column>
                    <el-table-column label='完成时间' prop='completeTime'></el-table-column>
                    <el-table-column label='发起人' prop='initUserName'></el-table-column>
                    <el-table-column label='审批人' prop='approveUserName'></el-table-column>
                    <el-table-column label='操作' fixed='right' align='center' width='150'>
                        <template slot-scope='scope'>
                            <el-button type='text' @click.stop='openFlowList(scope.row.id,"details")'>查看</el-button>
                            <el-button type='text' @click.stop='openFlowList(scope.row.id,"flowList")'>流程历史</el-button>
                        </template>
                    </el-table-column>
                </el-table> 
            </eco-content>
           <!-- <eco-content bottom='0px' type='tool' style='padding: 5px 0px;'>
                 <el-row>
                      <el-col style="text-align:right">
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
    import { EcoMessageBox } from '@/components/messageBox/main.js'
    import {structurebaseArchiveList} from '../service/service.js'
    export default {
        name:'historyList',
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
            ecoContent
        },
        computed:{
            id(){
               return  this.$route.params.id
            }
        },
        mounted(){
            this.requestData();
        },
        methods:{
            openFlowList(id,type){
                let title = (type==='details'?"查看":"流程历史");
                let url = '/regulationStructured/index.html#/flowHistory/'+id+'/'+type;
                EcoUtil.getSysvm().openDialog(title,url,'1000','700');
            },
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
               let params = {
                    id:this.$route.params.id,
                    sort:['LocalDateTime'],
                    desc:['desc'],
                    // rows:this.baseInfo.rows
               }
               if(isFirstPage){
                   this.baseInfo.page = 1;
               }
            //    params.page = this.baseInfo.page;
               structurebaseArchiveList(params).then(res=>{
                    //  this.baseInfo.total = res.data.total;
                     this.tableData = res.data;
                     this.loading = false;
               }).catch(err=>{
                    // this.baseInfo.total = 0;
                    this.tableData = [];
                    this.loading = false;
               })
            },
        }
    }
</script>
<style scoped>
.historyList{
    position: relative;
    overflow-y: auto;
    height: 100%;
    color: #0f1419;
}
.historyList /deep/ .tableHeader th {
        background: #f5f7fa;
        color: #000;
}
.historyList .standardizationTable /deep/ .el-table__row.el-table__row--striped td {
        background: #f5f7fa !important;
    }

.historyList .standardizationTable /deep/ .tableHeader th {
        background: #f5f7fa;
        color: #000;
}
</style>