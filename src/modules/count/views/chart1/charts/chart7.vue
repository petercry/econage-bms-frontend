<template>
  <div class="chart7 chartDiv">
      <div class="chartTitle">区县主体数量排行榜</div>
      <div ref="chart" style="width:96%;height:calc(100% - 30px)" ></div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import Chart from '../../../config/chart'
  export default {
    components:{
    },
    name:'chart7',
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
        var getName = window.dataObj.char7NameArray; 
        var getValue = window.dataObj.char7ValueArray; 

        var max = Math.max(...getValue);
        var getMax=[];
        var labelColor = ['#f44336', '#ff9800', '#00EDFC'];
        for(let i=0;i<getName.length;i++){
            getMax.push(max)
        }
        var emptyData = getValue.map((v, i) => {
                  let color = i > 2 ? '#00B2FF' : labelColor[i];
                  let item = {
                      value: v,
                      label: {
                          formatter: '{a|' + v + '}',
                          position: 'right',
                          distance: 20,
                          rich: {
                              a: {
                                  color: color,
                                  borderColor: color,
                                  // borderWidth: 1,
                                  // borderType: 'dashed',
                                  padding: [0, 0, 2, 0],
                                  width: 60,
                                  height: 18,
                                  fontWeight:'bold',
                                  fontFamily: 'ACENS',
                                  align: 'left',
                                  verticalAlign: 'middle',
                              }
                          }
              
                      }
                  }
                  return item
        })

        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'none'
                },
                formatter: function(params) {
                    return params[0].name  + ' : ' + params[0].value
                }
            },
            xAxis: {
                show: false,
                type: 'value'
            },
           grid: {
                left: '4%',
                right: '0%',
                bottom: '2%',
                top: '2%',
                containLabel: true
            },
            yAxis: [{
                type: 'category',
                inverse: true,
                offset: 100,
                axisLabel: {
                    show: true,
                    align: 'left',
                    textStyle: {
                        color: '#66cc00',
                    },
                    formatter: function(value,index) {
                            var num = ''
                            var str = ''
                            num= (index + 1);
                            if (index === 0) {
                                str = '     {num1|' + num + '} {title1|' + value + '}'
                            } else if (index === 1) {
                                str = '     {num2|' + num + '} {title2|' + value + '}'
                            }else if (index === 2) {
                                str = '     {num3|' + num + '} {title3|' + value + '}'
                            }else {
                                str = '     {num|' + num + '} {title|' + value + '}'
                            }
                            return str;
                            
                        },
                    rich:{
                        num:{
                            color: '#fff',
                            width: 20,
                            height: 20,
                            fontSize:14,
                            align: 'center',
                            borderRadius: 100
                        },
                        num1:{
                                color: labelColor[0],
                                width: 20,
                                height: 20,
                                fontSize:14,
                                align: 'center',
                                    backgroundColor:"rgba(255,212,1,0.5)"
                                },
                        num2:{
                                color: labelColor[1],
                                width: 20,
                                height: 20,
                                fontSize:14,
                                align: 'center',
                                backgroundColor:"rgba(0,251,175,0.5)"
                        },
                        num3:{
                                color: labelColor[3],
                                width: 20,
                                height: 20,
                                fontSize:14,
                                align: 'center',
                                    backgroundColor:"rgba(0,237,252,0.5)"
                        },
                        title:{
                            color: '#fff',
                        },
                        title1:{
                            color: labelColor[0],
                        },
                        title2:{
                            color: labelColor[1],
                        },
                        title3:{
                            color: labelColor[2],
                        },
                    }
                },
                        
                splitLine: {
                            show: false
                 },
                 axisTick: {
                            show: false
                },
                axisLine: {
                            show: false
                },
                 data: getName
            }],
            series: [{
                            name: '值',
                            type: 'bar',
                            zlevel: 1,
                            // label:{
                            //     show: true,
                            //     position: 'right',
                            //     color: '#fff',
                            //     fontSize: 14,
                            //     offset: [5, 0]
                            // },
                            itemStyle: {
                                normal: {
                                    barBorderRadius: 30,
                                    color: (val) => {
                                        if (val.dataIndex > 2) {
                                            return 'rgb(128,204,255,1)';
                                        } else {
                                            return labelColor[val.dataIndex];
                                        }
                                    }
                                },
                            },
                            barWidth: 15,
                            data: emptyData
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
.chart7{
  height:100%;
  padding-left:2%;
  padding-right:2%;
  /* padding:10px; */
}

.chart7 .chartTitle{
    text-align:center;
    color:#fff;
    line-height: 30px;
    height:30px;
    padding:10px 0px 0px 0px;
    font-size: 18px;
    font-weight: bold;
}


</style>
  