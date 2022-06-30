<template>
  <div style="margin: 0px 20px" class="taInfo">
    <eco-content top="0px" bottom="0px">
      <el-row
        style="
          padding: 7px 10px;
          background-color: #fff;
          border-bottom: 1px solid #ddd;
        "
      >
        <el-col :span="14">
          <eco-tool-title
            style="line-height: 34px"
            :title="taName"
          ></eco-tool-title>
          <el-tag
            v-for="(tag, i) in dynameicTags"
            :key="i"
            style="margin-left: 5px"
            >{{ tag }}</el-tag
          >
        </el-col>
        <el-col :span="10" style="text-align: right">
          <el-button type="warning" class="btn" @click.native="editTa"
            ><i class="fa fa-pencil-square-o fa-lg"></i> 编辑人才
          </el-button>
          <el-button type="warning" class="btn" @click.native="addFollow"
            ><i class="fa fa-plus-square-o fa-lg"></i> 添加跟进
          </el-button>
          <!-- <el-button
            type="warning"
            class="btn"
            size="small"
            @click.native="updateCategory"
            >
             <i class="fa fa-pencil-square-o fa-lg"></i> 更新属性信息
          </el-button> -->
          <el-dropdown>
            <el-button class="dropDownBtn">...</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="addFile"><i class="fa fa-file-o fa-lg"></i>上传文档</el-dropdown-item>
              <el-dropdown-item @click.native="changeFolder(1)" v-if="taFolderId==0"><i class="fa fa-mail-forward fa-lg"></i>移入档案库</el-dropdown-item>
              <el-dropdown-item @click.native="changeFolder(0)" v-if="taFolderId==1"><i class="fa fa-mail-reply fa-lg"></i>移回当前</el-dropdown-item>
              <el-dropdown-item @click.native="deleteTa" style="color:red;"><i class="fa fa-trash-o fa-lg"></i>删除人才</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
      <div class="topTipDiv">
        <div class="topTipNodeDiv">
          <span class="topTipTitle">下次跟进时间</span>
          <div class="topTipContent" style="font-weight: bold">
            {{
              taInfoObj.followNextDate &&
              formatDateToMinute(taInfoObj.followNextDate)
            }}
          </div>
        </div>
        <div class="topTipNodeDiv" style="margin-left: 20px">
          <span class="topTipTitle">HR状态</span>
          <div class="topTipContent" style="font-weight: bold">
            {{ taInfoObj.hrStatusDesc }}
          </div>
        </div>
        <div class="topTipNodeDiv" style="margin-left: 20px" v-if="false">
          <span class="topTipTitle">BP状态</span>
          <div class="topTipContent" style="font-weight: bold">
            {{ taInfoObj.bpStatusDesc }}
          </div>
        </div>
      </div>
      <div style="width: calc(100% - 40px); margin: 10px 20px 0px 20px">
        <template v-for="(nodeEl, key, i) in briefInfo">
          <div
            :key="i"
            :style="{ width: nodeEl.isWholeRow ? '100%' : '25%' }"
            class="detRowDiv devDiv"
          >
            <div
              class="devTitleDiv"
              :style="{ width: nodeEl.isWholeRow ? '10%' : '33%' }"
            >
              <span class="titleSpan">{{ nodeEl.desc }}</span>
            </div>
            <div
              class="devInfoDiv"
              :style="{ width: nodeEl.isWholeRow ? '87%' : '60%' }"
            >
              <span class="infoSpan" v-if="nodeEl.kvGroupDesc != ''">{{
                getBaseDataTextByKey(
                  taInfoObj[nodeEl.paramName],
                  nodeEl.kvGroupDesc
                )
              }}</span>
              <span class="infoSpan" v-else>{{
                taInfoObj[nodeEl.paramName]
              }}</span>
            </div>
          </div>
        </template>
      </div>
      <el-row
        style="padding: 9px 10px; height: calc(100% - 200px)"
        v-loading="loading"
      >
        <el-col :span="24">
          <el-tabs v-model="focusPanelName" @tab-click="setTabPanel">
            <el-tab-pane label="详细信息" name="detailInfo">
              <div style="width: calc(100% - 60px); padding: 0px 30px">
                <template v-for="(nodeEl, key, i) in detInfo">
                  <div
                    :key="i"
                    :style="{ width: nodeEl.isWholeRow ? '100%' : '49%' }"
                    class="detRowDiv devDiv"
                  >
                    <div
                      class="devTitleDiv"
                      :style="{ width: nodeEl.isWholeRow ? '17%' : '35%' }"
                    >
                      <span class="titleSpan">{{ nodeEl.desc }}</span>
                    </div>
                    <div
                      class="devInfoDiv"
                      :style="{ width: nodeEl.isWholeRow ? '80%' : '60%' }"
                    >
                      <span class="infoSpan" v-if="nodeEl.kvGroupDesc != ''">{{
                        getBaseDataTextByKey(
                          taInfoObj[nodeEl.paramName],
                          nodeEl.kvGroupDesc
                        )
                      }}</span>
                      <span class="infoSpan" v-else>{{
                        taInfoObj[nodeEl.paramName]
                      }}</span>
                    </div>
                  </div>
                </template>
              </div>
            </el-tab-pane>
            <el-tab-pane
              :label="
                '跟进动态 (' +
                (followList == null ? 0 : followList.length) +
                ')'
              "
              name="eventInfo"
            >
              <div
                style="padding: 2px 20px; height: 100%; box-sizing: border-box"
              >
                <span v-if="followList.length == 0">暂无数据 ...</span>
                <!-- <el-timeline>
                  <el-timeline-item
                    v-for="(item,index) in followList"
                    :key="index"
                    v-bind:timestamp="item.createDate&&formatDateToMinute(item.createDate)"
                    placement="top"
                  >
                    <el-card>
                      <h4>{{item.detail}}</h4>
                      <el-row>
                        <el-col :span="12">
                        <span class="eventTitleSpan fl-left">跟进负责人：</span>
                        <span class="tinyInfoSpan ">{{item.followPrincipalName}}</span>
                        </el-col>
                        <el-col :span="12">
                          <span class="eventTitleSpan fl-left">一轮初试日期：</span>
                          <span class="tinyInfoSpan ">{{item.round1Date&&formatDateToMinute(item.round1Date)}}</span>
                       </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12">
                          <span class="eventTitleSpan fl-left">一轮初试人：</span>
                          <span class="tinyInfoSpan ">{{item.round1InterViewerName}}</span>
                        </el-col>
                        <el-col :span="12">
                          <span class="eventTitleSpan fl-left">一轮初试方式：</span>
                          <span class="tinyInfoSpan ">{{item.round1Method}}</span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12">
                          <span class="eventTitleSpan fl-left">二轮面试日期：</span>
                          <span class="tinyInfoSpan ">{{item.round2Date&&formatDateToMinute(item.round2Date)}}</span>
                        </el-col>
                        <el-col :span="12">
                          <span class="eventTitleSpan fl-left">二轮面试人：</span>
                          <span class="tinyInfoSpan">{{item.round2InterViewerName}}</span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12">
                          <span class="eventTitleSpan fl-left">二轮面试方式：</span>
                          <span class="tinyInfoSpan ">{{item.round2Method}}</span>
                          </el-col>
                        <el-col :span="12">
                          <span class="eventTitleSpan fl-left">三轮面试日期：</span>
                          <span class="tinyInfoSpan ">{{item.round3Date&&formatDateToMinute(item.round3Date)}}</span>
                      </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12">
                          <span class="eventTitleSpan fl-left">三轮面试人：</span>
                          <span class="tinyInfoSpan">{{item.round3InterViewerName}}</span>
                        </el-col>
                        <el-col :span="12">
                            <span class="eventTitleSpan fl-left">三轮面试方式：</span>
                            <span class="tinyInfoSpan">{{item.round3Method}}</span>
                        </el-col>
                      </el-row>
                      <p class="eventTinyTip">{{item.senderName}} 录入于 {{item.createDate&&formatDateToMinute(item.createDate)}}</p>
                      <div
                        class="eventBtn"
                        style="position:absolute;right:10px;bottom:10px;"
                      >
                        <el-button
                          type="primary"
                          icon="el-icon-edit"
                          circle
                          @click.native="editFollow(item.id)"
                        ></el-button>
                        <el-button
                          type="danger"
                          icon="el-icon-delete"
                          circle
                          @click.native="deleteFollow(item.id)"
                        ></el-button>
                      </div>
                    </el-card>
                  </el-timeline-item>
                </el-timeline> -->
                <el-table
                  v-else
                  :data="followList"
                  border
                  stripe
                  :header-cell-style="{
                    backgroundColor: '#fafafa',
                    height: '30px',
                  }"
                  :default-sort="{ prop: 'createDate', order: 'descending' }"
                  height="100%"
                  style="width: 100%"
                >
                  <el-table-column prop="type" label="跟进类型" width="96">
                    <template slot-scope="scope">
                      {{ followTypeObj[scope.row.type] }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="date"
                    label="跟进时间"
                    sortable
                    width="124"
                  >
                    <template slot-scope="scope">
                      {{ formatDateToMinute(scope.row.createDate) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="跟进方式"
                    width="85"
                    prop="followMethod"
                  >
                    <template slot-scope="scope">
                      {{
                        getBaseDataTextByKey(
                          scope.row.followMethod,
                          "FOLLOWWAY"
                        )
                      }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="followPrincipalName"
                    label="跟进人"
                    width="70"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="detail"
                    :show-overflow-tooltip="false"
                    label="详情"
                  >
                    <template slot-scope="scope">
                      <p
                        v-if="
                          scope.row.type == 'INTERVIEW' ||
                          scope.row.type == 'RESULT'
                        "
                      >
                        面试时间：{{
                          scope.row.roundDate &&
                          formatDateToMinute(scope.row.roundDate)
                        }}
                      </p>
                      <p
                        v-if="
                          scope.row.type == 'INTERVIEW' ||
                          scope.row.type == 'RESULT'
                        "
                      >
                        面试人：{{ scope.row.roundInterviewerName }}
                      </p>
                      <p
                        v-if="
                          scope.row.type == 'INTERVIEW' ||
                          scope.row.type == 'RESULT'
                        "
                      >
                        面试方式：{{
                          getBaseDataTextByKey(
                            scope.row.roundMethod,
                            "INTERVIEWMETHOD"
                          )
                        }}
                      </p>
                      <p
                        v-if="
                          scope.row.type == 'RESULT' && scope.row.join !== null
                        "
                      >
                        是否入职：{{ scope.row.join ? "是" : "否" }}
                      </p>
                      <p
                        v-if="
                          scope.row.type == 'RESULT' &&
                          scope.row.joinDate !== null
                        "
                      >
                        入职时间：{{ scope.row.joinDate }}
                      </p>
                      <span>{{ scope.row.detail }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="80">
                    <template slot-scope="scope">
                      <div class="eventBtn" >
                        <el-button
                          type="text"
                          @click.native="editFollow(scope.row.id)"
                          >修改</el-button
                        >
                        <el-button
                          type="text"
                          style="color: red"
                          @click.native="deleteFollow(scope.row.id)"
                          >删除
                        </el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            <el-tab-pane
              :label="
                '相关文档 (' +
                (taFileList == null ? 0 : taFileList.length) +
                ')'
              "
              name="file"
            >
              <div
                style="padding: 2px 20px; height: 100%; box-sizing: border-box"
              >
                <span v-if="taFileList.length == 0">暂无数据 ...</span>
                <el-table
                  :data="taFileList"
                  stripe
                  style="width: 100%"
                  height="100%"
                  :header-cell-style="{ backgroundColor: '#fafafa' }"
                  v-if="taFileList != null && taFileList.length > 0"
                  class="detTable"
                >
                  <el-table-column label="文档名称" prop="name" width="300">
                  </el-table-column>
                  <el-table-column label="大小" prop="size" width="100">
                    <template slot-scope="scope">
                      {{ scope.row.size | sizeTostr }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="上传人"
                    prop="createUserName"
                    width="80"
                  >
                  </el-table-column>
                  <el-table-column
                    label="上传时间"
                    prop="createDate"
                    width="140"
                  >
                    <template slot-scope="scope">
                      {{ formatDateToMinute(scope.row.createDate) }}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" prop="op">
                    <template slot-scope="scope">
                      <el-button
                        type="text"
                        @click.native="filePreview(scope.row)"
                        v-if="_isPreviewFile(scope.row.fileType)"
                        class="fileBtn"
                        >预览</el-button
                      >
                      <el-button
                        type="text"
                        @click.native="fileDownload(scope.row)"
                        class="fileBtn"
                        >下载</el-button
                      >
                      <el-button
                        type="text"
                        @click.native="deleteFile(scope.row.id, scope.row.name)"
                        style="color: red"
                        class="fileBtn"
                        >删除</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </eco-content>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      @open="cleanDialog()"
      :destroy-on-close="false"
      ref="dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
      class="trivialDialog"
    >
      <editTa v-if="dialogTab == 'editTa'" ref="editTaWin"></editTa>
      <addFollow v-if="dialogTab == 'addFollow'" ref="addFollowWin">
      </addFollow>
      <editFollow v-if="dialogTab == 'editFollow'" ref="editFollowWin">
      </editFollow>
      <followResult v-if="dialogTab == 'followResult'" ref="followResultWin">
      </followResult>
      <ecoFileUploadChunk
        v-if="dialogTab == 'addFile'"
        :modular="modular"
        :modularInnerId="modularInnerId"
        ref="addFileWin"
      ></ecoFileUploadChunk>
      <div slot="footer" class="dialog-footer" v-if="dialogTab != 'addFile'">
        <el-button @click.native="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="dialogSave()">保 存</el-button>
      </div>
      <div slot="footer" class="dialog-footer" v-else>
        <el-button @click.native="closeUpload">关 闭</el-button>
      </div>
    </el-dialog>
    <form name="docviewform" method="get">
      <input type="hidden" name="fileHeaderId" />
      <input type="hidden" name="fileName" />
      <input type="hidden" name="fileHeaderIds" />
      <input type="hidden" name="expectedName" />
    </form>
    <iframe name="docviewIframe" style="display: none"></iframe>
  </div>
</template>

<script>
import ecoContent from '@/components/pageAb/ecoContent.vue';
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue';
import editTa from '@/modules/bmsTalentPool/views/editTa.vue';
import addFollow from '@/modules/bmsTalentPool/views/addFollow.vue';
import editFollow from '@/modules/bmsTalentPool/views/editFollow.vue';
import followResult from '@/modules/bmsTalentPool/views/followResult.vue';
import ecoFileUploadChunk from '@/components/file/ecoFileUploadChunk.vue';
import { doFilePreviewAction } from '@/modules/bmsMmm/util/utility.js';
import {
  getEnumText,
  _isPreviewFile
} from '@/modules/bmsBa/service/service.js';
import {
  getSingleTalentInfo,
  getFollowList,
  deleteTalent,
  deleteFollow,
  getFileListByModularInnerId,
  deleteFileDataServer,
  getFollowType,
  getBaseDataInfo,
  changeTalentFolder
} from '@/modules/bmsTalentPool/service/service.js';
import { EcoUtil } from '@/components/util/main.js';
import { EcoFile } from '@/components/file/main.js';
import { EcoMessageBox } from '@/components/messageBox/main.js';
import { DetShowEl } from '@/modules/bmsBa/util/DetShowEl.js';
import { TableColEl } from '@/modules/bmsBa/util/TableColEl.js';
import { mapGetters, mapActions } from 'vuex';
import {
  openLoading,
  closeLoading
} from '@/modules/bmsTalentPool/utils/main.js';

export default {
  name: 'taInfo',
  components: {
    ecoContent,
    ecoToolTitle,
    editTa,
    addFollow,
    editFollow,
    followResult,
    ecoFileUploadChunk
  },
  data() {
    return {
      loading: true,
      modular: 'bmsTa',
      modularInnerId: '',
      dialogVisible: false,
      dialogTab: '',
      dialogTitle: '',
      taName: '',
      taId: '',
      taFolderId:-1,
      focusFollowId: '',
      taFileList: [],
      focusPanelName: 'eventInfo',
      noEventInfoToShow: '',
      noFileInfoToShow: '',
      isAdminRole: false,
      followList: [],
      followTypeObj: [],
      taInfoObj: {},
      dynameicTags: [], //已选标签
      briefInfo: new DetShowEl()
        .add('姓名', 'name', '', false)
        .add('联系电话', 'phone', '', false)
        .add('目前状态', 'currentState', 'CURRENTSTATE', false)
        .add('匹配岗位', 'resumeJob', 'BMS.TALENT.JOB', false)
        .add('性别', 'gender', 'GENDER', false)
        .add('年龄', 'age', '', false)
        .add('婚育情况', 'marriage', 'MARRIAGE', false)
        // .add("所在省份", "province", '', false)
        // .add("所在城市", "city", '', false)
        .add('所在地域', 'area', '', false) //所在省份+所在地域
        .add('备注', 'comment', '', false),

      detInfo: new DetShowEl()
        .add('简历来源', 'resumeSource', 'RESUMESOURCE', false)
        .add('收到简历日期', 'resumeDate', '', false)
        .add('行业经验', 'experience', '', false)
        .add('匹配岗位', 'resumeJob', 'BMS.TALENT.JOB', false)
        .add('岗位匹配度(%)', 'resumeJobMatch', '', false)
      // .add("跟进状态", "followStatus", '', false)
      // .add("跟进结果", "followResult", '', false),
    };
  },
  computed: {
    ...mapGetters(['baseData', 'getBaseDataTextByKey'])
  },
  created() {
    this.taId = this.$route.query.ta_id;
    this.modularInnerId = this.taId;
  },
  mounted() {
    this.getFollowType();
    this.getTaInfo(this.taId);
    this.getFollowList(this.taId);
    this.getFileList();
  },
  filters: {
    sizeTostr(value) {
      if (!value) {
return '0KB';
}
      return EcoUtil.getFileSize(value);
    }
  },
  methods: {
    async getTaInfo(taId) {
      this.loading = true;
      this.focusPanelName = 'eventInfo';
      this.modularInnerId = taId;
      const res = await getSingleTalentInfo(taId);
      this.taName = res.data.name;
      this.taId = taId;
      this.taFolderId = res.data.folderId;
      let tags = res.data.labels;
      this.dynameicTags = [];
      if (tags) {
        for (
          let x = 0;
          x < this.baseData['BMS.TALENT.LABEL'].data.length;
          x++
        ) {
          for (let i = 0; i < tags.length; i++) {
            // console.log(tags[i].label)
            if (this.baseData['BMS.TALENT.LABEL'].data[x].id == tags[i].label) {
              this.dynameicTags.push(
                this.baseData['BMS.TALENT.LABEL'].data[x].text
              );
            }
          }
        }
      }
      let infoObj = res.data;
      if (infoObj.followResult) {
        const nodeInfo = await getBaseDataInfo(infoObj.followResult);
        infoObj.followResult = nodeInfo.data.text;
      }
      this.taInfoObj = infoObj;
      this.$set(this.taInfoObj, 'area', res.data.province + res.data.city);
      this.loading = false;
    },
    async getFollowList(taId) {
      const res = await getFollowList(taId);
      this.taId = taId;
      this.followList = res.data;
    },

    async getFileList() {
      const res = await getFileListByModularInnerId(
        this.modular,
        this.modularInnerId
      );
      this.taFileList = res.data;
    },
    async getFollowType() {
      const res = await getFollowType();
      this.followTypeObj = res.data;
    },
    cleanInfo() {},
    deleteFile(fileId, fileName) {
      this.$confirm('确定要删除文档“' + fileName + '”吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteFileDataServer(fileId)
            .then((response) => {
              this.$message({
                type: 'success',
                message: '删除成功！'
              });
              this.focusPanelName = 'file';
              this.$refs.addFileWin.initFile();
              this.setTabPanel();
            })
            .catch((error) => {
              // console.log("error:"+error);
              this.$message({
                type: 'error',
                message: '删除失败！'
              });
            });
        })
        .catch((error) => {
          console.log('error:' + error);
        });
    },
    cleanDialog() {
      this.$nextTick(() => {
        if (typeof this.$refs.editTaWin != 'undefined') {
          this.$refs.editTaWin.cleanInfo();
          this.$refs.editTaWin.setTaId(this.taId);
        }
        if (typeof this.$refs.addFollowWin != 'undefined') {
          this.$refs.addFollowWin.cleanInfo();
          this.$refs.addFollowWin.setTaId(this.taId);
        }
        if (typeof this.$refs.editFollowWin != 'undefined') {
          this.$refs.editFollowWin.cleanInfo();
          this.$refs.editFollowWin.setTaId(this.taId);
          this.$refs.editFollowWin.getFollowId(this.focusFollowId);
        }
        if (typeof this.$refs.followResultWin != 'undefined') {
          this.$refs.followResultWin.cleanInfo();
          this.$refs.followResultWin.setTaId(this.taId);
        }
      });
    },
    editTa() {
      this.dialogTitle = '编辑人才信息';
      this.dialogTab = 'editTa';
      this.dialogVisible = true;
    },
    updateCategory() {
      this.dialogTitle = '更新属性类别';
      this.dialogTab = 'followResult';
      this.dialogVisible = true;
    },
    setTabPanel() {
      if (this.focusPanelName == 'detailInfo') {
        this.getTaInfo(this.taId);
      }
      if (this.focusPanelName == 'eventInfo') {
        this.getFollowList(this.taId);
      }
      if (this.focusPanelName == 'file') {
        this.getFileList();
      }
    },
    addFollow() {
      this.dialogTitle = '添加跟进信息';
      this.dialogTab = 'addFollow';
      this.dialogVisible = true;
    },
    changeFolder(changeFolder){
      //console.log("changeFolder:" + changeFolder);
      changeTalentFolder(this.taId , changeFolder).then((response)=>{
        //console.log("response.status:" + response.status);
        if (response.status == 200) {
          this.$message.success('转移成功');
          this.$parent.$parent.dialogVisible = false;
          this.$parent.$parent.getTaList();
        }
      }).catch((error)=>{
         console.log("error:" + error);
      });
    },
    deleteTa() {
      let that = this;
      let confirmYesFunc = async function () {
        const res = await deleteTalent(that.taId);
        if (res.data) {
          that.$message.success('删除成功');
          that.$parent.$parent.dialogVisible = false;
          that.$parent.$parent.getTaList();
        }
      };
      let options = {
        type: 'warning',
        lockScroll: false
      };
      EcoMessageBox.confirm(
        '确定要删除该条人才信息吗?',
        '提示',
        options,
        confirmYesFunc
      );
    },
    editFollow(followId) {
      this.focusFollowId = followId;
      this.dialogTitle = '编辑跟进信息';
      this.dialogTab = 'editFollow';
      this.dialogVisible = true;
    },
    deleteFollow(id) {
      let that = this;
      let confirmYesFunc = async function () {
        const res = await deleteFollow(id);
        if (res.data) {
          that.$message.success('删除成功');
          that.getFollowList(that.taId);
          that.getTaInfo(that.taId);
          that.$parent.$parent.getTaList();
        }
      };
      let options = {
        type: 'warning',
        lockScroll: false
      };
      EcoMessageBox.confirm(
        '确定要删除该条跟进信息吗?',
        '提示',
        options,
        confirmYesFunc
      );
    },
    // 上传文档
    addFile() {
      this.dialogTitle = '上传文档';
      this.dialogTab = 'addFile';
      this.dialogVisible = true;
    },
    closeUpload() {
      this.dialogVisible = false;
      this.focusPanelName = 'file';
      this.getFileList();
    },
    fileDownload(item) {
      EcoFile.openFileHeaderByDownload(item.id, item.name);
    },
    filePreview(item) {
      // if(item.fileType && item.fileType.toLowerCase()== 'pdf'){
      //     EcoFile.openFileByPdfJs(item.id,item.modular);
      // }else{
      EcoFile.openFileHeaderByView(item.id, item.name);
      // }
    },
    dialogSave() {
      if (this.dialogTab == 'editTa') {
        this.$refs.editTaWin.saveData();
      }
      if (this.dialogTab == 'addFollow') {
        this.$refs.addFollowWin.saveData();
      }
      if (this.dialogTab == 'editFollow') {
        this.$refs.editFollowWin.saveData();
      }
      if (this.dialogTab == 'followResult') {
        this.$refs.followResultWin.saveData();
      }
    },
    formatDateToMinute(time_str) {
      let return_str = time_str;
      if (return_str.length == 19 && return_str.indexOf(':') > 0) {
        return_str = return_str.substring(0, return_str.lastIndexOf(':'));
      }
      return return_str;
    },
    checkEventBtnByDate(checkCreateDate) {
      //console.log("checkCreateDate:"+checkCreateDate);
      let s1 = new Date(checkCreateDate.replace(/-/g, '/'));
      let ms = new Date() - s1.getTime();
      ms = ms / 1000 / 60 / 60;
      //console.log("ms:"+ms);
      if (ms < 24) {
return true;
} else {
return false;
}
    },
    getEnumText,
    openLoading,
    closeLoading,
    doFilePreviewAction,
    _isPreviewFile
  }
};
</script>

<style scoped>
.taInfo {
  overflow: auto;
}

.el-table /deep/ th.gutter {
  display: table-cell !important;
  background-color: #fafafa;
}

.el-tabs /deep/ .el-tab-pane {
  height: 100%;
}
</style>
