<template>
  <div class="ReexaminationForm">
    <el-form :model="form" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="标准编号">
            <el-input v-model="form.programNumber" disabled ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标准名称">
            <el-input v-model="form.programName" disabled ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="使用情况">
            <el-select v-model="form.usage"  style="width:100%" disabled >
              <el-option v-for="item in usage" :key="item.id" :label="item.text" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="复审结论">
        <el-radio-group v-model="form.reviewConclusion" disabled >
          <el-radio v-for="(item,key,index) in review" :key="index" :label="key">{{item}}</el-radio>
        </el-radio-group>
        <div class="box">
          <div v-show="form.reviewConclusion == 'ENABLE'">
            <span style="color:#606265">标准状况说明</span>
            <el-input style=" margin-top: 10px;" disabled  type="textarea" :rows="6"  v-model="form.standardSituation">
            </el-input>
          </div>
          <div v-show="form.reviewConclusion == 'OBSOLETED'">
            <span style="color:#606265">废止理由说明</span>
            <el-input style=" margin-top: 10px;" disabled  type="textarea" :rows="6"  v-model="form.revocationReason">
            </el-input>
          </div>
          <div v-show="form.reviewConclusion == 'MODIFY'">
            <el-row>
              <el-col :span="12">
                <el-form-item label="修订方案及名称">
                  <el-input v-model="form.revisedProject" disabled ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="修订人">
                  <tag-select style="width:100%" disabled  :initDataStr="userInitDataStr" :initOptions="{selectNum:1,selectType:'User'}" @callBack="(val)=>selectRoleUser(val)">
                  </tag-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="会签完成时间">
                  <el-date-picker style="width:100%" disabled  v-model="form.countersignTime" type="date" value-format="yyyy-MM-dd" >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="初稿完成时间">
                  <el-date-picker style="width:100%" disabled  v-model="form.draftTime" type="date" value-format="yyyy-MM-dd" >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="内容简介">
              <el-input style=" margin-top: 10px;" disabled  type="textarea" :rows="4"  v-model="form.introduction">
              </el-input>
            </el-form-item>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="备注">
        <el-input style=" margin-top: 10px;" disabled  type="textarea" :rows="3"  v-model="form.remarks">
        </el-input>
      </el-form-item>
    </el-form>
    <!-- <div class="btn">
      <el-button type="primary" @click="saveTable">保 存</el-button>
      <el-button @click="onClose">取 消</el-button>
    </div> -->
  </div>
</template>
<script>
import {
  getEnumSelectEnabled,
  getReview,
  getReexaminationForm,
  saveReexaminationAjax,
} from "../../service/service.js";
import tagSelect from "@/components/orgPick/tagSelect.vue";
import { EcoUtil } from "@/components/util/main.js";
export default {
  components: {
    tagSelect,
  },
  data() {
    return {
      id: "",
      form: {},
      usage: [],
      review: {},
      userInitDataStr: "", //修订人初始化
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.getbaseInfo();
    this.getReviewConclusion();
    this.getReexaInfo();
  },
  methods: {
    // 获取基础数据
    getbaseInfo() {
      getEnumSelectEnabled("shiyongqingkuang").then((res) => {
        this.usage = res.data;
      });
    },
    // 获取复审结论
    getReviewConclusion() {
      getReview().then((res) => {
        this.review = res.data.data;
      });
    },
    // 选人组件回调
    selectRoleUser(data) {
      if (!data.id && data.itemArray.length === 0) {
        this.form.revisedUser = "";
        this.userInitDataStr = "";
      } else {
        this.form.revisedUser = data.itemArray[0].linkId;
        this.userInitDataStr = `{"type":"PERSONNEL","orgId":"${data.orgId}","linkId":"${data.orgId}"}`;
      }
    },
    getReexaInfo() {
      getReexaminationForm(this.id).then((res) => {
        // console.log(res)
        this.form = res.data.data;
        // let arr = []
        // arr = this.form.revisedUser.split(".")
        if(this.form.revisedUser) {
          this.userInitDataStr = `{"type":"PERSONNEL","orgId":"${this.form.revisedUser}","linkId":"${this.form.revisedUser}"}`;
        }
        // console.log(this.userInitDataStr)
      });
    },
    saveTable() {
      this.form.id = this.id
      if (this.form.reviewConclusion) {
        if (this.form.reviewConclusion == "ENABLE") {
          if (this.form.standardSituation) {
            saveReexaminationAjax(this.form).then((res) => {
              if (res.data.success) {
                this.$message({
                  message: "保存成功",
                  type: "success",
                  duration: 1000,
                  onClose: () => {
                    let doObj = {};
                    doObj.action = "ReexaminationForm";
                    doObj.close = true;
                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
                  },
                });
              }
            });
          }else {
            this.$message.error("标准状况说明不能为空！");
          }
        }
        if (this.form.reviewConclusion == "OBSOLETED") {
          if (this.form.revocationReason) {
            saveReexaminationAjax(this.form).then((res) => {
              if (res.data.success) {
                this.$message({
                  message: "保存成功",
                  type: "success",
                  duration: 1000,
                  onClose: () => {
                    let doObj = {};
                    doObj.action = "ReexaminationForm";
                    doObj.close = true;
                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
                  },
                });
              }
            });
          }else {
            this.$message.error("废止理由说明不能为空！");
          }
        }
        if (this.form.reviewConclusion == "MODIFY") {
          if(this.form.revisedProject && this.form.revisedUser && this.form.countersignTime && this.form.draftTime && this.form.introduction) {
            saveReexaminationAjax(this.form).then((res) => {
              if (res.data.success) {
                this.$message({
                  message: "保存成功",
                  type: "success",
                  duration: 1000,
                  onClose: () => {
                    let doObj = {};
                    doObj.action = "ReexaminationForm";
                    doObj.close = true;
                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
                  },
                });
              }
            });
          } else {
            this.$message.error("复审结论框内不能为空！");
          }
        }
      } else {
        this.$message.error("复审结论不能为空！");
      }
    },
    onClose() {
      EcoUtil.getSysvm().closeDialog();
    },
  },
};
</script>
<style scoped>
.ReexaminationForm {
  margin: 10px 20px;
}
.ReexaminationForm .box {
  height: 220px;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  margin-top: 10px;
  background-color: #f5f5f5;
}
.ReexaminationForm .box .el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 3px;
}
.ReexaminationForm .btn {
  text-align: right;
  margin: 20px 10px;
}
</style>
