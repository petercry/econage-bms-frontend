<template>
  <div class="chart1 chartDiv">
      <div class="chartTitle">重点监管行业</div>
      <div ref="chart" style="width:96%;height:calc(100% - 30px)" ></div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import Chart from '../../../config/chart'
  import wordCloud from "./wordcloud/wordcloud.js";

  export default {
    components:{
    },
    name:'chart1',
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
        var keywords = window.dataObj2.char6Obj;
        var data = [];
        for (var name in keywords) {
            data.push({
                name: name,
                value: Math.sqrt(keywords[name])
            })
        }
      
      var option = {
          series: [{
            type: 'wordCloud',
            shape: 'circle',
            left: 'center',
            top: 'center',
            width: '90%',
            height: '80%',
            right: null,
            bottom: null,

            sizeRange: [12, 60],
            // Text rotation range and step in degree. Text will be rotated randomly in range [-90, 90] by rotationStep 45
            rotationRange: [-90, 90],
            rotationStep: 45,

            // size of the grid in pixels for marking the availability of the canvas
            // the larger the grid size, the bigger the gap between words.

            gridSize: 8,

            // set to true to allow word being draw partly outside of the canvas.
            // Allow word bigger than the size of the canvas to be drawn
            drawOutOfBound: false,

            // Global text style
            textStyle: {
                normal: {
                    fontFamily: 'sans-serif',
                    fontWeight: 'bold',
                    // Color can be a callback function or a color string
                    color: function () {
                        return '#fff';
                    }
                },
                emphasis: {
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },

            // Data is an array. Each array item must have name and value property.
            data: data
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
.chart1{
  height:100%;
  padding-left:2%;
  padding-right:2%;
  /* padding:10px; */
}

.chart1 .chartTitle{
    text-align:center;
    color:#fff;
    line-height: 30px;
    height:30px;
    padding:10px 0px 0px 0px;
    font-size: 18px;
    font-weight: bold;
}


</style>
  