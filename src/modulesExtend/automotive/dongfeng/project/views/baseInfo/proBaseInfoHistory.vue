<template>
    <div class='proBaseInfoHistory'>
        <div class="toolbar">
            <el-row>
                <el-col :span="12">
                    <eco-tool-title style="line-height: 34px;" title="历史记录"></eco-tool-title>
                </el-col>
                <el-col :span="12" style="text-align:right">
                    <el-button type="primary" @click="goBack">返回</el-button>
                </el-col>
            </el-row>
        </div>
        <eco-content top="60px" bottom="42px" style="padding:0px 15px;">
            <el-table :data="proBaseInfoHistoryList" highlight-current-row stripe class="styleTableDefault"
                style="width: 100%" size="mini" height="100%" ref="historyTable" v-loading='loading'> 
                <el-table-column label='项目名称' prop='projectName'></el-table-column>
                <el-table-column label='项目编号' prop='projectCode'></el-table-column>
                <el-table-column label='修改时间' prop='createDate'></el-table-column>
            </el-table>
        </eco-content>
        <eco-content bottom="0px" type="tool" style="padding:5px 0px">
            <el-row>
                <el-col :span="24" style="text-align:right">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page.sync="baseInfo.page" :page-sizes="[10,30,50,100]" :page-size="baseInfo.rows"
                        layout="total, sizes, prev, pager, next, jumper" :total="baseInfo.total"
                        style="margin-right:20px">
                    </el-pagination>
                </el-col>
            </el-row>
        </eco-content>
    </div>
</template>
<script>

    import { projectHistory} from '../../service/service'
    import ecoContent from '@/components/pageAb/ecoContent.vue'
    import { mapState, mapActions } from 'vuex';
    import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
    export default {
        data() {
            return {
                loading:false,
                proBaseInfoHistoryList: [],
                baseInfo: {
                    page: 1,
                    rows: 10,
                    total: 0
                }
            }
        },
        components: {
            ecoContent,
            ecoToolTitle
        },
        created(){
            this.requestData();
        },
        methods: {
            requestData(isFirstP){
                 this.loading = true;
                 let params={
                     id:this.$route.params.proId,
                     rows : this.baseInfo.rows
                 }
                 if(isFirstP){
                    this.baseInfo.page=1;
                 }
                 params.page =  this.baseInfo.page;
                 projectHistory(params).then(res=>{
                     this.proBaseInfoHistoryList=res.data.rows;
                     this.baseInfo.total = res.data.total;
                     this.loading=false;
                 }).catch(err=>{
                    this.loading=false;
                    this.proBaseInfoHistoryList=[];
                    this.baseInfo.total = 0;
                 })

            },
            goBack() {
                this.$router.push({ name: 'proBaseInfo' });
            },
            //每页条数
            handleSizeChange(val) {
                this.$refs.historyTable.bodyWrapper.scrollTop = 0;
                this.requestData();
            },
            //跳转页码
            handleCurrentChange(val) {
                this.$refs.historyTable.bodyWrapper.scrollTop = 0;
                this.baseInfo.page = val;
               
            }


        }

    }
</script>
<style scoped>
.proBaseInfoHistory{
    padding:0px 20px 20px 20px;
    background-color:#fff;
}

.proBaseInfoHistory .toolbar{
    margin-top: 10px;
    margin-bottom:10px;
}

.proBaseInfoHistory .toolbar .title{
    font-size: 14px;
    border-left:5px solid red;
    padding-left:5px;
}


</style>