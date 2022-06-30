<template>
    <div class="deptIndex">

      <div class="deptAside" >
           <el-row  class="toolBar">
                    <el-col :span="24">
                          <eco-tool-title style="line-height: 38px;" :title="'部门机构'"></eco-tool-title>
                          &nbsp;
                          <el-button type="text" size="medium" :title="'添加根部门'" @click="addRootClick"><i class="icon iconfont icondel"></i> 根</el-button>
                          <el-button type="text" size="medium" :title="'添加子部门'" @click="addChildClick" style="margin-left:0px;"><i class="icon iconfont icondel"></i> 子</el-button>
                          <el-checkbox v-model="selectAll" @change="changeDeptType" style="margin-left:5px;">全部</el-checkbox>
                    </el-col>
                    <!-- <el-col :span="16" style="text-align:right;padding-right:5px;line-height:38px;">
                           
                    </el-col> -->
            </el-row>

            <!--左侧 树形菜单-->
            <div class="treeContent">

                  <div  class="searchIpt">
                        <el-input
                            size="small"
                            placeholder="搜索"
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
                            @node-drop="handleDragEnd"
                            draggable
                            ref="treeRef"
                          >
                                <div class="custom-tree-node"   slot-scope="{ node, data }">
                                    <i class="icon el-icon-warning" v-if="data.status=='INACTIVE'"></i>
                                    <span class="type-name">{{ node.label }}</span>
                                </div>
                        </el-tree>
                    </el-scrollbar>
                  </div>

                  

                <!--左侧 搜索树形菜单-->
                <div class="searchDiv" v-show="searchFlag">
                    <div class="closeDiv" ><i class="icon iconfont iconshanchu1" @click="closeSearch"></i></div>
                    <el-scrollbar style="height:100%">
                          <el-tree
                            :data="searchList"
                            :props="searchDefaultProps"
                            highlight-current
                            node-key="id"
                            @node-click="handleSearchNodeClick"
                            ref="searchTreeRef"
                          >
                                <div class="custom-tree-node"   slot-scope="{ node, data }">
                                    <i class="icon el-icon-warning" v-if="data.status=='INACTIVE'"></i>
                                    <span class="type-name" :title="node.label">{{ node.label }}</span>
                                </div>
                        </el-tree>
                  </el-scrollbar>

                </div>
            </div>
        </div>

        <div class="deptMain">
            <router-view v-if="hackReset"></router-view>
        </div>
      
    </div>
</template>
<script>

import ecoActionBtn from '../components/ecoActionBtn.vue'
import {getOrgManageDeptSubList,searchOrgManageDept,disableDept,enableDept,drapDeptNode} from '../../service/service.js'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {mapState,mapMutations} from 'vuex'
import EcoUtil from '@/components/util/main.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'

export default{
  name:'dept',
  components:{
    ecoActionBtn,
    ecoLoading,
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
      searchDefaultProps: {
          children: 'children',
          label: 'orgPathI18nText',
          isLeaf: function(data, node){
               return true;
          }
      },

      selectAll:false,
      searchKey:null,
      searchFlag:false,
      searchList:[],
      clickNodeId:null

    }
  },
  
  mounted(){
      this.getOrgDeptRoot();
  },
  computed:{
          ...mapState([
              'ecoEventData',
              'ecoEvent'
          ]),
  },
  methods: {
      changeDeptType(){
          this.searchList = [];
          this.treeData = [];
          this.getOrgDeptRoot();
          this.searchFunc();
      },

      //添加根部门
      addRootClick(){
            this.hackReset = false
            this.$nextTick(() => {
                this.hackReset = true
            })
            this.$router.push({name:'addDept',params:{parentId:-1}});
      },

      //添加子部门
      addChildClick(){
          let currentNode = this.$refs.treeRef.getCurrentNode();
          if (currentNode){
              this.$router.push({name:'addDept', params:{ parentId:currentNode.id }})
          }else{
              this.$message({type: 'error',message: '请在左侧选择部门节点！'});
          }
      },

      //失效部门
      disableSingle(){
              let _id = EcoUtil.objDeepCopy(this.ecoEventData).id;
              let  that  = this;
              let confirmYesFunc = function(){
                  disableDept(_id).then((response)=>{
                     let _node =  that.$refs.treeRef.getNode(_id);
                     let _searchNode = that.$refs.searchTreeRef.getNode(_id);
                     if(_node){
                          _node.data.status = 'INACTIVE';
                      }
                      if(_searchNode){
                          _searchNode.data.status = 'INACTIVE';
                      }
                      that.$message({type: 'success',message: '操作成功'});
                  }).catch((error)=>{});
              }

              EcoMessageBox.confirm('确定失效部门及相关子部门（子节点状态需要刷新后查看）？','提示',{
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
              },confirmYesFunc);
            
      },

      //生效部门
      enableSingle(){
            let _id = EcoUtil.objDeepCopy(this.ecoEventData).id;
            enableDept(_id).then((response)=>{
                  let _node =  this.$refs.treeRef.getNode(_id);
                  let _searchNode = this.$refs.searchTreeRef.getNode(_id);
                  if(_node){_node.data.status = 'ACTIVE';  }
                  if(_searchNode){_searchNode.data.status = 'ACTIVE';}
                  this.$message({type: 'success',message: '操作成功'});
            }).catch((error)=>{});
      },

      //点击树节点
      handleNodeClick(data,node) {
           this.$router.push({ name: 'editDept', params: { id:data.id }});
      },

      //点击搜索树节点
      handleSearchNodeClick(data,node) {
            try{
                this.$refs.treeRef.setCurrentKey(data.id);
            }catch(e){}         
            this.$router.push({name: 'editDept', params: {id:data.id}});
      },

      //自定义节点渲染
      renderContent(h,{node,data,store}){
          return (
              <div class="menuitem">
                {
                  // (data.status=='INACTIVE')?<i class="icon el-icon-warning"></i>:(data.level=='keshi'||data.level=='bumen')?<i class="icon el-icon-success"></i>:null
                  (data.status=='INACTIVE')?<i class="icon el-icon-warning"></i>:null
                }
                <span style="font-size:14px;">{node.label}</span>
              </div>
          )
      },

      //ajax 动态加载
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
                if (response.data && response.data.length){
                    this.treeData = response.data;
                }
            }).catch((error)=>{ })
      },

      //搜索
      searchFunc(){
           if(this.searchKey!=null&& this.searchKey!=''){
              this.searchFlag = true;
               searchOrgManageDept(this.searchKey,this.selectAll).then((response)=>{
                    this.searchList = response.data;
               })
           }
      },

      //关闭搜索
      closeSearch(){
          this.searchFlag = false;
          this.searchList = [];
          this.searchKey = null;
          let _currentNode = this.$refs.treeRef.getCurrentNode();
          if(_currentNode){
                 this.$router.push({name: 'editDept', params: {id:_currentNode.id}});
          }
      },

      //拖拽排序部门
      handleDragEnd(draggingNode, dropNode, dropType, ev){
            let dndObj = {};
            dndObj.id= draggingNode.data.id;
            dndObj.targetId= dropNode.data.id;
            switch (dropType) {
                case 'before': dndObj.point='top'; break;
                case 'after': dndObj.point='bottom'; break;
                case 'inner': dndObj.point='append'; break;
                default:break;
            }
            drapDeptNode(dndObj).then((res)=>{
                if(dndObj.point == 'append'){
                    this.$refs.treeRef.getNode(dndObj.targetId).isLeaf = false;
                    this.$refs.treeRef.getNode(dndObj.targetId).data.haveSub = true;
                }
                this.$router.push({ name:'editDept',params:{ id:dndObj.id }});
                this.$refs.treeRef.setCurrentKey(dndObj.id);
            }).catch((error)=>{
                // this.sysTree.$parent.getCustomMenuTree(this.$route.params.id);
                this.$message({type: 'error',message: '移动失败！'});
            })
            return ;
      },

      reload(){
            this.hackReset = false
            this.$nextTick(() => {
                this.hackReset = true
            })
      },

       watchEventAction(obj){
           if(obj && obj.action == "disableSingle"){
                  this.disableSingle();
            }else if(obj && obj.action == "enableSingle"){
                  this.enableSingle();
            }else if(obj && obj.action == "editNode"){
                  let _data = EcoUtil.objDeepCopy(this.ecoEventData);
                  try{
                      this.$refs.treeRef.getNode(_data.id).data = _data;
                  }catch(e){}
                  try{
                      this.$refs.searchTreeRef.getNode(_data.id).data = _data;
                  }catch(e){}
            }
       }
  },
  watch: {
       'ecoEvent'(newvalue,oldvalue){ //监听设置 里面发生的变化
            this.watchEventAction(newvalue);
        }, 
  }
}
</script>
<style>
.deptIndex{
    position:fixed;
    top:0px;
    left:0px;
    bottom:0px;
    right:0px;
    background-color: rgb(245, 245, 245);
}

.deptIndex .deptAside{
   position:absolute;
   top:2%;
   left:20px;
   bottom:2%;
   width:270px;
   background-color: #fff;
}

.deptIndex .deptAside .toolBar{
    padding:10px 10px 10px 10px;
    background-color:#fff;
    border-bottom:1px solid #ddd;
}

.deptIndex .deptAside .treeContent{
    position:absolute;
    top:60px;
    bottom:0px;
    left:0px;
    right:0px;
}

.deptIndex .deptAside .treeContent .searchIpt{
    width:90%;
    text-align: center;
    margin-top:10px;
    margin-left:15px;
    margin-bottom:10px;
}

.deptIndex .deptAside .treeContent .dataContent{
    position:absolute;
    top:50px;
    bottom:0px;
    left:0px;
    right:0px;
}




.deptIndex .deptAside .searchDiv{
    position:absolute;
    z-index: 1000;
    top:50px;
    left:0;
    right:0;
    bottom:0;
    background-color: #fff;
}

.deptIndex .deptAside .closeDiv{
    color:#888;
    position: absolute;
    top:5px;
    z-index:1100;
    right:10px;
}

.deptIndex .deptAside .closeDiv i{
  cursor: pointer;
}





.deptIndex .deptAside .treeContent .type-name{
   font-size: 14px;
}

.deptIndex .el-tree-node__content{
    padding:4px 0px;
}


.deptIndex .deptMain{
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
