<template>
  <div class="iBanner clearfix">
    <div class="blueCircle">
      <div class="container">
        <!-- <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1570530885085&di=7d6765a43526048177263c3b3d95c6d5&imgtype=0&src=http%3A%2F%2Fpic1.16xx8.com%2Fallimg%2F161122%2F1F0035M6-7.jpg"/> -->
        <img src="@/modules/portalIndex/assets/img/banner.png"/>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
      name:'iBanner',
      computed: {
      },
      data() {
        return {
        }
      },
      created(){
      },
      mounted(){
      },
      methods: {
       
      },
      watch:{
      
      }
  }
</script>
<style>
.iBanner{
  width: 100%;
  height: 200px;
  min-width: 1180px;
  overflow: hidden;
}
.blueCircle{
  width: 100%;
  height: 120px;
  margin: 0 -10px;
  padding: 0 10px;
  background-color: #2F87F3;
  border-radius: 0 0 50% 50%;
}
.blueCircle img{
  width: 100%;
  height: 200px;
  border-radius: 10px;
}
</style>
