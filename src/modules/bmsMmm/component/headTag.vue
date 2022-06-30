<template>
    <div class="tagDiv">
        <div class="title">{{title}}</div>
        <div >
        <span class="num">{{num}}</span>
        <span class="desc">{{desc}}</span>
        </div>
    </div>
</template>
<script>

import {mapMutations} from 'vuex'
export default{
  name:'headTag',
  components:{

  
  },
  data(){
    return {

    }
  },
  props:['title','num','desc'],
  mounted(){
  
  },
  methods: {
   
  },
  watch: {

  }
}
</script>
<style>

</style>
