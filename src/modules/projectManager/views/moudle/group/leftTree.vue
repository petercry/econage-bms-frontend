<template>
    <div class="leftTree">
       <transition name="el-zoom-in-center" >
            <el-row class="toolbar" v-show="!showSearch">

                <el-col :span="12" >
                    <eco-tool-title style="line-height: 36px;" :title="'团队配置'"></eco-tool-title>
                </el-col>
                <el-col :span="12" style="text-align:right">
                    <!-- <el-button type="text" @click="addGroupType"><i class="el-icon-circle-plus-outline"></i> 类型</el-button> -->
                    <el-button type="text" v-if="editable && groupRoleAdd" @click="addGroup"><i class="el-icon-circle-plus-outline"></i> 添加团队</el-button>
                    <el-button type="text" style="float:right;" @click="showSearchFunc"><i class="el-icon-search"></i></el-button>
                </el-col>
            </el-row>
        </transition>
        <transition name="el-zoom-in-center" >
            <el-row class="toolbar" v-show="showSearch">
                <el-col :span="20">
                    <el-input @input="doSearch" ref="s_input" type="text" size="small" v-model="name" placeholder="请输入名称" ></el-input>
                </el-col>
                <el-col :span="4">
                    <el-button class="iconbtn" type="text" @click="showSearch = false"><i class="el-icon-close"></i></el-button>
                </el-col>
            </el-row>
        </transition>
        <div class="treeMain" v-loading="searchLoading" >
          <el-scrollbar>
            <el-tree
                class="treeList"
                :props="defaultProps"
                node-key="id"
                :load="loadNode"
                lazy
                v-show="!showSearch"
                :highlight-current="true"
                ref="tree">
                <div class="custom-tree-node ellipsis" slot-scope="{ node }" @click="goDetail(node)">
                  <span class="type-name">{{ node.label }}</span>
                  <span class="type-btn" v-if="node.level > 1 && groupRoleEdit && infoId" @click="editSingle($event,node)">编辑</span>
                </div>
              </el-tree>
            <el-tree
                class="treeList"
                :props="defaultProps"
                node-key="id"
                v-show="showSearch"
                :highlight-current="true"
                :data="searchData"
                >
                <div class="custom-tree-node ellipsis" slot-scope="{ node }" @click="goDetailBySearch(node)">
                  <span class="type-name">{{ node.label }}</span>
                  <span class="type-btn" v-if="groupRoleEdit && infoId" @click="editSingle($event,node)">编辑</span>
                </div>
              </el-tree>
          </el-scrollbar>
        </div>
    </div>
</template>
<script>
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {getGroupList,getGroupRowsCount} from '../../../api/group.js'
import { mapActions,mapGetters,mapState } from 'vuex'
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
            return !data.isParent;
        },

      },
      caseObj:{
        data:{}
      },
      showSearch:false,
      searchData:[],
      rootResolve:null,
      rootNode:null,
      modelId:"",
      infoId:"",
      name:"",
      searchLoading:false
    }
  },
  props:{
      editable: {
          type: Boolean,
          default(){
              return true
          }
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
     ...mapGetters([
        'groupType',
        'groupRoleAdd',
        'groupRoleEdit'
    ]),
  },

  methods: {
      ...mapActions([
        'setGroupType'
      ]),
     loadNode(node, resolve) {
        if(node.level == 0){
            this.rootNode = node;//保留根节点
            this.rootResolve = resolve;//保留根节点方法
            this.rootNode.childNodes = [];
            this.setGroupType().then(() =>{
              getGroupRowsCount(this.modelId,this.infoId).then(res=>{
                for(let item of this.groupType){
                  item.isParent = res[item.id];
                }
                resolve(this.groupType);
              })

            })
        }else{
          getGroupList(node.data.id,this.modelId,this.infoId).then((response) => {
            let dataList = response.rows;
            setTimeout(() => {
              resolve(dataList);
            }, 200);
          })
        }
      },
      goDetail(node){
        if(node.level > 1){
          if(window.isInCard){
              this.$router.push({name:'addOrUpdateGroupInCard',params:{id:node.data.id}});
          }else if(window.isInProjectCard){
            //   this.$router.push({name:'addOrUpdateGroupInProjectCard',params:{id:node.data.id}});
            this.$router.push({name:"listMain",params:{id:node.data.id}});
          }else{
              this.$router.push({name:'addOrUpdateGroup',params:{id:node.data.id}});
          }
        }else{
          // if(window.isInCard){
          //     this.$router.push({name:'addOrUpdateGroupTypeInCard',params:{id:node.data.id}});
          // }else if(window.isInProjectCard){
          //     this.$router.push({name:'addOrUpdateGroupTypeInProjectCard',params:{id:node.data.id}});
          // }else{
          //     this.$router.push({name:'addOrUpdateGroupType',params:{id:node.data.id}});
          // }
        }
      },
      deleteTreeList(key){
          let node = this.$refs['tree'].getNode(key);
          if(node){
            this.$refs['tree'].remove(node);
          }
      },
      addGroup(){
          if(window.isInCard){
              this.$router.push({name:'addOrUpdateGroupInCard',params:{id:0}});
          }else if(window.isInProjectCard){
              this.$router.push({name:'addOrUpdateGroupInProjectCard',params:{id:0}});
          }else{
              this.$router.push({name:'addOrUpdateGroup',params:{id:0}});
          }
      },
      addGroupType(){
          if(window.isInCard){
              this.$router.push({name:'addOrUpdateGroupTypeInCard',params:{id:0}});
          }else if(window.isInProjectCard){
              this.$router.push({name:'addOrUpdateGroupTypeInProjectCard',params:{id:0}});
          }else{
              this.$router.push({name:'addOrUpdateGroupType',params:{id:0}});
          }
      },
      reloadCurrentNode({type}={}){
         if(type){
            let node = this.$refs.tree.getNode(type);
            node.loaded = false;
            node.expand();
         }
      },
      reloadNode(){
          this.loadNode(this.rootNode,this.rootResolve)
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
          this.searchLoading = true;
          getGroupList('',this.modelId,this.infoId,this.name).then((res)=>{
            this.searchData = res.rows;
            this.searchLoading = false;
          })
      },
      goDetailBySearch(node){
          if(window.isInCard){
              this.$router.push({name:'addOrUpdateGroupInCard',params:{id:node.data.id}});
          }else if(window.isInProjectCard){
            //   this.$router.push({name:'addOrUpdateGroupInProjectCard',params:{id:node.data.id}});
              this.$router.push({name:"listMain",params:{id:node.data.id}});
          }else{
              this.$router.push({name:'addOrUpdateGroup',params:{id:node.data.id}});
          }
      },
      editSingle(e,node){
          e.stopPropagation();
          this.$router.push({name:'addOrUpdateGroupInProjectCard',params:{id:node.data.id}});
      }
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
    display: flex;
    justify-content: space-between;
}
.treeList .custom-tree-node .type-name{
    color:#0f1419;
    font-size:14px;
}
.treeList .custom-tree-node .type-btn{
    margin-right: 20px;
    color: #003b90;
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
</style>
