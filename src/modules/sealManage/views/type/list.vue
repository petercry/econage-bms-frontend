<template>
    <eco-content top="0px" bottom="0px" class="typeList">
       <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
       <eco-content top="0px" height="60px" type="tool">
                    <el-row  class="toolbar">
                        <!-- <el-col :span="6">
                          签章机构<el-switch style="margin-left:10px;" v-model="value1"> </el-switch>
                        </el-col> -->
                        <el-col :span="18" style="text-align:left;padding-right:10px;">
                            <el-button type="primary"  size="mini" @click="add" >添加类型 <i class="icon el-icon-s-tools"></i></el-button>
                            <el-button type="primary"  size="mini" @click="sort" >印章排序 <i class="icon el-icon-sort"></i></el-button>
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
<!--               
                <el-table-column
                  prop="statusI18nText"
                  show-overflow-tooltip
                  label="状态"
                  width="72"
                  >
                    <template slot-scope="scope" >
                      <span  v-bind:class="{'green':scope.row.status == 'ACTIVE','red':scope.row.status != 'ACTIVE'}">{{scope.row.statusI18nText}}</span>
                    </template>
                </el-table-column> -->
<!-- 
                <el-table-column
                    prop="emId"
                    show-overflow-tooltip
                    label="员工编号"
                    min-width="100"
                  >
                </el-table-column> -->

                <el-table-column
                  prop="name"
                  show-overflow-tooltip
                  label="名称"
                  min-width="123"
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
                    prop="orgName"
                    show-overflow-tooltip
                    label="机构"
                    min-width="80"
                  >
                </el-table-column>

                <!-- <el-table-column
                    prop="modDate"
                    show-overflow-tooltip
                    label="修改时间"
                    width="150"
                  >
                </el-table-column> -->

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
import {getSealGroupAll,invalidSealGroup} from '../../service/service.js'
import EcoUtil from '@/components/util/main.js'
import {mapMutations} from 'vuex'
import {sysEnv} from '../../config/env.js'

export default{
  name:'typeList',
  components:{
      ecoLoading,
      ecoContent,
      ecoToolTitle
  },
  data(){
    return {
      // value1:true,
      listArray:[],
      currentRow:null
    }
  },
  mounted(){
      window.ecoFrameVm = this; //添加监听
      this.addMonitor(); //添加监听
      this.getSealGroupAllFunc();
  },
  methods: {
    addMonitor(){
          let callBackDialogFunc = function(obj){
              if(obj && (obj.action == 'sealTypeAddCallBack'||obj.action == 'sealTypeEditCallBack'||obj.action == 'sealTypeSortCallBack')){ //回调的唯一标识符
                window.ecoFrameVm.getSealGroupAllFunc()
              }
          }
          EcoUtil.addCallBackDialogFunc(callBackDialogFunc);
    },
    add(){
      if(sysEnv == 1){
            EcoUtil.getSysvm().openDialog('添加印章类型','/sealManage/index.html#/sealTypeAdd/-1',400,160);
      }else{
            this.$router.push({name:'sealTypeAdd',params:{orgId:-1}});
      }
    },
    edit(id){
      if(sysEnv == 1){
            EcoUtil.getSysvm().openDialog('编辑印章类型','/sealManage/index.html#/sealTypeEdit/'+id,400,160);
      }else{
          this.$router.push({name:'sealTypeEdit',params:{ id:id}})
      }
    },
    sort(){
      if(sysEnv == 1){
            EcoUtil.getSysvm().openDialog('印章类型排序','/sealManage/index.html#/sealTypeListSort/'+this.$route.params.orgId,550,400);
      }else{
            this.$router.push({name:'sealTypeListSort',params:{orgId:this.$route.params.orgId}});
      }
    },
    del(id){
          let _that  = this;
          let confirmYesFunc = function(){
              invalidSealGroup(id).then((response)=>{
                  _that.$message({type: 'success', message: '删除成功!'});
                  _that.getSealGroupAllFunc();
              }).catch((error)=>{
                  _that.$message({type: 'error', message: '删除失败!'});
              });
          }

          let options = {
              type: 'warning',
              lockScroll:false
          }

          EcoMessageBox.confirm('确定删除该类别？','提示',options,confirmYesFunc);
    },

    //列表
    getSealGroupAllFunc(){
        // let orgId = this.$route.params.orgId;
        let orgId = '';
        this.$refs.ecoLoadingRef.open();
        getSealGroupAll(orgId).then((response)=>{
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
.typeList .toolbar{
    padding:10px 10px;
    background-color:#fff;
    border-bottom:1px solid #ddd;
    line-height: 39px;
}

.typeList .toolbar i{
  font-size: 12px;
}
</style>
