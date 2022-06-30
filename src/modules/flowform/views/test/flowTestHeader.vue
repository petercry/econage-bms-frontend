<template>
  <div class="flowTestToolbar">
        <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
        <el-row>
                <el-col :span="8">
                    <div style="margin-left:10px;" class="flowTestToolCol">
                        <span v-if="!showIpt" 
                             v-bind:class="{pointerClass:(formTask && formTask.level == 1  && formTask.currRound == 1 && (formTask.status == 3 || formTask.status == -1))}"
                             style="line-height:38px;min-width:50px;padding-top:1px"
                             @click="setWFNameIptShow" 
                            >
                            &nbsp;{{wfName}}&nbsp;
                            <i v-if="(formTask && formTask.level == 1  && formTask.currRound == 1 && (formTask.status == 3 || formTask.status == 1))" class="icon iconfont iconbianji" style="font-size:10px;color:#3a8ee6"></i>
                        </span>
                        <el-input @blur="setWFNameIptHidden" v-else class="wfNameIpt"  v-model="wfName" ref="wfNameIpt"  placeholder="请输入流程名称" style="width:150px;padding-top:4px;"></el-input>
                        <span class="taskDesc" >{{(formTask && formTask.name)? " |":''}}&nbsp;&nbsp;{{formTask?formTask.name:''}}</span>
                    </div>
                </el-col>

                <el-col :span="8">
                  <div class="testDesc" >
                      &nbsp;
                        <span v-show="testTaskItem">正在模拟:</span>
                        <span v-show="testTaskItem">{{testTaskItem?testTaskItem.assigneeName:''}}</span>
                        <span v-show="testTaskItem">{{testTaskItem?testTaskItem.name:''}}</span>
                     &nbsp;
                  </div>
                </el-col>

                <el-col :span="8" class="rightCol">
                    <div class="flowTestToolCol">
                        <eco-button v-show="testTaskItem" type="tool" :leftSplit="false"  @click.native="showFlowChart" >
                                <i class="icon iconfont iconliuchengtu toolbar" ></i>
                                <span  class="toolbar">&nbsp;流程图</span>
                        </eco-button>
                        <eco-button v-show="testTaskItem" type="tool" :leftSplit="false" @click.native="getPrintSetList(0)" v-if="isShowPrint">
                                <i class="icon iconfont icondayin1 toolbar" ></i>
                                <span class="toolbar">&nbsp;打印流程</span>
                        </eco-button>
                        <span  class="closeSpan pointerCalss">
                            <i style="font-size:20px;" class="icon iconfont iconshanchudelete30" @click="closeDialog"></i>
                        </span>
                    </div>
            </el-col>
        </el-row>

          
 </div>
</template>
<script>

import {mapState,mapMutations} from 'vuex'
import {getSelectedPrintSetList,getPrintFormData,changeWfStatus} from'@/flowform/service/service'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {EcoUtil} from '@/components/util/main.js'
import {EcoFile} from '@/components/file/main.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import ecoButton from '@/components/button/ecoButton.vue'


export default{
   components:{
     ecoLoading,
     ecoButton
  },
  name:'flowTestToolbar',
  props:{  
        formWf:{
            type:Object
        },
        formTask:{
            type:Object
        },
        formPageRender:{
            type:Object,
            default:function(){
                return {};
            }
        },
        testTaskItem:{
            type:Object
        }
  },
  data(){
    return {
        wfName:null,
        showIpt:false
    }
  },
  created(){
     
  },
  mounted(){
    
  },
  computed:{
        isShowPrint:function(){
            if(this.formPageRender && this.formPageRender.BUTTON_PRINT && this.formPageRender.BUTTON_PRINT.SET_VISIBALE == "0"){
                return false;
            }else{
                return true;
            }
        },
  },
  methods: {
    
      getWFName(){
         return this.wfName;
      },

      setWFNameIptShow(){
          if(this.formTask && this.formTask.level == 1 && this.formTask.currRound == 1 && (this.formTask.status == 3 || this.formTask.status == 1) ){
              this.showIpt = true;
              let that = this;
                setTimeout(function(){
                        that.$refs.wfNameIpt.focus();
                },200)
          }
      },

      setWFNameIptHidden(){
          this.showIpt = false;
      },

      showFlowChart(){
          if(this.formWf && this.formWf.wfId!=0){
            // this.$router.push({name:'showFlowChart',params:{wfId:this.formWf.wfId}});   
               EcoUtil.getSysvm().showFlowChart(this.formWf.wfId);
          }
      },

   
      goWFList(){
          this.$router.replace({name:'wfToDo'});
      },

      getPrintSetList(flag,uKeyBaseInfo){
         this.$refs.ecoLoadingRef.open();
         getSelectedPrintSetList(this.formWf.wfId).then((response) => {
            this.$refs.ecoLoadingRef.close();
            if(response.data.status<100){
                let remap = response.data.remap;
                let len = remap.print_set_list.length;
                if(len>1){
                    // this.$router.push({name:'printSetList',params:{wfId:this.formWf.wfId}});
                    let _width = '700';
                    let _height = '400';
                    let url = '/wh/jsp/version3/flowform/index.html#/printSetList/'+this.formWf.wfId+'/'+flag;
                    EcoUtil.getSysvm().openDialog('选择打印模板',url,_width,_height,'50px');
                    
                }else if(len == 1 ){    
                    this.$refs.ecoLoadingRef.open();
                    let _printTemplateId = remap.print_set_list[0].id;
                    getPrintFormData(this.formWf.wfId,remap.print_set_list[0].id).then((response) => {
                        this.$refs.ecoLoadingRef.close();
                        if(response.data.status<100){
                            let obj = response.data.remap;
                            if(flag == 0){//ukey
                                EcoFile.openFileByPdfJs(obj.filder_header_id,obj.model_id);
                            }else if(flag == 1 || flag == 2){//ukey
                                if(null == obj){
                                    this.$message({
                                        showClose: true,
                                        duration:2000,
                                        message: '打印模版未找到，或者出错',
                                        customClass:'design-from-el-message',
                                        type: 'warning'
                                    });
                                }else{
                                    this.$emit("emitEvent",{action:'printTempIdEmit',id:_printTemplateId});
                                    if(flag == 1){//签章
                                         EcoFile.openFileByUkeySeal(obj.filder_header_id,obj.model_id,uKeyBaseInfo);
                                    }else if(flag == 2){//批注
                                         EcoFile.openFileByUkeyDeal(obj.filder_header_id,obj.model_id,uKeyBaseInfo);
                                    }
                                   
                                }
                               
                            }
                            //EcoFile.openFileHeaderByView(obj.filder_header_id,obj.model_id);
                        }
                    }).catch((error) => {
                        this.$refs.ecoLoadingRef.close();
                    });
                }else{
                    this.$message({
                        showClose: true,
                        duration:2000,
                        message: '暂时无法打印，请配置打印模板',
                        customClass:'design-from-el-message',
                        type: 'warning'
                    });
                }
            }
        }).catch((error) => {
             this.$refs.ecoLoadingRef.close();
        });
     },

 

   

     closeDialog(){
         this.$router.replace({name:'flowTest',params:{
                formId:this.$route.params.formId,
                templateId:this.$route.params.templateId,
         }});
     },



  },
  watch: {
      formWf:function(v1,v2){
          this.wfName = v1.name;
      }
  }
}
</script>
<style scoped>

.flowTestToolbar .toolbar{
    color: #3a8ee6;
    font-size:14px;
}

.flowTestToolbar .flowTestToolCol{
    line-height: 50px;
    height:50px;
    vertical-align: middle;
}

.flowTestToolbar .testDesc{
    font-size:14px;
    color:rgb(103, 106, 108);
    line-height: 50px;
    height:50px;
    vertical-align: middle;
    text-align: center;
}

.flowTestToolbar .rightCol{
    text-align:right;
    padding-right:20px;
  
}

.flowTestToolbar .closeSpan{
    margin-left:20px;
    margin-right:10px;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    vertical-align:middle;
}

.flowTestToolbar .taskDesc{
    font-size:12px;
    color:rgb(103, 106, 108);
}
</style>
