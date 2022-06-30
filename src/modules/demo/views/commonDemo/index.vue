<template>
    <div>
      <div class="kn-header" >
        <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
        <div>
          通用示例
          <ecoActionBtn :ecoActionBtnFunc="addGroup">
            <i slot="icon" class="el-icon-circle-plus"/>
            添加
          </ecoActionBtn>
          <ecoActionBtn :ecoActionBtnFunc="editGroup">
            <i slot="icon" class="el-icon-edit"/>
            编辑
          </ecoActionBtn>
          <ecoActionBtn :ecoActionBtnFunc="setValid.bind(this,false)">
            <i slot="icon" class="el-icon-remove-outline"/>
            删除
          </ecoActionBtn>
          <!-- <ecoActionBtn :ecoActionBtnFunc="setValid.bind(this,true)">
            <i slot="icon" class="el-icon-circle-check-outline"/>
            生效
          </ecoActionBtn> -->
        </div>
      </div>
      <ecoContent top="30px" bottom="0">
        <eco-content bottom="42px" top="0" ref="content">
              <el-table
              :data="listArray"
              style="width: 100%"
              height="100%"
              size="mini"
              highlight-current-row
              @row-dblclick="rowDblclick"
              @current-change="handleCurrentChangeTable"
              >
              <el-table-column
                type="index"
                min-width="40"
                max-width="50"
                >
              </el-table-column>
              <el-table-column
                prop="number"
                show-overflow-tooltip
                label="数字字段"
                width="80"
                >
              </el-table-column>
              <el-table-column
                prop="str"
                show-overflow-tooltip
                label="字符字段"
                min-width="123"
                >
              </el-table-column>
              <el-table-column
                prop="i18nKey"
                show-overflow-tooltip
                label="国际化键"
                min-width="123"
                >
              </el-table-column>
              <el-table-column
                prop="i18nText"
                show-overflow-tooltip
                label="国际化文本"
                min-width="123"
                >
              </el-table-column>
              <el-table-column
                prop="enumDataText"
                show-overflow-tooltip
                label="枚举字段"
                width="90"
                >
              </el-table-column>
              <el-table-column
                prop="date"
                show-overflow-tooltip
                label="日期"
                width="90"
                >
              </el-table-column>
              <el-table-column
                prop="dateTime"
                show-overflow-tooltip
                label="日期时间"
                width="90"
                >
              </el-table-column>
              <el-table-column
                prop="createUser"
                show-overflow-tooltip
                label="创建人"
                width="80"
                >
              </el-table-column>
              <el-table-column
                prop="createDate"
                show-overflow-tooltip
                label="创建时间"
                width="144"
                >
              </el-table-column>
              <el-table-column
                prop="modUser"
                show-overflow-tooltip
                label="修改人"
                width="80"
                >
              </el-table-column>
              <el-table-column
                prop="modDate"
                show-overflow-tooltip
                label="修改时间"
                width="144"
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
                :current-page.sync="baseInfo.page"
                :page-sizes="[20,30,50,100]"
                :page-size="baseInfo.rows"
                layout="total, sizes, prev, pager, next, jumper"
                :total="baseInfo.total">
              </el-pagination>
            </div>
          </div>
        </eco-content>
      </ecoContent>
      <!-- <div class="kn-main">
        
      </div> -->
    </div>
</template>
<script>
import ecoActionBtn from '@/modules/menu/views/components/ecoActionBtn.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {getTableList,tableDeleteAjax} from '@/modules/demo/service/service.js'
import EcoUtil from '@/components/util/main.js'
import {mapMutations} from 'vuex'
export default{
  name:'userGroup',
  components:{
    ecoActionBtn,
    ecoLoading,
    ecoContent
  },
  data(){
    return {
      baseInfo:{
        page:1,
        rows:30,
        total:0,
        sort:'modDate',
        order:'desc',
      },
      listArray:[],
      currentRow:null
    }
  },
  mounted(){
    window.ecoFrameVm = this; //添加监听
    this.addMonitor(); //添加监听
    this.getTableListFunc();
  },
  methods: {
    addMonitor(){
          let callBackDialogFunc = function(obj){
              if(obj && (obj.action == 'commonAddCallBack'||obj.action =='commonEditCallBack')){ //回调的唯一标识符
                window.ecoFrameVm.getTableListFunc()
              }
          }
          EcoUtil.addCallBackDialogFunc(callBackDialogFunc);
    },
    addGroup(){
      window.parent.sysvm.openDialog('通用示例添加',
      '/demo/index.html#/commonAdd',700,450);
    },
    editGroup(){
      if (this.currentRow){//选择了行
        // this.$router.push({name:'commonEdit',params:{
        //   id:this.currentRow.id
        // }})
        window.parent.sysvm.openDialog('通用示例编辑',
        '/demo/index.html#/commonEdit/'+this.currentRow.id,700,450);
      }else{
        this.$message({type: 'warning',message: '请选择行'});
      }
    },
    handleCurrentChangeTable(val) {
      this.currentRow = val;
    },
    rowDblclick(row, column, event){
      // this.$router.push({name:'commonEdit',params:{
      //   id:row.id
      // }})
      window.parent.sysvm.openDialog('通用示例编辑',
        '/demo/index.html#/commonEdit/'+row.id,700,450);
    },
    setValid(val){
      if (this.currentRow){//选择了行
        if(val){
        }else{
          tableDeleteAjax(this.currentRow.id).then((response)=>{
            this.getTableListFunc();
          }).catch((error)=>{});
        }
      }else{
        this.$message({type: 'warning',message: '请选择行'});
      }
    },
    //列表
    getTableListFunc(){
        this.$refs.ecoLoadingRef.open();
        getTableList(this.baseInfo).then((response)=>{
            this.listArray = response.data.rows;
            this.baseInfo.total  = response.data.total;
            this.$refs.ecoLoadingRef.close();
        }).catch((error)=>{
            this.$refs.ecoLoadingRef.close();
        });
    },
    handleSizeChange(val) {
        this.$refs.content.setScollTop(0);
        this.baseInfo.rows = val;
        this.baseInfo.page = 1;
        this.getTableListFunc();
    },
    handleCurrentChange(val) {
        this.$refs.content.setScollTop(0);
        this.baseInfo.page = val;
        this.getTableListFunc();
    },
  },
  watch: {

  }
}
</script>
<style>

</style>
