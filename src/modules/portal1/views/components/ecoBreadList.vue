<template>
  <div class="breadwrap">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(item, index) in breadList" :key="index" :to="item.to" @click.native="breadClick($event,item,index)">{{item.label}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import {mapMutations,mapState} from 'vuex'
export default {
  name:'ecoBreadList',
  props: {

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
    ...mapState(['breadList'])
  },
  methods:{
    ...mapMutations(['SET_BREAD']),
    breadClick($event,item,index){
      let elem = $event.target||$event.srcElement;
      if (elem.className.indexOf('is-link')>-1){
        let breadList = this.breadList.slice(0,index+1);
        this.SET_BREAD(breadList);
      }
    }
  },
  destroyed(){

  }

};

</script>

<style scoped>
.breadwrap{
  padding: 6px 0 2px;
}
</style>
