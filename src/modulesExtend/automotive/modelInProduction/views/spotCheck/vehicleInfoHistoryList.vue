<template>
    <eco-content top='0px' bottom='0px' type='tool' v-loading='loading' class='vehicleInfoHistoryList'>
        <eco-content top='0px' bottom='0px' >
            <el-table stripe :data='tableData' header-row-class-name='tableHeader' tooltip-effect='dark' height='100%'
                class='statisticsTable'>
              <el-table-column label='版本' prop='version'></el-table-column>
              <el-table-column label='版本日期' prop='versionDate'></el-table-column>
              <el-table-column label='历史版本' prop='versionName'>
                  <template slot-scope='scope'>
                      <span class='linkBlue' @click='openDetailes(scope.row.id)'>{{scope.row.versionName}}</span>
                  </template>
              </el-table-column>
            </el-table>
        </eco-content>
    </eco-content>
</template>
<script>
    import { EcoUtil } from '@/components/util/main.js'
    import ecoContent from "@/components/pageAb/ecoContent.vue";
    import { productioncarVersionList } from '../../service/service.js'
    export default {
        name:'vehicleInfoHistoryList',
        data() {
            return {
                id:'',
                loading: false,
                tableData: []
            }
        },
        created() {
            this.id = this.$route.params.id;
            this.requestData();
        },
        components:{
            ecoContent
        },
        methods: {
            openDetailes(id){
                let url = '/modelInProduction/index.html#/vehicleInfoHistoryDetails/'+id
                EcoUtil.getSysvm().openDialog('历史列表', url, 800, 500, '15vh'); 
            },
            requestData() {
                this.loading= true;
                productioncarVersionList(this.id).then(res => {
                    this.tableData = res.data;
                    this.loading=false;
                }).catch(err => {
                    this.tableData = [];
                    this.loading=false;
                })
            },
        }
    }
</script>
<style scoped>

</style>