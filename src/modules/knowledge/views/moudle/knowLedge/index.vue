<template>
  <eco-content
    top="0px"
    bottom="0px"
    type="tool"
    class="wfToDoVue"
    style="background-color:#f5f5f5"
  >
    <div class="knowLedgeList">
      <ecoLoading
        ref='ecoLoadingRef'
        text='加载中...'
      ></ecoLoading>
      <eco-content
        top="0px"
        height="60px"
        type="tool"
        style="border-bottom:1px solid #ddd;"
      >
        <el-row style="padding:12px 10px;background-color:#fff;">
          <el-col :span="24">
            <eco-tool-title
              style="line-height: 34px;margin-right:50px;fontWeight:700;verticalAlign:middle"
              :title="'知识库'+''"
            ></eco-tool-title>
            <!-- <el-button plain class="plainBtn toolBtn" ><i class="icon el-icon-document-copy"></i>&nbsp;复制上周</el-button>
                            <el-button plain class="plainBtn toolBtn" ><i class="icon el-icon-delete"></i>&nbsp;批量删除</el-button> -->
            <el-input
              v-model="srchTxt"
              type="text"
              style="width:200px;marginLeft:10px;verticalAlign:middle"
              placeholder="搜索知识库名称"
              @keyup.enter.native="handleSearchClick"
            > <i
                class="el-icon-search el-input__icon"
                slot="suffix"
                style="cursor:pointer"
                @click="handleSearchClick"
              >
              </i></el-input>
            <el-button
              type="primary"
              class="toolBtn"
              @click.native="addNewKnowledgeLib"
            ><i
                class="el-icon-document-add"
                style="marginRight:4px"
              ></i>&nbsp;新建知识库</el-button>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content
        bottom="0"
        top="61px"
        id="contentList"
        style="padding:10px 15px;"
      >
        <div class="list-content">
          <el-row :gutter="140">
            <el-col
              :span="8"
              v-for="item in itemList"
              :id="'d_'+item.id"
              :key="item.key"
              style="margin-bottom: 30px;cursor:pointer"
            >
              <el-card
                class="box-card"
                shadow="never"
                @click.native="goDetail(item)"
              >
                <div
                  slot="header"
                  class="clearfix"
                >
                  <i
                    class="el-icon-folder"
                    style="color:#26a3da;fontWeight:700;fontSize:24px;verticalAlign:middle"
                  ></i>
                  <span
                    style="marginLeft:8px;verticalAlign:middle"
                    v-bind:class="searchList.indexOf(item.id)>-1?'searchItem':''"
                  >{{item.name}}</span>
                  <el-popover
                    placement="right"
                    width="20"
                    trigger="hover"
                  >
                    <div
                      style="cursor:pointer"
                      class="card-edit"
                      @click="goEdit(item.id)"
                    >编辑</div>
                    <div
                      style="cursor:pointer"
                      class="card-delete"
                      @click="deleteCurrent(item.id)"
                    >删除</div>
                    <i
                      class="el-icon-more"
                      style="float: right; padding: 3px 0;transform: rotate(90deg);fontSize:18px;color:#bcbcbc;cursor:pointer"
                      slot="reference"
                    ></i>
                  </el-popover>
                </div>
                <div
                  class="text item"
                  style="fontSize:16px"
                  v-if="item.summary!=null"
                >
                  {{item.summary}}
                </div>
                <div
                  v-else
                  class="text item"
                  style="fontSize:16px"
                >
                  暂无简介
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </eco-content>
    </div>

  </eco-content>
</template>
<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import { sysEnv } from '../../../config/env.js'
import { EcoUtil } from '@/components/util/main.js'
import { EcoMessageBox } from '@/components/messageBox/main.js'
import { mapActions, mapGetters, mapState } from 'vuex'
import { Loading } from 'element-ui';
import { getKnowledgeLibCard, deleteKnowledgeLib } from '@/modules/knowledge/api/knowledge.js'
export default {
  name: 'knowLedgeList',
  components: {
    ecoContent,
    ecoLoading,
    ecoToolTitle
  },
  data() {
    return {
      itemList: [],
      oldSrchTxt: '',
      searchList: [],
      srchTxt: '',
      currtId: "",
    }
  },
  created() {
  },
  activated() {

  },

  mounted() {
    this.getKnowledgeList()
    window.ecoFrameVm = this; //添加监听
    this.addMonitor(); //添加监听
  },

  computed: {
    ...mapGetters([

    ]),
    currentTimeList() {
      let formatDate = (date) => {
        let year = date.getFullYear();
        let month = (date.getMonth() + 1) >= 10 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
        let days = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
        return year + "-" + month + "-" + days;
      }
      let now = new Date();
      let today = now.getDay() !== 0 ? now.getDay() : 7;

      let week = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
      return Array.from(new Array(14), function (val, index) {
        let obj = {};
        let time = new Date(Date.now() - (today - index + 7 - 1) * 24 * 60 * 60 * 1000);
        let day = time.getDay() !== 0 ? time.getDay() : 7;
        obj.date = formatDate(time);
        obj.weekDesc = week[day - 1];
        return obj;
      })
    },
    currentDateList() {
      let formatDate = (date) => {
        let year = date.getFullYear();
        let month = (date.getMonth() + 1) >= 10 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
        let days = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
        return year + "-" + month + "-" + days;
      }
      let now = new Date();
      let today = now.getDay() !== 0 ? now.getDay() : 7;
      return Array.from(new Array(14), function (val, index) {
        let time = new Date(Date.now() - (today - index + 7 - 1) * 24 * 60 * 60 * 1000);
        return formatDate(time);
      })
    },


  },

  methods: {
    ...mapActions([
    ]),
    // 添加监听
    addMonitor() {
      let callBackDialogFunc = function (obj) {
        if (obj && (obj.action == 'createKnowledgeLib' || obj.action == 'editKnowledgeLib')) {
          window.ecoFrameVm.getKnowledgeList()
        }
      }
      EcoUtil.addCallBackDialogFunc(callBackDialogFunc);
    },
    getKnowledgeList() {
      this.$refs.ecoLoadingRef.open();
      getKnowledgeLibCard().then(res => {
        this.$refs.ecoLoadingRef.close();
        this.itemList = res
      })
    },
    // 搜索
    handleSearchClick() {
      if (this.oldSrchTxt != this.srchTxt) {
        this.searchList = (this.srchTxt) ? this.itemList.filter(item => {
          return item.name.indexOf(this.srchTxt) > -1;
        }).map(item => item.id) : [];
        this.$nextTick(() => {
          if (this.searchList.length == 0) {
            this.$message({
              // message: this.$t('msg.srchResultNone'),
              message: "没有搜索到任何知识库",
              type: 'error'
            });
          } else {
            this.currtId = this.searchList[0];
            let firstElem = document.getElementById('d_' + this.currtId);
            if (firstElem.offsetTop > window.innerHeight) {
              document.getElementById('contentList').scrollTo(0, firstElem.offsetTop - window.innerHeight / 2)
            } else {
              document.getElementById('contentList').scrollTo(firstElem.offsetTop - window.innerHeight / 2, 0)
            }
          }
        });
        this.oldSrchTxt = this.srchTxt;
      } else {
        let index = this.searchList.indexOf(this.currtId);
        // if (index == 0 || index == this.searchList.length) return;
        this.currtId = this.searchList[index];
        let moveElem = document.getElementById('d_' + this.currtId);
        if (moveElem.offsetTop > window.innerHeight) {
          document.getElementById('contentList').scrollTo(0, moveElem.offsetTop - window.innerHeight / 2)
        } else {
          document.getElementById('contentList').scrollTo(moveElem.offsetTop - window.innerHeight / 2, 0)
        }
      }
    },

    addNewKnowledgeLib() {
      if (sysEnv !== 1) {
        this.$router.push({ name: 'knowLibAdd' })
      } else {
        let url = '/knowledge/index.html#/knowLibAdd';
        EcoUtil.getSysvm().openDialog('新建知识库', url, 500, 480, '12vh');
      }
    },
    goEdit(id) {
      if (sysEnv !== 1) {
        this.$router.push({ name: 'knowLibEdit', params: { id } })
      } else {
        let url = '/knowledge/index.html#/knowLibEdit' + '/' + id;
        EcoUtil.getSysvm().openDialog('编辑知识库', url, 500, 480, '12vh');
      }
    },
    goDetail(item) {
      if (sysEnv !== 1) {
        this.$router.push({ name: 'knowLibDetail', params: { id: item.id } })
      } else {
        let tabObj = {};
        tabObj.desc = item.name
        let goPage = "knowledge/index.html#/knowLibDetail" + '/' + item.id;
        tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'knowLibDetail',href_link:'" + goPage + "'}";
        tabObj.reload = true;
        tabObj.clearIframe = true;
        EcoUtil.getSysvm().doTab(tabObj);
      }
    },
    deleteCurrent(id) {
      let options = { type: 'warning', lockScroll: false }
      let confirmYesFunc = () => {
        deleteKnowledgeLib(id).then(res => {
          this.$message({
            duration: 500,
            message: '删除成功',
            type: 'success',
            onClose: () => {
              this.getKnowledgeList()
            }
          });

          // if (res.data.success) {
          //   this.$message({
          //     message: '删除成功',
          //     type: 'success'
          //   });
          //   this.initData()
          // } else {
          //   this.$message({
          //     message: '删除失败',
          //     type: 'error'
          //   });
          // }
        }).catch(() => {

        })
      }
      EcoMessageBox.confirm('是否确认删除此知识库', '提示', options, confirmYesFunc);
    }
  },
  watch: {

  },

};
</script>

<style >
.knowLedgeList {
  position: relative;
  height: 96%;
  margin: 0 24px;
  top: 2%;
  overflow-y: hidden;
  min-width: 1131px;
  border: 1px solid #ddd;
  color: #0f1419;
}
.knowLedgeList .plainBtn {
  border-color: #003b90;
  color: #003b90;
  font-size: 14px;
}
.knowLedgeList .toolBtn {
  margin: 0 10px;
  float: right;
}

.knowLedgeList .el-card /deep/ .el-card__body {
  height: 100px;
}
.knowLedgeList .el-card {
  border: 1px solid #ddd;
}
.knowLedgeList .el-card /deep/ .el-card__header {
  border-bottom: 1px solid #ddd;
}
.knowLedgeList .searchItem {
  color: #f56c6c;
}
.card-edit:hover {
  color: #409eff;
}
.card-delete:hover {
  color: #f56c6c;
}
.el-popover {
  min-width: 30px;
}
.list-content {
  overflow-x: hidden;
}
</style>
