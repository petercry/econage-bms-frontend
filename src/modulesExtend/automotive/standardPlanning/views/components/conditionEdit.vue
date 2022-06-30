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
            <el-select :disabled="statusForm.disableStatus2" v-model="form.classification" placeholder="请选择" style="width:100%" @change="changeSlelect">
              <el-option v-for="item in classification" :key="item.id" :label="item.text" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="标准类型" prop="type">
            <el-select :disabled="statusForm.disableStatus3" v-model="form.type" placeholder="请选择" style="width:100%">
              <el-option v-for="item in typeList" :key="item.id" :label="item.text" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="体系码" prop="systemCode">
            <el-input v-model="form.systemCode" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="标准编号" prop="programNumber">
            <el-input v-model="form.programNumber" :disabled="statusForm.disableStatus5"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标准名称" prop="programName">
            <el-input v-model="form.programName" :disabled="statusForm.disableStatus6"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="标准编制目的及内容简介" prop="purposeContent">
            <el-input v-model="form.purposeContent" type="textarea" :rows="2" :disabled="statusForm.disableStatus7"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
         <el-col :span="12">
          <el-form-item label="责任人" prop="responsibleUser">
            <tag-select class="bgColor" style="width:100%" :disabled="statusForm.disableStatus8" :initDataStr="userInitDataStr_responsibleUser" :initOptions="{selectNum:1,selectType:'User',begin_id: deptId}" @callBack="(val)=>selectRoleUser(val,'responsibleUser')">
            </tag-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门" prop="dept">
            <tag-select style="width:100%"  :disabled="statusForm.disableStatus9" :initDataStr="deptInitDataStr" :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(val)=>selectRoleDept(val,'dept')">
            </tag-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="科室" prop="office">
            <tag-select style="width:100%" :disabled="statusForm.disableStatus10" :initDataStr="deptInitDataStr_office" :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(val)=>selectRoleDept(val,'office')">
            </tag-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="初稿完成时间" prop="draftTime">
            <el-date-picker :disabled="statusForm.disableStatus11" style="width:100%" v-model="form.draftTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="会签完成时间" prop="countersignTime">
            <el-date-picker :disabled="statusForm.disableStatus12" style="width:100%" v-model="form.countersignTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="复审年度" prop="reviewYear">
            <el-date-picker :disabled="statusForm.disableStatus13" style="width:100%" v-model="form.reviewYear" type="year" value-format="yyyy" placeholder="选择年度">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="标准状态标示" prop="status">
            <el-select :disabled="statusForm.disableStatus14" v-model="form.status" placeholder="请选择" style="width:100%">
              <el-option v-for="(item,key,index) in status" :key="index" :label="item" :value="key">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分标委" prop="subcommittee">
            <!-- <el-input v-model="form.subcommittee"></el-input> -->
            <el-select :disabled="statusForm.disableStatus15" v-model="form.subcommittee" placeholder="请选择" style="width:100%">
              <el-option v-for="(item,index) in subcommitteeList" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="规划来源">
            <el-select :disabled="statusForm.disableStatus16" v-model="form.programSource" placeholder="请选择" style="width:100%">
              <el-option v-for="item in programSource" :key="item.id" :label="item.text" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="来源编号" v-show="form.programSource == 'zhiliangwenti'">
            <el-input :disabled="statusForm.disableStatus17" v-model="problemNo" readonly @focus="toQuestions"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input :disabled="statusForm.disableStatus18" v-model="form.remarks"></el-input>
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
  getSubList,
  getEnabList,
  getStandardTypeList,
  technicalStandardTree,
  systemCodeList
} from "../../service/service.js";
import tagSelect from "@/components/orgPick/tagSelect.vue";
export default {
  components: {
    tagSelect,
  },
  data() {
    return {
      deptId: '',
      typeList: [],
      form: {},
      classification: [], //标准分类
      status: {}, //标准状态标示
      programSource: [], //规划来源
      deptInitDataStr: "", //部门初始化
      deptInitDataStr_office: "", //科室初始化
      userInitDataStr_drafter: "", //定制人初始化
      userInitDataStr_responsibleUser: "", //责任人初始化
      subcommitteeList:[], //分标委选择列表
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
            required: false,
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
          { required: false, message: "请选择复审年度", trigger: "change" },
        ],
        status: [
          { required: true, message: "请选择标准状态标示", trigger: "change" },
        ],
        subcommittee: [
          { required: true, message: "请输入分标委", trigger: "blur" },
        ],
      },
      linkName:'',
      statusForm: {} //是否禁用填写
    };
  },
  created() {

  },
  mounted() {
    for (let i=1; i <= 18; i++) {
      var num = 'disableStatus' + i.toString()
      this.statusForm[num] = true
    }
    this.id = this.$route.params.id;
    this.linkName = this.$route.params.name;
    window.editStandardvm = this;
    this.getSubList()
    this.listAction();
    this.getInfo();
  },
  methods: {
    //获取分标委列表
    getSubList() {
      getSubList().then(res => {
        this.subcommitteeList = res.data.rows
      })
    },
    // 获取数据
    getInfo() {
      this.getBaseInfo();
      getOnceInfo(this.id).then((res) => {
        if(res.data.data.phaseId == 'DEPT_LIAISON_PROOF' || res.data.data.phaseId == 'OFFICE_LIAISON_CHOOSE') {
          // this.deptId = res.data.data.responsibleUserMember.orgId;
          var arr = []
          arr = res.data.data.responsibleUserMember.orgId.split(".")
          this.deptId = arr[0]
        }
        this.form = res.data.data;
        //不同类型的非必填
        if (this.form.status == 'NEED_MODIFY') {
          this.rules.reviewYear[0].required = true
          this.rules.draftTime[0].required = true
          this.rules.countersignTime[0].required = true
        } else if (this.form.status == 'KEEP_ALIVE') {
          this.rules.reviewYear[0].required = true
          this.rules.draftTime[0].required = false
          this.rules.countersignTime[0].required = false
        } else if (this.form.status == 'INITIAL') {
          this.rules.draftTime[0].required = true
          this.rules.countersignTime[0].required = true
          this.rules.reviewYear[0].required = false
        } else {
          this.rules.draftTime[0].required = false
          this.rules.countersignTime[0].required = false
          this.rules.reviewYear[0].required = false
        }
        if (!isNaN(this.form.systemCode)){
          systemCodeList(this.form.systemCode).then(res => {
              this.form.systemCode = res.data.name
          })
        }
        var id = null
        getStandardTypeList().then(res => {
          this.classification = res.data;
          id = res.data.find(x => x.id == this.form.classification).id
          getEnabList(id).then((res) => {
            this.typeList = res.data;
          });
        })
        // id = this.classification.find(x => x.id == this.form.classification).id
        // getEnabList(id).then((res) => {
        //   this.typeList = res.data;
        // });
        this.form.reviewYear = this.form.reviewYear + '';
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
        //不同环节限制禁用Input
        var arr = []
        if (this.linkName == 'TECH_INNOVATION_DEPT_CREATE') {
          console.log('科技创新部编制发起')
          for (let i=1; i <= 18; i++) {
            var num = 'disableStatus' + i.toString()
            this.statusForm[num] = false
          }
        } else if (this.linkName == 'DEPT_LIAISON_PROOF') {
          console.log('部门联络员校队')
          arr = [7,8,10,15,16,17,18]
        } else if (this.linkName == 'OFFICE_LIAISON_CHOOSE') {
          console.log('业务科室联络员指定责任人')
          arr = [7,8,15,16,17,18]
        } else if (this.linkName == 'RESPONSIBLE_HANDLE') {
          console.log('责任人办理')
          if (this.form.status == 'NEED_MODIFY') {
            arr = [7,11,12,15,16,17,18]
          } else {
            arr = [7,15,16,17,18]
          }
        } else if (this.linkName == 'TECH_INNOVATION_DEPT_INITIATE' ||this.linkName == 'BUSINESS_PLAN_DEPT_INITIATE' ||this.linkName == 'STD_REGULATIONS_ROOM_SECTION_CHIEF_INITIATE') {
          console.log('科技创新部发起/事业计划部发起/标准法规室科长发起')
          arr = [7,8,9,10,15,16,17,18]
        }
        if(this.linkName != 'TECH_INNOVATION_DEPT_CREATE') {
            if(this.form.status == 'INITIAL') {
              arr.push(5,6,11,12)
            }
            arr.forEach(x => {
              var num = 'disableStatus' + x.toString()
              this.statusForm[num] = false
            })
        }
      });
    },
    // 获取基础数据
    getBaseInfo() {
      // getEnumSelectEnabled("esProgramClass").then((res) => {
      //   this.classification = res.data;
      // });
      // getStandardTypeList().then(res => {
      //   this.classification = res.data;
      // })
      getEnumSelectEnabled("esProgramSource").then((res) => {
        this.programSource = res.data;
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
    changeSlelect(e) {
      this.form.type = null
      getEnabList(e).then((res) => {
        this.typeList = res.data;
      });
    },
    // 选人组件回调
    // selectRoleUser(data, type) {
    //   if (!data.id && data.itemArray.length === 0) {
    //     if (type === "drafter") {
    //       this.form.drafter = "";
    //       this.userInitDataStr_drafter = "";
    //     } else if (type === "responsibleUser") {
    //       this.form.responsibleUser = "";
    //       this.userInitDataStr_responsibleUser = "";
    //     }
    //   } else {
    //     if (type === "drafter") {
    //       this.form.drafter = data.itemArray[0].linkId;
    //       this.userInitDataStr_drafter = `{"type":"PERSONNEL","orgId":"${data.orgId}","linkId":"${data.itemArray[0].linkId}"}`;
    //     } else if (type === "responsibleUser") {
    //       this.form.responsibleUser = data.itemArray[0].linkId;
    //       this.userInitDataStr_responsibleUser = `{"type":"PERSONNEL","orgId":"${data.orgId}","linkId":"${data.itemArray[0].linkId}"}`;
    //     }
    //   }
    // },
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
          this.userInitDataStr_drafter = `{"type":"PERSONNEL","orgId":"${data.orgId}","linkId":"${data.orgId}"}`;
        } else if (type === "responsibleUser") {
          this.form.responsibleUser = data.itemArray[0].linkId;
          this.userInitDataStr_responsibleUser = `{"type":"PERSONNEL","orgId":"${data.orgId}","linkId":"${data.orgId}"}`;
          let orgId = data.orgId.split('.')[0];
          getUserInfoByOrgId(data.itemArray[0].linkId).then(res => {
              var len = 0;
              if (res.data.departments && res.data.departments.length > 1) {
                  res.data.departments.forEach((item, i) => {
                      if (item.id == orgId) {
                          len = i;
                      }
                  })
              }
              //如果没单位就给部门
              if (res.data.departments[len].orgPathDeptList) {
                var length = res.data.departments[len].orgPathDeptList.length
                if (length > 1) {
                  this.form.dept = res.data.departments[len].orgPathDeptList[length-1].id; //部门
                  this.form.office = res.data.departments[len].id; //科室
                } else if (length = 1) {
                  this.form.dept = res.data.departments[len].id; //部门
                  this.form.office = null; //科室
                } else {
                  this.form.dept = null; //部门
                  this.form.office = null; //科室
                }
              }
              if (this.form.dept) {
                //部门deptInitDataStr
                this.deptInitDataStr = `{"type":"DEPT","orgId":"${this.form.dept}","linkId":"${this.form.dept}"}`;
              } else {
                this.deptInitDataStr = null;
              }
              if (this.form.office) {
                //科室deptInitDataStr_office
                this.deptInitDataStr_office = `{"type":"DEPT","orgId":"${this.form.office}","linkId":"${this.form.office}"}`;
              } else {
                this.deptInitDataStr_office = null;
              }

          })
        }
      }
    },
    // 保存信息
    saveTable(formName) {
      if(!this.form.draftTime) {
        this.form.draftTime = ''
      }
      if (!this.form.countersignTime) {
        this.form.countersignTime = ''
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let editInfo = JSON.parse(JSON.stringify(this.form));
          editInfo.reviewYear = parseInt(editInfo.reviewYear);
          saveEditAjax(editInfo).then((res) => {
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
          // console.log(window.editStandardvm.problemNo)
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
