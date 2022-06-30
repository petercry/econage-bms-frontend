<template>
    <div class="echartPage componentPage">
          <div class="pageHeader">
              <div class="pageHeaderBtn cursorP active">业务<span>报表</span></div>
          </div>
        <div ref="chart1" class='echartBox'></div>
    </div>
</template>
<script>
    import * as echarts from "echarts"
    import { mapState } from 'vuex'
    export default {
        data() {
            return {
                myChart: null
            }
        },
        mounted(){
            this.initCase();
        },
        methods: {
            initCase(){
                this.myChart = echarts.init(this.$refs.chart1);
                let option = {
                    color: ['#409EFF'],
                    xAxis: {
                        type: 'category',
                        data: [
                            '1月',
                            '2月',
                            '3月',
                            '4月',
                            '5月',
                            '6月',
                            '7月',
                            '8月',
                            '9月',
                            '10月',
                            '11月',
                            '12月'
                        ]
                    },
                    yAxis: {
                        type: 'value',
                        axisLine:{
                            show:false
                        }
                    },
                    series: [
                        {
                            data: [120, 200, 150, 80, 70, 110, 130, 150, 80, 70, 110, 130],
                            type: 'bar'
                        }
                    ]
                };

                this.myChart.setOption(option);

            }
        },
        computed: {
            ...mapState(['sysWidth'])
        }, watch: {
            'sysWidth'(val) {
                if (this.myChart) {
                    this.myChart.resize();
                }
            }
        }
    }
</script>
<style scoped>
    .echartPage{
       height:400px;
    }
    .echartPage .echartBox{
        margin-top:15px;
        height:calc(100% - 55px);
        width:100%;
    }
</style>