<template>
  <div class="designIndexVue">
        <layContent></layContent>
        <laySetting></laySetting>
  </div>
</template>
<script>


import layContent from './content/content.vue'
import laySetting from './setting/designSetting.vue'



export default{
  components:{
    layContent,
    laySetting
  },
  data(){
    return {
      data:[],
      
    }
  },
  created(){
    
  },
  methods: {


  }
}

</script>
<style scoped>
.designIndexVue{
  min-width: 1200px;
  overflow: auto;
  position:absolute;
  height:100%;
  left:0;
  right:0;
}
</style>
