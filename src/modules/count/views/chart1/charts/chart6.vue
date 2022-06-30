<template>
  <div class="chart6 chartDiv">
      <div class="chartTitle">企业年龄</div>
      <div ref="chart" style="width:96%;height:calc(100% - 30px)" ></div>
    </div>
</template>
<script>
  import {mapState} from 'vuex'
  import Chart from '@/modules/count/config/chart'
  export default {
    components:{
    },
    name:'chart6',
    data(){
      return {
        
      }
    },
    computed:{
       ...mapState(['sysWidth'])
    },
    created(){ 

    },
    mounted() {
        this.displayChart();
    },
    methods: {
      displayChart(){
        this.chart = Chart.init(this.$refs.chart);
        // 指定图表的配置项和数据
        var _data = window.dataObj.char6Array;
        var option = {
              grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '10%',
                  top:'0%',
                  containLabel: true
              },
              tooltip: {
                  trigger: 'item'
              },
              series: [
                  {
                      name: '访问来源',
                      type: 'pie',
                      radius: ['40%', '70%'],
                      avoidLabelOverlap: false,
                      emphasis: {
                          label: {
                              show: true,
                              fontSize: '20',
                              fontWeight: 'bold'
                          }
                      },
                      labelLine: {
                          show: true
                      },
                      data: _data
                  }
              ]
        };
        // 使用刚指定的配置项和数据显示图表。
        this.chart.setOption(option);
      }

    },
    destroyed() {

    },
    watch:{
        'sysWidth'(val){
            if(this.chart){
                this.chart.resize();
            }
        }
    }
  }
</script>
<style scoped>    
.chart6{
  height:100%;
}

.chart6 .chartTitle{
    text-align:center;
    color:#fff;
    line-height: 30px;
    height:30px;
    padding:10px 0px 0px 0px;
    font-size: 18px;
    font-weight: bold;
}
</style>
  