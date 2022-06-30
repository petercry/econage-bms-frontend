<template>
      <div  class="home">
        123
      </div>
</template>

<script>
import {EcoUtil} from '@/components/util/main.js'

export default {
  components: {
      
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

  
  },

  destroyed() {}
};
</script>



<style scoped>
.home {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow-y: auto;
  background-color: #f5f5f5;
  padding: 12px 12px 0;
}
.home:after {
  content: "";
  display: block;
  clear: both;
}

</style>
