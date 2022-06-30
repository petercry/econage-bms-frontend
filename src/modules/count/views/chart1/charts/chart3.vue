<template>
  <div class="chart3 chartDiv" >
      <div class="chartTitle">全区年报</div>
      <div ref="chart" style="width:96%;height:calc(100% - 30px)"></div>
    </div>
</template>
<script>
  import {mapState,mapMutations} from 'vuex'
  import Chart from '@/modules/count/config/chart'
  export default {
    components:{
    },
    name:'chart3',
    data(){
      return {
           fourPieData:[],
           dataArr:[],
           titleArr:[],
           seriesArr:[],
           colors:[],
      }
    },
    computed:{
       ...mapState(['sysWidth'])
    },
    created(){ 

        this.fourPieData = window.dataObj.char3Array;
        this.colors = [['#57bbf7', '#2657a4'], ['#ffc969', '#2657a4'], ['#f38b97', '#2657a4'], ['#b1d882', '#2657a4'], ['#c0acf9', '#2657a4']]
        
        for (var i = 0; i < 100; i++) {
            if (i % 2 === 0) {
                  this.dataArr.push({ name: (i + 1).toString(), value: 25,itemStyle: {
                        normal: {
                            color: "#2ac9e1",
                            borderWidth: 0,
                            borderColor: "rgba(0,0,0,0)"
                        }
                    }
                  })
            } else {
                this.dataArr.push({name: (i + 1).toString(), value: 20,itemStyle: {
                    normal: {
                      color: "rgba(0,0,0,0)",
                      borderWidth: 0,
                      borderColor: "rgba(0,0,0,0)"
                    }
                }
              })
            }
       };

      let _that = this;
       this.fourPieData.forEach(function (item, index) {
          _that.titleArr.push( {
                text: '{a|' + item.name + '}',
                textAlign: 'center',
                left: index * 33 + 16.5 + '%' ,//如果一行四个就是按25*
                top:   "75%", 
                textStyle: {
                    textAlign: 'center',
                    rich: {
                      a: {
                        fontSize: 12,
                        color: '#bed7f8',
                        textAlign:'center',
                      },
                      b: {
                        fontSize: 14,
                        color: _that.colors[index][0],
                        padding: [6, 0, 6, 0]
                      },
                      c: {
                        fontSize: 12,
                        color: '#bed7f8',
                        padding: [5, 5]
                      }
                    }
                  }
              }
          );
          _that.seriesArr.push({
                type: 'pie',
                zlevel: 3,
                silent: true,
                center: [index * 33 + 16.5 + '%',"40%" ],
                radius: [54.1, 55], //[65, 66],
                label: {
                  normal: {
                    show: false
                  },
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: _that.dataArr
              },
              {
                name: item.name,
                type: 'pie',
                clockWise: false,
                radius: [37.5, 50],//[45, 60],
                itemStyle: {
                  normal: {
                    color: _that.colors[index][0],
                    shadowColor: _that.colors[index][0],
                    shadowBlur: 0,
                    label: {
                      show: false
                    },
                    labelLine: {
                      show: false
                    },
                  }
                },
                hoverAnimation: false,
                center: [index * 33 + 16.5 + '%' , "40%"],
                data: [{
                  value: item.value,
                  label: {
                    normal: {
                      formatter: '{d}%',
                      position: 'center',
                      show: true,
                      textStyle: {
                        fontSize: '16',
                        fontWeight: 'bold',
                        color: _that.colors[index][0]  //跟随其他颜色
                      }
                    }
                  },
                }, {
                  value: item.max - item.value,
                  name: 'invisible',
                  itemStyle: {
                    normal: {
                        color: _that.colors[index][1]
                    },
                    emphasis: {
                        color: _that.colors[index][1]
                    }
                  }
                }]
              }
            );
      });

    },
    mounted() {
        this.displayChart();
    },
    methods: {
      displayChart(){
        this.chart = Chart.init(this.$refs.chart);
        // 指定图表的配置项和数据
        var option = {
            title: this.titleArr,
            series :this.seriesArr,
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
.chart3{
  height:100%;
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
  