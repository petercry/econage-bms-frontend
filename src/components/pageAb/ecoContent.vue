<template>
  <div class="page-content" v-bind:style="styleObject" :id="contentId">
      <slot></slot>
  </div>
</template>

<script>
export default {
  name:'ecoContent',
  props: {
      bottom:{
          type:String,
          default:''
      },
      top:{
          type:String,
          default:''
      },
      height:{
          type:String,
          default:''
      },
      type:{
          type:String,
          default:''
      }

  },
  data() {
    return {
        styleObject:{},
        contentId:new Date().getTime()+Math.random(0,100000),
    };
  },
  mounted(){

  },
  created(){
      this.initStyle();
  },
  computed:{

  },
  methods:{
      initStyle(){
          if(this.bottom && this.bottom!=""){
              this.styleObject.bottom= this.bottom;
          }
          if(this.top && this.top!=""){
              this.styleObject.top = this.top;
          }
          if(this.height && this.height!=""){
              this.styleObject.height = this.height;
          }

          if(this.type && this.type!=""){
              this.styleObject.backgroundColor = "#f8f9fb";
          }
      },
      getScollTop(){
          return document.getElementById(this.contentId).scrollTop;
      },
      setScollTop(scrollTop){
          var that = this;
          setTimeout(function(){
                document.getElementById(that.contentId).scrollTop = scrollTop;
          },500)
      }
  },


  watch: {
     'top' (to, from) {
          this.initStyle();
     },
     'height' (to, from) {
          this.initStyle();
     },
     'bottom'(to,from){
         this.initStyle();
     }
  },

  destroyed(){

  },

};

</script>

<style scoped>
  .page-content{
    position:absolute;
    left: 0;
    right: 0;
    background-color: #fff;
    overflow: auto;
  }
</style>
