<template>
  <div class="layoutOutDiv confirm">
    <div class="layoutInnerAbsoluteDiv">
      <eco-content top="0px" height="55px" type="tool" style="border-bottom:1px solid #ddd;background-color:#fff;">
        <el-row style="padding:12px 20px;background-color:#fff;">
          <el-col :span="12">
            <eco-tool-title style="font-weight: 700;line-height: 30px;" :title="'标准规划管理'"></eco-tool-title>
          </el-col>
          <el-col :span="12">
            <div style="float:right;margin-right: 20px;line-height: 30px;">
              <el-select v-model="tableSelect">
                <el-option v-for="item in currentSelectList" :key="item.label" :label="item.label" :value="item.label">
                </el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content top="70px" bottom="0px" type="tool" style="background-color:#fff;">
        <standard class="standard" v-if="tableSelect == '科技创新部编制发起'"></standard>
        <deptConfirmation class="deptConfirmation" v-if="tableSelect == '部门联络员校对'"></deptConfirmation>
        <officeConfim class="officeConfim" v-if="tableSelect == '业务科室联络员指定责任人'"></officeConfim>
        <personConfirm class="personConfirm" v-if="tableSelect == '责任人办理'"></personConfirm>
        <chiefReview class="chiefReview" v-if="tableSelect == '业务部门科长审核'"></chiefReview>
        <deptLiaison class="deptLiaison" v-if="tableSelect == '部门联络员审核'"></deptLiaison>
        <stdReviewer class="stdReviewer" v-if="tableSelect == '标准审查人员审核'"></stdReviewer>
        <specificDeptMinister class="stdReviewer" v-if="tableSelect == '业务部门部长审核'"></specificDeptMinister>
        <subcommitteeVerify class="stdReviewer" v-if="tableSelect == '分标委审核'"></subcommitteeVerify>
        <techInnovationDeptInitiate class="stdReviewer" v-if="tableSelect == '科技创新部发起'"></techInnovationDeptInitiate>
        <businessPlanDeptInitate class="stdReviewer" v-if="tableSelect == '事业计划部发起'"></businessPlanDeptInitate>
        <stdRegRoomSectionChiefVerify class="stdReviewer" v-if="tableSelect == '标准法规室科长审核'"></stdRegRoomSectionChiefVerify>
        <techInnovationDeptMinisterVerify class="stdReviewer" v-if="tableSelect == '科技创新部部长审核'"></techInnovationDeptMinisterVerify>
        <orgSystemRoomSectionChiefverify class="stdReviewer" v-if="tableSelect == '组织体系室科长审核'"></orgSystemRoomSectionChiefverify>
        <businessPlanDeptMinister class="stdReviewer" v-if="tableSelect == '事业计划部部长审核'"></businessPlanDeptMinister>
        <stdRegRoomSectionChiefInitate class="stdReviewer" v-if="tableSelect == '标准法规室科长发起'"></stdRegRoomSectionChiefInitate>
        <techInnovationDeptSecond class="stdReviewer" v-if="tableSelect == '科技创新部部长二次审核'"></techInnovationDeptSecond>
        <centerStdSubcommittee class="stdReviewer" v-if="tableSelect == '中心标委会议长审核'"></centerStdSubcommittee>
      </eco-content>
    </div>
  </div>
</template>
<script>
import ecoContent from "@/components/pageAb/ecoContent.vue";
import ecoToolTitle from "@/components/tool/ecoToolTitle.vue";
import standard from "@/modulesExtend/automotive/standardPlanning/views/confirm/standard.vue";
import deptConfirmation from "@/modulesExtend/automotive/standardPlanning/views/confirm/deptConfirmation.vue";
import officeConfim from "@/modulesExtend/automotive/standardPlanning/views/confirm/officeConfim.vue";
import personConfirm from "@/modulesExtend/automotive/standardPlanning/views/confirm/personConfirm.vue";
import chiefReview from "@/modulesExtend/automotive/standardPlanning/views/confirm/chiefReview.vue";
import deptLiaison from "@/modulesExtend/automotive/standardPlanning/views/confirm/deptLiaison.vue";
import stdReviewer from "@/modulesExtend/automotive/standardPlanning/views/confirm/stdReviewer.vue";
import specificDeptMinister from "@/modulesExtend/automotive/standardPlanning/views/confirm/specificDeptMinister.vue";
import subcommitteeVerify from "@/modulesExtend/automotive/standardPlanning/views/confirm/subcommitteeVerify.vue";
import techInnovationDeptInitiate from "@/modulesExtend/automotive/standardPlanning/views/confirm/techInnovationDeptInitiate.vue";
import businessPlanDeptInitate from "@/modulesExtend/automotive/standardPlanning/views/confirm/businessPlanDeptInitate.vue";
import stdRegRoomSectionChiefVerify from "@/modulesExtend/automotive/standardPlanning/views/confirm/stdRegRoomSectionChiefVerify.vue";
import techInnovationDeptMinisterVerify from "@/modulesExtend/automotive/standardPlanning/views/confirm/techInnovationDeptMinisterVerify.vue";
import orgSystemRoomSectionChiefverify from "@/modulesExtend/automotive/standardPlanning/views/confirm/orgSystemRoomSectionChiefverify.vue";
import businessPlanDeptMinister from "@/modulesExtend/automotive/standardPlanning/views/confirm/businessPlanDeptMinister.vue";
import stdRegRoomSectionChiefInitate from "@/modulesExtend/automotive/standardPlanning/views/confirm/stdRegRoomSectionChiefInitate.vue";
import techInnovationDeptSecond from "@/modulesExtend/automotive/standardPlanning/views/confirm/techInnovationDeptSecond.vue";
import centerStdSubcommittee from "@/modulesExtend/automotive/standardPlanning/views/confirm/centerStdSubcommittee.vue";
import { currentUserStateList } from "../service/service.js"


export default {
  data() {
    return {
       options: [{
          value: '选项1',
          label: '标准规划维护'
        }, {
          value: '选项2',
          label: '部门联络员确认'
        }, {
          value: '选项3',
          label: '科室联络员确认'
        }, {
          value: '选项4',
          label: '责任人确认'
        }, {
          value: '选项5',
          label: '科长审核'
        }, {
          value: '选项6',
          label: '部门联络员审核1'
        }, {
          value: '选项7',
          label: '标准审查人员审核2'
        }, {
          value: '选项8',
          label: '业务部门部长审核3'
        }, {
          value: '选项9',
          label: '分标委审核4'
        }, {
          value: '选项10',
          label: '科技创新部发起5'
        }, {
          value: '选项11',
          label: '事业计划部发起6'
        }, {
          value: '选项12',
          label: '标准法规室科长审核7'
        }, {
          value: '选项13',
          label: '科技创新部部长审核8'
        }, {
          value: '选项14',
          label: '组织体系室科长审核9'
        }, {
          value: '选项15',
          label: '事业计划部部长审核10'
        }, {
          value: '选项16',
          label: '标准法规室科长发起11'
        }, {
          value: '选项17',
          label: '科技创新部部长二次审核12'
        }, {
          value: '选项18',
          label: '中心标委会议长审核13'
        }
        ],
      // 报表选择
      tableSelect:null,
      currentSelectList: []
    };
  },
  components: {
    ecoContent,
    ecoToolTitle,
    standard,
    deptConfirmation,
    officeConfim,
    personConfirm,
    chiefReview,
    deptLiaison,
    stdReviewer,
    specificDeptMinister,
    subcommitteeVerify,
    techInnovationDeptInitiate,
    businessPlanDeptInitate,
    stdRegRoomSectionChiefVerify,
    techInnovationDeptMinisterVerify,
    orgSystemRoomSectionChiefverify,
    businessPlanDeptMinister,
    stdRegRoomSectionChiefInitate,
    techInnovationDeptSecond,
    centerStdSubcommittee
  },
  created() {
    //  var a = {
    //   i: 1,
    //   valueOf: function() {
    //     if(this.i === 1) {
    //       this.i++;
    //       return 1;
    //     } else {
    //       return 12
    //     }
    //   }
    // }
    // console.log(a)
    // if (a == 1 && a == 12) {
    //   console.log('true')
    // }
    currentUserStateList().then(res => {
      if(res.data.data['TECH_INNOVATION_DEPT_CREATE']) {
        this.currentSelectList.push({label:res.data.data.TECH_INNOVATION_DEPT_CREATE})
      }
      if(res.data.data['DEPT_LIAISON_PROOF']) {
        this.currentSelectList.push({label:res.data.data.DEPT_LIAISON_PROOF})
      }
      if(res.data.data['OFFICE_LIAISON_CHOOSE']) {
        this.currentSelectList.push({label:res.data.data.OFFICE_LIAISON_CHOOSE})
      }
      if(res.data.data['RESPONSIBLE_HANDLE']) {
        this.currentSelectList.push({label:res.data.data.RESPONSIBLE_HANDLE})
      }
      if(res.data.data['SPECIFIC_DEPT_SECTION_CHIEF_VERIFY']) {
        this.currentSelectList.push({label:res.data.data.SPECIFIC_DEPT_SECTION_CHIEF_VERIFY})
      }
      if(res.data.data['DEPT_LIAISON_VERIFY']) {
        this.currentSelectList.push({label:res.data.data.DEPT_LIAISON_VERIFY})
      }
      if(res.data.data['STD_REVIEWER_VERIFY']) {
        this.currentSelectList.push({label:res.data.data.STD_REVIEWER_VERIFY})
      }
      if(res.data.data['SPECIFIC_DEPT_MINISTER_VERIFY']) {
        this.currentSelectList.push({label:res.data.data.SPECIFIC_DEPT_MINISTER_VERIFY})
      }
      if(res.data.data['SUBCOMMITTEE_VERIFY']) {
        this.currentSelectList.push({label:res.data.data.SUBCOMMITTEE_VERIFY})
      }
      if(res.data.data['TECH_INNOVATION_DEPT_INITIATE']) {
        this.currentSelectList.push({label:res.data.data.TECH_INNOVATION_DEPT_INITIATE})
      }
      if(res.data.data['BUSINESS_PLAN_DEPT_INITIATE']) {
        this.currentSelectList.push({label:res.data.data.BUSINESS_PLAN_DEPT_INITIATE})
      }
      if(res.data.data['STD_REGULATIONS_ROOM_SECTION_CHIEF_VERIFY']) {
        this.currentSelectList.push({label:res.data.data.STD_REGULATIONS_ROOM_SECTION_CHIEF_VERIFY})
      }
      if(res.data.data['TECH_INNOVATION_DEPT_MINISTER_VERIFY']) {
        this.currentSelectList.push({label:res.data.data.TECH_INNOVATION_DEPT_MINISTER_VERIFY})
      }
      if(res.data.data['ORG_SYSTEM_ROOM_SECTION_CHIEF_VERIFY']) {
        this.currentSelectList.push({label:res.data.data.ORG_SYSTEM_ROOM_SECTION_CHIEF_VERIFY})
      }
      if(res.data.data['BUSINESS_PLAN_DEPT_MINISTER_VERIFY']) {
        this.currentSelectList.push({label:res.data.data.BUSINESS_PLAN_DEPT_MINISTER_VERIFY})
      }
      if(res.data.data['STD_REGULATIONS_ROOM_SECTION_CHIEF_INITIATE']) {
        this.currentSelectList.push({label:res.data.data.STD_REGULATIONS_ROOM_SECTION_CHIEF_INITIATE})
      }
      if(res.data.data['TECH_INNOVATION_DEPT_MINISTER_SECOND_VERIFY']) {
        this.currentSelectList.push({label:res.data.data.TECH_INNOVATION_DEPT_MINISTER_SECOND_VERIFY})
      }
      if(res.data.data['CENTER_STD_SUBCOMMITTEE_VERIFY']) {
        this.currentSelectList.push({label:res.data.data.CENTER_STD_SUBCOMMITTEE_VERIFY})
      }
      if (this.$route.query.tableSelect) {
        var newSelect = null
        newSelect = Object.entries(res.data.data).find(x => x[0] == this.$route.query.tableSelect)
        if (newSelect) {
          this.tableSelect = newSelect[1]
        }
      } else {
        this.tableSelect = this.currentSelectList[0].label
      }
    })
    // console.log(this.$route.query.tableSelect)
  },
  methods: {},
};
</script>
<style scoped>
.standard {
  height: 100%;
}
.deptConfirmation {
  height: 100%;
}
.officeConfim {
  height: 100%;
}
.personConfirm {
  height: 100%;
}
.chiefReview {
  height: 100%;
}
.deptLiaison {
  height: 100%;
}
.table {
  height: 100%;
}
</style>
