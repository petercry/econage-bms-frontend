<template>
<div class="kmForeign" v-show="data!=''">
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
                <td>标准大类：</td>
                <td>{{data.stdCategory}}</td>
                <td>标准小类：</td>
                <td>{{data.stdSubCategory}}</td>
            </tr>
            <tr>
                <td>分类号：</td>
                <td>{{data.categoryNum}}</td>
                <td>标准编号：</td>
                <td>{{data.stdCode}}</td>
            </tr>
            <tr>
                <td>标准名称：</td>
                <td>{{data.stdName}}</td>
                <td>英文名称：</td>
                <td>{{data.enName}}</td>
            </tr>
            <tr>
                <td>体系码：</td>
                <td>{{data.systemCode}}</td>
                <td>补充码：</td>
                <td>{{data.supplementaryCode}}</td>
            </tr>
            <tr>
                <td>被替代标准：</td>
                <td>{{data.substituteCode}}</td>
                <td>有效性：</td>
                <td>{{data.effectiveness}}</td>
            </tr>
            <tr>
                <td>标准编制目的及内容简介：</td>
                <td colspan='3'>{{data.stdContent}}</td>
            </tr>
            <tr>
                <td>发布日期：</td>
                <td>{{data.publishDate}}</td>
                <td>实施日期：</td>
                <td>{{data.implementDate}}</td>
            </tr>
            <tr>
                <td>采用国际编号：</td>
                <td>{{data.internationalCode}}</td>
                <td>采标关系：</td>
                <td>{{data.adoptStdRelationship}}</td>
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

.kmForeign {
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
