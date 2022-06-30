<template>
  <div class="wfSeqIndexSelect">
        <ecoLoading ref='ecoLoadingRef' text='加载中...' ></ecoLoading>
        <eco-content top="0px" height="60px" type="tool">
            <el-row style="padding:0px 10px 12px 10px;background-color:#fff;border-bottom:1px solid #ddd;">
              <el-col :span="8">
                  <eco-tool-title style="line-height: 34px;" :title="'编号序列 ('+baseInfo.total+')'"></eco-tool-title>
              </el-col>

              <el-col :span="16" style="text-align:right;padding-right:10px;">
                      <el-input
                         placeholder="搜索序号名称"
                         v-model="searchInfo.schName"
                         style="width:200px;margin-right:10px" 
                         @keyup.enter.native="searchFunc"
                         v-show="false"
                        >
                        <i slot="suffix" @click="searchFunc" style="cursor:pointer;" class="el-input__icon el-icon-search"></i>
                      </el-input>
              </el-col>
          </el-row>
    </eco-content>

    <eco-content bottom="42px" top="43px" ref="content" class="ecoContentClass"  style="padding:0px;">
         <el-table
         ref="multipleTable"
            :data="dataList"
            stripe
            class="flowlist"
            style="width: 100%;min-width:auto"
            size="mini" 
            height="100%"
            :default-sort = "{prop: 'create_date_', order: 'descending'}"
            @sort-change="sortTablefunc"
          >

          <el-table-column
                label="操作"
                width="50"
                >
                <template slot-scope="scope"><span class="pointerClass selecBtn" @click="doSeqIndexSelect(scope.row)">选择</span></template>
        </el-table-column>

          <el-table-column 
                class="font"
                label="序号名称"
                show-overflow-tooltip
                prop="name"
              >
              <template slot-scope="scope">
                  <span  >{{ scope.row.name }}</span>
              </template>
         </el-table-column>


          <el-table-column 
                class="font"
                label="流水号"
                show-overflow-tooltip
                prop="ticketPreview"
              >
              <template slot-scope="scope">
                  <span  >{{ scope.row.ticketPreview }}</span>
              </template>
         </el-table-column>

        <el-table-column
            show-overflow-tooltip
            label="状态"
            width="80"
            >
            <template slot-scope="scope" >
              <div style="">
                <span v-if="scope.row.status=='NOT_USED'">未使用</span>
                <span v-if="scope.row.status=='USED'">已使用</span>
              </div>
            </template>
          </el-table-column>
        
        <el-table-column
                label="位数"
                width="80"
                prop="length"
            >
            <template slot-scope="scope"><span>{{scope.row.length}}</span></template>
        </el-table-column>

          <el-table-column
                label="重置周期"
                width="150"
            >
                <template slot-scope="scope" ><span>{{getResetCycl(scope.row.idxResetType)}}</span></template>
          </el-table-column>

          <el-table-column
                label="初始值"
                width="70"
              >
               <template slot-scope="scope" ><span>{{scope.row.startIdx}}</span></template>
          </el-table-column>

         <el-table-column
                label="创建人"
                width="190"
                show-overflow-tooltip
            >
                <template slot-scope="scope" ><span>{{scope.row.createUser}}</span></template>
          </el-table-column>
        </el-table>
   
    </eco-content>

   <eco-content  bottom="0px" type="tool" style="padding:5px 0px">
       <el-row>
          <el-col :span="24" class="top-bottom" style="text-align:right;">
                <div >
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="baseInfo.page"
                    :page-sizes="[10,30,50,100]"
                    :page-size="baseInfo.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="baseInfo.total">
                  </el-pagination>
                </div>
          </el-col>
        </el-row>
    </eco-content>

  </div>
</template>
<script>

  import {getWFSeqIndexListAjax,getCommonSequenceIdxRestType} from '../../service/service'
  import {rows,sysEnv} from '../../config/env.js'
  import {Loading } from 'element-ui';
  import ecoContent from '@/components/pageAb/ecoContent.vue'
  import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
  import ecoLoading from '@/components/loading/ecoLoading.vue'
  import {EcoMessageBox} from '@/components/messageBox/main.js'
  import {EcoUtil} from '@/components/util/main.js'
  

  export default {
      components:{
          ecoContent,
          ecoToolTitle,
          ecoLoading
      },
      data(){
          return{
              baseInfo:{
                  validFlag:0,
                  page:1,
                  rows:rows,
                  sort:'create_date_',
                  order:'desc',
                  schName:null,
                  total:0,
              },

              searchInfo:{
                    schName:null,
              },

              dataList:[],
           
              resetCyclArr:[],
              idxResetTypeMap:{},
          }
      },

      created(){

      },
      mounted(){
           this.listAction();
           window.ecoSeqIndexSelectVm = this;

           this.getCommonSequenceIdxRestTypeFunc();
           this.getWFSeqIndexListFunc();
           
      },
      computed:{
          
      },
      methods: {
          listAction(){
                let callBackDialogFunc = function(obj){
                    if(obj && obj.action == 'wfSeqIndexRefreshBack'){
                          window.ecoSeqIndexSelectVm.getWFSeqIndexListFunc();
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'ecoSeqIndexSelect');
          },

            getCommonSequenceIdxRestTypeFunc(){
                    getCommonSequenceIdxRestType().then(res=>{
                        this.idxResetTypeMap = res.data;
                    }).catch(e=>{})
            },

          getWFSeqIndexListFunc(){
                this.$refs.ecoLoadingRef.open();
                getWFSeqIndexListAjax(this.baseInfo).then((response)=>{
                       this.dataList = response.data.rows;
                       this.baseInfo.total = response.data.total
                       this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                            this.$refs.multipleTable.doLayout();
                        });
                      this.$refs.ecoLoadingRef.close();
                }).catch((error)=>{
                      this.$refs.ecoLoadingRef.close();
                });
          },

         sortTablefunc(column,prop,order){
              if(column.prop && column.order){
                  this.baseInfo.sortCol = column.prop;
                  if(column.order == 'ascending'){
                      this.baseInfo.sortCol =  this.baseInfo.sortCol+' asc';
                  }else if(column.order == 'descending'){
                      this.baseInfo.sortCol =  this.baseInfo.sortCol+' desc';
                  }
              }else{
                  this.baseInfo.sortCol  = null;
              }
              this.getWFSeqIndexListFunc();
         },

          // 分页
          handleSizeChange(val) {
              this.$refs.content.setScollTop(0);
              this.baseInfo.pageSize = val;
              this.baseInfo.page = 1;
              this.getWFSeqIndexListFunc();
          },

          handleCurrentChange(val) {
              this.$refs.content.setScollTop(0);
              this.baseInfo.page = val;
              this.getWFSeqIndexListFunc();
          },

          changeValid(){
               this.getWFSeqIndexListFunc();
          },

          searchFunc(){
              this.baseInfo.schName = this.searchInfo.schName;
              this.getWFSeqIndexListFunc();
          },


          getResetCycl(resetCycl){
              return this.idxResetTypeMap[resetCycl]?this.idxResetTypeMap[resetCycl]:null;
          },

          doSeqIndexSelect(item){
                let doObj = {}
                doObj.action = 'wfSeqIdxSelectBack';
                doObj.data = {};

                doObj.data.lgId = item.id;
                doObj.data.name = item.name;

                doObj.data.logicEntity = {};
                doObj.data.logicEntity.startIdx = item.startIdx;
                doObj.data.logicEntity.length = item.length;


                doObj.close = true;
                EcoUtil.getSysvm().callBackDialogFunc(doObj);
          }
      }

  }

</script>

<style scoped>
.wfSeqIndexSelect{
    position: relative;
    height: 99%;
    margin: 0 0px;
    top: 0%;
    overflow-y: hidden;
}

.wfSeqIndexSelect .title{
  color:#262626;
  font-size: 14px;
  line-height: 28px;
  height:28px;
}

.wfSeqIndexSelect .addWFModule i{
  margin-right:5px;
  font-size: 12px;
}

.wfSeqIndexSelect .selecBtn{
    color:#409EFF;
}
     
</style>
