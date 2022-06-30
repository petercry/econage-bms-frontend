<template>
  <div class="chart5 ">
     <div class="chartTitle">信用等级变化动态情况</div>

      <table class="chartTable"  cellspacing="0">
        <tbody>
          <tr v-for="(item,idx) in dataArray" :key="idx">
              <td class="tdName" v-bind:class="['type'+item.type]"><i class="el-icon-arrow-right"></i>{{item.name}}</td>
          </tr>
        </tbody>
      </table>
  </div>
</template>
<script>


  import {mapState,mapMutations} from 'vuex'
  export default {
    components:{
    
    },
    name:'chart5',
    data(){
      return {
          height:220,
          dataArray:[]
      }
    },
    computed:{
       ...mapState(['sysWidth'])
    },
    created(){
        this.dataArray = window.dataObj2.char5Array;
       
    },
    mounted() {
     
    },
    methods: {

    },
    destroyed() {

    },
    watch:{
        'sysWidth'(val){
            
        }
    }
  }
</script>
<style scoped>    

.chart5{
  color:#fff;
  height:100%;
}

.chart5 .chartTitle{
    text-align:center;
    color:#fff;
    line-height: 30px;
    height:30px;
    padding:10px 0px 0px 0px;
    font-size: 18px;
    font-weight: bold;
}

.chart5 .title{
  text-align: center;
  margin-top:20px;
}

.chart5 .chartTable{
  width:100%;
  margin-top:10px;
  border: 0px;
}

.chart5 .chartTable th{
    background-color:rgba(35,43,86,0.5);
}

.chart5 .chartTable th,.chart5 .chartTable td{
    text-align: center;
    padding:5px;
    border: 0px solid #303d84;
    font-size: 12px;
    padding-left:20px;
}

.chart5 .chartTable .tdData{
  color:#98a0ce;
  font-weight: bold;
}

.chart5 .chartTable .tdName{
  color:#e6e2e2;
  width:100%;
  text-align: left;
}

.chart5 .chartTable .type1{
  color:#d4c229;
}

.chart5 .chartTable .type2{
  color:#7cb737;
}
</style>
  