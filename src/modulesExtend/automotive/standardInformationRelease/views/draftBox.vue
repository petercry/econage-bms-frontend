<template>
    <div>
      <eco-content top='20px' type='tool' class="eco-content" style="padding:0px 20px 0px 20px;background-color: white">
        <el-button type='primary' size='small' @click='backCase' style="float:left;">返回</el-button>
        <div style="margin-top:2px;float:right;">
          <span class='searchInputLabel'>全文搜索:</span>
          <el-input clearable style='width:150px' @keyup.enter.native="requestData('search')" v-model='searchContent.title'
            placeholder='请输入'>
            <i class='el-icon-search el-input__icon' slot='suffix'></i>
          </el-input>
        </div>
      </eco-content>
      <eco-content top='60px' height='90px' type='tool' style="background-color: white">
        <el-row style="padding:15px 10px 16px 10px;background:#fff">
          <el-col>
            <span class='searchInputLabel'>&emsp;&emsp;标题:</span>
            <el-input clearable style='width:150px' v-model='searchContent.title'
              placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
            <span class='searchInputLabel'>&emsp;&emsp;类别:</span>
            <el-select filterable v-model='searchContent.type' style='width:150px;' clearable>
              <el-option :value='item.val' :label='item.text' v-for='item in typeData' :key='item.id'></el-option>
            </el-select>
            <!-- <span class='searchInputLabel'>&emsp;&emsp;&emsp;日期:</span>
            <el-date-picker style='width:150px' v-model="searchContent.startDate" value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
            </el-date-picker>
            <el-button @click='requestData("search")' type='primary' style='margin-left:5px;'>查询</el-button>
            <el-button @click='restSearContent'>重置</el-button> -->
          </el-col>
          <el-col style="margin-top:10px;">
            <span class='searchInputLabel'>&emsp;&emsp;日期:</span>
            <el-date-picker style='width:150px' v-model="searchContent.startDate" value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
            </el-date-picker>
            <el-button @click='requestData("search")' type='primary' style='margin-left:5px;'>查询</el-button>
            <el-button @click='restSearContent'>重置</el-button>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content top="150px" type="tool" style="left:20px;right:20px;bottom:20px;">
        <el-table ref='certificateListTable' stripe :data='tableData' header-row-class-name='tableHeader' border tooltip-effect='dark'
          height='100%' class='standardizationTable'>
          <el-table-column type='index' label='序号'></el-table-column>
          <el-table-column show-overflow-tooltip label='标题' prop='title'>
            <template slot-scope='scope'>
              <span v-if="!scope.row.isEdit">{{scope.row.title}}</span>
              <el-input v-else clearable style='width:150px' v-model='searchContent.title' placeholder='请输入'></el-input>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label='类别' prop='type'>
            <template slot-scope='scope'>
              <span v-if="!scope.row.isEdit">{{typeObj[scope.row.type]}}</span>
              <el-select v-else filterable v-model='searchContent.type' style='width:150px;' clearable>
                <el-option :value='item.val' :label='item.text' v-for='item in typeData' :key='item.id'></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label='日期' prop='createDate'>
            <template slot-scope='scope'>
              <span v-if="!scope.row.isEdit">{{scope.row.createDate}}</span>
              <el-date-picker v-else style='width:150px' v-model="searchContent.startDate" value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label='操作'>
            <template slot-scope="scope">
              <el-button v-if="!scope.row.isEdit" type='text' @click='editCase(scope.row)'>编写</el-button>
              <el-button v-if="!scope.row.isEdit" type='text' @click='delCase(scope.row.id)'>删除</el-button>
              <el-button v-if="scope.row.isEdit" type='text' @click='saveCase(scope.row)'>保存</el-button>
              <el-button v-if="scope.row.isEdit" type='text' @click='canCase(scope.row)'>取消</el-button>
            </template>
          </el-table-column>
        </el-table>
      </eco-content>
    </div>
</template>

<script>
  import ecoContent from '@/components/pageAb/ecoContent.vue'
  import { getDraftList,getGroupList,draftDelete } from '../service/service.js'
  import {sysEnv} from '../config/env.js'
  import {EcoUtil} from '@/components/util/main.js'
export default {
    name:"",
    data() {
        return {
          searchContent:{
            title: '',
            type: '',
            startDate: ''
          },
          tableData:[{title:"帅气男人",isEdit: false}],
          typeObj:{},
          typeData:[]
        }
    },
    components:{
      ecoContent
    },
    created() {
      this.getGroupList()
      this.getDraftList()
    },
    mounted() {
      this.listAction()
    },
    methods: {
      listAction() {
        let that = this
        let callBackDialogFunc = function (obj) {
            if (obj && obj.action) {
                that.getDraftList()
            }
        }
        EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'InformationRelease')
      },
      //获取类型数据
      getGroupList() {
        getGroupList().then(res => {
          for (var i in res.data) {
              this.typeData.push({val: i,text: res.data[i].text})
              this.typeObj[res.data[i].id] = res.data[i].text
          }
        })
      },
      //获取草稿箱列表
      getDraftList() {
        getDraftList().then(res => {
          this.tableData = res.data.rows.map(x => {
            return {
              ...x,
              isEdit:false
            }
          })
        })
      },
      //编辑
      editCase(row) {
        // row.isEdit = true
        if (sysEnv==0){
            this.$router.push({name:'addProcess',params:{id:row.id}})
        }else{
            // EcoUtil.getSysvm().closeDialog();
            EcoUtil.getSysvm().openDialog('动态发布','/standardInformationRelease/#/addProcess/' + row.id,800,700,'10vh');
        }
      },
      // 删除
      delCase(id) {
        draftDelete(id).then(res => {
          this.$message.success("删除成功")
          this.getDraftList()
        })
      },
      //重置
      restSearContent() {
        this.searchContent = {}
      },
      //返回
      backCase() {
        let doObj = {}
        doObj.action = 'draftBox';
        doObj.data = []
        doObj.close = true;
        EcoUtil.getSysvm().callBackDialogFunc(doObj);
      },
      //编辑成功
      saveCase(row) {
        row.isEdit = false
      },
      //取消编辑
      canCase(row) {
        row.isEdit = false
      }
    }
}
</script>
<style scoped>
/* @import url(); 引入css类 */
  .standardizationTable /deep/ .el-table__row.el-table__row--striped td {
    background: #f5f7fa !important;
  }

  .standardizationTable /deep/ .tableHeader th {
    background: #f5f7fa;
    color: #000;
    /* border-bottom-width: 0px; */
  }

</style>
