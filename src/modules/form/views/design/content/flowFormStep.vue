<template>
  <div class="flowFormStep">
          <el-row>
                <el-col :span="6" class="leftCol">
                    <span>{{title}}&nbsp;</span>
                </el-col>
                <el-col :span="12" style="text-align:-webkit-center;">
                    <div class="ecoStep">
                         <el-steps :active="step" simple size="mini" >
                                <el-step title="表单设计"  @click.native="goFlowFrom">
                                    <i slot="icon" class="icon iconfont iconnumber1 iconstep pointerCalss"></i>
                                </el-step>
                         </el-steps>
                    </div>
                </el-col>

                <el-col :span="6" class="rightCol" >
                      <div>
                          <slot name="rightDiv"></slot>
                          <span style="margin-left:20px;margin-right:10px;" class="pointerCalss">
                              <i style="font-size:20px;" class="icon iconfont iconshanchudelete30" @click="closeDialog"></i>
                          </span>
                      </div>
                </el-col>
          </el-row>
 </div>
</template>
<script>

import {mapState,mapMutations} from 'vuex'
import {EcoUtil} from '@/components/util/main.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'



export default{
   components:{
  
  },
  name:'flowFormStep',
  props:{  
      title:{
          type:String
      },
      step:{
          type:Number,
          default:0
      },
      checkSave:{
        type: Function,
        default: null
      },
      
      
  },
  data(){
    return {
    
    }
  },
  created(){
     
  },
  mounted(){
     
   
  },
  computed:{
   
  },
  methods: {
        
        emitFlowFrom(){
            this.$emit('clickStep',{nextStep:'flowForm'});
        },

        goFlowFrom(){
                if(this.checkSave) this.checkSave();
                 this.$router.push({name:'formDesign',params:{
                    formId:this.$route.params.formId,
                    templateId:this.$route.params.templateId,
                }});
        },

        emitDirection(){
                this.$emit('clickStep',{nextStep:'direction'});
        },

        goDirection(){
                if(this.checkSave) this.checkSave();
                this.$router.push({name:'flowDirection',params:{
                    formId:this.$route.params.formId,
                    templateId:this.$route.params.templateId,
                }});
        },

        emitFlowSetting(){
             this.$emit('clickStep',{nextStep:'flowSetting'});
        },

        goFlowSetting(){
            if(this.checkSave) this.checkSave();
            this.$router.push({name:'flowSetting',params:{
                formId:this.$route.params.formId,
                templateId:this.$route.params.templateId,
            }});
            
               
        },

        emitFlowTest(){
             this.$emit('clickStep',{nextStep:'flowTest'});
        },

        goFlowTest(){
            if(this.checkSave) this.checkSave();
            this.$router.push({name:'flowTest',params:{
                formId:this.$route.params.formId,
                templateId:this.$route.params.templateId,
            }});
            
        },

        emitFlowPublish(){
          
             this.$emit('clickStep',{nextStep:'flowPublish'});
        },


        goFlowPublish(){
            if(this.checkSave) this.checkSave();
            this.$router.push({name:'wfTemplatePublish',params:{
                formId:this.$route.params.formId,
                templateId:this.$route.params.templateId,
            }});
            
        },

        closeDialog(){
            this.$emit('close',{});
        },

        goNextStep(nextStep){
            if(nextStep == "flowForm"){
                this.goFlowFrom();
            }else if(nextStep == "direction"){
                this.goDirection();
            }else if(nextStep == "flowSetting"){
                this.goFlowSetting();
            }else if(nextStep == "flowTest"){
                this.goFlowTest();
            }else if(nextStep == "flowPublish"){
                this.goFlowPublish();
            }
        }
  },
  watch: {
     
  }
}
</script>
<style scoped>



.flowFormStep .leftCol{
    line-height: 55px;
    padding-left:20px;
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #262626;
}

.flowFormStep .ecoStep{
    max-width:650px;
    text-align: center;
    margin-top:5px;
}

.flowFormStep .rightCol{
    text-align:right;
    line-height:55px;
    padding-right:20px;
}
</style>
