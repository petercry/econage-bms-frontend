<template>
  <div class="chart4 " >
        <div ref="chart" style="width: 100%;height:100%" ></div>
        <div class="angle1"></div>
        <div class="angle2"></div>
  </div>
</template>
<script>

  import {mapState,mapMutations} from 'vuex'
  import Chart from '@/modules/count/config/chart'
  import geoJson from '@/modules/count/config/city.json'
  export default {
    components:{
    },
    name:'chart1',
    data(){
      return {
        chart:null,
      }
    },
    computed:{
       ...mapState(['sysWidth'])
    },
    mounted() {
        this.$nextTick(()=>{
            this.displayChart();
        })
    },
    methods: {
      displayChart(){
        let mapName = 'yh';
        Chart.registerMap(mapName, geoJson);
        this.chart = Chart.init(this.$refs.chart);

        var points = [
                  {value: [116.307076,37.453923],itemStyle:{color:'#4ab2e5'}}
                  , {value: [16.574929,37.332848],itemStyle:{color:'#4fb6d2'}}
                  , {value: [116.79372,37.649619],itemStyle:{color:'#52b9c7'}}
                  , {value: [117.390507,37.777724],itemStyle:{color:'#5abead'}}
                  , {value: [116.867028,37.192044],itemStyle:{color:'#f34e2b'}}
                  , {value: [116.758394,36.795497],itemStyle:{color:'#f56321'}}
                  , {value: [116.433904,37.164465],itemStyle:{color:'#f56f1c'}}
                  , {value: [116.003816,36.950501],itemStyle:{color:'#f58414'}}
                  , {value: [116.07862,37.209527]}
        ]

        // 指定图表的配置项和数据
        var option = {
            title: {
                top:0,
                text: '监管热点区域（联动）',
                x: 'center',
                textStyle: {
                    color: '#fff'
                }
            },    

            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return params.name;
                }
            },

           geo: {
              map: 'yh',
              aspectScale: 0.75, //长宽比
              zoom: 1.1,
              roam: false,
              itemStyle: {
              normal: {
              areaColor: {
                        type: 'radial',
                        x: 0.5,
                        y: 0.5,
                        r: 0.8,
                        colorStops: [{
                            offset: 0,
                            color: '#09132c' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#274d68'  // 100% 处的颜色
                        }],
                        globalCoord: true // 缺省为 false
              },
                shadowColor:'rgb(58,115,192)',
                shadowOffsetX: 10,
                shadowOffsetY: 11
            },
            emphasis: {
                areaColor: '#2AB8FF',
                borderWidth: 0,
                color: 'green',
                label: {
                  show: false
                }
            }
          },
        },
        series: [ {
            type: 'map',
            roam: false,
            label: {
                normal: {
                    show: true,
                    textStyle: {
                        color: '#1DE9B6'
                    }
                },
                emphasis: {
                    textStyle: {
                        color: 'rgb(183,185,14)'
                    }
                }
            },

            itemStyle: {
              normal: {
               borderColor: 'rgb(147, 235, 248)',
                borderWidth: 1,
                areaColor: {
                        type: 'radial',
                        x: 0.5,
                        y: 0.5,
                        r: 0.8,
                        colorStops: [{
                            offset: 0,
                            color: '#09132c' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#274d68'  // 100% 处的颜色
                        }],
                        globalCoord: true // 缺省为 false
                    },
              },
              emphasis: {
                    areaColor: 'rgb(46,229,206)',
                //    shadowColor: 'rgb(12,25,50)',
                    borderWidth: 0.1
                }
            },
            zoom: 1.1,
  
            map: 'yh' //使用
      
            },{
                type: 'effectScatter',
                coordinateSystem: 'geo',
                showEffectOn: 'render',
                zlevel:1,
                rippleEffect: {
                    period: 15,
                    scale: 4,
                    brushType: 'fill'
                },
                hoverAnimation: true,
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        offset: [15, 0],
                        color: '#1DE9B6',
                        show: true
                    },
                },
                itemStyle: {
                    normal: {
                       color:'#1DE9B6'/* function (value){ //随机颜色
                          return "#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6);
                          }*/,
                        shadowBlur: 10,
                        shadowColor: '#333'
                    }
                },
                symbolSize: 12,
                data: points
            } //地图线的动画效果
      

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
<style >    

.chart4{
    height:100%;
}

.mapRadio .el-radio-button__orig-radio:checked+.el-radio-button__inner {
    color: #777;
    /* background-color: #409EFF; */
    background-color: #e6fbfd;
    border-color: #e6fbfd;
    -webkit-box-shadow: -1px 0 0 0 #409EFF;
    box-shadow: -1px 0 0 0 #409EFF;
}
.mapRadio .el-radio-button__inner{
  background-color: transparent;
  border-color: #e6fbfd;
  color: #e6fbfd;
  padding: 4px 6px;
}
.mapCheck .el-checkbox__inner {
    background-color: transparent;
    border-color: #e6fbfd;
}
.mapCheck .el-checkbox__input.is-checked .el-checkbox__inner,.mapCheck .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: transparent;
    /* border-color: transparent; */
    color: #e6fbfd;
}
</style>
  