<template>
    <eco-content top="0px" bottom="0px" type="tool" class="sysmenu webLayout" style="background-color:rgb(245, 245, 245)">   
      <div class="content">
            <div class="kn-header" >
              <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
              <div>
                前置菜单设置
                <ecoActionBtn :to="{ name: 'addSysMenu'}" :ecoActionBtnFunc="reload">
                  <i slot="icon" class="el-icon-circle-plus"/>
                  添加菜单
                </ecoActionBtn>
                <ecoActionBtn :ecoActionBtnFunc="delMenu">
                  <i slot="icon" class="el-icon-remove"/>
                  删除菜单
                </ecoActionBtn>
              </div>
            </div>

            <div class="kn-aside" >
              <!--左侧 树形菜单-->
                  <el-tree
                    :data="treeData"
                    :props="defaultProps"
                    highlight-current
                    node-key="id"
                    draggable
                    @node-drop="handleDragEnd"
                    :default-expanded-keys="expandedKeys"
                    @node-click="handleNodeClick"
                    :render-content="renderContent"
                    ref="treeRef"
                  >
                </el-tree>
            </div>
            
            <div class="kn-main">
              <router-view v-if="hackReset"></router-view>
            </div>

        </div>
    
     </eco-content>
</template>
<script>

import ecoActionBtn from '@/modules/menuFacade/views/components/ecoActionBtn.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {getCustomMenuTree,deleteCustomSysMenuItem,dndCustomSysMenuItem} from '@/modules/menuFacade/service/service.js'
import {mapMutations} from 'vuex'
import ecoContent from '@/components/pageAb/ecoContent.vue'

export default{
  name:'sysmenu',
  components:{
      ecoActionBtn,
      ecoLoading,
      ecoContent
  },
  data(){
    return {
      hackReset:true,
      treeData: [{
        name:'自定义菜单',
        id:'-1',
        levelId:0
      }],
      expandedKeys:['-1'],
      defaultProps: {
          children: 'children',
          label: 'name',
          isLeaf: 'leaf'
      }
    }
  },
  mounted(){
    this.SET_SYSTREE(this.$refs.treeRef);
    this.getCustomMenuTree();
  },
  methods: {
      ...mapMutations(['SET_SYSSELECTED','SET_SYSTREE']),
      handleNodeClick(data,node) {
        this.SET_SYSSELECTED(data);
        if (data.id!='-1'){
          this.$router.push({
            name: 'editSysMenu',
            params: {
              id:data.id
            }
          });
        }
      },
      //自定义节点渲染
      renderContent(h,{node,data,store}){
          return (
              <div class="menuitem">
                {
                  (node.isLeaf&&node.level>2)?<span class="point">●</span>:null
                }
                <span style="font-size:12px;">{node.label}</span>
              </div>
          )
      },
      getCustomMenuTree(id){
        getCustomMenuTree().then((response)=>{
          if (response.data){
            let tempMenuObj = {};
            let tempMenuArray = [];
            for(let i = 0;i< response.data.length ;i++){
              let element = response.data[i];
              if(!tempMenuObj[element.parentId+'']){
                  tempMenuObj[element.parentId+''] = [];
              }
              tempMenuObj[element.parentId+''].push(element);
            }
            /*从根节点开始过滤 */
            if(tempMenuObj['-1'] && tempMenuObj['-1'].length > 0){
                tempMenuObj['-1'].map((item)=>{
                      this.getSubMenu(tempMenuObj,item);
                      tempMenuArray.push(item);
                      return item;
                })
            }
            let obj = {
              name:'自定义菜单',
              id:'-1',
              levelId:0,
              children:tempMenuArray
            }
            this.treeData = [obj];
            this.$nextTick(function(){
                if (id){
                  this.expandedKeys=['-1',id];
                  this.$refs.treeRef.setCurrentKey(id);
                }else{
                  let toid = this.$route.params.id?this.$route.params.id:'-1';
                  this.expandedKeys=['-1',toid];
                  this.$refs.treeRef.setCurrentKey(toid);
                }
            })
          }
        }).catch((error)=>{
        })
      },
      getSubMenu(tempMenuObj,item){
            if(tempMenuObj[item.id+'']){
                let childItems = tempMenuObj[item.id+''];
                for(let i = 0;i< childItems.length ;i++){
                  let childItem = childItems[i];
                  if(tempMenuObj[childItem.id+'']){
                        this.getSubMenu(tempMenuObj,childItem);
                  }else{
                      childItem.children = [];
                  }
                }
                item.children = childItems
            }else{
                item.children = [];
            }
      },
      delMenu(){
        let treeSelected = this.$refs.treeRef.getCurrentNode();
        if (treeSelected){
          if(treeSelected.id=='-1'){
            this.$message({type: 'error',message: '根节点无法删除！'});
          }else{
            this.$refs.ecoLoadingRef.open();
            deleteCustomSysMenuItem(treeSelected.id).then((res)=>{
              this.$message({type: 'success',message: '删除成功！'});
              this.$refs.treeRef.remove(treeSelected.id)
              this.$router.push({
                path:'/sysmenu'
              })
              this.$refs.ecoLoadingRef.close();
            }).catch((error)=>{
              this.$refs.ecoLoadingRef.close();
              this.$message({type: 'error',message: '删除失败！'});
            })
          }
        }else{
          this.$message({type: 'error',message: '未选择菜单，请在左侧选择菜单节点！'});
        }
      },
      handleDragEnd(draggingNode, dropNode, dropType, ev){
        this.$refs.ecoLoadingRef.open();
        let dndObj = {};
        dndObj.id=draggingNode.data.id;
        dndObj.targetId=dropNode.data.id;
        switch (dropType) {
          case 'before': dndObj.point='top'; break;
          case 'after': dndObj.point='bottom'; break;
          case 'inner': dndObj.point='append'; break;
          default:break;
        }
        dndCustomSysMenuItem(dndObj).then((res)=>{
          this.$router.push({
            name:'editSysMenu',
            params:{
              id:dndObj.id
            }
          })
          this.$refs.ecoLoadingRef.close();
        }).catch((error)=>{
          this.sysTree.$parent.getCustomMenuTree(this.$route.params.id);
          this.$refs.ecoLoadingRef.close();
          this.$message({type: 'error',message: '移动失败！'});
        })
        return ;
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

<style scope>
.sysmenu .content{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
}
</style>
<style>
.menuitem{
  position: relative;
}
.menuitem .point{
  position: absolute;
  left: -16px;
  color: #888;
}


</style>
