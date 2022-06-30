<template>
  <div
    class="fileUpload"
    v-loading="loading"
  >
    <!-- 上传文档 -->
    <div>
      <el-form
        label-width="70px"
        class="demo-ruleForm"
        label-position="left"
        :model="form"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item
          label="文件"
          prop="file"
        >
          <eco-file-upload-btn
            :showList="false"
            :multiple="false"
            :modular="'knowledge'"
            ref="fileUpload"
            :modularInnerId="modularInnerId"
            @fileChange="fileChange"
            style="width:142px;display:inline-block;"
            @fileOnSuccess="fileOnSuccess"
          ></eco-file-upload-btn>
          <div
            style="display:inline-block;width:63%"
            class="fileBox"
            v-for="(item,index) in fileList"
            key="id"
          >
            <div
              class="fileName"
              style="display:inline-block;"
            >
              {{item.name}}
            </div>
            <i
              v-show="item.name!=''"
              class="el-icon-close"
              style="float:right;line-height:36px;cursor:pointer"
              @click="deleteFile(item,index)"
            ></i>
          </div>
        </el-form-item>
        <el-form-item label="文档编号">
          <el-input
            v-model="form.fileCode"
            style="width:400px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input
            v-model="form.keyword"
            style="width:400px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="文档摘要">
          <el-input
            v-model="form.summary"
            style="width:400px"
            type="textarea"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="form.comments"
            style="width:400px"
            type="textarea"
          >
          </el-input>
        </el-form-item>
        </el-form-item>
        <el-form-item label="查看用户">
          <tag-select
            style="width:400px;vertical-align: top;"
            :initDataStr="exposeMembers"
            ref="tagSelect"
            :initOptions="{selectNum:0,selectType:'user-dept'}"
            @callBack="exposeMember"
          >
          </tag-select>
        </el-form-item>
        <el-form-item label="查看用户安全设置">
          <el-checkbox v-model="form.allowDownload">允许下载</el-checkbox>
          <el-checkbox v-model="form.allowOnlineEdit">允许在线编辑</el-checkbox>
        </el-form-item>
        <el-form-item label="隐藏用户">
          <tag-select
            style="width:400px;vertical-align: top;"
            :initDataStr="hideMembers"
            ref="tagSelect"
            :initOptions="{selectNum:0,selectType:'user-dept'}"
            @callBack="hideMember"
          >
          </tag-select>
        </el-form-item>
        <el-form-item label="管理用户">
          <tag-select
            style="width:400px;vertical-align: top;"
            :initDataStr="manageMembers"
            ref="tagSelect"
            :initOptions="{selectNum:0,selectType:'user-dept'}"
            @callBack="manageMember"
          >
          </tag-select>
        </el-form-item>
      </el-form>
      <div style="textAlign:center">
        <el-button @click="cancelFunc">取消</el-button>
        <el-button
          type="primary"
          @click="createFunc"
        >确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { uploadFile } from '../../../api/knowledge.js'
import { getItemFetchId } from '@/modules/knowledge/api/common.js'
import ecoFileUploadBtn from '@/components/file/ecoFileUploadBtn.vue'
import tagSelect from '@/components/orgPick/tagSelect.vue'
import EcoUtil from '@/components/util/main.js'
import { Loading } from 'element-ui'
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'fileUpload',
  components: {
    tagSelect,
    ecoFileUploadBtn
  },
  data() {
    return {
      form: {
        baseId: '',
        name: '',
        order: '',
        fileCode: '',
        model: 'KNOWLEDGE_LIB',
        keyword: '',
        summary: '',
        exposeMembers: [],
        hideMembers: [],
        manageMembers: [],
        fileHeaderIds: [],
        parentId: '',
        allowDownload: '',
        allowOnlineEdit: '',
      },
      exposeMembers: '',
      hideMembers: '',
      manageMembers: '',
      loading: false,
      modularInnerId: "",
      fileList: [],
      rules: {
        file: [
          { required: true, message: '请选择文件', trigger: 'blur' },
        ],
      }
    }
  },
  computed: {
    ...mapState(['fileTableNode', 'fileTreeNode'])
  },
  created() {
    this.getItemFetchId();
    this.form.baseId = this.$route.params.id
    let entryId = this.$route.params.activeid
    if (entryId == '-1') {
      this.form.parentId = ""
    } else {
      this.form.parentId = entryId
    }
  },

  methods: {
    getItemFetchId() {
      getItemFetchId().then(res => {
        this.modularInnerId = res;
        // this.form.id = this.modularInnerId;
        this.loading = false;
      })
    },
    // 查看用户
    exposeMember(data) {
      if (data.itemArray.length > 0) {
        // let linkIds = [];
        // for (let i = 0; i < data.itemArray.length; i++) {
        //   linkIds.push({ 'memberId': data.itemArray[i].linkId });
        // }
        // this.form.exposeMembers = linkIds
        this.form.exposeMembers = data.itemArray
      } else {
        this.exposeMembers = ''
        this.form.exposeMembers = []
      }
    },
    // 隐藏用户
    hideMember(data) {
      if (data.itemArray.length > 0) {
        // let linkIds = [];
        // for (let i = 0; i < data.itemArray.length; i++) {
        //   linkIds.push({ 'memberId': data.itemArray[i].linkId });
        // }
        // this.form.hideMembers = linkIds
        this.form.hideMembers = data.itemArray
      } else {
        this.hideMembers = ''
        this.form.hideMembers = []
      }
    },
    // 管理用户
    manageMember(data) {
      if (data.itemArray.length > 0) {
        // let linkIds = [];
        // for (let i = 0; i < data.itemArray.length; i++) {
        //   linkIds.push({ 'memberId': data.itemArray[i].linkId });
        // }
        // this.form.manageMembers = linkIds
        this.form.manageMembers = data.itemArray
      } else {
        this.manageMembers = ''
        this.form.manageMembers = []
      }
    },
    fileChange(file, fileList) {
      this.loading = true;
    },
    fileOnSuccess(response, file, fileList) {
      this.loading = false;
      this.fileList.push(response)
      this.form.fileHeaderIds.push(response.id);
      // this.form.name = response.name;
      this.rules.file = []
      this.$refs.ruleForm.clearValidate()
    },
    cancelFunc() {
      EcoUtil.getSysvm().closeDialog();
    },
    createFunc() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let loadingInstance = Loading.service({ fullscreen: true, text: '正在创建...' });
          uploadFile(this.form).then((res) => {
            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
              loadingInstance.close();
              this.$message({ type: 'success', message: '创建成功！' });
              let doObj = {}
              doObj.action = 'addNewFileCallBack';
              doObj.data = {};
              doObj.data.queryObj = this.form;
              doObj.close = true;
              EcoUtil.getSysvm().callBackDialogFunc(doObj);
            });
          });
        } else {
          return false
        }
      })
    },
    deleteFile(item, index) {
      this.$refs.fileUpload.handleRemove(item, index)
      this.fileList.splice(index, 1);
    },
  },
  watch: {
    fileList(val) {
      if (val.length == 0) {
        this.rules.file.push({ required: true, message: '请选择文件', trigger: 'blur' })
      }
    }
  },
}
</script>

<style scoped>
.fileUpload {
  width: 468px;
  padding: 20px;
}

.ecoFileUploadBtn /deep/ .btn {
  margin-left: 0 !important;
}
.el-form .el-form-item /deep/ .fileBox:hover {
  background-color: #f5f7fa;
  border-radius: 4px;
  color: #409eff;
}
</style>
