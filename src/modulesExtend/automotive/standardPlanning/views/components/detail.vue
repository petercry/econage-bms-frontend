<template>
  <div class="detail">
    <!-- 弹出框 -->
    <el-form :model="form" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="年度">
            <el-input v-model="form.year" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标准分类">
            <el-input v-model="form.classificationName" readonly></el-input>
            <!-- <el-select v-model="form.classification" placeholder="请选择" style="width:100%">
              <el-option v-for="item in classification" :key="item.id" :label="item.text" :value="item.id">
              </el-option>
            </el-select> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="标准类型">
            <el-input v-model="form.typeName" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="体系码">
            <el-input v-model="form.systemCode" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="标准编号">
            <el-input v-model="form.programNumber" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标准名称">
            <el-input v-model="form.programName" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="12">
          <el-form-item label="定制人">
            <el-input v-model="form.drafterName" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="24">
          <el-form-item label="标准编制目的及内容简介">
            <el-input v-model="form.purposeContent" type="textarea" :rows="2" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="部门">
            <el-input v-model="form.deptName" readonly></el-input>
            <!-- <tag-select style="width:100%" :initDataStr="deptInitDataStr" :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(val)=>selectRoleDept(val,'dept')">
            </tag-select> -->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="科室">
            <el-input v-model="form.officeName" readonly></el-input>
            <!-- <tag-select style="width:100%" :initDataStr="deptInitDataStr_office" :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(val)=>selectRoleDept(val,'office')">
            </tag-select> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="责任人">
            <el-input v-model="form.responsibleUserName" readonly></el-input>
            <!-- <tag-select style="width:100%" :initDataStr="userInitDataStr_responsibleUser" :initOptions="{selectNum:1,selectType:'User'}" @callBack="(val)=>selectRoleUser(val,'responsibleUser')">
            </tag-select> -->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="初稿完成时间">
            <el-input v-model="form.draftTime" readonly></el-input>
            <!-- <el-date-picker style="width:100%" v-model="form.draftTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"> -->
            <!-- </el-date-picker> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="会签完成时间">
            <el-input v-model="form.countersignTime" readonly></el-input>
            <!-- <el-date-picker style="width:100%" v-model="form.countersignTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"> -->
            <!-- </el-date-picker> -->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="复审年度">
            <el-input v-model="form.reviewYear" readonly></el-input>
            <!-- <el-date-picker style="width:100%" v-model="form.reviewYear" type="year" value-format="yyyy" placeholder="选择年度">
            </el-date-picker> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="标准状态标示">
            <el-input v-model="form.statusName" readonly></el-input>
            <!-- <el-select v-model="form.status" placeholder="请选择" style="width:100%">
              <el-option v-for="(item,key,index) in status" :key="index" :label="item" :value="key">
              </el-option>
            </el-select> -->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分标委">
            <el-input v-model="form.subcommitteeName" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="规划来源">
            <el-input v-model="form.programSourceName" readonly></el-input>
            <!-- <el-select v-model="form.programSource" placeholder="请选择" style="width:100%">
              <el-option v-for="item in programSource" :key="item.id" :label="item.text" :value="item.id">
              </el-option>
            </el-select> -->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="来源编号">
            <el-tag type="info" v-for="(item, index) in form.sourceNumberList" :key="index" style="margin-right: 10px;cursor: pointer;" @click="goDetail(item.id,'viewCase')">{{item.code}}</el-tag>
            <!-- <el-tag type="info">标签三</el-tag> -->
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="12">
          <el-form-item label="五化领域">
            <el-select v-model="form.fiveAspectsFieldList" multiple style="width:100%" disabled>
              <el-option v-for="item in fiveAspectsFieldList" :key="item.id" :label="item.text" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="应用领域">
            <el-select v-model="form.applicationFieldList" multiple style="width:100%" disabled>
              <el-option v-for="item in applicationFieldList" :key="item.id" :label="item.text" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row> -->
      <!-- <el-row>
        <el-col :span="12">
          <el-form-item label="适用项目">
            <el-select v-model="form.applicableProjectList" multiple style="width:100%" disabled>
              <el-option v-for="item in applicableProjectList" :key="item.id" :label="item.text" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="应用车型">
            <el-select v-model="form.applicationCarTypeList" multiple style="width:100%" disabled>
              <el-option v-for="item in applicationCarTypeList" :key="item.id" :label="item.text" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input v-model="form.remarks" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-form-item>
        <div class="btn">
          <el-button type="primary" @click="confirmHandle">立项</el-button>
          <el-button @click="openDia">复审</el-button>
        </div>
      </el-form-item> -->
      <el-form-item>
        <div class="btn">
          <el-button v-show="readStartup" type="primary" @click="confirmHandle">立项</el-button>
          <el-button v-show="readReview" type="primary" @click="openDia">复审</el-button>
          <el-button  v-show="btnStatus" type="primary" @click="confirmHandle">同 意</el-button>
          <el-button  v-show="btnStatus" @click="openDia">驳回</el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-dialog title="审批意见" :visible.sync="dialogVisible" width="30%">
      <el-input v-model="approvalcom" type="textarea" :rows="3"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="reject">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { EcoUtil } from "@/components/util/main.js";
import { sysEnv } from "@/modulesExtend/automotive/standardPlanning/config/env";
import {
  getEnumSelectEnabled,
  getStatus,
  getOnceInfo,
  getEnabList,
  getStandardTypeList,
  systemCodeList,
  rejectmAjax
} from "../../service/service.js";
import tagSelect from "@/components/orgPick/tagSelect.vue";
export default {
  components: {
    tagSelect,
  },
  data() {
    return {
      form: {},
      id:"",
      classification: [], //标准分类
      status: {}, //标准状态标示
      programSource: [], //规划来源
      fiveAspectsFieldList: [], //五化领域
      applicationFieldList: [], //应用领域
      applicableProjectList: [], //适用项目
      applicationCarTypeList: [], //应用车型
      deptInitDataStr: "", //部门初始化
      deptInitDataStr_office: "", //科室初始化
      userInitDataStr_drafter: "", //定制人初始化
      userInitDataStr_responsibleUser: "", //责任人初始化
      questions: [],
      problemNo:'',
      dialogVisible: false,
      approvalcom: '', //审批意见
      btnStatus: false,
      readReview: false, //复审
      readStartup: false //立项
    };
  },
  created() {
    this.readReview = this.$route.query.readReview
    this.readStartup = this.$route.query.readStartup
    this.id = this.$route.params.id;
    this.getBaseInfo();
    this.getInfo()
  },
  methods: {
    // 获取数据
    getInfo() {
      getOnceInfo(this.id).then((res) => {
        this.form = res.data.data
        //判断是否显示同意驳回按钮
        if(this.form.phaseId == 'SPECIFIC_DEPT_SECTION_CHIEF_VERIFY' || this.form.phaseId == 'SPECIFIC_DEPT_MINISTER_VERIFY'
        || this.form.phaseId == 'SUBCOMMITTEE_VERIFY' || this.form.phaseId == 'STD_REGULATIONS_ROOM_SECTION_CHIEF_VERIFY'
        || this.form.phaseId == 'TECH_INNOVATION_DEPT_MINISTER_VERIFY' || this.form.phaseId == 'ORG_SYSTEM_ROOM_SECTION_CHIEF_VERIFY'
        || this.form.phaseId == 'BUSINESS_PLAN_DEPT_MINISTER_VERIFY' || this.form.phaseId == 'TECH_INNOVATION_DEPT_MINISTER_SECOND_VERIFY'
        || this.form.phaseId == 'CENTER_STD_SUBCOMMITTEE_VERIFY'
        ) {
          this.btnStatus = true
        }
        if (!isNaN(this.form.systemCode)){
          systemCodeList(this.form.systemCode).then(res => {
              this.form.systemCode = res.data.name
          })
        }
        getEnabList(this.form.classification).then((res) => {
          this.form.typeName = res.data.find(x => x.id == this.form.type) ? res.data.find(x => x.id == this.form.type).text : this.form.type
          // this.form.typeName = this.form.typeName ? this.form.typeName.text : this.form.type
        });
      })
    },
    //同意
    confirmHandle() {
        var list = []
        list.push(this.form.id)
        if (sysEnv !== 1) {
          this.$router.push({name: "selectDeptList",params: { ids: list.toString(), status: this.form.phaseId },});
        } else {
          let _url = "/standardPlanning/index.html#/selectDeptList/" + list.toString() + '/' + this.form.phaseId;
          EcoUtil.getSysvm().openDialog("部门信息",_url,"800","700","8hv");
        }
    },
    openDia() {
      this.dialogVisible = true
    },
    // 退回
    reject() {
      if (this.approvalcom == "") {
        this.$message({
          message: "请填写审批意见",
          type: "warning",
        });
      } else {
        let delArr = [];
        delArr.push(this.form.id);
        rejectmAjax(this.form.phaseId, delArr, this.approvalcom).then((res) => {
          if (res.data.success) {
            this.$message({
              message: "退回成功",
              type: "success",
            });
          }
          this.dialogVisible = false;
          let doObj = {};
          doObj.action = "addStandard";
          doObj.close = true;
          EcoUtil.getSysvm().callBackDialogFunc(doObj);
        });
      }
    },
    // 获取基础数据
    getBaseInfo() {
      // getEnumSelectEnabled("esProgramClass").then((res) => {
      //   this.classification = res.data;
      // });
      getStandardTypeList().then(res => {
        this.classification = res.data;
      })
      getEnumSelectEnabled("esProgramSource").then((res) => {
        this.programSource = res.data;
      });
      getEnumSelectEnabled("esProgramFive").then((res) => {
        this.fiveAspectsFieldList = res.data;
      });
      getEnumSelectEnabled("esProgramAppField").then((res) => {
        this.applicationFieldList = res.data;
      });
      getEnumSelectEnabled("esProgramAppProject").then((res) => {
        this.applicableProjectList = res.data;
      });
      getEnumSelectEnabled("esProgramAppCarType").then((res) => {
        this.applicationCarTypeList = res.data;
      });
      getStatus().then((res) => {
        this.status = res.data.data;
      });
    },
    goDetail(val,type) {
     if (sysEnv !== 1) {
        this.$router.push({
          name: "questionDetails",
          params: { id: val, caseType: "viewCase" },
        });
      } else {
        let _width = "800";
        let _height = "600";
        let url;
        let dialogTitle;
        if (type === "viewCase") {
          url =
            "/standardPlanning/index.html#/questionDetails/" +
            val +
            "/viewCase";
          dialogTitle = "查看";
          _height = "500";
        }
        EcoUtil.getSysvm().openDialog(
          dialogTitle,
          url,
          _width,
          _height,
          "15vh"
        );
      }
    },
  },
};
</script>
<style scoped>
.detail {
  margin: 10px 20px;
}
.btn {
  text-align: right;
  margin: 20px 10px;
}
</style>
