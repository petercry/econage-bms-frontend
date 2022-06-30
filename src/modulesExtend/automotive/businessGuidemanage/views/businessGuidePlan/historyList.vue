<template>
    <eco-content top='0px' bottom='0px ' type='tool' style='background-color: #f5f5f5;'>
        <eco-content top='0px' height='460px' type='tool' style='background: #f5f5f5;overflow:hidden;'>
            <iframe  :name="id" :id="id"  v-bind:src="flowSrc" frameborder="0" style="width:100%;height:100%;" />
        </eco-content>
        <div class="historyList" v-loading='loading'>
            <eco-content top='0px' bottom='0px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table ref='historyTab'  stripe :data='tableData' header-row-class-name='tableHeader'
                    border tooltip-effect='dark' height='100%' class='standardizationTable'>
                    <el-table-column label='序号' type='index' min-width='60' max-width='160'>
                    </el-table-column>
                    <el-table-column label='环节' prop='taskName'></el-table-column>
                    <el-table-column label='审批人姓名' prop='taskAssigneeName'></el-table-column>
                    <el-table-column label='审批时间' prop='actionTime'></el-table-column>
                    <el-table-column label='审批意见' prop='opinion'></el-table-column>
                    <el-table-column label='审批结果' prop='approveDesc'></el-table-column>
                </el-table> 
            </eco-content>
        </div>
    </eco-content>
</template>
<script>
    var _self;
    import ecoContent from '@/components/pageAb/ecoContent.vue'
    import { EcoUtil } from '@/components/util/main.js'
    import { EcoMessageBox } from '@/components/messageBox/main.js'
    import {planPublishApproveHistory} from '../../service/service.js'
    export default {
        name:'historyList',
        data(){
            return {
                flowSrc:'',
                loading:false,
                tableData:[]
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
            this.flowSrc = '/modelflowView/index.html#/index/guidelinePlanPublishFlowGraph/'+this.id;
            this.requestData();
        },
        methods:{
            requestData(){
               this.loading = true;
               let params = {
                    id:this.$route.params.id,
                    sort:['actionTime'],
                    desc:['asc'],
               }
               planPublishApproveHistory(params).then(res=>{
                     this.tableData = res.data.rows;
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
.historyList{
    /* position: relative; */
    /* overflow-y: auto; */
    /* height: 100%; */
    color: #0f1419;
    position:absolute;
    top:460px;
    right:0px;
    left:0px;
    bottom:0px;
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