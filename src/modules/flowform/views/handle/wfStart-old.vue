<template>
  <div class="webLayout">
      <div class="m-header">
            <span class="m-header-tip themeB"></span>
            <span class="m-title">启动流程</span>
            <el-input style="width: 200px;vertical-align: middle;margin-left:20px;" v-model="srchTxt" size="mini" @keyup.enter.native="search"></el-input>
            <div class="h-button themeB" style="background-color:#43a4e0;" @click="search"><i class="icon el-icon-search"></i>搜索</div>
      </div>


      <div style="padding:20px;">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="8" :md="8" v-for="(item,index) in itemList" :style="{clear:index%3==0?'left':'none'}" :key="'g'+item.groupId" >
                <div class="flow-card">
                <div class="title">{{item.groupName}}</div>
                <el-collapse v-model="openCollapseItems">

                    <el-collapse-item v-for="(fgroup, index) in item.child" v-if="fgroup.child" :style="{maxHeight:fgroup.child.length*26+32+'px'}" :key="'g'+item.groupId+index" :title="fgroup.name" :name="item.groupId+fgroup.subGroupId">
                          <div class="flow-item" v-for="fitem1 in fgroup.child" :key="fitem1.wfTempId">
                            <div class="flow-wrap ellipsis" @click="itemClick(fitem1)" :id="'f'+fitem1.wfTempId" :style="{backgroundColor:choosedItems.indexOf(fitem1.wfTempId)>-1?'#cce8d3':'inherit'}" :title="fitem1.name">{{fitem1.name}}</div>
                          </div>
                    </el-collapse-item>
                
                    <div class="flow-item" v-for="fitem2 in item.child" v-if="!fitem2.child" :key="fitem2.wfTempId">
                        <div class="flow-wrap ellipsis" @click="itemClick(fitem2)" :id="'f'+fitem2.wfTempId" :style="{backgroundColor:choosedItems.indexOf(fitem2.wfTempId)>-1?'#cce8d3':'inherit'}" :title="fitem2.name">{{fitem2.name}}</div>
                   </div>

              </el-collapse>
            </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>

import {getWFStartInfo,initWFAjax} from'../../service/service'
import {sysEnv} from '../../config/env.js'
import {EcoUtil} from '@/components/util/main.js'
import {Loading } from 'element-ui';
export default{
  name:'start',
  data(){
    return {
      isMultiWs:false,
      itemList:[],
      fitems:[],
      srchTxt:"",
      choosedItems:[],
      openCollapseItems:[]
    }
  },
  created(){

  },
  mounted(){
       
       
        this.getWFStartInfo();
  },
  computed:{
  },
  methods: {

  

    search(){
      if (this.srchTxt==''){
          this.$message({
              // message: this.$t('msg.srchTxtNotNull'),
              message:"搜索内容不为空",
              type: 'error'
          });
          return false;
      }
      let that = this;
      let choosedItems = this.fitems.filter(item=>{
          if (item.name.indexOf(that.srchTxt)>-1){
            that.openCollapseItems.indexOf(item.group+item.subGroup)>-1?null:
            that.openCollapseItems.push(item.group+item.subGroup);
            return true;
          }else{
            return false;
          }
      }).map(item=>item.wfTempId);
      this.choosedItems = choosedItems;
      this.$nextTick(()=>{
        if (choosedItems.length==0){
            this.$message({
                // message: this.$t('msg.srchResultNone'),
                message:"没有搜索到任何流程",
                type: 'error'
            });
        }else{
          let firstId = choosedItems[0];
          let firstElem = document.getElementById('f'+firstId);
          if (firstElem.offsetTop > window.innerHeight){
              window.scrollTo(0,firstElem.offsetTop - window.innerHeight/2)
          }
        }
      });
    },
    
    /*获取初始化数据*/
    getWFStartInfo(){
          getWFStartInfo().then((res)=>{
              if(res.data.status<100){
                    this.isMultiWs = res.data.remap.grid.isMultiWs;
                    this.itemList = res.data.remap.grid.info;
                    res.data.remap.grid.info.map(item=>{
                          return item.child.map(item=>{
                              if (item.child) {
                                  this.fitems = this.fitems.concat(item.child);
                              }else{
                                  this.fitems.push(item)
                              }
                          })
                    })
                    
              }
          }).catch((error)=>{});
    },

    itemClick(fitem){
          let loadingInstance = Loading.service({ fullscreen: true,text:"启动中...."});
          initWFAjax(fitem.wfTempId).then((response)=>{
                this.$nextTick(() => { 
                  loadingInstance.close();
                })

                if(response.data.status == 0){
                    if(sysEnv ==1){
                        let tabObj = {};
                        let goPage = 'flowform/index.html#/wfDetail/'+response.data.remap.task_id+'/'+response.data.operate_id;
                        tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wftask_info_"+response.data.operate_id+"',href_link:'"+goPage+"',fullScreen:true}";
                        window.parent.window.sysvm.doTab(tabObj);
                    }else{
                        this.$router.push({name:'wfDetail',params:{taskId:response.data.remap.task_id,operateId:response.data.operate_id}});
                    }
                }

          })
    }



   
  },
  watch: {

  }
}
</script>
<style scoped>
.flow-card{
  margin-bottom: 20px;
}
.flow-card>.title{
  position: relative;
  height: 34px;
  line-height: 34px;
  color: #fff;
  padding-left: 12px;
  font-size: 14px;
}
.flow-card>.title::before{
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 34px;
  width: 2px;
  background-color: #fff9;
}
@media screen and (min-width: 768px){
  .flow-card{
    min-height: 300px;
  }
}
</style>
