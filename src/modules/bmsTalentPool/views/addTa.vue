<template>
  <div class="addTa">
    <div class="checkmsg" v-show="Tooltipflag">
      <span>此信息可能已在人才库中存在,请确认！</span>
      <a @click="showInfo">点击查看</a>
    </div>
    <el-form
      :inline="true"
      :model="addForm"
      :rules="rules"
      ref="addForm"
      class="addForm"
      label-width="120px"
    >
      <el-row>
        <el-col :span="12"
          ><el-form-item label="姓名" prop="name">
            <el-input
              v-model="addForm.name"
              @change="getTooltipMsg"
              style="width: 168px"
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="12"
          ><el-form-item label="简历来源" prop="resumeSource">
            <el-select
              v-model="addForm.resumeSource"
              placeholder="请选择"
              filterable
              clearable
              style="width: 168px"
            >
              <el-option
                v-for="(item, index) in baseData['RESUMESOURCE'].data"
                :key="index"
                :label="item.text"
                :value="item.id"
              >
              </el-option>
            </el-select> </el-form-item
        ></el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="标签">
            <div class="abc" style="width: 475px">
              <el-tag
                :key="tag.name"
                v-for="(tag, i) in dynameicTags"
                @click="changTag(i)"
                :type="tag.type"
                style="cursor: pointer;"
              >
                {{ tag.name }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="mini"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="mini"
                @click="showInput"
                >+添加</el-button
              >
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="收到简历日期">
            <el-date-picker
              style="width: 168px"
              v-model="addForm.resumeDate"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别">
            <el-select
              v-model="addForm.gender"
              placeholder="请选择"
              filterable
              clearable
              style="width: 168px"
            >
              <el-option
                v-for="(item, index) in baseData['GENDER'].data"
                :key="index"
                :label="item.text"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="年龄" prop="age">
            <el-input
              v-model.number="addForm.age"
              style="width: 168px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="婚育情况">
            <el-select
              style="width: 168px"
              v-model="addForm.marriage"
              placeholder="请选择"
              filterable
              clearable
            >
              <el-option
                v-for="(item, index) in baseData['MARRIAGE'].data"
                :key="index"
                :label="item.text"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所在省市">
            <el-cascader
              style="width: 168px"
              clearable
              :options="areaOptions"
              v-model="addForm.address"
              placeholder="请选择所在省市"
              @change="addressChange"
            >
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="phone">
            <el-input
              v-model="addForm.phone"
              @change="getTooltipMsg"
              style="width: 168px"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="行业经验" prop="experience">
            <!-- 下拉选择更好 -->
            <el-input
              v-model="addForm.experience"
              placeholder="XX行业XX职位XX年"
              style="width: 168px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="目前状态" prop="currentState">
            <el-select
              v-model="addForm.currentState"
              placeholder="请选择"
              filterable
              clearable
              style="width: 168px"
            >
              <el-option
                v-for="(item, index) in baseData['CURRENTSTATE'].data"
                :key="index"
                :label="item.text"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="简历匹配岗位" prop="resumeJob">
            <!-- <el-input
              v-model="addForm.resumeJob"
              style="width: 168px"
            ></el-input> -->
            <el-select v-model="addForm.resumeJob" placeholder="请选择">
              <el-option
                v-for="(item, index) in baseData['BMS.TALENT.JOB'].data"
                :key="index"
                :label="item.text"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="岗位匹配度(%)" prop="resumeJobMatch">
            <el-input v-model="addForm.resumeJobMatch" style="width: 168px">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="下次跟进时间">
            <el-date-picker
              style="width: 168px"
              v-model="addForm.followNextDate"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm"
              format="yyyy-MM-dd HH:mm"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="跟进状态/结果">
            <el-cascader
              style="width: 168px"
              clearable
              v-model="followStatusAndResult"
              @change="handleFollowChange"
              :key="is_cascader"
              ref="cascader"
              :props="props"
            >
            </el-cascader>
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="HR状态">
            <el-cascader
              style="width: 350px"
              clearable
              v-model="addForm.hrStatus"
              :props="{ emitPath: false }"
              @change="handleFollowChange"
              @remove-tag="removeTag"
              :key="is_cascader"
              ref="cascader"
              :options="HR"
            >
            </el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="false">
        <el-col :span="24">
          <el-form-item label="BP状态">
            <el-cascader
              style="width: 350px"
              clearable
              v-model="addForm.bpStatus"
              @change="handleFollowChangeBP"
              @remove-tag="removeTagBP"
              :key="is_cascaderBP"
              ref="cascadera"
              :props="{ emitPath: false }"
              :options="BP"
            >
            </el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input
              type="textarea"
              v-model="addForm.comment"
              style="width: 450px"
              :rows="4"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 人才详情卡片 -->
    <el-dialog
      :visible="dialogVisible"
      :show-close="true"
      width="800px"
      top="20"
      :modal="false"
      :append-to-body="false"
      :modal-append-to-body="false"
      :destroy-on-close="false"
      @close="hideDialog()"
      @open="cleanDialogData()"
      class="attrDialog"
    >
      <router-view name="sideRouterView" ref="sideRouterViewRef"></router-view>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { provinceAndCityData, CodeToText } from "element-china-area-data";
import tagSelect from "@/components/orgPick/tagSelect.vue";

import {
  addTalent,
  getTreeKvListByParentId,
  getCascaderNode,
  getDuplicate,
  getAddTag,
} from "@/modules/bmsTalentPool/service/service.js";
export default {
  name: "addTa",
  components: {
    tagSelect,
  },
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        callback();
      } else if (!Number.isInteger(value)) {
        callback(new Error("请输入数字值"));
      } else {
        callback();
      }
    };
    return {
      followStatusAndResult: [],
      dialogVisible: false, //控制人才详情卡片
      currentTime: "",
      areaOptions: provinceAndCityData,
      Tooltipflag: false, //控制确认信息出现
      flag:'',
      identicalbms: {}, //相同人才信息
      addForm: {
        name: "",
        resumeSource: "",
        gender: "",
        age: "",
        marriage: "",
        address: "",
        province: "",
        city: "",
        phone: "",
        currentState: "",
        resumeJob: "",
        resumeJobMatch: "",
        hrStatus: "",
        bpStatus: "",
        followNextDate: "",
        comment: "",
        labels: [],
      },
      rules: {
        name: [{ required: true, message: "请输入简历名称", trigger: "blur" }],
        resumeSource: [
          { required: true, message: "请选择简历来源", trigger: "change" },
        ],
        phone: [{ required: true, message: "请输入联系电话", trigger: "blur" }],
        experience: [
          { required: true, message: "请输入行业经验", trigger: "blur" },
        ],
        currentState: [
          { required: true, message: "请选择目前状态", trigger: "change" },
        ],
        resumeJob: [
          { required: true, message: "请输入简历匹配岗位", trigger: "blur" },
        ],
        age: [{ validator: checkAge, trigger: "blur" }],
      },
      is_cascader: 0,
      is_cascaderBP:0,
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          let nodes = [];
          if (level == 0) {
            getTreeKvListByParentId("BMS-HR-STATUS").then((res) => {
              nodes = res.data.map((item) => ({
                value: item.id,
                label: item.text,
              }));
              resolve(nodes);
            });
          } else {
            getCascaderNode(node.value).then((res) => {
              nodes = res.data.map((item) => ({
                value: item.id,
                label: item.text,
              }));
              resolve(nodes);
            });
          }
        },
      },
      dynameicTags: [], //多选标签
      inputVisible: false, //控制添加标签input的显示与隐藏
      inputValue: "", // 添加标签input值
      HR: [], //联级选择器值
      BP: [], //联级选择器值
    };
  },
  computed: {
    ...mapGetters(["baseData", "getBaseDataTextByKey"]),
  },
  created() {
    this.changState();
    this.HR=JSON.parse(sessionStorage.getItem('HR'))
    this.BP=JSON.parse(sessionStorage.getItem('BP'))
    this.initProjectBaseData("create-enabled").then(() => {
      this.loading = false;
    });
  },
  methods: {
    removeTag(tag) {
      this.flag = tag;
      //  this.searchForm.followResult.forEach((item,index)=>{
      //     if(tag==item){
      //       this.searchForm.followResult.splice(index,1)
      //     }
      //  })
    },
    removeTagBP(tag) {
      this.flag = tag;
      //  this.searchForm.followResult.forEach((item,index)=>{
      //     if(tag==item){
      //       this.searchForm.followResult.splice(index,1)
      //     }
      //  })
    },
    ...mapActions(["initProjectBaseData"]),
    cleanInfo() {

      this.Tooltipflag = false;
      this.changState();
      for (const key in this.addForm) {
        this.addForm[key] = "";
      }
      this.addForm.labels = [];

    },
    addressChange(arr) {
      this.addForm.province = CodeToText[arr[0]];
      this.addForm.city = CodeToText[arr[1]];
    },
    handleFollowChange(val) {
      this.addForm.hrStatus = val;
    },
    handleFollowChangeBP(val) {
      this.addForm.bpStatus = val;
    },
    saveData() {
      // 校验跟进时间
      this.currentTime = Date.parse(new Date());
      let followNextDate = Date.parse(this.addForm.followNextDate);
      if (this.currentTime > followNextDate) {
        this.$message.error("下次跟进时间应晚于当前时间");
        return;
      }
      this.$refs["addForm"].validate(async (valid) => {
        if (valid) {
          // 判断人才信息是否重复
          if (this.Tooltipflag) {
            // 重复确认框
            this.$confirm(
              "此信息可能已在人才库中存在，确定仍要提交？",
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }
            )
              .then(async () => {
                // 提交数据
                const res = await addTalent(this.addForm);
                if (res.data.id) {
                  this.$message.success("添加成功");
                  this.$parent.$parent.trivialDialogVisible = false;
                  this.$parent.$parent.getTaList();
                }
                console.log("abc");
              })
              .catch(() => {
                return 0;
              });
          } else {
            //提交数据
            const res = await addTalent(this.addForm);
            if (res.data.id) {
              this.$message.success("添加成功");
              this.$parent.$parent.trivialDialogVisible = false;
              this.$parent.$parent.getTaList();
            }
          }
        } else {
          return false;
        }
      });
    },
    // 名字与电话输入框失去焦点触发事件
    getTooltipMsg() {
      if (this.addForm.name != "" || this.addForm.phone != "") {
        getDuplicate(this.addForm).then((res) => {
          // console.log(res.data.length)
          if (res.data.length) {
            const msg = res.data;
            this.identicalbms = msg[0];
            this.Tooltipflag = true;
          } else {
            this.Tooltipflag = false;
          }
        });
      } else {
        this.Tooltipflag = false;
      }
    },
    hideDialog() {
      this.dialogVisible = false;
    },
    cleanDialogData() {
      if (typeof this.$refs.sideRouterViewRef != "undefined") {
        this.$refs.sideRouterViewRef.cleanInfo();
      }
    },
    showInfo(row) {
      // localStorage.setItem('followOptions',JSON.stringify(this.statusOptions))
      let ta_id = this.identicalbms.id;
      this.dialogVisible = true;
      if (typeof this.$refs.sideRouterViewRef == "undefined") {
        this.$router.push({ name: "taInfo", query: { ta_id: ta_id } });
      } else {
        this.$refs.sideRouterViewRef.getTaInfo(ta_id);
        this.$refs.sideRouterViewRef.getFollowList(ta_id);
        this.$refs.sideRouterViewRef.getFileList();
      }
    },
    // 添加标签输入框失去焦点或按下回车键
    handleInputConfirm() {
      let inputValueb = {};
      inputValueb.name = this.inputValue;
      inputValueb.type = "info";
      if (inputValueb.name) {
        getAddTag(inputValueb.name).then((res) => {
          let addTagobj = {};
          addTagobj.name = res.data.text;
          addTagobj.id = res.data.id;
          addTagobj.type = "info";
          this.dynameicTags.push(addTagobj);
        });
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    // 当添加标签按钮被点击
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 当标签被点击
    changTag(i) {
      this.dynameicTags[i].type
        ? (this.dynameicTags[i].type = "")
        : (this.dynameicTags[i].type = "info");
      this.addForm.labels = [];
      for (let z = 0; z < this.dynameicTags.length; z++) {
        if (this.dynameicTags[z].type != "info") {
          let zobj = {};
          zobj.label = this.dynameicTags[z].id;
          this.addForm.labels.push(zobj);
        }
      }
    },
    // 获取标签
    changState() {
      // console.log(this.baseData['BMS.TALENT.LABEL'].data[0])
      this.dynameicTags = [];
      for (let x = 0; x < this.baseData["BMS.TALENT.LABEL"].data.length; x++) {
        let tagobj = {};
        tagobj.name = this.baseData["BMS.TALENT.LABEL"].data[x].text;
        tagobj.id = this.baseData["BMS.TALENT.LABEL"].data[x].id;
        tagobj.type = "info";
        this.dynameicTags.push(tagobj);
      }
    },
  },
};
</script>

<style scoped>
.el-form /deep/ .formItemDiv {
  display: inline-block;
}
.el-form /deep/ .el-form-item {
  margin-bottom: 15px;
}
.el-form /deep/ .el-form-item__error {
  padding-top: 1px;
}
.el-form /deep/ .tagSelect {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.addTa .checkmsg {
  margin-left: 20px;
  margin-bottom: 20px;
  color: red;
}

.addTa .checkmsg a {
  color: #409eff;
}
.el-tag + .el-tag {
  margin-left: 10px;
  margin-top: 3px;
}
.button-new-tag {
  margin-left: 10px;
  height: 25px;
  line-height: 22px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
<style>
.trivialDialog .el-dialog {
  margin-top: 0px !important;
}
</style>
