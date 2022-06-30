<template>
    <div class="treeKvIndex webLayout">
        <div class="treeKvAside">

            <el-row  class="toolBar">
                    <el-col :span="7">
                        <eco-tool-title style="line-height: 38px;" :title="'数据集'"></eco-tool-title>
                    </el-col>

                    <el-col :span="17" style="text-align:right;padding-right:10px;">
                            <el-button type="text" size="medium" @click="addFunc" :title="'添加'"><i class="icon iconfont icontianjia"></i></el-button>
                            <el-button type="text" size="medium" @click="sortFunc" :title="'排序'"><i class="icon iconfont iconpaixu"></i></el-button>
                            &nbsp;

                            <el-dropdown  size="medium" placement="top" trigger="click" v-show="clickParentId == -1">
                                <span class="el-dropdown-link">
                                    <el-button type="text" size="medium" ><i class="icon iconfont iconshenglvehao" :title="'操作'"></i></el-button>
                                </span>
                                <el-dropdown-menu slot="dropdown" >
                                        <el-dropdown-item @click.native="editFunc" ><i class="icon iconfont iconbianji"></i>&nbsp;编辑</el-dropdown-item>
                                        <el-dropdown-item @click.native="delFunc"><i class="icon iconfont iconchushaixuanxiang"></i>&nbsp;删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>

                    </el-col>
            </el-row>
           
            <div class="treeContent">
              <el-scrollbar style="height:100%" >
                      <el-tree
                          :data="treeData"
                          :props="defaultProps"
                          highlight-current
                          node-key="id"
                          :default-expanded-keys="expandedKeys"
                          :load="loadNode"
                          @node-click="handleNodeClick"
                          lazy
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
import {getTreeKvListByParentId,updateTreeKv} from '../../service/service.js'
import {mapState,mapMutations} from 'vuex'
import {sysEnv} from '../../config/env.js'
import EcoUtil from '@/components/util/main.js'

export default{
  name:'treeKvIndex',
  components:{
      ecoToolTitle
  },
  data(){
    return {
     
      treeData:[],
      expandedKeys:[],
      defaultProps: {
            label(data,node){
                return data.i18nKey|| data.text;
            },

            isLeaf(data,node){
                return !data.haveSub ;
            }
      },

      listAction:'create-enabled',
      clickParentId:null,

    }
  },
  computed:{
          ...mapState([
              'ecoEventData',
              'ecoEvent'
          ]),
  },
  mounted(){
      this.getTreeKvListFunc(-1);
      window.treeKvVm = this; //添加监听
      this.addMonitor(); //添加监听
  },
  methods: {
        addMonitor(){
            let callBackDialogFunc = function(obj){
                if(obj && (obj.action == 'treeKvAddCallBack-root')){ 
                    window.treeKvVm.addCBFunc(obj.data);
                }else if(obj && (obj.action == 'treeKvEidtCallBack-root')){
                    window.treeKvVm.editCBFunc(obj.data);
                }else if(obj && (obj.action == 'treeKvSortCallBack-root')){
                    window.treeKvVm.sortCBFunc(obj.data);
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'treeKvIndex');
        },

        getTreeKvListFunc(_parentId){
             getTreeKvListByParentId(_parentId,this.listAction).then((response) => {
                let dataList = response.data;
                this.treeData = dataList;
                let _that = this;
                setTimeout(()=>{
                        if(this.treeData.length > 0){
                            _that.$refs.treeRef.setCurrentKey(this.treeData[0].id);
                            _that.$router.push({name:'treeKvDet',params:{parentId:this.treeData[0].id}});
                            this.clickParentId = this.treeData[0].parentId;
                        }
                 },100)
             })
        },
         
        loadNode(node, resolve) {
              if(node.level == 0){
                  return resolve([]);
              }
              let _parentId = node.data.id?node.data.id:-1;
              getTreeKvListByParentId(_parentId,this.listAction).then((response) => {
                  let dataList = response.data;
             
                  let _that = this;
                  setTimeout(() => {
                        resolve(dataList);
                  },100);

              });
        },

        handleNodeClick(data,node) {
            this.clickParentId = data.parentId;
            this.$router.push({name:'treeKvDet',params:{parentId:data.id}});
        },

        //添加类别 root层级
        addFunc(){
               if(sysEnv == 1){
                    let url = '/manage/index.html#/treeKvAdd/-1';
                    EcoUtil.getSysvm().openDialog('添加数据集',url,600,450,'12vh');
               }else{
                    this.$router.push({name:'treeKvAdd',params:{parentId:'-1'}});
               }
        },

        addCBFunc(data){
            let _data = EcoUtil.objDeepCopy(data.queryObj);
            _data.text = _data.i18nKey|| _data.text;
            this.treeData.push(_data);
        },

        editFunc(){
            let _currentNode = this.$refs.treeRef.getCurrentNode();
            let _id = _currentNode.id;
            if(sysEnv == 1){
                    let url = '/manage/index.html#/treeKvEdit/'+_id;
                    EcoUtil.getSysvm().openDialog('修改数据',url,600,470,'12vh');
            }else{
                    this.$router.push({name:'treeKvEdit',params:{id:_id}});
            }
        },

        editCBFunc(data){
            let _data = EcoUtil.objDeepCopy(data.queryObj);
            let node = this.$refs.treeRef.getNode(_data.id);
            node.data = _data
        },

        delFunc(){
            let _currentNode = this.$refs.treeRef.getCurrentNode();
            let _id = _currentNode.id;

             let _data = EcoUtil.objDeepCopy(_currentNode);
            _data.enableInCreate = false;
            _data.enableInUpdate = false;
            _data.enableInSelect = true;
            updateTreeKv(_data).then((response)=>{
                this.getTreeKvListFunc(-1);
            });
        },

        sortFunc(){
            if(sysEnv == 1){
                let url = '/manage/index.html#/treeKvSort/-1';
                EcoUtil.getSysvm().openDialog('数据排序',url,600,500,'8vh');
            }else{
                this.$router.push({name:'treeKvSort',params:{parentId:-1}});
            } 
        },

        sortCBFunc(data){
            this.getTreeKvListFunc(-1);
        },

      

       


       watchEventAction(obj){
           if(obj && obj.action == "addNode"){
                
                let _appendData = EcoUtil.objDeepCopy(this.ecoEventData);
                let _currentNode = this.$refs.treeRef.getCurrentNode();
                this.$refs.treeRef.append(_appendData,_currentNode);

                this.$refs.treeRef.getNode(_currentNode.id).isLeaf = false;
                this.$refs.treeRef.getNode(_currentNode.id).data.haveSub = true;

           }else if(obj && obj.action == 'sortNode'){ //排序
                
                let _sortData = EcoUtil.objDeepCopy(this.ecoEventData);
             
                let _currentNode = this.$refs.treeRef.getCurrentNode();
                this.$refs.treeRef.updateKeyChildren(_currentNode.id,_sortData);

           }else if(obj && obj.action == 'delOrg'){

                let _delData = EcoUtil.objDeepCopy(this.ecoEventData);
                (_delData).forEach(element => {
                     this.$refs.treeRef.remove(element);
                });

           }else if(obj && obj.action == 'editNode'){ //编辑

                let _sortData = EcoUtil.objDeepCopy(this.ecoEventData);
             

                let _currentNode = this.$refs.treeRef.getCurrentNode();
                this.$refs.treeRef.updateKeyChildren(_currentNode.id,_sortData);
           
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
.treeKvIndex{
  position:fixed;
  top:0px;
  left:0px;
  bottom:0px;
  right:0px;
  background-color: rgb(245, 245, 245);
}

.treeKvIndex .treeKvAside{
   position:absolute;
   top:2%;
   left:20px;
   bottom:2%;
   width:270px;
   background-color: #fff;
}

.treeKvIndex .treeKvAside .toolBar{
    padding:10px 10px 10px 10px;
    background-color:#fff;
    border-bottom:1px solid #ddd;
    
}


.treeKvIndex .treeKvAside .title{
    border-left: 5px solid #409eff;
    font-size: 16px;
    padding-left: 10px;
}

.treeKvIndex .treeKvAside .btn{
    font-size: 14px;
}

.treeKvIndex .treeKvAside .treeContent{
    position:absolute;
    top:60px;
    bottom:0px;
    left:0px;
    right:0px;
}

.treeKvIndex .el-tree-node__content{
    padding:4px 0px;
}




.treeKvIndex .treeKvAside .treeContent .type-name{
   font-size: 14px;
}

.treeKvIndex .treeKvAside .treeContent  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}



.treeKvIndex .treeKvMain{
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
