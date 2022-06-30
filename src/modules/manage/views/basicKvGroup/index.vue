<template>
    <div>
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <div class="kn-header" >
          <div>
            基础数据类别
            <ecoActionBtn :ecoActionBtnFunc="add">
              <i slot="icon" class="el-icon-plus"/>
              添加
            </ecoActionBtn>
            <!-- <div class="fr" style="margin-right:10px;"> -->
              <!-- <span style="display:inline-block;padding:0 4px;"><i class="el-icon-plus point" @click="add"></i></span> -->
              <!-- <span style="display:inline-block;padding:0 4px;"><i class="el-icon-edit point" @click="edit"></i></span> -->
            <!-- </div> -->
          </div>
        </div>
      <eco-content style="right:auto;width:200px;border-right: 1px solid #ccc;" width="200px" top="0" bottom="0">
        <eco-content top="30px" bottom="0">
            <el-tree
              :data="treeData"
              :props="defaultProps"
              highlight-current
              node-key="id"
              :default-expanded-keys="expandedKeys"
              :load="loadNode"  lazy
              draggable
              @node-drop="handleDragEnd"
              @node-click="handleNodeClick"
              :render-content="renderContent"
              ref="treeRef"
            >
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
import {getBasicKvGroupList,dndBasicKvGroup} from '@/modules/manage/service/service.js'
import {mapMutations} from 'vuex'
export default{
  name:'user',
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
          children: 'children',
          label: 'name',
          isLeaf: 'isLeaf'
      }
    }
  },
  mounted(){
    this.SET_SYSTREE(this.$refs.treeRef);
    this.getBasicKvGroupRoot();
  },
  methods: {
      ...mapMutations(['SET_SYSTREE']),
      add(){
        this.reload();
        let treeSelected = this.$refs.treeRef.getCurrentNode();
        this.$router.push({
          name: 'basicKvGroupAdd',
          params: {
            parentId:treeSelected?treeSelected.id:-1
          }
        });
      },
      // edit(){
      //   this.reload();
      //   let treeSelected = this.$refs.treeRef.getCurrentNode();
      //   if (treeSelected){
      //     this.$router.push({
      //       name: 'basicKvGroupEdit',
      //       params: {
      //         id:treeSelected.id
      //       }
      //     });
      //   }else{
      //     this.$message({type: 'error',message: '请在左侧选择节点！'});
      //   }
      // },
      handleNodeClick(data,node) {
        this.reload();
        this.$router.push({
          name: 'basicKvGroupEdit',
          params: {
            id:data.id
          }
        });
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
      loadNode(node, resolve) {
        if(node.level === 0){
            return ;
        }
        setTimeout(() => {
          getBasicKvGroupList(node.data.id).then((response)=>{
            let data = response.data.map((item)=>{
              item.isLeaf = !item.existSub;
              return item;
            });
            resolve(data);
          }).catch((error)=>{
            resolve([]);
          });
        }, 500);
      },
      getBasicKvGroupRoot(){
        getBasicKvGroupList(-1).then((response)=>{
          if (response.data&&response.data.length){
            this.treeData = response.data.map((item)=>{
              item.isLeaf = !item.existSub;
              return item;
            });
          }
        }).catch((error)=>{
        })
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
        dndBasicKvGroup(dndObj).then((res)=>{
          if (dropType=='inner'){
            let targetNode = this.$refs.treeRef.getNode(dndObj.targetId);
            targetNode.isLeaf= false;
          }
          // this.$router.push({
          //   name:'basicKvGroupEdit',
          //   params:{
          //     id:dndObj.id
          //   }
          // })
          this.$refs.ecoLoadingRef.close();
        }).catch((error)=>{
          this.getBasicKvGroupRoot();
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
