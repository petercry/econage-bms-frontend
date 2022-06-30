<template>
    <el-card  :body-style="{ padding: '0 20px'}" style="" shadow='never'>
        <div ref="chart" style="width: 100%;height:400px;margin-top:20px;"></div>
    </el-card>
</template>
<script>

  import {getWorkflowTaskStatusCount} from '../../../service/service.js'
  import {mapState,mapMutations} from 'vuex'
  import Chart from '../../../config/chart'
  export default {
    components:{
    
    },
    name:'wfStatus',
    data(){
      return {
            chart:null,
            itemsList:[],
            index:2
      }
    },

    created(){
        this.getStatisticWfStatus();
    },
    computed:{
        ...mapState([
            'sysWidth','lang'
        ])
    },
    mounted() {
    },
    methods: {
      
      getStatisticWfStatus(){
            getWorkflowTaskStatusCount().then((res)=>{
                if (res.data){
                    (res.data).forEach((item)=>{
                        let name='';
                        switch (item.stType) {
                            case 1: name= '进行中'; break;
                            case 2: name= '完成'; break;
                            case 3: name= '取消'; break;
                            default: break;
                        } 
                        item.name = name;
                        item.value = item.num;
                    })
                    this.itemsList = res.data;
                  
                }
                
                this.displayChart();
            }).catch((error)=>{});
      },
      displayChart(){
        this.chart = Chart.init(this.$refs.chart);

        // 指定图表的配置项和数据
        var option = {
            color:[
                "#3fb1e3",
                "#6be6c1",
                "#1baffa",
                "#c4ebad"
            ],
            title: {
                text: '我参与的流程状态统计'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                right: 20,
                top:'center',
                width:'40%',
                align :'left',
                selectedMode :false
            },
            series: [
                {
                    name:this.$t('module.FlowStatus'),
                    type:'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    startAngle:0,
                    label: {
                            show: false,
                            position: 'center',
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                    },
                    center: ['35%', '50%'],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:this.itemsList
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        this.chart.setOption(option);
        this.chart.dispatchAction({type: 'highlight',seriesIndex: 0,dataIndex: 2});//设置默认选中高亮部分
        this.chart.on('mouseover',(e)=>{        
            if(e.dataIndex != this.index){  
                this.chart.dispatchAction({type: 'downplay', seriesIndex: 0, dataIndex: this.index  });        
            }  
        });
        this.chart.on('mouseout',(e)=>{
            this.index = e.dataIndex;
            this.chart.dispatchAction({type: 'highlight',seriesIndex: 0,dataIndex: e.dataIndex});    
        });
      }

    },
    destroyed() {

    },
    watch:{
        // 'sysWidth'(val){
        //     if(this.chart){
        //         this.chart.resize();
        //         this.chart.dispatchAction({type: 'downplay',seriesIndex: 0,dataIndex: this.index});
        //         this.chart.dispatchAction({type: 'highlight',seriesIndex: 0,dataIndex: this.index});
        //     }
        // },
        // 'lang'(val){
        //     this.getStatisticWfStatus();
        // }
    }
  }
</script>
<style scoped>
</style>
