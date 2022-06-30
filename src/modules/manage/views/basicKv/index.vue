<template>
    <div class="basicKvIndex webLayout">
        <div class="treeKvAside">

            <el-row  class="toolBar">
                    <el-col :span="8">
                        <eco-tool-title style="line-height: 38px;" :title="'基础数据'"></eco-tool-title>
                    </el-col>

                    <el-col :span="16" style="text-align:right;padding-right:10px;">
                            <el-button type="text" size="medium" @click="addFunc" :title="'添加分组'"><i class="icon iconfont icontianjia"></i>&nbsp;分组</el-button>
                            
                            <el-button type="text" size="medium" @click="addCategoryFunc" :title="'添加类别'" v-if="clickType == 'category'" style="color:#67c23a"><i class="icon iconfont icontianjia1"></i>&nbsp;类别</el-button>
                            <el-button type="text" size="medium"  :title="'添加类别'" v-else disabled><i class="icon iconfont icontianjia1"></i>&nbsp;类别</el-button>
                            
                            <el-button type="text" size="medium" @click="sortFunc" :title="'排序'" v-if="false"><i class="icon iconfont iconpaixu"></i></el-button>
                            
                            <el-dropdown  size="medium" placement="top" trigger="click" style="margin-left:10px">
                                <span class="el-dropdown-link">
                                    <el-button type="text" size="medium" ><i class="icon iconfont iconshenglvehao" :title="'操作'"></i></el-button>
                                </span>
                                <el-dropdown-menu slot="dropdown" >
                                        <el-dropdown-item @click.native="editFunc" v-if="clickType == 'category'" ><i class="icon iconfont iconbianji"></i>&nbsp;编辑</el-dropdown-item>
                                        <el-dropdown-item @click.native="delFuncConfirm" v-if="clickType == 'category'"><i class="icon iconfont iconchushaixuanxiang"></i>&nbsp;删除</el-dropdown-item>
                                        <el-dropdown-item @click.native="importData"  ><i class="icon el-icon-circle-plus-outline"></i>&nbsp;导入数据</el-dropdown-item>
                                       
                                </el-dropdown-menu>
                            </el-dropdown>

                            <!-- <el-button type="text" size="medium"  :title="'操作'" v-else disabled ><i class="icon iconfont iconshenglvehao"></i></el-button> -->
                           

                    </el-col>
            </el-row>
           
            <div class="treeContent">
              <el-scrollbar style="height:100%" >
                      <el-tree
                          :data="treeData"
                          :props="defaultProps"
                          highlight-current
                          node-key="tid"
                          :default-expanded-keys="expandedKeys"
                          @node-click="handleNodeClick"
                          ref="treeRef"
                      > 
                          <div class="custom-tree-node"   slot-scope="{ node, data }">
                              <span class="type-name">{{ node.label }}</span>
                          </div>
                    </el-tree>
              </el-scrollbar>
          </div>
        </div>

        <div class="treeKvMain">
            <router-view ></router-view>
        </div>
     </div>
</template>
<script>

import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {updateTreeKv,getBasicKvCategoryList,disabledBasicKvCategory} from '../../service/service.js'
import {mapState,mapMutations} from 'vuex'
import {sysEnv} from '../../config/env.js'
import EcoUtil from '@/components/util/main.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'

export default{
  name:'basicKvIndex',
  components:{
      ecoToolTitle
  },
  data(){
    return {
     
      treeData:[],
      expandedKeys:[],
      defaultProps: {
            label(data,node){
                return data.name ;
            },
            isLeaf(data,node){
                return !(data.basicKvGroups && data.basicKvGroups.length > 0);
            },
            children:'basicKvGroups'
      },

      listAction:'create-enabled',
      clickType:null,

    }
  },
  computed:{
          ...mapState([
              'ecoEventData',
              'ecoEvent'
          ]),
  },
  mounted(){
      this.getBasicKvCategoryFunc();
      window.treeKvVm = this; //添加监听
      this.addMonitor(); //添加监听
  },
  methods: {
        addMonitor(){
            let callBackDialogFunc = function(obj){
                if(obj && (obj.action == 'basicKvCategoryAddCallBack')){ 
                    window.treeKvVm.addCBFunc(obj.data);
                }else if(obj && (obj.action == 'basicKvCategoryEditCallBack')){
                    window.treeKvVm.editCBFunc(obj.data);
                }else if(obj && (obj.action == 'treeKvSortCallBack-root')){
                    window.treeKvVm.sortCBFunc(obj.data);
                }else if(obj && (obj.action == 'basicKvImportCallBack')){
                    window.treeKvVm.getBasicKvCategoryFunc();
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'basicKvIndex');
        },


        getBasicKvCategoryFunc(){
             getBasicKvCategoryList().then((response)=>{
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
                  let _that = this;
                  setTimeout(()=>{
                        if(this.treeData.length > 0){
                            _that.$refs.treeRef.setCurrentKey(this.treeData[0].tid);
                            if(this.treeData[0].type == 'category'){
                               _that.$router.push({name:'basicKvGroupList',params:{parentId:this.treeData[0].id,parentName:encodeURIComponent(this.treeData[0].name)}});
                            }else if(this.treeData[0].type == 'group'){
                               _that.$router.push({name:'basicKvGDetailList',params:{parentId:this.treeData[0].id,parentName:encodeURIComponent(this.treeData[0].name)}});
                            }

                            this.clickType = this.treeData[0].type;
                        }
                  },100)
             })
        },

        handleNodeClick(data,node) {
              this.clickType = data.type;
              if(data.type == 'category'){
                    this.$router.push({name:'basicKvGroupList',params:{parentId:data.id,parentName:encodeURIComponent(data.name)}});
              }else if(data.type == 'group'){
                    this.$router.push({name:'basicKvGroupDetailList',params:{parentId:data.id,parentName:encodeURIComponent(data.name)}});
              }
        },

        //添加类别 root层级
        addFunc(){
               if(sysEnv == 1){
                    let url = '/manage/index.html#/basicKvCategoryAdd';
                    EcoUtil.getSysvm().openDialog('添加分组',url,600,350,'12vh');
               }else{
                    this.$router.push({name:'basicKvCategoryAdd'});
               }
        },

        addCBFunc(data){
            this.getBasicKvCategoryFunc();
        },


        //添加类别 root层级
        addCategoryFunc(){
            let _currentNode = this.$refs.treeRef.getCurrentNode();
            let _id = _currentNode.id;
            if(sysEnv == 1){
                    let url = '/manage/index.html#/basicKvGroupAdd/'+_id;
                    EcoUtil.getSysvm().openDialog('添加分类 ('+_currentNode.name+')',url,600,350,'12vh');
            }else{
                    this.$router.push({name:'basicKvDetailAdd',params:{categoryId:_id}});
            }
        },

        editFunc(){
            let _currentNode = this.$refs.treeRef.getCurrentNode();

            let _key = EcoUtil.getUID();
            let _keyData = {};
            _keyData.item = EcoUtil.objDeepCopy(_currentNode);
            EcoUtil.getSysvm().setTempStore(_key,_keyData);
           
            let url = '/manage/index.html#/basicKvCategoryEdit/'+_key;
            EcoUtil.getSysvm().openDialog('修改基础数据（'+_currentNode.name+"）",url,600,470,'12vh');
            
        },

        editCBFunc(data){
            if(data.reloadList){
                 this.getBasicKvCategoryFunc();
            }else{
                let _data = EcoUtil.objDeepCopy(data.queryObj);
                _data.tid = 'category'+_data.id;
                _data.type = 'category';

                let node = this.$refs.treeRef.getNode(_data.tid);
                node.data.name = _data.name;
                node.data.i18nKey = _data.i18nKey;
                node.data.description = _data.description;
            }
        },

        delFuncConfirm(){
            let that  = this;
            let confirmYesFunc = function(){
                that.delFunc();
            }
            let options = {
                type: 'warning',
                lockScroll:false,
                dangerouslyUseHTMLString: true
            }
            let _currentNode = this.$refs.treeRef.getCurrentNode();
            EcoMessageBox.confirm('<div>确定删除分组 "'+_currentNode.name+'" 吗?</div><div style="color:red">( 删除之后，其包含的子数据将全部删除 )</div>','提示',options,confirmYesFunc);
        },

        delFunc(){
            let _currentNode = this.$refs.treeRef.getCurrentNode();
            let _id = _currentNode.id;
            let _ids = [];
            _ids.push(_id);
            disabledBasicKvCategory(_ids).then((response)=>{
                this.getBasicKvCategoryFunc();
            });
        },

        sortFunc(){
            return ;
            if(sysEnv == 1){
                let url = '/manage/index.html#/treeKvSort/-1';
                EcoUtil.getSysvm().openDialog('数据排序',url,600,500,'8vh');
            }else{
                this.$router.push({name:'treeKvSort',params:{parentId:-1}});
            } 
        },

        sortCBFunc(data){
            this.getBasicKvCategoryFunc(-1);
        },

        importData(){
            if (sysEnv==0){
                this.$router.push({name:'basicKvImport'})
            }else{
                EcoUtil.getSysvm().openDialog('基础数据导入','/manage/#/basicKvImport',300,80,'30vh');
            }
        },
       watchEventAction(obj){
           if(obj && obj.action == "addNode"){
                return;
                let _appendData = EcoUtil.objDeepCopy(this.ecoEventData);
                let _currentNode = this.$refs.treeRef.getCurrentNode();
                this.$refs.treeRef.append(_appendData,_currentNode);
                this.$refs.treeRef.getNode(_currentNode.id).isLeaf = false;
                this.$refs.treeRef.getNode(_currentNode.id).data.haveSub = true;

           }else if(obj && obj.action == 'sortNode'){ //排序
                 return;
                let _sortData = EcoUtil.objDeepCopy(this.ecoEventData);
                let _currentNode = this.$refs.treeRef.getCurrentNode();
                this.$refs.treeRef.updateKeyChildren(_currentNode.id,_sortData);
           }else if(obj && obj.action == 'delOrg'){
                return;
                let _delData = EcoUtil.objDeepCopy(this.ecoEventData);
                (_delData).forEach(element => {
                     this.$refs.treeRef.remove(element);
                });
           }else if(obj && obj.action == 'reloadNodeList'){ //编辑
                let _data = EcoUtil.objDeepCopy(this.ecoEventData);
                (_data).forEach((item)=>{
                    item.type = 'group';
                    item.tid = 'group'+item.id;
                })

                let _currentNode = this.$refs.treeRef.getCurrentNode();
                this.$refs.treeRef.updateKeyChildren(_currentNode.tid,_data);
           }
        },
  },
  watch: {
        'ecoEvent'(newvalue,oldvalue){ //监听设置 里面发生的变化
            this.watchEventAction(newvalue);
        }, 
  },
  destroyed(){
        delete window.treeKvVm;
  }
}
</script>
<style scope>
.basicKvIndex{
  position:fixed;
  top:0px;
  left:0px;
  bottom:0px;
  right:0px;
  background-color: rgb(245, 245, 245);
}

.basicKvIndex .treeKvAside{
   position:absolute;
   top:2%;
   left:20px;
   bottom:2%;
   width:270px;
   background-color: #fff;
}

.basicKvIndex .treeKvAside .toolBar{
    padding:10px 10px 10px 10px;
    background-color:#fff;
    border-bottom:1px solid #ddd;
    
}


.basicKvIndex .treeKvAside .title{
    border-left: 5px solid #409eff;
    font-size: 16px;
    padding-left: 10px;
}

.basicKvIndex .treeKvAside .btn{
    font-size: 14px;
}

.basicKvIndex .treeKvAside .treeContent{
    position:absolute;
    top:60px;
    bottom:0px;
    left:0px;
    right:0px;
}

.basicKvIndex .el-tree-node__content{
    padding:4px 0px;
}




.basicKvIndex .treeKvAside .treeContent .type-name{
   font-size: 14px;
}

.basicKvIndex .treeKvAside .treeContent  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}



.basicKvIndex .treeKvMain{
  position:absolute;
  left:305px;
  right:20px;
  top:2%;
  bottom:2%;
  background-color:#fff ;
}




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
