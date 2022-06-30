<template>
  <div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="6" :md="6">
        <el-card :body-style="{ padding: '0px'}" shadow='never'>
          <div class="eco-card num-card"  @click="goWFMore()">
            <div class="title">
              <span>待办流程</span>
            </div>
            <div class="detail colorB">{{countInfo.activeTask}}</div>
          </div>
        </el-card>
      </el-col>
       <el-col :xs="24" :sm="6" :md="6">
        <el-card :body-style="{ padding: '0px'}" shadow='never'>
          <div class="eco-card num-card"  @click="goPage('/wh/jsp/version3/rsf/index.html@/documanageList&','公文','documanageListTab')">
            <div class="title">
              <span>公文管理</span>
            </div>
            <div class="detail colorB">{{countInfo.rsf_6}}</div>
          </div>
        </el-card>
      </el-col>
       <el-col :xs="24" :sm="6" :md="6">
        <el-card :body-style="{ padding: '0px'}" shadow='never'>
          <div class="eco-card num-card"  @click="goPage('/wh/jsp/version3/rsf/index.html@/noticeslist&','通知公告','noticelistTab')">
            <div class="title">
              <span>通知公告</span>
            </div>
            <div class="detail colorB">{{countInfo.rsf_5}}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6" :md="6">
        <el-card :body-style="{ padding: '0px'}" shadow='never'>
          <div class="eco-card num-card"  @click="goPage('/wh/jsp/version3/rsf/index.html&','内部邮件','innerMials')">
            <div class="title">
            <span>内部邮件</span>
            </div>
            <div class="detail colorB">{{countInfo.rsf_3}}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getSysUnreadCountAjax } from "@/modules/system/service/service.js";
import { mapActions } from "vuex";
export default {
  components: {},

  data() {
    return {
      countInfo: {
        activeTask: 0,
        rsf_3: 0,
        rsf_4: 0,
        rsf_5: 0,
        rsf_6: 0
      }
    };
  },

  computed: {},
  created() {
    this.getCount();
  },
  mounted() {
    
  },
  methods: {
    ...mapActions(["goPage"]),
    //待办流程
    goWFMore() {
      let tabObj = {};
      tabObj.desc = "待办流程";
      tabObj.tabKey = "orderRequestTaskTab";
      tabObj.r_func =
        "{menuTarget:'IFRAME',tabKey:'orderRequestTaskTab',doNothing:'N',cmd:'orderRequestTask',folder:0,ae_ar_flag:'E'}";
      window.sysvm.doTab(tabObj);
    },
    getCount() {
      getSysUnreadCountAjax()
        .then(response => {
          // console.log(response.data);
          this.countInfo = response.data.countInfo;
        })
        .catch(error => {});
    }
  }
};
</script>

<style scoped>
.el-col {
  margin-bottom: 0px;
}
.num-card{
    /* height: 70px; */
    text-align: center;
}
.num-card .title{
    height: 32px;
    line-height: 32px;
    font-size:16px;
}
.num-card .title i{
    margin-right: 10px;
}
.num-card .detail{
    height: 48px;
    line-height: 48px;
    font-size: 32px;
}
</style>
