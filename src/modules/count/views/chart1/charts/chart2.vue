<template>
  <div class="chart2 chartDiv">
      <div class="chartTitle">高成长行业</div>
      <div ref="chart" style="width:96%;height:calc(100% - 30px)" ></div>
    </div>
</template>
<script>

  import {mapState,mapMutations} from 'vuex'
  import Chart from '@/modules/count/config/chart'
  export default {
    components:{
    },
    name:'chart1',
    data(){
      return {
          value2:'',
          chart:null,
          itemList:[],
      }
    },
    computed:{
       ...mapState(['sysWidth'])
    },
    mounted() {
      this.itemList = window.dataObj.char2Array;
      this.displayChart();
    },
    methods: {
      displayChart(){
        this.chart = Chart.init(this.$refs.chart);
        // 指定图表的配置项和数据
        var option = {
            color:['#08ABFF','#D6F7FE','#6C8EFF'],
            tooltip : {
                trigger: 'item'
            },
            calculable : false,
            xAxis : [
                {
                    type : 'category',
                    data : this.itemList.map(item=>item.title),
                    axisLine: {
                        lineStyle: {
                            color: '#999',
                        },
                    },
                    axisLabel: {
                    rotate:30,
                      color: '#e6fbfd',
                    },
                }
            ],
            grid: {
              left: 40,
              top: '10%',
              bottom: '24%',
            },
            yAxis : [
                {
                  minInterval: 1,
                  type : 'value',
                  axisLine: {
                      lineStyle: {
                          color: '#999',
                      }
                  },
                  axisLabel: {
                    color: '#e6fbfd',
                  },
                  splitLine:{
                    lineStyle:{
                        color: '#999',
                    }
                  }
                }
            ],
            series : [
                {
                    name:'办理',
                    type:'bar',
                    data: this.itemList.map(item=>item.value),
                    // data:[300, 200, 200, 100, 200, 200, 100],
                    barCategoryGap:'60%',
                    label: {
                        show: true,
                        position: 'top'
                    },
                },
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
.chart2{
    height:100%;
}

.chart2 .chartTitle{
    text-align:center;
    color:#fff;
    line-height: 30px;
    height:30px;
    padding:10px 0px 0px 0px;
    font-size: 18px;
    font-weight: bold;
}
</style>
  