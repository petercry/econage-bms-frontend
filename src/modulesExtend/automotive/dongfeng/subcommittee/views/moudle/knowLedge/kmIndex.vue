<template>
<div class="kmIndex">
    <div class="header">
        <p><i></i><span>共享文档</span>
            <el-button icon="el-icon-search" type="primary">进入搜索</el-button>
            <el-button type="info">全部收起</el-button>
        </p>
    </div>
    <div class="center">
        <p @click="goKnowList(4)"><i></i> <span>企业标准</span></p>
        <p @click="goKnowList(2)"><i></i> <span>外来标准</span></p>
        <p @click="goKnowList(3)"><i></i> <span>业务指南</span></p>
        <p @click="goKnowList(1)"><i></i> <span>通用文档</span></p>
    </div>
</div>
</template>

<script>
import { sysEnv } from '../../../config/env.js'
import { EcoUtil } from '@/components/util/main.js'
export default {
    data() {
        return {}
    },
    methods: {
        goKnowList(type) {
            if (sysEnv !== 1) {
                this.$router.push({ name: 'knowLedgeList', params: { type } })
            } else {
                let tabObj = {};
                if (type == 1) {
                    tabObj.desc = '通用文档'
                } else if (type == 2) {
                    tabObj.desc = '外来标准'
                } else if (type == 3) {
                    tabObj.desc = '业务指南'
                } else {
                    tabObj.desc = '企业标准'
                }
                let goPage = "knowledge/index.html#/knowLedgeList" + '/' + type;
                tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'knowLedgeList',href_link:'" + goPage + "'}";
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
