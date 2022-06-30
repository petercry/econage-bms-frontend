<template>
    <div class="leftTree">
      <transition name="el-zoom-in-center">
          <el-row class="toolbar" v-show="!showSearch">
              <el-col :span="8" >
                  <eco-tool-title style="line-height: 36px;" :title="'计划任务编制'"></eco-tool-title>
              </el-col>
              <el-col :span="16" style="text-align:right;">
                  <el-button type="text" @click="addPlan"><i class="el-icon-circle-plus-outline"></i> 添加</el-button>
                  <el-button type="text" v-show="infoId" @click="submitPlan"><i class="el-icon-finished"></i> 审核</el-button>
                  <el-button type="text" v-show="infoId" @click="onSaveAndSubmit"><i class="el-icon-position"></i> 下发</el-button>
                  <el-checkbox class="checkbox" v-model="tree_checked">批量</el-checkbox>
                  <el-button type="text" style="float:right;margin-left: 10px;" @click="showSearchFunc"><i class="el-icon-search"></i></el-button>
              </el-col>
          </el-row>
      </transition>
      <transition name="el-zoom-in-center">
          <el-row class="toolbar" v-show="showSearch">
                <el-col :span="21">
                    <el-input @input="doSearch" ref="s_input" type="text" size="small" v-model="name" placeholder="请输入名称" ></el-input>
                </el-col>
                <el-col :span="3" style="text-align:right;">
                    <el-button class="iconbtn" type="text" @click="showSearch = false"><i class="el-icon-close"></i></el-button>
                </el-col>
            </el-row>
      </transition>
        <div class="treeMain" v-loading="searchLoading">
          <el-scrollbar>
            <el-tree
                class="treeList"
                :props="defaultProps"
                node-key="id"
                :load="loadNode"
                :expand-on-click-node="false"
                lazy
                :check-strictly="true"
                show-checkbox
                @check-change="handleCheckChange"
                v-show="!showSearch"
                :highlight-current="true"
                @node-click="nodeClick"
                ref="tree">
                <div class="custom-tree-node ellipsis" slot-scope="{ node }" @click="goDetail(node)">
                  <span class="type-name">{{ node.label }}</span>

                </div>
              </el-tree>
              <el-tree
                class="treeList"
                :props="defaultProps"
                node-key="id"
                lazy
                check-strictly
                show-checkbox
                v-show="showSearch"
                :highlight-current="true"
                :data="searchData"
                >
                <div class="custom-tree-node ellipsis" slot-scope="{ node }" @click="goDetail(node)">
                  <span class="type-name">{{ node.label }}</span>
                </div>
              </el-tree>
          </el-scrollbar>
        </div>
    </div>
</template>
<script>
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {getPlanTreeList,getPlanInfoList,approvePlan,xiafaPlan} from '../../../../api/plan.js'
import {EcoUtil} from '@/components/util/main.js'
import {getWFOperateId} from '../../../../api/common.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
export default {
  name:'leftTree',
  components: {
      ecoToolTitle
  },
  data() {
    return {
      caseId:-1,
      defaultExpanded:[],
      defaultProps: {
        children: 'children',
        label(data,node){
            return data.text || data.name;
        },
        isLeaf(data,node){
            //根据text 判断是不是根结点
            return data.subTotal <= 0;
        },

      },
      showSearch:false,
      searchData:[],
      rootTree:[],
      rootResolve:null,
      rootNode:null,
      caseObj:{
        data:{}
      },
      name:"",
      modelId:null,
      infoId:null,
      searchLoading:false,
      parentId:"-1",
      tree_checked:false
    }
  },
  created() {
    if(this.$route.params.modelId && this.$route.params.modelId > 0){
          this.modelId = this.$route.params.modelId;
    }
    if(this.$route.params.infoId && this.$route.params.infoId > 0){
          this.infoId = this.$route.params.infoId;
    }
  },
  activated(){

  },

  mounted(){
  },

  computed: {

  },

  methods: {

     loadNode(node, resolve) {

        if(node.level == 0){
            this.rootNode = node;//保留根节点
            this.rootResolve = resolve;//保留根节点方法
            this.rootNode.childNodes = [];
            getPlanTreeList(-1,this.modelId,this.infoId).then((response) =>{
              this.rootTree = response.rows;
              resolve(this.rootTree);
            })
        }else{
            getPlanTreeList(node.data.id,this.modelId,this.infoId).then((response) => {
              let dataList = response.rows;
              //this.allDataList.set()
              setTimeout(() => {
                resolve(dataList);
                if(this.tree_checked){
                  for(let item of node.childNodes){
                    item.checked = node.checked;
                  }
                }


              }, 200);
            })
        }
      },
      goDetail(node){
          if(window.isInCard){
            this.$router.push({name:'addOrUpdatePlanInCard',params:{id:node.data.id,parentId:node.data.parentId}});
          }else if(window.isInProjectCard){
              this.$router.push({name:'addOrUpdatePlanInProjectCard',params:{id:node.data.id,parentId:node.data.parentId}});
          }else{
            this.$router.push({name:'addOrUpdatePlan',params:{id:node.data.id,parentId:node.data.parentId}});
          }

      },
      addPlan(){
        if(window.isInCard){
          this.$router.push({name:'addOrUpdatePlanInCard',params:{id:0,parentId:this.parentId}});
        }else if(window.isInProjectCard){
          this.$router.push({name:'addOrUpdatePlanInProjectCard',params:{id:0,parentId:this.parentId}});
        }else{
          this.$router.push({name:'addOrUpdatePlan',params:{id:0,parentId:this.parentId}});
        }
      },
      deleteTreeList(key){
          let node = this.$refs['tree'].getNode(key);
          if(node){
            this.$refs['tree'].remove(node);
          }
      },
      reloadNode(data){
         this.$nextTick(() => {
            this.$refs['tree'].setCheckedKeys([],false);
         });
         if(data.parentId && data.parentId != -1){
            if(this.parentId != data.parentId){
              let c_node = this.$refs['tree'].getNode(data.id);
              if(c_node){
                this.$refs['tree'].remove(c_node);
              }
            }
            let node = this.$refs.tree.getNode(data.parentId);
            node.loaded = false;
            node.expand();
            console.log(2)


         }else{
            // let treeItemArray = this.$refs.tree.treeItemArray;
            // const temp = treeItemArray.find(single => single.id === data.id);
            // if(temp){//如果存在，就更新，不存在，就添加
            //    this.$refs.tree.treeItemArray = treeItemArray.map(single => data.id === single.id ? data : single)
            // }else{
            //    this.$refs.tree.treeItemArray.push(data);
            // }
            // console.log(this.$refs.tree);
            //先全部更新吧，有时间再想想局部刷新
            this.loadNode(this.rootNode,this.rootResolve)
         }
      },
      showSearchFunc(){
          this.showSearch = true;
          this.$nextTick(()=>{
             this.$refs['s_input'].focus();
          })

      },
      doSearch(value){
          if(!value) {
            this.searchData = [];
            return
          }
          this.searchLoading= true;
          getPlanInfoList({modelId:this.modelId,infoId:this.infoId,name:this.name}).then((res)=>{
            this.searchData = res.rows;
            this.searchLoading = false;
          })
      },
      submitPlan(){
        const checkedItems = this.$refs.tree.getCheckedKeys();
        if(checkedItems.length == 0){
           return EcoMessageBox.alert('请勾选计划！');
        }
        EcoUtil.getSysvm().showLoadingDiv('正在初始化... 请稍等');
        approvePlan(this.infoId,checkedItems).then(res=>{
          getWFOperateId(res.startTaskId).then(response=>{
              if(response.status == 0){
                  EcoUtil.getSysvm().hideLoadingDiv();
                  let operateId = response.operate_id;
                  let tabObj = {};
                  let goPage = "flowform/index.html#/wfDetail/"+res.startTaskId+"/"+operateId;
                  tabObj.desc = '待办流程';
                  tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wfDetail"+res.startTaskId+"',href_link:'"+goPage+"',fullScreen:true}";
                  EcoUtil.getSysvm().doTab(tabObj);
              }else{
                  EcoUtil.getSysvm().hideLoadingDiv();
                  EcoMessageBox.alert(response.msg);
                  this.closeFullWindow();
              }
          }).catch(e=>{
            EcoUtil.getSysvm().hideLoadingDiv();
          })
        }).catch(e=>{
          EcoUtil.getSysvm().hideLoadingDiv();
        })
      },
      closeFullWindow(){
        let _closeObj = {};
        _closeObj.clearIframe = true;
        _closeObj.tabClick = true;
        EcoUtil.getSysvm().closeFullScreen(_closeObj);
      },
      nodeClick(data){
        this.parentId = data.id;
      },
      onSaveAndSubmit(){
        const checkedItems = this.$refs.tree.getCheckedKeys();
        if(checkedItems.length == 0){
           return EcoMessageBox.alert('请勾选计划！');
        }
        EcoUtil.getSysvm().showLoadingDiv('正在下发中... 请稍等');
        xiafaPlan(checkedItems).then(res=>{
            EcoUtil.getSysvm().hideLoadingDiv();
            this.$message({
              message: '下发成功',
              showClose: true,
              duration:2000,
              customClass:'design-from-el-message',
              type: 'success'
            });
        }).catch(e=>{
          EcoUtil.getSysvm().hideLoadingDiv();
          console.log(e);
        })
     },
     handleCheckChange(data, checked) {
       if(this.tree_checked){
          let node = this.$refs['tree'].getNode(data.id);
          for(let item of node.childNodes){
            item.checked = checked;
          }
       }

      },

  },
  watch:{

  },

};
</script>

<style scoped>
.leftTree{
    font-size: 14px;
    height: 100%;
    position: relative;
}
.treeList .custom-tree-node {
    line-height: 26px;
    width:100%;
}
.treeList .custom-tree-node .type-name{
    color:#0f1419;
    font-size:14px;
}
.toolbar{
  padding: 7px 10px;
  height:50px;
  position: absolute;
  width: 100%;
  border-bottom:1px solid #ddd;
}
.treeMain{
  position: absolute;
  top:51px;
  bottom:0px;
  left: 0;
  right: 0;
}
.iconbtn{
    padding: 0;
    height: 32px;
    margin-left: 12px;
    line-height: 32px;
    font-size: 20px;
}
.leftTree .checkbox{
  color:#003b90;
  margin-left: 10px;
}

</style>
