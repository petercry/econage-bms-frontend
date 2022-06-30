<template>
  <div class='questionDetails'>
    <div class='addForm'>
      <el-form :model='formData' ref='questionListForm' :rules='rules' v-loading='loading' label-position='right' label-width='100px'>
        <el-row>
          <el-col :span='12'>
            <el-form-item label='问题编号:' prop='problemNo'>
              <el-input v-if='isEdit' placeholder='请输入' v-model='formData.problemNo'></el-input>
              <span class="viewContent" v-else>{{formData.problemNo}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='22'>
            <el-form-item label='问题名称:' prop='problemName'>
              <el-input v-if='isEdit' placeholder='请输入' type='textarea' rows='1' resize='none' v-model='formData.problemName'></el-input>
              <span class="viewContent" v-else>{{formData.problemName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='22'>
            <el-form-item label='问题描述:' prop='problemDescription'>
              <el-input v-if='isEdit' placeholder='请输入' type='textarea' rows='4' resize='none' v-model='formData.problemDescription'></el-input>
              <span class="viewContent" v-else>{{formData.problemDescription}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='11'>
            <el-form-item label='责任部门:' prop='responsibleDept' ref='selectDept'>
              <tag-select v-if='isEdit' placeholder="选择机构" style="width:100%;vertical-align: top;" :initDataStr="formData.deptInitDataStr" :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="selectRoleDept">
              </tag-select>
              <span class="viewContent" v-else>{{formData.responsibleDeptName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span='11'>
            <el-form-item label='责任人:' prop='responsible' ref='selectUser'>
              <tag-select v-if='isEdit' placeholder="选择人员" style="width:100%;vertical-align: top;" :initDataStr="formData.initDataStr" :initOptions="{selectNum:1,selectType:'User'}" @callBack="selectRoleUser">
              </tag-select>
              <span class="viewContent" v-else>{{formData.responsibleName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='22'>
            <el-form-item label='标准名称:' prop='standardName'>
              <el-input v-if='isEdit' placeholder='请输入' type='textarea' resize='none' rows='1' v-model='formData.standardName'></el-input>
              <span class="viewContent" v-else>{{formData.standardName||'暂无填写'}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='12' style='margin-right:5px;'>
            <el-form-item label='制修订状态:' prop='revisionStatus'>
              <el-select v-if='isEdit' v-model='formData.revisionStatus'>
                <el-option v-for='item in revisionTypeList' :value='item.id' :label='item.text' :key='item.id'></el-option>
              </el-select>
              <span class="viewContent" v-else>{{formData.revisionStatusName||'暂无填写'}}</span>
            </el-form-item>
          </el-col>
          <el-col :span='11'>
            <el-form-item label='计划完成日期:' prop='planCompletionDate'>
              <el-date-picker v-if='isEdit' v-model="formData.planCompletionDate" value-format='yyyy-MM-dd HH:mm:ss' type="datetime" placeholder="选择日期">
              </el-date-picker>
              <span class="viewContent" v-else>{{formData.planCompletionDate||'暂无填写'}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div>
        <el-row>
          <el-col :span='3'>
            <span style='color:#0f1419;font-size:14px;user-select: none;'>关联实际标准信息:</span>
          </el-col>
          <el-col :span='19' style='padding-left:10px;box-sizing:border-box;'>
            <!-- 暂时无法对接 与标准规划关联-->
            <el-table :data='infoList' border :header-cell-style="{background:'#f5f7fa',color:'#000',textAlign:'center'}" :cell-style="{textAlign:'center'}">
              <el-table-column prop='' label='标准标号'></el-table-column>
              <el-table-column prop='' label='标准名称'></el-table-column>
              <el-table-column prop='' label='状态'></el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="btn" v-if='isEdit'>
      <el-button size="medium" @click="onCancel">取消</el-button>
    </div>
  </div>
</template>
<script>
import tagSelect from "@/components/orgPick/tagSelect.vue";
import { EcoUtil } from "@/components/util/main.js";
import { mapMutations, mapActions, mapState } from "vuex";
import {
  problemSelectSingle,
  getUserInfoByOrgId,
  getOrgsMemberByIds,
} from "../../service/service.js";
export default {
  data() {
    return {
      id: "",
      caseType: "",
      infoList: [],
      formData: {
        problemNo: "",
        problemName: "",
        problemDescription: "",
        responsibleDept: "",
        responsible: "",
        standardName: "",
        revisionStatus: "",
        planCompletionDate: "",
        initDataStr: "",
        deptInitDataStr: "",
      },
      rules: {
        problemNo: [
          { required: true, message: "问题编号为必填项", trigger: "blur" },
        ],
        problemName: [
          { required: true, message: "问题名称为必填项", trigger: "blur" },
        ],
        problemDescription: [
          { required: true, message: "问题描述为必填项", trigger: "blur" },
        ],
        responsibleDept: [
          { required: true, message: "责任部门为必选项", trigger: "change" },
        ],
        responsible: [
          { required: true, message: "责任人为必选项", trigger: "change" },
        ],
      },
      loading: false,
    };
  },
  computed: {
    ...mapState(["revisionTypeList"]),
    isEdit() {
      return this.caseType !== "viewCase";
    },
  },
  components: {
    tagSelect,
  },
  created() {
    this.setRevisiontype();
    this.id = this.$route.params.id;
    this.caseType = this.$route.params.caseType;
    if (this.id && this.id != 0) {
      this.getDetailsInfo();
    }
  },
  methods: {
    ...mapActions(["setRevisiontype"]),
    getDetailsInfo() {
      this.loading = true;
      problemSelectSingle(this.id).then((res) => {
        var arr = [
          {
            type: "DEPT",
            orgId: res.data.responsibleDept,
            linkId: res.data.responsibleDept,
          },
        ];
        res.data.revisionStatusName = "";
        this.revisionTypeList.forEach((item) => {
          if (item.id == res.data.revisionStatus) {
            res.data.revisionStatusName = item.text;
          }
        });
        Promise.all([
          getUserInfoByOrgId(res.data.responsible),
          getOrgsMemberByIds(arr),
        ]).then((response) => {
          res.data.initDataStr = `{"type":"PERSONNEL","orgId":"${response[0].data.departments[0].id}.${res.data.responsible}","linkId":"${res.data.responsible}"}`;
          res.data.deptInitDataStr = `{"type":"DEPT","orgId":"${res.data.responsibleDept}","linkId":"${res.data.responsibleDept}"}`;
          res.data.responsibleName = response[0].data.mi;
          res.data.responsibleDeptName = response[1].data[0];
          this.formData = res.data;
          this.loading = false;
        });
      });
    },
    selectRoleUser(data) {
      //责任人
      if (!data.id && data.itemArray.length === 0) {
        //人员删除
        this.formData.responsible = "";
        this.formData.initDataStr = "";
        this.$refs.questionListForm.validateField("responsible");
      } else {
        this.formData.responsible = data.itemArray[0].linkId;
        this.$refs.selectUser.clearValidate();
      }
    },
    selectRoleDept(data) {
      //责任部门
      if (!data.id && data.itemArray.length === 0) {
        this.formData.deptInitDataStr = "";
        this.formData.responsibleDept = "";
        this.$refs.questionListForm.validateField("responsibleDept");
      } else {
        this.formData.responsibleDept = data.orgId;
        this.$refs.selectDept.clearValidate();
      }
    },
    delRowItem(index) {
      if (this.infoList.length === 0) {
        return;
      }
      let i = index || this.infoList.length - 1;
      this.infoList.splice(i, 1);
    },
    addRowItem() {
      this.infoList.push({});
    },
    onCancel() {
      EcoUtil.getSysvm().closeDialog();
    },
  },
};
</script>
<style scoped>
.questionDetails {
  background: #fff;
  height: 100%;
}

.questionDetails .btn {
  text-align: center;
  padding: 10px;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  right: 0;
  border-top: 1px solid #ddd;
}

.questionDetails .addForm {
  overflow: auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 60px;
  padding: 0 10px;
  padding-top: 20px;
}

.questionDetails .addForm .el-input,
.questionDetails .addForm .el-select {
  width: 200px;
}
.viewContent {
  color: #606266;
}
</style>