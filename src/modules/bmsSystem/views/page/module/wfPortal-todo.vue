<template>
<el-card  :body-style="{ padding: '0 20px'}" style="">
  <div style="position:relative;">
    <div class="homeTitle border">我的待办
        <span class="more cpointer" @click="goMore()">({{toDoParams.total}})</span>
        <!-- <span class="more fr cpointer" @click="goMore()">更多>></span> -->
    </div>
    <div style="padding:20px 0;height:350px;">
      <el-card v-for="item in toDoList" :key="item.id" class="wfItem cpointer" :body-style="{ padding: '12px 20px 4px'}" shadow="hover" @click.native="goDetail(item.id,item.defFieldId)">
        <div class="info">
            <div class="reqDesc ellipsis">{{item.requestDesc}}</div>
            <span class="status" v-bind:class="item.statusName == '待办'?'red':'blue'"> {{item.statusName}}</span>
        </div>
        <div class="footer">
            <el-row>
                <el-col :span="12" >
                  <div class="note">启动人员：{{item.initUserName}}</div>
                </el-col>
                <el-col :span="12" style="text-align:right;">
                    <!-- <span class="link">查看详情 ></span> -->
                  <div class="note">{{item.assignDate}} 到达</div>
                </el-col>
            </el-row>
        </div>
      </el-card>
      <div v-if="toDoParams.total==0"  class="noContent">暂无流程数据</div>
    </div>
  </div>
</el-card>
</template>

<script>

import {getTaskWFModuleAjax,getWFOperateId} from "../../../service/service.js";
import { mapActions } from "vuex";
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {mapState,mapMutations} from 'vuex'
export default {
  components: {},

  data() {
    return {
        toDoList:[],
        toDoParams:{
            folder:'0',                      //-1 全部 0 进行中 1 已完成/被拒绝 2 已取消
            page:1,
            rows:4,
            total:0,
            sort:'assign_date',
            order:'desc',
            groupTemp:'-1',
            groupId: '-1',
            subGroupId:'-1',
            templdateId: '-1',
        }
    };
  },

  computed: {
        ...mapState([
             'taskStatus'
        ])
  },
  created() {
   
  },
  mounted() {
      this.getWFToDoListFunc();
  },
  methods: {
       getWFToDoListFunc(){
            getTaskWFModuleAjax(this.toDoParams).then((response)=>{
                  this.toDoList = response.data.list;
                  this.toDoParams.total = response.data.count;
            }).catch((error)=>{
               
            });
       },

       goMore(){
        let nextMenu = {};
        let pageObj = {
          desc:'我的待办',
          r_func:"{menuTarget:'IFRAME',tabKey:'flowform-wfToDo',href_link:'flowform/index.html#/wfToDo'}"
        }
        nextMenu.desc = pageObj.desc;
        nextMenu.r_func = pageObj.r_func;
        window.sysvm.doTab(nextMenu);
        this.$router.push({name:'workPlatform'})
       },

        goDetail(wfId,defFieldId){
            getWFOperateId(wfId,defFieldId).then((response)=>{
                    if(response.data.status == 0){
                        let operateId = response.data.operate_id;
                        // AlphaManual
                        if(response.data.remap && response.data.remap.pc_url){         
                                let tabObj = {};
                                let goPage = response.data.remap.pc_url;
                                let reg = new RegExp("{{taskId}}", "g");
                                goPage=goPage.replace(reg,response.data.remap.task_id);
                                tabObj.desc = response.data.remap.agent_name;
                                tabObj.tabKey = "documanageAdd";
                                tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'documanageAdd"+response.data.remap.task_id+"',doNothing:'N',cmd:'v3.goPage',goPage:'"+goPage+"'}";
                                window.parent.window.sysvm.doTab(tabObj);
                        }else{
                            // if(sysEnv == 1){
                                let tabObj = {};
                                let goPage = "flowform/index.html#/wfDetail/"+wfId+"/"+operateId;
                                tabObj.desc = '待办流程';
                                tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wfDetail"+wfId+"',href_link:'"+goPage+"',fullScreen:true}";
                                window.parent.window.sysvm.doTab(tabObj);
                            // }else{
                            //     this.$router.push({name:'wfDetail',params:{taskId:wfId,operateId:operateId}})
                            // }
                        }
                      
                    }else{
                         EcoMessageBox.alert(response.data.msg);
                    }
            })
        },
    
  },

   watch:{
        taskStatus(value,oldValue){
            this.getWFToDoListFunc();
        }
    }
};
</script>

<style scoped>
.wfItem{
  background-color: rgb(247,247,248);
}
.wfItem .info{
  position: relative;
    padding-right:120px;
}


.wfItem .reqDesc{
   font-size: 14px;
   color:#6c6c6c;
   margin-bottom:8px;
   font-weight: bold;
}

.wfItem .note{
  font-size: 14px;
  line-height:18px;
  height: 18px;
  color:#0e152c7a
}

.wfItem .status{
  position: absolute;
  display: inline-block;
  width: 64px;
  right: 0;
  top: 0;
  font-size: 14px;
  padding: 2px;
  color: #fff;
  text-align: center;
}

.wfItem .status.red{
    background-color:#F56C6C;
}

.wfItem .status.blue{
   background-color:#409EFF
}

.wfItem .footer{
  line-height: 32px;
  height: 32px;
  /* border-top:1px solid #e8e7ec; */
  margin-top:12px;
}
.noContent{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  height: 30px;
  line-height: 30px;
}
</style>
