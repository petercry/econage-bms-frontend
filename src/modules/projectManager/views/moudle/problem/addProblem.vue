<template>
  <div class="addProblem">
    <el-form
      :inline="true"
      :model="form"
      :rules="rules"
      ref="addForm"
      class="addForm"
      label-width="120px"
    >
      <el-form-item label="问题编号">
        <el-input
          v-model="form.code"
          readonly
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item
        label="问题名称"
        prop="name"
      >
        <el-input
          v-model.trim="form.name"
          placeholder="请输入问题名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="提出人">
        <tag-select
          style="width: 100%;vertical-align: top;"
          ref="tagSelect"
          disabled
          :initDataStr="initDataStr_Proposer"
          :initOptions="{selectNum:1,selectType:'USER'}"
          @callBack="selectProposer"
        >
        </tag-select>
      </el-form-item>
      <el-form-item label="提出日期">
        <el-date-picker
          type="date"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          placeholder="选择日期"
          v-model="form.startDate"
          style="width: 100%;"
          disabled
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        label="计划完成时间"
        prop="planEndDate"
        required
      >
        <el-date-picker
          type="date"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          placeholder="选择日期"
          v-model="form.planEndDate"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        label="问题状态"
        prop="status"
        required
      >
        <el-select
          disabled
          v-model="form.status"
          placeholder="请选择"
          filterable
          clearable
        >
          <el-option
            v-for="(item,index) in baseData['faw_pm_pro_status']"
            :key="index"
            :label="item.text"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="责任人"
        prop="dutyUserId"
        required
      >
        <tag-select
          style="width: 100%;vertical-align: top;"
          ref="tagSelect"
          :initDataStr="initDataStr_Person"
          :initOptions="{selectNum:1,selectType:'USER'}"
          @callBack="selectDutyPerson"
        >
        </tag-select>
      </el-form-item>
      <el-form-item
        label="责任部门"
        prop="dutyDeptName"
      >
        <!-- <tag-select
                    style="width: 100%;vertical-align: top;"
                    ref="tagSelect"
                    :initDataStr="initDataStr_Dept"
                    :initOptions="{selectNum:1,selectType:'DEPT'}"
                    @callBack="selectDutyDept" >
                </tag-select> -->
        <el-input
          v-model="form.dutyDeptName"
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item
        label="重要性"
        prop="importantLevel"
        required
      >
        <el-select
          v-model="form.importantLevel"
          placeholder="请选择"
        >
          <el-option
            v-for="(item,index) in baseData['faw_pm_pro_important']"
            :key="index"
            :label="item.text"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="紧急度"
        prop="urgent"
        required
      >
        <el-select
          v-model="form.urgent"
          placeholder="请选择"
        >
          <el-option
            v-for="(item,index) in baseData['faw_pm_pro_urgent']"
            :key="index"
            :label="item.text"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      </el-form-item>
      <el-form-item
        label="关注级别"
        prop="attention"
        required
      >
        <el-select
          v-model="form.attention"
          placeholder="请选择"
          clearable
          @change="changeAttention"
        >
          <el-option
            v-for="(item,index) in baseData['faw_pm_pro_attention']"
            :key="index"
            :label="item.text"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="所属领域"
        prop="field"
        required
        v-if="attentionType"
        ref="field"
      >
        <el-select
          v-model="form.field"
          clearable
        >
          <el-option
            v-for="(item,index) in baseData['faw_pm_field_type']"
            :key="index"
            :label="item.text"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        class="allItem"
        label="问题描述"
        prop="describe"
      >
        <el-input
          type="textarea"
          v-model.trim="form.describe"
          placeholder="请输入描述"
          rows="3"
        ></el-input>
      </el-form-item>
      <el-form-item
        class="allItem myRule"
        label="解决措施"
        prop="pmInfoProblemMeasures"
      >
        <div
          v-for="(item,index) in form.pmInfoProblemMeasuresEntityList"
          :key="index"
        >
          <el-input
            v-model="item.text"
            style="width:65%;display: inline-block;marginBottom:4px"
          >
          </el-input>
          <tag-select
            style="width: 30%;vertical-align: top;"
            ref="tagSelect"
            :initDataStr="item.initDataStr"
            :initOptions="{selectNum:1,selectType:'USER'}"
            @callBack="(data)=>selectDutyMeaPer(data,item)"
          >
          </tag-select>
          <el-button
            icon="el-icon-minus"
            type="danger"
            size="mini"
            circle
            style="float:right;margin-top:8px"
            @click="delMeasureLine(index,form.pmInfoProblemMeasuresEntityList)"
          ></el-button>
        </div>
        <el-button
          type="primary"
          style="float:right;marginTop:10px"
          @click="addMeasureLine"
        >添加</el-button>
      </el-form-item>
      <el-form-item
        class="allItem"
        label="备注"
        prop="comments"
      >
        <el-input
          v-model="form.comments"
          type="textarea"
          rows="2"
        ></el-input>
      </el-form-item>
      <el-form-item
        class="allItem"
        label="文档上传"
        prop="wenjian"
      >
        <el-input>
          <template slot="prefix">
            <span
              @click="goAttachementPage"
              class="pointerClass"
            ><i class="el-icon-paperclip"></i>上传文件（上传文件大小限制为2G）</span>
            <ul class="fileList">
              <li
                v-for="(item,index) in fileLists"
                :key="index"
                class="fileItem"
              >
                <span class="imgType"><img
                    style="vertical-align: middle;"
                    :src="typeImgList[item.fileType]?typeImgList[item.fileType]:typeImgList['blank']"
                  />&nbsp;</span>
                <span
                  style="cursor:pointer;"
                  v-bind:class="item.operateFlag?'deleted':''"
                >{{item.name}}&nbsp;</span><span>(&nbsp;{{item.size | sizeTostr}}&nbsp;)</span>
                <span
                  class="download"
                  @click="fileDownload(item)"
                >下载</span>
                |<span
                  class="preview"
                  @click="filePreview(item)"
                >预览</span>
                <span
                  class="delete"
                  v-show="!item.operateFlag  "
                  @click="fileDelete(item,index)"
                >[ 点击删除 ]</span>
                <span
                  class="recovery"
                  v-show="item.operateFlag "
                  @click="fileRecovery(item,index)"
                >[ 点击恢复 ]</span>
              </li>
            </ul>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <div class="btn">
      <el-button
        class="plainBtn"
        size="medium"
        @click="onCancel"
      >取消</el-button>
      <el-button
        type="primary"
        size="medium"
        @click="onSave"
      >保存</el-button>
      <el-button
        type="primary"
        size="medium"
        @click="onSubmit"
      >提交</el-button>
    </div>
    <form
      name="docviewform"
      method="get"
    >
      <input
        type="hidden"
        name="fileHeaderId"
      />
      <input
        type="hidden"
        name="fileName"
      />
      <input
        type="hidden"
        name="fileHeaderIds"
      />
      <input
        type="hidden"
        name="expectedName"
      />
    </form>
    <iframe
      name="docviewIframe"
      style="display:none"
    ></iframe>
  </div>
</template>
<script>
import { EcoUtil } from '@/components/util/main.js'
import { EcoMessageBox } from '@/components/messageBox/main.js'
import { mapGetters, mapActions } from 'vuex'
import { getItemFetchId, getEnumSelectEnabled, getUserInfoByOrgId, getUserSelfInfo, getBelongField } from '../../../api/common.js'
import { createProblemCode, addProblem } from '../../../api/problem.js'
import tagSelect from '@/components/orgPick/tagSelect.vue'
// import ecoFileUploadBtn from '@/components/file/ecoFileUploadBtn.vue'
import { getTemplatesInfoList } from '../../../api/templates.js'
import { EcoFile } from '@/components/file/main.js'
import { EcoDate } from '@/components/date/main.js'
export default {
  name: 'addProblem',
  components: {
    tagSelect,
    //ecoFileUploadBtn
  },
  data() {
    return {
      loading: true,
      form: {
        id: "",
        infoId: "",
        code: "",
        name: "",
        proposerId: "",
        proposerName: "",
        startDate: "",
        planEndDate: "",
        status: "faw_pm_pro_status1",  //默认为草稿
        dutyUserId: "",
        dutyUserName: "",
        dutyDeptId: "",
        dutyDeptName: "",
        importantLevel: "",
        urgent: "",
        attention: "",
        describe: "",
        valid: true,
        field: '',
        pmInfoProblemMeasuresEntityList: [
          {
            text: "",
            initDataStr: "",
            userId: "",
            userName: ""
          }
        ]
      },

      rules: {
        name: [
          { required: true, message: '请输入问题名称', trigger: 'blur' },
        ],
        dutyUserId: [
          { required: true, message: '请选择责任人', trigger: 'change' }
        ],
        dutyDeptName: [
          { required: true, message: '请填写责任部门', trigger: 'change' }
        ],
        importantLevel: [
          { required: true, message: '请选择重要性', trigger: 'change' }
        ],
        urgent: [
          { required: true, message: '请选择紧急度', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择问题状态', trigger: 'change' }
        ],
        attention: [
          { required: true, message: '请选择关注级别', trigger: 'change' }
        ],
        describe: [
          { required: true, message: '请输入问题描述', trigger: 'blur' },
        ],
        planEndDate: [
          { required: true, message: '请填写计划完成时间', trigger: 'blur' },
        ],
        field: [
          { required: true, message: '请选择所属领域', trigger: 'change' },
        ]
      },
      initDataStr_PDT: "",
      initDataStr_POP: "",
      fileName: "",
      modularInnerId: "",
      linkModelItems: [],
      productTypeItems: [],
      initDataStr_Proposer: "",
      initDataStr_Person: "",
      initDataStr_Dept: "",
      modular: "project_manager",
      fileLists: [],
      loading: true,
      attentionType: false
    }
  },
  created() {
    this.form.infoId = this.$route.params.infoId
    this.form.startDate = EcoDate.formatDateDefault(new Date());
    this.bindAction();
    this.getItemFetchId();
    this.getUserInfo()
    // this.getFiled()
    this.initProjectBaseData('create-enabled').then(() => {
      this.loading = false;
    });
  },
  activated() {

  },

  mounted() {
  },

  computed: {
    ...mapGetters([
      'baseData',
      'getBaseDataTextByKey',
      'typeImgList'
    ]),
  },
  filters: {
    sizeTostr(value) {
      if (!value) return "0KB";
      return EcoUtil.getFileSize(value);
    }
  },
  methods: {
    ...mapActions([
      'initProjectBaseData',
    ]),
    // 附件上传回写
    bindAction() {
      let that = this;
      let callBackDialogFunc = function (obj) {
        if (obj && obj.action == 'onFileUploadActionCallBack') { //附件上传回写
          that.onFileUploadActionCallBack(obj.data);
        }
      }
      EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'addProblemVue');
    },
    getUserInfo() {
      getUserSelfInfo().then(res => {
        let obj = {}
        obj.type = 'PERSONNEL'
        let orgArr = []
        res.departments.forEach(item => {
          orgArr.push(item.id)
        });
        orgArr.push(res.id)
        obj.orgId = orgArr.join('.')
        obj.linkId = res.id
        this.initDataStr_Proposer = JSON.stringify(obj)
        this.form.proposerId = res.id
        this.form.proposerName = res.mi
      })
    },
    getFiled() {
      getBelongField(this.form.infoId).then(res => {
        this.form.field = res.field
      })
    },
    // 责任人
    selectDutyPerson(data) {
      if (data.itemArray.length > 0) {
        this.form.dutyUserId = data.itemArray[0].linkId;
        this.form.dutyUserName = data.itemArray[0].name;
        this.getDpetBylinkId(this.form.dutyUserId)
      } else {
        this.form.dutyUserId = "";
        this.form.dutyUserName = "";
        this.initDataStr_Person = "";
        this.form.dutyDeptId = "";
        this.form.dutyDeptName = ""
      }
    },
    // 提出人
    selectProposer(data) {
      if (data.itemArray.length > 0) {
        this.form.proposerId = data.itemArray[0].linkId;
        this.form.proposerName = data.itemArray[0].name;
      } else {
        this.form.proposerId = "";
        this.form.proposerName = "";
        this.initDataStr_Proposer = "";
      }
    },
    // 责任部门
    selectDutyDept(data) {
      if (data.itemArray.length > 0) {
        this.form.dutyDeptId = data.itemArray[0].linkId;
        this.form.dutyDeptName = data.itemArray[0].name;
      } else {
        this.form.dutyDeptId = "";
        this.form.dutyDeptName = "";
        this.initDataStr_Dept = "";
      }
    },
    // 解决措施人员
    selectDutyMeaPer(data, item) {
      if (data.itemArray.length > 0) {
        item.userId = data.itemArray[0].linkId;
        item.userName = data.itemArray[0].name;
      } else {
        item.userId = "";
        item.userName = "";
        item.initDataStr = ""
      }
    },
    getItemFetchId() {
      getItemFetchId().then(res => {
        this.modularInnerId = res;
        this.form.id = this.modularInnerId;
      })
    },
    getDpetBylinkId(id) {
      getUserInfoByOrgId(id).then(res => {
        this.form.dutyDeptId = res.departments[0].orgPathDeptList ? res.departments[0].orgPathDeptList[res.departments[0].orgPathDeptList.length - 1].id : '';
        this.form.dutyDeptName = res.departments[0].orgPathDeptList ? res.departments[0].orgPathDeptList[res.departments[0].orgPathDeptList.length - 1].i18nText : ''
      })
    },
    onCancel() {
      EcoUtil.getSysvm().closeDialog();
    },
    onSave() {
      // 不更改状态-保存为草稿

      let measuresList = this.form.pmInfoProblemMeasuresEntityList
      if (measuresList.length != 0) {
        for (let index = 0; index < measuresList.length; index++) {
          if (measuresList[index].text == '' || measuresList[index].userId == '') {
            this.$message.error('解决措施描述或负责人不能为空')
            return
          }
        }
      } else {
        this.$message.error('解决措施至少填写一行')
        return

      }

      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.addProblem();
        } else {
          return false;
        }
      });
    },
    onSubmit() {
      this.form.status = 'faw_pm_pro_status2'
      let measuresList = this.form.pmInfoProblemMeasuresEntityList
      if (measuresList.length != 0) {
        for (let index = 0; index < measuresList.length; index++) {
          if (measuresList[index].text == '' || measuresList[index].userId == '') {
            this.$message.error('解决措施描述或负责人不能为空')
            return
          }
        }
      } else {
        this.$message.error('解决措施至少填写一行')
        return
      }

      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          var that = this;
          let confirmYesFunc = function () {
            that.addProblem();
          }
          let options = {
            type: 'warning',
            lockScroll: false
          }
          EcoMessageBox.confirm('确定要提交吗?', '提示', options, confirmYesFunc);
        } else {
          return false;
        }
      });
    },
    addMeasureLine() {
      let obj = {
        text: "",
        initDataStr: "",
        userId: "",
        userName: ""
      }
      this.form.pmInfoProblemMeasuresEntityList.push(obj)
    },
    delMeasureLine(index, data) {
      data.splice(index, 1);
    },
    addProblem() {
      this.loading = true;
      addProblem(this.form).then(res => {
        this.loading = false;
        let doObj = {}
        doObj.action = 'addProblem';
        doObj.data = {};
        doObj.close = true;
        EcoUtil.getSysvm().callBackDialogFunc(doObj);
      })
    },
    goAttachementPage() {
      let data = {};
      data.modular = this.modular;
      data.modularInnerId = this.form.id;
      if (window.sysEnv == 1) {
        EcoUtil.getSysvm().onFileUpload(data);
      } else {
        EcoUtil.getSysvm().onFileUploadForEnv(data);
      }
    },
    onFileUploadActionCallBack(data) {
      this.fileLists.push.apply(this.fileLists, data.fileLists);

    },
    fileChange(file, fileList) {
      this.loading = true;
    },
    fileOnSuccess(response, file, fileList) {
      this.loading = false;
      this.form.fileHeardId = response.id;
    },
    fileDownload(item) {
      EcoFile.openFileHeaderByDownload(item.id, item.name);
    },
    filePreview(item) {

      if (item.fileType && item.fileType.toLowerCase() == 'pdf') {
        EcoFile.openFileByPdfJs(item.id, item.modular);
      } else {
        EcoFile.openFileHeaderByView(item.id, item.name);
      }
    },
    changeAttention(val) {
      let selectType = this.getBaseDataTextByKey(val, 'faw_pm_pro_attention')
      if (selectType == '领域级') {
        this.attentionType = true
      } else {
        this.attentionType = false
        this.form.field = ''

      }
    },
    fileDelete(item, idx) {
      this.$set(item, 'operateFlag', true);
    },

    fileRecovery(item, idx) {
      this.$set(item, 'operateFlag', false);
    },

  },
  watch: {

  },

};
</script>

<style scoped>
.addProblem {
  background: #fff;
  height: 100%;
}
.addProblem .btn {
  text-align: right;
  padding: 10px;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  right: 0;
  border-top: 1px solid #ddd;
}
.addProblem .addForm {
  padding-top: 20px;
  overflow: auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 60px;
}
.addProblem .addForm .el-form-item {
  width: 378px;
}
.addProblem .addForm .allItem {
  width: auto;
}
.fileItem .download {
  margin-right: 5px;
  cursor: pointer;
  color: #3891eb;
}
.fileItem .preview {
  margin-left: 5px;
  cursor: pointer;
  color: #3891eb;
  margin-right: 5px;
}
.fileItem .delete {
  margin-left: 5px;
  cursor: pointer;
  color: #67c23a;
}

.fileItem .recovery {
  margin-left: 5px;
  cursor: pointer;
  color: #e03a3a;
}

.fileItem .imgType {
  width: 16px;
  height: 16px;
}
.fileItem .deleted {
  text-decoration: line-through;
}
.el-button--mini.is-circle {
  padding: 3px;
  margin-top: 8px;
}
.myRule /deep/ .el-form-item__label::before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
</style>
