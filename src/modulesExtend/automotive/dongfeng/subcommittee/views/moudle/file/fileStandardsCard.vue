<template>
<div class="kmStandards" v-show="data!=''">
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
                <td>标准分类：</td>
                <td>{{data.stdCategory}}</td>
                <td>标准类型：</td>
                <td>{{data.stdType}}</td>
            </tr>
            <tr>
                <td>标准编号：</td>
                <td>{{data.stdCode}}</td>
                <td>标准名称：</td>
                <td>{{data.stdName}}</td>
            </tr>
            <tr>
                <td>体系码：</td>
                <td>{{data.systemCode}}</td>
                <td>制定人：</td>
                <td>{{data.maker}}</td>
            </tr>
            <tr>
                <td>年度：</td>
                <td>{{data.year}}</td>
                <td>制/修订</td>
                <td>{{data.revisionType}}</td>
            </tr>
            <tr>
                <td>标准编制目的及内容简介：</td>
                <td colspan='3'>{{data.purposeContent}}</td>
            </tr>
            <tr>
                <td>部门：</td>
                <td>{{data.dept}}</td>
                <td>科室：</td>
                <td>{{data.office}}</td>
            </tr>
            <tr>
                <td>初稿完成时间：</td>
                <td>{{data.draftCompleteTime}}</td>
                <td>会签完成时间：</td>
                <td>{{data.countersignCompleteTime}}</td>
            </tr>
            <tr>
                <td>实施时间：</td>
                <td>{{data.implementTime}}</td>
                <td>实际会签时间：</td>
                <td>{{data.countersignActualTime}}</td>
            </tr>
            <tr>
                <td>发布日期：</td>
                <td>{{data.publishDate}}</td>
                <td>分标委：</td>
                <td>{{data.subcommittee}}</td>
            </tr>
            <tr>
                <td>规划来源：</td>
                <td>{{data.planSource}}</td>
                <td>来源编号：</td>
                <td>{{data.sourceCode}}</td>
            </tr>
            <tr>
                <td>五化领域：</td>
                <td>{{data.fiveDomainList}}</td>
                <td>应用领域：</td>
                <td>{{data.applicationDomainList}}</td>
            </tr>
            <tr>
                <td>适用项目：</td>
                <td>{{data.applicableProjectList}}</td>
                <td>应用车型：</td>
                <td>{{data.applicationCarModelList}}</td>
            </tr>
            <tr>
                <td>责任人：</td>
                <td>{{data.responsibleUser}}</td>
                <td>有效性：</td>
                <td>{{data.effectiveness}}</td>
            </tr>
            <tr>
                <td colspan='4'>起草人信息
                    <table style="width:300px" border="1">
                        <tr>
                            <td>姓名</td>
                            <td>起草人排序</td>
                        </tr>
                        <!-- <tr>
                            <td>张三</td>
                            <td>1</td>
                        </tr>
                        <tr>
                            <td>李四</td>
                            <td>2</td>
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

.kmStandards {
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
                        width: 120px;
                        padding: 10px;
                        box-sizing: border-box;
                    }

                    table {
                        margin-left: 120px;
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
