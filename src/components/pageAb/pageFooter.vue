<template>
  <div class="page-footer" v-bind:style="{'height':height}">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name:'pageFooter',
  props: {
      height:{
          type:String,
          default:'20px'
      }
  },
  data() {
    return {

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
  .page-footer{
    position: absolute;
    left: 0;
    right: 0;
    bottom:0;
    height:20px;
    background-color: #fff;
    overflow: hidden;
  }
</style>
