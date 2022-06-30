<template>
    <div>
        <!-- TECH_INNOVATION_DEPT_CREATE //科技创新编织部发起 -->
        <el-form v-if="this.phaseId == 'TECH_INNOVATION_DEPT_CREATE'" :model="form" label-width="100px" style="margin-top: 20px;">
            <el-row>
                <el-col :span="11">
                    <el-form-item label="部门">
                        <tag-select style="width:100%" :initDataStr="deptInitDataStr" :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(val)=>selectRoleDept(val,'dept')">
                        </tag-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="科室">
                        <tag-select style="width:100%" :initDataStr="deptInitDataStr_office" :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(val)=>selectRoleDept(val,'office')">
                        </tag-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="11">
                    <el-form-item label="分标委">
                        <el-select v-model="form.subcommittee" placeholder="请选择" style="width:100%">
                            <el-option v-for="(item,index) in subcommitteeList" :key="index" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="责任人">
                        <tag-select style="width:100%" :initDataStr="userInitDataStr_User" :initOptions="{selectNum:1,selectType:'User'}" @callBack="(val)=>selectRoleUser(val,'office')">
                        </tag-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!-- DEPT_LIAISON_PROOF 部门联络员 -->
        <el-form v-if="this.phaseId == 'DEPT_LIAISON_PROOF'" :model="form" label-width="100px" style="margin-top: 20px;">
            <el-row>
                <el-col :span="11">
                    <el-form-item label="科室">
                        <tag-select style="width:100%" :initDataStr="deptInitDataStr_office" :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(val)=>selectRoleDept(val,'office')">
                        </tag-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="分标委">
                        <el-select v-model="form.subcommittee" placeholder="请选择" style="width:100%">
                            <el-option v-for="(item,index) in subcommitteeList" :key="index" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!-- OFFICE_LIAISON_CHOOSE 科室联络员 -->
        <el-form v-if="this.phaseId == 'OFFICE_LIAISON_CHOOSE'" :model="form" label-width="100px" style="margin-top: 20px;">
            <el-row>
                <el-col :span="11">
                    <el-form-item label="责任人">
                        <tag-select style="width:100%" :initDataStr="userInitDataStr_User" :initOptions="{selectNum:1,selectType:'User'}" @callBack="(val)=>selectRoleUser(val,'office')">
                        </tag-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="分标委">
                        <el-select v-model="form.subcommittee" placeholder="请选择" style="width:100%">
                            <el-option v-for="(item,index) in subcommitteeList" :key="index" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="btn">
            <el-button type="primary" @click="saveInfo">保 存</el-button>
            <el-button @click="onClose">取 消</el-button>
        </div>
    </div>
</template>

<script>
import {
  getSubList,
  batchModDept
} from "../../service/service.js";
import { EcoUtil } from "@/components/util/main.js";
import tagSelect from "@/components/orgPick/tagSelect.vue";
export default {
    name:"",
    data() {
        return {
            form: {
                ids: [],  //选择部门的id合集
                dept: '',  //部门
                office: '',  //科室
                subcommittee: '', //分标委
                responsibleUser: '' //责任人
            },
            subcommitteeList: [],
            deptInitDataStr: '',
            deptInitDataStr_office: '',
            userInitDataStr_User: '',
            phaseId: null
        }
    },
    components: {
        tagSelect,
    },
    created() {
        this.phaseId = this.$route.params.phaseId
        console.log(this.phaseId)
        this.form.ids = this.$route.params.ids.split(',')
        this.getSubList()
    },
    mounted() {

    },
    methods: {
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
          this.form.responsibleUser = "";
          this.userInitDataStr_User = "";
      } else {
          this.form.responsibleUser = data.itemArray[0].linkId;
          this.userInitDataStr_User = `{"type":"PERSONNEL","orgId":"${data.orgId}","linkId":"${data.orgId}"}`;
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
    },
        //获取分标委列表
        getSubList() {
            getSubList().then(res => {
                this.subcommitteeList = res.data.rows
            })
        },
        saveInfo() {
            batchModDept(this.form).then(res => {
                this.$message.success("修改成功")
                let doObj = {};
                doObj.action = "editStandard";
                doObj.close = true;
                doObj.data = '';
                EcoUtil.getSysvm().callBackDialogFunc(doObj);
            })
        },
        onClose() {
            EcoUtil.getSysvm().closeDialog();
        },
    }
}
</script>
<style scoped>
/* @import url(); 引入css类 */
.btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>
