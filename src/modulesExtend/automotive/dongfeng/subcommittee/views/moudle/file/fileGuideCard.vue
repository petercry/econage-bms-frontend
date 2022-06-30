<template>
<div class="kmGuide" v-show="data!=''">
    <div class="center">
        <table border="1">
            <!-- <tr>
                <td>操作：</td>
                <td colspan='3'>
                    <el-link type="primary">预览</el-link>
                    <el-link type="primary">下载</el-link>
                    <el-link type="primary">复制链接</el-link>
                </td>
            </tr> -->
            <tr>
                <td>卓越体系：</td>
                <td>{{data.excellenceSystem}}</td>
                <td>业务指南名称：</td>
                <td>{{data.businessGuideName}}</td>
            </tr>
            <tr>
                <td>业务指南编制目的及内容简介：</td>
                <td colspan='3'>{{data.purposeContent}}</td>
            </tr>
            <tr>
                <td>初稿完成时间：</td>
                <td>{{data.draftCompleteTime}}</td>
                <td>会签完成时间：</td>
                <td>{{data.countersignCompleteTime}}</td>
            </tr>
            <tr>
                <td>部门：</td>
                <td>{{data.dept}}</td>
                <td>科室：</td>
                <td>{{data.office}}</td>
            </tr>
            <tr>
                <td>制定人：</td>
                <td>{{data.maker}}</td>
                <td>制/修订：</td>
                <td>{{data.revisionType}}</td>
            </tr>
            <tr>
                <td>替代标准：</td>
                <td>{{data.substituteCode}}</td>
                <td>制修订：</td>
                <td>{{data.revisionType}}</td>
            </tr>
            <tr>
                <td>责任人：</td>
                <td>{{data.responsibleUser}}</td>
                <td>年度：</td>
                <td>{{data.year}}</td>
            </tr>
            <tr>
                <td>备注：</td>
                <td colspan='3'>{{data.comments}}</td>
            </tr>
            <tr>
                <td colspan='4'>起草人信息
                    <table style="width:100px" border="1">
                        <tr>
                            <td>姓名</td>
                        </tr>
                        <!-- <tr>
                            <td>张三</td>
                        </tr>
                        <tr>
                            <td>李四</td>
                        </tr> -->
                    </table>
                </td>
            </tr>
        </table>
        <!-- <div class="footer">
            <el-button type="primary">关闭</el-button>
        </div> -->
    </div>
</div>
</template>

<script>
export default {
    props: {
        data: {}
    },
    data() {
        return {

        }
    },
    mounted() {
        // console.log(this.$props)
    },
    watch: {
        data(nv, ov) {
            console.log(nv)
        }
    }
}
</script>

<style lang="less" scoped>
/deep/ .el-button {
    width: 70px;
    height: 36px;
}

/deep/ .el-link {
    margin-right: 10px;
    color: #0000ff;
    font-size: 16px;
}

.kmGuide {
    width: 100%;
    height: 100%;

    .center {
        width: 820px;
        margin: 20px auto;
        padding: 20px;
        box-sizing: border-box;
        background: #f2f2f2;
        border: 1px solid #797979;

        table {
            width: 100%;
            height: 100%;
            background: #f2f2f2;
            border: 1px solid #cccccc;

            tr {
                td {
                    padding: 10px;
                    box-sizing: border-box;

                    &:nth-child(odd) {
                        width: 135px;
                        padding: 10px;
                        box-sizing: border-box;
                    }

                    table {
                        margin-left: 140px;
                        margin-top: -20px;
                        text-align: center;
                        border: 1px solid #797979;

                        tr {
                            &:nth-child(1) {
                                background: #d7d7d7;
                            }

                            &:nth-child(2) {
                                background: white;
                            }

                            &:nth-child(3) {
                                background: #f2f2f2;
                            }
                        }
                    }
                }
            }
        }

        .footer {
            width: 100%;
            height: 50px;
            line-height: 50px;
            text-align: center;
            margin-top: 10px;
        }
    }
}
</style>
