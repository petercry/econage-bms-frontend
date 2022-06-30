<template>
 <div class="scoreInfo">
      <!-- 评分信息 -->
      <div class="top">
           <p class="one">专家评分</p>
           <p>总分：79.3</p>
           <p>评审意见：项目必要，建议纳入项目需求库</p>
           <p>评审建议：项目必要，建议纳入项目需求库</p>
           <p>建议建设内容：</p>
      </div>
      <!-- <eco-content bottom="20px" style="height:200px"> -->
      <div class="bottom">
        <el-row>
             <el-col :span="12">
            <p class="one">管理评价</p>
        </el-col>
        <el-col :span="12">
             <p class="one" style="marginBottom:10px">职能评价</p>
             <span>审批评价</span>
          <el-progress :stroke-width="10" :percentage="100" color="#1ab394" :format="format" > </el-progress>
             <span>时限评价</span>
          <el-progress :stroke-width="10"  :percentage="100"  color="#1ab394"  :format="format" > </el-progress>
        </el-col>
        </el-row>
      </div>

      <!-- </eco-content > -->
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
 data () {
 return {
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
      format(percentage) {
      return percentage === 100 ? '50.0/50.0' : `${percentage}%`;
    }
 },
}
</script>

<style  scoped>
.scoreInfo{
  padding: 10px;
  position: relative;
  height: 100%;
}
 p {
  color: #676a6c;
  line-height: 28px;
}
 .one{
  font-size: 24px;
}
.bottom{
  padding-left: 24px;
  height: 200px;
  width: 100%;
  position: absolute;
  bottom: 10px;
}
.el-progress{

}
.el-progress /deep/ .el-progress-bar{
  width: 95%;
}
.chart{
  position: absolute;
  top: 10px;
  right:200px;
  bottom:300px;
  width: 400px;
  height: 400px;
  /* background-color: pink; */
}
</style>
