<template>
  <eco-content
    top="0px"
    bottom="0px"
    type="tool"
    class="wfToDoVue"
    style="background-color:#f5f5f5"
  >
  <div class="noticesAdd">
    <ecoLoading
      ref='ecoLoadingRef'
      text='加载中...'
    ></ecoLoading>
    <eco-content
     top="0px"
      height="60px"
      style="border-bottom:1px solid #ddd;"
    >
      <el-row style="padding:12px 10px;background-color:#fff;">
        <el-col :span="24">
          <eco-tool-title title="发布公告" style="line-height: 34px;"></eco-tool-title>
          <eco-button
            type="tool"
            :leftSplit="false"
            @click.native="sender"
          ><i class="icon iconfont icon-yifasong"></i>&nbsp;&nbsp;发送</eco-button>
        </el-col>
      </el-row>
    </eco-content>

    <eco-content
      top="61px"
      bottom="0px"
      ref="content"
    >
      <div class="addContent">
        <el-form
          size="mini"
          ref="form"
          :model="form"
          label-width="100px"
          class="top-main"
        >
          <el-form-item label="主送">
            <tag-select
              style="width: 100%;vertical-align: top;"
              :initDataStr="mainSender"
              ref="tagSelect"
              :initOptions="{selectNum:0,selectType:'user-dept'}"
              @callBack="selectSender"
            >
            </tag-select>
          </el-form-item>

          <el-form-item label="标题">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <div class='clearfix'>
            <el-form-item
              label="是否置顶"
              class="n-top"
              style="float: left"
            >
              <el-select
                v-model="form.topFlag"
                placeholder="请选择"
              >
                <el-option
                  style="padding-left:10px;"
                  label="否"
                  :value="false"
                ></el-option>
                <el-option
                  style="padding-left:10px;"
                  label="是"
                  :value="true"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              label="公告类别"
              class="n-top"
              style="float: left"
            >
              <el-select
                v-model="form.type"
                placeholder="请选择"
                size="mini"
              >
                <el-option
                  style="padding-left:10px;"
                  size="mini"
                  :label="item.text"
                  :value="item.id"
                  :key="item.id"
                  v-for="item in subCateArray"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>

        <div style="margin-left:34px; margin-top:10px;width:50%;">
          <eco-file-upload-btn
            :showList="true"
            :multiple="false"
            :modular="'ANNOUNCEMENT_FILE'"
            ref="fileUpload"
            :modularInnerId="form.id"
            @fileChange="fileChange"
            style="width:300px;display:inline-block;"
            @fileOnSuccess="fileOnSuccess"
          ></eco-file-upload-btn>
        </div>
        <div style="margin-left:34px; margin-top:30px;">
          <ckeditor
            v-show="true"
            ref="rsf"
            @on-success="test"
            :content="form.content"
          ></ckeditor>
        </div>
      </div>
    </eco-content>
  </div>
    </eco-content>
</template>



<script>
import { Loading } from 'element-ui';
import { EcoMessageBox } from '@/components/messageBox/main.js'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoButton from '@/components/button/ecoButton.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoFileUploadBtn from '@/components/file/ecoFileUploadBtn.vue'
import tagSelect from '@/components/orgPick/tagSelect.vue'
import { EcoUtil } from '@/components/util/main.js'
import { getItemFetchId,getEnumSelectEnabled } from '@/modules/rsf/api/common.js'
import { addNotice } from '@/modules/rsf/api/notice.js'
import ckeditor from '@/modules/rsf/views/moudle/components/ckeditor'
export default {
  name:'noticesAdd',
  components: {
    ecoContent,
    ecoButton,
    ecoToolTitle,
    ecoLoading,
    ecoFileUploadBtn,
    ckeditor,
    tagSelect
  },
  data() {
    return {
      form: {
        id: '',
        type: '',
        recipientList: [],
        title: '',
        content: '',
        topFlag: false //是否置顶,
      },
      mainSender:'',
      fileHeaderIds: [],
      fileList: [],
      subCateArray: [],
      attItems: [], //转发所带附件
      loadingInstance: null,
    }
  },
  computed: {

  },
  created() {
    this.getRSFInitFunc()
    this.getItemFetchId()
  },
  mounted() {
  },
  methods: {
    getItemFetchId() {
      getItemFetchId().then(res => {
        this.form.id = res;
      })
    },
    //初始化收发文
    getRSFInitFunc() {
      getEnumSelectEnabled('PUB_INFO_NOTICE_TYPE').then(res => {
        let tempSubCategoryArray = [];
        tempSubCategoryArray.push({ text: '全部', id: '' });
        for (let i = 0; i < res.length; i++) {
          tempSubCategoryArray.push(res[i]);
        }
        this.subCateArray = tempSubCategoryArray;
      })
    },
    //选取人员
    selectSender(data) {
      if (data.itemArray.length > 0) {
        this.form.recipientList = data.itemArray
      } else {
        this.mainSender = ''
        this.form.recipientList = []
      }
    },
    //发送邮件
    sender() {
      this.form.content = this.$refs['rsf'].getCkeditorData();
      addNotice(this.form).then(res => {
           this.$router.replace({ name: 'noticesSuccess', params: { id: 0 } });
      })


    },
    cancel() {
      this.$router.replace({ name: 'noticesList' });
    },
    test() {

    },
    fileChange(file, fileList) {
    },
    fileOnSuccess(response, file, fileList) {
      this.fileList.push(response)
      this.fileHeaderIds.push(response.id);
    }
  },

  destroyed() {

  },


}
</script>

<style scoped>
.noticesAdd{
  position: relative;
  height: 96%;
  margin: 0 24px;
  top: 2%;
  overflow-y: hidden;
  min-width: 1131px;
  border: 1px solid #ddd;
  color: #0f1419;
}
ul,
li {
  margin: 0;
  padding: 0;
}

.n-top {
  width: 300px;
  margin-right: 20px;
}

.n-time {
  width: 500px;
}

.n-top,
.n-time {
  float: left;
}

.el-form-item {
  margin-bottom: 10px;
}

.Inbox {
  padding: 12px 12px 0 12px;
  background: #f5f7fa;
}
.InboxTwo {
  padding: 0 0 12px 12px;
  background: #f5f7fa;
  width: 100%;
  border-bottom: solid 1px #c5c2da;
}

.py0 {
  color: #222;
  font-size: 15px;
  font-weight: bold;
  line-height: 32px;
}
.pylist {
  line-height: 28px;
  clear: both;
}

.inbox-content2 {
  background: #fff;
  padding: 10px 20px;
}
.main1 {
  float: left;
  margin-right: 8px;
}
.main2 {
  padding-left: 50px;
}
.change-btn {
  position: fixed;
  right: 50px;
  top: 50px;
}

.downupIcon {
  margin-top: 2px;
}
.pl10 {
  padding-left: 10px;
}
.pl11 {
  position: absolute;
  width: 120px;
  height: 60px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
.el-icon-upload {
  font-size: 30px;
  color: #b4bccc;
}
.pl12 {
  width: 80px;
  height: 30px;
  position: relative;
}
.pl13 {
  width: 80px;
  height: 30px;
  margin: auto;
}

.pl14 {
  display: block;
  margin: auto;
  text-align: center;
  padding-top: 4px;
}
.pl15 {
  display: block;
  text-align: center;
  margin-top: 2px;
  color: #409eff;
}

.loadFile li span {
  padding: 10px;
  display: inline-block;
  position: relative;
  background-color: #fafafa;
}

.loadFile li span:hover {
  background-color: #f1f1f1;
  cursor: pointer;
}

.loadFile li i {
  font-size: 16px;
  color: #409eff;
}
.loadFile li {
  display: inline-block;
  margin: 10px 10px 10px 0px;
  list-style: none;
}
.loadFile li .fileX {
  position: absolute;
  right: -5px;
  top: 0px;
  cursor: pointer;
}

.addContent .el-form-item__label {
  font-size: 12px;
}

.addContent {
  margin: 10px;
}

.addContent .el-textarea__inner {
  font-size: 12px;
}

.ecoFileUploadBtn /deep/ .btn {
  padding: 6px 11px !important;
  margin-left: 0 !important;
}
</style>
