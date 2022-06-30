<template>
  <div  class="extendPage">
      <iframe v-bind:src='ifrUrl' frameborder="0" class="ifr" ></iframe>
  </div>
</template>
<script>

import {EcoUtil} from '@/components/util/main.js'
import {mapMutations} from 'vuex'
import ecoContent from '@/components/pageAb/ecoContent.vue'


export default {
  name:'extendPage',
  components: {
   
  },
  data() {
    return {
        ifrUrl:''
    };
  },
  created() {
  },
  mounted() {
      this.ifrUrl = window.sysSetting&&window.sysSetting.extendPageUrl||'';
  },
  methods: {
  },

  destroyed() {}
};
</script>



<style scpoe>
.extendPage{
    position: absolute;
    top:0px;
    left:0px;
    right:0px;
    bottom:0px;
    overflow: auto;
}
.extendPage .ifr{
    width: 100%;
    height: 100%;
    position: absolute;
}
</style>
