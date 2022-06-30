<template>
    <div>
        <eco-content top="0px" bottom='0px' style="left:10px;right:10px">
            <h2 style="margin:10px 0px">留言内容</h2>
            <ckeditor ref="articleEditor" :content="leavContent" height='200px' style='margin-bottom:23px'></ckeditor>
            <div class="btnBox">
                <div class="flex">
                    <el-button type="primary" @click="submitCase">提交</el-button>
                    <el-button type="primary" @click="saveCase">保存</el-button>
                </div>

            </div>
        </eco-content>
    </div>
</template>

<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ckeditor from './components/ckeditor.vue'
import { sendLeavMsg } from '../service/service.js'
import {EcoUtil} from '@/components/util/main.js'
export default {
    name:"",
    data() {
        return {
            leavContent: null,
            standardMessageId: null
        }
    },
    components: {
        ckeditor,
        ecoContent
    },
    created() {
        this.standardMessageId = this.$route.params.id
    },
    mounted() {

    },
    methods: {
        submitCase() {
            this.leavContent = this.$refs.articleEditor.getCkeditorData();
            var params = {}
            params.standardMessageId = this.standardMessageId
            params.content = this.leavContent
            sendLeavMsg(params).then(res => {
                if(res.data) {
                    this.$message.success("提交成功")
                    let doObj = {}
                    doObj.action = 'addleavMsg';
                    doObj.data = []
                    doObj.close = true;
                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
                } else {
                    this.$message.warning("不在留言时间范围内")
                }
            })
        },
        saveCase() {
            this.leavContent = this.$refs.articleEditor.getCkeditorData();
            var params = {}
            params.standardMessageId = this.standardMessageId
            params.content = this.leavContent
            sendLeavMsg(params).then(res => {
                if(res.data) {
                    this.$message.success("提交成功")
                    let doObj = {}
                    doObj.action = 'addleavMsg';
                    doObj.data = []
                    doObj.close = true;
                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
                } else {
                    this.$message.warning("不在留言时间范围内")
                }
            })
        }
    }
}
</script>
<style scoped>
/* @import url(); 引入css类 */
.btnBox {
    position: absolute;
    bottom: 20px;
    left: 35%;
    right: 35%;
}
.flex {
    display: flex;
    align-content: center;
    justify-content: space-between;
}
</style>
<style>
.page-content {
    overflow: inherit !important;
}
</style>
