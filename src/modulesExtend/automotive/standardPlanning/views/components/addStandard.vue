<template>
  <div class="addStandard">
    <!-- 弹出框 -->
    <el-form :model="form" label-width="110px" :rules="rules" ref="form">
      <el-row>
        <el-col :span="12" v-if="statusShow">
          <el-form-item label="标准分类" prop="classification">
            <el-select v-model="form.classification" placeholder="请选择" style="width:100%" @change="changeSlelect">
              <el-option v-for="item in classification" :key="item.id" :label="item.text" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="statusShow">
          <el-form-item label="标准类型" prop="type">
            <!-- <el-input v-model="form.type"></el-input> -->
            <el-select v-model="form.type" placeholder="请选择" style="width:100%">
              <el-option v-for="item in typeList" :key="item.id" :label="item.text" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="!statusShow">
          <el-form-item label="年度">
            <el-input v-model="form.year" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="!statusShow">
          <el-form-item label="标准分类" prop="classification">
            <el-select v-model="form.classification" placeholder="请选择" style="width:100%" @change="changeSlelect">
              <el-option v-for="item in classification" :key="item.id" :label="item.text" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" v-if="statusShow">
          <el-form-item label="年度">
            <el-input v-model="form.year" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="!statusShow">
          <el-form-item label="标准类型" prop="type">
            <!-- <el-input v-model="form.type"></el-input> -->
            <el-select v-model="form.type" placeholder="请选择" style="width:100%">
              <el-option v-for="item in typeList" :key="item.id" :label="item.text" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="体系码" prop="systemCodeName">
            <el-input v-model="form.systemCodeName" @click.native.stop='selectSystemCode'></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="标准编号" prop="programNumber">
            <el-input v-model="form.programNumber" v-if="programNumberStatus"></el-input>
            <el-select v-model="form.programNumber" v-else style="width: 100%;" @change="selectProgramNumberList">
              <el-option v-for="item in programNumberList" :key="item.id" :label="item.text" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标准名称" prop="programName">
            <el-input v-model="form.programName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="12">
          <el-form-item label="定制人" prop="drafter">
            <tag-select style="width:100%" :initDataStr="userInitDataStr_drafter" :initOptions="{selectNum:1,selectType:'User'}" @callBack="(val)=>selectRoleUser(val,'drafter')">
            </tag-select>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="24">
          <el-form-item label="标准编制目的及内容简介" prop="purposeContent">
            <el-input v-model="form.purposeContent" type="textarea" :rows="2"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="责任人" prop="responsibleUser">
            <tag-select style="width:100%" :initDataStr="userInitDataStr_responsibleUser" :disabled="personUserStatus" :initOptions="{selectNum:1,selectType:'User'}" @callBack="(val)=>selectRoleUser(val,'responsibleUser')">
            </tag-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门" prop="dept">
            <tag-select style="width:100%" :initDataStr="deptInitDataStr" :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(val)=>selectRoleDept(val,'dept')">
            </tag-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
         <el-col :span="12">
          <el-form-item label="科室" prop="office">
            <tag-select style="width:100%" :initDataStr="deptInitDataStr_office" :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(val)=>selectRoleDept(val,'office')">
            </tag-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="初稿完成时间" prop="draftTime">
            <el-date-picker style="width:100%" v-model="form.draftTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="会签完成时间" prop="countersignTime">
            <el-date-picker style="width:100%" v-model="form.countersignTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标准状态标示" prop="status">
            <el-select v-model="form.status" placeholder="请选择" style="width:100%" @change="selectChange" :disabled="phaseStatus">
              <el-option v-for="(item,key,index) in status" :key="index" :label="item" :value="key">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
         <el-col :span="12">
          <el-form-item label="复审年度" prop="reviewYear">
            <el-date-picker style="width:100%" v-model="form.reviewYear" type="year" value-format="yyyy" placeholder="选择年度">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分标委" prop="subcommittee">
            <!-- <el-input v-model="form.subcommittee"></el-input> -->
            <el-select v-model="form.subcommittee" placeholder="请选择" style="width:100%">
              <el-option v-for="(item,index) in subcommitteeList" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="规划来源" prop="programSource">
            <el-select v-model="form.programSource" placeholder="请选择" style="width:100%">
              <el-option v-for="item in programSource" :key="item.id" :label="item.text" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="来源编号" v-show="form.programSource == 'zhiliangwenti'">
            <el-input v-model="problemNo" readonly @focus="toQuestions"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="12">
          <el-form-item label="五化领域">
            <el-select v-model="form.fiveAspectsFieldList" placeholder="请选择" multiple style="width:100%">
              <el-option v-for="item in fiveAspectsFieldList" :key="item.id" :label="item.text" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="应用领域">
            <el-select v-model="form.applicationFieldList" placeholder="请选择" multiple style="width:100%">
              <el-option v-for="item in applicationFieldList" :key="item.id" :label="item.text" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row> -->
      <!-- <el-row>
        <el-col :span="12">
          <el-form-item label="适用项目">
            <el-select v-model="form.applicableProjectList" placeholder="请选择" multiple style="width:100%">
              <el-option v-for="item in applicableProjectList" :key="item.id" :label="item.text" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="应用车型">
            <el-select v-model="form.applicationCarTypeList" placeholder="请选择" multiple style="width:100%">
              <el-option v-for="item in applicationCarTypeList" :key="item.id" :label="item.text" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input v-model="form.remarks"></el-input>
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
  getUserInfoByOrgId,
  getEnumSelectEnabled,
  zhishiKu,
  getStandardList,
  getStatus,
  saveStandardAddAjax,
  getSubList,
  getEnabList,
  getSystemCode,
  getStandardTypeList,
  getCurrentActionUser
} from "../../service/service.js";
import tagSelect from "@/components/orgPick/tagSelect.vue";
export default {
  components: {
    tagSelect,
  },
  data() {
    return {
      standardList: [],
      zhishikuList: [],
      programNumberStatus: true,
      programNumberList: [],
      statusShow: false,
      typeList: [],
      form: {
        year: "",
        classification: "",
        type: "",
        programNumber: "",
        programName: "",
        // systemCode: "", //体系码 后端会根据selectId 自行判断是否填充当前流水号
        systemCodeName: '',
        drafter: "",
        dept: "",
        office: "",
        responsibleUser: "",
        draftTime: "",
        countersignTime: "",
        reviewYear: "",
        subcommittee: "",
        status: "",
        programSource: "",
        sourceNumberItems: [],
        purposeContent: "",
        remarks: "",
        phaseId:'',
        fiveAspectsFieldList: [],
        applicationFieldList: [],
        applicableProjectList: [],
        applicationCarTypeList: [],
      },
      subcommitteeList:[], //分标委选择列表
      classification: [], //标准分类
      status: [], //标准状态标示
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
      phaseStatus: false,
      rules: {
        classification: [
          { required: true, message: "请选择标准分类", trigger: "change" },
        ],
        type: [{ required: true, message: "请输入标准类型", trigger: "blur" }],
        systemCodeName: [
          // { required: true, message: "请输入体系码", trigger: "blur" },
          { required: true, trigger: "blur" },
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
        dept: [
          { required: true, message: "请选择部门", trigger: "change" },
        ],
        office: [
          { required: true, message: "请选择科室", trigger: "change" },
        ],
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
        programSource: [
          { required: true, message: "请选择规划来源", trigger: "change" },
        ],
      },
      personUserStatus: false
    };
  },
  created() {
    this.form.phaseId = this.$route.params.phaseId;
    if(this.form.phaseId == 'RESPONSIBLE_HANDLE') { //从责任人办理环节进入默认选中不可修改
      this.getCurrentActionUser()
    }
    this.getyear();
    this.getBaseInfo();
    this.getSubList()
    this.listAction();
    window.addStandardvm = this;
    // this.testFun()
  },
  methods: {
    testFun() {
      var p = new Promise(function (resolve, reject) {
            var timer = setTimeout(function () {
                console.log('执行操作1');
                resolve({name: 'xyd',num: 18});
            }, 1000);
        });
 
        p.then(function (data) {
            console.log(data);
        });
    },
    //获取当前操作人
    getCurrentActionUser() {
      getCurrentActionUser().then(res => {
        this.form.responsibleUser = res.data.linkId;
        this.userInitDataStr_responsibleUser = `{"type":"PERSONNEL","orgId":"${res.data.orgId}","linkId":"${res.data.orgId}"}`; //默认选中
        this.personUserStatus = true
      })
    },
    selectProgramNumberList(e) {
      if(this.form.status == 'NEED_MODIFY') { //标准状态标识为C选择时
        var formObj = this.programNumberList.find( x => e == x.id)
        this.form.programName = formObj.stdName
        // this.form.classification = formObj.stdName
      }
    },
    selectChange(e) {
      if (e == 'NEED_MODIFY') {
        this.programNumberStatus = false
        this.programNumberList = this.zhishikuList
        this.statusShow = false
        this.rules.reviewYear[0].required = true
        this.rules.draftTime[0].required = true
        this.rules.countersignTime[0].required = true
      } else if (e == 'KEEP_ALIVE') {
        this.programNumberStatus = true
        this.statusShow = false
        this.rules.reviewYear[0].required = true
        this.rules.draftTime[0].required = false
        this.rules.countersignTime[0].required = false
      } else if (e == 'INITIAL') {
        this.programNumberStatus = false
        this.getProgramNumberList()
        this.statusShow = true
        this.rules.draftTime[0].required = true
        this.rules.countersignTime[0].required = true
        this.rules.reviewYear[0].required = false
      } else {
        this.programNumberStatus = true
        this.statusShow = false
        this.rules.draftTime[0].required = false
        this.rules.countersignTime[0].required = false
        this.rules.reviewYear[0].required = false
      }
    },
    //获取分标委列表
    getSubList() {
      getSubList().then(res => {
        this.subcommitteeList = res.data.rows
      })
    },
    // 获取今年
    getyear() {
      let date = new Date();
      this.form.year = date.getFullYear();
    },
    //标准编号列表
    getProgramNumberList() {
      getEnumSelectEnabled('BHQZ').then(res => {
        this.programNumberList = res.data
      })
    },
    // 获取基础数据
    getBaseInfo() {
      this.getProgramNumberList()
      //标准规划列表
      let date = new Date();
      var params = {year: date.getFullYear()}
      getStandardList(params).then(res => {
        this.standardList = res.data.rows
      })
      //知识库
      zhishiKu().then(res => {
        this.zhishikuList = res.data.rows.map(x => {
          return{
            ...x,
            text: x.stdCode
          }
        })
      })
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
        //如果为这三个环节，标准状态表示不可选默认为A
        if(this.form.phaseId == 'DEPT_LIAISON_PROOF' || this.form.phaseId == 'OFFICE_LIAISON_CHOOSE' || this.form.phaseId == 'RESPONSIBLE_HANDLE') {
          this.phaseStatus = true
          this.form.status = Object.keys(this.status)[0]
        }
      });
    },
    changeSlelect(e) {
      this.form.type = null
      getEnabList(e).then((res) => {
        this.typeList = res.data;
      });
      // if(e == 'espManagement' || e == 'esProgramClass') {
      //   getSystemCode(e).then(res => {
      //     // this.form.systemCode = res.data
      //     console.log(res.data)
      //   })
      // }

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
          console.log(data);
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
      console.log(data)
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
      var programNumberStatus = true //false 标准编号重复
      this.zhishikuList.forEach(x => {
        if(this.form.programNumber == x.stdCode) {
          programNumberStatus = false
        }
      })
      this.standardList.forEach(x => {
        if(this.form.programNumber == x.programNumber) {
          programNumberStatus = false
        }
      })
      if(programNumberStatus) {
        if(!this.form.draftTime) {
          this.form.draftTime = ''
        }
        if (!this.form.countersignTime) {
          this.form.countersignTime = ''
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // this.form.reviewYear = this.form.reviewYear * 1;
            saveStandardAddAjax(this.form).then((res) => {
              // console.log(res);
              if (res.data.success) {
                this.$message({
                  message: "保存成功",
                  type: "success",
                  duration: 1000,
                  onClose: () => {
                    let doObj = {};
                    doObj.action = "addStandard";
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
      } else {
        this.$message.warning("标准编号重复，不可新增")
      }
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
    selectSystemCode() {
      let url ="/standardPlanning/index.html#/selectSystemCode" ;
      let baseParams = ''
      let data1 = '';
      let data2 = "";

      if(this.form.classification){
          this.classification.forEach(item=>{
              if(item.id === this.form.classification){
                  data1 = item.text;
              }
          })
          baseParams = "?classification="+data1;
      }
      if(this.form.type){
          this.typeList.forEach(item=>{
              if(item.id === this.form.type){
                  data2 = item.text;
              }
          })
          baseParams = "?type="+data2;
      }
      if(this.form.classification && this.form.type){
          baseParams = `?classification=${data1}&type=${data2}`;
      }
      url +=baseParams;
      // console.log(baseParams)
      // this.$router.push({ name: "selectSystemCode",query: {classification:data1,type:data2} });
      EcoUtil.getSysvm().openDialog('体系码', url,'400', '600', "15vh");
      // if (sysEnv !== 1) {
      //   this.$router.push({ name: "treeIndex" });
      // } else {
      //   let _url = "/standardPlanning/index.html#/selectSystemCode/";
      //   EcoUtil.getSysvm().openDialog("体系码", _url, "400", "600", "15hv");
      // }
    },
    listAction() {
      var that = this
      let callBackDialogFunc = function (obj) {
        if (obj.action == "quality") {
          //显示
          that.problemNo = obj.data.map(x => {
            return x.problemNo
          })
          //传入
          that.form.sourceNumberItems = obj.data.map(x => {
            return x.id
          })
          // console.log(that.form)
        } else if(obj.action == "selectSystemCode") {
          // that.form.systemCode = obj.data.code.selectId

          // that.form.systemCodeItem = obj.data.code.selectId
          // that.form.classification = obj.data.code.matchType
          // getEnabList(that.form.classification).then((res) => {
          //   that.typeList = res.data;
          //   that.form.type = obj.data.code.matchSubType
          // });
          that.form.systemCodeName = obj.data.code
        }
      };
      EcoUtil.addCallBackDialogFunc(callBackDialogFunc, "addStandardvm");
    },
  },
};
</script>
<style scoped>
.addStandard {
  margin: 10px 20px;
}
.addStandard .btn {
  text-align: right;
  margin: 20px 10px;
}
</style>
