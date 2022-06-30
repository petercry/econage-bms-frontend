<template>
  <div class="chart1 chartDiv">

      <div class="chartTitle">登记动态</div>
      <table class="chartTable" border="1" cellspacing="0">
        <thead>
            <tr>
              <th style="width:19%">&nbsp;</th>
              <th style="width:27%">今日</th>
              <th style="width:27%">本月</th>
              <th style="width:27%">本年</th>
            </tr>
        </thead>
        <tbody>
          <tr v-for="(item,idx) in dataArray" :key="idx">
              <td class="tdName">{{item.name}}</td>
              <td class="tdData">{{item.d1}}</td>
              <td class="tdData">{{item.d2}}</td>
              <td class="tdData">{{item.d3}}</td>
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
    name:'chart1',
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
        this.dataArray.push({name:'注册',d1:15,d2:215,d3:1671});
        this.dataArray.push({name:'变更',d1:26,d2:387,d3:2921});
        this.dataArray.push({name:'备案',d1:2,d2:29,d3:69});
        this.dataArray.push({name:'注销',d1:4,d2:2,d3:12});
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

.chart1{
  color:#fff;
  height:100%;
}

.chart1 .chartTitle{
    text-align:center;
    color:#fff;
    line-height: 30px;
    height:30px;
    padding:10px 0px 0px 0px;
    font-size: 18px;
    font-weight: bold;
}

.chart1 .chartTable{
  width:100%;
  margin-top:10px;
  border: 1px;
  
}

.chart1 .chartTable th{
    background-color:rgba(35,43,86,0.5);
}

.chart1 .chartTable th,.chart1 .chartTable td{
    text-align: center;
    padding:5px;
    border: 1px solid #303d84;
    font-size: 12px;
}

.chart1 .chartTable .tdData{
  color:#98a0ce;
  font-weight: bold;
}

.chart1 .chartTable .tdName{
  color:#e6e2e2;
}

</style>
  