<template>

    <eco-content top="0px" bottom="0px" type="tool" class="permissionIndex" style="background-color:#f5f5f5">  
        <div class="content webLayout">
              <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
              <eco-content top="0px" height="60px" type="tool">
                      <el-row class="toolbar">
                          <el-col :span="8" >
                              <eco-tool-title style="line-height: 34px;" :title="'权限组'"></eco-tool-title>
                          </el-col>

                          <el-col :span="16" class="tlr">
                              <el-button  type="primary" class="toolBtn" style="font-size:14px;" @click.native="addGroup" ><i class="el-icon-circle-plus-outline" style="margin-right:10px;font-size: 14px;"></i>&nbsp;添加</el-button>
                          </el-col>
                      </el-row>
              </eco-content>
   
            <eco-content bottom="42px" top="60px" ref="content" style="padding:10px 15px;">
                  <el-table
                      :data="listArray"
                      style="width: 100%"
                      height="100%"
                      size="mini"
                      highlight-current-row
                      class="styleTableDefault"
                      stripe
                  >
                  <el-table-column
                      type="index"
                      min-width="40"
                      max-width="50"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="code"
                    show-overflow-tooltip
                    label="编号"
                    width="80"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    show-overflow-tooltip
                    label="名称"
                    min-width="123"
                    >
                  </el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    label="是否有效"
                    width="90"
                    >
                    <template slot-scope="scope" >
                      <div style="text-align:center">
                          <i class="el-icon-check" v-if="scope.row.valid " style="color:#67c23a"></i>
                          <i class="el-icon-close" v-else style="color:#F56C6C"></i>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="comments"
                    show-overflow-tooltip
                    label="备注"
                    width="150"
                    >
                  </el-table-column>
                  <!-- <el-table-column
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
                  </el-table-column> -->
                  <!-- <el-table-column
                    prop="modUser"
                    show-overflow-tooltip
                    label="修改人"
                    width="80"
                    >
                  </el-table-column> -->
                  <el-table-column
                    prop="modDate"
                    show-overflow-tooltip
                    label="修改时间"
                    width="150"
                    >

                    <template slot-scope="scope" >
                          {{ scope.row.modDate?scope.row.modDate.substring(0,16):''}}
                    </template>
                  </el-table-column>
                  
                  <el-table-column
                         label="操作"
                         width="170"
                      >
                            <template slot-scope="scope" >
                              <div>
                                  <span class="pointerClass"  style="color:#409EFF;" @click="editGroup(scope.row)">编辑</span> 
                                  <span class="split"  v-if="scope.row.valid"></span>
                                  <span class="pointerClass" v-if="scope.row.valid" style="color:#F56C6C;" @click="setValid(scope.row,false)" >失效</span> 
                                  <span class="split"  v-if="!scope.row.valid"></span>
                                  <span class="pointerClass" v-if="!scope.row.valid" style="color:#67c23a;" @click="setValid(scope.row,true)" >生效</span> 
                                  
                                  <span class="split" ></span>
                                  <el-dropdown trigger="click">
                                    <span class="el-dropdown-link pointerClass" style="color:#409EFF;display:inline-block;">
                                        更多<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>

                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item @click.native="editMember(scope.row)">
                                            <span >成员</span>
                                        </el-dropdown-item>
                                    
                                        <el-dropdown-item  @click.native="editModual(scope.row)">
                                            <span>模块</span>
                                        </el-dropdown-item>

                                        <el-dropdown-item  @click.native="editMenu(scope.row)">
                                            <span>菜单配置</span>
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                              </div>
                            </template>
                    </el-table-column>


                </el-table>
            </eco-content>

            <eco-content  bottom="0px" type="tool" style="padding:5px 0px">
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
            </eco-content>

        </div>
      </eco-Content>
   
</template>
<script>

import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import EcoUtil from '@/components/util/main.js'
import {getPermissionGroupList,disablePermissionGroup,enablePermissionGroup} from '../../service/service.js'
import {sysEnv} from '../../config/env.js'


export default{
  name:'permissionGroup',
  components:{
    ecoLoading,
    ecoContent,
    ecoToolTitle
  },
  data(){
    return {
      baseInfo:{
        page:1,
        rows:30,
        total:0,
        sort:'createDate',
        order:'desc',
      },
      listArray:[],
      currentRow:null
    }
  },
  mounted(){
      window.ecoFrameVm = this; //添加监听
      this.addMonitor(); //添加监听
      this.getPermissionGroupListFunc();
  },
  methods: {
    addMonitor(){
          let callBackDialogFunc = function(obj){
              if(obj && (obj.action == 'permissionAddCallBack'||obj.action =='permissionEditCallBack')){ //回调的唯一标识符
                window.ecoFrameVm.getPermissionGroupListFunc()
              }
          }
          EcoUtil.addCallBackDialogFunc(callBackDialogFunc);
    },

    addGroup(){
        if(sysEnv == 1){
              let url = '/manage/index.html#/permissionAdd';
              EcoUtil.getSysvm().openDialog('权限组添加',url,600,400,'12vh');
        }else{
              this.$router.push({name:'permissionAdd'});
        }
    },

    editGroup(item){
        if(sysEnv == 1){
              let url = '/manage/index.html#/permissionEdit/'+item.id;
              EcoUtil.getSysvm().openDialog('编辑信息（'+item.name+'）',url,600,400,'12vh');
        }else{
              this.$router.push({name:'permissionEdit',params:{id:item.id}});
        }
    },

    editMember(item){
        if(sysEnv == 1){
              let url = '/manage/index.html#/permissionEditMember/'+item.id;
              EcoUtil.getSysvm().openDialog('编辑成员（'+item.name+'）',url,600,400,'12vh');
        }else{
              this.$router.push({name:'permissionEditMember',params:{id:item.id}});
        }
    },

     editMenu(item){
        if(sysEnv == 1){
              let url = '/manage/index.html#/permissionEditMenu/'+item.id;
              EcoUtil.getSysvm().openDialog('编辑菜单配置（'+item.name+'）',url,500,550,'8vh');
        }else{
              this.$router.push({name:'permissionEditMenu',params:{id:item.id}});
        }
    },

      editModual(item){
        if(sysEnv == 1){
              let url = '/manage/index.html#/permissionEditModual/'+item.id;
              EcoUtil.getSysvm().openDialog('编辑模块权限（'+item.name+'）',url,1100,550,'8vh');
        }else{
              this.$router.push({name:'permissionEditModual',params:{id:item.id}});
        }
    },
   
    setValid(item,val){
        if(val){
            enablePermissionGroup(item.id).then((response)=>{
                this.getPermissionGroupListFunc();
            }).catch((error)=>{});
        }else{
            disablePermissionGroup(item.id).then((response)=>{
              this.getPermissionGroupListFunc();
            }).catch((error)=>{});
        }
    },

    //列表
    getPermissionGroupListFunc(){
        this.$refs.ecoLoadingRef.open();
        getPermissionGroupList(this.baseInfo).then((response)=>{
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
        this.getPermissionGroupListFunc();
    },
    handleCurrentChange(val) {
        this.$refs.content.setScollTop(0);
        this.baseInfo.page = val;
        this.getPermissionGroupListFunc();
    },
  },
  watch: {

  }
}
</script>
<style scope>
.permissionIndex .content{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
}

.permissionIndex .toolbar{
  padding:12px 10px;
  background-color:#fff;
  border-bottom:1px solid #ddd;
}

.permissionIndex .split{
    border-right: 1px solid #ddd;
    margin: 0 10px 0 5px;
}
</style>
