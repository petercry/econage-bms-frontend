<template>
  <span class="eco-tool-title">
      {{title}}
  </span>
</template>

<script>
export default {
  name:'eclToolTitle',
  props: {
      title:{
          type:String,
          default:''
      },
  },
  data() {
    return {
        ecoButtonClass:''
    };
  },
  mounted(){

  },
  created(){

  },
  computed:{

  },
  methods:{

  },

  destroyed(){

  }

};

</script>

<style scoped>
.eco-tool-title{
   font-size: 16px;
   padding-left:10px;
   border-left: 5px solid #409eff;
}

.custom-1ba5fa .eco-tool-title{
    border-left: 5px solid #409eff;
}

.custom-1ba5fa .eco-tool-title{
    border-left: 5px solid #409eff;
}

.custom-0acab8 .eco-tool-title{
    border-left: 5px solid #0acab8;
}

.custom-e76f6f .eco-tool-title{
    border-left: 5px solid #e76f6f;
}


</style>
