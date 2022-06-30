<template>
  <div class="scoreInfo">
    <!-- 评分信息 -->
       <div class="top">
      <p class="one">专业评分</p>
      <!-- <p>总分：.0</p>
           <p>评审意见：</p>
           <p>评审建议：</p>
           <p>建议建设内容：</p> -->
      <div class="content">
        <el-col :span="6">
          <div class="card" :style="index==1?{backgroundColor:'#1ab394',color:'#fff'}:''" @click="change">
            <h3 style="marginBottom:10px">项目预审阶段专业评分 （73.9分）</h3>
            <el-progress
              :text-inside="true"
              :stroke-width="20"
              :percentage="73.9"
              stroke-linecap="square"
              color="#f8ac59"
            ></el-progress>
            <span :style="{color:index!==1?'#333':'#fff',fontSize:'14px',fontWeight:700,marginTop:'20px',display: 'inline-block'}">建议资金：1200.0（万元），评审意见:项目必要，建议纳入项目需求库</span>
          </div>
        </el-col>
      </div>
    </div>
    <div class="bottom">
          <p class="one">管理评分</p>
        <div class="content" >
          <el-col :span="6">
            <div class="card" :style="index2==2?{backgroundColor:'#1ab394',color:'#fff'}:''"   @click="change1" >
              <h3 style="marginBottom:10px">项目预审阶段管理评分 （71.6分））</h3>
              <el-progress
                :text-inside="true"
                :stroke-width="20"
                :percentage="71.6"
                stroke-linecap="square"
                color="#f8ac59"
              ></el-progress>
              <span :style="{color:index2!==2?'#333':'#fff',fontSize:'14px',fontWeight:700,marginTop:'20px',display: 'inline-block'}">评审意见:一般</span>
            </div>
          </el-col>
        </div>
    </div>
    <div class="chart" id="chart">

    </div>
  </div>
</template>

<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
export default {
  name: 'scoreInfo',
  components: {
    ecoContent,
  },
  data() {
    return {
      index:0,
      index2:0,
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart(){
        var myChart = this.$echarts.init(document.getElementById('chart'));
        let option = {
    title: {
        show:false,
        text: "近三年月度风险特征分析",
        x: "center",
        textStyle: {
            fontSize: 12
        }
    },
    grid:{
        top:'10%',
        containLabel:true
    },
    tooltip: {
        show: true,
        trigger: "item"
    },
    radar: {
        center: ["50%", "50%"],
        radius: "70%",
        shape: "circle",
        splitArea: {
            areaStyle: {
                color: ["transparent"]
            }
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: "#a4a4a4"
            }
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: "#a4a4a4"
            }
        },
        indicator: [{
            "name": "项目管理",
            "max": 20
        }, {
            "name": "建设必要性",
            "max": 10
        }, {
            "name": "减少人工",
            "max": 2
        }, {
            "name": "提升行政效率",
            "max": 2
        }, {
            "name": "是否调研",
            "max": 2
        }, {
            "name": "项目数据是否无条件归集到市大数据平台",
            "max": 1
        }, {
            "name": "技术保障",
            "max": 2
        }, {
            "name": "项目技术方案",
            "max": 7
        }, {
            "name": "需求方案申报完整性",
            "max": 16
        }, {
            "name": "项目预期目标",
            "max": 8
        }, {
            "name": "惠及群体覆盖面",
            "max": 6
        }, {
            "name": "资金保障",
            "max": 2
        }]
    },
    series: [{
        type: "radar",
        name:'项目管理',
        symbol: "circle",
        symbolSize: 6,
        itemStyle: {
            normal: {
                color:'rgba(19, 173, 255, 1)',
                borderColor: "rgba(19, 173, 255, 0.4)",
                borderWidth: 6
            }
        },
        areaStyle: {
            normal: {
                color: "rgba(19, 173, 255, 0.5)"
            }
        },
        lineStyle: {
            normal: {
                color: "rgba(19, 173, 255, 1)",
                width: 2,
                type: "dashed"
            }
        },
        label: {
          normal: {
            show: true,
            color: '#a4a4a4',
            position: 'top'
          }
        },
        data: [
            [16, 10, 2, 2, 0, 0, 2, 6, 14.5, 7, 2, 1.5]
        ]
    }]
    };
        // 绘制图表
    myChart.setOption(option)
    },
    change(){
       this.index=1
       this.index2=0
    },
    change1(){
        this.index2=2
        this.index=0
    }
  },
}
</script>

<style  scoped>
.scoreInfo {
  padding: 10px;
  position: relative;
}
p {
  color: #676a6c;
  line-height: 28px;
  width: 200px;
}
.one {
  font-size: 24px;
  color: #2e6da4;
  font-weight: bold;
}
.top{
}
.bottom {
  margin-top: 20px;
  /* padding-left: 24px; */
  /* height: 200px; */
  /* width: 100%; */
}
.card {
  background-color: inherit;
  border: 1px solid #e7eaec;
  display: block;
  margin-bottom: -1px;
  padding: 10px 15px;
  position: relative;
}
.content {
  margin-top: 10px;
  min-height: 160px;
  cursor: pointer;
}

/* .card:active{
  background-color: #1ab394;
  color: #fff;
} */
/* .content:focus{
    background-color: #1ab394;
  color: #fff;
} */
.chart{
  position: absolute;
  right:200px;
  top:80px;
  width: 600px;
  height: 600px;
  /* background-color: pink; */
}
</style>
