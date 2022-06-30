<template>
<div style="padding:20px 20px 0;" class="webContent webMainPageVue">
  
  <el-row :gutter="24">
      <el-col :span="12">
        <wfPortalTodo></wfPortalTodo>
      </el-col>

      <el-col :span="12">
        <wfPortalInit></wfPortalInit>
      </el-col>
  </el-row>


</div>
</template>

<script>
import {EcoUtil} from '@/components/util/main.js'
import wfPortalInit from '../page/module/wfPortal-init.vue'
import wfPortalTodo from '../page/module/wfPortal-todo.vue'
import {mapMutations} from 'vuex'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {} from '@/modules/bmsSystem/service/service.js'
export default {
  name:'mainPage',
  components: {
      wfPortalInit,
      wfPortalTodo,
  },
  data() {
    return {
      oaShow: false,
      oaUrl: "",
      language:'zh-CN'
    };
  },
  created() {
      let lang  = this.$cookies.get('language') || 'zh-CN';
      lang = EcoUtil.languageCookieToVue(lang);
      this.language = lang;
  },
  mounted() {},
  methods: {
 
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
.webMainPageVue .homeTitle{
  line-height: 54px;
  font-size: 16px;
}

.webMainPageVue .homeTitle.border{
  border-bottom: 2px solid #f6f7f8;
}

.webMainPageVue .homeTitle .more{
  font-size: 14px;
  color: #0084ff;
}

.webMainPageVue .themeCard{
  line-height: 30px;
  font-size: 16px;
  cursor: pointer;
}

.webMainPageVue .themeCard:hover{
  background-color: aliceblue;
}

.webMainPageVue .themeCard i{
  color: #0084ff;
  font-size: 52px;
  vertical-align: middle;
}

.webMainPageVue .serviceCard{
  position: relative;
}

.webMainPageVue .serviceIcon{
  position:absolute;
  left: 25px;
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

.webMainPageVue .serviceIcon i{
  font-size: 22px;
  color: #fff;
  vertical-align: middle;
}

.webMainPageVue .deptCard{
  line-height: 40px;
  font-size: 14px;
  cursor: pointer;
  background-color: #f6f7f8;
}

.webMainPageVue .deptCard i{
  color: #ccc;
  font-size: 16px;
  vertical-align: middle;
  margin-right: 6px;
}

</style>
