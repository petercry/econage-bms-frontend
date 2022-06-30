<template>
    <div class="test" >
        <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
        <div class="page-header">
             <flowFormStep  :step="3" :title="flowName" @close="closeDialog"></flowFormStep>
        </div>
        <div class="page-content">
            <div class="btn">
                <el-button size="large" type="primary" @click="startTest"><i class="iconfont icon iconrocket"></i> 开始测试</el-button>
                <div class="btn-tip">若不需要进行模拟测试，可以忽略此步骤，直接前往下一步</div>
            </div>
            
            <div class="testlistbox">
               <div class="title">测试历史</div>
               <div class="list">
                    <el-table
                        size="medium"
                        :data="testListData"
                        v-loading="loading"
                        style="width: 100%;">
                        <el-table-column
                            label="流程名称"
                        >
                            <template slot-scope="scope" ><span @click="clickRecordFunc(scope.row)" class="pointerClass">{{flowName}}</span></template>
                        </el-table-column>
                        <el-table-column
                            label="模拟发起人"
                            prop="createUser"
                        >
                        </el-table-column>
                        <el-table-column
                            label="发起时间"
                            prop="createDate"
                        >
                        </el-table-column>
                        <el-table-column
                            label="测试状态"
                        >
                            <template slot-scope="scope" ><span>{{scope.row | rcStatusTxet}}</span></template>
                        </el-table-column>
                    </el-table>
               </div>
           </div>
        </div>
    </div>
</template>
<script>
import flowFormStep from "@/flowform/views/components/flowFormStep.vue";
import {Loading } from 'element-ui';
import {EcoUtil} from '@/components/util/main.js'
import {getApplyUpdateWFModel,getFlowTestRecordList,createFlowTestRecord,getFlowTestRecordView,createFlowTestLine,processFlowTestLine} from '@/flowform/service/service.js'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {EcoMessageBox} from '@/components/messageBox/main.js'

export default{
  data(){
    return {
        operateId:null,
        flowName:null,
        loading:true,
        templateId:null,
        testListData:[]
    }
  },
  components: {
    ecoLoading,
    flowFormStep
  },
  created(){
       
  },
  beforeDestroy() {
     
  },
  mounted(){
        this.templateId = this.$route.params.templateId;
        this.getApplyUpdateWFModelFunc();
        this.getFlowTestRecordListFunc();
  },
  computed:{

  },
  methods: {
      /*获取模版信息*/
      getApplyUpdateWFModelFunc(){
           this.$refs.ecoLoadingRef.open();
           getApplyUpdateWFModel(this.templateId).then((response) => {
                this.$refs.ecoLoadingRef.close();
                if(response.data.status <100){
                    this.operateId = response.data.operate_id;
                    this.flowName = response.data.remap.workflow_model.name;
                }
          }).catch((error) => {
              this.$refs.ecoLoadingRef.close();
          });
      },

      closeDialog(){
          let _closeObj = {};
          _closeObj.clearIframe = true;
          _closeObj.tabClick = true;
          EcoUtil.getSysvm().closeFullScreen(_closeObj);
      },

      /*获取模拟测试记录*/
      getFlowTestRecordListFunc(){
          this.loading = true;
          getFlowTestRecordList(this.templateId).then((response) => {
              this.loading = false;
              if(response.data.success){
                 this.testListData = response.data.queryObj;
              }
          }).catch((error) => {
              this.loading = false;
          });
      },
    
      /*开始模拟测试*/
      startTest(){
          let loadingInstance = Loading.service({ fullscreen: true,text:"创建中...."});
          let test_type = 1;/*手动*/
          //创建测试记录
          createFlowTestRecord(this.templateId,test_type).then((response) => {
                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close();
                });

                if(response.data.status<100){
                    this.testListData.unshift(response.data.remap.record_entity);
                    this.clickRecordFunc(response.data.remap.record_entity);
                }

          }).catch((error) => {
                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close();
                });
          });
      },

        
      clickRecordFunc(rowData){
            if(rowData.rcStatus !=0){
                EcoMessageBox.alert('该测试记录已经失效');
                return ;
            }

            this.$router.push({name:'flowTestDetail',params:{
                    formId:this.$route.params.formId,
                    templateId:this.$route.params.templateId,
                    recordId:rowData.id,
            }});
      },

      /*创建路线*/
      createLineFunc(rowData){
            let _data = {};
            _data.recordId = rowData.id;
            _data.tempId = rowData.templateId;
            createFlowTestLine(_data).then((response) => {
                this.$router.push({name:'flowTestDetail',params:{
                        formId:this.$route.params.formId,
                        templateId:this.$route.params.templateId,
                        recordId:rowData.id,
                }});
            }).catch((error) => {
                
            });
      },

      /*访问路线*/
      processLineFunc(record_id,line_id){
            processFlowTestLine(record_id,line_id).then((response) => {
                console.log(response.data);
            }).catch((error) => {
                
            });
      },

      //访问测试记录
      getFlowTestRecordViewFunc(rowData){
          getFlowTestRecordView(rowData.id).then((response)=>{
              console.log(response.data);
          })
      }

   
  },
  watch: {
     
  },
  filters:{
      rcStatusTxet(item){
          if(item.rcStatus == 0){
              return "有效";
          }
          return "失效"
      }
  }
}
</script>
<style scoped>
  .page-header{
      position: absolute;
      left:0;
      right:0;
      top:0;
      height:55px;
      vertical-align: middle;
      background-color: #fff;
  }

.page-content{
    position: absolute;
    left:0px;
    top:65px;
    bottom:0px;
    right:0px;
    background-color: #f5f5f5;
    overflow:auto;
}
.page-content .btn{
    text-align: center;
    padding: 80px 0 40px;
}
.page-content .btn .el-button{
    margin: 0 auto !important;
    height: 48px !important;
    padding: 0 32px !important;
    line-height: 48px !important;
    font-weight: normal;
}
.page-content .btn .el-button i{
    margin: 0 13px 0 0 !important;
    font-size: 16px;
    line-height: 16px;
}
.page-content .btn .btn-tip{
    font-size: 14px;
    color: #595959;
    margin-top: 32px;
}
.page-content .testlistbox{
    width: 1200px;
    margin: 0 auto 32px;
    background-color: #ffffff;
}
.page-content .testlistbox .title{
    height: 56px;
    line-height: 56px;
    font-size: 16px;
    color: #595959;
    padding: 0 32px;
    border-bottom: 1px solid #e8e8e8;
}
.page-content .testlistbox .list{
    padding: 24px 32px 0 32px;
}
</style>
