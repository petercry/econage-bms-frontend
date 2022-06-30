<template>
      <eco-content top="50px" bottom="0px" v-loading="loading">
        <eco-content top="0px" bottom="60px" class="meetingAdd" >
                <el-form ref="form" :model="baseInfo" label-width="170px" label-position="right" style="margin-top:10px;" size="small" class="meetingAddForm">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="部门" prop="code">
                                <el-input v-model="baseInfo.code" style="cursor:pointer">
                                     <i slot="suffix" class="el-input__icon el-icon-circle-close" style="cursor:pointer" @click="clearRoomName('code')"></i>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="制定人" prop="name">
                                <el-input v-model="baseInfo.name" style="cursor:pointer">
                                     <i slot="suffix" class="el-input__icon el-icon-circle-close" style="cursor:pointer" @click="clearRoomName('name')"></i>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="电话" prop="address">
                                <el-input v-model="baseInfo.address" style="cursor:pointer">
                                     <i slot="suffix" class="el-input__icon el-icon-circle-close" style="cursor:pointer" @click="clearRoomName('address')"></i>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="邮箱" prop="address">
                                <el-input v-model="baseInfo.address" style="cursor:pointer">
                                     <i slot="suffix" class="el-input__icon el-icon-circle-close" style="cursor:pointer" @click="clearRoomName('address')"></i>
                                </el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="分标委" prop="parcelNumber">
                                <el-input v-model="baseInfo.parcelNumber" style="cursor:pointer">
                                     <i slot="suffix" class="el-input__icon el-icon-circle-close" style="cursor:pointer" @click="clearRoomName('parcelNumber')"></i>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否推荐">
                                <el-select v-model="baseInfo.landApproval" style="cursor:pointer;width: 100%">
                                    <el-option label="是" value="true"></el-option>
                                    <el-option label="否" value="false"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="标准分类" prop="totalBuildArea">
                                <el-input v-model="baseInfo.totalBuildArea" type="number" style="cursor:pointer">
                                     <i slot="suffix" class="el-input__icon el-icon-circle-close" style="cursor:pointer" @click="clearRoomName('totalBuildArea')"></i>
                                </el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="标准类型" prop="owner">
                                <el-input v-model="baseInfo.owner" style="cursor:pointer">
                                     <i slot="suffix" class="el-input__icon el-icon-circle-close" style="cursor:pointer" @click="clearRoomName('owner')"></i>
                                </el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="24">
                            <el-form-item label="标准号" prop="preliminaryInvestigation">
                                <el-input v-model="baseInfo.preliminaryInvestigation" style="cursor:pointer">
                                     <i slot="suffix" class="el-input__icon el-icon-circle-close" style="cursor:pointer" @click="clearRoomName('preliminaryInvestigation')"></i>
                                </el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="24">
                            <el-form-item label="标准名称" prop="landAcquaintanceName">
                                <el-input v-model="baseInfo.landAcquaintanceName" style="cursor:pointer" type="text">
                                     <i slot="suffix" class="el-input__icon el-icon-circle-close" style="cursor:pointer" @click="clearRoomName('landAcquaintanceName')"></i>
                                </el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="发布时间" prop="flagDate">
                                    <el-date-picker
                                        style="width:100%"
                                        v-model="baseInfo.flagDate"
                                        type="datetime"
                                        placeholder="选择开始时间"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd HH:mm"
                                    >
                                    </el-date-picker>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="实施时间" prop="flagDate">
                                    <el-date-picker
                                        style="width:100%"
                                        v-model="baseInfo.flagDate"
                                        type="datetime"
                                        placeholder="选择开始时间"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd HH:mm"
                                    >
                                    </el-date-picker>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="第一起草单位">
                                <el-input v-model="baseInfo.houseDecisionNumber" style="cursor:pointer">
                                     <i slot="suffix" class="el-input__icon el-icon-circle-close" style="cursor:pointer" @click="clearRoomName('houseDecisionNumber')"></i>
                                </el-input>
                            </el-form-item>
                        </el-col>
                         <el-col :span="24">
                            <el-form-item label="完成人" prop="landWinner">
                                <el-input v-model="baseInfo.landWinner" type="textarea">
                                     <i slot="suffix" class="el-input__icon el-icon-circle-close" style="cursor:pointer" @click="clearRoomName('landWinner')"></i>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--<el-form-item label="会议附件" style="width:98%">
                        <ecoFileUploadChunk
                        style="max-width:500px"
                        :modular="modular"
                        :modularInnerId="modularInnerId"
                        ref="ecoFileUploadRef"
                        :btnFlag=true
                        ></ecoFileUploadChunk>
                    </el-form-item> -->

                </el-form>

            </eco-content>

            <eco-content bottom="0px" height="60px" type="tool" style="background-color:#fff;">
                <el-row style="padding:12px 10px;">
                        <el-col :span="24" style="text-align:right">
                            <el-button @click="cancelFunc">返回</el-button>
                            <el-button type="primary" @click="saveCase">保存</el-button>
                    </el-col>
                </el-row>
            </eco-content>
      </eco-content>

</template>
<script>

  import {Loading } from 'element-ui';
  import ecoContent from '@/components/pageAb/ecoContent.vue'
  import {EcoMessageBox} from '@/components/messageBox/main.js'
  import {EcoUtil} from '@/components/util/main.js'
  import tagSelect from '@/components/orgPick/tagSelect.vue'
  import ecoFileUploadChunk from '@/components/file/ecoFileUploadChunk.vue'
//   import {sysEnv} from '../../config/env.js'
  import {} from '../../service/service.js'

  export default {
      components: {
          ecoContent,
          tagSelect,
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
            modular: 'MEETING',
            modularInnerId: '',
            loading: false
          }
      },

      created() {
          this.listAction();
      },
      mounted() {

      },
      computed: {

      },
      methods: {
        saveCase() {
            addOldCity(this.baseInfo).then(res => {
                this.$message.success('保存成功')
                let doObj = {}
                doObj.action = 'oldCityAdd';
                doObj.data = []
                doObj.close = true;
                EcoUtil.getSysvm().callBackDialogFunc(doObj);
            })
        },
        listAction() {
            let callBackDialogFunc = function (obj) {
                if (obj && obj.action == 'roomAvaiableSelectCB') {
                        window.meetingAddVm.selectMeetingRoomCallBack(obj.data);
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'meetingAddVm');
        },
        clearRoomName(e) {
            this.baseInfo[e] = null
        },
        cancelFunc() {
            EcoUtil.getSysvm().closeDialog();
        }
      }

  }

</script>

<style scoped>
.meetingAdd{
    padding:20px;
    background-color:#fff;
}


.meetingAdd .title{
    font-size: 14px;
    line-height: 32px;
    color: #262626;
    margin-top:15px;
}

.meetingAdd .content{
    margin-top:5px;
    color:#8c8080
}

.meetingAdd .btn{
    text-align: right;
    margin-right:10px;
    margin-top:10px;
}

.meetingAdd .meetingAddForm{
    max-width: 1200px;
    margin:auto;
}

.el-textarea__inner {
    border: 1px solid #dcdfe6 !important;
    border-radius: 4px;
}

.el-input--small {
    border-radius: 4px !important;
}
</style>
