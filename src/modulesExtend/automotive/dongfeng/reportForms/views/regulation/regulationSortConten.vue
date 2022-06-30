<template>
<div class="regulationSortConten">
    <div class="header">
        <i></i>
        <span>法规分类统计</span>
    </div>

    <div class="content">
        <div class="first">
            <span>乘用车强制执行标准体系 ({{count}})</span>
            <i></i>
        </div>
        <div class="second">
            <div :class="index <firstcenter?'second-left':(index==firstcenter?'center second-right':'second-right')" v-for="(item,index) in sortContenList" :key="item.id">
                <span>{{item.name}} ({{item.count}})</span>
                <i></i>
                <i></i>
                <div class="third" v-for="(item1,index1) in item.children" :key="item1.id" :style="{'margin-top':index1==0?'40px':'20px'}">
                    <span>{{item1.name}} ({{item1.count}})</span>
                    <i></i>
                    <i></i>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import echarts from '../../config/chart'
import { getRegulationSortConten } from '../../api/report.js'
export default {
    data() {
        return {
            sortContenList: [],
            firstcenter: '',
            count: ''
        }
    },
    created() {
        this.getRegulationSortConten()
    },
    mounted() {},
    methods: {
        getRegulationSortConten() {
            getRegulationSortConten().then(res => {
                // console.log(res)
                this.sortContenList = res.children
                this.firstcenter = Math.floor(this.sortContenList.length / 2)
                this.count = res.count
                // console.log(this.firstcenter)
            })
        },
    }
}
</script>

<style lang="less" scoped>
.regulationSortConten {
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
        align-items: center;

        i {
            width: 5px;
            height: 16px;
            line-height: 16px;
            background: #409eff;
            margin-right: 5px;
        }

    }

    .content {
        width: 100%;
        height: 500px;
        margin: 20px auto;

        .center {
            margin-left: 0 !important;
        }

        .first {
            width: 300px;
            height: 50px;
            border: 1px solid #41719c;
            border-radius: 5px;
            text-align: center;
            line-height: 50px;
            margin: 0 auto;
            position: relative;

            i {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                bottom: -20px;
                width: 2px;
                height: 20px;
                background: #41719c;
            }
        }

        .second {
            width: 100%;
            margin-top: 38px;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            // margin-left: -20px;
            font-size: 14px;

            span {
                display: inline-block;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                border: 1px solid #41719c;
                border-radius: 5px;
                text-align: center;
                line-height: 50px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .second-left {
                min-width: 100px;
                height: 50px;
                position: relative;
                margin-right: 60px;
                background: white;

                i:nth-of-type(1) {
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    top: -20px;
                    width: 2px;
                    height: 20px;
                    background: #41719c;
                }

                i:nth-of-type(2) {
                    position: absolute;
                    left: 50%;
                    top: -20px;
                    width: 200%;
                    height: 2px;
                    background: #41719c;
                }
            }

            .second-right {
                min-width: 100px;
                height: 50px;
                position: relative;
                margin-left: 60px;

                i:nth-of-type(1) {
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    top: -20px;
                    width: 2px;
                    height: 20px;
                    background: #41719c;
                }

                i:nth-of-type(2) {
                    position: absolute;
                    right: 50%;
                    top: -20px;
                    width: 200%;
                    height: 2px;
                    background: #41719c;
                }
            }

            .third {
                min-width: 140px;
                margin-top: 20px;
                height: 50px;
                position: relative;
                margin-left: 60px;
                font-size: 12px;

                i:nth-of-type(1) {
                    position: absolute;
                    left: -12px;
                    // transform: translateX(-100%);
                    top: -45px;
                    width: 2px;
                    height: 72px;
                    background: #41719c;

                }

                i:nth-of-type(2) {
                    position: absolute;
                    left: -12px;
                    top: 50%;
                    width: 12px;
                    height: 2px;
                    background: #41719c;
                }
            }
        }

    }

}
</style>
