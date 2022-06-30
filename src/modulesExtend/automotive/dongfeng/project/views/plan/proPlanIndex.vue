<template>
    <div class="deptIndex webLayout">

      <div class="deptAside" >
            <el-row  class="toolBar">
                <el-col :span="24">
                    <eco-tool-title style="line-height: 38px;" :title="'项目节点与计划'"></eco-tool-title>
                    &nbsp;
                    <el-button type="text" size="medium" :title="'添加节点'" @click="addNodeClick"><i class="el-icon-circle-plus-outline"></i>&nbsp;节点</el-button>
                    <el-button type="text" size="medium" :title="'添加计划'" @click="addPlanClick" style="margin-left:0px;"><i class="el-icon-circle-plus-outline"></i>&nbsp;计划</el-button>
                </el-col>
            </el-row>

            <!--左侧 树形菜单-->
            <div class="treeContent">
                  <div class="dataContent">
                      <el-scrollbar style="height:100%">
                          <el-tree
                            :data="treeData"
                            :props="defaultProps"
                            highlight-current
                            node-key="id"
                            :default-expanded-keys="expandedKeys"
                            ref="treeRef"
                            v-if="treeLoaded"
                             @node-click="handleNodeClick"
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

        <div class="deptMain">
            <router-view v-if="hackReset"></router-view>
        </div>
      
    </div>
</template>
<script>


import {getProNodePlanList,deleteProNode} from '../../service/service.js'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {mapState,mapMutations} from 'vuex'
import EcoUtil from '@/components/util/main.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'

export default{
  name:'dept',
  components:{
        ecoLoading,
        ecoToolTitle
  },
  data(){
    return {
        projectId:null,
        treeLoaded:false,
        hackReset:true,
        treeData: [],
        expandedKeys:[],
        defaultProps: {
            children: 'children',
            label: 'node',
            isLeaf: function(data, node){
                return !(data.children && data.children > 0)
            }
        },
      
        clickNodeId:null,

        nodeType:'node',
        planType:'plan'

    }
  },
  
  mounted(){
      this.projectId = this.$route.params.proId;
      this.getProNodePlanFunc();
  },
  computed:{
          ...mapState([
              'ecoEventData',
              'ecoEvent'
          ]),
  },
  methods: {

      getProNodePlanFunc(){
          getProNodePlanList(this.projectId).then((response)=>{
                let _nodeArray = [];
                let _planArray = [];

                response.data.node.map((item)=>{
                    item.type = this.nodeType;
                    _nodeArray.push(item);
                })

                let sortFunc = function (x, y) {//比较函数
                    if (x.planCompleteDate < y.planCompleteDate) {
                            return -1;
                    } else if (x.planCompleteDate > y.planCompleteDate) {
                            return 1;
                    } else {
                            return 0;
                    }
                }
                _nodeArray.sort(sortFunc);

                response.data.plan.map((item)=>{
                    item.type = this.planType;
                    item.node = item.taskName;
                    _planArray.push(item);
                })

                _planArray.sort(sortFunc);
               
              
                let _treeData = [];
                let _node = {id:'node',node:'节点',children:_nodeArray,type:'node'};
                let _plan = {id:'plan',node:'计划',children:_planArray,type:'plan'};

                _treeData.push(_node);
                _treeData.push(_plan);

                this.expandedKeys.push(this.nodeType);
                this.expandedKeys.push(this.planType);

                this.treeData = _treeData;
                this.treeLoaded = true;

                let _that = this;
                setTimeout(function(){
                    _that.$refs.treeRef.setCurrentKey(_that.nodeType);
                    _that.$router.push({name:'proNodeList'})
                },200)
          })
      },

      //添加节点
      addNodeClick(){
            this.$router.push({name:'addProNode'});
      },

      //添加计划
      addPlanClick(){
            this.$router.push({name:'addProPlan'});
      },

      delNode(){
            let _id = EcoUtil.objDeepCopy(this.ecoEventData).id;
            let _currKey = this.$refs.treeRef.getCurrentKey();
            if(_currKey == this.nodeType){ //如果是节点，什么都不做

            }else{
                 //获取上一个节点
                let _preId = null;
                let _rootNode = this.$refs.treeRef.getNode(this.nodeType);
                let _rootChildren = _rootNode.data.children;
                if(_rootChildren && _rootChildren.length > 0 ){
                    for(let i = 0; i < _rootChildren.length;i++){
                        if(_rootChildren[i].id == _id){
                            break;
                        }else{
                            _preId = _rootChildren[i].id;
                        }
                    }
                }
                if(_preId !=null){
                    this.$refs.treeRef.setCurrentKey(_preId);
                    this.$router.push({ name: 'editProNode', params: {id:_preId}});
                }else{
                   this.$router.push({ name: 'proNodeList'});
                }
            }

            /*删除tree里面的节点*/
            let _node =  this.$refs.treeRef.getNode(_id);
            this.$refs.treeRef.remove(_node);
      },


      delPlan(){
            let _id = EcoUtil.objDeepCopy(this.ecoEventData).id;
            let _currKey = this.$refs.treeRef.getCurrentKey();
            if(_currKey == this.planType){ //如果是节点，什么都不做

            }else{
                 //获取上一个节点
                let _preId = null;
                let _rootNode = this.$refs.treeRef.getNode(this.planType);
                let _rootChildren = _rootNode.data.children;
                if(_rootChildren && _rootChildren.length > 0 ){
                    for(let i = 0; i < _rootChildren.length;i++){
                        if(_rootChildren[i].id == _id){
                            break;
                        }else{
                            _preId = _rootChildren[i].id;
                        }
                    }
                }

                if(_preId !=null){
                    this.$refs.treeRef.setCurrentKey(_preId);
                    this.$router.push({ name: 'editProPlan', params: {id:_preId}});
                }else{
                    this.$router.push({ name: 'proPlanList'});
                }
            }

            /*删除tree里面的节点*/
            let _node =  this.$refs.treeRef.getNode(_id);
            this.$refs.treeRef.remove(_node);
      },
     

      //点击树节点
      handleNodeClick(data,node) {
            if(data.type == this.nodeType){
                if(data.id == this.nodeType){
                     this.$router.push({ name: 'proNodeList'});
                }else{
                     this.$router.push({ name: 'editProNode', params: {id:data.id}});
                }
            }else if(data.type == this.planType){
                if(data.id == this.planType){
                     this.$router.push({ name: 'proPlanList'});
                }else{
                     this.$router.push({ name: 'editProPlan', params: {id:data.id}});
                }
            }
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
            if(obj && obj.action == "addNode"){

                let _appendData = EcoUtil.objDeepCopy(this.ecoEventData);
                _appendData.type = 'node';
                let _node = this.$refs.treeRef.getNode('node');
                this.$refs.treeRef.append(_appendData,_node);

                this.$refs.treeRef.setCurrentKey(_appendData.id);
                this.$router.push({ name: 'editProNode', params: {id:_appendData.id}});

            }else if(obj && obj.action == "editNode"){
                let _data = EcoUtil.objDeepCopy(this.ecoEventData);
                try{
                    this.$refs.treeRef.getNode(_data.id).data.node = _data.node;
                    this.$refs.treeRef.getNode(_data.id).data.planCompleteDate = _data.planCompleteDate;
                }catch(e){}
            }else if(obj && obj.action == 'delNode'){
                  this.delNode();
            }else if(obj && obj.action == 'addPlan'){
                /*添加树节点*/
                let _appendData = EcoUtil.objDeepCopy(this.ecoEventData);
                _appendData.type = this.planType;
                _appendData.node = _appendData.taskName;
                let _node = this.$refs.treeRef.getNode(this.planType);
                this.$refs.treeRef.append(_appendData,_node);

                /*跳转编辑页面*/
                this.$refs.treeRef.setCurrentKey(_appendData.id);
                this.$router.push({ name: 'editProPlan', params: {id:_appendData.id}});
            }else if(obj && obj.action == 'editPlan'){

                let _data = EcoUtil.objDeepCopy(this.ecoEventData);
                try{
                    this.$refs.treeRef.getNode(_data.id).data.node = _data.taskName;
                    this.$refs.treeRef.getNode(_data.id).data.taskName = _data.taskName;
                }catch(e){}

                let _currKey = this.$refs.treeRef.getCurrentKey();
                if(_currKey == this.planType){ //如果是节点，什么都不做
                    this.$router.push({ name: 'proPlanList'});
                }
            }else if(obj && obj.action == 'delPlan'){
                  this.delPlan();
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
    top:41px;
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
    top:0px;
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
