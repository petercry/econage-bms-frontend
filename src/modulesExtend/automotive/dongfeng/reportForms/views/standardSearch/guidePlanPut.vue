<template>
<div class="standardDeptPut">
    <div class="header">
        <i></i>
        <span>设计指南计划发布</span>
    </div>
    <div id='echars' style="width:100%;height:500px;margin-top:20px;">

    </div>
</div>
</template>

<script>
import echarts from '../../config/chart'
import { getSummary } from '../../api/report'
export default {
    data() {
        return {
            guidList: []
        }
    },
    mounted() {
        this.getSummary()
    },
    methods: {
        getSummary() {
            getSummary('2021').then(res => {
                console.log(res)
                this.guidList = res
                this.displayChart()
            })
        },
        displayChart() {
            var chartDom = document.getElementById('echars');
            var myChart = echarts.init(chartDom);
            var option;

            option = {
                color: ['#c00000', '#70ad47', '#c00000', '#ffc000'],
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
                    left: 'center',
                    top: '30'
                },
                legend: {
                    data: ['编制实际', '发布实际', '编制计划', '发布计划']
                },
                xAxis: [{
                    type: 'category',
                    data: this.guidList.map(item => item.month + '月'),
                    axisPointer: {
                        type: 'shadow'
                    }
                }],
                yAxis: [{
                        type: 'value',
                        name: '',
                        min: 0,
                        max: 100,
                        interval: 50,
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    {
                        type: 'value',
                        name: '',
                        min: 0,
                        max: 100,
                        interval: 50,
                        axisLabel: {
                            formatter: '{value} '
                        }
                    }
                ],
                series: [{
                        name: '发布实际',
                        type: 'bar',
                        label: {
                            show: true,
                        },
                        data: this.guidList.map(item => item.publishActual)
                    },
                    {
                        name: '发布计划',
                        type: 'line',
                        yAxisIndex: 1,
                        label: {
                            show: true,
                            position: 'top'
                        },
                        data: this.guidList.map(item => item.publishPlan)
                    }
                ]
            };
            option && myChart.setOption(option);
        }
    }
}
</script>

<style lang="less" scoped>
.standardDeptPut {
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
