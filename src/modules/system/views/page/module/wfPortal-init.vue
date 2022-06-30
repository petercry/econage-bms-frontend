<template>
<el-card  :body-style="{ padding: '0 20px'}" style="" shadow='never'>
  <div style="position:relative;">
    <div class="homeTitle border">{{wfModeName}}查看
        <span class="more cpointer" @click="goMore()">({{params.total}})</span>
        <!-- <span class="more fr cpointer">更多>></span> -->
        <span class="fr">
          <el-radio-group v-model="activeName" @change="handleTabClick">
              <el-radio-button label="first">我发起的</el-radio-button>
              <el-radio-button label="second">我经办的</el-radio-button>
              <el-radio-button label="third">抄送我的</el-radio-button>
          </el-radio-group>
        </span>
    </div>
    <div style="padding:20px 0;height:350px;">
      <el-card v-for="item in dataList" :key="item.id" class="wfItem cpointer" :body-style="{ padding: '12px 20px 4px'}" shadow="hover"  @click.native="goDetail(item.id,item.wfId,item.defFieldId,item.requestDesc)">
        <div class="info">
            <div class="reqDesc ellipsis">{{item.requestDesc}}</div>
            <span class="status" v-bind:class="item.statusName == '已完成'?'green':item.statusName == '进行中'?'blue':item.statusName == '已取消'?'cancel':'red'"> {{item.statusName}}</span>


        </div>
        <div class="footer">
            <el-row>
                <el-col :span="12" >
                  <div v-if="activeName!='third'"  class="note">发起人员：{{item.initUserName}}</div>
                  <div v-if="activeName=='third'"  class="note">抄送人员：{{item.fromUserName}}</div>
                </el-col>
                <el-col :span="12" style="text-align:right;">
                    <!-- <span class="link">查看详情 ></span> -->
                  <div v-if="activeName!='third'" class="note">{{item.startDate}} 发起</div>
                  <div v-if="activeName=='third'" class="note">{{item.createDate}} 送达</div>
                </el-col>
            </el-row>
        </div>
      </el-card>

      <div v-if="dataList.length==0" class="noContent">暂无流程数据</div>
    </div>
  </div>
</el-card>
</template>

<script>

import {getWfSelfInitAjax,getWFMyAllProcessAjax,getWFCCListAjax,getWFViewOperateId} from "../../../service/service.js";
import { mapActions } from "vuex";
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {mapState,mapMutations} from 'vuex'
export default {
  components: {},

  data() {
    return {
        activeName:'first',
        dataList:[],
        params:{
            folder:'-1',                      //-1 全部 0 进行中 1 已完成/被拒绝 2 已取消
            page:1,
            rows:4,
            total:0,
            groupId: '-1',
            groupTemp:'-1',
            templdateId: '-1',
            searchMsg: '',
            sort:'',
            order:'',
        }
    };
  },

  computed: {
      ...mapState([
             'taskStatus'
        ]),
        wfModeName(){
            if(window.sysSetting && window.sysSetting.wfModeName){
                return window.sysSetting.wfModeName;
            }else{
                return '事项';
            }
        }
  },
  created() {

  },
  mounted() {
      this.getWfSelfInitFunc();
  },
  methods: {

      //获取我发起的流程列表
       getWfSelfInitFunc(){
            getWfSelfInitAjax(Object.assign(this.params,{sort: 'start_date',order: 'desc'})).then((response)=>{
                  this.dataList = response.data.list;
                  this.params.total = response.data.count;
            }).catch((error)=>{

            });
       },

      //获取我经办的流程列表
      getWfMyAffProcessFunc(){
          //  this.$refs.ecoLoadingRef.open();
           getWFMyAllProcessAjax(Object.assign(this.params,{sort: 'op_date',order: 'desc'})).then((response)=>{
              this.dataList = response.data.list;
              this.params.total = response.data.count;
           }).catch((error)=>{
              //  this.$refs.ecoLoadingRef.close();
           });
       },

      //获取抄送我的流程列表
       getWFCCListFunc(){
          //  this.$refs.ecoLoadingRef.open();
           getWFCCListAjax(Object.assign(this.params,{sortCol: 'create_date',sortDir: 'desc'})).then((response)=>{
              this.dataList = response.data.list;
              this.params.total = response.data.count;
           }).catch((error)=>{
              //  this.$refs.ecoLoadingRef.close();
           });

       },
       handleTabClick(tab){
            this.dataList = [];
            this.params.total = 0;
          if(tab === "first"){
              this.getWfSelfInitFunc();
          }else if(tab === "second"){
              this.getWfMyAffProcessFunc();
          }else if(tab === "third"){
              this.getWFCCListFunc();
          }
       },

       goMore(){
          let nextMenu = {};
          let pageObj = {
            desc:'事项查看',
            r_func:"{menuTarget:'IFRAME',tabKey:'flowform-wfToView',href_link:'flowform/index.html#/wfToView'}"
          }
          nextMenu.desc = pageObj.desc;
          nextMenu.r_func = pageObj.r_func;
          window.sysvm.doTab(nextMenu);
          this.$router.push({name:'workPlatform'})
       },

       goDetail(id,wfId,defFieldId,requestDesc){
            let formView = 1;
            let _wfId = null;
            let _ccId = null;
            if(this.activeName == 'first'){
                formView = 1;
                _wfId = id;
            }else if(this.activeName == 'second'){
                formView = 1;
                _wfId = id;
            }else if(this.activeName == 'third'){
                formView = 3;
                _ccId = id;
            }

            getWFViewOperateId(_wfId,formView,_ccId,defFieldId).then((response)=>{
                    if(response.data.status == 0){
                        let operateId = response.data.operate_id;
                            let tabObj = {};
                            let goPage = "flowform/index.html#/wfViewDetail/"+id+"/"+operateId;
                            tabObj.desc = requestDesc;
                            tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wfViewDetail"+id+"',href_link:'"+goPage+"',fullScreen:true}";
                            window.parent.window.sysvm.doTab(tabObj);
                    }else{
                         EcoMessageBox.alert(response.data.msg);
                    }
            })

        },

        refresh(){
          this.dataList = [];
          this.params.total = 0;
          if(this.activeName == 'first'){
              this.getWfSelfInitFunc();
          }else if(this.activeName == 'second'){
              this.getWfMyAffProcessFunc();
          }else if(this.activeName == 'third'){
              this.getWFCCListFunc();
          }
      }

  },
     watch:{
        taskStatus(value,oldValue){
            this.refresh();
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
.wfItem .status.green{
    background-color:#08CC15;
}
.wfItem .status.blue{
   background-color:#409EFF
}
.wfItem .status.cancel{
   background-color:#909399
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
