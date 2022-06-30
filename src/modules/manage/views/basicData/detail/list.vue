<template>
    <div>
      <div class="kn-header" >
        <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
        <div>
          基础数据
          <ecoActionBtn :ecoActionBtnFunc="add">
            <i slot="icon" class="el-icon-circle-plus"/>
            添加
          </ecoActionBtn>
          <ecoActionBtn :ecoActionBtnFunc="edit">
            <i slot="icon" class="el-icon-edit"/>
            编辑
          </ecoActionBtn>
        </div>
      </div>
      <ecoContent top="30px" bottom="0">
        <el-table
        :data="listArray"
        style="width: 100%"
        size="mini"
        height="100%"
        highlight-current-row
        @row-dblclick="rowDblclick"
        @current-change="handleCurrentChangeTable"
        @header-dragend="changeColWidth"
        border
        >
          <el-table-column
            type="index"
            min-width="40"
            max-width="50"
            >
          </el-table-column>
          <el-table-column
            prop="id"
            show-overflow-tooltip
            label="ID"
            min-width="120"
            >
          </el-table-column>
          <el-table-column
            prop="text"
            show-overflow-tooltip
            label="名称"
            min-width="120"
            >
          </el-table-column>
          <el-table-column
            prop="i18nKey"
            show-overflow-tooltip
            label="国际化编码"
            min-width="120"
            >
          </el-table-column>
          <el-table-column
            prop="order"
            show-overflow-tooltip
            label="序号"
            min-width="120"
            >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="添加可用"
            min-width="120"
            >
            <template slot-scope="scope">
              <div >
                <span v-if="scope.row.enableInCreate">√</span>
                <span v-else>×</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="查询可用"
            min-width="120"
            >
            <template slot-scope="scope">
              <div >
                <span v-if="scope.row.enableInSelect">√</span>
                <span v-else>×</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="更新可用"
            min-width="120"
            >
            <template slot-scope="scope">
              <div >
                <span v-if="scope.row.enableInUpdate">√</span>
                <span v-else>×</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </ecoContent>
      <!-- <div class="kn-main">

      </div> -->
    </div>
</template>
<script>
import ecoActionBtn from '@/modules/menu/views/components/ecoActionBtn.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {getBasicKvGroupDetail} from '@/modules/manage/service/service.js'
import EcoUtil from '@/components/util/main.js'
import {mapMutations} from 'vuex'
export default{
  name:'groupList',
  components:{
    ecoActionBtn,
    ecoLoading,
    ecoContent
  },
  data(){
    return {
      listArray:[],
      currentRow:null
    }
  },
  mounted(){
    window.ecoFrameVm = this; //添加监听
    this.addMonitor(); //添加监听
    this.getBasicKvGroupDetailFunc();
  },
  methods: {
    addMonitor(){
          let callBackDialogFunc = function(obj){
              if(obj && (obj.action == 'basicKvAddCallBack'||obj.action == 'basicKvEditCallBack')){ //回调的唯一标识符
                window.ecoFrameVm.getBasicKvGroupDetailFunc()
              }
          }
          EcoUtil.addCallBackDialogFunc(callBackDialogFunc);
    },
    add(){
      // this.$router.push({name:'basicDataDetailAdd',params:{
      //   group:this.$route.params.group
      // }})
      // return ;
      window.parent.sysvm.openDialog('基础数据添加',
      '/manage/index.html#/basicDataDetailAdd/'+this.$route.params.group,700,450);
    },
    edit(){
      if (this.currentRow){//选择了行
        // this.$router.push({name:'basicDataDetailEdit',params:{
        //   group:this.$route.params.group,
        //   id:this.currentRow.id
        // }})
        // return ;
        window.parent.sysvm.openDialog('基础数据修改',
      '/manage/index.html#/basicDataDetailEdit/'+this.$route.params.group+'/'+this.currentRow.id,700,450);
      }else{
        this.$message({type: 'warning',message: '请选择行'});
      }
    },
    rowDblclick(row, column, event){
      // this.$router.push({name:'basicDataDetailEdit',params:{
      //   group:this.$route.params.group,
      //   id:row.id
      // }})
      // return ;
       window.parent.sysvm.openDialog('基础数据修改',
      '/manage/index.html#/basicDataDetailEdit/'+this.$route.params.group+'/'+row.id,700,450);
    },
    handleCurrentChangeTable(val) {
      this.currentRow = val;
    },
    //列表
    getBasicKvGroupDetailFunc(){
      let group = this.$route.params.group;
      this.$refs.ecoLoadingRef.open();
      getBasicKvGroupDetail(group).then((response)=>{
          this.listArray = response.data;
          this.$refs.ecoLoadingRef.close();
      }).catch((error)=>{
          this.$refs.ecoLoadingRef.close();
      });
    },
    changeColWidth(nw,ow,col,evt){
        if(nw < col.minWidth){
            col.width = col.minWidth;
        }
    }
  },
  watch:{
    '$route'(val){
      this.getBasicKvGroupDetailFunc();
    }
  }
}
</script>
<style>

</style>
