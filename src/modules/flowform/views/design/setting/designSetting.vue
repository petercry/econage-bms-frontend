<template>
    <div class="designSetting">
        <router-view></router-view>
    </div>
</template>
<script>


export default{
  name:'designSetting',
  components:{


  },
  data(){
    return {
      data:[]
    }
  },
  created(){

  },
  methods: {

  }
}

</script>
<style scoped>

.designSetting{
    position: absolute;
    right:0px;
    width:260px;
    top:65px;
    bottom:0px;
    background-color: #fff;
    overflow-y: auto;
}

</style>
