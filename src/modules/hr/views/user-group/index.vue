<template>
     <eco-content top="0px" bottom="0px" type="tool" class="userGroup" style="background-color:#f5f5f5">   
          <div class="content webLayout">
              <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
              <eco-content top="0px" height="60px" type="tool">
                      <el-row class="toolbar">
                          <el-col :span="8" >
                              <eco-tool-title style="line-height: 34px;" :title="'用户组'"></eco-tool-title>
                          </el-col>

                          <el-col :span="16" class="tlr">
                              <el-button  type="primary" class="toolBtn" style="font-size:14px;" @click.native="addGroup" ><i class="el-icon-circle-plus-outline" style="margin-right:10px;font-size: 14px;"></i>&nbsp;添加</el-button>
                          </el-col>
                      </el-row>
            </eco-content>
       
            <eco-content  bottom="42px" top="60px" ref="content" style="padding:10px 15px;">
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
                      width="200"
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
                      prop="comments"
                      show-overflow-tooltip
                      label="备注"
                      width="200"
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
                      width="170"
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
                      show-overflow-tooltip
                      label="是否有效"
                      width="100"
                      >
                      <template slot-scope="scope" >
                        <div style="text-align:center">
                          <i class="el-icon-check" v-if="scope.row.valid"></i>
                          <i class="el-icon-close" v-else></i>
                        </div>
                      </template>
                    </el-table-column>

                    <el-table-column
                         label="操作"
                         width="180"
                      >
                            <template slot-scope="scope" >
                              <div>
                                  <span class="pointerClass"  style="color:#409EFF;" @click="editGroup(scope.row)">编辑</span> 
                                  <span class="split" ></span>
                                  <span class="pointerClass"  style="color:#67c23a;" @click="editMember(scope.row)">成员</span> 
                                  <span class="split"  v-if="scope.row.valid"></span>
                                  <span class="pointerClass" v-if="scope.row.valid" style="color:#F56C6C;" @click="setValid(scope.row,false)" >失效</span> 
                                  <span class="split"  v-if="!scope.row.valid"></span>
                                  <span class="pointerClass" v-if="!scope.row.valid" style="color:#67c23a;" @click="setValid(scope.row,true)" >生效</span> 
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
      </eco-content>
</template>
<script>



import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import EcoUtil from '@/components/util/main.js'
import {getUserGroupList,disableGroup,enableGroup} from '../../service/service.js'
import {sysEnv} from '../../config/env.js'

export default{
  name:'userGroup',
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
      this.getUserGroupListFunc();
  },
  methods: {
    addMonitor(){
          let callBackDialogFunc = function(obj){
              if(obj && (obj.action == 'groupAddCallBack'||obj.action =='groupEditCallBack')){ //回调的唯一标识符
                window.ecoFrameVm.getUserGroupListFunc()
              }
          }
          EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'userGroup');
    },

    addGroup(){
        if(sysEnv == 1){
              let url = '/hr/index.html#/groupAdd';
              EcoUtil.getSysvm().openDialog('用户组添加',url,600,310,'12vh');
        }else{
              this.$router.push({name:'groupAdd'});
        }
    },

    editGroup(item){
        if(sysEnv == 1){
              let url = '/hr/index.html#/groupEditBaseInfo/'+item.id;
              EcoUtil.getSysvm().openDialog('用户组编辑（'+item.name+"）",url,600,310,'12vh');
        }else{
              this.$router.push({name:'groupEditBaseInfo',params:{id:item.id}});
        }
    },

    editMember(item){
        if(sysEnv == 1){
              let url = '/hr/index.html#/groupEditMember/'+item.id;
              EcoUtil.getSysvm().openDialog('用户组编辑（'+item.name+"）",url,600,400,'12vh');
        }else{
              this.$router.push({name:'groupEditMember',params:{id:item.id}});
        }
    },

    
 
    setValid(item,val){
        if(val){
            enableGroup(item.id).then((response)=>{
                this.getUserGroupListFunc();
            }).catch((error)=>{});
        }else{
          disableGroup(item.id).then((response)=>{
              this.getUserGroupListFunc();
          }).catch((error)=>{});
        }
    },

    //列表
    getUserGroupListFunc(){
        this.$refs.ecoLoadingRef.open();
        getUserGroupList(this.baseInfo).then((response)=>{
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
        this.getUserGroupListFunc();
    },
    handleCurrentChange(val) {
        this.$refs.content.setScollTop(0);
        this.baseInfo.page = val;
        this.getUserGroupListFunc();
    },
  },
  destroyed(){
      delete window.ecoFrameVm;
  }
}
</script>
<style scope>
.userGroup .content{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
}

.userGroup .toolbar{
  padding:12px 10px;
  background-color:#fff;
  border-bottom:1px solid #ddd;
}

.userGroup .split{
    border-right: 1px solid #ddd;
    margin: 0 10px 0 5px;
}
</style>
