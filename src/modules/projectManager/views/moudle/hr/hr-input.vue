<template>
  <div class="hr-input">
    <eco-content top="0px" height="60px" type="tool" style="border-bottom:1px solid #ddd;overflow:hidden;">
      <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
      <el-row style="padding:12px 10px;background-color:#fff;">
        <el-col :span="24">
          <eco-tool-title style="line-height: 34px;margin-right:50px;" :title="'人力资源'"></eco-tool-title>
          <el-button plain class="plainBtn" style="margin-left:5px;" @click="clear">清空</el-button>
          <el-button type="primary" @click="saveInfo">保存</el-button>
        </el-col>
      </el-row>
    </eco-content>
    <!-- 表格区域 -->
    <div style="margin-top:60px; height:100%;">
      <div class="title">{{projectInfo.name}}人力资源计划</div>

      <div class="edit-table" style="position: relative;height:90%;">
        <!-- 控制列 -->
        <div style="position: absolute;top: 25px;right: 3%;">
          <el-tooltip class="item" effect="dark" content="添加月" placement="right-start">
            <el-button circle type="primary" @click="addlist" icon="el-icon-plus"></el-button>
          </el-tooltip>
          <div style="margin-top:5px;">
            <el-tooltip class="item" effect="dark" content="删除月" placement="right-start">
              <el-button circle type="danger" @click="dellist" icon="el-icon-minus"></el-button>
            </el-tooltip>
          </div>
        </div>
        <!-- 控制行 -->
        <div style="padding-top:20px;margin-left:35px;">
          <el-tooltip class="item" effect="dark" content="添加部门" placement="top-start">
            <el-button type="primary" @click="addrow" size="small">添加</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除部门" placement="top-start">
            <el-button plain class="plainBtn" @click="delrow" size="small" style="font-size: 12px;">删除</el-button>
          </el-tooltip>
        </div>
        <!-- 表格 -->
        <div style="margin-top:10px;margin-left:35px; width:90%;height:61%;overflow:auto;">
          <table border="1" style="border:1px solid #ddd;">
            <tr style="background-color: #f5f5f5;">
              <th style="min-width: 120px;max-width: 150px;padding-left:15px" v-if="depShow">部门</th>
              <th v-for="(item, index) in list" :key="index" style="min-width: 120px;max-width: 120px;position: relative;">
                <i class="el-icon-error" @click="del_list(index)"></i>
                <el-date-picker v-model="list[index]" type="month" :clearable='false' value-format="yyyy-MM" style="min-width: 115px;max-width: 115px;border: none;background-color: #f5f5f5;"></el-date-picker>
              </th>
              <th v-if="depShow" style="text-align: center;min-width: 70px;max-width: 70px;">操作</th>
            </tr>
            <tr v-for="(itemb, indexa) in row" :key="indexa">
              <td>
                <el-input size="mini" v-model="title[indexa].orgText" @focus="onCustomOrgSelectAction(indexa)"></el-input>
              </td>
              <td v-for="(item, index) in list" :key="index">
                <el-input size="mini" v-model="itemb[index]" @blur="judgeNub(itemb[index],indexa,index)" style="border: 0px;"></el-input>
              </td>
              <td style="text-align: center;">
                <el-button size="mini" type="danger" @click="_delete(indexa)">删除</el-button>
              </td>
            </tr>
            <tr v-if="depShow" style="background-color: #f5f5f5;">
              <td style="min-width: 120px;max-width: 150px;padding-left:15px">汇总</td>
              <td v-for="(itemg, indexg) in sum" :key="indexg" style="padding-left:15px">{{itemg}}</td>
              <td></td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ecoContent from "@/components/pageAb/ecoContent.vue";
import ecoLoading from "@/components/loading/ecoLoading.vue";
import ecoToolTitle from "@/components/tool/ecoToolTitle.vue";
import { EcoUtil } from "@/components/util/main.js";
import { EcoUserPick } from "@/components/orgPick/EcoUserPick.js";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { addInfoAjax, getHrList, deleteList } from "../../../api/hr.js";
export default {
  name: "hr-input",
  data() {
    return {
      list: [],
      row: [],
      title: [],
      sum: [],
      depShow: false,
      input: "",
    };
  },
  components: {
    ecoContent,
    ecoLoading,
    ecoToolTitle,
  },
  created() {
    this.getprojectInfo();
  },
  computed: {
    ...mapGetters(["projectInfo"]),
  },
  methods: {
    // 保存信息
    saveInfo() {
      let projectaddInfo = {};
      projectaddInfo.infoId = this.projectInfo.id;
      projectaddInfo.resourcesList = [];
      for (let x = 0; x < this.row.length; x++) {
        for (let i = 0; i < this.list.length; i++) {
          let dateinfo = {};
          dateinfo.deptId = this.title[x].linkId;
          dateinfo.deptName = this.title[x].orgText;
          dateinfo.dateStr = this.list[i];
          if (this.row[x][i] == undefined) {
            dateinfo.num = "";
          } else {
            dateinfo.num = this.row[x][i];
          }
          projectaddInfo.resourcesList.push(dateinfo);
        }
      }
      // console.log(projectaddInfo)
      addInfoAjax(projectaddInfo).then((res) => {
        console.log(res);
      });
    },
    // 项目信息
    getprojectInfo() {
      // console.log(this.projectInfo)
      getHrList(this.projectInfo.id).then((res) => {
        // console.log(res)
        if (res.rows.length == 0) {
        } else {
          this.depShow = true;
          // 部门与日期
          for (let i = 0; i < res.rows.length; i++) {
            let depObj = {};
            depObj.linkId = res.rows[i].deptId;
            depObj.orgText = res.rows[i].deptName;
            depObj.id =
              '{"type":"DEPT","orgId":' +
              res.rows[i].deptId +
              ',"linkId":' +
              res.rows[i].deptId +
              ',"role":null}';
            this.title.push(depObj);
            for (let listkey in res.rows[i].map) {
              this.list.push(listkey);
            }
          }
          // 部门数组去重
          let removalObj = {};
          this.title.forEach((item) => {
            removalObj[item.orgText] = item;
          });
          let a = [];
          for (let key in removalObj) {
            a.push(removalObj[key]);
          }
          this.title = a;
          // 日期去重
          let listset = new Set();
          this.list.forEach((itema) => {
            listset.add(itema);
          });
          let b = Array.from(listset);
          this.list = b;
          // 处理row
          let _rows = res.rows;
          let _deptDataMap = {};
          let _deptDataList = [];
          for (let i = 0; i < _rows.length; i++) {
            let _deptId = _rows[i].deptId;
            if (_deptDataMap[_deptId]) {
            } else {
              _deptDataMap[_deptId] = {};
              _deptDataList.push(_deptId);
            }
            if (_rows[i].map) {
              for (let key in _rows[i].map) {
                _deptDataMap[_deptId][key] = _rows[i].map[key];
              }
            }
          }
          // console.log(_deptDataMap);
          // console.log(_deptDataList);
          let _dataList = [];
          for (let i = 0; i < _deptDataList.length; i++) {
            if (_deptDataMap[_deptDataList[i]]) {
              let _obj = {};
              let _index = 0;
              for (let key in _deptDataMap[_deptDataList[i]]) {
                _obj[String(_index)] = _deptDataMap[_deptDataList[i]][key].num;
                _index++;
              }
              _dataList.push(_obj);
            }
          }
          // console.log(_dataList);
          this.row = _dataList;
          for (let i = 0; i < this.list.length; i++) {
            this.sum.push(0);
          }
          this.getsum();
        }
      });
    },
    // 添加行
    addrow() {
      this.title.push({ linkId: "", orgText: "", id: "" });
      this.row.push({});
      this.getsum();
    },
    // 添加列
    addlist() {
      this.depShow = true;
      this.sum.push(0);
      if (this.list.length == 0) {
        let myDate = new Date();
        let tYear = myDate.getFullYear();
        let tMonth = myDate.getMonth();
        let m = tMonth + 1;
        if (m.toString().length == 1) {
          m = "0" + m;
        }
        let day = tYear + "-" + m;
        this.list.push(day);
      } else {
        let numb = this.list.length - 1;
        let arr = this.list[numb].split("-");
        let year = arr[0]; //获取当前日期的年份
        let month = arr[1]; //获取当前日期的月份
        let year2 = year;
        let month2 = parseInt(month) + 1;
        if (month2 == 13) {
          year2 = parseInt(year2) + 1;
          month2 = 1;
        }
        if (month2 < 10) {
          month2 = "0" + month2;
        }
        let t2 = year2 + "-" + month2;
        this.list.push(t2);
      }
      this.getsum();
    },
    // 删除行
    delrow() {
      this.row.pop();
      this.title.pop();
      this.getsum();
    },
    // 删除列
    dellist() {
      let listlen = this.list.length - 1;
      for (let i = 0; i < this.row.length; i++) {
        delete this.row[i][listlen];
      }
      this.list.pop();
      this.sum.pop();
      this.getsum();
    },
    // 判断输入是否为数字
    judgeNub(val, x, y) {
      if (val != undefined) {
        let re = /^[0-9]+.?[0-9]*/;
        let string2Result = val.split("");
        for (let i = 0; i < string2Result.length; i++) {
          if (!re.test(string2Result[i])) {
            this.row[x][y] = "";
          }
        }
      }
      this.getsum();
    },
    // 汇总计算
    getsum() {
      for (let x = 0; x < this.list.length; x++) {
        let listsum = 0;
        for (let i = 0; i < this.row.length; i++) {
          if (this.row[i][x] == undefined || this.row[i][x] == "") {
            let resetnum = 0;
            listsum = listsum + 0;
          } else {
            listsum = listsum + this.row[i][x] * 1;
          }
        }
        this.$set(this.sum, x, listsum);
      }
    },
    // 清除
    clear() {
      this.row = [];
      this.list = [];
      this.title = [];
      this.sum = [];
      this.depShow = false;
      deleteList(this.projectInfo.id).then((res) => {
        console.log(res);
      });
    },
    // 选部门
    onCustomOrgSelectAction(val) {
      // console.log(this.title[val].id);
      let _key = EcoUtil.getUID();
      let _keyData = {};
      let that = this;
      let callBack = function (callObj) {
        that.title[val].linkId = callObj.itemArray[0].linkId;
        that.title[val].orgText = callObj.itemArray[0].orgText;
        that.title[val].id = callObj.id;
        console.log(that.title[val]);
      };
      _keyData.initDataType = "STR";
      _keyData.initDataStr = this.title[val].id;
      _keyData.options = { selectNum: 1, selectType: "DEPT" };
      EcoUtil.getSysvm().setTempStore(_key, _keyData);
      EcoUserPick.searchReceiver(_key, callBack);
    },
    // 删除选中行
    _delete(val) {
      this.row.splice(val, 1);
      this.title.splice(val, 1);
      this.getsum();
    },
    // 删除列
    del_list(val) {
      // console.log(this.list.length);
      if (val == this.list.length - 1) {
        this.list.splice(val, 1);
        this.sum.splice(val, 1);
        for (let i = 0; i < this.row.length; i++) {
          delete this.row[i][val];
        }
        this.getsum();
      } else {
        this.list.splice(val, 1);
        this.sum.splice(val, 1);
        for (let i = 0; i < this.row.length; i++) {
          if (Object.keys(this.row[i]).length == 0) {
          } else {
            for (let key in this.row[i]) {
              if(key == val) {
                delete this.row[i][key];
              }else if(key != val) {
                // console.log(key)
                if(key > val) {
                  let flag = key -1
                  flag = flag.toString()
                  console.log(this.row[i][key])
                  this.row[i][flag] = this.row[i][key]
                  delete this.row[i][key];
                }
              }
            }
          }
        }
        this.getsum();
      }
    },
  },
  watch: {},
};
</script>
<style>
.hr-input {
  position: relative;
  height: 100%;
  overflow-y: hidden;
  min-width: 1131px;
  color: #0f1419;
  background-color: #fff;
}
.hr-input .plainBtn {
  border-color: #003b90;
  color: #003b90;
  font-size: 14px;
}
.hr-input .toolBtn {
  margin: 0 10px;
}
.hr-input .title {
  height: 70px;
  background-color: #f5f5f5;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  line-height: 70px;
}
.hr-input .el-icon-error {
  position: absolute;
  top: 3px;
  right: 3px;
  z-index: 100;
  font-size: 10px;
  color: #f56c6c;
  cursor: pointer;
}
</style>
<style>
.hr-input .el-input--medium .el-input__inner {
  background-color: #f5f5f5;
  border: 0px;
}
.hr-input .el-input--mini .el-input__inner {
  border: 0px;
}
</style>
