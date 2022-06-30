<template>
  <div style="padding:15px 20px 0;background-color:#f5f5f5">

      <el-row :gutter="12">

          <el-col :span="12">
              <wfPortalTodo></wfPortalTodo>
              <meetingModule :currentDay="currentDay"></meetingModule>
              <quickModule></quickModule>
          </el-col>

          <el-col :span="12">
              <workPlanModule @selectDay="selectDay"></workPlanModule>
          </el-col>
      </el-row>
  </div>
</template>

<script>
import {EcoUtil} from '@/components/util/main.js'

import wfPortalTodo from './module/wfPortal-todo.vue'
import wfPortalQuickStart from './module/wfPortal-quickStart.vue'
import workPlanModule from './module/workPlanModule.vue'
import meetingModule from './module/meetingModule.vue'
import quickModule from './module/quickModule.vue'


export default {
  name:'mainPage',
  components: {
      wfPortalTodo,
      wfPortalQuickStart,
      workPlanModule,
      meetingModule,
      quickModule
  },
  data() {
    return {
        oaShow: false,
        oaUrl: "",
        language:'zh-CN',
        currentDay: null
    };
  },
  created() {

       let lang  = this.$cookies.get('language') || 'zh-CN';
      lang = EcoUtil.languageCookieToVue(lang);
      this.language = lang;
  },
  mounted() {},
  methods: {
    selectDay(e) {
      this.currentDay = e
    },
    languageChange(val){
        let lang = val;
        lang = EcoUtil.languageVueToCookie(lang);
        document.logForm.cmd.value = "";
        document.logForm.doNothing.value = "Y";
        document.logForm.nextPage.value = '/jsp/version3/setLanguage.jsp';
        document.logForm.language.value = lang;
        document.logForm.submit();
    }
  },

  destroyed() {}
};
</script>



<style>

.portalHome {
  position: absolute;
  left: 0px;
  right: 0px;
  min-height: 100%;
  padding-top:60px;
  box-sizing: border-box;
  z-index: 1;
  /* padding:20px; */
  background-color: #fff;
}
.homeTitle{
  line-height: 54px;
  font-size: 16px;
}
.homeTitle.border{
  border-bottom: 2px solid #f6f7f8;
}
.homeTitle .more{
  font-size: 14px;
  color: #0084ff;
}
.themeCard{
  line-height: 30px;
  /* font-size: 14px; */
  font-size: 16px;
  cursor: pointer;
}
.themeCard:hover{
  background-color: aliceblue;
}
.themeCard i{
  color: #0084ff;
  /* font-size: 44px; */
  font-size: 52px;
  vertical-align: middle;
}
.serviceCard{
  position: relative;
}
.serviceIcon{
  position:absolute;
  left: 25px;
  /* height: 56px;
  width: 56px;
  line-height: 56px;
  border-radius: 28px; */
  height: 40px;
  width: 40px;
  line-height: 40px;
  border-radius: 20px;
  background-color: #FA8E1B;
  color: #fff;
  display: inline-block;
  vertical-align: middle;
  text-align: center;
  margin-right: 12px;
}
.serviceIcon i{
  font-size: 22px;
  color: #fff;
  vertical-align: middle;
}
.deptCard{
  line-height: 40px;
  font-size: 14px;
  cursor: pointer;
  background-color: #f6f7f8;
}
.deptCard i{
  color: #ccc;
  font-size: 16px;
  vertical-align: middle;
  margin-right: 6px;
}


</style>
