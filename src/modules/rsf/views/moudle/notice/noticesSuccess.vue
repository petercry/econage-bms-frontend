
<template>
  <eco-content
    top="0px"
    bottom="0px"
  >
    <div
      style="margin:40px 0 0 30px"
      class="noticesSuccess"
    >
      <div style="overflow: hidden;">
        <button
          type="button"
          class="el-button el-button--success is-circle"
        ><i class="el-icon-check"></i></button>
        <span class="e-mail">发送成功</span>
      </div>
      <div class="check">
        <span
          @click="goList"
          style="margin:10px;"
        >
          <i class="el-icon-back"></i>
          返回公告列表
        </span>
      </div>
    </div>

  </eco-content>

</template>

<script>
import { Loading } from 'element-ui';
import ecoContent from '@/components/pageAb/ecoContent.vue'
import { EcoUtil } from '@/components/util/main.js'
import { sysEnv } from '@/modules/rsf/config/env.js'
export default {
  name: 'noticesSuccess',
  components: {
    ecoContent,
  },
  data() {
    return {
      id: 0,
    }
  },
  created() {
    this.id = this.$route.params.id;
  },
  mounted() {

  },

  computed: {

  },
  methods: {
    goList() {
      if (sysEnv === 1) {
        let tabObj = {};
        tabObj.desc = '通知公告'
        let goPage = "rsf/index.html#/noticeList";
        tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'noticeList',href_link:'" + goPage + "'}";
        tabObj.reload = true;
        tabObj.clearIframe = true;
        EcoUtil.getSysvm().doTab(tabObj);
        let that = this;
        setTimeout(function () {
          if (that.id == 0) {
            window.parent.window.sysvm.removeTab('noticesAdd');
          } else {
            window.parent.window.sysvm.removeTab('noticesEdit' + that.id);
          }
        }, 100)
      } else {
          this.$router.push({name:'noticeList'})
      }
    }
  }
}


</script>

<style scoped>
.is-circle {
  border-radius: 50%;
  padding: 12px;
  float: left;
  margin-top: 5px;
}

.e-mail {
  font-size: 30px;
  line-height: 50px;
  float: left;
  margin-left: 14px;
}
.check {
  margin-top: 20px;
  margin-left: 44px;
}
.check span {
  font-size: 16px;
  line-height: 24px;
  cursor: pointer;
}
.check span:hover {
  color: #666;
}
</style>
