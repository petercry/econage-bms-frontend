<template>
    <div class="wfPortal">
          <el-row :gutter="20">
              <el-col :span="19" >
                    <wfPortalTodo></wfPortalTodo>
                    <wfPortalInit style="margin-top:20px;"></wfPortalInit>
              </el-col>
              <el-col :span="5">
                123
              </el-col>
          </el-row>
    </div>
</template>

<script>

import {EcoUtil} from '@/components/util/main.js'

import wfPortalTodo from "./module/wfPortal-todo.vue"
import wfPortalInit from "./module/wfPortal-init.vue"


export default {
  components: {
        wfPortalTodo,
        wfPortalInit
  },
  data() {
    return {
      
    };
  },
  created() {

      
  },
  mounted() {
      
  },
  methods: {
       
  },

  destroyed() {}
};
</script>



<style scoped>
.wfPortal {
  margin-top:60px;
  z-index: 200;
  padding:20px;
  background-color: rgb(232,232,235);
 
}

</style>
