<template>
  <div class="wfDetailToolbar">
      <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
        <el-row>
                <el-col :span="10">
                    <div style="margin-left:10px;">
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

                <el-col :span="14" class="rightCol">


                    <eco-button type="tool" :leftSplit="false"  @click.native="goAllAttachPage" v-if="true || isShowWFAllAttBtn">
                        <i class="icon iconfont iconfujian toolbar" ></i>
                        <span  class="toolbar">&nbsp;预览附件</span>
                    </eco-button>

                    <eco-button type="tool" :leftSplit="false"  @click.native="showFlowChart" v-if="showBtnGroup['flowChart']">
                        <i class="icon iconfont iconliuchengtu toolbar" ></i>
                        <span  class="toolbar">&nbsp;流程图</span>
                    </eco-button>

                    <eco-button type="tool" :leftSplit="false" @click.native="showFlowHis" v-if="showBtnGroup['history'] && isShowWFHis">
                        <i class="icon iconfont iconliebiao toolbar" ></i>
                        <span  class="toolbar">&nbsp;历史记录</span>
                    </eco-button>

                    <eco-button type="tool" :leftSplit="false" @click.native="cancelWF"  v-if=" (formTask && formTask.level == 1 && (formTask.status == 3 || formTask.status == 1) && formWf.allowInitCancel == 'Y' )">
                        <i class="icon iconfont iconquxiao toolbar" ></i>
                        <span class="toolbar">&nbsp;取消流程</span>
                    </eco-button>

                    <eco-button type="tool" :leftSplit="false" @click.native="getPrintSetList(0)" v-if="isShowPrint && showBtnGroup['printWf']">
                        <i class="icon iconfont icondayin1 toolbar" ></i>
                        <span class="toolbar">&nbsp;打印</span>
                    </eco-button>

                    <eco-button type="tool" :leftSplit="false" v-if="false">
                        <i class="icon iconfont iconshangchuanfujian toolbar"></i>
                         <span class="toolbar">&nbsp;上传附件</span>
                    </eco-button>

                    <eco-button type="tool" :leftSplit="false" v-if="false">
                        <i class="icon iconfont iconexceldaoru toolbar"></i>
                         <span class="toolbar">&nbsp;Excel导入</span>
                    </eco-button>

                    <eco-button type="tool" :leftSplit="false" @click.native="goWFToDoCC" v-if="isShowWFCC">
                        <i class="icon iconfont iconchaosong toolbar"></i>
                        <span class="toolbar">&nbsp;抄送流程</span>
                    </eco-button>

                    <!-- <eco-button type="tool" @click.native="closeDialog">
                        <i class="icon iconfont iconfanhuiliebiao icontoolbar" ></i>&nbsp;返回工作列表
                    </eco-button> -->

                    <span  class="closeSpan pointerCalss" @click="closeDialog" v-if="hasCloseBtn">
                        <i style="font-size:21px;" class="icon iconfont iconshanchudelete30"></i><span style="font-size:14px;vertical-align:text-top">关闭</span>
                    </span>
            </el-col>
        </el-row>

          
 </div>
</template>
<script>

import {mapState,mapMutations} from 'vuex'
import {getSelectedPrintSetList,getPrintFormData,changeWfStatus} from'../../service/service'
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
  name:'wfDetailToolbar',
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
  },
  data(){
    return {
        wfName:null,
        showIpt:false,
        showBtnGroup:{
            flowChart:false,
            history:false,
            printWf:false,
        }
    }
  },
  created(){
     
  },
  mounted(){
      
      
       
  },
  computed:{
        isShowWFAllAttBtn:function(){
            if(window.flowformSetting && window.flowformSetting.wfAllAttBtn){
                return true;
            }else{
                return false;
            }
        },

        isShowPrint:function(){
            if(this.formPageRender && this.formPageRender.BUTTON_PRINT && this.formPageRender.BUTTON_PRINT.SET_VISIBALE == "0"){
                return false;
            }else if(window.flowformSetting && window.flowformSetting.hide_printBtn){
                return false;
            }else{
                return true;
            }
        },

        isShowWFCC:function(){
            if(window.flowformSetting && window.flowformSetting.hide_wfCCBtn){
                return false;
            }else{
                return true;
            }
        },

        isShowWFHis:function(){
            if(window.flowformSetting && window.flowformSetting.hide_wfHisBtn){
                return false;
            }else{
                return true;
            }
        },

        hasCloseBtn:function(){
            let _noCloseBtn = this.$route.query.noCloseBtn;
            let _isSingleSys = false;
            try{
                if(EcoUtil.getSysvm().isSingleSystem){
                    _isSingleSys = EcoUtil.getSysvm().isSingleSystem();
                }
            }catch(e){}
            
            if(_noCloseBtn || _isSingleSys){
                return false;
            }else{
                return true;
            }
        }
  },
  methods: {
    
      getWFName(){
         return this.wfName;
      },

      initFormTaskChange(){
            try{ 
                if(this.formTask.extParam && this.formTask.extParam!=null){
                   let  _showBtnGroupArray = (JSON.parse(this.formTask.extParam)).showBtnGroup;
                   (_showBtnGroupArray).forEach((item)=>{
                       this.showBtnGroup[item] = true;
                   })
                }
            }catch(e){console.log(e);}
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
               EcoUtil.getSysvm().showFlowChart(this.formWf.wfId);
          }
      },

      showFlowHis(){
            if(this.formWf && this.formWf.wfId!=0){
                EcoUtil.getSysvm().showFlowHis(this.$route.params.operateId);
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
                    let url = '/flowform/index.html#/printSetList/'+this.formWf.wfId+'/'+flag;
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

    goWFToDoCC(){
         let _width = '550';
         let _height = '400';
         let url = '/flowform/index.html#/wfToDoCC/'+this.$route.params.operateId;
         EcoUtil.getSysvm().openDialog('流程抄送',url,_width,_height,'15vh');
    },

    cancelWF(){
          let that  = this;
          let confirmYesFunc = function(){
                that.cancelWFYes();
          }
          let options = {
                        type: 'warning',
                        lockScroll:false
          }
          EcoMessageBox.confirm('确认取消该流程？','提示',options,confirmYesFunc);
    },

    cancelWFYes(){
            let _data = {};
            _data.wf_id = this.formWf.wfId;
            _data.target_status_flag = 'to_canceled';
            EcoUtil.getSysvm().showLoadingDiv('正在删除中...');
            changeWfStatus(_data).then((response)=>{
                EcoUtil.getSysvm().hideLoadingDiv(); 
                if(response.data.status <=99){
                    this.$message({
                            showClose: true,
                            duration:2000,
                            message: '流程取消成功!',
                            customClass:'design-from-el-message',
                            type: 'success'
                    });
                    this.closeDialog();
                }
            }).catch((e)=>{
                EcoUtil.getSysvm().hideLoadingDiv(); 
            })
    },

     closeDialog(){
         let _closeObj = {};
         _closeObj.clearIframe = true;
         _closeObj.tabClick = true;
         EcoUtil.getSysvm().closeFullScreen(_closeObj);
     },

     goAllAttachPage(){
            try{
                let _url = '/page/ssoAdapter.html?request-source=wfAllAttView&targetUrl='+this.$route.params.operateId;
                if(EcoFile.getAgentType() == "browser"){
                    window.open(_url);
                }else{
                    if(window.parent && window.parent.dd){
                        let dd_url = (_url.indexOf('/')==0?location.origin:'')+_url+'&ddtab=true&ecoToken='+sessionStorage.getItem('ecoToken');//要打开链接的地址
                        if (window.parent.dd.env.platform == "notInDingTalk") {
                            try{
                                window.parent.openLink(dd_url).then(res => {}).catch(err => {
                                    window.open(_url)
                                })
                            }catch(e){
                                window.open(_url)
                            }
                        }else{
                                window.parent.dd.biz.util.openLink({
                                    url:dd_url,
                                    onSuccess : function(result) { },
                                    onFail : function(err) {}
                                })
                        }
                    }else{
                        window.open(_url);
                    }
                }

            }catch(e){
                console.log(e);
            }
     },

     /*生成pdf*/
     changeFormToPdf(){
          this.$emit("emitEvent",{action:'changeFormToPdf'});
     }
  },
  watch: {
      formWf:function(v1,v2){
          this.wfName = v1.name;
      },

      formTask:function(v1,v2){
          this.initFormTaskChange(v1);
      },

  }
}
</script>
<style scoped>
.wfDetailToolbar{
    
}




.wfDetailToolbar .toolbar{
    color: #3a8ee6;
    font-size:14px;
}

.wfDetailToolbar .rightCol{
    text-align:right;
    padding-right:20px;
    line-height: 30px;
    padding-top:5px;
}

.wfDetailToolbar .closeSpan{
    margin-left:20px;
    margin-right:10px;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    vertical-align:middle;
    color:#f56c6c;
}

.wfDetailToolbar .taskDesc{
    padding-top:10px;
    font-size:12px;
    color:rgb(103, 106, 108);
}
</style>
