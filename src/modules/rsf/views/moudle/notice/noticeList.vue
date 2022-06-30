<template>
  <eco-content
    top="0px"
    bottom="0px"
    type="tool"
    class="wfToDoVue"
    style="background-color:#f5f5f5"
  >
  <div class="noticeList">
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
          <el-col :span="19">
            <eco-tool-title :title="'通知公告'"  style="line-height: 34px;"></eco-tool-title>
            <eco-button
              type="tool"
              :leftSplit="false"
              @click.native="goRSFAddPageFunc"
            ><i class="icon iconfont icon-bianji"></i>&nbsp;发布公告</eco-button>
            <eco-button
              type="tool"
              @click.native="goSenderListFunc"
            ><i class="icon iconfont icon-yifasong"></i>&nbsp;查看已发</eco-button>
            <!-- <eco-button
              type="tool"
              :hasButton="false"
            ></eco-button> -->
            <!-- <span style="margin-left: 5px;font-size:12px;">关键字：</span>
            <div style="width:180px;display:inline-block;verticalAlign:middle">
              <el-input
                v-model="baseInfo.searchKey"
                prefix-icon="el-icon-search"
                placeholder="请输入内容"
                @keyup.enter.native="searchFunc"
                size="mini"
              ></el-input>
            </div>
            <eco-button
              type="tool"
              :leftSplit="false"
              @click.native="searchFunc"
            >&nbsp;搜索</eco-button> -->
            <eco-button
              type="tool"
              @click.native="showAdvSearchDialog"
            ><i class="icon iconfont icon-sousuo"></i>&nbsp;复合查询</eco-button>
            <eco-button
              type="tool"
              :hasButton="false"
            ></eco-button>
            <el-checkbox
              v-model="advInfo.showInvalidFlag"
              @change="invalidFlagFunc"
              size="mini"
            ><span class="f12">显示已作废</span></el-checkbox>
          </el-col>
          <el-col :span="5"  >
            <el-radio-group
              v-model="advForm.readFlag"
              style="float:right;line-height: 34px;"
              size="mini"
              @change="changeReadSearchFunc"
            >
              <el-radio-button :label="0">全部</el-radio-button>
              <el-radio-button :label="2">未读</el-radio-button>
              <el-radio-button :label="1">已读</el-radio-button>
            </el-radio-group>
          </el-col>
        </el-col>
      </el-row>
    </eco-content>
    <eco-content
      top="61px"
      height="40px"
      type="tool"
      class="dataNav"
      style="background-color:#f5f5f5;padding-top:2px;border-bottom:1px solid #ddd;"
      v-show="dialogVisible"
    >
      <div>
        <span>标题</span>
        <el-input
          v-model="advForm.title"
          @keyup.enter.native="searchFunc"
          style="width:120px;"
          size="mini"
        ></el-input>
      </div>
      <div>
        <span>发件人</span>
        <tag-select
          style="width: 150px;vertical-align: top;"
          :initDataStr="advForm.sender_name"
          ref="tagSelect"
          :initOptions="{selectNum:1,selectType:'user-dept'}"
          @callBack="selectSender"
        >
        </tag-select>
      </div>
      <div>
        <span>开始时间</span>
        <el-date-picker
          v-model="advForm.start_date"
          type="date"
          :editable="false"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          size="mini"
          style="width:150px;"
          placeholder="请选择开始时间"
        >
        </el-date-picker>
      </div>
      <div>
        <span>结束时间</span>
        <el-date-picker
          v-model="advForm.end_date"
          type="date"
          :editable="false"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          size="mini"
          style="width:150px;"
          placeholder="请选择结束时间"
        >
        </el-date-picker>
      </div>
      <el-button
        type="primary"
        @click="searchFunc"
        size="mini"
      >搜索</el-button>
    </eco-content>
    <eco-content
      :top="getContentTop1"
      height="32px"
      type="tool"
      class="ecoContentCalss"
    >
      <el-row style="padding:5px 10px 0px 10px;">
        <el-col :span="24">
          <ul class="card-nav">
            <li
              v-for="(item,index) in subCateArray"
              :key="index"
              :class="{active:advForm.type==item.id}"
              @click="handleSubCategoryClick(item)"
            >{{item.text}}</li>
          </ul>
        </el-col>
      </el-row>
    </eco-content>
    <eco-content
      bottom="42px"
      :top="getContentTop2"
      ref="content"
      class="ecoContentClass"
    >
      <el-table
        :data="listData"
        stripe
        style="width: 100%"
        height="100%"
        @sort-change="sortTablefunc"
      >
        <el-table-column
          prop="title"
          label="标题"
          sortable="custom"
        >
          <template slot-scope="scope">
            <div>
              <span class="round"></span>
              <span
                class="roundTop"
                v-if="scope.row.topFlag == true"
              >顶</span>
              <span
                class="cursorPoint"
                v-bind:class="{'roundFont':scope.row.topFlag == true || scope.row.readFlag == false}"
                @click="goDetail(scope.row)"
              >{{ scope.row.title }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="类别"
          width="120"
          sortable="custom"
        >
          <template slot-scope="scope"><span>{{getTypeName(scope.row.type)}}</span></template>

        </el-table-column>
        <el-table-column
          prop="senderUserName"
          label="发件人"
          width="100"
          sortable="custom"
        >
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="日期"
          width="140"
          sortable="custom"
        >
        </el-table-column>
      </el-table>
    </eco-content>
    <eco-content  bottom="0px" type="tool" style="padding:5px 0px">
          <div>
            <div style="text-align: right;">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="pageInfo.page"
                :page-sizes="[20,30,50,100]"
                :page-size="pageInfo.rows"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageInfo.total">
              </el-pagination>
            </div>
          </div>
    </eco-content>
  </div>
  </eco-content>
</template>

<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import ecoButton from '@/components/button/ecoButton.vue'
import { sysEnv } from '@/modules/rsf/config/env.js'
import { EcoUtil } from '@/components/util/main.js'
import { EcoMessageBox } from '@/components/messageBox/main.js'
import { mapActions, mapGetters, mapState } from 'vuex'
import { Loading } from 'element-ui';
import { getReceiveList, getInvalidList } from '@/modules/rsf/api/notice.js'
import { getEnumSelectEnabled } from '@/modules/rsf/api/common.js'
import tagSelect from '@/components/orgPick/tagSelect.vue'
export default {
  name: 'noticeList',
  components: {
    ecoContent,
    ecoLoading,
    ecoToolTitle,
    ecoButton,
    tagSelect
  },
  data() {
    return {
      advInfo: {
        showInvalidFlag: false
      },
      dialogVisible: false,
      advForm: {
        title: '',
        sender_name: '',
        sender: '',
        start_date: '',
        end_date: '',
        sort: '',
        order: '',
        type: '',
        readFlag: 0,
      },
      pageInfo: {
        page: 1,
        rows: 30,
        total: 0
      },
      listData: [],
      subCateArray: []
    }
  },
  computed: {
    getContentTop1: function () {
      if (this.dialogVisible) {
        return '104px';
      } else {
        return '61px';
      }
    },
    getContentTop2: function () {
      if (this.dialogVisible) {
        return '128px';
      } else {
        return '86px';
      }
    }
  },
  mounted() {
    this.getRSFInitFunc()
    this.getRSFListFunc()
    this.listAction();
    window.ecoVm = this;
  },
  methods: {
    // 监听回写
    listAction() {
      window.tabClickFunc = function () {
        window.ecoVm.getRSFListFunc();
      }
    },
    getRSFListFunc() {
      this.$refs.ecoLoadingRef.open();
      getReceiveList(this.advForm, this.pageInfo).then(res => {
        this.listData = res.rows
        this.pageInfo.total = res.total
        this.$refs.ecoLoadingRef.close();
      })
    },

    // 获取基础数据
    getRSFInitFunc() {
      getEnumSelectEnabled('PUB_INFO_NOTICE_TYPE').then(res => {
        let tempSubCategoryArray = [];
        tempSubCategoryArray.push({ text: '全部', id: "" });
        for (let i = 0; i < res.length; i++) {
          tempSubCategoryArray.push(res[i]);
        }
        this.subCateArray = tempSubCategoryArray;
      })
    },
    // 获取已作废列表
    getInvalidList() {
      this.$refs.ecoLoadingRef.open();
      getInvalidList(this.advForm, this.pageInfo).then(res => {
        this.listData = res.rows
        this.pageInfo.total = res.total
        this.$refs.ecoLoadingRef.close();
      })
    },
    // 显示作废
    invalidFlagFunc(val) {
      if(val){
          this.getInvalidList()
      }else{
          this.getRSFListFunc()
      }
    },
    // 选择发件人
    selectSender(data) {
      if (data.itemArray.length > 0) {
        this.advForm.sender = data.itemArray[0].linkId
      } else {
        this.advForm.sender_name = ''
        this.advForm.sender = ''
      }
    },
    // 搜索
    searchFunc() {
      this.getRSFListFunc()
    },
    // 发布公告
    goRSFAddPageFunc() {
      if (sysEnv !== 1) {
        this.$router.push({ name: 'noticesAdd' })
      } else {
        let tabObj = {};
        tabObj.desc = '发布公告'
        let goPage = "rsf/index.html#/noticesAdd";
        tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'noticesAdd',href_link:'" + goPage + "'}";
        tabObj.reload = true;
        tabObj.clearIframe = true;
        EcoUtil.getSysvm().doTab(tabObj);
      }
    },
    // 查看已发
    goSenderListFunc() {
      this.$router.push({ name: 'noticesListSender' });
    },
    // 去详情
    goDetail(item) {
      if (sysEnv !== 1) {
        this.$router.push({ name: 'noticesDetail', params: { id: item.id, from: 'receive' } })
      } else {
        let tabObj = {};
        tabObj.desc = item.title
        let goPage = "rsf/index.html#/noticesDetail" + '/' + item.id + "/receive";;
        tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'noticesDetail" + item.id + "',href_link:'" + goPage + "'}"
        tabObj.reload = true;
        tabObj.clearIframe = true;
        EcoUtil.getSysvm().doTab(tabObj);
      }
    },
    //显示复合搜索
    showAdvSearchDialog() {
      this.dialogVisible = !this.dialogVisible;
    },
    // 排序
    sortTablefunc(column, prop, order) {
      if (column.prop && column.order) {
        this.advForm.sort = column.prop;
        if (column.order == 'ascending') {
          this.advForm.order = 'asc'
        } else if (column.order == 'descending') {
          this.advForm.order = 'desc'
        }
      } else {
        this.advForm.order = '';
        this.advForm.sort = '';
      }
      this.getRSFListFunc();
    },
    //获取类别名称
    getTypeName(type) {
      if (type == 0) {
        return "";
      }
      let typeName = "";
      this.subCateArray.forEach((item) => {
        if (item.id == type) {
          typeName = item.text;
        }
      })
      return typeName;
    },
    // 点击tab
    handleSubCategoryClick(val) {
      this.advForm.type = val.id;
      this.getRSFListFunc();
    },
    handleSizeChange(val) {
      this.pageInfo.rows = val
      this.getRSFListFunc()
    },
    handleCurrentChange(val) {
      this.pageInfo.page = val
      this.getRSFListFunc()
    },
    changeReadSearchFunc(){
      this.getRSFListFunc()
    }
  }
}
</script>

<style scoped>
.noticeList {
  position: relative;
  height: 96%;
  margin: 0 24px;
  top: 2%;
  overflow-y: hidden;
  min-width: 1131px;
  border: 1px solid #ddd;
  color: #0f1419;
}

.dataNav {
  background: #f1f1f1;
}

.dataNav div {
  display: inline-block;
  line-height: 34px;
  margin: 0 5px;
}

.dataNav .icon {
  font-size: 18px;
  color: #409eff;
}

.dataNav span {
  font-size: 12px;
}
.round {
  width: 4px;
  height: 4px;
  background: #333;
  border-radius: 50%;
  line-height: 28px;
  float: left;
  margin: 10px 10px 0;
}
.roundTop {
  width: 18px;
  height: 18px;
  background: red;
  line-height: 18px;
  text-align: center;
  font-size: 12px;
  color: #fff;
  float: left;
  margin-top: 3px;
  border-radius: 4px;
  margin-right: 10px;
}
/* 三种样式*/
.roundFont {
  color: red;
  font-weight: bold;
}
.roundtwo {
  color: red;
}
.roundthree {
  color: #333;
}
</style>
