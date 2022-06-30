<template>
    <ecoContent top="0" bottom="0" style="padding:0 20px;">
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <el-tree
          class="dragList"
          :data="list"
          :props="{label: 'name'}"
          node-key="id"
          draggable
          @node-drop="handleDragEnd"
          :allow-drop="allowDrop"
          :render-content="renderContent"
          ref="treeRef"
        >
      </el-tree>
    </ecoContent>
</template>
<script>
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {getTitleAll,dndTitle} from '@/modules/portal1/service/service.js'
import {mapMutations} from 'vuex'
  export default{
      name:'themeSort',
      components:{
        ecoLoading,
        ecoContent
      },
      data() {
        return {
          list:[]
        }
      },
      created(){
      },
      mounted(){
        this.getList();
      },
      methods: {
        getList(){
          getTitleAll().then(res=>{
            if (res.data&&res.data.rows){
              this.list = res.data.rows;
            }
          }).catch(e=>{})
        },
        //自定义节点渲染
        renderContent(h,{node,data,store}){
          return (
              <div class="dragItem">
                <span>{node.label}</span>
                <i class="el-icon-rank"></i>
              </div>
          )
        },
        allowDrop(draggingNode, dropNode, type){
          if (type=='inner'){
            return false;
          }
          return true;
        },
        handleDragEnd(draggingNode, dropNode, dropType, ev){
          this.$refs.ecoLoadingRef.open();
          let dndObj = {};
          let id=draggingNode.data.id;
          dndObj.targetId=dropNode.data.id;
          switch (dropType) {
            case 'before': dndObj.point='top'; break;
            case 'after': dndObj.point='bottom'; break;
            case 'inner': dndObj.point='append'; break;
            default:break;
          }
          dndTitle(id,dndObj).then((res)=>{
            this.$refs.ecoLoadingRef.close();
            try {
              let doObj = {}
              doObj.action = 'themeUpdateCallBack';
              doObj.close = false;
              parent.window.sysvm.callBackDialogFunc(doObj);
            } catch (error) {}
          }).catch((error)=>{
            this.getList();
            this.$refs.ecoLoadingRef.close();
            this.$message({type: 'error',message: '移动失败！'});
          })
          return ;
        },
      }
  }
</script>
<style>
.dragList .el-tree-node__content{
  line-height: 26px;
  height: 36px;
  background-color: #F5F5F5;
  border: 1px solid #EEEEEE;
  margin: 10px 0;
}
.dragItem{
  height: 26px;
  width: 100%;
  position: relative;
  padding-right: 40px;
}
.dragItem i{
  position: absolute;
  right: 10px;
  top:6px;
}
</style>
