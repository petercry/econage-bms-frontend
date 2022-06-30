<template>
  <div class="chart5 chartDiv">
      <div class="chartTitle">主体增长趋势</div>
      <div ref="chart" style="width:96%;height:calc(100% - 30px)"  ></div>
    </div>
</template>
<script>
  import {mapState} from 'vuex'
  import Chart from '@/modules/count/config/chart'
  export default {
    components:{
    },
    name:'chart5',
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

        var _data = window.dataObj.char5Array;
        var option = {
              grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '10%',
                  top:'5%',
                  containLabel: true
              },
              xAxis: {
                    type: 'category',
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
                    axisLine: {
                        lineStyle: {
                            color: '#fff',
                        },
                    },
              },
              yAxis: {
                  type: 'value',
                   axisLine: {
                        lineStyle: {
                            color: '#fff',
                        },
                    },
              },
              series: [{
                  name:'',
                  symbolSize: 10,
                  symbol: 'circle',
                  smooth: true,
                  data: _data,
                  type: 'line',
                  lineStyle: {
                      width: 3,
                      shadowColor: 'rgba(0,0,0,0.3)',
                      shadowBlur: 10,
                      shadowOffsetY: 8,
                      normal: {
                        color: '#2196f3'
                      }
                    
                  },
                  itemStyle: {
                    normal: {
                        color: '#2196f3',
                        borderColor: '#2196f3'
                    }
                }
              }]
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
.chart5{
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
</style>
  