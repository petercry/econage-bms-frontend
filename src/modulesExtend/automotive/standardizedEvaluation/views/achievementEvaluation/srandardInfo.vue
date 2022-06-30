<template>
    <div class="proBaseInfo">
            <div  class="toolbar">
                <!-- <el-button type="primary" @click="editFunc" v-show='initRole["PAGE_PROJECT_BASE"]["permission"]["EDIT"]'>编辑</el-button> -->
                <!-- <el-button type="primary" >同步</el-button> -->
                <!-- <el-button type="primary" @click='historyFunc' v-show='initRole.PAGE_PROJECT_BASE.permission.HISTORY'>历史记录</el-button> -->
            </div>

            <table class="mainTable" border="0" cellspacing="0">
                <tr>
                    <th>部门</th>
                    <td>{{baseInfo.code}}</td>
                    <th>申报人</th>
                    <td>{{baseInfo.name}}</td>
                </tr>

                <tr>
                    <th>电话</th>
                    <td>{{baseInfo.buildingNumber}}</td>
                    <th>邮箱</th>
                    <td>{{baseInfo.belongOfficeAndCommunity}}</td>
                </tr>

                <tr>
                    <th>分标委</th>
                    <td>{{baseInfo.communityContacts}}</td>
                </tr>

                <tr>
                    <th>校准分类</th>
                    <td>{{baseInfo.buildArea}}</td>
                    <th>标准类型</th>
                    <td>{{baseInfo.houseNature}}</td>
                </tr>
                <tr>
                    <th>标准号</th>
                    <td :colspan="3">{{baseInfo.buildArea}}</td>
                </tr>

                <tr>
                    <th>标准名称</th>
                    <td :colspan="3">{{baseInfo.structuralStyle}}</td>
                </tr>

                <tr>
                    <th>发布时间</th>
                    <td>{{baseInfo.committee}}</td>
                    <th>实施时间</th>
                    <td>{{baseInfo.oldFriendsConuncil}}</td>
                </tr>
                <tr>
                    <th>第一起草单位</th>
                    <td>{{baseInfo.households}}</td>
                    <th></th>
                    <td></td>
                </tr>

                <tr>
                    <th>完成人</th>
                    <td :colspan="3"></td>
                </tr>
            </table>
    </div>

</template>
<script>

import ecoFileUploadChunk from '@/components/file/ecoFileUploadChunk.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {} from '../../service/service.js'


  export default {
      components: {
          ecoContent,
          ecoFileUploadChunk
      },
      data() {
          return {
              baseInfo: {
                    code: null,
                    name: null,
                    address: null,
                    flagDate: null,
                    parcelNumber: null,
                    totalLandArea: null,
                    totalBuildArea: null,
                    owner: null,
                    preliminaryInvestigation: null,
                    landAcquisitionCost: null,
                    planDocumentNumber: null,
                    landAcquaintanceName: null,
                    houseAnnouncementNumber: null,
                    expropriatedNumber: null,
                    houseDecisionNumber: null,
                    landWinner: null,
                    landPrice: null,
                    houseExpropriatedArea: null,
                    propertyExchangeArea: null
                },

                fileMap: {
                    PRO_CONCEPT: [],
                    PRO_CONFIG: [],
                    PRO_CPV: [],
                    PRO_PLAN: []
                }

          }
      },

      created() {
          this.getOldCommunityView(this.$route.params.id)
      },

      mounted() {
      },
      methods: {
          getOldCommunityView(id) {
              getOldCommunityView(id).then(res => {
                  this.baseInfo = res.data
              })
          }
      }
  }
</script>

<style scoped>

.proBaseInfo{
    padding:0px 20px 20px 20px;
    background-color:#fff;
}

.proBaseInfo .toolbar{
    width:900px;
    margin:auto;
    margin-top: 10px;
}

.proBaseInfo .mainTable{
    width:900px;
    margin:auto;
    margin-top:10px;
}

.proBaseInfo .mainTable th,.proBaseInfo .mainTable td{
    border:1px solid red;
    font-size: 14px;
    padding:10px;
}

.proBaseInfo .mainTable th{
    background: rgb(250,250,250);
    padding-left: 15px;
    width: 130px;
    border: 1px solid #e7e7e7;
    color: rgb(103,106,108)!important;
    position: relative;
}

.proBaseInfo .mainTable td{
    width:200px;
    background: #fff;
    padding-left: 15px;
    border: 1px solid #e7e7e7;
    word-break: break-all;
    color: #666;
}


.proBaseInfo .viewAttachments  .fileItem{
    color: #606266;
    margin-left:0px;
    line-height: 20px;
    margin-bottom:5px;
    margin-top:5px;
    font-size: 14px;
}

.proBaseInfo .viewAttachments .fileItem .download{
    margin-right:5px;
    cursor: pointer;
    color:#3891eb;
}

.proBaseInfo .viewAttachments .fileItem .preview{
    margin-left:5px;
    cursor: pointer;
    color:#3891eb;
}

.proBaseInfo .viewAttachments .fileItem .recovery{
    margin-left:5px;
    cursor: pointer;
    color:#e03a3a
}

.proBaseInfo .viewAttachments .fileItem .imgType{
    width:16px;
    height:16px;
}
.proBaseInfo /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #409EFF;
    border-color: #409EFF;
}
.proBaseInfo /deep/ .el-checkbox__input.is-disabled+span.el-checkbox__label{
    color:#606266;
}
.proBaseInfo /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after{
    border-color:#fff;
}


</style>
