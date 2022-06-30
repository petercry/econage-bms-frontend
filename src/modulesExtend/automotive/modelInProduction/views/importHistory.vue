<template>
    <eco-content top='0px' bottom='0px' type='tool' v-loading='loading' class='importHistory'>
        <eco-content top='0px' bottom='42px' >
            <el-table stripe :data='tableData' header-row-class-name='tableHeader' tooltip-effect='dark' height='100%'
                class='statisticsTable'>
              <el-table-column label='序号' type='index'></el-table-column>
              <el-table-column label='上传日期' prop='createDate'></el-table-column>
              <el-table-column label='上传人' prop='createUserName'></el-table-column>
              <el-table-column label='文件名称' prop='fileName' align='center'>
                  <template slot-scope='scope'>
                      <span class='linkBlue' @click="preFile(scope.row)">{{scope.row.fileName}}</span>
                  </template>
              </el-table-column>
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
    import { EcoFile } from '@/components/file/main.js'
    import ecoContent from "@/components/pageAb/ecoContent.vue";
    import { EcoUtil } from '@/components/util/main.js'
    import { historyImportList } from '../service/service.js'
    export default {
        name:'importHistory',
        data() {
            return {
                masterId:'',
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
            this.masterId = this.$route.params.masterId;
            this.requestData();
        },
        components:{
            ecoContent
        },
        methods: {
            preFile(row){
                EcoFile.openFileHeaderByView(row.fileId, row.fileName);
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
                this.loading= true;
                let params = {
                    masterId:this.masterId,
                    sort: ['modDate'],
                    order: ['desc'],
                    rows: this.baseInfo.rows,
                };
                if(type=='search'){
                    this.baseInfo.page = 1;
                }
                params.page = this.baseInfo.page;
                historyImportList(params).then(res => {
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