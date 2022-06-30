<template>
 <div class="followResult">
    <el-form
      :inline="true"
      :model="addForm"
      ref="addForm"
      class="addForm"
      label-width="120px"
    >
     <el-form-item label="跟进状态及结果">
        <el-cascader
          clearable
          style="width:100%"
          v-model="followStatusAndResult"
          :options="statusOptions"
          @change="handleFollowChange"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="下次跟进时间">
        <el-date-picker
          style="width:100%"
          v-model="addForm.followNextDate"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
 </div>
</template>

<script>
import {updateFollowResult,getSingleTalentInfo} from "@/modules/bmsTalentPool/service/service.js"
export default {
 name: 'followResult',
 data () {
 return {
   followStatusAndResult:[],
   addForm:{
     id:'',
     followStatus:'',
     followResult:'',
     followNextDate:''
   },
    statusOptions:
        [{
          value: '待定是否录用',
          label: '待定是否录用',
        },
        {
          value: '已约面试/复试',
          label: '已约面试/复试',
          children: [{
            value: '已约面试',
            label: '已约面试',
          },
          {
            value: '已约复试',
            label: '已约复试',
          },
          ]
        },
        {
          value: '需要跟进',
          label: '需要跟进',
          children: [{value: '可约初试（第一轮面）',label: '可约初试（第一轮面）',},
          {value: '可约复试（第二轮面）',label: '可约复试（第二轮面）'},
          {value: '可约复试（第三轮面）',label: '可约复试（第三轮面）'},
          {value: '人事部跟进',label: '人事部跟进'},
          {value: '业务部门跟进',label: '业务部门跟进'},
          {value: '长期跟进',label: '长期跟进'},
          {value: '应聘者考虑中',label: '应聘者考虑中'},
          {value: '电话无人接听',label: '电话无人接听'},
          {value: '已第一轮面试',label: '已第一轮面试'},
          {value: '已第二轮面试',label: '已第二轮面试'},
          {value: '已第三轮面试',label: '已第三轮面试'},
          ]
        },
        {
          value: '未面试即结束',
          label: '未面试即结束',
          children: [{value: '电话始终无人接听（联系六次以上）',label: '电话始终无人接听（联系六次以上）',},
          {value: '电话中判断不合格',label: '电话中判断不合格'},
          {value: '双方感觉不合格',label: '双方感觉不合格'},
          {value: '应聘者拒绝（不考虑换单位）',label: '应聘者拒绝（不考虑换单位）'},
          ]
        },
        {
          value: '面试至第一轮结束',
          label: '面试至第一轮结束',
          children: [{value: '能力够，公司综合考虑不录用',label: '能力够，公司综合考虑不录用',},
          {value: '双方感觉不合适',label: '双方感觉不合适'},
          {value: '不符合我司用人要求',label: '不符合我司用人要求'},
          ]
        },
        {
          value: '面试到第二轮结束',
          label: '面试到第二轮结束',
          children: [{value: '能力够，公司综合考虑不录用',label: '能力够，公司综合考虑不录用',},
          {value: '双方感觉不合适',label: '双方感觉不合适'},
          {value: '应聘者拒绝（薪资未谈妥）',label: '应聘者拒绝（薪资未谈妥）'},
          {value: '应聘者拒绝（不接受公司社保等福利制度）',label: '应聘者拒绝（不接受公司社保等福利制度）'},
          {value: '不符合我司用人要求（第二轮面被否）',label: '不符合我司用人要求（第二轮面被否）'},
          ]
        },
        {
          value: '面试到第三轮结束',
          label: '面试到第三轮结束',
          children: [{value: '能力够，公司综合考虑不录用',label: '能力够，公司综合考虑不录用',},
          {value: '双方感觉不合适',label: '双方感觉不合适'},
          {value: '应聘者拒绝（薪资未谈妥）',label: '应聘者拒绝（薪资未谈妥）'},
          {value: '应聘者拒绝（不接受公司社保等福利制度）',label: '应聘者拒绝（不接受公司社保等福利制度）'},
          {value: '不符合我司用人要求（第三轮面被否）',label: '不符合我司用人要求（第三轮面被否）'},
          ]
        },
        {
          value: '可录用',
          label: '可录用',
          children: [{value: '人事部背调等手续中',label: '人事部背调等手续中',},
          {value: '应聘者原单位办理中',label: '应聘者原单位办理中'},
          ]
        },
        {
          value: '已入职',
          label: '已入职',
        },
        {
          value: '其他',
          label: '其他',
        },

        ],
 }
 },
 created(){
 },
 methods: {
    async getTaInfo(id){
     const res = await getSingleTalentInfo(id)
     this.followStatusAndResult=[]
     const {followResult,followNextDate} =res.data
     this.addForm.followNextDate=followNextDate
     this.followStatusAndResult=followResult.split('/')
    //  this.addForm.followStatus=followStatus
    //  this.addForm.followResult=followResult
    //  this.followStatusAndResult.push(followStatus)
    //  this.followStatusAndResult.push(followResult)
    },
    handleFollowChange(val) {
      if(val.length==2){
        this.addForm.followStatus=val[0]
        this.addForm.followResult=val[1]
      }else if(val.length==1){
        this.addForm.followStatus=val[0]
      }
    },
    setTaId(id) {
      this.addForm.id = id
      this.getTaInfo(id)
    },
    async saveData(){
      const res=await updateFollowResult(this.addForm)
     if(res){
        this.$message.success('更新成功')
      }
      this.$parent.$parent.dialogVisible = false;
      this.$parent.$parent.$parent.$parent.getTaList()
      this.$parent.$parent.getTaInfo(this.addForm.id)
      },
    cleanInfo(){
      this.followStatusAndResult=[]
    }
 },
}
</script>

<style scoped>
.followResult{

}
</style>
