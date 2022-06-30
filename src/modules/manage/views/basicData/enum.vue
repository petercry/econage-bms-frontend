<template>
    <div>
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <div class="kn-header" >
        <div>
          <ecoActionBtn :ecoActionBtnFunc="addCategory">
            <i slot="icon" class="el-icon-plus"/>
            添加枚举分组
          </ecoActionBtn>
          <ecoActionBtn :ecoActionBtnFunc="addEnum">
            <i slot="icon" class="el-icon-plus"/>
            添加枚举
          </ecoActionBtn>
          <ecoActionBtn :ecoActionBtnFunc="edit">
            <i slot="icon" class="el-icon-edit"/>
            编辑
          </ecoActionBtn>
          <!-- <div class="fr" style="margin-right:10px;"> -->
            <!-- <span style="display:inline-block;padding:0 4px;"><i class="el-icon-plus point" @click="add"></i></span> -->
            <!-- <span style="display:inline-block;padding:0 4px;"><i class="el-icon-edit point" @click="edit"></i></span> -->
          <!-- </div> -->
        </div>
      </div>
      <eco-content style="right:auto;width:200px;border-right: 1px solid #ccc;" width="200px" top="30px" bottom="0">
        <eco-content top="0px" bottom="0">
            <el-tree
              :data="treeData"
              :props="defaultProps"
              highlight-current
              node-key="tid"
              :default-expanded-keys="expandedKeys"
            
              @node-click="handleNodeClick"
              :render-content="renderContent"
              ref="treeRef"
            > 
             <!-- :load="loadNode"  lazy
              draggable
              @node-drop="handleDragEnd" -->
          </el-tree>
        </eco-content>
      </eco-content>
      <eco-content style="left:201px"  top="30px" bottom="0">
        <router-view v-if="hackReset"></router-view>
      </eco-content>
    </div>
</template>
<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoActionBtn from '@/modules/manage/views/components/ecoActionBtn.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {getBasicKvCategoryList,getBasicKvGroupList} from '@/modules/manage/service/service.js'
import {mapMutations} from 'vuex'
export default{
  name:'basicDataEnum',
  components:{
    ecoActionBtn,
    ecoLoading,
    ecoContent
  },
  data(){
    return {
      hackReset:true,
      treeData: [],
      expandedKeys:[],
      defaultProps: {
          children: 'basicKvGroups',
          label: 'name',
          isLeaf: 'isLeaf'
      }
    }
  },
  mounted(){
    this.SET_SYSTREE(this.$refs.treeRef);
    this.getBasicKvCategory();
    this.resetCategoryChildren(1)
  },
  methods: {
      ...mapMutations(['SET_SYSTREE']),
      // 添加枚举分组 
      addCategory(){
        this.reload();
        this.$router.push({
          name: 'basicDataCategoryAdd',
        });        
      },
      addEnum(){
        this.reload();
        let treeSelected = this.$refs.treeRef.getCurrentNode();
        if (treeSelected&&treeSelected.type=='category'){
          this.$router.push({
            name: 'basicDataGroupAdd',
            params:{
              categoryId:treeSelected.id
            }
          }); 
        }else{
          this.$message({type: 'error',message: '请在左侧选择分组节点！'});
        }
      },
      // add(){
      //   this.reload();
      //   let treeSelected = this.$refs.treeRef.getCurrentNode();
      //   this.$router.push({
      //     name: 'basicKvGroupAdd',
      //     params: {
      //       parentId:treeSelected?treeSelected.id:-1
      //     }
      //   });
      // },
      edit(){
        this.reload();
        let treeSelected = this.$refs.treeRef.getCurrentNode();
        if (treeSelected){
          if (treeSelected.type == "category"){
            this.$router.push({
              name: 'basicDataCategoryEdit',
              params: {
                id:treeSelected.id
              }
            });
          }
          if (treeSelected.type == "group"){
            this.$router.push({
              name: 'basicDataGroupEdit',
              params: {
                id:treeSelected.id
              }
            });
          }
        }else{
          this.$message({type: 'error',message: '请在左侧选择节点！'});
        }
      },
      handleNodeClick(data,node) {
        if(data.type == 'category'){
          this.$router.push({
            name: 'basicDataGroupList',
            params: {
              categoryId:data.id
            }
          });
        }
        if(data.type == 'group'){
          this.$router.push({
            name: 'basicDataDetailList',
            params: {
              group:data.id
            }
          });
        }
        // this.reload();
        // this.$router.push({
        //   name: 'basicKvGroupEdit',
        //   params: {
        //     id:data.id
        //   }
        // });
      },
      //自定义节点渲染
      renderContent(h,{node,data,store}){
          return (
              <div class="menuitem">
                {
                  // (data.status=='INACTIVE')?<i class="icon el-icon-warning"></i>:(data.level=='keshi'||data.level=='bumen')?<i class="icon el-icon-success"></i>:null
                  (data.status=='INACTIVE')?<i class="icon el-icon-warning"></i>:null
                }
                <span style="font-size:12px;">{node.label}</span>
              </div>
          )
      },
      getBasicKvCategory(){
        getBasicKvCategoryList().then((response)=>{
          if (response.data&&response.data.length){
            this.treeData = response.data.map(item=>{
              item.tid = 'category'+item.id;
              item.type = 'category'
              item.basicKvGroups = item.basicKvGroups?item.basicKvGroups.map(group=>{
                group.tid = 'group'+group.id;
                group.type = 'group';
                return group;
              }):item.basicKvGroups;
              return item;
            });
          }
        }).catch((error)=>{
        })
      },
      resetCategoryChildren(categoryId,func){
        getBasicKvGroupList(categoryId).then((response)=>{
          if (response.data&&response.data.length){
            let arr = response.data.map(group=>{
              group.tid = 'group'+group.id;
              group.type = 'group';
              return group;
            })
            let parantNode = this.$refs.treeRef.getNode('category'+categoryId);
            parantNode.data.basicKvGroups=arr;
            this.$nextTick(()=>{
              if (func){func();}
            })
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
