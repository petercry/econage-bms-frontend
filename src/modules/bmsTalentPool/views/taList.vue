<template>
  <div class="taList">
    <div class="kn-header">
      <eco-content top="0px" height="50px" type="tool" style="position: fixed !important">
        <el-row style="
            box-sizing: border-box;
            padding: 9px 10px;
            background-color: #fff;
            border-bottom: 1px solid #ddd;
          ">
          <el-col :span="11">
            <eco-tool-title style="line-height: 20px" :title="'人才列表' + '（' + paginationInfo.total + '）'"></eco-tool-title>
            <el-divider direction="vertical"></el-divider>
            <el-select v-model="paginationInfo.folderId" style="width:100px;" size="mini" @change="getTaListWithPageReset()">
              <el-option label="当前" value="0"></el-option>
              <el-option label="档案库" value="1"></el-option>
              <el-option label="全部数据" value="-1"></el-option>
            </el-select>
          </el-col>
          <el-col :span="13" style="text-align: right; padding-right: 10px">
            <el-button type="warning" @click.native="searchShowFunc" icon="el-icon-search">复合查询</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="primary" class="btn" icon="el-icon-plus" @click.native="addTa">新增人才</el-button>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content top="50px" height="163px" type="tool" v-show="this.searchShow" style="position: fixed !important; background-color: #fff">
        <el-row style="box-sizing: border-box; padding: 5px 5px 0px 5px; background-color: #fff">
          <div style="min-width: 1024px">
            <el-col :span="24">
              姓名：<el-input placeholder="请输入姓名" clearable v-model="searchForm.name" style="width: 110px; verticalalign: middle; margin-left: 28px"></el-input>
              性别：<el-select style="width: 110px; marginleft: 32px" v-model="searchForm.gender" placeholder="请选择" filterable clearable>
                <el-option v-for="(item, index) in baseData['GENDER'].data" :key="index" :label="item.text" :value="item.id">
                </el-option>
              </el-select>
              婚育情况：
              <el-select style="width: 110px" v-model="searchForm.marriage" placeholder="请选择" filterable clearable>
                <el-option v-for="(item, index) in baseData['MARRIAGE'].data" :key="index" :label="item.text" :value="item.id">
                </el-option>
              </el-select>
              匹配岗位：<el-select v-model="searchForm.resumeJob" multiple collapse-tags placeholder="请选择" style="width: 150px; verticalalign: middle">
                <el-option v-for="(item, index) in baseData['BMS.TALENT.JOB'].data" :key="index" :label="item.text" :value="item.id">
                </el-option>
              </el-select>
              <el-button type="warning" icon="el-icon-search" style="marginleft: 46px" @click.native="handleSearch()">搜索</el-button>
              <el-button type="info" @click.native="resetSearchParam()">清空条件</el-button>
            </el-col>
          </div>
        </el-row>
        <el-row style="box-sizing: border-box; padding: 5px 5px 0px 5px; background-color: #fff">
          <div style="min-width: 1024px">
            <el-col :span="24">
              目前状态：<el-select style="width: 110px; verticalalign: middle" v-model="searchForm.currentState" placeholder="请选择" filterable clearable>
                <el-option v-for="(item, index) in baseData['CURRENTSTATE'].data" :key="index" :label="item.text" :value="item.id">
                </el-option>
              </el-select>
              标签：
              <el-select v-model="searchForm.labels" multiple collapse-tags placeholder="请选择" style="width: 140px; verticalalign: middle">
                <el-option v-for="(item, index) in baseData['BMS.TALENT.LABEL'].data" :key="index" :label="item.text" :value="item.id">
                </el-option>
              </el-select>
              <!-- 所在省份：<el-input
              v-model="searchForm.province"
              style="width:140px;"
            ></el-input>
            所在城市：<el-input
              v-model="searchForm.city"
              style="width:140px;"
            ></el-input> -->
              简历来源：
              <el-select style="width: 100px; verticalalign: middle" v-model="searchForm.resumeSource" placeholder="请选择" filterable clearable>
                <el-option v-for="(item, index) in baseData['RESUMESOURCE'].data" :key="index" :label="item.text" :value="item.id">
                </el-option>
              </el-select>
              行业经验：
              <el-input clearable v-model="searchForm.experience" style="width: 110px; verticalalign: middle"></el-input>
              联系电话：<el-input clearable v-model="searchForm.phone" style="width: 120px; verticalalign: middle"></el-input>
              <!-- 简历与岗位匹配度：<el-input
              v-model="searchForm.resumeJobMatch"
              style="width:140px;"
            ></el-input> -->
            </el-col>
          </div>
        </el-row>
        <el-row style="box-sizing: border-box; padding:5px 5px 0px 5px; background-color: #fff">
          <div style="min-width: 1024px">
            <el-col :span="24">
              面试时间：<el-date-picker popper-class="interTime" style="width: 240px" v-model="searchForm.roundDate" type="datetimerange" range-separator="-" :unlink-panels="true" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH" @change="handleRoundDateChange" start-placeholder="开始日期" :default-time="['00:00:00', '23:59:00']" end-placeholder="结束日期">
              </el-date-picker>
              下次跟进：<el-date-picker style="width: 201px" v-model="searchForm.followNextDate" type="daterange" range-separator="-" value-format="yyyy-MM-dd" format="yyyy-MM-dd" @change="handleNextDateChange" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
              HR状态：<el-cascader clearable collapse-tags ref="cascader" :show-all-levels="false" style="width: 210px" :props="{ multiple: true, emitPath: false }" :options="HR" @change="handleFollowChange" @remove-tag="removeTag" :key="is_cascader">
              </el-cascader>

            </el-col>
          </div>
        </el-row>
        <el-row v-if="false" style="
            box-sizing: border-box;
            padding: 5px 5px 5px 3px;
            background-color: #fff;
            border-bottom: 1px solid #ddd;
          ">
          <div style="min-width: 1024px">
            <el-col :span="24">
              BP状态：&nbsp; &nbsp;<el-cascader clearable collapse-tags ref="cascadera" :show-all-levels="false" style="width: 240px" :props="{ multiple: true, emitPath: false }" :options="BP" @change="handleFollowChangeBP" @remove-tag="removeTagBP" :key="is_cascader_BP">
              </el-cascader>
            </el-col>
          </div>
        </el-row>
      </eco-content>
    </div>
    <ecoContent :top="getContentTop" bottom="0" style="position: fixed !important; z-index: 3">
      <ecoContent top="0px" bottom="42px" ref="content">
        <el-table :data="taListArray" border style="width: 100%" :height="'100%'" :header-cell-style="{ backgroundColor: '#fafafa' }" @row-dblclick="showTaInfo" :cell-style="{ fontSize: '12px' }" :row-class-name="tableRowClassName">
          <el-table-column fixed label="姓名" prop="name" width="90">
            <template slot-scope="scope">
              <el-button type="text" @click="showTaInfo(scope.row)" >
                <i v-if="scope.row.folderId==1" class="fa fa-file-archive-o fa-lg" style="margin-right:5px;vertical-align:middle;font-size:5px;color:#838383;font-weight:400;"></i>{{ scope.row.name }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="简历来源" width="80" prop="resumeSource">
            <template slot-scope="scope">
              {{ getBaseDataTextByKey(scope.row.resumeSource, "RESUMESOURCE") }}
            </template>
          </el-table-column>
          <el-table-column label="匹配岗位" prop="resumeJob" width="120">
            <template slot-scope="scope">
              {{ getBaseDataTextByKey(scope.row.resumeJob, "BMS.TALENT.JOB") }}
            </template>
          </el-table-column>
          <el-table-column label="岗位匹配度(%)" width="110" prop="resumeJobMatch">
          </el-table-column>
          <el-table-column label="HR状态" min-width="240" prop="hrStatusDesc">
            <template slot-scope="scope">
              <!-- {{ getBaseData(scope.row.followResult)}} -->
              {{ scope.row.hrStatusDesc }}
            </template>
          </el-table-column>
          <el-table-column label="面试安排" min-width="140" prop="interviewArrange">
            <template slot-scope="scope">
              <span v-html="scope.row.interviewArrangeDesc"></span>
            </template>
          </el-table-column>
          <!--
          <el-table-column label="BP状态" min-width="240" prop="bpStatusDesc">
            <template slot-scope="scope">
              {{ scope.row.bpStatusDesc }}
            </template>
          </el-table-column>
          -->
          <el-table-column label="下次跟进时间" prop="followNextDate" width="140">
            <template slot-scope="scope">
              {{
                scope.row.followNextDate &&
                formatDateToMinute(scope.row.followNextDate)
              }}
            </template>
          </el-table-column>
          <el-table-column label="性别" prop="gender" width="50">
            <template slot-scope="scope">
              {{ getBaseDataTextByKey(scope.row.gender, "GENDER") }}
            </template>
          </el-table-column>
          <el-table-column label="年龄" prop="age" width="50">
          </el-table-column>
          <el-table-column label="婚育情况" prop="marriage" width="80">
            <template slot-scope="scope">
              {{ getBaseDataTextByKey(scope.row.marriage, "MARRIAGE") }}
            </template>
          </el-table-column>
          <el-table-column label="所在地域" prop="province" width="100">
            <template slot-scope="scope">
              {{ scope.row.province + scope.row.city }}
            </template>
          </el-table-column>
          <!-- <el-table-column
            label="所在城市"
            prop="city"
            width="75"
          >
          </el-table-column> -->
          <el-table-column label="联系电话" prop="phone" width="100">
          </el-table-column>
          <el-table-column label="行业经验" prop="experience" width="160">
          </el-table-column>
          <el-table-column label="目前状态" prop="currentState" width="75">
            <template slot-scope="scope">
              {{ getBaseDataTextByKey(scope.row.currentState, "CURRENTSTATE") }}
            </template>
          </el-table-column>
          <el-table-column label="收到简历日期" prop="resumeDate" width="100">
          </el-table-column>
          <el-table-column label="最后更新" prop="modUserName" width="70"></el-table-column>
          <el-table-column label="更新时间" prop="modifyDate" width="125"></el-table-column>

          <!-- <el-table-column
            label="跟进结果"
            prop="followResult"
            width="220"
          >
          </el-table-column> -->
        </el-table>
      </ecoContent>
      <eco-content bottom="0px" type="tool" style="padding: 5px 0px">
        <div style="text-align: right">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="paginationInfo.page" :page-sizes="[20, 30, 50, 100]" :page-size="paginationInfo.rows" layout="total, sizes, prev, pager, next, jumper" :total="paginationInfo.total">
          </el-pagination>
        </div>
      </eco-content>
    </ecoContent>
    <el-dialog :visible="dialogVisible" :show-close="true" width="800px" top="0" :modal="false" :append-to-body="false" :modal-append-to-body="false" :destroy-on-close="false" @close="hideDialog()" @open="cleanDialogData()" class="attrDialog">
      <router-view name="sideRouterView" ref="sideRouterViewRef"></router-view>
    </el-dialog>
    <el-dialog :title="trivialDialogTitle" :visible.sync="trivialDialogVisible" @open="cleanTrivialDialog()" :destroy-on-close="false" ref="trivialDialog" :close-on-click-modal="false" :close-on-press-escape="false" class="trivialDialog">
      <addTa v-show="trivialDialogTab == 'addTa'" ref="addTaWin"></addTa>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="trivialDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="onSubmit()">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import ecoContent from "@/components/pageAb/ecoContent.vue";
import ecoToolTitle from "@/components/tool/ecoToolTitle.vue";
import { mapGetters, mapActions } from "vuex";
import addTa from "@/modules/bmsTalentPool/views/addTa.vue";
import EcoOrgPick from "@/components/orgPick/main.js";
import {
  openLoading,
  closeLoading,
} from "@/modules/bmsTalentPool/utils/main.js";
import {
  getTalentList,
  getBaseDataInfo,
  getTreeKvListByParentId,
  getCascaderNode,
} from "@/modules/bmsTalentPool/service/service.js";

export default {
  name: "taList",
  components: {
    ecoContent,
    ecoToolTitle,
    addTa,
  },
  data() {
    return {
      followStatusAndResult: [],
      searchShow: false,
      dialogVisible: false,
      trivialDialogVisible: false,
      trivialDialogTab: "",
      trivialDialogTitle: "",
      taListArray: [],
      bcolor: [], //需要高亮的行
      HR: [], //联级选择器值
      BP: [], //联级选择器值
      paginationInfo: {
        folderId: "0" ,
        total: 0,
        page: 1,
        rows: 50,
        sort: "modDate",
        order: "desc",
      },
      tag: [],
      searchForm: {
        gender: "",
        name: "",
        city: "",
        province: "",
        resumeSource: "",
        experience: "",
        currentState: "",
        resumeJob: [],
        marriage: "",
        resumeJobMatch: "",
        phone: "",
        roundDate: "",
        followNextDate: "",
        roundDateFrom: "",
        roundDateTo: "",
        followNextDateFrom: "",
        followNextDateTo: "",
        hrStatus: "",
        bpStatus: "",
        labels: [],
      },
      flag: "",
      is_cascader: 0,
      is_cascader_BP: 0,
    };
  },
  computed: {
    ...mapGetters(["baseData", "getBaseDataTextByKey"]),
    getContentTop: function () {
      if (this.searchShow) {
        //return "195px";
        return "160px";
      } else {
        return "48px";
      }
    },
  },
  created() {
    this.getFollowOptions();
    this.getFollowOptionsBP();
    this.initProjectBaseData("create-enabled").then(() => {
      this.loading = false;
    });
    this.getTaList();
  },
  mounted() {},
  methods: {
    ...mapActions(["initProjectBaseData"]),
    getTaListWithPageReset(){
      this.paginationInfo.page = 1;
      this.getTaList();
    },
    getTaList() {
      this.openLoading();
      getTalentList(this.searchForm, this.paginationInfo).then((res) => {
        // console.log(res.data.rows)
        let dataArr = res.data.rows;
        dataArr.forEach((item) => {
          // this.$set(item,'followResultText','')
          if (item.followResult) {
            this.getBaseData(item, item.followResult);
          }

          let interviewArrangeDesc = item.interviewArrangeDesc;
          if(interviewArrangeDesc!=null&&interviewArrangeDesc!=''){
            interviewArrangeDesc = interviewArrangeDesc.replace(/\r\n/g,"<br>");
            interviewArrangeDesc = interviewArrangeDesc.replace(/\n/g,"<br>");
            item.interviewArrangeDesc = interviewArrangeDesc;
          }
        });
        this.taListArray = dataArr;

        // 获取当前日期
        const myDate = new Date();
        const dates = [];
        dates[0] = myDate.getFullYear();
        dates[1] = myDate.getMonth() + 1;
        // 月份补零
        if (dates[1] < 10) {
          dates[1] = "0" + dates[1];
        }
        dates[2] = myDate.getDate();
        // 日期补零
        if (dates[2] < 10) {
          dates[2] = "0" + dates[2];
        }
        const today = dates.join("");
        // 最后修改日期与当前日期对比
        this.bcolor = [];
        for (var i = 0; i < this.taListArray.length; i++) {
          this.taListArray[i].modifyDate = this.taListArray[
            i
          ].modDate.substring(0, 16);
          if (
            this.taListArray[i].modDate.substring(0, 10).split("-").join("") ==
            today
          ) {
            // this.taListArray[i].bgcolor = true
            this.bcolor.push(i);
          }
        }
        this.bcolor = Array.from(new Set(this.bcolor));
        this.closeLoading();
        this.paginationInfo.total = res.data.total;
      });
    },
    async getBaseData(item, id) {
      const res = await getBaseDataInfo(id);
      item.followResult = res.data.text;
    },
    searchShowFunc() {
      this.searchShow = !this.searchShow;
    },
    handleRoundDateChange(val) {
      if (val) {
        this.searchForm.roundDateFrom = val[0];
        this.searchForm.roundDateTo = val[1];
      } else {
        this.searchForm.roundDateFrom = "";
        this.searchForm.roundDateTo = "";
      }
    },
    handleNextDateChange(val) {
      if (val) {
        this.searchForm.followNextDateFrom = val[0];
        this.searchForm.followNextDateTo = val[1];
      } else {
        this.searchForm.followNextDateFrom = "";
        this.searchForm.followNextDateTo = "";
      }
    },

    handleSearch() {
      // if(this.tag != 0){
      //   let arrTag = this.tag
      //   this.searchForm.labels = []
      //   for(let i = 0; i < arrTag.length; i++){
      //     let objTag = {}
      //     objTag.label = arrTag[i]
      //     this.searchForm.labels.push(objTag)
      //   }
      // }
      this.getTaListWithPageReset();
    },
    resetSearchParam() {
      for (const key in this.searchForm) {
        this.searchForm[key] = "";
      }
      this.searchForm.labels = [];
      this.searchForm.resumeJob = [];
      this.tag = [];
      this.is_cascader++;
      this.is_cascader_BP++;
    },
    changeSort() {},
    // HR获取联级选择器的第一级
    getFollowOptions() {
      let orgInfo = [];
      getTreeKvListByParentId("BMS-HR-STATUS").then((res) => {
        res.data.forEach((item) => {
          let obj = {
            value: item.id,
            label: item.text,
            haveSub: item.haveSub,
          };
          orgInfo.push(obj);
          // console.log(orgInfo);
        });
        this.HR = orgInfo;
        this.getData(this.HR);
      });
    },
    // BP获取联级选择器的第一级
    getFollowOptionsBP() {
      let orgInfo = [];
      getTreeKvListByParentId("BMS-BP-STATUS").then((res) => {
        res.data.forEach((item) => {
          let obj = {
            value: item.id,
            label: item.text,
            haveSub: item.haveSub,
          };
          orgInfo.push(obj);
          // console.log(orgInfo);
        });
        this.BP = orgInfo;
        this.getData(this.BP);
      });
    },
    // 获取联级选择器的第二、三级
    getData(item) {
      item.forEach((item1) => {
        if (item1.haveSub) {
          getCascaderNode(item1.value).then((res) => {
            this.$set(item1, "children", []);
            let obj = {};
            res.data.forEach((item2) => {
              obj = {
                value: item2.id,
                label: item2.text,
                haveSub: item2.haveSub,
              };
              item1.children.push(obj);
              this.getData(item1.children);
            });
          });
        }
      });
    },
    handleFollowChange(val) {
      let res = this.$refs.cascader.getCheckedNodes(true);
      this.searchForm.hrStatus = res.map((item) => item.value);
      this.searchForm.hrStatus.forEach((item, index) => {
        if (this.flag == item) {
          this.searchForm.hrStatus.splice(index, 1);
        }
      });
      this.flag = "";
    },
    handleFollowChangeBP(val) {
      let res = this.$refs.cascadera.getCheckedNodes(true);
      this.searchForm.bpStatus = res.map((item) => item.value);
      this.searchForm.bpStatus.forEach((item, index) => {
        if (this.flag == item) {
          this.searchForm.bpStatus.splice(index, 1);
        }
      });
      this.flag = "";
    },
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
    hideDialog() {
      this.dialogVisible = false;
    },
    showTaInfo(row) {
      // console.log(row)
      sessionStorage.setItem("HR", JSON.stringify(this.HR));
      sessionStorage.setItem("BP", JSON.stringify(this.BP));
      let ta_id = row.id;
      this.dialogVisible = true;
      if (typeof this.$refs.sideRouterViewRef == "undefined") {
        this.$router.push({ name: "taInfo", query: { ta_id: ta_id } });
      } else {
        this.$refs.sideRouterViewRef.getTaInfo(ta_id);
        this.$refs.sideRouterViewRef.getFollowList(ta_id);
        this.$refs.sideRouterViewRef.getFileList();
      }
    },
    cleanDialogData() {
      if (typeof this.$refs.sideRouterViewRef != "undefined") {
        this.$refs.sideRouterViewRef.cleanInfo();
      }
    },
    cleanTrivialDialog() {
      if (typeof this.$refs.addTaWin != "undefined") {
        this.$refs.addTaWin.cleanInfo();
      }
    },
    formatDateToMinute(time_str) {
      var return_str = time_str;
      if (return_str.length == 19 && return_str.indexOf(":") > 0) {
        return_str = return_str.substring(0, return_str.lastIndexOf(":"));
      }
      return return_str;
    },
    addTa() {
      sessionStorage.setItem("HR", JSON.stringify(this.HR));
      sessionStorage.setItem("BP", JSON.stringify(this.BP));
      this.trivialDialogTitle = "新增人才";
      this.trivialDialogTab = "addTa";
      this.trivialDialogVisible = true;
    },
    onSubmit() {
      if (this.trivialDialogTab == "addTa") {
        this.$refs.addTaWin.saveData();
      }
    },
    handleSizeChange(val) {
      this.paginationInfo.rows = val;
      this.getTaList();
    },
    handleCurrentChange(val) {
      this.paginationInfo.page = val;
      this.getTaList();
    },
    // 更新时间为本日的行高亮
    tableRowClassName({ row, rowIndex }) {
      for (let i = 0; i < this.bcolor.length; i++) {
        if (rowIndex == i) {
          return "warning-row";
        }
      }
    },
    openLoading,
    closeLoading,
  },
};
</script>
<style scoped>
.el-table /deep/ th.gutter {
  display: table-cell !important;
}
</style>
<style >
.interTime
  .el-picker-panel__body
  .el-time-panel
  .el-time-spinner
  .el-time-spinner__wrapper:nth-child(2) {
  display: none;
}
.interTime
  .el-picker-panel__body
  .el-time-panel
  .el-time-spinner
  .el-time-spinner__wrapper:nth-child(1) {
  width: 100%;
}

.taList .el-table .warning-row {
  background: oldlace;
}
</style>
