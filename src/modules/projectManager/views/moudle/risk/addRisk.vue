<template>
  <div class="addRisk">
    <el-form
      :inline="true"
      :model="form"
      :rules="rules"
      ref="addForm"
      class="addForm"
      label-width="130px"
    >
      <el-form-item
        label="风险名称"
        prop="name"
      >
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker
          type="date"
          disabled
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          placeholder="选择日期"
          v-model="form.startDate"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="问题名称" prop="name" >
                <el-input v-model.trim="form.name" placeholder="请输入问题名称"></el-input>
            </el-form-item> -->
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
      <el-form-item label="风险状态">
        <el-select
          disabled
          v-model="form.status"
          placeholder="请选择"
          filterable
          clearable
        >
          <el-option
            v-for="(item,index) in baseData['faw_pm_risk_status']"
            :key="index"
            :label="item.text"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="发生概率"
        prop="chanceLevel"
        required
      >
        <el-select
          v-model="form.chanceLevel"
          placeholder="请选择"
          filterable
          clearable
        >
          <el-option
            v-for="(item,index) in baseData['faw_pm_risk_chance']"
            :key="index"
            :label="item.text"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <!-- <el-form-item
        label="风险类别"
        prop="category"
        required
      >
        <el-select
          v-model="form.category"
          placeholder="请选择"
          filterable
          clearable
        >
          <el-option
            v-for="(item,index) in baseData['faw_pm_risk_category']"
            :key="index"
            :label="item.text"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item> -->
       <el-form-item
        label="风险类型"
        prop="category"

      >
        <el-input v-model.trim="form.categoryText"></el-input>
      </el-form-item>
      <el-form-item
        label="影响程度"
        prop="effect"
        required
      >
        <el-select
          v-model="form.effect"
          placeholder="请选择"
          filterable
          clearable
        >
          <el-option
            v-for="(item,index) in baseData['faw_pm_risk_effect']"
            :key="index"
            :label="item.text"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="风险等级"
        prop="level"
        required
      >
        <el-select
          v-model="form.level"
          placeholder="请选择"
          filterable
          clearable
        >
          <el-option
            v-for="(item,index) in baseData['faw_pm_risk_important']"
            :key="index"
            :label="item.text"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="计划关闭时间"
        prop="planCloseDate"
        required
      >
        <el-date-picker
          type="date"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          placeholder="选择日期"
          v-model="form.planCloseDate"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>

      <el-form-item
        label="负责人"
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
        label="应急措施负责人"
        prop="measuresId"
      >
        <tag-select
          style="width: 100%;vertical-align: top;"
          ref="tagSelect"
          :initDataStr="initDataStr_MeaPerson"
          :initOptions="{selectNum:1,selectType:'USER'}"
          @callBack="selectEmerMeasurePerson"
        >
        </tag-select>
      </el-form-item>
      <el-form-item
        label="关注级别"
        prop="attention"
        required
      >
        <el-select
          v-model="form.attention"
          placeholder="请选择"
          filterable
          clearable
          @change="changeAttention"
        >
          <el-option
            v-for="(item,index) in baseData['faw_pm_risk_attention']"
            :key="index"
            :label="item.text"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="所属领域"
        v-if="attentionType"
        prop="field"
        required
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
        label="风险描述"
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
        label="预防措施"
      >
        <div
          v-for="(item,index) in riskMeasuresPreventList"
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
            @click="delMeasureLine(index,riskMeasuresPreventList)"
          ></el-button>
        </div>
        <el-button
          type="primary"
          style="float:right;marginTop:10px"
          @click="addMeasureLine('prevent',riskMeasuresPreventList)"
        >添加</el-button>
      </el-form-item>
      <el-form-item
        class="allItem myRule"
        label="应急措施"
      >
        <div
          v-for="(item,index) in riskMeasuresUrgentList"
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
            @click="delMeasureLine(index,riskMeasuresUrgentList)"
          ></el-button>
        </div>
        <el-button
          type="primary"
          style="float:right;marginTop:10px"
          @click="addMeasureLine('urgent',riskMeasuresUrgentList)"
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
import { getItemFetchId, getEnumSelectEnabled, getUserSelfInfo, getBelongField } from '../../../api/common.js'
import { addRisk } from '../../../api/risk.js'
import tagSelect from '@/components/orgPick/tagSelect.vue'
// import ecoFileUploadBtn from '@/components/file/ecoFileUploadBtn.vue'
import { getTemplatesInfoList } from '../../../api/templates.js'
import { EcoFile } from '@/components/file/main.js'
import { EcoDate } from '@/components/date/main.js'
export default {
  name: 'addRisk',
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
        name: "",
        status: "faw_pm_risk_status1",
        chanceLevel: "",
        category: "",
        effect: "",
        attention: "",
        level: "",
        proposerId: "",
        proposerName: "",
        startDate: "",
        planCloseDate: "",
        dutyUserId: "",
        dutyUserName: "",
        measuresId: "",
        measuresName: "",
        importantLevel: "",
        describe: "",
        comments: "",
        field: "",
        valid: true,
        riskMeasuresEntityList: []
      },
      riskMeasuresUrgentList: [
        {
          text: "",
          type: "urgent",
          initDataStr: "",
          userId: "",
          userName: ""
        }
      ],
      riskMeasuresPreventList: [
        {
          text: "",
          type: "prevent",
          initDataStr: "",
          userId: "",
          userName: ""
        }
      ],
      rules: {
        name: [
          { required: true, message: '请输入风险名称', trigger: 'blur' },
        ],
        // category: [
        //   { required: true, message: '请选择风险类别', trigger: 'change' },
        // ],
        effect: [
          { required: true, message: '请选择影响程度', trigger: 'change' },
        ],
        dutyUserId: [
          { required: true, message: '请选择责任人', trigger: 'change' }
        ],
        measuresId: [
          { required: true, message: '请选择应急措施负责人', trigger: 'change' }
        ],
        importantLevel: [
          { required: true, message: '请选择重要性', trigger: 'change' }
        ],
        chanceLevel: [
          { required: true, message: '请选择发生概率', trigger: 'change' }
        ],
        // status: [
        //   { required: true, message: '请选择风险状态', trigger: 'change' }
        // ],
        attention: [
          { required: true, message: '请选择关注级别', trigger: 'change' }
        ],
        level: [
          { required: true, message: '请选择风险级别', trigger: 'change' }
        ],
        describe: [
          { required: true, message: '请输入风险描述', trigger: 'blur' },
        ],
        planCloseDate: [
          { required: true, message: '请填写计划关闭时间', trigger: 'blur' },
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
      initDataStr_MeaPerson: "",
      modular: "project_manager",
      fileLists: [],
      loading: true,
      attentionType: false
    }
  },
  created() {
    this.form.infoId = this.$route.params.infoId
    this.form.startDate = EcoDate.formatDateDefault(new Date());
    this.getUserInfo()
    this.bindAction();
    this.getItemFetchId();
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
      EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'addRiskVue');
    },
    getFiled() {
      getBelongField(this.form.infoId).then(res => {
        this.form.field = res.field
      })
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
    // 责任人
    selectDutyPerson(data) {
      if (data.itemArray.length > 0) {
        this.form.dutyUserId = data.itemArray[0].linkId;
        this.form.dutyUserName = data.itemArray[0].name;
      } else {
        this.form.dutyUserId = "";
        this.form.dutyUserName = "";
        this.initDataStr_Person = "";
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
    // 应急措施负责人
    selectEmerMeasurePerson(data) {
      if (data.itemArray.length > 0) {
        this.form.measuresId = data.itemArray[0].linkId;
        this.form.measuresName = data.itemArray[0].name;
      } else {
        this.form.measuresId = "";
        this.form.measuresName = "";
        this.initDataStr_MeaPerson = "";
      }
    },
    // 预防措施选择
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

    onCancel() {
      EcoUtil.getSysvm().closeDialog();
    },
    onSave() {
      this.checkSubmit('save')
    },
    onSubmit() {
      this.checkSubmit('submit')
    },
    // 校验
    checkSubmit(data) {
      this.riskMeasuresEntityList = []
      // if(!this.attentionType){
      //       this.$refs['field'].clearValidate()
      // }
      let measuresPreventList = this.riskMeasuresPreventList
      let measuresUrgentList = this.riskMeasuresUrgentList
      if (measuresPreventList.length != 0) {
        for (let index = 0; index < measuresPreventList.length; index++) {
          if (measuresPreventList[index].text == '' || measuresPreventList[index].userId === '') {
            this.$message.error('预防措施描述或负责人不能为空')
            return
          }
        }
      } else {
        this.$message.error('预防措施至少填写一行')
        return
      }
      if (measuresUrgentList.length != 0) {
        for (let index = 0; index < measuresUrgentList.length; index++) {
          if (measuresUrgentList[index].text == '' || measuresUrgentList[index].userId === '') {
            this.$message.error('应急措施描述或负责人不能为空')
            return
          }
        }
      } else {
        this.$message.error('应急措施至少填写一行')
        return
      }

      if (data == 'submit') {
        this.form.status = 'faw_pm_risk_status2'
      }
      this.form.riskMeasuresEntityList = [...this.riskMeasuresPreventList, ...this.riskMeasuresUrgentList]
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
            if(data == 'submit'){
              var that = this;
              let confirmYesFunc = function () {
                that.addRisk();
              }
              let options = {
                type: 'warning',
                lockScroll: false
              }
              EcoMessageBox.confirm('确定要提交吗?', '提示', options, confirmYesFunc);
            }else{
              this.addRisk();
            }

        } else {
          return false;
        }
      });
    },
    changeAttention(val) {
      let selectType = this.getBaseDataTextByKey(val, 'faw_pm_risk_attention')
      if (selectType == '领域级') {
        this.attentionType = true
      } else {
        this.attentionType = false
        this.form.field = ''
      }
    },
    addMeasureLine(data, list) {
      let obj = {
        text: "",
        type: data,
        initDataStr: "",
        userId: "",
        userName: ""
      }
      list.push(obj)
    },
    delMeasureLine(index, data) {
      data.splice(index, 1);
    },
    addRisk() {
      this.loading = true;
      addRisk(this.form).then(res => {
        this.loading = false;
        let doObj = {}
        doObj.action = 'addRisk';
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
.addRisk {
  background: #fff;
  height: 100%;
}
.addRisk .btn {
  text-align: right;
  padding: 10px;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  right: 0;
  border-top: 1px solid #ddd;
}
.addRisk .addForm {
  padding-top: 20px;
  overflow: auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 60px;
}
.addRisk .addForm .el-form-item {
  width: 380px;
}
.addRisk .addForm .allItem {
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
