<template>
    <div class="leftTree">
      <transition name="el-zoom-in-center">
          <el-row class="toolbar" v-show="!showSearch">
              <el-col :span="16" >
                  <eco-tool-title style="line-height: 36px;" :title="'里程碑配置'"></eco-tool-title>
              </el-col>
              <el-col :span="8">
                  <el-button type="text" @click="addMiles" v-if="milesRoleAdd"><i class="el-icon-circle-plus-outline"></i> 添加</el-button>
                  <el-button type="text" style="float:right;" @click="showSearchFunc"><i class="el-icon-search"></i></el-button>
              </el-col>
          </el-row>
      </transition>
      <transition name="el-zoom-in-center">
          <el-row class="toolbar" v-show="showSearch">
                <el-col :span="20">
                    <el-input @input="doSearch" ref="s_input" type="text" size="small" v-model="name" placeholder="请输入名称" ></el-input>
                </el-col>
                <el-col :span="4">
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
                lazy
                v-show="!showSearch"
                :highlight-current="true"
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
import {getMilesTreeList,getMilesInfoList} from '../../../api/miles.js'
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
      'milesRoleAdd',
    ]),
  },

  methods: {

     loadNode(node, resolve) {

        if(node.level == 0){
            this.rootNode = node;//保留根节点
            this.rootResolve = resolve;//保留根节点方法
            this.rootNode.childNodes = [];
            getMilesTreeList(-1,this.modelId,this.infoId).then((response) =>{
              this.rootTree = response.rows;
              resolve(this.rootTree);
            })
        }else{
          getMilesTreeList(node.data.id,this.modelId,this.infoId).then((response) => {
            let dataList = response.rows;
            setTimeout(() => {
              resolve(dataList);
            }, 200);
          })
        }
      },
      goDetail(node){
         if(window.isInCard){
           this.$router.push({name:'addOrUpdateMilesInCard',params:{id:node.data.id}});
         }else if(window.isInProjectCard){
            this.$router.push({name:'addOrUpdateMilesInProjectCard',params:{id:node.data.id}});
         }else{
           this.$router.push({name:'addOrUpdateMiles',params:{id:node.data.id}});
         }

      },
     
      deleteTreeList(key){
          let node = this.$refs['tree'].getNode(key);
          if(node){
            this.$refs['tree'].remove(node);
          }
      },
      addMiles(){
         if(window.isInCard){
           this.$router.push({name:'addOrUpdateMilesInCard',params:{id:0}});
         }else if(window.isInProjectCard){
            this.$router.push({name:'addOrUpdateMilesInProjectCard',params:{id:0}});
         }else{
           this.$router.push({name:'addOrUpdateMiles',params:{id:0}});
         }
      },
      reloadNode(data){
         if(data.parentId && data.parentId != -1){
            let node = this.$refs.tree.getNode(data.parentId);
            node.loaded = false;
            node.expand();
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
          getMilesInfoList({modelId:this.modelId,infoId:this.infoId,name:this.name}).then((res)=>{
            this.searchData = res.rows;
            this.searchLoading = false;
          })
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
</style>
