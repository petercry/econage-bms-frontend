<template>
  <eco-content
    top="0px"
    bottom="0px"
    type="tool"
    class="wfToDoVue"
    style="background-color:#f5f5f5"
  >
  <div class="noticesListSender">
    <ecoLoading
      ref='ecoLoadingRef'
      text="加载中..."
    ></ecoLoading>
    <eco-content
      top="0px"
      height="60px"
      style="border-bottom:1px solid #ddd;"
    >
      <el-row style="padding:12px 10px;background-color:#fff;">
        <el-col :span="24">
          <eco-tool-title title="已发送公告"  style="line-height: 34px;"></eco-tool-title>
          <eco-button
            type="tool"
            :leftSplit="false"
            @click.native="goRSFAddPageFunc"
            v-if="isAddRole"
          ><i class="icon iconfont icon-bianji"></i>&nbsp;发布公告</eco-button>
          <eco-button
            type="tool"
            @click.native="goListFunc"
          ><i class="icon iconfont icon-yifasong"></i>&nbsp;查看已收</eco-button>
          <eco-button
            type="tool"
            @click.native="moveRSFFunc"
            v-if="!advInfo.showInvalidFlag"
          ><i class="icon iconfont icon-shanchu"></i>&nbsp;作废</eco-button>
          <eco-button
            type="tool"
            @click.native="validRSFFunc"
            v-if="advInfo.showInvalidFlag"
          >&nbsp;生效</eco-button>
          <eco-button
            type="tool"
            @click.native="setTopRSFFunc"
          >&nbsp;置顶</eco-button>
          <eco-button
            type="tool"
            @click.native="cancelTopRSFFunc"
          >&nbsp;取消置顶</eco-button>
          <eco-button
            type="tool"
            @click.native="showAdvSearchDialog"
          ><i class="icon iconfont icon-sousuo"></i>&nbsp;复合查询</eco-button>
                  <el-checkbox
          v-model="advInfo.showInvalidFlag"
          @change="invalidFlagFunc"
          size="mini"
        ><span class="f12">显示已作废</span></el-checkbox>
          <!-- <eco-button
            type="tool"
            :hasButton="false"
          ></eco-button>
          <span style="margin-left: 5px;font-size:12px;">关键词：</span>
          <div class="firstSearch">
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

        </el-col>

      </el-row>
      <!-- <el-row style="padding:5px 10px 5px 10px"> -->


        <!-- &nbsp;&nbsp;&nbsp;&nbsp; -->
        <!-- <span class="f12">显示</span> -->
        <!-- <el-select
          size="mini"
          v-model="baseInfo.my_all"
          placeholder="请选择"
          @change="disPlayScopeChangeFunc"
          style="width:80px;"
        >
          <el-option
            key="2"
            label="我的"
            value="my"
            size="mini"
          >
          </el-option>

          <el-option
            key="1"
            label="全部"
            value="all"
            size="mini"
            v-if="isManageRole"
          >
          </el-option>
        </el-select> -->
      <!-- </el-row> -->
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
        @click="advSearchFunc"
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
        :data="listArray"
        stripe
        ref="multipleTable"
        style="width: 100%"
        size="mini"
        height="100%"
        @sort-change="sortTablefunc"
        @selection-change="changeFun"
      >
        <el-table-column
          type="selection"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          label=""
          width="30"
        >
          <template slot-scope="scope">
            <div>
              <i
                class="icon iconfont icon-bianji cursorPoint"
                @click="goEditPage(scope.row)"
                title="编辑"
              ></i>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          class="font"
          label="标题"
          prop="title"
          sortable="custom"
          show-overflow-tooltip
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
                v-bind:class="{'roundFont':scope.row.topFlag == true }"
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
        >
        </el-table-column>

        <el-table-column
          prop="createDate"
          label="日期"
          width="160"
          sortable="custom"
        >
          <template slot-scope="scope"><span>{{scope.row.createDate}}</span></template>
        </el-table-column>

        <el-table-column
          class="font"
          label="浏览人数"
          width="120"
        >
          <template slot-scope="scope">
            <div>
              <span
                class="cursorPoint"
                @click="showMsgStats(scope.row.id)"
              >已有{{scope.row.readCount}}人阅读</span>
            </div>
          </template>
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

import { Loading } from 'element-ui';
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoButton from '@/components/button/ecoButton.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import { EcoMessageBox } from '@/components/messageBox/main.js'
import tagSelect from '@/components/orgPick/tagSelect.vue'
import { sysEnv } from '@/modules/rsf/config/env.js'
import { EcoUtil } from '@/components/util/main.js'
import { getSendedList, deleteNotices,setNoticesTop,cancelNoticesTop,getInvalidList,enableValidNotice} from '@/modules/rsf/api/notice.js'
import { getEnumSelectEnabled } from '@/modules/rsf/api/common.js'
export default {
  name:'noticesListSender',
  components: {
    ecoContent,
    ecoButton,
    ecoToolTitle,
    ecoLoading,
    tagSelect
  },
  data() {
    return {
      baseInfo: {

        folder: 'VALID',
        sort: '',
        order: '',
        adv_search_title: '',
        argument_name: 'title',
        searchKey: '',
        readSearchName: '全部',
        readSearchType: 1,
        my_all: "my"
      },
      advInfo: {
        showInvalidFlag: false
      },
      advForm: {
        title: '',
        sender_name: '',
        sender: '',
        start_date: '',
        end_date: '',
        sort: '',
        order: '',
        type:''
      },
      pageInfo: {
        page: 1,
        rows: 30,
        total: 0
      },
      listArray: [{
        senderName: '11',
        title: '测试',
        id: 'xxx'
      }],
      multipleSelection: [],
      subCateArray: [],
      isAddRole: false,
      isManageRole: false,
      formLabelWidth: '100px',
      dialogFormVisible: false,
      dialogVisible: false,

    }
  },
  created() {
    this.getRSFInitFunc()
  },
  mounted() {
    this.getRSFListFunc()
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
  methods: {

    //监听dialog 回写事件
    listAction() {
      window.tabClickFunc = function () {
        window.ecoVm.getRSFListFunc();
      }
    },

    //获取我发送的公告列表
    getRSFListFunc() {
      this.$refs.ecoLoadingRef.open();
      getSendedList(this.advForm, this.pageInfo).then((res) => {
        this.listArray = res.rows
        this.pageInfo.total = res.total
        this.$refs.ecoLoadingRef.close();
      })
    },
    // 获取已作废列表
    getInvalidList() {
      this.$refs.ecoLoadingRef.open();
      getInvalidList(this.advForm, this.pageInfo).then(res => {
        this.listArray = res.rows
        this.pageInfo.total = res.total
        this.$refs.ecoLoadingRef.close();
      })
    },
    // 获取基础数据
    getRSFInitFunc() {
      getEnumSelectEnabled('PUB_INFO_NOTICE_TYPE').then(res => {
        let tempSubCategoryArray = [];
        tempSubCategoryArray.push({ text: '全部', id: 0 });
        for (let i = 0; i < res.length; i++) {
          tempSubCategoryArray.push(res[i]);
        }
        this.subCateArray = tempSubCategoryArray;
      })
    },

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

    //点击subCategory
    handleSubCategoryClick(val) {
      this.advForm.type = val.id;
      this.getRSFListFunc();
    },
    disPlayScopeChangeFunc() {
      this.getRSFListFunc();
    },
    changeFun(rows) {
      this.multipleSelection = rows;
    },
    //选取发送人
    selectSender(data) {
      if (data.itemArray.length > 0) {
        this.form.sender = data.itemArray
      } else {
        this.form.sender_name = ''
        this.form.sender = []
      }
    },
    //已作废公告checkbox
    invalidFlagFunc(val) {
      if(val){
          this.getInvalidList()
      }else{
          this.getRSFListFunc()
      }
    },
    //搜索
    searchFunc() {

    },

    //作废操作
    moveRSFFunc() {
      if (this.multipleSelection.length == 0) {
        EcoMessageBox.alert('请选择要作废的数据', '提示');
        return;
      }
      var that = this;
      let confirmYesFunc = function () {
        that.moveRSFConfirmYes();
      }
      let options = { type: 'warning', lockScroll: false }
      EcoMessageBox.confirm('确认作废选中的数据?', '提示', options, confirmYesFunc);
    },

    moveRSFConfirmYes() {
      let ids = this.multipleSelection.map(item => {
        return item.id
      })
      let loadingInstance = Loading.service({ fullscreen: true, text: '正在删除', lock: true });
      deleteNotices(ids).then((response) => {
        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          loadingInstance.close();
        });
        this.successFunc();

      }).catch((error) => {
        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          loadingInstance.close();
        });
        this.errorFunc();
      });
    },
    //生效操作
    validRSFFunc() {
      if(this.multipleSelection.length == 0){
          EcoMessageBox.alert('请选择要生效的数据','提示');
          return;
      }
      var that  = this;
      let confirmYesFunc = function(){
          that.validRSFConfirmYes();
      }
      let options = {type: 'warning', lockScroll:false}
      EcoMessageBox.confirm('确认生效选中的数据?','提示',options,confirmYesFunc);
    },

    validRSFConfirmYes() {
      let ids = this.multipleSelection.map(item => {
        return item.id
      })
      let loadingInstance  = Loading.service({ fullscreen: true ,text:'正在生效，请稍等...',lock:true});
      enableValidNotice(ids).then((response)=>{
            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                loadingInstance.close();
            });
            this.successFunc();
      }).catch((error)=>{
            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                loadingInstance.close();
            });
            this.errorFunc();
      });
    },

    //置顶操作
    setTopRSFFunc() {
      if (this.multipleSelection.length == 0) {
        EcoMessageBox.alert('请选择要操作的数据', '提示');
        return;
      }
      var that = this;
      let confirmYesFunc = function () {
        that.setTopRSFConfirmYes();
      }
      let options = { type: 'warning', lockScroll: false }
      EcoMessageBox.confirm('确认操作选中的数据', '提示', options, confirmYesFunc);
    },
    setTopRSFConfirmYes() {
      let ids = this.multipleSelection.map(item => {
        return item.id
      })
      let loadingInstance = Loading.service({ fullscreen: true, text: '正在操作，请稍等...', lock: true });
      setNoticesTop(ids).then((response) => {
        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          loadingInstance.close();
        });
        this.successFunc();
      }).catch((error) => {
        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          loadingInstance.close();
        });
        this.errorFunc();
      });
    },

    //取消置顶操作
    cancelTopRSFFunc() {
      if (this.multipleSelection.length == 0) {
        EcoMessageBox.alert('请选择要操作的数据', '提示');
        return;
      }
      var that = this;
      let confirmYesFunc = function () {
        that.caneclTopRSFConfirmYes();
      }
      let options = { type: 'warning', lockScroll: false }
      EcoMessageBox.confirm('确认操作选中的数据', '提示', options, confirmYesFunc);
    },

    caneclTopRSFConfirmYes() {
      let loadingInstance = Loading.service({ fullscreen: true, text: '正在操作，请稍等...', lock: true });
        let ids = this.multipleSelection.map(item => {
        return item.id
      })
      cancelNoticesTop(ids).then((response) => {
        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          loadingInstance.close();
        });
        this.successFunc();
      }).catch((error) => {
        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          loadingInstance.close();
        });
        this.errorFunc();
      });
    },

    //成功回调
    successFunc() {
      this.$message({
        message: '操作成功',
        type: 'success'
      });
      this.getRSFListFunc();
    },
    errorFunc() {
      this.$message.error('操作失败');
    },
    //显示复合搜索
    showAdvSearchDialog() {
      //初始化
      this.dialogVisible = !this.dialogVisible;
    },
    //复合搜索dialog取消
    advCancelFunc() {
      this.dialogFormVisible = false;
    },
    //复合搜索dialog确认
    advSearchFunc() {
      this.getRSFListFunc();
    },

    changeReadSearchFunc() {
      this.baseInfo.page = 1;
      if (this.baseInfo.readSearchName == "全部") {
        this.baseInfo.readSearchType = 1;
      } else if (this.baseInfo.readSearchName == "未读") {
        this.baseInfo.readSearchType = 2;
      } else if (this.baseInfo.readSearchName == "已读") {
        this.baseInfo.readSearchType = 3;
      }
      this.getRSFListFunc();
    },

    goListFunc() {
      this.$router.push({ name: 'noticeList' });
    },
    //跳转到发布公告
    goRSFAddPageFunc() {

    },
    //跳转到详情
    goDetail(item) {
      if (sysEnv !== 1) {
        this.$router.push({ name: 'noticesDetail', params: { id: item.id, from: 'send' } })
      } else {
        let tabObj = {};
        tabObj.desc = item.title
        let goPage = "rsf/index.html#/noticesDetail" + '/' + item.id + "/send";;
         tabObj.r_func ="{menuTarget:'IFRAME',tabKey:'noticesDetail"+item.id+"',href_link:'"+ goPage + "'}"
        tabObj.reload = true;
        tabObj.clearIframe = true;
        EcoUtil.getSysvm().doTab(tabObj);
      }
    },
    goEditPage(item) {
      if (sysEnv !== 1) {
        this.$router.push({ name: 'noticesEdit', params: { id: item.id } })
      } else {
        let tabObj = {};
        tabObj.desc = '编辑公告' + ' [' + item.title + ']'
        let goPage = "rsf/index.html#/noticesEdit" + '/' + item.id;
       tabObj.r_func ="{menuTarget:'IFRAME',tabKey:'noticesEdit"+item.id+"',href_link:'"+ goPage + "'}"
        tabObj.reload = true;
        tabObj.clearIframe = true;
        EcoUtil.getSysvm().doTab(tabObj);
      }
    },

    showMsgStats(id) {
      if (sysEnv !== 1) {
        this.$router.push({ name: 'noticesReader', params: { id } })
      } else {
        let url = '/rsf/index.html#/noticesReader/'+ id;
        EcoUtil.getSysvm().openDialog('来件阅读情况', url, 600, 500, '12vh');
      }
    },
    // 分页
    handleSizeChange(val) {
      this.pageInfo.rows = val
      this.getRSFListFunc()
    },
    handleCurrentChange(val) {
      this.pageInfo.page = val
      this.getRSFListFunc()
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
    }


  }

}

</script>

<style scoped>
.noticesListSender{
  position: relative;
  height: 96%;
  margin: 0 24px;
  top: 2%;
  overflow-y: hidden;
  min-width: 1131px;
  border: 1px solid #ddd;
  color: #0f1419;
}
.titleInput {
  width: 140px;
}
.round {
  width: 4px;
  height: 4px;
  background: #333;
  border-radius: 50%;
  line-height: 28px;
  float: left;
  margin: 12px 10px 0;
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

.el-dropdown-menu {
  max-height: 300px;
  overflow-y: auto;
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
  color: #1e7045;
}

.dataNav span {
  font-size: 12px;
}
</style>
