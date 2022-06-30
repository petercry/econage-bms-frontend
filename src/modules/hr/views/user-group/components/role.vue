<template>
    <div>
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <ecoContent top="0" bottom="0">
        <div class="kn-header" >
          <div>
            角色
            <ecoActionBtn :ecoActionBtnFunc="addRole">
              <i slot="icon" class="el-icon-circle-plus"/>
              添加
            </ecoActionBtn>
            <ecoActionBtn :ecoActionBtnFunc="editRole">
              <i slot="icon" class="el-icon-edit"/>
              编辑
            </ecoActionBtn>
            <!-- :ecoActionBtnFunc="delMenu" -->
            <ecoActionBtn :ecoActionBtnFunc="delRole">
              <i slot="icon" class="el-icon-remove"/>
              删除
            </ecoActionBtn>
          </div>
        </div>
        <eco-content top="30px" bottom="0">
          <el-table
            :data="listArray"
            style="width: 100%"
            height="100%"
            size="mini"
            highlight-current-row
            @current-change="handleCurrentChange"
            @row-dblclick="rowDblclick"
            >
            <el-table-column
              type="index"
              min-width="40"
              max-width="50"
              >
            </el-table-column>
            <el-table-column
              prop="roleScopePathI18n"
              show-overflow-tooltip
              label="角色范围"
              min-width="180"
              >
            </el-table-column>
            <el-table-column
              prop="roleI18nText"
              show-overflow-tooltip
              label="角色"
              min-width="80"
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
      </ecoContent>
      <!-- <div class="kn-main">
        
      </div> -->
    </div>
</template>
<script>
import ecoActionBtn from '../../../views/components/ecoActionBtn.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {getGroupRoleConfig,deleteGroupRole} from '../../../service/service.js'
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
      listArray:[],
      currentRow:null
    }
  },
  mounted(){
    this.getGroupRoleConfig();
    window.ecoFrameVm = this; //添加监听
    this.addMonitor(); //添加监听
  },
  methods: {
    addMonitor(){
          let callBackDialogFunc = function(obj){
              if(obj && (obj.action == 'roleAddCallBack'||obj.action =='roleEditCallBack')){ //回调的唯一标识符
                window.ecoFrameVm.getGroupRoleConfig()
              }
          }
          EcoUtil.addCallBackDialogFunc(callBackDialogFunc);
    },
    addRole(){
      let h = this.$createElement;
      let id = this.$route.params.id; 
       window.parent.sysvm.openDialog('角色添加',
        '/hr/index.html#/groupRoleAdd/'+id,700,450);
    },
    editRole(){
      if (this.currentRow){//选择了行
        let id = this.$route.params.id; 
        window.parent.sysvm.openDialog('角色编辑',
        '/hr/index.html#/groupRoleEdit/'+id+'/'+this.currentRow.id,700,450);
      }else{
        this.$message({type: 'warning',message: '请选择行'});
      }
    },
    delRole(){
      if (this.currentRow){//选择了行
        let id = this.$route.params.id; 
        deleteGroupRole(id,this.currentRow.id).then((response)=>{
            this.$message({type: 'success', message: '删除成功!'});
            this.getGroupRoleConfig();
        }).catch((error)=>{
            this.$message({type: 'error', message: '删除失败!'});
        });
      }else{
        this.$message({type: 'warning',message: '请选择行'});
      }
    },
    rowDblclick(row, column, event){
      let id = this.$route.params.id; 
      window.parent.sysvm.openDialog('角色编辑',
      '/hr/index.html#/groupRoleEdit/'+id+'/'+row.id,700,450);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    //列表
    getGroupRoleConfig(){
        let id = this.$route.params.id; 
        this.$refs.ecoLoadingRef.open();
        getGroupRoleConfig(id).then((response)=>{
            this.listArray = response.data.rows;
            this.$refs.ecoLoadingRef.close();
        }).catch((error)=>{
            this.$refs.ecoLoadingRef.close();
        });
    },
  },
  watch: {

  }
}
</script>
<style>
</style>
