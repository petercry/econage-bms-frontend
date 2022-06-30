<template>
    <div class="leftTree">
        <transition name="el-zoom-in-center">
          <el-row class="toolbar" v-show="!showSearch">
              <el-col :span="12" >
                  <eco-tool-title style="line-height: 36px;" :title="'专业配置'"></eco-tool-title>
              </el-col>
              <el-col :span="12" style="text-align:right">
                  <el-button type="text" @click="addActivity"><i class="el-icon-circle-plus-outline"></i> 添加专业</el-button>
                  <el-button type="text" style="float:right;" @click="showSearchFunc"><i class="el-icon-search"></i></el-button>
              </el-col>
          </el-row>
        </transition>
        <transition name="el-zoom-in-center">
            <el-row class="toolbar" v-show="showSearch">
                <el-col :span="20">
                    <el-input @input="doSearch"  ref="s_input" type="text" size="small" v-model="name" placeholder="请输入名称" ></el-input>
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
                v-show="showSearch"
                :highlight-current="true"
                :data="searchData"
                >
                <div class="custom-tree-node ellipsis" slot-scope="{ node }" @click="goDetailBySearch(node)">
                  <span class="type-name">{{ node.label }}</span>
                </div>
              </el-tree>
          </el-scrollbar>
        </div>
    </div>
</template>
<script>
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {getActivityList,getActivityRowsCount} from '../../../api/activity.js'
import { mapActions,mapGetters,mapState } from 'vuex'
export default {
  name:'leftTree',
  components: {
      ecoToolTitle
  },
  data() {
    return {
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
      showSearch:false,
      searchData:[],
      name:"",
      searchLoading:false
    }
  },
  created() {

  },
  activated(){

  },

  mounted(){
  },

  computed: {
     ...mapGetters([
        'activityType',
    ]),
  },

  methods: {
      ...mapActions([
        'setActivityType'
      ]),
     loadNode(node, resolve) {
        if(node.level == 0){
            this.setActivityType().then(() =>{
              // if(this.activityType.length > 0){
              //   this.defaultExpanded.push(this.activityType[0].id)
              // }
              getActivityRowsCount(this.modelId,this.infoId).then(res=>{
                for(let item of this.activityType){
                  item.isParent = res[item.id];
                }
                resolve(this.activityType);
              })
            })
        }else{
          getActivityList(node.data.id).then((response) => {
            let dataList = response.rows;
            setTimeout(() => {
              resolve(dataList);
            }, 200);
          })
        }
      },
      goDetail(node){
        if(node.level > 1){
          this.$router.push({name:'addOrUpdateActivity',params:{id:node.data.id}});
        }
      },
      deleteTreeList(key){
          let node = this.$refs['tree'].getNode(key);
          if(node){
            this.$refs['tree'].remove(node);
          }
      },
      addActivity(){
         this.$router.push({name:'addOrUpdateActivity',params:{id:0}});
      },
      reloadCurrentNode({type}={}){
         if(type){
            let node = this.$refs.tree.getNode(type);
            node.loaded = false;
            node.expand();
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
          getActivityList('',this.name).then((res)=>{
            this.searchData = res.rows;
            this.searchLoading = false;
          })
      },
      goDetailBySearch(node){
        this.$router.push({name:'addOrUpdateActivity',params:{id:node.data.id}});
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
