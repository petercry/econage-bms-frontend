<template>
  <eco-content
    top="0px"
    bottom="0px"
    type="tool"
    style="background-color:#f5f5f5"
  >
    <div class="listBook">
      <ecoLoading
        ref='ecoLoadingRef'
        text='加载中...'
      ></ecoLoading>
      <eco-content
        top="0px"
        height="60px"
        type="tool"
        style="border-bottom:1px solid #ddd;box-sizing:border-box"
      >
        <el-row style="padding:12px 10px;background-color:#fff;">
          <el-col :span="24">
            <eco-tool-title
              style="line-height: 34px;margin-right:50px;fontWeight:700;"
              :title="'会议室预约'"
            ></eco-tool-title>
            <el-button
              plain
              class="plainBtn searchBtn "
              @click.native="searchShowFunc"
            ><i
                class="el-icon-search"
                style="margin-right:8px"
              ></i>高级检索</el-button>
            <el-button
              class="plainBtn  btnred toolBtn"
              @click.native="delMulti"
            ><i
                class="el-icon-minus"
                style="margin-right:8px"
              ></i>删除</el-button>
            <el-button
              type="primary"
              class="toolBtn"
              @click="register"
            ><i
                class="el-icon-plus"
                style="margin-right:8px"
              ></i>会议室预约</el-button>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content
        top="60px"
        height="40px"
        type="tool"
        class="dataNav"
        style="background-color:#f5f5f5;padding:2px 15px 0 15px;border-bottom:1px solid #ddd;"
        v-show="dialogVisible"
      >
        <div>
          <span>会议名称：</span>
          <el-input
            v-model="form.huiyiname"
            style="width:160px;"
          ></el-input>
          <span>会议室名称：</span>
          <el-input
            v-model="form.name"
            style="width:160px;"
          ></el-input>
          <span>开始日期：</span>
          <el-date-picker
            v-model="form.startDateLeft"
            type="date"
            style="width:130px"
          >
          </el-date-picker>
          -
          <el-date-picker
            v-model="form.startDateRight"
            type="date"
            style="width:130px"
          >
          </el-date-picker>
          <span>结束日期：</span>
          <el-date-picker
            v-model="form.endDateLeft"
            type="date"
            style="width:130px"
          >
          </el-date-picker>
          -
          <el-date-picker
            v-model="form.endDateRight"
            type="date"
            style="width:130px"
          >
          </el-date-picker>

          <el-button
            plain
            class="plainBtn"
            style="fontSize:12px"
            @click="resetForm"
          >重置</el-button>
          <el-button type="primary">搜索</el-button>
        </div>
      </eco-content>
      <eco-content
        bottom="42px"
        :top="getContentTop"
        ref="content"
        class="ecoContentClass"
      >
        <el-table
          :data="listData"
          stripe
          style="width: 100%"
          height="100%"
          @sort-change="sortTablefunc"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          >

          </el-table-column>
          <el-table-column
            label="序号"
            type="index"
            width="50"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="会议名称"
            sortable="custom"
          >
          </el-table-column>
          <el-table-column
            prop="adress"
            label="开始日期"
            sortable="custom"
          >
          </el-table-column>
          <el-table-column
            prop="yongtu"
            label="结束日期"
            sortable="custom"
          >
          </el-table-column>
          <el-table-column
            prop="miaoshu"
            label="会议地点"
            sortable="custom"
          >
          </el-table-column>
          <el-table-column
            prop="beizhu"
            label="会议内容"
            sortable="custom"
          >
          </el-table-column>
          <el-table-column
            prop="createDate"
            label="预约人"
            sortable="custom"
          >
          </el-table-column>
          <el-table-column
            prop="createDate"
            label="工作电话"
            sortable="custom"
          >
          </el-table-column>
          <el-table-column
            prop="createDate"
            label="创建日期"
            sortable="custom"
          >
          </el-table-column>
          <el-table-column
            label="操作"
            width="120"
          >
            <template slot-scope="scope">
              <div>
                <el-button type="text">编辑</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </eco-content>
      <eco-content
        bottom="0px"
        type="tool"
        style="padding:5px 0px"
      >
        <div>
          <div style="text-align: right;">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="pageInfo.page"
              :page-sizes="[20,30,50,100]"
              :page-size="pageInfo.rows"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageInfo.total"
            >
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
import { sysEnv } from '@/modules/meeting/config/env.js'
import { EcoUtil } from '@/components/util/main.js'
import { EcoMessageBox } from '@/components/messageBox/main.js'
import { mapActions, mapGetters, mapState } from 'vuex'
import { Loading } from 'element-ui';
// import { getKnowledgeLibCard, deleteKnowledgeLib } from '@/modules/knowledge/api/knowledge.js'
export default {
  name: 'listBook',
  components: {
    ecoContent,
    ecoLoading,
    ecoToolTitle
  },
  data() {
    return {
      form: {
        huiyiname: '',
        name: '测试',
        order: '',
        sort: '',
        startDateLeft: '',
        startDateRight: '',
        endDateLeft:'',
        endDateRight:'',
        endDate: ''
      },
      pageInfo: {
        page: 1,
        rows: 30,
        total: 0
      },
      listData: [
        {
          name: '测试'
        }
      ],
      dialogVisible: false,
      checkBoxData: []

    }
  },
  computed: {

    getContentTop: function () {
      if (this.dialogVisible) {
        return '103px';
      } else {
        return '60px';
      }
    }
  },
  methods: {

    // 重置表单
    resetForm(){

    },
    // 显示搜索
    searchShowFunc() {
      this.dialogVisible = !this.dialogVisible
    },
    // 排序
    sortTablefunc(column, prop, order) {
      if (column.prop && column.order) {
        this.form.sort = column.prop;
        if (column.order == 'ascending') {
          this.form.order = 'asc'
        } else if (column.order == 'descending') {
          this.form.order = 'desc'
        }
      } else {
        this.form.order = '';
        this.form.sort = '';
      }
      // this.getRSFListFunc();
    },

    // 会议室注册
    register() {
      if (sysEnv === 0) {
        this.$router.push({ name: 'meetingAdd' })
      }
    },
    handleSelectionChange(val) {
      this.checkBoxData = val
    },
    //  批量删除
    delMulti() {
      if (this.checkBoxData.length === 0) {
        EcoMessageBox.alert('请选择您要删除的数据', '提示');
        return;
      }
      let options = { type: 'warning', lockScroll: false }
      let confirmYesFunc = () => {
        // deleteKnowledgeLib(id).then(res => {
        //   this.$message({
        //     duration: 500,
        //     message: '删除成功',
        //     type: 'success',
        //     onClose: () => {
        //       this.getKnowledgeList()
        //     }
        //   });

        // }).catch(() => {

        // })
      }
      EcoMessageBox.confirm('是否确认删除', '提示', options, confirmYesFunc);
    },
    handleSizeChange() {

    },
    handleCurrentChange() {

    }
  },
}
</script>

<style  scoped>
.listBook {
  position: relative;
  height: 96%;
  margin: 0 24px;
  top: 2%;
  overflow-y: hidden;
  min-width: 1131px;
  border: 1px solid #ddd;
  color: #0f1419;
}
.listBook .searchBtn {
  float: right;
  margin-right: 15px;
  min-width: 105px;
  width: 45%;
  max-width: 120px;
}
.listBook .plainBtn {
  border-color: #409eff;
  color: #409eff;
  font-size: 14px;
}
.listBook .toolBtn {
  float: right;
  font-size: 14px;
  margin-right: 30px;
  min-width: 105px;
  width: 45%;
  max-width: 120px;
}
.listBook .plainBtn.btnred {
  color: #f56c6c;
  border-color: #f56c6c;
}
.listBook .plainBtn.btnred:hover {
  color: #f56c6c;
  border-color: #f56c6c;
}
.ecoContentClass {
  padding: 10px 15px;
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
  font-size: 14px;
}
</style>
