<template>
  <div class="map1 " >
        <div class="title">
            <el-row style="height:60px;">
                    <el-col :span="6" class="itemCol" v-for="(item,idx) in dataArray" :key="idx">
                        <img :src="require('../../../assets/img/main_top_line.png')" class="lineImg" v-if="idx!=4"/>
                        <div class="item" >
                            <div class="t1">{{item.value}}</div>
                            <div class="t2">{{item.name}}</div>
                        </div>
                    </el-col>
            </el-row>
        </div>
        <div ref="chart" style="width: 100%;height:calc(100% - 60px)" ></div>
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
            dataArray:[],
      }
    },
    computed:{
       ...mapState(['sysWidth'])
    },
    created(){
        this.dataArray.push({name:'企业主体总数',value:'504444',id:'receiverAmount'});
        this.dataArray.push({name:'异常企业数量',value:'1503',id:'payAmount'});
        this.dataArray.push({name:'食品企业数量',value:'120354',id:'invoiceAmount'});
        this.dataArray.push({name:'药品企业数量',value:'10534',id:'receivableAmount'});
        this.dataArray.push({name:'特种设备数量',value:'15644',id:'receivableAmount'});
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
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(0,0,0,0.7)',
                borderWidth: 0,
                textStyle: { color: '#fff' },
                formatter: function (params) {
                     let toolTiphtml = params.name+"："+ Math.floor(Math.random()*(100 - 1) + 1);
                     return toolTiphtml;
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
       //   roam: false,
            map: 'yh' //使用
            // data: this.difficultData //热力图数据   不同区域 不同的底色
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
            // {
            //     type: 'lines',
            //     zlevel: 2,
            //     effect: {
            //         show: true,
            //         period: 4, //箭头指向速度，值越小速度越快
            //         trailLength: 0.4, //特效尾迹长度[0,1]值越大，尾迹越长重
            //         symbol: 'arrow', //箭头图标
            //         symbolSize: 7, //图标大小
            //     },
            //     lineStyle: {
            //         normal: {
            //             color:'#1DE9B6',
            //             width: 1, //线条宽度
            //             opacity: 0.1, //尾迹线条透明度
            //             curveness: .3 //尾迹线条曲直度
            //         }
            //     },
            //     data: [
            //         {coords: [[116.307076,37.453923],[116.307076,37.453923]],lineStyle:{color:'#4ab2e5'}}
            //       , {coords: [[116.574929,37.332848],[116.307076,37.453923]],lineStyle:{color:'#4fb6d2'}}
            //       , {coords: [[116.79372,37.649619],[116.307076,37.453923]],lineStyle:{color:'#52b9c7'}}
            //       , {coords: [[117.390507,37.777724],[116.307076,37.453923]],lineStyle:{color:'#5abead'}}
            //       , {coords: [[116.867028,37.192044],[116.307076,37.453923]],lineStyle:{color:'#f34e2b'}}
            //       , {coords: [[116.758394,36.795497],[116.307076,37.453923]],lineStyle:{color:'#f56321'}}
            //       , {coords: [[116.433904,37.164465],[116.307076,37.453923]],lineStyle:{color:'#f56f1c'}}
            //       , {coords: [[116.003816,36.950501],[116.307076,37.453923]],lineStyle:{color:'#f58414'}}
            //     ]
            // }

        ]
    };

        // 使用刚指定的配置项和数据显示图表。
        this.chart.setOption(option);
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

.map1{
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

.map1 .title{
    /* z-index: 99999;
    position:absolute;
    top:10px;
    color:#ccc;
    width:90%;
    left:5%; 
    font-size:14px; */
}

.map1 .itemCol{
    position: relative;
    text-align: center;
    width:20%;
}

.map1 .item .t1{
  font-size: 24px;
  font-weight: bold;
  color:rgb(0,180,235);
}

.map1 .item .t2{
  font-size: 14px;
  font-weight: bold;
  margin-top:3px;
  color:#fff;
}


.map1 .lineImg{
    position:absolute;
    right:0px;
    top:0px;
}
</style>
  