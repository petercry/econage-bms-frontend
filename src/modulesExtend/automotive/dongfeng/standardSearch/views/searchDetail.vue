<template>
<div class="searchDetail">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first"></el-tab-pane>
        <el-tab-pane label="操作记录" name="second"></el-tab-pane>
    </el-tabs>
    <div style="padding:20px;border:1px solid #E4E7ED;border-top:0;">
        <div v-if="activeName=='first'">
            <el-descriptions size="medium" :column="2" border>
                <el-descriptions-item :span="2" label="操作：">
                    <el-button type="text" @click="filePreview">预览</el-button>
                    <el-button type="text" @click="downFile">下载</el-button>
                    <el-button type="text">复制链接</el-button>
                </el-descriptions-item>
                <el-descriptions-item label="标准分类：">{{form.data.stdCategoryName}}</el-descriptions-item>
                <el-descriptions-item label="标准类型：">{{form.data.stdTypeName}}</el-descriptions-item>
                <el-descriptions-item label="标准编号：">{{form.data.stdCode}}</el-descriptions-item>
                <el-descriptions-item label="标准名称：">{{form.data.stdName}}</el-descriptions-item>
                <el-descriptions-item :span="2" label="标准编制目的及内容简介：">{{form.data.purposeContent}}</el-descriptions-item>
                <el-descriptions-item label="发布日期：">{{form.data.publishDate}}</el-descriptions-item>
                <el-descriptions-item label="实施日期：">{{form.data.implementTime}}</el-descriptions-item>
                <el-descriptions-item label="部门：">{{form.data.deptName}}</el-descriptions-item>
                <el-descriptions-item label="科室：">{{form.data.officeName}}</el-descriptions-item>
                <el-descriptions-item label="制定人：">{{form.data.makerName}}</el-descriptions-item>
                <el-descriptions-item label="制修订：">{{form.data.revisionTypeName}}</el-descriptions-item>
                <el-descriptions-item label="分标委：">{{form.data.subcommitteeName}}</el-descriptions-item>
                <el-descriptions-item label="体系码：">{{form.data.systemCode}}</el-descriptions-item>
                <el-descriptions-item :span="2" label="浏览量：">{{form.attr.readCount}}</el-descriptions-item>
            </el-descriptions>
            <el-input v-model="comment" style="margin-top:20px;resize:none;" type="textarea" :autosize="{ minRows: 4, maxRows: 4}" resize="none"></el-input>
            <div style="text-align:right;margin-top:10px">
                <el-button type="primary" @click="addComment">发布评论</el-button>
                <el-button type="primary" @click="comment=''">重置</el-button>
            </div>
            <ul style="margin-top:10px" v-for="item in commentList" :key="item.id">
                <li style="padding:0 0 5px;border-bottom:1px solid #ddd">
                    <div class="item">
                        <div>
                            <img src="" alt="">
                            {{item.userName}}
                        </div>
                        <div>
                            <span>
                                <!-- <el-button size="medium" type="text">删除</el-button> -->
                                <el-link type="primary" @click="getDeleteComment(item)" style="font-size:14px">删除</el-link> | {{item.createDate}}
                            </span>
                        </div>
                    </div>
                    <div class="content">
                        {{item.content}}
                    </div>
                </li>
            </ul>
        </div>
        <el-table v-if="activeName=='second'" border :data="operateList" style="width: 100%">
            <el-table-column label="序号" type="index" width="40"></el-table-column>
            <el-table-column label="操作类型" prop="typeName"></el-table-column>
            <el-table-column label="操作人员" prop="createUserName"></el-table-column>
            <el-table-column label="操作时间" prop="createDate"></el-table-column>
        </el-table>
    </div>

</div>
</template>

<script>
import { EcoFile } from '@/components/file/main.js'
import { getOperateRecord, selectCommon, addComment, commentList, deleteComment } from '../api/standardSearch.js'
export default {
    data() {
        return {
            activeName: 'first',
            tableData: [1],
            comment: '',
            form: {
                data: {
                    stdCategoryName: '',
                    stdTypeName: '',
                    stdCode: '',
                    stdName: '',
                    purposeContent: '',
                    publishDate: '',
                    deptName: '',
                    officeName: '',
                    makerName: '',
                    revisionTypeName: '',
                    subcommitteeName: '',
                    systemCode: '',
                    readCount: '',
                },
                attr: {},
                entity: {},
                source: {}
            },
            commentList: [],
            operateList: []
        }
    },
    created() {
        // console.log(this.$route.params)
        if (this.$route.params.id) {
            this.id = this.$route.params.id
            this.getSelectCommon()
            this.getCommentList()
            this.getOperateRecord()
        }
    },
    methods: {
        addComment() {
            addComment(this.id, this.comment).then(res => {
                // console.log(res)
                this.getCommentList()
            })
        },
        getCommentList() {
            commentList(this.info, this.id).then(res => {
                // console.log(res)
                this.commentList = res.rows
                // console.log(res.rows)
            })
        },
        getSelectCommon() {
            selectCommon(this.id).then(res => {
                console.log(res)
                this.form = res
            })
        },
        getDeleteComment(item) {
            deleteComment(item.id).then(res => {
                // console.log(res)
                this.getCommentList()
            })
        },
        getOperateRecord() {
            getOperateRecord(this.id).then(res => {
                // console.log(res)
                this.operateList = res.rows
            })
        },
        handleClick(tab, event) {
            console.log(tab.name);
        },
        downFile() {
            EcoFile.openFileHeaderByDownload(this.form.attr.fileHeaderId, encodeURIComponent(this.form.attr.fileName));
        },
        filePreview() {
            EcoFile.openFileHeaderByView(this.form.attr.fileHeaderId, this.form.attr.fileName);
        },

    }
}
</script>

<style lang="less" scoped>
.searchDetail {
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;

    /deep/ .el-table th {
        font-weight: 600;
        background: #f5f7fa;
    }

    /deep/ .el-table--border:after,
    /deep/ .el-table--group:after,
    /deep/ .el-table:before {
        background-color: #f5f7fa;
    }

    /deep/ .el-descriptions-item__label {
        background-color: #f5f7fa;
    }

    /deep/ .el-table--border,
    /deep/ .el-table--group {
        border-color: #f5f7fa;
    }

    /deep/ .el-table--border {
        border: 1px solid #ebeef5;
    }

    /deep/ .el-table td,
    /deep/ .el-table th.is-leaf {
        border-bottom: 1px solid #ebeef5;
        color: #4f334f;
        font-size: 12px;
    }

    /deep/ .el-table--border th,
    /deep/ .el-table--border th.gutter:last-of-type {
        border-bottom: 1px solid #ebeef5;
    }

    /deep/ .el-table--border td,
    /deep/ .el-table--border th {
        border-right: 1px solid #ebeef5;
    }

    /deep/.el-descriptions-item__label {
        width: 200px !important;
    }

    /deep/.el-tabs__header {
        margin: 0;
    }
}

.item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.content {
    margin-top: 5px;
}
</style>
