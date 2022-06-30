<template>
    <div>
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <ecoContent top="0" bottom="0" style="padding:40px 20px 10px;">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>菜单配置</span>
            <el-button style="float: right;" type="default" @click.native="save">保存配置</el-button>
          </div>
          <el-tree
              :data="treeData"
              :props="defaultProps"
              node-key="id"
              show-checkbox
              default-expand-all
              :default-checked-keys="defaultChecked"
              :render-content="renderContent"
              ref="treeRef"
            >
          </el-tree>
        </el-card>
      </ecoContent>
      <!-- <div class="kn-main">
        
      </div> -->
    </div>
</template>
<script>
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {getCustomMenuTree,getPermissionGroupMenuIds,savePermissionGroupMenuIds} from '@/modules/manage/service/service.js'
export default{
  name:'permissionMenuConfig',
  components:{
    ecoLoading,
    ecoContent
  },
  data(){
    return {
      defaultChecked:[],
      treeData: [],
      defaultProps: {
          children: 'children',
          label: 'name',
          isLeaf: 'leaf'
      }
    }
  },
  mounted(){
    this.getCustomMenuTree();
  },
  methods: {
    getPermissionGroupMenuIds(){
      let id = this.$route.params.id; 
      getPermissionGroupMenuIds(id).then(res=>{
        if (res.data&&res.data.length){
          this.defaultChecked = res.data;
        }
        console.log(res)
      }).catch((error)=>{
      })
    },
    //自定义节点渲染
    renderContent(h,{node,data,store}){
        return (
            <div class="menuitem">
              <span style="font-size:12px;">{node.label}</span>
            </div>
        )
    },
    getCustomMenuTree(){
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
          // let obj = {
          //   name:'自定义菜单',
          //   id:'-1',
          //   levelId:0,
          //   children:tempMenuArray
          // }
          this.treeData = tempMenuArray;
          this.getPermissionGroupMenuIds();
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
    save(){
      let id = this.$route.params.id; 
      let defaultChecked = this.$refs.treeRef.getCheckedKeys();
      this.$refs.ecoLoadingRef.open();
      savePermissionGroupMenuIds(id,defaultChecked).then((res)=>{
        try {
            this.$message({type: 'success',message: '保存成功！'});
            this.$refs.ecoLoadingRef.close();
            // let doObj = {}
            // doObj.action = 'groupEditCallBack';
            // doObj.close = true;
            // parent.window.sysvm.callBackDialogFunc(doObj);
        } catch (error) {
          
        }
      }).catch((error)=>{
        this.$refs.ecoLoadingRef.close();
        this.$message({type: 'error',message: '保存失败！'});
      })
    }
  },
  watch: {

  }
}
</script>
<style>

</style>
