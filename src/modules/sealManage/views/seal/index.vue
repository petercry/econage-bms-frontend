<template>
     <div class="sealIndex">
        <div class="sealAside" >
            <el-row  class="toolBar">
                    <el-col :span="9">
                        <eco-tool-title style="line-height: 38px;" :title="'组织结构'"></eco-tool-title>
                    </el-col>
            </el-row>

            <div class="treeContent">
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
                          :expand-on-click-node="false"
                        >

                          <div class="custom-tree-node"   slot-scope="{ node, data }">
                                      <i class="icon el-icon-warning" v-if="data.status=='INACTIVE'"></i>
                                      <span class="type-name">{{ node.label }}</span>
                          </div>

                      </el-tree>
                 </el-scrollbar>
            </div>
        </div>
        
        <div class="sealMain">
             <router-view v-if="hackReset"></router-view>
        </div>  
    </div>
</template>
<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {getOrgDeptSelectList} from '../../service/service.js'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {mapMutations} from 'vuex'
export default{
  name:'seal',
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
          label: 'orgText',
          isLeaf: 'isLeaf'
      }
    }
  },
  mounted(){
    this.getOrgDeptRoot();
  },
  methods: {
      handleNodeClick(data,node) {
        this.reload();
        this.$router.push({
          name: 'sealListInDept',
          params: {
            orgId:data.orgId
          }
        });
      },
    
      loadNode(node, resolve) {
        if(node.level === 0){
            return ;
        }
        setTimeout(() => {
          getOrgDeptSelectList(node.data.orgId,{selectScope:['DEPT']}).then((response)=>{
            let data = response.data.map((item)=>{
              item.isLeaf = !item.haveSub;
              return item;
            });
            resolve(data);
          }).catch((error)=>{
            resolve([]);
          });
        }, 500);
      },
      getOrgDeptRoot(){
        getOrgDeptSelectList(-1,{selectScope:['DEPT']}).then((response)=>{
          if (response.data&&response.data.length){
            this.treeData = response.data.map((item)=>{
              item.isLeaf = !item.haveSub;
              return item;
            });
          }
        }).catch((error)=>{
        })
      },
      reload(){
        this.hackReset = false
        this.$nextTick(() => {
          this.hackReset = true
        })
      }
  },
  watch: {

  }
}
</script>
<style>
.sealIndex{
    position:fixed;
    top:0px;
    left:0px;
    bottom:0px;
    right:0px;
    background-color: rgb(245, 245, 245);
}

.sealIndex .sealAside{
   position:absolute;
   top:2%;
   left:20px;
   bottom:2%;
   width:270px;
   background-color: #fff;
   overflow-y: hidden;
}

.sealIndex .sealAside .toolBar{
    padding:10px 10px 10px 10px;
    background-color:#fff;
    border-bottom:1px solid #ddd;
}

.sealIndex .sealAside .treeContent{
    position:absolute;
    top:60px;
    bottom:-17px;
    left:0px;
    right:0px;
}

.sealIndex .sealAside .treeContent .type-name{
   font-size: 14px;
}

.sealIndex .el-tree-node__content{
    padding:4px 0px;
}


.sealIndex .sealMain{
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
