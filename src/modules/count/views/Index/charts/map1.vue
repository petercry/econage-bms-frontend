<template>
  <div class="chartBox2" :style="{height:height+'px'}">
    <div ref="chart" style="width: 100%;top:0px;" :style="{height:(height-30)+'px'}"></div>
    <div class="angle1"></div>
    <div class="angle2"></div>
  </div>
</template>
<script>

  import {} from '@/modules/count/service/service'
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
        itemList:[
          {name: "杭州市", value: 5,group:5,country:6},
          {name: "宁波市", value: 0,group:0,country:4},
          {name: "温州市", value: 11,group:11,country:1},
          {name: "嘉兴市", value: 5,group:5,country:16},
          {name: "湖州市", value: 7,group:7,country:9},
          {name: "绍兴市", value: 11,group:11,country:7},
          {name: "金华市", value: 13,group:13,country:7},
          {name: "衢州市", value: 17,group:17,country:4},
          {name: "舟山市", value: 27,group:27,country:2},
          {name: "台州市", value: 19,group:19,country:6},
          {name: "丽水市", value: 31,group:27,country:1}, 
        ],
        value1:'week',
        isGoWhere:false,
        height:770,
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
        let that = this;
        let mapName = 'yh';
        Chart.registerMap(mapName, geoJson);
        this.chart = Chart.init(this.$refs.chart);
        var geoCoordMap = {
            '杭州市': [120.153576, 30.287459],
            '宁波市': [121.549792, 29.868388],
            '温州市': [120.672111, 28.000575],
            '嘉兴市': [120.750865, 30.762653],
            '湖州市': [120.102398, 30.867198],
            '绍兴市': [120.582112, 29.997117],
            '金华市': [119.649506, 29.089524],
            '衢州市': [118.87263,  28.941708],
            '舟山市': [122.106863, 30.016028],
            '台州市': [121.428599, 28.661378],
            '丽水市': [119.921786, 28.451993],
        }
        var convertData = function (data) {
            if (!that.isGoWhere){
              return [];
            }
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = geoCoordMap[data[i].name];
                if (geoCoord&&data[i].notgoNum>0) {
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].notgoNum),
                        visualMap:false
                    });
                }
            }
            return res;
        }
        // 指定图表的配置项和数据
        var option = {
            tooltip : {
                trigger: 'item',
                formatter: "{b} <br/>{a}: {c}"
            },
            geo: {
                show: true,
                map: 'yh',
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    emphasis: {
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        borderColor: '#e6fbfd',
                        borderWidth: 1,
                        areaColor: 'rgba(255,255,255,0.2)',
                        color:'#fff'
                    },
                    emphasis: {
                        areaColor: 'rgba(255,255,255,0.2)',
                    }
                },
                regions:that.itemList.map(item=>{
                  item.emphasis = { itemStyle:{ areaColor: '#30B7BC'}}
                  // if(item.red){
                  //   item.emphasis = { itemStyle:{ areaColor: '#C4333A'}}
                  //   return item;
                  // }
                  // if(item.country){
                  //   item.emphasis = { itemStyle:{ areaColor: '#FCB154'}}
                  //   return item;
                  // }
                  // if(item.group){
                  //   item.emphasis = { itemStyle:{ areaColor: '#30B7BC'}}
                  //   return item;
                  // }
                  return item;
                }),
                roam: true,
            },
            series: [{
                type: 'map',
                name:'案件数',
                mapType: mapName,
                geoIndex: 0,
                animation: false,
                roam: true,
                data: that.itemList,
                tooltip:{
                  formatter:function(value){
                    return [
                      '总计团组：'+value.data.group,
                      '总人数：'+value.data.value,
                      '总出访国家：'+value.data.country,
                    ].join('<br />')
                  }
                }
            },
            {
                name: '点',
                type: 'scatter',
                coordinateSystem: 'geo',
                symbol: 'pin',
                symbolSize: 40,
                tooltip:{
                  formatter: "{b}"
                },
                label: {
                    normal: {
                        show: true,
                        formatter: function(value) {
                            return value.value[2]
                        },
                        textStyle: {
                            color: '#fff',
                            fontSize: 12,
                        }
                    },
                },
                itemStyle: {
                  normal:{
                    color: '#05C3F9', //标志颜色
                  }
                },
                zlevel: 6,
                data: convertData(that.itemList),
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        this.chart.setOption(option);
        // //捕捉georoam事件，使下层的geo随着上层的geo一起缩放拖曳
        // this.chart.on('georoam',function(params){
        //     var option = this.chart.getOption();//获得option对象
        //   if(params.zoom!=null&&params.zoom!=undefined){ //捕捉到缩放时
        //       option.geo[1].zoom=option.geo[0].zoom;//下层geo的缩放等级跟着上层的geo一起改变
        //       option.geo[1].center=option.geo[0].center;//下层的geo的中心位置随着上层geo一起改变
        //   }else{//捕捉到拖曳时
        //       option.geo[1].center=option.geo[0].center;//下层的geo的中心位置随着上层geo一起改变
        //   }
        //   this.chart.setOption(option);//设置option
        // });
      }

    },
    destroyed() {

    },
    watch:{
        'isGoWhere'(){
          if(this.chart){
              this.displayChart();
          }
        },
        'sysWidth'(val){
            if(this.chart){
                this.chart.resize();
            }
        }
    }
  }
</script>
<style >    
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
  