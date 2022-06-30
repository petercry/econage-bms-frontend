<template>
  <div class="wfCodeList wfEco">
        <ecoLoading ref='ecoLoadingRef' text='加载中...' ></ecoLoading>
        <eco-content top="0px" height="60px" type="tool">

            <el-row style="padding:12px 10px;background-color:#fff;border-bottom:1px solid #ddd;">
              <el-col :span="8">
                  <eco-tool-title style="line-height: 34px;" :title="'编号序列 ('+baseInfo.total+')'"></eco-tool-title>
              </el-col>
              
              <el-col :span="16" style="text-align:right;padding-right:10px;">
                      <el-input
                         placeholder="搜索序号名称"
                         v-model="searchInfo.schName"
                         style="width:200px;margin-right:10px" 
                         @keyup.enter.native="searchFunc"
                        >
                        <i slot="suffix" @click="searchFunc" style="cursor:pointer;" class="el-input__icon el-icon-search"></i>
                      </el-input>
                      <el-button type="primary" class="addWFModule" @click="addSeqIndex"><i class="icon iconfont iconxinjianwenjian"></i>新建编号序列</el-button>
              </el-col>
          </el-row>
    </eco-content>

    <eco-content bottom="42px" top="59px" ref="content" class="ecoContentClass"  style="padding:15px;">
         <el-table
         ref="multipleTable"
            :data="dataList"
            stripe
             class="flowlist"
            style="width: 100%"
             size="mini" 
            height="100%"
            :default-sort = "{prop: 'create_date', order: 'descending'}"
            @sort-change="sortTablefunc"
          >

            <el-table-column 
                class="font"
                label="序号名称"
                show-overflow-tooltip
                prop="name"
              >
              <template slot-scope="scope">
                  <span class="pointerClass" >{{ scope.row.name }}</span>
              </template>
         </el-table-column>
        
        <el-table-column
            label="位数"
            width="100"
            prop="segSize"
            >
            <template slot-scope="scope"><span>{{scope.row.segSize}}</span></template>
        </el-table-column>

         <el-table-column
                label="位数溢出规则"
                width="150"
            >
                <template slot-scope="scope"><span>{{getOverflowLg(scope.row.overflowLg)}}</span></template>
          </el-table-column>

          <el-table-column
                label="重置周期"
                width="200"
            >
                <template slot-scope="scope" ><span>{{getResetCycl(scope.row.resetCycl)}}</span></template>
          </el-table-column>

          <el-table-column
                label="初始值"
                width="80"
              >
               <template slot-scope="scope" ><span>{{scope.row.initVal}}</span></template>
          </el-table-column>

          <el-table-column
                label="当前序号"
                width="80"
            >
                <template slot-scope="scope" ><span>{{scope.row.currVal}}</span></template>
          </el-table-column>

         <el-table-column
                label="引用此序列的流程模板"
                width="180"
            >
                <template slot-scope="scope" ><span>{{scope.row.createUserName}}</span></template>
          </el-table-column>

         <el-table-column
              label="操作"
              width="100"
              >
              <template slot-scope="scope" >
                  <div v-show="baseInfo.validFlag == 0">
                    
                    <span @click="editWFSeqIndex(scope.row)" class="pointerClass" style="color:#409EFF;">修改</span> 
                 
                 </div>
              </template>
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

  import {initWFAjax,getWFSeqIndexListAjax,deleteWFTemplateSingle,recoverWFTemplateSingle} from '@/flowform/service/service'
  import {rows,sysEnv} from '@/flowform/config/env.js'

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
                  pageSize:rows,
                  sortCol:'create_date desc',
                  schName:null,
                  total:0,
              },
              searchInfo:{
                schName:null,
              },
              dataList:[],
              validFlagOptions:[],

              overflowLgArr:[],
              resetCyclArr:[],
          }
      },

      created(){
            this.validFlagOptions.push({value:0,label:'使用中'});
            this.validFlagOptions.push({value:2,label:'已失效'});

            this.overflowLgArr.push({id:0,desc:'全部显示'});
            this.overflowLgArr.push({id:1,desc:'自动截断'});

            this.resetCyclArr.push({id:1,desc:'基于前后缀自动重置'});
            this.resetCyclArr.push({id:2,desc:'每天重置（凌晨12点）'});
            this.resetCyclArr.push({id:3,desc:'每周重置（周天凌晨12点）'});
            this.resetCyclArr.push({id:4,desc:'每月重置（月末凌晨12点）'});
            this.resetCyclArr.push({id:5,desc:'每年重置（年末凌晨12点）'});

      },
      mounted(){
           this.listAction();
           window.ecoSeqIndexListVm = this;
           this.getWFSeqIndexListFunc();
      },
      computed:{
          
      },
      methods: {
          listAction(){
                let callBackDialogFunc = function(obj){
                    if(obj && obj.action == 'wfSeqIndexRefreshBack'){
                          window.ecoSeqIndexListVm.getWFSeqIndexListFunc();
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'wfSeqIndexList');
                window.tabClickFunc = function(){
                     window.ecoSeqIndexListVm.getWFSeqIndexListFunc();
                }
          },

          getWFSeqIndexListFunc(){
                this.$refs.ecoLoadingRef.open();
                getWFSeqIndexListAjax(this.baseInfo).then((response)=>{
                      if(response.data.success){
                            this.dataList = response.data.queryObj.list;
                            this.baseInfo.total = response.data.queryObj.total
                      }
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

          addSeqIndex(){
               if(sysEnv == 1){
                    let url = '/flowform/index.html#/wfSeqIndexAdd';
                     EcoUtil.getSysvm().openDialog('创建编号序列',url,600,330,'8vh');
               }else{
                    this.$router.push({name:'wfSeqIndexAdd'})
               }
          },
          
          /*修改*/
          editWFSeqIndex(row){
                 if(sysEnv == 1){
                    let url = '/flowform/index.html#/wfSeqIndexEdit/'+row.lgId;
                    EcoUtil.getSysvm().openDialog('编辑编号序列',url,600,330,'8vh');
                 }else{
                     this.$router.push({name:'wfSeqIndexEdit',params:{id:row.lgId}})
                 }
          },

          deleteTemplate(temp_id){
               this.$confirm('是否确认删除此模板', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                    deleteWFTemplateSingle(temp_id).then((response)=>{
                        if(response.data.status < 100){
                            this.getWFSeqIndexListFunc();
                        }
                    })
              }).catch(() => {

              });
             
          },

          getOverflowLg(overflowLg){
              let _name = '';
              for(let i = 0;i<this.overflowLgArr.length;i++){
                  if(this.overflowLgArr[i].id == overflowLg){
                      _name = this.overflowLgArr[i].desc;
                      break;
                  } 
              }
              return _name;
          },

          getResetCycl(resetCycl){
              let _name = '';
              for(let i = 0;i<this.resetCyclArr.length;i++){
                  if(this.resetCyclArr[i].id == resetCycl){
                      _name = this.resetCyclArr[i].desc;
                      break;
                  } 
              }
              return _name;
          }
      }

  }

</script>

<style scoped>
.wfCodeList{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
}

.wfCodeList .title{
  color:#262626;
  font-size: 14px;
  line-height: 28px;
  height:28px;
}

.wfCodeList .addWFModule i{
  margin-right:5px;
  font-size: 12px;
}
.split{
    border-right: 1px solid #ddd;
    margin: 0 10px 0 5px;
}
.circle{
        width: 6px;
        height: 6px;
        position: relative;
        top: -2px;
        border-radius: 50%;
        display: inline-block;
        margin-right:2px;
  }
  .blue{
      background-color:#409EFF;
  }
  .red{
      background-color:#F56C6C;
  }
  .green{ 
       background-color:#67C23A;
  }
  .cancel{
      background-color:#909399;
  }
     
</style>
