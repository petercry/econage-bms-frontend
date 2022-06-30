<template>
    <div>
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <ecoContent top="0" bottom="0">
        <div class="kn-header" >
          <div>
            成员
            <ecoActionBtn :ecoActionBtnFunc="addMember">
              <i slot="icon" class="el-icon-circle-plus"/>
              添加
            </ecoActionBtn>
            <!-- :ecoActionBtnFunc="delMenu" -->
            <ecoActionBtn :ecoActionBtnFunc="delMember">
              <i slot="icon" class="el-icon-remove"/>
              删除
            </ecoActionBtn>
          </div>
        </div>
        <eco-content top="30px" bottom="42px" ref="content">
          <el-table
            :data="listArray"
            style="width: 100%"
            height="100%"
            size="mini"
            @selection-change="handleSelectionChange"
            ><!-- highlight-current-row
            @current-change="handleCurrentChangeTable" -->
            <el-table-column
              type="index"
              width="40"
              >
            </el-table-column>
            <el-table-column
              type="selection"
              width="30">
            </el-table-column>
            <el-table-column
              prop="alias"
              show-overflow-tooltip
              label="别称"
              min-width="100"
              >
            </el-table-column>
            <el-table-column
              prop="statusI18nText"
              show-overflow-tooltip
              label="状态"
              min-width="80"
              >
            </el-table-column>
            <el-table-column
              prop="emId"
              show-overflow-tooltip
              label="员工编号"
              min-width="80"
              >
            </el-table-column>
            <el-table-column
              prop="mi"
              show-overflow-tooltip
              label="全名"
              min-width="80"
              >
            </el-table-column>
            <el-table-column
              prop="modUser"
              show-overflow-tooltip
              label="所属部门"
              min-width="80"
              >
              <template slot-scope="scope" >
                <span v-for="(item, index) in scope.row.departments" :key="index">{{item.orgPathI18nText}};</span>
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
import ecoActionBtn from '../../../views/components/ecoActionBtn.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {getGroupMemberConfig,deleteGroupMember} from '../../../service/service.js'
import EcoUtil from '@/components/util/main.js'
export default{
  name:'userRole',
  components:{
    ecoLoading,
    ecoContent,
    ecoActionBtn
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
      currentRow:null,
      multipleSelection:[]
    }
  },
  mounted(){
    this.getGroupMemberConfig();
    window.ecoFrameVm = this; //添加监听
    this.addMonitor(); //添加监听
  },
  methods: {
    addMonitor(){
          let callBackDialogFunc = function(obj){
              if(obj && (obj.action == 'memberAddCallBack')){ //回调的唯一标识符
                window.ecoFrameVm.getGroupMemberConfig()
              }
          }
          EcoUtil.addCallBackDialogFunc(callBackDialogFunc);
    },
    addMember(){
      let h = this.$createElement;
      let id = this.$route.params.id; 
       window.parent.sysvm.openDialog('添加人员',
        '/org/index.html#/groupMemberAdd/'+id,700,450);
    },
    delMember(){
      if (this.multipleSelection.length){//选择了行
        let id = this.$route.params.id; 
        let userId = this.multipleSelection.map(item=>{
          return item.id;
        }); 
        deleteGroupMember(id,userId).then((response)=>{
            this.$message({type: 'success', message: '删除成功!'});
            this.getGroupMemberConfig();
        }).catch((error)=>{
            this.$message({type: 'error', message: '删除失败!'});
        });
      }else{
        this.$message({type: 'warning',message: '请选择行'});
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChangeTable(val) {
      this.currentRow = val;
    },
    //列表
    getGroupMemberConfig(){
        let id = this.$route.params.id; 
        this.$refs.ecoLoadingRef.open();
        getGroupMemberConfig(id,this.baseInfo).then((response)=>{
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
        this.getGroupMemberConfig();
    },
    handleCurrentChange(val) {
        this.$refs.content.setScollTop(0);
        this.baseInfo.page = val;
        this.getGroupMemberConfig();
    },
  },
  watch: {

  }
}
</script>
<style>
</style>
