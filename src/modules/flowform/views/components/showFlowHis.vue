<template>
    <div class="flowHis" id="flowHis">
        <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
        <div class="hisContainer">
            <div class="hisItem" v-for="(item,index) in hisItems" :key="index">
                <div v-if="index==0">
                    <div class="title">
                        <span class="desc">{{item.stage}}</span>
                        <span class="result" v-text="'启动流程'"></span>
                    </div>
                    <div class="content">
                        <p class="username">{{item.asnName}}</p>
                        <div class="box">
                            <span class="left date" v-if="item.operateTime">启动时间：{{item.operateTime?item.operateTime.substr(0,16):''}}</span>
                            <span class="right date" v-if="item.endTime">提交时间：{{item.endTime?item.endTime.substr(0,16):''}}</span>
                        </div>
                    </div>
                </div>
                
                <div v-else-if="item.taskType == 10 || item.taskType == 13">
                    <div class="title">
                        <span class="desc">{{item.stage}}</span>
                        <span class="result" v-text="'结束流程'"></span>
                    </div>
                    <div class="content">
                        <div class="box">
                            <span class="left date" v-if="item.endTime">结束时间：{{item.endTime?item.endTime.substr(0,16):''}}</span>
                            <span class="right date" v-if="item.timeRange">总办理时长：{{item.timeRange?item.timeRange:''}}</span>
                        </div>
                    </div>
                </div>
                <div v-else-if="item.taskType == 5">
                    <div class="title">
                        <span class="desc">{{item.stage}}</span>
                      
                    </div>
                    <div class="content">
                        <p class="username">{{item.asnName}}</p>
                        <div class="box">
                            <span class="left date" v-if="item.endTime">抄送时间：{{item.endTime?item.endTime.substr(0,16):''}}</span>
                        </div>
                         <div v-if="item.endTime && item.msg">{{item.msg}}</div>
                    </div>
                </div>
                <div v-else-if="item.taskType == -1">
                    <div class="title">
                        <span class="desc">系统运维</span>
                         <span class="result" v-text="item.stage"></span>
                    </div>
                    <div class="content">
                        <p class="username">{{item.asnName}}</p>
                        <div class="box">
                            <span class="left date" v-if="item.endTime">操作时间：{{item.endTime?item.endTime.substr(0,16):''}}</span>
                        </div>
                         <div v-if="item.endTime && item.msg">操作内容：{{item.msg}}</div>
                    </div>
                </div>
                <div v-else>
                    <div class="title">
                        <span class="desc">{{item.stage}}</span>
                        <span class="result" v-text="item.taskStatusDesc" v-bind:class="item.taskStatus == 1 || item.taskStatus == 3 ? 'orange':''"></span>
                    </div>
                    <div class="content">
                        <p class="username">{{item.asnName}}</p>
                        <div class="box">
                            <span class="left date" v-if="item.startTime">到达时间：{{item.startTime?item.startTime.substr(0,16):''}}</span>
                            <span class="right date" v-if="item.operateTime">打开时间：{{item.operateTime?item.operateTime.substr(0,16):''}}</span>
                            <span class="left date" v-if="item.endTime">提交时间：{{item.endTime?item.endTime.substr(0,16):''}}</span>
                            <span class="right date" v-if="item.timeRange">办理时长：{{item.timeRange?item.timeRange:''}}</span>
                        </div>
                        
                        <div v-if="item.taskType == 2 && item.apprDesc ">办理意见：{{item.apprDesc}}</div>
                       
                    </div>
                    <div class="appr" v-if="(item.apprCode != null && item.apprCode > -1) || (item.endTime && item.msg && item.taskType == 2 ) ">
                      <span class="agree" v-if="item.apprCode == 1"><i class="icon iconfont iconqueding"></i> {{item.apprCodeDesc}}</span>
                       <span class="disagree" v-if="item.apprCode == 0"><i class="icon iconfont iconclose"></i> {{item.apprCodeDesc}}</span>
                        <p class="msg" v-if="item.endTime && item.msg">{{item.msg}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {getWFHisDataAjax} from '../../service/service.js'
import {Loading } from 'element-ui';
import ecoLoading from '@/components/loading/ecoLoading.vue'
export default{
  data(){
    return {
      hisItems:[]
    }
  },
  components: {
   ecoLoading
  
  },
  created(){
      this.getWFHisDataAjaxFunc();
  },
  beforeDestroy() {
     
  },
  mounted(){
    
  },
  computed:{

  },
  methods: {
       getWFHisDataAjaxFunc(){
          getWFHisDataAjax(this.$route.params.operateId).then((response) => {
           if(response.data.status<100){
                this.hisItems = response.data.remap.history;
                 this.$nextTick(function(){
                    var div = document.getElementById('flowHis');
                    document.documentElement.scrollTop = div.scrollHeight;//滚动到底部
                 })
           }
        }).catch((error) => {
             
        }); 
       }
  },
  watch: {
     
  }
}
</script>
<style scoped>
   .flowHis{
    width:100%;
    min-height: 100%;
    height:auto;
    position: absolute;
    background: #fff;
  }
  .hisContainer{
    padding: 20px 12px 10px;
  }
  .hisItem{
    border: 1px solid #e8e8e8;
    border-radius: 2px;
    margin-bottom: 16px;
  }
  .hisItem .title{
    border-bottom: 1px solid #e8e8e8;
    background-color: #f5f5f5;
    height: 32px;
    padding: 0 16px;
    line-height: 32px;
  }
  .hisItem .title span{
    font-size: 14px;
    color: #262626;
  }
  .hisItem .title .desc{
      float: left;
  }
  .hisItem .title .result{
      float: right;
      color: #8b8b8b;
  }
  .hisItem .content{
      height: auto;
      min-height: 32px;
      padding: 16px;
  }
  .hisItem .content p{
      min-height: 32px;
      line-height: 32px;
  }
  .hisItem .content .box{
      overflow:hidden;
      line-height: 26px;
  }
  .hisItem .content .left{
      width: 320px;
      float: left;
  }
  .hisItem .content .right{
      width: 200px;
      float: left;
  }
  .hisItem .content .date{
      color: #8b8b8b;
  }
  .hisItem .appr{
      border-top: 2px dashed #ddd;
      min-height: 32px;
  }
  .hisItem .appr span{ 
      margin-left:16px;
  }
  .hisItem .appr .agree{
      color: #67C23A;
  }
   .hisItem .appr .disagree{
      color: #F56C6C;
  }
  .hisItem .appr .icon{
      font-size: 25px;
      position: relative;
      top: 3px;
  }
  .hisItem .title .result.orange{
    color:#e6a23c;
  }
  .hisItem .appr .msg{
    margin: 10px 16px;
  }
</style>
