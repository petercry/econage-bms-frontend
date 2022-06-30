<template>
    <div class="img-scroll">
      <div ref='imgList' class="img-scroll-list" :class="{move:ismove}" :style="{left:left+'px'}" >
        <img v-for="(item,index) in imgList" :key="index" :src="item"/>
      </div>
    </div>
</template>

<script>
export default {
  name:'ecoImgScroll',
  components:{

  },
  props: {
  },
  data () {
    return {
      left:0,
      ismove:false,
      imgList:[
        require("../../assets/img/scrollimg1.png"),
        require("../../assets/img/scrollimg2.png")
      ]
    }
  },
  mounted(){
    setTimeout(this.imgScroll(),5000);
  },
  methods:{
    imgScroll:function(){
      this.ismove=true;
      setTimeout(()=>{
        this.ismove=false;
      },4980)
      setTimeout(()=>{
          this.imgScroll()
      },5000)
    }
  },
  created(){

  },
  watch: {
    ismove(val){
      if (val){
        this.left=-300;
      }else{
        this.left=0;
        let item = this.imgList.shift();
        this.imgList.push(item);
      }
    }
  },

  destroyed(){

  }

}



</script>

<style scoped>

.img-scroll{
  position: relative;
  float: left;
  height: 50px;
  width: 300px;
  /* background-color: #333; */
  margin-left: 60px;
  overflow: hidden;
}
.img-scroll-list{
  position: absolute;
  width: 600px;
  height: 50px;
}
.img-scroll-list img{
  float: left;
}
.move{
  transition: left 4.98s linear;
}
</style>
