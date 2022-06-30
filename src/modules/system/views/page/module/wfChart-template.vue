<template>
    <el-card  :body-style="{ padding: '0 20px'}" style="" shadow='never'>
        <div ref="chart" style="width: 100%;height:400px;margin-top:20px;"></div>
    </el-card>
</template>
<script>

  import {getWorkflowInitCount} from '../../../service/service.js'
  import {mapState,mapMutations} from 'vuex'
  import Chart from '../../../config/chart'
  export default {
    components:{
    },
    name:'wfTemplate',
    data(){
      return {
        chart:null,
        itemList:[]
      }
    },

    created(){
        this.getStatisticWfTemplate();
    },
    computed:{
        ...mapState([
            'sysWidth','lang'
        ])
    },
    mounted() {
    },
    methods: {
        ...mapMutations([
        'SET_MENU_TAB_CLICK'
      ]),

      getStatisticWfTemplate(){
            getWorkflowInitCount(10).then((res)=>{
                this.itemList = res.data;
                this.displayChart();
            }).catch((error)=>{});
      },

      displayChart(){
         try{
                let that = this;
                this.chart = Chart.init(this.$refs.chart);
                // 指定图表的配置项和数据
                var option = {
                    title: {
                        text:'流程模板统计'
                    },
                    tooltip: {},
                    legend: {
                        data:['总量'],
                        selectedMode :false
                    },
                    xAxis: {
                        data:this.itemList.map(item=>{
                            let name = item.templateName;
                            if(name.length>8){
                                name=name.slice(0,8)+"..."
                            }
                            return name
                        }),
                        axisLabel:{
                            interval:0,
                            rotate:26
                        }
                    },
                    yAxis: {},
                    series: [{
                        name: '总量',
                        type: 'bar',
                        data: this.itemList.map(item=>{return {
                            value:item.num,
                            name:item.templateName,
                            tooltip:{
                                formatter:(param)=>{
                                    return param.name+'<br/>'+'总量'+'：'+param.value;
                                }
                            }
                        }}),
                        itemStyle:{
                            color:'#1ba5fa'
                        }
                    }]
                };

        // 使用刚指定的配置项和数据显示图表。
      
            this.chart.setOption(option);
         }catch(e){
             console.log(e);
         }
      }

    },
    destroyed() {

    },
    watch:{
        // 'sysWidth'(val){
        //     if(this.chart){
        //         this.chart.resize();
        //     }
        // },
        // 'lang'(val){
        //     this.displayChart();
        // }
    }
  }
</script>
<style scoped>    
</style>
  