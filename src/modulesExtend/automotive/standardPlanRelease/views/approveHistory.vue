<template>
    <eco-content top='0px' bottom='0px' type='tool' style='background: #f5f5f5' v-loading='loading'>
        <eco-content top='0px' height='460px' type='tool' style='background: #f5f5f5;overflow:hidden;'>
            <iframe  :name="programId" :id="programId"  v-bind:src="flowSrc" frameborder="0" style="width:100%;height:100%;" />
        </eco-content>
        <div class="approveHistory">
            <eco-content top='0px' height='60px' type='tool' style='overflow:hidden;'>
                <el-row style='padding:16px;background: #fff;border:1px solid #ddd;'>
                    <el-col :span='5'>
                        <strong>审批流程历史意见</strong>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content top='54px' bottom='0px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table border stripe :data='tableData' header-row-class-name='tableHeader' tooltip-effect='dark' height='100%' class='approveHistoryTab'>
                    <el-table-column type='index' label='序号' align='center'></el-table-column>
                    <el-table-column prop='phaseIdName' label='节点' align='center' min-width='90'></el-table-column>    
                    <el-table-column prop='approveUserName' label='审批人员' align='center' min-width='100'></el-table-column>    
                    <el-table-column prop='time' label='审批时间' align='center' min-width='120'></el-table-column>    
                    <el-table-column prop='opinion' label='意见内容' align='center'></el-table-column>      
                </el-table>
            </eco-content>
        </div>
        <!-- <div class="btn">
            <el-button size="medium" @click="onCancel">关闭</el-button>
        </div> -->
    </eco-content>
</template>
<script>
    import ecoContent from "@/components/pageAb/ecoContent.vue";
    import { EcoUtil } from "@/components/util/main.js";
    import { EcoMessageBox } from "@/components/messageBox/main.js";
    import {approveHistoryList} from "../service/service.js"
    export default {
        data(){
            return {
                flowSrc:'',
                tableData:[],
                programId:'',
                loading:false
            }
        },
        components:{
            ecoContent
        },
        created(){
            this.programId = this.$route.params.programId;
            this.flowSrc = '/modelflowView/index.html#/index/planPublishFlowGraph/'+this.programId;
            this.requestData();
        },
        methods:{
            onCancel() {
                EcoUtil.getSysvm().closeDialog();
            },
            requestData(){
                 this.loading = true;
                 approveHistoryList(this.programId).then(res=>{
                    this.loading = false;
                    this.tableData = res.data.rows;
                    console.log(res);
                 })

            }
        }
    }
</script>
<style scoped>
    .approveHistory {
        /* position:relative; */
        /* height: 100%; */
        /* overflow-y: auto; */
        color: #0f1419;
        position:absolute;
        top:460px;
        right:0px;
        left:0px;
        bottom:0px;
    }
     .btn {
        text-align: center;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #ddd;
    }

</style>
