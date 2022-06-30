<template>
  <div class="editTa">
    <el-form
      :model="addForm"
      :rules="rules"
      ref="addForm"
      class="addForm"
      label-width="120px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="addForm.name" style="width: 168px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="简历来源" prop="resumeSource">
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
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="标签">
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
              v-model="addForm.marriage"
              placeholder="请选择"
              filterable
              clearable
              style="width: 168px"
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
              :options="areaOptions"
              v-model="address"
              placeholder="请选择所在省市"
              @change="addressChange"
            >
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="addForm.phone" style="width: 168px"></el-input>
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
            <el-input
              v-model="addForm.resumeJobMatch"
              style="width: 168px"
            ></el-input>
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
              v-model="this.addForm.hrStatus"
              :options="statusOptions"
              @change="handleFollowChange"
              :key="is_cascader"
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
              :options="HR"
              @change="handleFollowChange"
              :key="is_cascader"
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
              :options="BP"
              @change="handleFollowChangeBP"
              :key="is_cascader_BP"
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
              :rows="4"
              style="width: 450px"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  provinceAndCityData,
  CodeToText,
  TextToCode,
} from "element-china-area-data";
import tagSelect from "@/components/orgPick/tagSelect.vue";
import {
  updateTalent,
  getSingleTalentInfo,
  getAddTag,
} from "@/modules/bmsTalentPool/service/service.js";

export default {
  name: "editTa",
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
      currentTime: "",
      is_cascader: 0,
      is_cascader_BP: 0,
      followStatusAndResult: [],
      HR: [],
      BP: [],
      areaOptions: provinceAndCityData,
      address: [],
      addForm: {
        id: "",
        name: "",
        resumeSource: "",
        gender: "",
        age: "",
        marriage: "",
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
      dynameicTags: [], //多选标签
      inputVisible: false, //控制添加标签input的显示与隐藏
      inputValue: "", // 添加标签input值
    };
  },
  computed: {
    ...mapGetters(["baseData", "getBaseDataTextByKey"]),
  },
  created() {
    this.changState();
    this.initProjectBaseData("create-enabled").then(() => {
      this.loading = false;
    });
  },
  methods: {
    async getInfo() {
      const res = await getSingleTalentInfo(this.addForm.id);
      this.addForm = res.data;
      this.address = [];
      // this.followStatusAndResult = res.data.followResultList.reverse();
      this.is_cascader++;
      this.is_cascader_BP++;
      this.address.push(TextToCode[res.data.province].code);
      this.address.push(TextToCode[res.data.province][res.data.city].code);
      let chechTag = []
      let checkobj = {}
      for(let j = 0; j < this.addForm.labels.length; j++) {
        checkobj = {}
        checkobj.label = this.addForm.labels[j].label
        chechTag.push(checkobj)
      }
      this.addForm.labels = chechTag
      for(let i = 0; i< this.addForm.labels.length; i++) {
        for(let j = 0; j< this.dynameicTags.length; j++) {
          if(this.addForm.labels[i].label == this.dynameicTags[j].id) {
            this.dynameicTags[j].type = ''
          }
        }
      }
    },
    ...mapActions(["initProjectBaseData"]),
    cleanInfo() {
      this.addForm.id = "";
    },
    addressChange(arr) {
      this.addForm.province = CodeToText[arr[0]];
      this.addForm.city = CodeToText[arr[1]];
    },
    handleFollowChange(val) {
      // console.log(val[val.length - 1])
      this.addForm.hrStatus = val[val.length - 1];
    },
    handleFollowChangeBP(val) {
      this.addForm.bpStatus = val[val.length - 1];
    },
    saveData() {
      // 校验跟进时间
      let followNextDate = Date.parse(this.addForm.followNextDate);
      if (this.currentTime > followNextDate) {
        this.$message.error("下次跟进时间应晚于当前时间");
        return;
      }
      this.$refs["addForm"].validate(async (valid) => {
        if (valid) {
          const res = await updateTalent(this.addForm);
          if (res.data.id) {
            this.$message.success("更新成功");
            this.$parent.$parent.dialogVisible = false;
            this.$parent.$parent.$parent.$parent.getTaList();
            this.$parent.$parent.getTaInfo(this.addForm.id);
          }
        } else {
          return false;
        }
      });
    },
    setTaId(id) {
      this.HR = JSON.parse(sessionStorage.getItem("HR"));
      this.BP = JSON.parse(sessionStorage.getItem('BP'));
      this.addForm.id = id;
      this.currentTime = Date.parse(new Date());
      this.changState();
      this.getInfo();
    },
    // 获取标签
    changState() {
      this.dynameicTags = [];
      for (let x = 0; x < this.baseData["BMS.TALENT.LABEL"].data.length; x++) {
        let tagobj = {};
        tagobj.name = this.baseData["BMS.TALENT.LABEL"].data[x].text;
        tagobj.id = this.baseData["BMS.TALENT.LABEL"].data[x].id;
        tagobj.type = "info";
        this.dynameicTags.push(tagobj);
      }
    },
    // 添加标签输入框失去焦点或按下回车键
    handleInputConfirm() {
      let inputValue = {};
      inputValue.name = this.inputValue;
      inputValue.type = 'info';
        if (inputValue.name) {
          getAddTag(inputValueb.name).then((res) => {
          let addTagobj = {};
          addTagobj.name = res.data.text;
          addTagobj.id = res.data.id;
          addTagobj.type = "info";
          this.dynameicTags.push(addTagobj);
        });
        }
        this.inputVisible = false;
        this.inputValue = '';
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
      // console.log(i)
      this.dynameicTags[i].type
        ? (this.dynameicTags[i].type = "")
        : (this.dynameicTags[i].type = "info");
      this.addForm.labels = [];
      for (let z = 0; z < this.dynameicTags.length; z++) {
        if (this.dynameicTags[z].type != "info") {
          let zobj = {}
          zobj.label = this.dynameicTags[z].id
          this.addForm.labels.push(zobj);
        }
      }
    },
    // 标签匹配
    tagMatching() {
    }
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
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
