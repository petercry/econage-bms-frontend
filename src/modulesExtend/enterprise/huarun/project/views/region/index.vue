<template>
    <div class="treeKvIndex webLayout">
        <div class="treeKvAside">

            <el-row  class="toolBar">
                    <el-col :span="24">
                        <eco-tool-title style="line-height: 38px;" :title="'区域划分'"></eco-tool-title>
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
                          @node-click="handleNodeClick"
                          ref="treeRef"
                      > 
                        <div class="custom-tree-node"   slot-scope="{ node, data }">
                            <span class="type-name">{{ getKVName(node.label, 'crp_area', node.level )}}</span>
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
import {getRegionVO,getRegionList} from '../../service/service.js'
import {mapState,mapMutations} from 'vuex'
import EcoUtil from '@/components/util/main.js'
import {EcoKVUtil} from '@/components/util/kv.js'

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
                    return data.typeName || data.area;
            },
            children:'list',
            isLeaf(data,node){
                    return data.children ;
            }
        },
        kvMap:{
            crp_area:[] //省份
        }
    }
  },
  computed:{
          ...mapState([
              'ecoEventData',
              'ecoEvent'
          ]),
  },
  mounted(){
        this.getTreeKvListFunc();
        EcoKVUtil.getEnumSelectEnabledFunc(this.kvMap);

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

        getKVName(id,array,level){
            if(level == 1){
                return id;
            }else{
            
                return EcoKVUtil.getCategoryNameMutile(this.kvMap[array],[id],'id','text');
            }
        },

        getTreeKvListFunc(_parentId){
            getRegionVO().then((response) => {
                    let _dataList = [];
                    (response.data).map((item)=>{
                        item.id = item.type;
                        _dataList.push(item);
                    })
                    this.treeData = _dataList;
                    let _that = this;
                    setTimeout(()=>{
                            if(this.treeData.length > 0){
                                _that.$refs.treeRef.setCurrentKey(this.treeData[0].id);
                                _that.$router.push({name:'regionDet',params:{region:this.treeData[0].id}});
                            }
                    },100)
            })
        },

        updateKeyChildrenFunc(region,id){
                let _params = {};
                _params.page = 1;
                _params.rows = 99999;
                _params.sort = 'createDate';
                _params.order = 'asc';
                _params.region = region;
                getRegionList(_params).then((response) => {
                        let _data = response.data.rows;
                        this.$refs.treeRef.updateKeyChildren(region,_data);
                        
                        if(this.$route.params.area){
                            console.log(id);
                            this.$refs.treeRef.setCurrentKey(id);
                        }else{

                        }
                });
        },

        handleNodeClick(data,node) {
            this.$router.push({name:'regionDet',params:{region:encodeURIComponent(data.type||data.region),area:encodeURIComponent(data.area) }});
        },

        watchEventAction(obj){
           if(obj && obj.action == "addNode"){

                let _appendData = EcoUtil.objDeepCopy(this.ecoEventData);
                let _regionNode = this.$refs.treeRef.getNode(_appendData.region);
                this.$refs.treeRef.append(_appendData,_regionNode);
            
           }else if(obj && obj.action == 'sortNode'){ //排序
                let _sortData = EcoUtil.objDeepCopy(this.ecoEventData);
                let _currentNode = this.$refs.treeRef.getCurrentNode();
                this.$refs.treeRef.updateKeyChildren(_currentNode.id,_sortData);
           }else if(obj && obj.action == 'delNode'){

                let _delData = EcoUtil.objDeepCopy(this.ecoEventData);
                let _currentNode = this.$refs.treeRef.getCurrentNode();
                if(_currentNode.id == _delData.id){ //原来点击省份
                    this.$router.push({name:'regionDet',params:{region:encodeURIComponent(_delData.region),area:'undefined'}});
                }
                this.$refs.treeRef.remove(_delData);
                this.$refs.treeRef.setCurrentKey(_delData.region);
           }else if(obj && obj.action == 'editNode'){ //编辑
                let _data = EcoUtil.objDeepCopy(this.ecoEventData);

              
                if(_data.queryObj.region != _data.oldRegion){
                    
                    this.$refs.treeRef.remove(_data.queryObj);
                    this.updateKeyChildrenFunc(_data.queryObj.region,_data.queryObj.id);
                    this.updateKeyChildrenFunc(_data.oldRegion,_data.queryObj.id);
                }
                
                // let _currentNode = this.$refs.treeRef.getCurrentNode();
                // this.$refs.treeRef.updateKeyChildren(_currentNode.id,_sortData);

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
