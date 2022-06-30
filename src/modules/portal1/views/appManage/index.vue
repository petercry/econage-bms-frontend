<template>
    <ecoContent top="0" bottom="0" class="layout container" style="padding:40px 30px 20px;">
      <div style="position:absolute;top:12px;left:30px;">
        <ecoBreadList></ecoBreadList>
      </div>
      <el-card class="subject-card" style="position:relative">
        <div slot="header" class="clearfix">
          <span>应用系统列表</span>
          <el-button v-if="userRole['ExternalApp_create']" style="float: right; padding: 3px 5px" type="text" @click.native="add"><i class="el-icon-plus"></i>添加应用系统</el-button>
          <el-button v-if="userRole['ExternalApp_delete']" style="float: right; padding: 3px 5px;color:#E37087;" type="text" @click.native="delMult"><i class="el-icon-delete"></i>批量删除</el-button>
        </div>
        <ecoContent class="themeList" top="58px" bottom="0" style="padding:12px 24px;">
          <el-table
            :header-cell-style="{backgroundColor:'#E9EAEF'}"
            :data="tableData"
            height="100%"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              label="应用名称"
              prop="appName">
            </el-table-column>
            <el-table-column
              label="操作"
              width="88"
              >
            <template slot-scope="scope">
              <div>
                <el-button v-if="userRole['ExternalApp_mod']" type="text" @click.native="edit(scope.row)">编辑</el-button>
                <el-button v-if="userRole['ExternalApp_delete']" type="text" style="color:#E37087;" @click.native="del(scope.row)">删除</el-button>
              </div>
            </template>
            </el-table-column>
          </el-table>
        </ecoContent>
      </el-card>
    </ecoContent>
</template>
<script>
import {getAppPortalAll,appAddAjax,delAppPortal} from '@/modules/portal1/service/service.js'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {mapMutations,mapState} from 'vuex'
import EcoUtil from '@/components/util/main.js'
import ecoBreadList from '@/modules/portal1/views/components/ecoBreadList.vue'
  export default{
      name:'appManage',
      components:{
        ecoContent,
        ecoBreadList
      },
      data() {
        return {
          tableData:[],
          multipleSelection:[]
        }
      },
      created(){
      },
      mounted() {
        window.ecoFrameVm = this; //添加监听
        this.addMonitor(); //添加监听
        if (this.userRole['ExternalApp_select']){
          this.getAppPortalAll();
        }
      },
      computed: {
        ...mapState(['userRole'])
      },
      methods: {
        addMonitor(){
            let callBackDialogFunc = function(obj){
            if(obj && (obj.action =='appEditCallBack')){ //回调的唯一标识符
                  window.ecoFrameVm.getAppPortalAll()
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc);
          },
        getAppPortalAll(){
          getAppPortalAll().then(res=>{
            if (res.data&&res.data.rows){
              this.tableData = res.data.rows;
            }
          }).catch(e=>{})
        },
        add(){
          // this.$router.push({
          //   name:'appAdd'
          // })
          // return ;
          window.parent.sysvm.openDialog('添加应用',
          '/portal1/index.html#/appAdd',700,450);
          // let that = this;
          // window.parent.sysvm.$prompt('请输入应用名称', '添加应用', {
          //   confirmButtonText: '确定',
          //   cancelButtonText: '取消',
          // }).then(({ value }) => {
          //   appAddAjax({
          //     appName:value
          //   }).then((response)=>{
          //     this.$message({
          //       type: 'success',
          //       message: '添加成功！'
          //     });
          //     that.getAppPortalAll();
          //   }).catch((error)=>{});
          // }).catch(() => {});
        },
        edit(item){
          // this.$router.push({name:'appEdit',params:{
          //   appId:item.id
          // }})
          // return;
          window.parent.sysvm.openDialog('应用编辑',
          '/portal1/index.html#/appEdit/'+item.id,700,450);
        },
        del(item){
          parent.window.sysvm.$confirm('是否确认删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            delAppPortal(item.id).then(res=>{
              this.getAppPortalAll();
            }).catch(e=>{})
          }).catch(() => {});
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        delMult(){
          if(this.multipleSelection&&this.multipleSelection.length>0){
            parent.window.sysvm.$confirm('是否确认删除？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let id = this.multipleSelection.map(item=>{
                return item.id
              }).join(',');
              delAppPortal(id).then(res=>{
                this.getAppPortalAll();
              }).catch(e=>{})
            }).catch(() => {});
          }else{
            this.$message({type: 'info',message: '请选择行！'});
          }
        }
      }
  }
</script>
<style scoped>
.subject-card{
  height: 100%;
}
</style>
