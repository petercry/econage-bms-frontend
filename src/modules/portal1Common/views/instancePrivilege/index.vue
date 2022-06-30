<template>
  <ecoContent top="0" bottom="0"  type="tool" class="instancePrivilege" style="background-color:#f5f5f5">
    <div class="content webLayout normalTable">
        <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
        <eco-content top="0px" height="60px" type="tool">
            <el-row style="padding:12px 10px;background-color:#fff;border-bottom:1px solid #ddd;">
                  <el-col :span="8" >
                      <eco-tool-title style="line-height: 34px;" :title="'办件查询权限设置'"></eco-tool-title>
                  </el-col>
                  <el-col :span="16" style="text-align: right;"> 
                      <el-button type="primary" style="height:33px;" size="small"  @click.native="add" ><i class="icon el-icon-plus" style="margin-right:10px;"></i>&nbsp;新增</el-button>
                      <el-button type="danger"   style="height:33px;" size="small"  @click.native="delMult" ><i class="icon el-icon-close" style="margin-right:10px;"></i>&nbsp;删除</el-button>
                      <!-- <el-button plain class="plainBtn searchBtn" @click.native="isAdvanceShow = !isAdvanceShow" ><i class="icon el-icon-search" style="margin-right:10px;"></i>&nbsp;高级检索</el-button> -->
                </el-col>
            </el-row>
        </eco-content>
        <eco-content top="59px" v-show="this.isAdvanceShow">
            <div class="searchBox">
              <el-form ref="form" :model="baseInfo" label-width="80px"  style="max-width:1500px;">
                <el-row>
                  <el-col :span="8" >
                    <el-form-item label="" prop="" label-width="12px">
                      <el-button plain class="plainBtn" style="margin-left:5px;height:34px;font-size:14px;" @click="reestSearch">清空</el-button>
                      <el-button type="primary" size="small" style="margin-left:5px;height:34px;font-size:14px; " @click="searchFunc">搜索</el-button>
                      <!-- <el-button type="primary" class="btn" @click.native="searchFunc()"><i class="icon iconfont"></i>搜索</el-button> -->
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
        </eco-content>
        <eco-content bottom="0" :top="getMainTop" ref="content" style="padding:0;">
              <el-table
              :data="listArray"
              :header-cell-style="{backgroundColor:'#eee'}"
              style="width: 100%"
              height="100%"
              size="mini"
              stripe
              class="normalElTable"
              @selection-change="handleSelectionChange"
              >
            <el-table-column
            type="selection"
            width="55">
            </el-table-column>
            <el-table-column
              label="序号"
              type="index"
              min-width="40"
              max-width="50">
            </el-table-column>
            
            <el-table-column
              label="权限名称"
              min-width="140"
              show-overflow-tooltip
              prop="name">
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
              width="150"
              >
            </el-table-column>
            
            <el-table-column
              prop="comment"
              show-overflow-tooltip
              label="备注"
              width="150"
              >
            </el-table-column>
           
            <el-table-column
              label="操作"
              width="180"
              >
            <template slot-scope="scope">
              <div>
                <el-button size="medium" type="text" @click.native="edit(scope.row)">编辑</el-button>
                <span class="split"></span>
                <el-dropdown trigger="click">
                    <span class="el-dropdown-link pointerClass" style="color:#409EFF;display:inline-block;">
                        更多<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>

                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="editMember(scope.row)">
                            <span >成员设置</span>
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="editRole(scope.row)">
                            <span >角色设置</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <span class="split"></span>
                <el-button type="text" style="color:#E37087;" @click.native="del(scope.row)">删除</el-button>
              </div>
            </template>
            </el-table-column>
            </el-table>
        </eco-content>

        <!-- <eco-content  bottom="0px" type="tool" style="padding:5px 0px">
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
        </eco-content> -->
    </div>
  </ecoContent>
</template>
<script>
import ecoActionBtn from '@/modules/menu/views/components/ecoActionBtn.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {getInstancePrivilegeList,instancePrivilegeDeleteBatchAjax} from '@/modules/portal1Common/service/service.js'
import EcoUtil from '@/components/util/main.js'
import {sysEnv} from '../../config/env.js'
import {mapMutations, mapState} from 'vuex'
export default{
  name:'userGroup',
  components:{
    ecoActionBtn,
    ecoToolTitle,
    ecoLoading,
    ecoContent
  },
  data(){
    return {
      isAdvanceShow:false,
      baseInfo:{
        page:1,
        rows:30,
        total:0,
        leaderName:'',
        bidUnit:'',
        collectStatus:'PRETRIAL',
        memberName:'',
        groupNum:'',
      },
      listArray:[],
      multipleSelection:[]
    }
  },
  created() {
  },
  computed: {
    'getMainTop'(){
      if (this.isAdvanceShow){
        return '125px'
      }else{
        return '58px'
      }
    }
  },
  mounted(){
    window.ecoFrameVm = this; //添加监听
    this.addMonitor(); //添加监听
    this.getInstancePrivilegeListFunc();
  },
  methods: {
    reestSearch(){
        this.baseInfo.leaderName = '';
        this.baseInfo.bidUnit = '';
        this.baseInfo.memberName = '';
        this.baseInfo.groupNum = '';
    },
    getEnumSelectEnabled(id){
      getEnumSelectEnabled(id).then(res=>{
        this[id] = res.data;
      }).catch(e=>{})
    },
    addMonitor(){
          let callBackDialogFunc = function(obj){
              if(obj && (obj.action == 'instancePrivilegeAddCallBack'||obj.action =='instancePrivilegeEditCallBack')){ //回调的唯一标识符
                window.ecoFrameVm.getInstancePrivilegeListFunc()
              }
          }
          EcoUtil.addCallBackDialogFunc(callBackDialogFunc);
    },
    add(){
      if(sysEnv ==1){
        window.parent.sysvm.openDialog('添加',
        '/portal1Common/index.html#/instancePrivilegeAdd',window.parent.innerWidth-100,(window.parent.innerHeight-120-100),'50px');
      }else{
        this.$router.push({name:'instancePrivilegeAdd'})
      }
    },
    edit(item){
      if(sysEnv ==1){
        window.parent.sysvm.openDialog('编辑',
        '/portal1Common/index.html#/instancePrivilegeEdit/'+item.id,window.parent.innerWidth-100,(window.parent.innerHeight-120-100),'50px');
      }else{
        this.$router.push({name:'instancePrivilegeEdit',params:{
          id:item.id
        }})
      }
    },
    editMember(item){
      if(sysEnv ==1){
        window.parent.sysvm.openDialog('设置人员',
        '/portal1Common/index.html#/instancePrivilegeEditMember/'+item.id,window.parent.innerWidth-100,(window.parent.innerHeight-120-100),'50px');
      }else{
        this.$router.push({name:'instancePrivilegeEditMember',params:{
          id:item.id
        }})
      }
    },
    editRole(item){
      if(sysEnv ==1){
        window.parent.sysvm.openDialog('设置角色',
        '/portal1Common/index.html#/instancePrivilegeEditRole/'+item.id,window.parent.innerWidth-100,(window.parent.innerHeight-120-100),'50px');
      }else{
        this.$router.push({name:'instancePrivilegeEditRole',params:{
          id:item.id
        }})
      }
    },
    del(item){
      window.parent.sysvm.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        instancePrivilegeDeleteBatchAjax(item.id).then(res=>{
          this.getInstancePrivilegeListFunc();
        }).catch(e=>{})
      }).catch(() => {});
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    delMult(){
      if(this.multipleSelection&&this.multipleSelection.length>0){
        window.parent.sysvm.$confirm('是否确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let id = this.multipleSelection.map(item=>{
            return item.id
          });
          instancePrivilegeDeleteBatchAjax(id).then(res=>{
            this.getInstancePrivilegeListFunc();
          }).catch(e=>{})
        }).catch(() => {});
      }else{
        this.$message({type: 'info',message: '请选择行！'});
      }
    },
   
    searchFunc(){
      this.baseInfo.page = 1;
      this.getInstancePrivilegeListFunc();
    },
    //列表
    getInstancePrivilegeListFunc(){
        this.$refs.ecoLoadingRef.open();
        getInstancePrivilegeList(this.baseInfo).then((response)=>{
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
        this.getInstancePrivilegeListFunc();
    },
    handleCurrentChange(val) {
        this.$refs.content.setScollTop(0);
        this.baseInfo.page = val;
        this.getInstancePrivilegeListFunc();
    },
  },
  watch: {
  }
}
</script>
<style scoped>
.instancePrivilege .content{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
}

.instancePrivilege .toolbar{
  padding:12px 10px;
  background-color:#fff;
  border-bottom:1px solid #ddd;
}

.instancePrivilege .split{
    border-right: 1px solid #ddd;
    margin: 0 10px 0 5px;
}
</style>
