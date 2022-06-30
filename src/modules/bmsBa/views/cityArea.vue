<template>
  <div id="app">
    <el-cascader
      size="large"
      :options="options"
      v-model="selectedOptions"
      @change="setArea" 
      placeholder="请选择行政区划">
    </el-cascader>
  </div>
</template>
 
<script>
  import { regionDataPlus } from 'element-china-area-data'
  export default {
    data () {
      return {
        options: regionDataPlus,
        selectedOptions: []
      }
    },
 
    methods: {
      setArea (value) {
        console.log("area value : " + value)
      }
    }
  }
</script>