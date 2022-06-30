<template>
      <div>
        <div :value="activeValue" :border="false" v-for="(item1, index1) in inputArr" :key="'l3'+index1">
            <div  :border="false" :title="item1.assigneeName" name="1" :is-link="false">
                <div slot="title">
                    <div v-if="item1.roundAppr">
                        <div v-for="(item2, index2) in item1.roundAppr" :key="index2">
                            
                            <div v-if="approvalDescType == 1 "  :style="{color:getColor(item1.status,item2.orderId,item1.roundAppr.length)}" class="approvalDesc">
                                <span>
                                    {{item2.userName}} 
                                      <i class="icon iconfont iconshanchudelete30" v-if="item2.apprCode && (item2.apprCode == 0)" style="color:#ff0000;font-size:14px;"></i>
                                      <i class="icon iconfont iconqueding" v-if="item2.apprCode == 1" style="color:#339933;font-size:14px;"></i> 
                                      <i  v-if="item2.apprCode == 2" style="color:#e6a23c;font-size:14px;">意见征询中</i> 
                                      <i  v-if="item2.apprCode == 3" style="color:#e6a23c;font-size:14px;">已转交办理</i>  
                                </span> 
                                <span class="handleTime" >
                                    {{item2.apprTime.length > 16? item2.apprTime.substring(0,16):item2.apprTime}}
                                </span>
                            </div>

                            <div class="approvalDesc" v-html="(item2.apprDesc?item2.apprDesc.replace(/(\r\n)|(\n)/g,'<br>'):item2.apprDesc )"></div>
                            
                            <div v-if="approvalDescType == 2" :style="{color:getColor(item1.status,item2.orderId,item1.roundAppr.length)}" class="approvalDesc">
                                <div class="handleName">
                                    {{item2.userName}} 
                                      <i class="icon iconfont iconshanchudelete30" v-if="item2.apprCode && (item2.apprCode == 0)" style="color:#ff0000;font-size:14px;"></i>
                                      <i class="icon iconfont iconqueding" v-if="item2.apprCode == 1" style="color:#339933;font-size:14px;"></i> 
                                      <i  v-if="item2.apprCode == 2" style="color:#e6a23c;font-size:14px;">意见征询中</i> 
                                      <i  v-if="item2.apprCode == 3" style="color:#e6a23c;font-size:14px;">已转交办理</i>  
                                </div>
                                <div class="handleTimeDiv" >
                                    {{item2.apprTime.length > 16? item2.apprTime.substring(0,16):item2.apprTime}}
                                </div>
                            </div>

                            <descHandWritten :imgList="wfHandSigns[item2.handSignGroup]"></descHandWritten>
                            <descAttachment :fileLists="item2.attachments" ></descAttachment>
                        </div>

                        <div v-if="item1.status == 1 || item1.status == 3">
                             <div :style="{color:getColor(item1.status)}" class="approvalDesc">{{item1.assigneeName}}  {{item1.status==1?'待办':'办理中'}}
                              <span></span>
                            </div>
                            <div class="approvalDesc"></div>
                        </div>


                    </div>

                    <div v-else>
                      <div :style="{color:getColor(item1.status)}" class="approvalDesc">
                          <i v-if="!hiddenPendingApproval(item1.status)">{{item1.assigneeName}}</i>
                          <span>{{getStatusName(item1.status)}}</span>
                      </div>
                      <div v-for="(item2, index2) in item1.roundAppr" :key="index2" v-html="(item2.apprDesc?item2.apprDesc.replace(/(\r\n)|(\n)/g,'<br>'):item2.apprDesc )"></div>
                    </div>
                </div>

                <slot v-bind:child="item1.roundChild"></slot>
          
            </div>
        </div>
   </div>
</template>
<script>

import {mapState,mapMutations} from 'vuex'
import descHandWritten from './descHandWritten.vue'
import descAttachment from './descAttachment.vue'

export default{
  components:{
      descHandWritten,
      descAttachment
  },
  props:{
    inputArr:{
        type:Array
    },
  },
  data(){
        return {
            activeValue:['1'],
        }
  },
  created(){
       
  },
  mounted(){
  
  },
  computed:{
       ...mapState([
            'wfHandSigns',
      ]),

      approvalDescType(){
          if(( window.flowformSetting && window.flowformSetting.approvalDescType && window.flowformSetting.approvalDescType == 2)){
              return 2;
          }else{
              return 1;
          }
      }
  },
  methods: {
        getColor(status,orderId,length){
           if(orderId){
                  return '#339933';
           }else {
                switch (status) {
                case 1:return '#bdbd00';break;//待办
                case 3:return '#bdbd00';break;//办理中
                case 6:return '#339933';break;//已完成
                case 11:return '#cc6600';break;//已取消
                default:return '#676a6c';break;
            }
          }
        },
        reverseArray(arr){//反转数组
            if (arr){
                let out = []
                arr.map(item=>{
                    out.unshift(item)
                    return item;
                })
                return out;
            }
            return arr;
        },
        getStatusName(status){
            switch (status) {
                case 1:return '待办';break;
                case 3:return '办理中';break;
                case 6:return '已完成';break;
                case 11:return '已取消';break;
                default:return '';break;
            }
        },

        hiddenPendingApproval(status){
          if((status == -1 &&   window.flowformSetting && window.flowformSetting.hiddenPendingApproval && window.flowformSetting.hiddenPendingApproval == true)){
              return true;
          }else{
              return false;
          }
        },

     
       
  },
  watch: {

  }
}
</script>
<style scoped>
.approvalDesc{
  line-height: 25px;
  
}

.handleApprovalDescVue .oneApprovalDesc2 .approvalDesc{
  line-height:25px;
  margin-left:10px;
}

.approvalDesc .handleName{
  text-align: right;
}



.approvalDesc .handleTime{
  float:right;
  margin-right:10px;
}

.approvalDesc .handleTime::after{
  clear:both;
}

.approvalDesc .handleTimeDiv{
   text-align: right;
   margin-right:10px;
}



</style>
