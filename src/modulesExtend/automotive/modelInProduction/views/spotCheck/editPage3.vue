<template>
    <eco-content top='0px' bottom='0px' type='tool' v-loading='loading'>
        <div class='spotCheckChild'>
            <eco-content top='0px' bottom='20px'>
                <p class="infoText">{{infoText}}</p>
            </eco-content>
            <eco-content top='21px' bottom='42px' style='padding:10px 15px;'>
                <el-table row-key='id' ref='editPage3Tab'  @selection-change="handleSelectionChange" stripe :data='tableData' header-row-class-name='tableHeader' tooltip-effect='dark' height='100%' class='statisticsTable'>
                    <el-table-column type="selection" width="55" reserve-selection></el-table-column>
                    <el-table-column type='index' label='序号' align='center'>
                        <template slot-scope='scope'>
                            {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                        </template>
                    </el-table-column>
                    <el-table-column prop='status' label='状态'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.status,'spotInRegulationStatus')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='accordWith' label='符合性'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.accordWith,'accordWith')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='standardRegulationNo' width='160' label='标准法规号'></el-table-column>
                    <el-table-column prop='nameStandardsRegulations' label='标准法规名称' width='150'></el-table-column>
                    <el-table-column prop='carModel' label='车型型号'></el-table-column>
                    <el-table-column prop='projectCode' label='项目代号'></el-table-column>
                    <el-table-column prop='deptName' label='部门' width='150'></el-table-column>
                    <el-table-column prop='major' label='专业'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.major,'major')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='designerName' label='设计师'></el-table-column>
                    <el-table-column  label='操作' fixed='right'>
                        <template slot-scope='scope'>
                            <el-button type='text' @click.stop='editCase(scope.row,"viewCase")'>详情</el-button>
                        </template>
                    </el-table-column> 
                </el-table>
            </eco-content>
            <eco-content bottom="0px" type="tool" style="padding:5px 0px">
                <el-row>
                    <el-col :span="24" style="text-align:right">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :current-page.sync="baseInfo.page" :page-sizes="[30,50,100]" :page-size="baseInfo.rows"
                            layout="total, sizes, prev, pager, next, jumper" :total="baseInfo.total" style="margin-right:20px">
                        </el-pagination>
                    </el-col>
                </el-row>
            </eco-content>
        </div>
    </eco-content>
</template>
<script> 
  import ecoContent from "@/components/pageAb/ecoContent.vue";
  import {EcoUtil} from '@/components/util/main.js'
  import {dfHandlingInterfaceDetails,dfHandlingInterfaceAllcount,dfHandlingInterfaceIdentical,dfHandlingInterfaceUpdatestatusy,dfHandlingInterfaceUpdatestatusn} from '../../service/service.js'
  export default {
      data(){
          return {
            multipleSelection:[],
            tableData:[],
            loading:false,
            baseInfo: {
                page: 1,
                rows: 30,
                total: 0
            },
            infoText:''
          }
      },
      activated(){
        //   this.multipleSelection=[];
          this.requestData('search',false,true);
          this.getInfoText();   
      },
      computed:{
        deptName(){
            return this.$route.params.deptName;
        },
        standardRegulationNo(){
            return this.$route.params.standardRegulationNo;
        },
        stepStatus(){
            return this.$route.params.stepStatus
        },ids(){
            var data = this.multipleSelection.map(item=>{
                return item.id;
            })
            return data;
        }
      },
      components:{
        ecoContent
      },methods:{
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        getInfoText(){
            dfHandlingInterfaceAllcount({
                standardRegulationNo:this.standardRegulationNo,
                stepStatus:this.stepStatus
            }).then(res=>{
                this.infoText = `提醒:应到${res.data.allcount} 已完成${res.data.completeCount} 剩余${res.data.allcount-res.data.completeCount}`
            }).catch(err=>{
                this.infoText='';
            })
        },
        //同意
        onSubmit(){
            if(this.multipleSelection.length===0){
                this.$message.warning('未选中数据!');
                return;
            }
            this.loading = true;
            dfHandlingInterfaceIdentical({
                standardRegulationNo:this.standardRegulationNo,
                stepStatus:this.stepStatus
            }).then(res=>{
                if(res.data){
                    dfHandlingInterfaceUpdatestatusn({
                        ids:this.ids,
                        stepStatus:this.stepStatus
                    }).then(res2=>{
                        this.$message.success('同意成功!');
                        this.loading = false;
                        this.$parent.$parent.goBack(false);
                    }).catch(err=>{
                        this.$message.warning('同意失败!');
                        this.loading = false;
                    })
                }else{
                    this.loading = false;
                    this.$message.warning('数据不满足同意条件!');
                }
            }).catch(err=>{
                this.loading = false;
            })
        },
        //退回
        updatenCase(){
            if(this.multipleSelection.length===0){
                this.$message.warning('未选中数据!');
                return;
            }
            this.loading = true;
            dfHandlingInterfaceUpdatestatusy({
                ids:this.ids,
                stepStatus:this.stepStatus
            }).then(res=>{
                this.$message.success('退回成功!');
                this.loading = false;
                this.$parent.$parent.goBack(false); 
            }).catch(err=>{
                this.$message.warning('退回失败!');
                this.loading = false;
            })
        },
        editCase(row,type){
            let url = '/modelInProduction/index.html#/editPageDetails/'+row.id;
            EcoUtil.getSysvm().openDialog('详情', url, "1100", "650", '15vh');
        }, 
        handleSizeChange(val) {
            this.baseInfo.rows = val;
            this.requestData("search",true,true);
        },
        handleCurrentChange(val) {
            this.baseInfo.page = val;
            this.requestData('search',true,false);
        },
        requestData(type,isFirstPage,isClearSelect) {
                if(isClearSelect){
                    this.$refs.editPage3Tab.clearSelection();
                }
                this.loading = true;
                let params = {
                    sort: ['modDate'],
                    order: ['desc'],
                    rows: this.baseInfo.rows,
                    standardRegulationNo:this.standardRegulationNo,  //标准法规名称
                    deptName:this.deptName,
                    stepStatus:this.stepStatus
                };
                if (type === 'search') {
                    for (var key in this.searchContent) {
                        if (this.searchContent[key]) {
                            params[key] = this.searchContent[key];
                        }
                    }
                }
                if(isFirstPage){
                    this.baseInfo.page = 1;
                }
                params.page = this.baseInfo.page;
                dfHandlingInterfaceDetails(params).then(res => {
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
    .infoText{
        color: rgb(255,67,67);
        margin:0px 0 10px 20px;
        font-weight: 700;
        font-size:14px;
    }
</style>