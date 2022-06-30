<template>
<el-card  :body-style="{ padding: '0 20px'}" style="" shadow='never'>
  <div style="position:relative;">
    <div class="homeTitle border">会议安排
        <span class="more cpointer" @click="goMore()">({{toDoParams.total}})</span>
        <!-- <span class="more fr cpointer" @click="goMore()">更多>></span> -->
    </div>

    <div style="padding:20px 0;height:200px;">
      <el-card v-for="item in toDoList" :key="item.id" class="wfItem cpointer" :body-style="{ padding: '12px 20px 4px'}" shadow="hover" @click.native="goDetail(item.id)">
          <div class="info">
              <div class="reqDesc ellipsis" :class="item.status == '待办' ? redtext : ''" v-if="item.conferenceEntity">{{item.conferenceEntity.name}}</div>
              <!-- <span class="status" v-bind:class="item.statusName == '待办'?'red':'blue'"> {{item.statusName}}</span> -->
          </div>

          <!-- <div class="footer">
              <el-row>
                  <el-col :span="12" >
                    <div class="note">启动人员：{{item.initUserName}}</div>
                  </el-col>
                  <el-col :span="12" style="text-align:right;">
                      <span class="link">查看详情 ></span>
                    <div class="note">{{item.assignDate}} 到达</div>
                  </el-col>
              </el-row>
          </div> -->

      </el-card>
      <div v-if="toDoParams.total==0"  class="noContent">暂无流程数据</div>
    </div>
  </div>
</el-card>
</template>

<script>

import {getMeetingOrderAjax,modMeetingStauts,getEnumSelectEnabled,getTaskWFModuleAjax,getWFOperateId} from "../../../service/service.js";
import {mapActions } from "vuex";
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {mapState,mapMutations} from 'vuex'
import {sysEnv} from '@/modules/bmsMmm/config/env'
import {EcoUtil} from '@/components/util/main.js'
  import {EcoKVUtil} from '@/components/util/kv.js'
export default {
  props: {
    currentDay: {
      type: String,
      default: ''
    }
  },
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
        },
        kvMap: {
            '112211221122111': []
            // 'MEETING_LINK_STATUS': []
        },
        redtext: 'redtext'
    };
  },

  computed: {

  },
  created() {
   EcoKVUtil.getEnumSelectEnabledFunc(this.kvMap);
  //  this.getMeetingOrderAjax()
  },
  mounted() {

  },
  methods: {
    getMeetingOrderAjax(data) {
      getMeetingOrderAjax(data).then(res => {
        this.toDoList = res.data.rows.map(x => {
          return {
            ...x,
            status: this.kvMap[112211221122111].find(m => m.id == x.status) ? this.kvMap[112211221122111].find(m => m.id == x.status).text : ' '
          }
        })
        this.toDoParams.total= res.data.total
      })
    },
    goDetail(id) {
      // modMeetingStauts(id).then(res => {
      //   if(sysEnv == 1){
      //       let url = '/meeting/index.html#/meetingView/'+id;
      //       EcoUtil.getSysvm().openDialog('会议详情',url,900,550,'8vh');
      //   }else{
      //       let url =  window.location.origin + '/#/meetingView/'+id;
      //       EcoUtil.getSysvm().openDialog('会议详情',url,900,550,'8vh');
      //       // this.$router.push({name:'meetingView',params:{id:id}});
      //   }
      // })
      // this.getMeetingOrderAjax(this.currentDay)
      modMeetingStauts(id).then(res => {
        let tabObj = {};
        let goPage = "meeting/index.html#/meetingViewHomePage/"+id;
        tabObj.desc = '会议详情';
        tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wfViewDetail"+id+"',href_link:'"+goPage+"'}";
        window.parent.window.sysvm.doTab(tabObj);
      })

    }
  },
  watch:{
       currentDay(val) {
          this.getMeetingOrderAjax(val)
       }
  }
};
</script>

<style scoped>
.redtext {
  color: red !important;
}
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
