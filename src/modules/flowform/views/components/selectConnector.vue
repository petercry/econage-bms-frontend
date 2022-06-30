<template>
    <div class="selectSignature">
        <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
        <eco-content top="0px" height="61px" type="tool">
            <el-row style="padding:12px 10px;background-color:#fff;border-bottom:1px solid #ddd;">
            <el-col :span="8" >
                <eco-tool-title style="line-height: 34px;" :title="'执行器列表'+'（'+baseInfo.total+'）'"></eco-tool-title>
            </el-col>
            <el-col :span="16" style="text-align:right;">
                <el-input
                         placeholder="搜索执行器名称"
                         v-model="baseInfo.ref_name"
                         style="width:200px;margin-right:10px"
                         @keyup.enter.native="searchFunc"
                        >
                        <i slot="suffix" @click="searchFunc" style="cursor:pointer;" class="el-input__icon el-icon-search"></i>
                </el-input>
                <el-button type="primary" @click="addConnector"><i class="icon iconfont iconxinjianwenjian"></i> 新建执行器</el-button>
            </el-col>
        </el-row>
        </eco-content>
         <eco-content bottom="42px" top="62px" ref="content" class="ecoContentClass"  style="padding:15px;">
            <el-table
                v-loading="loading"
                size="medium"
                class="list"
                :data="listData"
                row-key="refId"
                :current-row-key="selectConnectorId"
                :highlight-current-row="true"
                style="width: 100%;">
                <el-table-column
                    prop="itCatName"
                    label="类别"
                    width="120"
                    >
                     <template slot-scope="scope" >{{scope.row.itCatName === 'INNER'?'内部模块':scope.row.itCatName}}</template>
                </el-table-column>
                <el-table-column
                    prop="refName"
                    label="名称"
                    show-overflow-tooltip
                    >
                </el-table-column>
                <el-table-column
                    label="创建人"
                    width="120"
                    prop="createUserName"
                    >

                </el-table-column>

                <el-table-column
                        label="创建时间"
                        width="150"
                        prop="createDate"
                    >
                        <template slot-scope="scope" ><span>{{scope.row.createDate?scope.row.createDate.substr(0,16):''}}</span></template>
                </el-table-column>

                <el-table-column
                    label="操作"
                    prop="id"
                    width="140"
                >
                <template slot-scope="scope" >
                    <el-button type="text" size="medium" @click="edit(scope.row)">编辑</el-button>
                    <el-button type="text" size="medium" @click="choose(scope.row)">应用</el-button>
                    <el-button type="text" size="medium" @click="deleteItem(scope.row,scope.$index)">删除</el-button>
                </template>
                </el-table-column>
            </el-table>
         </eco-content>
    </div>
</template>
<script>

import {Loading } from 'element-ui';
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {rows,sysEnv} from '../../config/env.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {EcoUtil} from '@/components/util/main.js'
import {getConnectorList,deleteConnectorInfo} from '../../service/service.js'

export default{
  data(){
    return {
        listData:[],
        loading:true,
        baseInfo:{
          cat_name:"",
          operate_id:"",
          if_name:"",
          ref_name:"",
          total:0,
          it_agent:""
        },
        flag:0,
        selectConnectorId:""

    }
  },
  components: {
   ecoLoading,
  ecoToolTitle,
  ecoContent
  },
  created(){
      this.baseInfo.operate_id = this.$route.params.operateId;
      if(this.$route.params.catName != 0){
            this.baseInfo.cat_name = decodeURI(this.$route.params.catName);
      }
      if(this.$route.params.agentId != 0){
            this.baseInfo.it_agent = this.$route.params.agentId;
      }
      this.flag = this.$route.params.flag;
      if(this.flag.indexOf('1_')>-1){//从alphabot切换来的
            this.selectConnectorId= this.flag.substr(this.flag.indexOf('1_')+2)
      }
  },
  beforeDestroy() {

  },
  mounted(){
      this.searchFunc();
      this.listAction();
  },
  computed:{

  },
  methods: {
      listAction(){
        let this_ = this;
        let callBackDialogFunc = function(obj){
            console.log('selectConnector 监控回写');
            if(obj && obj.action == 'saveConnectorInfo' ){
                this_.$message({
                    message: '保存成功',
                    showClose: true,
                    duration:2000,
                    customClass:'design-from-el-message',
                    type: 'success'
                });
                this_.searchFunc();
            }else if(obj && obj.action == 'sceneSetting'){
                this_.callBackSceneSettingSave();

            }else if(obj && obj.action == 'viewApiSetting'){
                this_.callBackSceneSettingSave();

            }else if(obj && obj.action == 'cancelApiSetting'){
                this_.callBackSceneSettingSave();

            }else if(obj && obj.action == 'apiOutPutPage'){
                 let doObj = {}
                doObj.action = 'selectConnector';
                doObj.data = obj.data;
                doObj.flag = this_.flag;
                doObj.close = true;
                EcoUtil.getSysvm().callBackDialogFunc(doObj);
                this_.callBackSceneSettingSave();
            }

        }
        EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'selectConnector');
    },
      searchFunc(){
          this.$refs.ecoLoadingRef.open();
          getConnectorList(this.baseInfo).then((response)=>{
              this.$refs.ecoLoadingRef.close();
              this.loading = false;
              if(response.data.status < 100){
                  this.baseInfo.total = response.data.remap.reflist.total;
                  this.listData = response.data.remap.reflist.list;
              }
          })
      },
      addConnector(){
          if(sysEnv == 1){
            let _url = '/flowform/index.html#/connectorAddAndUpdate/'+this.baseInfo.operate_id+'/0/'+this.$route.params.catName+'/'+this.$route.params.agentId;
            let _height = parent.window.document.getElementById("aside").offsetHeight-180;
            EcoUtil.getSysvm().openDialog('添加执行器',_url,'950',_height,'50px');
          }else{
              this.$router.push({name:'connectorAddAndUpdate',params:{operateId:this.baseInfo.operate_id,refId:0,catName:this.$route.params.catName,agentId:this.$route.params.agentId}})
          }
      },
      edit(row){
          if(sysEnv == 1){
            let _url = '/flowform/index.html#/connectorAddAndUpdate/'+this.baseInfo.operate_id+'/'+row.refId+'/'+this.$route.params.catName+'/'+this.$route.params.agentId;
            let _height = parent.window.document.getElementById("aside").offsetHeight-180;
            EcoUtil.getSysvm().openDialog('编辑执行器',_url,'950',_height,'50px');
          }else{
              this.$router.push({name:'connectorAddAndUpdate',params:{operateId:this.baseInfo.operate_id,refId:row.refId,catName:this.$route.params.catName,agentId:this.$route.params.agentId}})
          }
      },
      choose(item){
          console.log(item.refId)
          // 0是流程表单选择的，1是afbot选择的
          if(this.flag == 1 || this.flag.indexOf("1_")>-1){
                let doObj = {}
                doObj.action = 'selectConnector';
                doObj.data = item;
                doObj.close = true;
                EcoUtil.getSysvm().callBackDialogFunc(doObj);
                return;
          }else if(this.flag == 0 || this.flag == 6 || this.flag == 'cancelApi'){

          }else if(this.flag == 3 || this.flag == 4 || this.flag == 5){
                let _url = '/flowform/index.html#/apiOutPutPage/'+item.refId;
                let _height = parent.window.document.getElementById("aside").offsetHeight-180;
                EcoUtil.getSysvm().openDialog('选择输出项',_url,'950',_height,'50px');
                return;
          }else{
               let _url = '/flowform/index.html#/apiOutPutPage/'+item.refId;
                let _height = parent.window.document.getElementById("aside").offsetHeight-180;
                EcoUtil.getSysvm().openDialog('选择输出项',_url,'950',_height,'50px');
                return;
          }
        //   //api关联应用场景
        //   if(this.flag == 3 || this.flag == 4 || this.flag == 5){
        //         let _url = '/wh/jsp/version3/flowform/index.html#/apiOutPutPage/'+item.refId;
        //         let _height = parent.window.document.getElementById("aside").offsetHeight-180;
        //         EcoUtil.getSysvm().openDialog('选择输出项',_url,'950',_height,'50px');
        //         return;
        //   }
          if(sysEnv == 1){
            let _url = "";
            if(this.flag == 0){
                 _url = '/flowform/index.html#/sceneSetting/'+this.baseInfo.operate_id+'/'+item.refId+'/0';
            }else if(this.flag == 6){
                 _url = '/flowform/index.html#/viewApiSetting/'+this.baseInfo.operate_id+'/'+item.refId+'/0';
            }else if(this.flag == 'cancelApi'){
                 _url = '/flowform/index.html#/cancelApiSetting/'+this.baseInfo.operate_id+'/'+item.refId+'/0';
            }
            console.log(this.flag)
            let _height = parent.window.document.getElementById("aside").offsetHeight-180;
            EcoUtil.getSysvm().openDialog('添加场景',_url,'950',_height,'50px');
          }else{
              if(this.flag == 0){
                    this.$router.push({name:'sceneSetting',params:{operateId:this.baseInfo.operate_id,refId:item.refId,scId:0}});
              }else if(this.flag == 6){
                    this.$router.push({name:'viewApiSetting',params:{operateId:this.baseInfo.operate_id,refId:item.refId,scId:0}});
              }else if(this.flag == 'cancelApi'){
                    this.$router.push({name:'cancelApiSetting',params:{operateId:this.baseInfo.operate_id,refId:item.refId,scId:0}});
              }
          }
      },

      callBackSceneSettingSave(){

          setTimeout(function(){
              console.log('关闭窗口');
               EcoUtil.getSysvm().closeDialog();
          },200)

      },
      deleteItem(item,index){
        let that  = this;
        let confirmYesFunc = function(){
            deleteConnectorInfo(item.refId).then((response)=>{
              if(response.data.status <100){
                that.$message({
                    message: '删除成功',
                    showClose: true,
                    duration:2000,
                    customClass:'design-from-el-message',
                    type: 'success'
                });
                that.listData.splice(index,1);
              }
          })
        }


        let options = {
            type: 'warning',
            lockScroll:false
        }
        EcoMessageBox.confirm('确认删除该连接器吗？','提示',options,confirmYesFunc);

      }
  },
  watch: {

  }
}
</script>
<style>
.selectSignature{
   height: 100%;
    overflow: auto;
    background: #fff;
  }



</style>
