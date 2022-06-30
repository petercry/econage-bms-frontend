<template>
  <div class="performance">
    <!-- 工具箱 -->
    <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>系统运维工具箱</span>
        </div>
        <div class="hold-all">
          <el-button type="primary" @click="open" size="medium">重置缓存</el-button>
        </div>
      </el-card>
    </div>
    <!-- 标签页选择区域 -->
    <div style="height: 300px; margin-top: 30px;">
      <el-tabs v-model="activeName">
        <!-- SQL执行效率分析 -->
        <el-tab-pane label="SQL执行效率分析" name="first" v-loading="loading">
          <!-- 表单域 -->
          <div class="sql-search-area">
            <el-form ref="sqlSearchForm" :model="sqlSearchForm">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="SQL语句">
                    <el-input v-model="sqlSearchForm.sql" style="width: 120px;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="调用方法">
                    <el-input v-model="sqlSearchForm.mapper" style="width: 120px;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                    <el-checkbox v-model="sqlSearchForm.ifSlow" @change="getSQLList">仅显示有慢SQL（10秒以上）的记录项</el-checkbox>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-button type="primary" @click="getSQLList">搜索</el-button>
                    <el-button type="primary" plain @click="resetForm">重置</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item>
                    <el-select v-model="sqlSearchForm.timeUnit" style="width: 150px;" @change="showDatePicker">
                      <el-option :label="item.text" :value="item.id" v-for="(item, index) in TimeDate" :key="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="18">
                  <el-form-item v-if="dateFlag">
                    <el-date-picker v-model="sqlSearchForm.date" type="daterange" range-separator="至"
                      start-placeholder="开始时间" end-placeholder="结束时间" @change="getSQLList" style="width: 250px;"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <!-- 列表 -->
          <div class="SQLTableList">
            <el-table :data="SQLlist" border style="width: 100%" :header-cell-style="{textAlign: 'center'}"
              :cell-style="{ textAlign: 'center' }">
              <el-table-column prop="sql" label="SQL语句"></el-table-column>
              <el-table-column prop="mapper" label="调用方法"></el-table-column>
              <el-table-column prop="date" label="统计日期" width="110" sortable></el-table-column>
              <el-table-column prop="nodeIp" label="节点IP" width="110"></el-table-column>
              <el-table-column prop="executeCount" label="总执行次数" width="69" sortable></el-table-column>
              <el-table-column prop="runningCount" label="当前并发数" width="69" sortable></el-table-column>
              <el-table-column prop="concurrentMax" label="最高并发数" width="69" sortable></el-table-column>
              <el-table-column prop="histogram010" label="0-10毫秒执行次数" width="85" sortable></el-table-column>
              <el-table-column prop="histogram10100" label="10-100毫秒执行次数" width="93" sortable></el-table-column>
              <el-table-column prop="histogram1001000" label="100毫秒-1秒执行次数" width="93" sortable></el-table-column>
              <el-table-column prop="histogram100010000" label="1-10秒执行次数" width="84" sortable></el-table-column>
              <el-table-column prop="executeSlowCount" label="10秒以上执行次数" width="85" sortable></el-table-column>
            </el-table>
            <!-- 分页 -->
            <div style="float: right;margin-top: 15px;">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="sqlSearchForm.page" :page-sizes="[10, 20, 30, 40]" :page-size="sqlSearchForm.rows"
                layout="total, sizes, prev, pager, next, jumper" :total="sqlSearchForm.total">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>






        <!-- 外部接口效率分析 -->
        <el-tab-pane label="外部接口效率分析" name="second">
          <!-- 表单域 -->
          <div class="efficiency-search-area">
            <el-form ref="efficiencySearchForm" :model="efficiencySearchForm">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="接口URL">
                    <el-input v-model="efficiencySearchForm.url" style="width: 120px;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="调用方法">
                    <el-input v-model="efficiencySearchForm.method" style="width: 120px;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                    <el-checkbox v-model="efficiencySearchForm.ifSlow" @change="getEfficiencyList">仅显示有慢SQL（10秒以上）的记录项
                    </el-checkbox>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-button type="primary" @click="getEfficiencyList">搜索</el-button>
                    <el-button type="primary" plain @click="resetEfficiencyForm">重置</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item>
                    <el-select v-model="efficiencySearchForm.timeUnit" style="width: 150px;"
                      @change="showEfficiencyDatePicker">
                      <el-option :label="item.text" :value="item.id" v-for="(item, index) in TimeDate" :key="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="18">
                  <el-form-item v-if="efficiencyDateFlag">
                    <el-date-picker v-model="efficiencySearchForm.date" type="daterange" range-separator="至"
                      start-placeholder="开始时间" end-placeholder="结束时间" @change="getEfficiencyList" style="width: 250px;"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <!-- 列表 -->
          <div class="efficiencyTableList">
            <el-table :data="efficiencyList" border style="width: 100%" :header-cell-style="{textAlign: 'center'}"
              :cell-style="{ textAlign: 'center' }">
              <el-table-column prop="url" label="接口URL"></el-table-column>
              <el-table-column prop="method" label="调用方法"></el-table-column>
              <el-table-column prop="date" label="统计日期" width="110" sortable></el-table-column>
              <el-table-column prop="nodeIp" label="节点IP" width="110"></el-table-column>
              <el-table-column prop="executeCount" label="总执行次数" width="69" sortable></el-table-column>
              <el-table-column prop="runningCount" label="当前并发数" width="69" sortable></el-table-column>
              <el-table-column prop="concurrentMax" label="最高并发数" width="69" sortable></el-table-column>
              <el-table-column prop="histogram010" label="0-10毫秒执行次数" width="85" sortable></el-table-column>
              <el-table-column prop="histogram10100" label="10-100毫秒执行次数" width="93" sortable></el-table-column>
              <el-table-column prop="histogram1001000" label="100毫秒-1秒执行次数" width="93" sortable></el-table-column>
              <el-table-column prop="histogram100010000" label="1-10秒执行次数" width="84" sortable></el-table-column>
              <el-table-column prop="executeSlowCount" label="10秒以上执行次数" width="85" sortable></el-table-column>
            </el-table>
            <!-- 分页 -->
            <div style="float: right;margin-top: 15px;">
              <el-pagination @size-change="handleSizeChangeefficiency" @current-change="handleCurrentChangeefficiency"
                :current-page="efficiencySearchForm.page" :page-sizes="[10, 20, 30, 40]"
                :page-size="efficiencySearchForm.rows" layout="total, sizes, prev, pager, next, jumper"
                :total="efficiencySearchForm.total">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>











        <!-- 外部接口请求日志分析 -->
        <el-tab-pane label="外部接口请求日志分析" name="third">
          <!-- 表单域 -->
          <div class="journal-search-area">
            <el-form ref="journalSearchForm" :model="journalSearchForm">
              <el-row>
                <el-col :span="5">
                  <el-form-item label="接口URL">
                    <el-input v-model="journalSearchForm.url" style="width: 120px;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="调用方法">
                    <el-input v-model="journalSearchForm.method" style="width: 120px;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="请求体内容">
                    <el-input v-model="journalSearchForm.requestBody" style="width: 120px;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="应答体内容">
                    <el-input v-model="journalSearchForm.responseBody" style="width: 120px;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="错误信息">
                    <el-input v-model="journalSearchForm.errorMsg" style="width: 120px;"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <el-form-item label="请求方">
                    <el-input v-model="journalSearchForm.appId" style="width: 150px;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item>
                    <el-select v-model="journalSearchForm.timeUnit" style="width: 178px;"
                      @change="showJournalDatePicker">
                      <el-option :label="item.text" :value="item.id" v-for="(item, index) in TimeDate" :key="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item v-if="journalDateFlag">
                    <el-date-picker v-model="journalSearchForm.date" type="daterange" range-separator="至"
                      start-placeholder="开始时间" end-placeholder="结束时间" @change="getJournalList" style="width: 250px;"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item>
                    <el-checkbox v-model="journalSearchForm.ifError" @change="getJournalList">仅显示有错误信息的记录</el-checkbox>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-button type="primary" @click="getJournalList">搜索</el-button>
                    <el-button type="primary" plain @click="resetJournalForm">重置</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <!-- 列表 -->
          <div class="journalTableList">
            <el-table :data="journalList" border style="width: 100%" :header-cell-style="{textAlign: 'center'}"
              :cell-style="{ textAlign: 'center' }">
              <el-table-column prop="url" label="接口URL" width="200"></el-table-column>
              <el-table-column prop="method" label="调用方法" width="200"></el-table-column>
              <el-table-column prop="requestBody" width="200">
                <template slot="header" slot-scope="scope">
                  请求体内容<br>(request body)
                </template>
              </el-table-column>
              <el-table-column prop="responseBody" width="200">
                <template slot="header" slot-scope="scope">
                  应答体内容<br>(response body)
                </template>
              </el-table-column>
              <el-table-column prop="errorMsg" label="错误信息"></el-table-column>
              <el-table-column prop="serverIp" label="节点IP" width="100"></el-table-column>
              <el-table-column prop="execMills" width="70" sortable>
                <template slot="header" slot-scope="scope">
                  执行时长<br>(毫秒数)
                </template>
              </el-table-column>
              <el-table-column prop="createDate" label="请求时间" width="100" sortable></el-table-column>
              <el-table-column prop="appId" label="请求方" width="155"></el-table-column>
            </el-table>
            <!-- 分页 -->
            <div style="float: right;margin-top: 15px;">
              <el-pagination @size-change="handleSizeChangejournal" @current-change="handleCurrentChangejournal"
                :current-page="journalSearchForm.page" :page-sizes="[10, 20, 30, 40]"
                :page-size="journalSearchForm.rows" layout="total, sizes, prev, pager, next, jumper"
                :total="journalSearchForm.total">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import tagSelect from '@/components/orgPick/tagSelect.vue'
  import {
    getSQLtableListAjax,
    getEfficiencytableListAjax,
    getJournalListAjax,
    resetCacheAjax,
    getTimeDateAjax
  } from '@/modulesExtend/extend/monitor/service/service.js'
  export default {
    components: {
      tagSelect
    },
    data() {
      return {
        // 控制标签页选择
        activeName: 'first',
        // 时间类型选项
        TimeDate: [],
        // 加载
        loading: true,




        // SQL执行效率分析搜索
        sqlSearchForm: {
          sql: '',
          mapper: '',
          ifSlow: false,
          timeUnit: 'LATEST_TWO_DAYS',
          date: [],
          page: 1,
          rows: 10,
          total: 0,
        },
        // 控制时间选择器的显示
        dateFlag: false,
        // SQL列表信息
        SQLlist: [],







        // 外部接口效率分析搜索
        efficiencySearchForm: {
          url: '',
          method: '',
          ifSlow: false,
          timeUnit: 'LATEST_TWO_DAYS',
          date: [],
          page: 1,
          rows: 10,
          total: 0,
        },
        // 外部接口效率分析列表信息
        efficiencyList: [],
        // 控制外部接口效率分析时间选择器的显示
        efficiencyDateFlag: false,




        // 外部接口请求日志分析搜索
        journalSearchForm: {
          url: '',
          method: '',
          requestBody: '',
          responseBody: '',
          errorMsg: '',
          appId: '',
          timeUnit: 'LATEST_TWO_DAYS',
          date: [],
          ifError: false,
          page: 1,
          rows: 10,
          total: 0,
        },
        // 控制外部接口请求日志分析时间选择器的显示
        journalDateFlag: false,
        // 外部接口请求日志分析列表信息
        journalList: [],
        // 选人组件信息
        options: {
          selectNum: 2,
          maxOrgPathLevel: 0,
          selectType: 'User'
        },

      };
    },
    created() {
      this.getSQLList();
      this.getEfficiencyList();
      this.getJournalList();
      this.getTimeDate();
    },
    methods: {
      //重置缓存按钮提示框
      open() {
        this.$confirm('确定执行重置缓存操作？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          resetCacheAjax().then((res) => {
            if (res.status == 200) {
              this.$message({
                message: '缓存已重置！',
                type: 'success'
              });
            }
          })
        }).catch(() => {
          return;
        });
      },
      // 获取时间类型选项
      getTimeDate() {
        getTimeDateAjax().then((res) => {
          this.TimeDate = res.data
        })
      },




      // 时间下拉框值改变时
      showDatePicker() {
        if (this.sqlSearchForm.timeUnit == 'CUSTOM') {
          this.dateFlag = true
        } else {
          this.dateFlag = false
          this.getSQLList()
        }
      },
      // 获取列表
      getSQLList() {
        this.loading = true
        getSQLtableListAjax(this.sqlSearchForm).then((res) => {
          this.loading = false
          this.sqlSearchForm.total = res.data.total;
          this.SQLlist = res.data.rows
        })
      },
      // 重置搜索表单
      resetForm() {
        this.sqlSearchForm = this.$options.data().sqlSearchForm
        this.getSQLList()
      },
      // 每页条数发生变化
      handleSizeChange(val) {
        this.sqlSearchForm.rows = val
        this.getSQLList()
      },
      // 页码发生变化
      handleCurrentChange(val) {
        this.sqlSearchForm.page = val
        this.getSQLList()
      },




      // 外部接口效率分析时间下拉框值改变时
      showEfficiencyDatePicker() {
        if (this.efficiencySearchForm.timeUnit == 'CUSTOM') {
          this.efficiencyDateFlag = true
        } else {
          this.efficiencyDateFlag = false
          this.getEfficiencyList()
        }
      },
      // 获取外部接口效率分析列表
      getEfficiencyList() {
        this.loading = true
        getEfficiencytableListAjax(this.efficiencySearchForm).then((res) => {
          this.loading = false
          this.efficiencySearchForm.total = res.data.total;
          this.efficiencyList = res.data.rows
        })
      },
      // 重置外部接口效率分析搜索表单
      resetEfficiencyForm() {
        this.efficiencySearchForm = this.$options.data().efficiencySearchForm
        this.getEfficiencyList()
      },
      // 外部接口效率分析每页条数发生变化
      handleSizeChangeefficiency(val) {
        this.efficiencySearchForm.rows = val
        this.getEfficiencyList()
      },
      // 外部接口效率分析页码发生变化
      handleCurrentChangeefficiency(val) {
        this.efficiencySearchForm.page = val
        this.getEfficiencyList()
      },





      // 外部接口请求日志分析时间下拉框值改变时
      showJournalDatePicker() {
        if (this.journalSearchForm.timeUnit == 'CUSTOM') {
          this.journalDateFlag = true
        } else {
          this.journalDateFlag = false
          this.getJournalList()
        }
      },
      // 获取外部接口请求日志分析列表
      getJournalList() {
        this.loading = true
            getJournalListAjax(this.journalSearchForm).then((res) => {
              this.loading = false
              this.journalSearchForm.total = res.data.total;
              this.journalList = res.data.rows
            })
      },
      // 重置外部接口请求日志分析搜索表单
      resetJournalForm() {
        this.journalSearchForm = this.$options.data().journalSearchForm
        this.getJournalList()
      },
      // 外部接口效率分析每页条数发生变化
      handleSizeChangejournal(val) {
        this.journalSearchForm.rows = val
        this.getJournalList()
      },
      // 外部接口效率分析页码发生变化
      handleCurrentChangejournal(val) {
        this.journalSearchForm.page = val
        this.getJournalList()
      },
    }
  }
</script>
<style scoped>
  .performance {
    margin: 10px;
  }

  .hold-all .el-button {
    margin-left: 10px;
    margin-bottom: 10px;
  }

  .performance .el-col-6 {
    width: 200px;
  }

  .performance .el-col-8 {
    width: 290px;
  }
  .performance .el-col-7 {
    width: 280px;
  }
  .performance .el-col-4 {
    width: 130px;
  }
  .performance .el-col-5 {
    width: 212px;
  }

</style>
