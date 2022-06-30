<template>

 <eco-content top="0px" bottom="0px" type="tool" class="roleIndex" style="background-color:#f5f5f5">   
          <div class="content">
              <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
              <eco-content top="0px" height="60px" type="tool" >
                      <el-row class="toolbar" style="padding:0px 10px;line-height:60px;height:60px;">
                          <el-col :span="8" >
                              <eco-tool-title style="line-height: 34px;" :title="'角色定义'"></eco-tool-title>
                          </el-col>

                          <el-col :span="8" style="text-align:center;">
                                &nbsp;
                                <div  v-for="item in roleTypeArray" :key="item.id" class="el-tabs__item is-top " v-bind:class="{'is-active':tabActive == item.id}" style="padding:0px;line-height:58px;height:58px;margin:0px 20px;" @click="handleTabClick(item.id)">{{item.name}}</div>
                                &nbsp;
                          </el-col>


                          <el-col :span="8" class="tlr">
                              <el-button  type="primary" class="toolBtn" style="font-size:14px;" @click.native="addRole" ><i class="icon iconfont iconpiliang" style="margin-right:10px;font-size: 14px;"></i>&nbsp;添加</el-button>
                          </el-col>
                      </el-row>
              </eco-content>

              <eco-content bottom="0px" top="60px" ref="content" style="padding:10px 15px;">
                    <el-table
                        :data="roleArray"
                        style="width: 100%"
                        size="mini"
                        height="100%"
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
                          width="100"
                        >
                      </el-table-column>
                      <el-table-column
                          prop="name"
                          show-overflow-tooltip
                          label="名称"
                          width="100"
                        >
                      </el-table-column>

                      <el-table-column
                          prop="i18nKey"
                          show-overflow-tooltip
                          label="国际化键"
                          min-width="123"
                        >
                      </el-table-column>

                      <el-table-column
                        prop="i18nText"
                        show-overflow-tooltip
                        label="国际化文本"
                        min-width="123"
                        >
                      </el-table-column>

                      <el-table-column
                         label="类型"
                         width="80"
                      >
                          <template slot-scope="scope" >
                              <div>
                                 <span>{{roleTypeMap[String(scope.row.type)]}}</span>
                              </div>
                          </template>
                      </el-table-column>

                      <el-table-column
                        prop="order"
                        show-overflow-tooltip
                        label="排序"
                        width="50"
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
                        width="170"
                        >
                      </el-table-column>

                       <el-table-column
                         label="操作"
                         width="80"
                      >
                            <template slot-scope="scope" >
                              <div>
                                  <span class="pointerClass"  style="color:#409EFF;" @click="editRole(scope.row)">编辑</span> 
                                  <!-- <span class="split"  ></span>
                                  <span class="pointerClass"  style="color:#F56C6C;" @click="delRole(scope.row)" >删除</span>  -->
                              </div>
                            </template>
                       </el-table-column>
                    </el-table>
              </eco-Content>
          </div>
  
    </eco-content>
</template>
<script>

import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {sysEnv} from '../../config/env.js'
import {getRoleList,deleteRole,getRoleTypeEnum} from '../../service/service.js'
import EcoUtil from '@/components/util/main.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'


export default{
  name:'role',
  components:{
  
      ecoLoading,
      ecoContent,
      ecoToolTitle
  },
  data(){
    return {
      listArray:[],
      roleArray:[],
      roleTypeArray:[],
      roleTypeMap:{},
      currentRow:null,

      tabActive:'ORG',
      globalKey:'GLOBAL'
    }
  },
  mounted(){
    window.ecoFrameVm = this; //添加监听
    this.addMonitor(); //添加监听
    this.getRoleListFunc();
    this.getRoleTypeEnumFunc();
  },
  methods: {
    addMonitor(){
          let callBackDialogFunc = function(obj){
              if(obj && (obj.action == 'roleAddCallBack'||obj.action =='roleEditCallBack')){ //回调的唯一标识符
                window.ecoFrameVm.getRoleListFunc()
              }
          }
          EcoUtil.addCallBackDialogFunc(callBackDialogFunc);
    },

    addRole(){
       if(sysEnv == 1){
              let url = '/org/index.html#/roleAdd/'+this.tabActive;
              EcoUtil.getSysvm().openDialog('角色添加',url,600,400,'12vh');
        }else{
              this.$router.push({name:'roleAdd',params:{type:this.tabActive}});
        }
    },

    editRole(item){
        if(sysEnv == 1){
              let url = '/org/index.html#/roleEdit/'+item.code;
              EcoUtil.getSysvm().openDialog('角色编辑',url,600,400,'12vh');
        }else{
              this.$router.push({name:'roleEdit',params:{code:item.code}});
        }
    },

 
    delRole(item){
          let _that  = this;
          let confirmYesFunc = function(){
              deleteRole(item.code).then((response)=>{
                  _that.$message({type: 'success', message: '删除成功!'});
                  _that.getRoleListFunc();
              }).catch((error)=>{
                  _that.$message({type: 'error', message: '删除失败!'});
              });
          }

          let options = {
              type: 'warning',
              lockScroll:false
          }

          EcoMessageBox.confirm('删除角色定义，会连带删除已经配置的关联角色信息，是否删除角色定义？','提示',options,confirmYesFunc);
    },

    //列表
    getRoleListFunc(){
        this.$refs.ecoLoadingRef.open();
        getRoleList().then((response)=>{
            this.listArray = response.data.rows;
            this.$refs.ecoLoadingRef.close();
            this.getRoleFilterArray();
        }).catch((error)=>{
            this.$refs.ecoLoadingRef.close();
        });
    },

     
    getRoleTypeEnumFunc(){
        getRoleTypeEnum().then((response)=>{
            let _roleTypeObj = response.data;
            for(let key in _roleTypeObj){
                this.roleTypeArray.push({id:key,name:_roleTypeObj[key]});
                this.roleTypeMap[String(key)] = _roleTypeObj[key];
            }
        })
    },

    getRoleFilterArray(){
        let _roleArray = [];
        for(let i = 0;i<this.listArray.length;i++){
            if(this.tabActive == this.globalKey){
                if(this.listArray[i].type == this.globalKey){
                     _roleArray.push(this.listArray[i]);
                }
            }else{
                if(this.listArray[i].type != this.globalKey){
                     _roleArray.push(this.listArray[i]);
                }
            }
        }
        this.roleArray = _roleArray;
    },

    handleTabClick(tab){
        this.tabActive = tab;
        this.getRoleFilterArray();
    }
  },
  watch: {

  }
}
</script>
<style scope>


.roleIndex .content{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
}

.roleIndex .toolbar{
  padding:12px 10px;
  background-color:#fff;
  border-bottom:1px solid #ddd;
}

.roleIndex .split{
    border-right: 1px solid #ddd;
    margin: 0 10px 0 5px;
}

.roleIndex .is-active{
    border-bottom:2px solid #409EFF;
}
</style>
