<template>
    <div>
         <ecoContent top="0" height="65px" style="line-height:45px;height:45px;text-align:right;">
             <el-button type="primary" @click.native="save" style="margin-right:20px;">保存配置</el-button>
         </ecoContent>
         <ecoContent top="45px" height="30px" style="padding:0 24px;">
            <el-row :gutter="20">
              <el-col :span="12" :offset="0" style="padding-left:24px;">
                系统菜单
              </el-col>
              <el-col :span="12" :offset="0" style="padding-left:24px;">
                前置菜单
              </el-col>
            </el-row>
         </ecoContent>
          <ecoContent top="75px" bottom="0px" style="padding:0 24px;">
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-tree
                  :data="treeData"
                  :props="defaultProps"
                  node-key="id"
                  show-checkbox
                  default-expand-all
                  :default-checked-keys="defaultChecked"
                  :render-content="renderContent"
                  ref="treeRef"
                  :check-strictly=true
                >
              </el-tree>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-tree
                  :data="treeDataFacade"
                  :props="defaultProps"
                  node-key="id"
                  show-checkbox
                  default-expand-all
                  :default-checked-keys="defaultChecked"
                  :render-content="renderContent"
                  ref="treeRef2"
                  :check-strictly=true
                >
              </el-tree>
            </el-col>
          </el-row>
          </ecoContent>
     
    </div>
</template>
<script>

import ecoContent from '@/components/pageAb/ecoContent.vue'
import {getCustomMenuTree,getCustomMenuTreeFacade,getPermissionGroupMenuIds,savePermissionGroupMenuIds} from '../../service/service.js'
import {Loading } from 'element-ui';
import {EcoUtil} from '@/components/util/main.js'



export default{
  name:'permissionMenuConfig',
  components:{
 
      ecoContent
  },
  data(){
    return {
      defaultChecked:[],
      treeData: [],
      treeDataFacade: [],
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
      }).catch((error)=>{ })
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
          this.treeData = tempMenuArray;
          this.getCustomMenuTreeFacade();
        }
      }).catch((error)=>{
      })
    },
    
    getCustomMenuTreeFacade(){
      getCustomMenuTreeFacade().then((response)=>{
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
          this.treeDataFacade = tempMenuArray;
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
      let defaultChecked2 = this.$refs.treeRef2.getCheckedKeys();
      defaultChecked = defaultChecked.concat(defaultChecked2);
      let loadingInstance = Loading.service({ fullscreen: true,text:'正在修改...'});
      savePermissionGroupMenuIds(id,defaultChecked).then((res)=>{
              this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close();
              });
              try {
                  this.$message({type: 'success',message: '保存成功！'});
                  let doObj = {}
                  doObj.close = true;
                  EcoUtil.getSysvm().callBackDialogFunc(doObj);
              } catch (error) { }
      }).catch((error)=>{
            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                            loadingInstance.close();
                });
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
