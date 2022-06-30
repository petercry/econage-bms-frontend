<template>
    <eco-content top="0px" bottom="0px" class="userRole">
        <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
        <eco-content top="0px" height="60px" type="tool">
                    <el-row  class="toolbar">
                        <el-col :span="6">
                             <eco-tool-title style="line-height: 38px;" :title="'用户角色 ( '+mi+' )'"></eco-tool-title>
                        </el-col>
                        <el-col :span="18" style="text-align:right;padding-right:10px;padding-top:5px;">
                            <el-button type="primary"  size="mini" @click="addRole" >添加 <i class="icon iconfont icondel"></i></el-button>
                            <el-button   size="mini" @click="goBack" >返回 <i class="icon iconfont iconrefresh"></i></el-button>
                        </el-col>
                    </el-row>
         </eco-content>
       
      
          <eco-content top="60px" bottom="0" style="padding:15px;">
              <el-table
                  :data="listArray"
                  style="width: 100%"
                  size="mini"
                  height="100%"
                  highlight-current-row
                  stripe
                  class="styleTableDefault"
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

                  <template slot-scope="scope" >
                        <div>
                            <span >{{ (scope.row.roleScope =='-1')?'[ 全局角色 ]':scope.row.roleScopePathI18n}}</span>
                        </div>
                    </template>
              </el-table-column>

              <el-table-column
                  prop="roleI18nText"
                  show-overflow-tooltip
                  label="角色"
                  min-width="80"
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
                  width="180"
                >
              </el-table-column>

               <el-table-column
                    label="操作"
                    width="120"
                    >
                    <template slot-scope="scope" >
                        <div>
                            <span class="pointerClass" @click="editRole(scope.row.id)" style="color:#409EFF;">编辑</span>
                            <span class="split" ></span>

                            <span  class="pointerClass" @click="delRole(scope.row.id)"  style="color:#f56c6c;">删除</span> 
                        </div>
                    </template>
               </el-table-column>



            </el-table>
          </eco-content>

    </eco-content>
</template>
<script>

import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import ecoActionBtn from '../../../views/components/ecoActionBtn.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {getAccountRoleConfig,deleteAccountRole,getUserDetail} from '../../../service/service.js'
import EcoUtil from '@/components/util/main.js'
import {sysEnv} from '../../../config/env.js'
import {mapState,mapMutations} from 'vuex'

export default{
  name:'userRole',
  components:{
      ecoLoading,
      ecoContent,
      ecoActionBtn,
      ecoToolTitle
  },
  data(){
    return {
      listArray:[],
      currentRow:null,
      mi:''
    }
  },
  computed:{
      ...mapState([
          'ecoEventData',
      ]),
  },

  mounted(){
      this.getUserDetailFunc();
      this.getAccountRoleConfig();
      window.ecoFrameVm = this; //添加监听
      this.addMonitor(); //添加监听
     
  },
  methods: {
    addMonitor(){
          let callBackDialogFunc = function(obj){
              if(obj && (obj.action == 'roleAddCallBack'||obj.action =='roleEditCallBack')){ //回调的唯一标识符
                window.ecoFrameVm.getAccountRoleConfig()
              }
          }
          EcoUtil.addCallBackDialogFunc(callBackDialogFunc);
    },
    
    getUserDetailFunc(){
         let userId = this.$route.params.userId; 
          getUserDetail(userId).then((response)=>{
              this.mi = response.data.mi;
          })
    },

    addRole(){
          let userId = this.$route.params.userId; 
          if(sysEnv == 1){
               EcoUtil.getSysvm().openDialog('角色添加','/org/index.html#/userRoleAdd/'+userId,700,400);
          }else{
              this.$router.push({name:'userRoleAdd',params:{userId:userId}})
          }
    },

    editRole(id){
          let userId = this.$route.params.userId; 
           if(sysEnv == 1){
               EcoUtil.getSysvm().openDialog('角色编辑', '/org/index.html#/userRoleEdit/'+userId+'/'+id,700,250);
           }else{
               this.$router.push({name:'userRoleEdit',params:{userId:userId,id:id}})
           }
    },

    delRole(id){
          let userId = this.$route.params.userId; 
          deleteAccountRole(userId,id).then((response)=>{
                this.$message({type: 'success', message: '删除成功!'});
                this.getAccountRoleConfig();
          }).catch((error)=>{
                this.$message({type: 'error', message: '删除失败!'});
          });
    },

    //列表
    getAccountRoleConfig(){
        let id = this.$route.params.userId; 
        this.$refs.ecoLoadingRef.open();
        getAccountRoleConfig(id).then((response)=>{
            this.listArray = response.data;
            this.$refs.ecoLoadingRef.close();
        }).catch((error)=>{
            this.$refs.ecoLoadingRef.close();
        });
    },

    goBack(){

         let _deptId = this.$route.params.deptId;
         let _type = this.$route.params.type;

         if(_type == 'LIST'){
              this.$router.push({name:'userListInDept',params:{deptId:_deptId}});
         }else if(_type == 'SEARCH'){
              this.$router.push({name:'userListSearch', params:{searchKey:encodeURIComponent(this.ecoEventData.searchKey),selectAll:this.ecoEventData.selectAll}} );
         }

       
    }
  },
  watch: {

  }
}
</script>
<style scope>

.userRole .toolbar{
    padding:10px 10px;
    background-color:#fff;
    border-bottom:1px solid #ddd;
}

.userRole .toolbar i{
  font-size: 12px;
}

.userRole .green{
  color:#67c23a;
}

.userRole .red{
  color:#f56c6c;
}
</style>
