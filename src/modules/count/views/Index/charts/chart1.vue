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
        value2:'',
        chart:null,
        itemList:[
          {title:'杭州市',value1:23,value2:400},
          {title:'宁波市',value1:15,value2:300},
          {title:'温州市',value1:13,value2:244},
          {title:'绍兴市',value1:12,value2:96},
          {title:'嘉兴市',value1:11,value2:86},
          {title:'湖州市',value1:6,value2:30},
          {title:'舟山市',value1:1,value2:30},
          {title:'台州市',value1:4,value2:15},
          {title:'金华市',value1:7,value2:10},
          {title:'丽水市',value1:7,value2:10},
          {title:'衢州市',value1:7,value2:10},
        ],
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
                text: '地市出访团组',
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
            legend: {
                data:['咨询','办理'],
                bottom:'40',
                x: 'center',
                align:'left',
                // top:'middle',
                textStyle: {
                    color: '#e6fbfd',
                    fontSize: 10
                },
                itemWidth:12,
                itemHeight:12,
                height:100
            },
            // legend: {
            //     data:['总量'],
            //     itemWidth:14,
            //     bottom:10,
            //     borderRadius:0
            // },
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
                    name:'团组数',
                    type:'bar',
                    data: this.itemList.map(item=>item.value1),
                    // data:[300, 200, 200, 100, 200, 200, 100],
                    barCategoryGap:'40%',
                    label: {
                        show: true,
                        position: 'right'
                    },
                },
                {
                    name:'人数',
                    type:'line',
                    // yAxisIndex: 1,
                    data: this.itemList.map(item=>item.value2),
                    // data:[300, 200, 200, 100, 200, 200, 100],
                    barCategoryGap:'40%',
                    label: {
                        show: true,
                        position: 'right'
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
  