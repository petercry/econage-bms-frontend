<template>
  <div class="page-content" v-bind:style="{'bottom':bottom,'top':top}">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name:'pageContent',
  props: {
      bottom:{
          type:String,
          default:'0'
      },
      top:{
          type:String,
          default:'0'
      },
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
  .page-content{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    background-color: #fff;
    overflow: auto;
  }
</style>
