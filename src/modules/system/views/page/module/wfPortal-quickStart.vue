<template>
  <div class="wfPortal-quickStart">
    <el-card class="e9-card" :body-style="{ padding: '0 20px'}" shadow='never'>
        <div class="header clearfix">
            <span class="title" @click="activeType=''">快捷启动</span>
            <ul class="quicklist">
                <li v-for="item in itemList" :key="item.id" @click="startWf(item)">
                    <i class="el-icon-edit colorB"></i>
                    <span>{{item.templateName}}</span>
                </li>
            </ul>
        </div>
    </el-card>
  </div>
</template>

<script>

  import {getWorkflowInitCount,initWFAjax} from '../../../service/service.js'
  import {sysEnv} from '@/modules/bmsMmm/config/env'
  import {Loading } from 'element-ui';

  export default {
    components:{

    },
    name:'wfPortal-quickStart',
    data(){
      return {
          itemList:[],
      }
    },

    created(){
        this.getStatisticWfTemplate();
    },
    mounted() {

    },
    methods: {
        getStatisticWfTemplate(){
            getWorkflowInitCount(5).then((res)=>{
                  this.itemList = res.data;
            }).catch((error)=>{});
        },

        startWf(item){
            let loadingInstance = Loading.service({ fullscreen: true,text:"启动中...."});
            initWFAjax(item.templateId).then((response)=>{
                    this.$nextTick(() => {
                        loadingInstance.close();
                    })
                    if(response.data.status == 0){
                        if(sysEnv ==1){
                            let tabObj = {};
                            let goPage = 'flowform/index.html#/wfDetail/'+response.data.remap.task_id+'/'+response.data.operate_id;
                            tabObj.desc = item.templateName;
                            tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wftask_info_"+response.data.operate_id+"',href_link:'"+goPage+"',fullScreen:true}";
                            window.parent.window.sysvm.doTab(tabObj);
                        }else{
                            this.$router.push({name:'wfDetail',params:{taskId:response.data.remap.task_id,operateId:response.data.operate_id}});
                        }
                    }
              })
        }
    },
    destroyed() {

    },
    watch:{
    }
  }
</script>

<style scoped>
.wfPortal-quickStart .e9-card .header .title{
    font-size: 14px !important;
}

.wfPortal-quickStart .quicklist{
  margin-left: 20px;
  display: inline;
  font-size: 14px;
}

.wfPortal-quickStart .quicklist li{
    display: inline;
    margin-right: 24px;
}

.wfPortal-quickStart .quicklist li i{
    margin-right: 2px;
}

.wfPortal-quickStart .quicklist li span{
    color:#262626;
}
</style>
