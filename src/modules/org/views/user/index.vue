<template>
     <div class="userIndex">
        <div class="userAside" >
            <el-row  class="toolBar">
                    <el-col :span="10">
                        <eco-tool-title style="line-height: 38px;" :title="'部门机构'"></eco-tool-title>
                    </el-col>

                    <el-col :span="14" style="text-align:right;padding-right:5px;line-height:38px;">
                          <el-button v-if="isShowImport" type="text" size="medium" :title="'人事导入'" @click.native="userImport"><i class="icon iconfont icondel"></i>人事导入</el-button>
                          <el-checkbox v-model="selectAll" @change="changeDeptType" style="margin-left:5px;">
                                  {{selectAll?'全部':'全部'}}
                          </el-checkbox>
                    </el-col>
            </el-row>

            <div class="treeContent">

                  <div  class="searchIpt">
                        <el-input
                            size="small"
                            placeholder="人员关键字搜索"
                            v-model="searchKey"
                            @keyup.enter.native="searchFunc"
                          >
                           <i slot="suffix" @click="searchFunc" style="cursor:pointer;" class="el-input__icon el-icon-search"></i>
                        </el-input>
                  </div>

                  <div class="dataContent">
                      <el-scrollbar style="height:100%" >
                              <el-tree
                                :data="treeData"
                                :props="defaultProps"
                                highlight-current
                                node-key="id"
                                :default-expanded-keys="expandedKeys"
                                :load="loadNode"  lazy
                                @node-click="handleNodeClick"
                                ref="treeRef"
                              >

                                <div class="custom-tree-node"   slot-scope="{ node, data }">
                                      <i class="icon el-icon-warning" v-if="data.status=='INACTIVE'"></i>
                                      <span class="type-name">{{ node.label }}</span>
                                </div>

                            </el-tree>
                      </el-scrollbar>
                  </div>
            </div>
        </div>
        
        <div class="userMain">
             <router-view ></router-view>
        </div>  
    </div>
</template>
<script>
import {getOrgManageDeptSubList,disableDept,enableDept,getRoleExistsAdmin} from '../../service/service.js'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {mapMutations} from 'vuex'
import EcoUtil from '@/components/util/main.js'
import {sysEnv} from '../../config/env.js'

export default{
  name:'user',
  components:{
      ecoContent,
      ecoToolTitle
  },
  data(){
    return {
        hackReset:true,
        treeData: [],
        expandedKeys:[],
        defaultProps: {
            children: 'children',
            label: 'name',
            isLeaf: function(data, node){
                return !data.haveSub 
            }
        },
        selectAll:false,
        searchKey:null,
        isShowImport:false
    }
  },
  mounted(){
      window.ecoFrameVmTree = this; //添加监听
      this.addMonitor(); //添加监听
      this.getUserImportRole();
      this.getOrgDeptRoot();
  },
  methods: {
       addMonitor(){
            let callBackDialogFunc = function(obj){
                if(obj && (obj.action == 'userImportCallBack')){ //回调的唯一标识符
                  window.ecoFrameVmTree.getOrgDeptRoot();
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'userImport');
      },

      getUserImportRole(){
          getRoleExistsAdmin('orgSync').then(res=>{
                this.isShowImport = res.data;
          }).catch(e=>{})
      },

      //改变选择级别，有效或全部
      changeDeptType(){
          this.treeData = [];
          this.getOrgDeptRoot();
          this.$router.push({name:'user'});
      },

      //搜索
      searchFunc(){
           if(this.searchKey!=null&& this.searchKey!=''){
                this.$router.push({name:'userListSearch',params:{searchKey:encodeURIComponent(this.searchKey),selectAll:this.selectAll }});
           }
      },

      //点击树节点
      handleNodeClick(data,node) {
          this.$router.push({ name: 'userListInDept', params: {deptId:data.id } });
      },

      //ajax加载
      loadNode(node, resolve) {
          if(node.level === 0){
              return ;
          }
          setTimeout(() => {
              getOrgManageDeptSubList(node.data.id,this.selectAll).then((response)=>{
                    let data = response.data;
                    resolve(data);
              }).catch((error)=>{
                    resolve([]);
              });
          }, 500);
      },

      //获取根节点
      getOrgDeptRoot(){
          getOrgManageDeptSubList(-1,this.selectAll).then((response)=>{
              if (response.data&&response.data.length){
                  this.treeData = response.data;
              }
          }).catch((error)=>{})
      },

      reload(){
          this.hackReset = false
          this.$nextTick(() => {
              this.hackReset = true
          })
      },

       userImport(){
            if(sysEnv == 0){
                this.$router.push({name:'userImport'});
            }else{
                EcoUtil.getSysvm().openDialog('','/org/#/userImport',window.parent.innerWidth-100,(window.parent.innerHeight-120-100),'50px');
            }
            
       }
  },
  watch: {

  }
}
</script>
<style>
.userIndex{
    position:fixed;
    top:0px;
    left:0px;
    bottom:0px;
    right:0px;
    background-color: rgb(245, 245, 245);
}

.userIndex .userAside{
   position:absolute;
   top:2%;
   left:20px;
   bottom:2%;
   width:270px;
   background-color: #fff;
}

.userIndex .userAside .toolBar{
    padding:10px 10px 10px 10px;
    background-color:#fff;
    border-bottom:1px solid #ddd;
}

.userIndex .userAside .treeContent{
    position:absolute;
    top:60px;
    bottom:0px;
    left:0px;
    right:0px;
}


.userIndex .userAside .treeContent .searchIpt{
    width:90%;
    text-align: center;
    margin-top:10px;
    margin-left:15px;
    margin-bottom:10px;
}

.userIndex .userAside .treeContent .dataContent{
      position:absolute;
      top:50px;
      bottom:0px;
      left:0px;
      right:0px;
}



.userIndex .userAside .treeContent .type-name{
   font-size: 14px;
}

.userIndex .el-tree-node__content{
    padding:4px 0px;
}


.userIndex .userMain{
    position:absolute;
    left:305px;
    right:20px;
    top:2%;
    bottom:2%;
    background-color:#fff ;
}

.menuitem{
  position: relative;
}
.menuitem .point{
  position: absolute;
  left: -16px;
  color: #888;
}
.menuitem .icon {
  font-size:12px;
margin-right: 4px;
}
</style>
