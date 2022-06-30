<template>
  <div class="editFollow">
    <el-form
      :inline="true"
      :model="addForm"
      ref="addForm"
      class="addForm"
      label-width="114px"
      :rules="addFormRules"
      v-loading="loading"
    >
      <el-form-item label="跟进类型">
        <el-select
          v-model="addForm.type"
          placeholder="请选择"
          filterable
          @change="handleTypeChange"
        >
          <el-option
            v-for="(item,index) in followTypeOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="跟进时间" prop="date" >
        <el-date-picker
         style="width:166px"
          v-model="addForm.date"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
          placeholder="选择日期时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="跟进方式" prop="followMethod">
        <el-select
          v-model="addForm.followMethod"
          placeholder="请选择"
          filterable
          clearable
        >
          <el-option
            v-for="(item,index) in baseData['FOLLOWWAY'].data"
            :key="index"
            :label="item.text"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="跟进人" prop="followPrincipal">
        <tag-select
          style="vertical-align: top;"
          ref="tagSelect"
          :initDataStr="dutyObj.initDataStr"
          :initOptions="{selectNum:1,selectType:'USER'}"
          @callBack="selectDuty"
        >
        </tag-select>
      </el-form-item>
      <el-form-item label="面试时间" v-if="showRound2||showRound3" prop="roundDate">
        <el-date-picker
          style="width:166px"
          v-model="addForm.roundDate"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm"
          placeholder="选择日期时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="面试人" v-if="showRound2||showRound3" prop="roundInterviewer">
        <tag-select
          style="vertical-align: top;"
          ref="tagSelect"
          :initDataStr="interviewObj.initDataStr"
          :initOptions="{selectNum:1,selectType:'USER'}"
          @callBack="selectInterview"
        >
        </tag-select>
      </el-form-item>
      <el-form-item label="面试方式"  style="width:100%" v-if="showRound2||showRound3" prop="roundMethod">
        <el-select
          v-model="addForm.roundMethod"
          placeholder="请选择"
          filterable
          clearable
        >
          <el-option
            v-for="(item,index) in baseData['INTERVIEWMETHOD'].data"
            :key="index"
            :label="item.text"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-row>
        <el-col>
      <el-form-item
        label="情况描述"
        prop="detail"
      >
        <el-input
          v-model="addForm.detail"
          :autosize="{minRows:4}"
          type="textarea"
          style="width:460px"
        ></el-input>
      </el-form-item>
        </el-col>
      </el-row>
        <el-form-item label="是否入职" v-if="showRound3">
        <el-select
          v-model="addForm.join"
          placeholder="请选择"
          filterable
          clearable
        >
          <el-option
            v-for="(item,index) in joinOptions"
            :key="index"
            :label="item.text"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="入职时间"
        v-if="showRound3"
      >
        <el-date-picker
          v-model="addForm.joinDate"
          type="date"
          placeholder="选择日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="下次跟进时间"  style="width:100%">
        <el-date-picker
          v-model="addForm.followNextDate"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
          placeholder="选择日期时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-row>
        <el-col :span="24">
          <el-form-item label="HR状态">
            <el-cascader style="width: 350px" clearable v-model="addForm.hrStatus" :options="HR" @change="handleFollowChange" :key="is_cascader">
            </el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="BP状态">
            <el-cascader style="width: 350px" clearable v-model="addForm.bpStatus" :options="BP" @change="handleFollowChangeBP" :key="is_cascader_BP">
            </el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
        <!-- <el-form-item label="跟进状态/结果">
        <el-cascader
          style="width:350px"
          clearable
          v-model="followStatusAndResult"
          :options="statusOptions"
          @change="handleFollowChange"
          :key="is_cascader"
        >
        </el-cascader>
      </el-form-item> -->

    </el-form>

  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import tagSelect from '@/components/orgPick/tagSelect.vue'
import {EcoDate} from '@/components/date/main.js'
import { dateFormat } from '@/modules/bmsTalentPool/utils/main.js'
import { updateFollow,getFollowType,getUserSelfInfo,getSingleFollow,getUserInfoByOrgId,getTreeKvListByParentId,getCascaderNode} from '@/modules/bmsTalentPool/service/service.js'
export default {
  name: 'editFollow',
  components: {
    tagSelect
  },
  data() {
    return {
      is_cascader: 0,
      is_cascader_BP: 0,
      HR: [],
      BP: [],
      joinOptions: [
        {
          text: '是',
          id: true
        },{
          text: '否',
          id: false
        }
      ],
      dutyObj: {
        initDataStr: ''
      },
      interviewObj: {
        initDataStr: ''
      },
      // followStatusAndResult:[],
      followTypeOptions: [],
      showRound2: false,
      showRound3: false,
      addForm: {
        id: '',
        infoId: '',
        type: '',
        followMethod: '',
        followPrincipal: '',
        followPrincipalStr: '',
        roundDate: '',
        roundInterviewer: '',
        roundInterviewerStr: '',
        roundMethod: '',
        join: '',
        date: '',
        joinDate: '',
        detail: '',
        hrStatus: '',
        bpStatus: '',
        followNextDate: ''
      },
      addFormRules: {
        date: [
            { required: true, message: '请选择跟进时间', trigger: 'change' }
          ],
        followMethod: [
            { required: true, message: '请选择跟进方式', trigger: 'change' }
        ],
        followPrincipal: [
            { required: true, message: '请选择跟进人', trigger: 'change' }
        ],
        roundInterviewer: [
            { required: true, message: '请选择面试人', trigger: 'change' }
        ],
        roundDate: [
          { required: true, message: '请选择面试时间', trigger: 'change' }
        ],
        roundMethod: [
            { required: true, message: '请选择面试方式', trigger: 'change' }
        ],
        detail: [
          { required: true, message: '请填写情况描述', trigger: 'blur' }
        ]
      },
      loading: true,
      currentTime: ''
    }
  },
  computed: {
    ...mapGetters([
      'baseData',
      'getBaseDataTextByKey'
    ])
  },
  created() {
    this.initProjectBaseData('create-enabled').then(() => {
      this.loading = false;
    });
  },
  mounted() {
  },
  methods: {
    ...mapActions([
      'initProjectBaseData'
    ]),
    cleanInfo() {
        for (const key in this.addForm) {
          this.addForm[key] = '';
        }
    },
    setTaId(id) {
      this.addForm.infoId = id
      this.currentTime = Date.parse(new Date())
      this.getFollowType()
    },
    getFollowId(id) {
      this.addForm.id = id
      // this.getFollowOptions()
      this.getFollowInfo(id)
      this.HR = JSON.parse(sessionStorage.getItem('HR'));
      this.BP = JSON.parse(sessionStorage.getItem('BP'));
    },
    async getFollowInfo(id) {
      this.loading = true
      // this.followStatusAndResult=[]
      const res = await getSingleFollow(id)
      this.loading = false
      this.addForm = res.data
      // this.followStatusAndResult=res.data.followResultList.reverse()
      const {followPrincipal,roundInterviewer,followResult,type} = res.data
      if (type == 'INTERVIEW') {
        this.showRound2 = true
        this.showRound3 = false
      } else if (type == 'RESULT') {
         this.showRound3 = true
         this.showRound2 = false
      } else {
        this.showRound2 = false
        this.showRound3 = false
      }
      this.is_cascader++
      this.tagSelectEcho(this.dutyObj,followPrincipal)
      this.tagSelectEcho(this.interviewObj,roundInterviewer)
    },
    // 选人回显
    tagSelectEcho(echo,id) {
      let obj = {}
      let orgArr = []
      obj.type = 'PERSONNEL'
      if (id) {
        getUserInfoByOrgId(id).then(res=>{
        res.data.departments.forEach(item => {
            orgArr.push(item.id)
        });
        orgArr.push(id)
        obj.orgId = orgArr.join('.')
        obj.linkId = id
        echo.initDataStr = JSON.stringify(obj)
      })
      }
    },
    getFollowType() {
      this.followTypeOptions = []
        getFollowType().then(res=>{
            let typeObj = res.data
            for (const key in typeObj) {
                const labelText = typeObj[key];
                this.followTypeOptions.push({label: labelText,value: key})
              }
        })
    },
    handleFollowChange(val) {
      this.addForm.hrStatus = val[val.length - 1]
    },
    handleFollowChangeBP(val) {
      this.addForm.bpStatus = val[val.length - 1]
    },
    selectDuty(data) {
      if (data.itemArray.length > 0) {
        this.addForm.followPrincipal = data.itemArray[0].linkId;
        this.addForm.followPrincipalStr = data.itemArray[0].name;
      } else {
        this.addForm.followPrincipal = '';
        this.addForm.followPrincipalStr = '';
        this.dutyObj.initDataStr = '';
      }
    },
    // 选择面试人
    selectInterview(data) {
      if (data.itemArray.length > 0) {
        this.addForm.roundInterviewer = data.itemArray[0].linkId;
        this.addForm.roundInterviewerStr = data.itemArray[0].name;
      } else {
        this.addForm.roundInterviewer = '';
        this.addForm.roundInterviewerStr = '';
        this.interviewObj.initDataStr = '';
      }
    },
    // 跟进类型
    handleTypeChange(val) {
      // let text=this.getBaseDataTextByKey(val,'FOLLOWTYPE')
      if (val == 'RESULT') {
         this.showRound3 = true
         this.showRound2 = false
      } else if (val == 'INTERVIEW') {
        this.showRound2 = true
        this.showRound3 = false
      } else {
        this.showRound3 = false
        this.showRound2 = false
      }
    },
    saveData() {
      // 校验跟进时间
      let followNextDate = Date.parse(this.addForm.followNextDate);
      if (this.currentTime > followNextDate) {
        this.$message.error('下次跟进时间应晚于当前时间')
        return
      }

      // 清空tab数据
      if (this.addForm.type == 'INTERVIEW') {
        this.addForm.join = ''
        this.addForm.joinDate = ''
      } else if (this.addForm.type == 'CONVENTIONAL') {
        this.addForm.roundDate = ''
        this.interviewObj.initDataStr = ''
        this.addForm.roundInterviewer = ''
        this.addForm.roundInterviewerStr = ''
        this.addForm.roundMethod = ''
        this.addForm.join = ''
        this.addForm.joinDate = ''
      }
      // else if(this.addForm.type='RESULT'){
      //   this.addForm.roundDate=''
      //   this.dutyObj.initDataStr=''
      //   this.addForm.roundInterviewer=''
      //   this.addForm.roundInterviewerStr=''
      //   this.addForm.roundMethod=''
      // }
      this.$refs['addForm'].validate( async (valid) => {
          if (valid) {
            const res = await updateFollow(this.addForm)
            if (res.data.id) {
              this.$message.success('更新成功')
              this.$parent.$parent.dialogVisible = false;
              this.$parent.$parent.focusPanelName = 'eventInfo';
              this.$parent.$parent.getFollowList(this.addForm.infoId)
              this.$parent.$parent.getTaInfo(this.addForm.infoId)
              this.$parent.$parent.$parent.$parent.getTaList()
            }
          } else {
            return false;
          }
      });
    }
  }
}
</script>

<style scoped >
.editFollow {
}
.editFollow .el-form .all-line /deep/ .el-form-item .el-form-item__content {
  width: calc(100% - 120px);
}
</style>
