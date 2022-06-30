<template>
  <div class="eco-loading-div" v-show="show">
      <div id="facebook">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </div>

      <span class="load">{{getContent}}</span>
  </div>
</template>

<script>
export default {
  name:'ecoLoading',
  props: {
      text:{
          type:String,
          default:''
      }
  },
  data() {
    return {
        show:false,
        content:'',
    };
  },
  mounted(){

  },
  created(){

  },
  computed:{
      getContent(){
          if(this.content && this.content !=''){
              return this.content;
          }else {
              return this.text;
          }
      }
  },
  methods:{
      open(content){
          if(content){
              this.content = content;
          }
          this.show = true;
      },
      close(){
          this.content = '';
          this.show = false;
      }
  },

  destroyed(){

  }

};

</script>

<style scoped>


.eco-loading-div{
    position: fixed;
    top: 18px;
    left: 50%;
    margin-left: -59px;
    background-color: #b1b1b1;
    z-index: 999;
    border-radius: 2px;
    padding: 6px 10px;

}
.load{
    line-height: 18px;
    padding: 0 10px;
}

.eco-loading-div span{
    color:#fff;

}

#facebook {
  width: 18px;
  height: 18px;
  margin: 0 auto;
  float: left;
  padding: 0 4px;

}
#facebook .bar {
  background: #99aaca;
  border: 1px solid #96a6c9;
  float: left;
  margin: 6px 4px 0 0;
  width: 1px;
  height: 14px;
  -webkit-animation: facebook-pulse 1s linear infinite normal;
  -moz-animation: facebook-pulse 1s linear infinite normal;
  -ms-animation: facebook-pulse 1s linear infinite normal;
  animation: facebook-pulse 1s linear infinite normal;
  -webkit-animation-delay: 0;
  -moz-animation-delay: 0;
  -o-animation-delay: 0;
  animation-delay: 0;
}
#facebook .bar:nth-child(2) {
  -webkit-animation-delay: 0.1s;
  -moz-animation-delay: 0.1s;
  -o-animation-delay: 0.1s;
  animation-delay: 0.1s;
}
#facebook .bar:last-child {
  -webkit-animation-delay: 0.2s;
  -moz-animation-delay: 0.2s;
  -o-animation-delay: 0.2s;
  animation-delay: 0.2s;
  margin-right: 0;
}

@keyframes facebook-pulse {
  10% {
    margin-top: 5px;
    height: 8px;
    border-color: #fff;
    background-color: #fff;
  }
  20% {
    margin-top: 0px;
    height: 18px;
    border-color: #fff;
    background-color: #fff;
  }
  30% {
    margin-top: 1px;
    height: 16px;
    border-color: #fff;
    background-color: #fff;
  }
  40% {
    margin-top: 3px;
    height: 12px;
  }
  50% {
    margin-top: 5px;
    height: 8px;
  }
  60% {
    margin-top: 6px;
    height: 4px;
  }
}

</style>
