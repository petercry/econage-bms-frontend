<template>
    <div>
      <div class="kn-header" >
        <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
        <div>
          树形示例
          <ecoActionBtn :to="{ name: 'treeAdd',params:{parentId:-1}}" :ecoActionBtnFunc="reload">
            <i slot="icon" class="el-icon-circle-plus"/>
            添加根节点
          </ecoActionBtn>
          <ecoActionBtn :ecoActionBtnFunc="addChildClick">
            <i slot="icon" class="el-icon-circle-plus"/>
            添加子节点
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
              :default-expanded-keys="expandedKeys"
              :load="loadNode"  lazy
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
</template>
<script>
import ecoActionBtn from '@/modules/demo/views/components/ecoActionBtn.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {getTreeList} from '@/modules/demo/service/service.js'
import {mapMutations} from 'vuex'
export default{
  name:'dept',
  components:{
    ecoActionBtn,
    ecoLoading
  },
  data(){
    return {
      hackReset:true,
      treeData: [],
      expandedKeys:[],
      defaultProps: {
          children: 'children',
          label: 'i18nText',
          isLeaf: 'isLeaf'
      }
    }
  },
  mounted(){
    this.getTreeRoot();
  },
  methods: {
      addChildClick(){
        let currentNode = this.$refs.treeRef.getCurrentNode();
        if (currentNode){
          this.$router.push({
            name:'treeAdd',
            params:{
              parentId:currentNode.id
            }
          })
        }else{
          this.$message({type: 'error',message: '请在左侧选择部门节点！'});
        }
      },
      handleNodeClick(data,node) {
        this.$router.push({
          name: 'treeEdit',
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
          getTreeList(node.data.id).then((response)=>{
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
      getTreeRoot(){
        getTreeList(-1).then((response)=>{
          if (response.data&&response.data.length){
            this.treeData = response.data.map((item)=>{
              item.isLeaf = !item.haveSub;
              return item;
            });
          }
        }).catch((error)=>{
        })
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
