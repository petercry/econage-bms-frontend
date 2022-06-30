<template>
    <eco-content top="0px" bottom="0px" class="sealListInDept">
       <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
       <eco-content top="0px" height="60px" type="tool">
                    <el-row  class="toolbar">
                        <el-col :span="6">
                          印章列表
                          <!-- 签章机构<el-switch style="margin-left:10px;" v-model="value1"> </el-switch> -->
                             <!-- <eco-tool-title style="line-height: 38px;" :title="'人员编辑'"></eco-tool-title> -->
                        </el-col>
                        <el-col :span="18" style="text-align:right;padding-right:10px;" v-show="value1">
                            <el-button type="primary"  size="mini" @click="goTypeManage" >维护印章类型 <i class="icon el-icon-s-tools"></i></el-button>
                            <el-button type="primary" v-if="$route.params.orgId!=-1" size="mini" @click="add" >添加印章 <i class="icon iconfont icondel"></i></el-button>
                            <!-- <el-button type="primary"  size="mini" @click="addLink" >引用 <i class="icon iconfont iconmenu_compareHisAndHis"></i></el-button> -->
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
<!-- 
                <el-table-column
                    type="index"
                    min-width="40"
                    max-width="50"
                  >
                </el-table-column> -->


                <el-table-column
                  prop="name"
                  show-overflow-tooltip
                  label="印章名称"
                  min-width="123"
                  >
                </el-table-column>
             
                
                <el-table-column
                    prop="groupName"
                    show-overflow-tooltip
                    label="印章类型"
                    width="120"
                  >
                </el-table-column>

                <el-table-column
                    prop="manageUserName"
                    show-overflow-tooltip
                    label="印章管理人"
                    width="120"
                  >
                </el-table-column>

                <el-table-column
                    prop="createDate"
                    show-overflow-tooltip
                    label="创建时间"
                    width="180"
                  >
                </el-table-column>
                <el-table-column
                    label="缩略图"
                    width="80"
                  >
                  <template slot-scope="scope">
                    <div>
                      <el-image 
                        style="width: 50px; height: 50px"
                        :src="'data:image/png;base64,'+scope.row.thumbnailBase64" 
                        :preview-src-list="['data:image/png;base64,'+ scope.row.imgBase64]">
                      </el-image>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column
                    label="操作"
                    width="120"
                    >
                    <template slot-scope="scope" >
                        <div>
                            <span class="pointerClass" @click="edit(scope.row.id)" style="color:#409EFF;">编辑</span>
                            <span class="split" ></span>
                            <span class="pointerClass" @click="del(scope.row.id)" style="color:#F56C6C;">删除</span>

                            <!-- <span  class="pointerClass" @click="disableSingle(scope.row)" v-if="scope.row.status == 'ACTIVE'" style="color:#f56c6c;">失效</span> 
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

                                         <el-dropdown-item @click.native="sealRole(scope.row)">
                                            <span >个人角色</span>
                                        </el-dropdown-item>

                                    </el-dropdown-menu>
                              </el-dropdown> -->
                            
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
import {getSealAll,invalidSeal} from '../../service/service.js'
import EcoUtil from '@/components/util/main.js'
import {mapMutations} from 'vuex'
import {sysEnv} from '../../config/env.js'

export default{
  name:'sealListInDept',
  components:{
      ecoLoading,
      ecoContent,
      ecoToolTitle
  },
  data(){
    return {
      value1:true,
      listArray:[],
      currentRow:null
    }
  },
  mounted(){
      window.ecoFrameVm = this; //添加监听
      this.addMonitor(); //添加监听
      this.getSealAllFunc();
  },
  methods: {
    addMonitor(){
          let callBackDialogFunc = function(obj){
              if(obj && (obj.action == 'sealAddCallBack' || obj.action == 'sealEditCallBack')){ //回调的唯一标识符
                window.ecoFrameVm.getSealAllFunc()
              }
          }
          EcoUtil.addCallBackDialogFunc(callBackDialogFunc);
    },
    goTypeManage(){
      if(sysEnv == 1){
            EcoUtil.getSysvm().openDialog('维护印章类型','/sealManage/index.html#/sealTypeList/'+this.$route.params.orgId,550,400);
      }else{
            this.$router.push({name:'sealTypeList',params:{orgId:this.$route.params.orgId,}});
      }
    },
    add(){
      if(sysEnv == 1){
            EcoUtil.getSysvm().openDialog('添加印章','/sealManage/index.html#/sealAdd/'+this.$route.params.orgId,550,400);
      }else{
            this.$router.push({name:'sealAdd',params:{orgId:this.$route.params.orgId,}});
      }
    },
    edit(id){
      if(sysEnv == 1){
            EcoUtil.getSysvm().openDialog('编辑印章','/sealManage/index.html#/sealEdit/'+id,550,400);
      }else{
            this.$router.push({name:'sealEdit',params:{id:id}});
      }
    },
    
    del(id){
          let _that  = this;
          let confirmYesFunc = function(){
              invalidSeal(id).then((response)=>{
                  _that.$message({type: 'success', message: '删除成功!'});
                  _that.getSealAllFunc();
              }).catch((error)=>{
                  _that.$message({type: 'error', message: '删除失败!'});
              });
          }

          let options = {
              type: 'warning',
              lockScroll:false
          }

          EcoMessageBox.confirm('确定删除该印章？','提示',options,confirmYesFunc);
    },
    // addLink(){
    //     let orgId = this.$route.params.orgId;
    //     EcoUtil.getSysvm().openDialog('','/sealManage/index.html#/sealLinkAdd/'+orgId,700,300);
    // },

    // deleteLink(item){
    //         let orgId = this.$route.params.orgId;
    //         deleteSealLink(orgId,item.id).then((response)=>{
    //             this.$message({type: 'success',message: '删除成功！'});
    //             this.getSealAllFunc()
    //         }).catch((error)=>{
    //             this.$message({type: 'error',message: error});
    //         });
    // },

    // accountConfig(item){
    //     if(sysEnv == 1){
    //           EcoUtil.getSysvm().openDialog('账号配置（'+item.mi+"）",'/sealManage/index.html#/sealAccountConfig/'+item.id,550,300);
    //     }else{
    //           this.$router.push({name:'sealAccountConfig',params:{sealId:item.id}});
    //     }
    // },

  
    //列表
    getSealAllFunc(){
        let orgId = this.$route.params.orgId;
        this.$refs.ecoLoadingRef.open();
        getSealAll(orgId).then((response)=>{
            this.listArray = response.data.rows;
            this.$refs.ecoLoadingRef.close();
        }).catch((error)=>{
            this.$refs.ecoLoadingRef.close();
        });
    },

    // disableSingle(item){
    //       let that = this;
    //       let confirmYesFunc = function(){
    //             disableSeal(item.id).then((response)=>{
    //                 item.status = 'INACTIVE';
    //                 item.statusI18nText='无效';
    //                 that.$message({type:'success',message: '失效成功'});
    //             }).catch((error)=>{ });
    //       }

    //       EcoMessageBox.confirm('确定失效并作废该账号？','提示',{
    //           confirmButtonText: '确定',
    //           cancelButtonText: '取消',
    //           type: 'warning'
    //       },confirmYesFunc);
    // },

    // enableSingle(item){
    //       enableSeal(item.id).then((response)=>{
    //             item.status = 'ACTIVE';
    //             item.statusI18nText='有效';
    //             this.$message({type:'success',message: '生效成功'});
    //       }).catch((error)=>{ });
    // },

    // sealRole(item){
    //     this.$router.push({name:'sealRole',params:{sealId:item.id,orgId:this.$route.params.orgId}});
    // }
    
    
  },
  watch: {

  }
}
</script>
<style>
.sealListInDept .toolbar{
    padding:10px 10px;
    background-color:#fff;
    border-bottom:1px solid #ddd;
    line-height: 39px;
}

.sealListInDept .toolbar i{
  font-size: 12px;
}

.sealListInDept .green{
  color:#67c23a;
}

.sealListInDept .red{
  color:#f56c6c;
}


</style>
