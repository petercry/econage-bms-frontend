<template>
  <div class="editDetail">
    <!-- 弹出框 -->
    <el-form :model="form" label-width="110px" :rules="rules" ref="form">
      <el-row>
        <el-col :span="12">
          <el-form-item label="年度">
            <el-input v-model="form.year" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标准分类" prop="classification">
            <el-select v-model="form.classification" placeholder="请选择" style="width:100%" disabled>
              <el-option v-for="item in classification" :key="item.id" :label="item.text" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="标准类型" prop="type">
            <el-input v-model="form.type" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="体系码" prop="systemCode">
            <el-input v-model="form.systemCode"  disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>   
        <el-col :span="12">
          <el-form-item label="标准编号" prop="programNumber">
            <el-input v-model="form.programNumber" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标准名称" prop="programName">
            <el-input v-model="form.programName" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="定制人" prop="drafter">
            <tag-select style="width:100%"  disabled :initDataStr="userInitDataStr_drafter" :initOptions="{selectNum:1,selectType:'User'}" @callBack="(val)=>selectRoleUser(val,'drafter')">
            </tag-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="标准编制目的及内容简介" prop="purposeContent">
            <el-input v-model="form.purposeContent" type="textarea" :rows="2" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="部门" prop="dept">
            <tag-select style="width:100%"  disabled :initDataStr="deptInitDataStr" :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(val)=>selectRoleDept(val,'dept')">
            </tag-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="科室" prop="office">
            <tag-select style="width:100%" disabled :initDataStr="deptInitDataStr_office" :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(val)=>selectRoleDept(val,'office')">
            </tag-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="责任人" prop="responsibleUser">
            <tag-select style="width:100%" :initDataStr="userInitDataStr_responsibleUser" :initOptions="{selectNum:1,selectType:'User'}" @callBack="(val)=>selectRoleUser(val,'responsibleUser')">
            </tag-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="初稿完成时间" prop="draftTime">
            <el-date-picker style="width:100%" disabled v-model="form.draftTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="会签完成时间" prop="countersignTime">
            <el-date-picker style="width:100%" disabled v-model="form.countersignTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="复审年度" prop="reviewYear">
            <el-date-picker style="width:100%"  disabled v-model="form.reviewYear" type="year" value-format="yyyy" placeholder="选择年度">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>       
      <el-row>
        <el-col :span="12">
          <el-form-item label="标准状态标示" prop="status">
            <el-select v-model="form.status" placeholder="请选择" style="width:100%" disabled>
              <el-option v-for="(item,key,index) in status" :key="index" :label="item" :value="key">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分标委" prop="subcommittee">
            <el-input v-model="form.subcommittee" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="规划来源">
            <el-select v-model="form.programSource" placeholder="请选择" style="width:100%" disabled>
              <el-option v-for="item in programSource" :key="item.id" :label="item.text" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="来源编号" v-show="form.programSource == 'zhiliangwenti'">
            <el-input v-model="problemNo" readonly @focus="toQuestions" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="五化领域">
            <el-select v-model="form.fiveAspectsFieldList" placeholder="请选择" multiple style="width:100%" disabled> 
              <el-option v-for="item in fiveAspectsFieldList" :key="item.id" :label="item.text" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="应用领域">
            <el-select v-model="form.applicationFieldList" placeholder="请选择" multiple style="width:100%" disabled>
              <el-option v-for="item in applicationFieldList" :key="item.id" :label="item.text" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="适用项目">
            <el-select v-model="form.applicableProjectList" placeholder="请选择" multiple style="width:100%" disabled>
              <el-option v-for="item in applicableProjectList" :key="item.id" :label="item.text" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="应用车型">
            <el-select v-model="form.applicationCarTypeList" placeholder="请选择" multiple style="width:100%" disabled>
              <el-option v-for="item in applicationCarTypeList" :key="item.id" :label="item.text" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input v-model="form.remarks" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <div class="btn">
          <el-button type="primary" @click="saveTable('form')">保 存</el-button>
          <el-button @click="onClose">取 消</el-button>
        </div>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import { EcoUtil } from "@/components/util/main.js";
import { sysEnv } from "@/modulesExtend/automotive/standardPlanning/config/env";
import {
  getEnumSelectEnabled,
  getStatus,
  getOnceInfo,
  saveEditAjax,
} from "../../service/service.js";
import tagSelect from "@/components/orgPick/tagSelect.vue";
export default {
  components: {
    tagSelect,
  },
  data() {
    return {
      form: {},
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
      problemNo: "",
      rules: {
        classification: [
          { required: true, message: "请选择标准分类", trigger: "change" },
        ],
        type: [{ required: true, message: "请输入标准类型", trigger: "blur" }],
        systemCode: [
          { required: true, message: "请输入体系码", trigger: "blur" },
        ],
        programNumber: [
          { required: true, message: "请输入标准编号", trigger: "blur" },
        ],
        programName: [
          { required: true, message: "请输入标准名称", trigger: "blur" },
        ],
        drafter: [
          { required: true, message: "请选择定制人", trigger: "change" },
        ],
        purposeContent: [
          {
            required: true,
            message: "请输入标准编制目的及内容简介",
            trigger: "blur",
          },
        ],
        dept: [{ required: true, message: "请选择部门", trigger: "change" }],
        office: [{ required: true, message: "请选择科室", trigger: "change" }],
        responsibleUser: [
          { required: true, message: "请选择责任人", trigger: "change" },
        ],
        draftTime: [
          { required: true, message: "请选择初稿完成时间", trigger: "change" },
        ],
        countersignTime: [
          { required: true, message: "请选择会签完成时间", trigger: "change" },
        ],
        reviewYear: [
          { required: true, message: "请选择复审年度", trigger: "change" },
        ],
        status: [
          { required: true, message: "请选择标准状态标示", trigger: "change" },
        ],
        subcommittee: [
          { required: true, message: "请输入分标委", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.getBaseInfo();
    this.listAction();
    window.editStandardvm = this;
    this.getInfo();
  },
  methods: {
    // 获取数据
    getInfo() {
      getOnceInfo(this.id).then((res) => {
        console.log(res);
        this.form = res.data.data;
        this.form.reviewYear = this.form.reviewYear.toString();
        if (this.form.drafter) {
          this.userInitDataStr_drafter = `{"type":"PERSONNEL","orgId":"${this.form.drafterMember.orgId}","linkId":"${this.form.drafter}"}`;
        }
        if (this.form.responsibleUser) {
          this.userInitDataStr_responsibleUser = `{"type":"PERSONNEL","orgId":"${this.form.responsibleUserMember.orgId}","linkId":"${this.form.responsibleUser}"}`;
        }
        if (this.form.dept) {
          this.deptInitDataStr = `{"type":"DEPT","orgId":"${this.form.dept}","linkId":"${this.form.dept}"}`;
        }
        if (this.form.office) {
          this.deptInitDataStr_office = `{"type":"DEPT","orgId":"${this.form.office}","linkId":"${this.form.office}"}`;
        }
        this.questions = this.form.sourceNumberList;
        if (this.questions && this.questions.length > 0) {
          let sourceArr = [];
          for (let i of this.questions.keys()) {
            sourceArr.push(this.questions[i].code);
          }
          this.problemNo = sourceArr.join(",");
        } else {
          this.form.sourceNumberItems = [];
        }
      });
    },
    // 获取基础数据
    getBaseInfo() {
      getEnumSelectEnabled("esProgramClass").then((res) => {
        this.classification = res.data;
      });
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
    // 选部门组件回调
    selectRoleDept(data, type) {
      if (!data.id && data.itemArray.length === 0) {
        if (type === "dept") {
          this.form.dept = "";
          this.deptInitDataStr = "";
        } else if (type === "office") {
          this.form.office = "";
          this.deptInitDataStr_office = "";
        }
      } else {
        if (type === "dept") {
          this.form.dept = data.orgId;
          this.deptInitDataStr = `{"type":"DEPT","orgId":"${data.orgId}","linkId":"${data.orgId}"}`;
        } else if (type === "office") {
          this.form.office = data.orgId;
          this.deptInitDataStr_office = `{"type":"DEPT","orgId":"${data.orgId}","linkId":"${data.orgId}"}`;
        }
      }
    },
    // 选人组件回调
    selectRoleUser(data, type) {
      if (!data.id && data.itemArray.length === 0) {
        if (type === "drafter") {
          this.form.drafter = "";
          this.userInitDataStr_drafter = "";
        } else if (type === "responsibleUser") {
          this.form.responsibleUser = "";
          this.userInitDataStr_responsibleUser = "";
        }
      } else {
        if (type === "drafter") {
          this.form.drafter = data.itemArray[0].linkId;
          this.userInitDataStr_drafter = `{"type":"PERSONNEL","orgId":"${data.orgId}","linkId":"${data.itemArray[0].linkId}"}`;
        } else if (type === "responsibleUser") {
          this.form.responsibleUser = data.itemArray[0].linkId;
          this.userInitDataStr_responsibleUser = `{"type":"PERSONNEL","orgId":"${data.orgId}","linkId":"${data.itemArray[0].linkId}"}`;
        }
      }
    },
    // 保存信息
    saveTable(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let editInfo = JSON.parse(JSON.stringify(this.form));
          editInfo.reviewYear = parseInt(editInfo.reviewYear);
          saveEditAjax(editInfo).then((res) => {
            console.log(res);
            if (res.data.success) {
              this.$message({
                message: "保存成功",
                type: "success",
                duration: 1000,
                onClose: () => {
                  let doObj = {};
                  doObj.action = "editStandard";
                  doObj.close = true;
                  EcoUtil.getSysvm().callBackDialogFunc(doObj);
                },
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    onClose() {
      EcoUtil.getSysvm().closeDialog();
    },
    toQuestions() {
      if (sysEnv !== 1) {
        this.$router.push({ name: "quality" });
      } else {
        // let _key = EcoUtil.getUID();
        // EcoUtil.getSysvm().setTempStore(_key,this.questions);
        let _url = "/standardPlanning/index.html#/quality/"; //+ _key
        EcoUtil.getSysvm().openDialog("来源编号", _url, "800", "700", "8hv");
      }
    },
    listAction() {
      let callBackDialogFunc = function (obj) {
        if (obj.action == "quality") {
          window.editStandardvm.questions = obj.data;
          let sourceArr1 = [];
          for (let i of window.editStandardvm.questions.keys()) {
            sourceArr1.push(window.editStandardvm.questions[i].problemNo);
            window.editStandardvm.form.sourceNumberItems.push(
              window.editStandardvm.questions[i].id
            );
          }
          window.editStandardvm.problemNo = sourceArr1.join(",");
        }
      };
      EcoUtil.addCallBackDialogFunc(callBackDialogFunc, "addStandardvm");
    },
  },
};
</script>
<style scoped>
.editDetail {
  margin: 10px 20px;
}
.editDetail .btn {
  text-align: right;
  margin: 20px 10px;
}
</style>