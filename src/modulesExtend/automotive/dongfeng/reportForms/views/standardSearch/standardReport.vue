<template>
<div class="standarReport">
    <div class="header">
        <i></i>
        <span>标准制修订年度统计表</span>
    </div>
    <div id='echars' style="width:100%;height:500px;margin-top:20px;">

    </div>
</div>
</template>

<script>
import echarts from '../../config/chart'
import { getStandYear } from '../../api/report'
export default {
    data() {
        return {
            data: [],
            yearList: []
        }
    },
    mounted() {

        this.getStandYear()
    },
    methods: {
        getStandYear() {
            getStandYear('2021').then(res => {
                console.log(res)
                this.yearList = res
                this.displayChart()
            })
        },
        displayChart() {
            var chartDom = document.getElementById('echars');
            var myChart = echarts.init(chartDom);
            var option;

            option = {
                color: ['#00b0f0', '#c55a11'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                // toolbox: {
                //     feature: {
                //         dataView: { show: true, readOnly: false },
                //         magicType: { show: true, type: ['line', 'bar'] },
                //         restore: { show: true },
                //         saveAsImage: { show: true }
                //     }
                // },
                title: {
                    text: '2021年标准制修订计划',
                    // subtext: 'Fake Data',
                    left: '50'
                },
                legend: {
                    data: ['累计实际', '调整计划']
                },
                xAxis: [{
                    type: 'category',
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                    axisPointer: {
                        type: 'shadow'
                    }
                }],
                yAxis: [{
                        type: 'value',
                        // name: '累计实际',
                        min: 0,
                        max: 400,
                        interval: 200,
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    {
                        type: 'value',
                        // name: '调整计划',
                        min: 0,
                        max: 400,
                        interval: 200,
                        axisLabel: {
                            formatter: '{value} '
                        }
                    }
                ],
                series: [{
                        name: '累计实际',
                        type: 'bar',
                        label: {
                            show: true,
                        },
                        data: this.yearList.map(item => item.actualCount)
                    },
                    {
                        name: '调整计划',
                        type: 'line',
                        yAxisIndex: 1,
                        label: {
                            show: true,
                            position: 'top'
                        },
                        data: this.yearList.map(item => item.adjustCount)
                    }
                ]
            };
            option && myChart.setOption(option);
        }
    }
}
</script>

<style lang="less" scoped>
.standarReport {
    width: 100%;
    height: 100vh;
    // padding-left: 20px;
    // padding-right: 20px;
    box-sizing: border-box;

    .header {
        width: 100%;
        height: 50px;
        padding-left: 20px;
        padding-right: 20px;
        box-sizing: border-box;
        line-height: 50px;
        border-left: 1px solid rgb(221, 221, 221);
        border-right: 1px solid rgb(221, 221, 221);
        border-bottom: 1px solid rgb(221, 221, 221);
        display: flex;
        // justify-content: space-between;
        align-items: center;

        i {
            width: 5px;
            height: 16px;
            line-height: 16px;
            background: #409eff;
            margin-right: 5px;
        }

    }
}
</style>
