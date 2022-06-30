<template>
  <div class="chartBox2" :style="{height:height+'px'}">
    <div class="title">
    </div>
    <div class="sum" style="right:10%;"></div>
    <div ref="chart" style="width: 100%;" :style="{height:height+'px'}"></div>
  </div>
</template>
<script>

  import {} from '@/modules/count/service/service'
  import {mapState,mapMutations} from 'vuex'
  import Chart from '@/modules/count/config/chart'
  export default {
    components:{
    },
    name:'chart1',
    data(){
      return {
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value:'',
        chart:null,
        itemList:[
          {title:'省部级',value:400},
          {title:'厅局级',value:300},
          {title:'县处级及以下',value:96},
        ].reverse(),
        height:420
      }
    },
    computed:{
       ...mapState(['sysWidth'])
    },
    mounted() {
      this.displayChart();
     
    },
    methods: {
      displayChart(){
        let that = this;
        this.chart = Chart.init(this.$refs.chart);

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '团组等级分布',
                x: 'center',
                top: "10",
                textStyle: {
                    color: '#fff',
                    fontSize: 16
                }
            },
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
                        }
                    },
                    axisLabel: {
                      color: '#e6fbfd',
                    }
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
</style>
  