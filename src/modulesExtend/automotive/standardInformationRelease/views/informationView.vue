<template>
    <div>
        <ecoContent top="20" bottom='0' type='tool' class="ecoContent">
            <h2 class="title" v-if="formData && formData.title">{{formData.title}}</h2>
            <div class="vHtml" v-if="formData && formData.content" v-html="formData.content"></div>
            <div class="enclosure">
                <div>附件:</div>
                <div>
                    <ecoFileUploadChunk
                        style="padding: 20px;"
                        :modular="modular"
                        :modularInnerId="modularInnerId"
                        ref="ecoFileUploadRef"
                        :btnFlag=true
                        :limitPictureFile=true
                    ></ecoFileUploadChunk>
                </div>
            </div>
            <div class="leavMessage">
                <span style="float:left;">阅读人数: &nbsp;{{formData ? formData.readTotal : 0}}</span>
                <el-button class="leavMessageBtn" v-if="formData && formData.canMessageFlag == 'true'" @click="leavingMsg">留言</el-button>
            </div>
            <div class="tableBox">
                <h2 class="liveing">留言板</h2>
                <el-table :data="tableData ? tableData : []" border height="100%" class='standardizationTable' header-row-class-name='tableHeader'>
                    <el-table-column label="序号" type="index" width="80px">
                    </el-table-column>
                    <el-table-column label="工号" prop="publisherEmId" width="100px">
                    </el-table-column>
                    <el-table-column label="姓名" prop="publisher" width="100px">
                    </el-table-column>
                    <el-table-column label="时间" prop="createDate" width="100px">
                    </el-table-column>
                    <el-table-column label="内容" prop="content">
                        <template slot-scope="scope">
                            <div v-html="scope.row.content"></div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

        </ecoContent>
    </div>
</template>

<script>
  import ecoContent from '@/components/pageAb/ecoContent.vue'
  import{ getExamineView } from '../service/service.js'
  import ecoFileUploadChunk from '../views/components/ecoFileUploadChunk.vue'
  import {sysEnv} from '../config/env.js'
  import { EcoUtil } from '@/components/util/main.js'
export default {
    name:"",
    data() {
        return {
            formData: null,
            modular: 'addProcess',
            modularInnerId: '',
            id: null,
            tableData: []
        }
    },
    components: {
        ecoContent,
        ecoFileUploadChunk
    },
    created() {
        this.id = this.$route.params.id
        this.modularInnerId = this.id
        this.getExamineView(this.id)
    },
    mounted() {

    },
    methods: {
        listAction() {
            let that = this
            let callBackDialogFunc = function (obj) {
                if (obj && obj.action) {
                    that.getExamineView(that.id)
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'informationView')
        },
        leavingMsg() {
            if (sysEnv==0){
                this.$router.push({name:'leavMsgBook',params:{id:this.id}})
            }else{
                EcoUtil.getSysvm().openDialog('留言','/standardInformationRelease/#/leavMsgBook/' + this.id,700,600,'15vh');
            }
        },
        getExamineView(e) {
            getExamineView(e).then(res => {
                this.formData = res.data ? res.data.standardMessageEntity : null
                this.tableData = res.data ? res.data.leaveMessageEntities : null
                this.tableData = this.tableData.map(x => {
                    return {
                        ...x,
                        createDate: x.createDate.slice(0,10)
                    }
                })
            })
        }
    }
}
</script>
<style scoped>
/* @import url(); 引入css类 */
    .ecoContent {
        background-color:white !important;
        position: fixed;
        top: 0px;
        bottom: 0px;
        left: 20% !important;
        right: 20% !important;
    }

    .title {
        text-align: center;
        margin: 20px 0;
        font-size: 22px;
    }

    .liveing {
        margin: 20px 0;
        font-size: 22px;
    }

    .enclosure {
        width: 50%;
        margin: 20px 0px  0px 0px;
    }

    .leavMessage {
        display: flex;
        align-content: center;
        margin: 0 auto;
        height: 25px;
        justify-content: space-between;
    }

    .standardizationTable /deep/ .el-table__row.el-table__row--striped td {
        background: #f5f7fa !important;
    }

    .standardizationTable /deep/ .tableHeader th {
        background: #f5f7fa;
        color: #000;
    /* border-bottom-width: 0px; */
    }

    .tableBox {
        margin: 0 auto;
    }
</style>
