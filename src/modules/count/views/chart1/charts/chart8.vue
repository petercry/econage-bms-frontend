<template>
  <div class="chart8 chartDiv">
      <div class="chartTitle">异常企业分布及占比</div>
     
      <el-scrollbar style="height:calc(100% - 60px)" >
        <table class="chartTable" border="1" cellspacing="0">
          <thead>
              <tr>
                <th style="width:40%">区县</th>
                <th style="width:30%">异常个数</th>
                <th style="width:30%">异常百分比</th>
              </tr>
          </thead>
          <tbody>
            <tr v-for="(item,idx) in dataArray" :key="idx">
                <td class="tdName">{{item.name}}</td>
                <td class="tdData">{{item.d1}}</td>
                <td class="tdData">{{item.d2}}</td>
            </tr>
          </tbody>
        </table>
      </el-scrollbar>
  </div>
</template>
<script>

  import {mapState,mapMutations} from 'vuex'
  export default {
    components:{
    
    },
    name:'chart8',
    data(){
      return {
     
          dataArray:[]
      }
    },
    computed:{
       ...mapState(['sysWidth'])
    },
    created(){
        this.dataArray = window.dataObj.char8ValueArray;
 
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

.chart8{
    color:#fff;
    height:100%;
}

.chart8 .title{
  text-align: center;
  margin-top:20px;
}

.chart8 .chartTitle{
    text-align:center;
    color:#fff;
    line-height: 30px;
    height:30px;
    padding:10px 0px 0px 0px;
    font-size: 18px;
    font-weight: bold;
}

.chart8 .chartTable{
  width:100%;
  margin-top:10px;
  border: 1px;
  
}

.chart8 .chartTable th{
    background-color:rgba(35,43,86,0.5);
}

.chart8 .chartTable th,.chart8 .chartTable td{
    text-align: center;
    padding:5px;
    border: 1px solid #303d84;
    font-size: 12px;
}

.chart8 .chartTable .tdData{
  color:#98a0ce;
  font-weight: bold;
}

.chart8 .chartTable .tdName{
  color:#e6e2e2;
}


.el-scrollbar__bar.is-horizontal{
    display: none !important;
}
</style>

<style>

.chart8 .el-scrollbar__wrap{
  height:105%;
}
</style>
  