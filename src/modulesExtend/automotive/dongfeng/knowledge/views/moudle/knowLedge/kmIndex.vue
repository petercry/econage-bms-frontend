<template>
<div class="kmIndex">
    <div class="header">
        <p>
            <i></i><span>共享文档</span>
            <!-- <el-button icon="el-icon-search" type="primary">进入搜索</el-button>
            <el-button type="info">全部收起</el-button> -->
            <!-- <el-button type="info"s>全部收起</el-button> -->
        </p>
    </div>
    <div class="center">
        <p v-for="item in itemList" :key="item.id" @click="goDetail(item)"><i></i> <span>{{item.name}}</span></p>
    </div>
</div>
</template>

<script>
import { sysEnv } from '../../../config/env.js'
import { EcoUtil } from '@/components/util/main.js'
import { getKnowledgeLibCard, deleteKnowledgeLib } from '../../../api/knowledge.js'
export default {
    data() {
        return {
            itemList: []
        }
    },
    created() {
        this.getKnowledgeList();
    },
    methods: {
        getKnowledgeList() {
            getKnowledgeLibCard(this.params).then(res => {
                console.log(res)
                this.itemList = res
            })
        },
        goDetail(item) {
            if (sysEnv !== 1) {
                this.$router.push({ name: 'knowLibDetail', params: { id: item.id, type: item.category } })
            } else {
                let tabObj = {};
                tabObj.desc = item.name
                // tabObj.id = item.id
                let goPage = "knowledge/index.html#/knowLibDetail" + '/' + item.id + '/' + item.category;
                tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'knowLibDetail"+ item.id + "',href_link:'" + goPage + "'}";
                tabObj.reload = true;
                tabObj.clearIframe = true;
                EcoUtil.getSysvm().doTab(tabObj);
            }
        }
    }
}
</script>

<style lang="less" scoped>
.kmIndex {
    width: 100%;
    height: 100%;

    .header {
        width: 100%;
        height: 80px;
        display: flex;
        align-items: center;
        padding-left: 30px;
        box-sizing: border-box;
        font-size: 20px;
        background: #f8f9fb;

        i {
            display: inline-block;
            width: 5px;
            height: 30px;
            background: #1ba5fa;
            vertical-align: middle;
            margin-right: 20px;
        }

        span {
            margin-right: 10px;
            color: #58524b;
        }
    }

    .center {
        width: 100%;
        padding-left: 30px;
        box-sizing: border-box;
        margin-top: 20px;

        p {
            width: 100%;
            height: 30px;
            line-height: 30px;
            margin-bottom: 10px;
            background: #f6f6f6;
            cursor: pointer;

            i {
                display: inline-block;
                width: 3px;
                height: 30px;
                background: #1ba5fa;
                vertical-align: middle;
                margin-right: 20px;
            }
        }
    }
}
</style>
