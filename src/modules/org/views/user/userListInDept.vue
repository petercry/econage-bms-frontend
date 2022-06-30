<template>
    <eco-content top="0px" bottom="0px" class="userListInDept">
       <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
       <eco-content top="0px" height="60px" type="tool">
                    <el-row  class="toolbar">
                        <el-col :span="6">
                             <eco-tool-title style="line-height: 38px;" :title="deptObj.name?deptObj.name:''"></eco-tool-title>
                        </el-col>
                        <el-col :span="18" style="text-align:right;padding-right:10px;padding-top:5px;">

                           <el-checkbox v-model="selectAll" @change="changeUserType" style="margin-right:10px;">
                                  {{selectAll?'全部':'全部'}}
                           </el-checkbox>


                            <el-button type="primary"  size="mini" @click="add" >添加 <i class="icon iconfont icondel"></i></el-button>
                            <el-button type="primary"  size="mini" @click="addLink" >引用 <i class="icon iconfont iconmenu_compareHisAndHis"></i></el-button>
                        </el-col>
                    </el-row>
       </eco-content>

       <ecoContent top="60px" bottom="0" style="padding:15px;">
              <el-table
                :data="listArray"
                style="width: 100%"
                size="mini"
                height="100%"
                class="styleTableDefault"
                highlight-current-row
             
                stripe
              >

                <el-table-column
                    type="index"
                    min-width="40"
                    max-width="50"
                  >
                </el-table-column>
              
                <el-table-column
                  prop="statusI18nText"
                  show-overflow-tooltip
                  label="状态"
                  width="72"
                  >
                    <template slot-scope="scope" >
                      <span  v-bind:class="{'green':scope.row.status == 'ACTIVE','red':scope.row.status != 'ACTIVE'}">{{scope.row.statusI18nText}}</span>
                    </template>
                </el-table-column>

                <el-table-column
                    prop="emId"
                    show-overflow-tooltip
                    label="员工编号"
                    width="180"
                  >
                </el-table-column>

                <el-table-column
                    prop="mi"
                    show-overflow-tooltip
                    label="全名"
                    min-width="120"
                  >
                </el-table-column>
             
                <!-- <el-table-column
                  prop="comments"
                  show-overflow-tooltip
                  label="备注"
                  width="90"
                  >
                </el-table-column> -->

                <el-table-column
                    prop="modUser"
                    show-overflow-tooltip
                    label="修改人"
                    width="100"
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
                    label="操作"
                    width="180"
                    >
                    <template slot-scope="scope" >
                        <div>
                            <span class="pointerClass" @click="edit(scope.row.id)" style="color:#409EFF;">编辑</span>
                            <span class="split" ></span>

                            <span  class="pointerClass" @click="disableSingle(scope.row)" v-if="scope.row.status == 'ACTIVE'" style="color:#f56c6c;">失效</span> 
                            <span class="split" v-if="scope.row.status == 'ACTIVE'"></span>

                            <span  class="pointerClass" @click="enableSingle(scope.row)" v-if="scope.row.status == 'INACTIVE'" style="color:#67c23a;">生效</span> 
                            <span class="split" v-if="scope.row.status == 'INACTIVE'"></span>


                             <el-dropdown trigger="click">
                                    <span class="el-dropdown-link pointerClass" style="color:#409EFF;display:inline-block;">
                                        更多<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>

                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item @click.native="deleteLink(scope.row)">
                                            <span >删除引用</span>
                                        </el-dropdown-item>

                                         <el-dropdown-item @click.native="accountConfig(scope.row)">
                                            <span >账号配置</span>
                                        </el-dropdown-item>

                                         <el-dropdown-item @click.native="userRole(scope.row)">
                                            <span >个人角色</span>
                                        </el-dropdown-item>

                                    </el-dropdown-menu>
                              </el-dropdown>
                            
                        </div>
                    </template>
                </el-table-column>
              </el-table>
          </ecoContent>
    </eco-content>
</template>
<script>

import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {getOrgManageUserListInDept,getOrgSingleDept,deleteUserLink,disableUser,enableUser} from '../../service/service.js'
import EcoUtil from '@/components/util/main.js'
import {mapMutations} from 'vuex'
import {sysEnv} from '../../config/env.js'

export default{
  name:'userListInDept',
  components:{
      ecoLoading,
      ecoContent,
      ecoToolTitle
  },
  data(){
    return {
      listArray:[],
      currentRow:null,
      selectAll:true,
      deptObj:{}
    }
  },
  mounted(){
      window.ecoFrameVm = this; //添加监听
      this.addMonitor(); //添加监听
      this.getUserListInDeptFunc();
      this.getDeptDetailFunc();
  },
  methods: {
    addMonitor(){
          let callBackDialogFunc = function(obj){
              if(obj && (obj.action == 'linkAddCallBack')){ //回调的唯一标识符
                window.ecoFrameVm.getUserListInDeptFunc()
              }
          }
          EcoUtil.addCallBackDialogFunc(callBackDialogFunc);
    },


    getDeptDetailFunc(){
        let _deptId = this.$route.params.deptId;
        getOrgSingleDept(_deptId).then((response)=>{
             this.deptObj = response.data;
        })
    },

    changeUserType(){
       this.getUserListInDeptFunc();
    },

    add(){
        this.$router.push({name:'userAdd'})
    },

    edit(id){
          this.$router.push({name:'userEdit',params:{ userId:id,deptId:this.$route.params.deptId,type:'LIST'}})
    },

    addLink(){
        let deptId = this.$route.params.deptId;
        EcoUtil.getSysvm().openDialog('','/org/index.html#/userLinkAdd/'+deptId,700,300);
    },

    deleteLink(item){
            let deptId = this.$route.params.deptId;
            deleteUserLink(deptId,item.id).then((response)=>{
                this.$message({type: 'success',message: '删除成功！'});
                this.getUserListInDeptFunc()
            }).catch((error)=>{
                this.$message({type: 'error',message: error});
            });
    },

    accountConfig(item){
        if(sysEnv == 1){
              EcoUtil.getSysvm().openDialog('账号配置（'+item.mi+"）",'/org/index.html#/userAccountConfig/'+item.id,550,300);
        }else{
              this.$router.push({name:'userAccountConfig',params:{userId:item.id}});
        }
    },

  
    //列表
    getUserListInDeptFunc(){
          let deptId = this.$route.params.deptId;
          this.$refs.ecoLoadingRef.open();
          getOrgManageUserListInDept(deptId,this.selectAll).then((response)=>{
                this.listArray = response.data;
                this.$refs.ecoLoadingRef.close();
          }).catch((error)=>{
                this.$refs.ecoLoadingRef.close();
          });
    },

    disableSingle(item){
          let that = this;
          let confirmYesFunc = function(){
                disableUser(item.id).then((response)=>{
                    item.status = 'INACTIVE';
                    item.statusI18nText='无效';
                    that.$message({type:'success',message: '失效成功'});
                }).catch((error)=>{ });
          }

          EcoMessageBox.confirm('确定失效并作废该账号？','提示',{
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          },confirmYesFunc);
    },

    enableSingle(item){
          enableUser(item.id).then((response)=>{
                item.status = 'ACTIVE';
                item.statusI18nText='有效';
                this.$message({type:'success',message: '生效成功'});
          }).catch((error)=>{ });
    },

    userRole(item){
        this.$router.push({name:'userRole',params:{userId:item.id,deptId:this.$route.params.deptId,type:'LIST'}});
    }
    
    
  },
  watch: {
      $route(){
          this.getUserListInDeptFunc();
          this.getDeptDetailFunc();
      }
  }
}
</script>
<style>
.userListInDept .toolbar{
    padding:10px 10px;
    background-color:#fff;
    border-bottom:1px solid #ddd;
}

.userListInDept .toolbar i{
  font-size: 12px;
}

.userListInDept .green{
  color:#67c23a;
}

.userListInDept .red{
  color:#f56c6c;
}


</style>
