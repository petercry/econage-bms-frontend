<template>
  <div class="chart3 chartDiv">
      <div class="chartTitle">信用分类监管</div>
      <el-row style="width:96%;height:calc(100% - 30px);position:relative">

          <el-col :span="8" style="height:100%">
             <div ref="chart1"  style="width:100%;height:100%"></div>
          </el-col>

          <el-col :span="16" style="height:100%">
             <div ref="chart2"  style="width:100%;height:100%"></div>
          </el-col>
      </el-row>
     
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import Chart from '../../../config/chart'
  export default {
    components:{
    },
    name:'chart3',
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
        this.chart1 = Chart.init(this.$refs.chart1);
        this.chart2 = Chart.init(this.$refs.chart2);


        // 指定图表的配置项和数据
        var trafficWay = window.dataObj2.char3Array;
        var data = [];
        var color = ['#00ffff', '#00cfff', '#006ced', '#ffe000', '#ffa800', '#ff5b00', '#ff3000']
        for (var i = 0; i < trafficWay.length; i++) {
            data.push({
                value: trafficWay[i].value,
                name: trafficWay[i].name,
                itemStyle: {
                    normal: {
                        borderWidth: 5,
                        shadowBlur: 20,
                        borderColor: color[i],
                        shadowColor: color[i]
                    }
                }
            }, {
                value: 2,
                name: '',
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        },
                        color: 'rgba(0, 0, 0, 0)',
                        borderColor: 'rgba(0, 0, 0, 0)',
                        borderWidth: 0
                    }
                }
            });
        }
        var seriesOption = [{
            name: '',
            type: 'pie',
            clockWise: false,
            radius: [50, 54],
            hoverAnimation: false,
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        position: 'outside',
                        color: '#ddd',
                        formatter: function(params) {
                            var percent = 0;
                            var total = 0;
                            for (var i = 0; i < trafficWay.length; i++) {
                                total += trafficWay[i].value;
                            }
                           
                            percent = ((params.value / total) * 100).toFixed(0);
                           
                            if (params.name !== '') {
                                return params.name +' ( '+ percent + '% )';
                            } else {
                                return '';
                            }
                        },
                    },
                    labelLine: {
                        length: 10,
                        length2: 10,
                        show: true,
                        color: '#00ffff'
                    }
                }
            },
            data: data
        }];

        var option1 = {
            title: {
                text: '主体数量分类统计',
                left: 'center',
                textStyle: {
                    "color": "#fff",
                    fontSize: 16
                },
                top:0
            },
            color: color,
            tooltip: {
                show: false
            },
            toolbox: {
                show: false
            },
            series: seriesOption
        };





      var  option2 = {
          title: {
                  text: '主体分类趋势分析',
                  left: 'center',
                  textStyle: {
                      "color": "#fff",
                      fontSize: 16
                  },
                  top:0
              },

            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: '#57617B'
                    }
                }
            },
            grid: {
                left: '0%',
                right: '0%',
                bottom: '10%',
                top: '10%',
                containLabel: true
            },
            xAxis: [
                {
                type: 'category',
                boundaryGap: false,
                axisLine: {
                    lineStyle: {
                        color: '#0E2A43'
                    }
                },
                axisLabel: {
                    margin: 10,
                    textStyle: {
                        fontSize: 14,
                        color: '#D5CBE8'
                    }
                },
                axisTick: {
                    show: false
                },
                data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
            }, {
                axisPointer: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#0E2A43'
                    }
                },
                axisTick: {
                    show: false
                },
                position: 'bottom',
                offset: 20
            }],
            yAxis: [{
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#0E2A43'
                    }
                },
                axisLabel: {
                    margin: 10,
                    textStyle: {
                        fontSize: 14,
                        color: '#D5CBE8'
                    }
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: '#57617B'
                    }
                }
            }],
            series: [
              {
                name:  window.dataObj2.char4Array[0].name,
                type: 'line',
                smooth: true,
                stack: '总量',
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                animationDelay: 2000,
                animationDuration: 1000,
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'}
                    ],
                    animationDelay: 3000,
                    animationDuration: 1000
                },
                lineStyle: {
                    normal: {
                        width: 1,
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 0,
                            colorStops: [{
                                offset: 0, color: 'red' // 0% 处的颜色
                            }, {
                                offset: 1, color: 'grey' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        },
                        opacity: 0.9
                    }
                },
                areaStyle: {
                    normal: {
                        color: 'rgba(137, 189, 27, 0.3)',
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: 'rgb(137,189,27)',
                        borderColor: 'rgba(137,189,2,0.27)',
                        borderWidth: 12

                    }
                },
                data:  window.dataObj2.char4Array[0].value
            }, 
            {
                name:  window.dataObj2.char4Array[1].name,
                type: 'line',
                smooth: true,
                symbol: 'circle',
                stack: '总量',
                symbolSize: 5,
                animationDelay: 1000,
                animationDuration: 1000,
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'}
                    ],
                    animationDelay: 2000,
                    animationDuration: 1000
                },
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 1,
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 0,
                            colorStops: [{
                                offset: 0, color: 'red' // 0% 处的颜色
                            }, {
                                offset: 1, color: 'yellow' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        },
                        opacity: 0.9
                    }
                },
                areaStyle: {
                    normal: {
                        color: 'rgba(0, 236, 212, 0.3)',
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: 'rgb(0,136,212)',
                        borderColor: 'rgba(0,136,212,0.2)',
                        borderWidth: 12

                    }
                },
                data:  window.dataObj2.char4Array[1].value
            }, {
                name:  window.dataObj2.char4Array[2].name,
                type: 'line',
                stack: '总量',
                smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                animationDelay: 0,
                animationDuration: 1000,
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'}
                    ],
                    animationDelay: 1000,
                    animationDuration: 1000
                },
                lineStyle: {
                    normal: {
                        width: 1,
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 0,
                            colorStops: [{
                                offset: 0, color: 'red' // 0% 处的颜色
                            }, {
                                offset: 1, color: 'yellowgreen' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        },
                        opacity: 0.9
                    }
                },
                areaStyle: {
                    normal: {
                        color: 'rgba(219, 50, 51, 0.3)',
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {

                        color: 'rgb(219,50,51)',
                        borderColor: 'rgba(219,50,51,0.2)',
                        borderWidth: 12
                    }
                },
                data:  window.dataObj2.char4Array[2].value
            }, ]
        };



        // 使用刚指定的配置项和数据显示图表。
        this.chart1.setOption(option1);
        this.chart2.setOption(option2);
      }

    },
    destroyed() {

    },
    watch:{
        'sysWidth'(val){
            if(this.chart1){
                this.chart1.resize();
            }
        }
    }
  }
</script>
<style scoped>    
.chart3{
  height:100%;
  padding-left:2%;
  padding-right:2%;
  /* padding:10px; */
}

.chart3 .chartTitle{
    text-align:center;
    color:#fff;
    line-height: 30px;
    height:30px;
    padding:10px 0px 0px 0px;
    font-size: 18px;
    font-weight: bold;
}


</style>
  