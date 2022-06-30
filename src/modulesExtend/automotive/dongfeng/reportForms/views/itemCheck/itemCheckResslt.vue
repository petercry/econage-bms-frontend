<template>
<div class="standarReport">
    <div class="header">
        <div class="left">
            <i></i>
            <span>项目点检结果汇总</span>
        </div>
        <div class="right">
            <el-button type="primary" size="mini" @click="searchShow=(!searchShow)">高级查询</el-button>
            <!-- <el-button type='primary' size='mini' @click="exportCase">导出</el-button> -->
        </div>
    </div>
    <div class="header-input" v-show="searchShow">
        <el-form ref="form" :model="form" style="font-size:12px">
            <el-row style="display:flex;justify-content: center;">
                <el-col>
                    <el-form-item label="项目名称:">
                        <el-input v-model="projectName"  @click.native="getProject"></el-input>
                    </el-form-item>
                </el-col>
                <el-col style="width:320px">
                    <el-form-item label="上传日期:">
                        <el-date-picker value-format="yyyy-MM-dd" v-model="upLodeTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-button type="primary" size="mini" @click="goSelect">查询</el-button>
                    <el-button type="primary" size="mini" @click="goReset">重置</el-button>
                </el-col>
            </el-row>
        </el-form>
    </div>
    <div id='echars' style="width:100%;height:500px;margin-top:20px;">

    </div>
</div>
</template>

<script>
import echarts from '../../config/chart'
import { sysEnv } from '../../config/env.js'
import { EcoUtil } from '@/components/util/main.js'
import { getInspection } from '../../api/report'
export default {
    data() {
        return {
            form: {
                projectId: '1402145636873859074',
                upLodeTimeStart: '',
                upLodeTimeEnd: ''
            },
            projectName: '',
            form1: {},
            searchShow: true,
            upLodeTime: [],
            regulList: [],
            data: []
        }
    },
    mounted() {
        this.getInspection()
        this.callAction()
    },
    methods: {
        callAction() {
            let this_ = this
            let callBackDialogFunc = function (obj) {
                if (obj && obj.action === 'projectName') {
                    // console.log(obj.data)
                    this_.projectName = obj.data.name
                    this_.form.projectId = obj.data.id
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'itemCheckResslt')
        },
        getInspection() {
            getInspection(this.form).then(res => {
                if (res.children && res.children.length > 0) {
                    this.regulList = res.children
                    this.data = []
                    this.regulList.forEach((item, index1) => {
                        item.children.forEach(item1 => {
                            if (this.data.length <= 0) {
                                this.data.push({ name: item1.name, count: [item1.count] })
                            } else {
                                let index = this.data.findIndex(item2 => item2.name == item1.name)
                                // console.log(index, item1.name, item1.count)
                                if (index > -1) {
                                    this.data[index].count[index1] = item1.count
                                } else {
                                    let count1 = []
                                    count1[index1] = item1.count
                                    this.data.push({ name: item1.name, count: count1, type: 'bar' })
                                }
                            }
                        })
                    })
                    this.displayChart()
                } else {
                    this.regulList = []
                }
            })
        },
        displayChart() {
            var chartDom = document.getElementById('echars');
            var myChart = echarts.init(chartDom);
            var option;

            option = {
                color: ['#5b9bd5', '#ed7d31', '#a5a5a5'],
                title: {
                    text: '项目各节点任务办理情况',
                    // subtext: 'Fake Data',
                    left: 'center'
                },
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
                legend: {
                    data: this.regulList.map(item => item.name),
                    right: 300
                },
                xAxis: [{
                    type: 'category',
                    data: this.regulList.map(item => item.name),
                    axisPointer: {
                        type: 'shadow'
                    }
                }],
                yAxis: [{
                        type: 'value',
                        name: '',
                        min: 0,
                        max: 200,
                        interval: 50,
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    {
                        type: 'value',
                        name: '',
                        min: 0,
                        max: 200,
                        interval: 50,
                        axisLabel: {
                            formatter: '{value} '
                        }
                    }
                ],
                series: this.data.map(item => {
                    return {
                        name: item.name,
                        type: "bar",
                        stack: "Ad",
                        label: {
                            show: true,
                        },
                        data: item.count
                    }
                })
            };
            option && myChart.setOption(option);
        },
        getProject() {
            if (sysEnv === 0) {
                this.$router.push({ name: 'projectList' })
            } else {
                let url = '/reportForms/index.html#/projectList'
                EcoUtil.getSysvm().openDialog('', url, '900', '600', "15vh");

            }
        },
        goReset() {
            this.form.projectId = '1402145636873859074'
            this.form.upLodeTimeStart = ''
            this.form.upLodeTimeEnd = ''
            this.upLodeTime = []
            this.projectName = ''
            this.getInspection()
        },
        goSelect() {
            if (this.upLodeTime) {
                this.form.upLodeTimeStart = this.upLodeTime[0]
                this.form.upLodeTimeEnd = this.upLodeTime[1]
            } else {
                this.form.upLodeTimeStart = ''
                this.form.upLodeTimeEnd = ''
            }
            this.getInspection()
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
        justify-content: space-between;
        align-items: center;

        .left {
            display: flex;
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

    .header-input {
        width: 100%;
        height: 50px;
        padding-left: 20px;
        padding-top: 10px;
        box-sizing: border-box;
        border-left: 1px solid rgb(221, 221, 221);
        border-right: 1px solid rgb(221, 221, 221);
        border-bottom: 1px solid rgb(221, 221, 221);

        /deep/ .el-form-item__label {
            font-size: 12px;
        }
    }

    /deep/ .el-col {
        width: 220px;
    }

    /deep/ .el-date-editor {
        width: 210px;
    }

    /deep/ .el-input {
        width: 130px;
        height: 28px;
    }
}
</style>
