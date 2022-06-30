<template>
<div class="standarReport">
    <div class="header">
        <div class="left">
            <i></i>
            <span>各类别数量统计</span>
        </div>
        <div class="right">
            <el-button type="primary" size="mini" @click="searchShow = !searchShow">高级查询</el-button>
            <!-- <el-button type='primary' size='mini' @click="exportCase">导出</el-button> -->
        </div>
    </div>
    <div class="header-input" v-show="searchShow">
        <el-form ref="form" :model="form" style="font-size: 12px">
            <el-row style="display: flex; justify-content: center">
                <el-col>
                    <el-form-item label="筛选条件:">
                        <el-select v-model="form.category" placeholder="请选择">
                            <el-option :label="item.name" :value="item.id" v-for="item in list" :key="item.id" :disabled="form.subCategory==item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="叠加条件:">
                        <el-select v-model="form.subCategory" placeholder="请选择">
                            <el-option :label="item.name" :value="item.id" v-for="item in list" :key="item.id" :disabled="form.category==item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-button type="primary" size="mini" @click="goSelect">查询</el-button>
                    <el-button type="primary" size="mini" @click="goReset">重置</el-button>
                </el-col>
            </el-row>
        </el-form>
    </div>
    <div id="echars" style="width: 100%; height: 500px; margin-top: 20px"></div>
</div>
</template>

<script>
import echarts from "../../config/chart";
import { sysEnv } from '../../config/env.js'
import { EcoUtil } from '@/components/util/main.js'
import { getRegulationTypeCount } from "../../api/report.js";
export default {
    data() {
        return {
            form: {
                category: "getCategory",
                subCategory: "getSubCategory",
            },
            form1: {},
            searchShow: true,
            list: [
                { name: "分类", id: "getCategory" },
                { name: "子类", id: "getSubCategory" },
                { name: "性质", id: "getNature" },
                { name: "整车零部件", id: "getApplicableType" },
                { name: "认证管理公告", id: "getCertificationTypeItem" },
                { name: "适用车型", id: "getCarModelItem" },
                { name: "动力类型", id: "getPowerTypeItem" },
                { name: "标准状态", id: "getStandardStatus" },
                { name: "法规版本", id: "getRegulationVersion" },
            ],
            regulList: [],
            data: [],
            myChart: null
        };
    },
    created() {
        this.getRegulationTypeCount()
    },
    mounted() {

    },
    methods: {
        getRegulationTypeCount() {

            getRegulationTypeCount(this.form.category, this.form.subCategory).then(res => {
                this.data = []
                if (res.children && res.children.length > 0) {
                    this.regulList = res.children
                    console.log(this.regulList)
                    this.regulList.forEach((item, index1) => {
                        item.children.forEach(item1 => {
                            if (this.data.length <= 0) {
                                this.data.push({ name: item1.name, count: [item1.count], id: item1.id })
                            } else {
                                let index = this.data.findIndex(item2 => item2.name == item1.name)
                                // console.log(index, item1.name, item1.count)
                                if (index > -1) {
                                    this.data[index].count[index1] = item1.count
                                } else {
                                    let count1 = []
                                    count1[index1] = item1.count
                                    this.data.push({ name: item1.name, count: count1, id: item1.id })
                                }
                            }
                        })
                    })
                } else {
                    this.regulList = []
                }
                this.displayChart()
                // console.log(this.data)
            })

        },
        displayChart() {
            var chartDom = document.getElementById("echars");
            this.myChart = echarts.init(chartDom);
            var option;
            let that = this;
            option = {
                // color: ["#5b9bd5", "#ed7d31", "#a5a5a5"],
                title: {
                    text: "各分类法规数量统计",
                    // subtext: 'Fake Data',
                    left: "center",
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross",
                        crossStyle: {
                            color: "#999",
                        },
                    },
                    formatter: function (params) {
                        let arr = params.filter(item => {
                            return item.data != undefined
                        })
                        return arr.map(item => {
                            return item.seriesName + ':' + item.data
                        }).join('</br>')
                    }
                },
                // tooltip: {
                //     trigger: 'axis',
                //     formatter: function (value) {
                //         console.log(value);
                //         return value[0].name + '<br />' + value[0].children.map(item => {
                //             return item.content + ':' + item.sum
                //         }).join('<br />')
                //     },
                //     appendToBody: true,
                //     confine: true
                // },
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
                    right: 300,
                },
                xAxis: [{
                    type: "category",
                    data: this.regulList.map((item) => item.name),
                    axisPointer: {
                        type: "shadow",
                    },
                }, ],
                yAxis: [{
                        type: "value",
                        name: "",
                        min: 0,
                        max: 45,
                        interval: 5,
                        axisLabel: {
                            formatter: "{value}",
                        },
                    },
                    {
                        type: "value",
                        name: "",
                        min: 0,
                        max: 45,
                        interval: 5,
                        axisLabel: {
                            formatter: "{value} ",
                        },
                    },
                ],
                series: this.data.map(item => {
                    return {
                        name: item.name,
                        type: "bar",
                        stack: "Ad",
                        label: {
                            show: true,
                        },
                        data: item.count,
                        id: item.id
                    }
                })
            };
            this.myChart.on('click', (params) => {
                // console.log(params.seriesId, )
                let filterCondition = ''
                this.list.map(item => {
                    if (item.id == this.form.category) {
                        filterCondition = item.name
                    }
                })
                let superpositionCondition = ''
                this.list.map(item => {
                    if (item.id == this.form.subCategory) {
                        superpositionCondition = item.name
                    }
                })
                // console.log(filterCondition, superpositionCondition)
                if (sysEnv === 0) {
                    this.$router.push({ name: 'regulationDetailList', params: { filterCondition, superpositionCondition, filterId: this.regulList[params.dataIndex].id, superpositionId: params.seriesId } })
                } else {
                    let url = '/reportForms/index.html#/regulationDetailList/' + filterCondition + '/' + superpositionCondition + '/' + this.regulList[params.dataIndex].id + '/' + params.seriesId
                    EcoUtil.getSysvm().openDialog('', url, '900', '600', "15vh");
                }

            });
            this.myChart.clear()
            option && this.myChart.setOption(option);
        },
        goReset() {
            this.form.category = 'getCategory'
            this.form.subCategory = 'getSubCategory'
            this.getRegulationTypeCount()
        },
        goSelect() {
            this.getRegulationTypeCount()
        },

    },
};
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
