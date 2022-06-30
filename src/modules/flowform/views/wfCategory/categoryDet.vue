<template>

    <eco-content top="0px" bottom="0px" class="wfCategoryDet">
    <eco-content top="0px" height="60px" type="tool">
                <el-row  class="toolbar">
                    <el-col :span="18">
                        <eco-tool-title style="line-height: 38px;" :title="nodeObj.name"></eco-tool-title>
                    </el-col>
                    <el-col :span="6" style="text-align:right;padding-right:10px;">
                          <!-- <el-checkbox v-model="viewEnabled" @change="changeAction">全部</el-checkbox>
                          &nbsp;&nbsp; -->
                          <el-button type="text" size="medium" @click="addFunc"><i class="icon iconfont iconjia"></i> 添加数据</el-button>
                          <el-button type="text" size="medium" @click="sortFunc"><i class="icon iconfont iconpaixu"></i> 排序</el-button>
                    </el-col>
                </el-row>
    </eco-content>


      <ecoContent top="60px" bottom="0" style="padding:15px;">
            <el-table
                  :data="dataList"
                  highlight-current-row
                  stripe
                  class="flowlist"
                  style="width: 100%;min-width:auto;"
                  size="mini" 
                  height="100%"
              >

              <el-table-column
                  type="index"
                  min-width="40"
                  max-width="50"
                >
              </el-table-column>

              <el-table-column
                    prop="name"
                    show-overflow-tooltip
                    label="名称"
                >
                    <template slot-scope="scope" >
                            <span >{{scope.row.name}}</span> 
                    </template>
              </el-table-column>

              <el-table-column
                    prop="code"
                    show-overflow-tooltip
                    label="编号"
                    width="200"
                >
              </el-table-column>

              <el-table-column
                    prop="comments"
                    show-overflow-tooltip
                    label="备注"
                    width="200"
                >
              </el-table-column>

              <el-table-column
                    show-overflow-tooltip
                    label="状态"
                    width="100"
                >
                     <template slot-scope="scope" >
                         <span v-if="scope.row.isActiveFlag == 'y'" class="blue2">有效</span>
                         <span v-else class="red2">失效</span>
                     </template>
              </el-table-column>

               <el-table-column
                    label="操作"
                    width="120"
                    >
                    <template slot-scope="scope" >
                        <div>

                            <span class="signSpan" @click="editFunc(scope.row.id)" v-if="scope.row.isActiveFlag == 'y'">编辑</span>
                            <span class="split" v-if="scope.row.isActiveFlag == 'y'"></span>
                            <span  class="pointerClass" @click="delFuncConfirm(scope.row)"  style="color:#f56c6c;" v-if="scope.row.isActiveFlag == 'y'">删除</span> 
                            <span  class="pointerClass" @click="recoveryFunc(scope.row)"  style="color:#67c23a;" v-if="false && scope.row.isActiveFlag == 'n'">恢复</span> 
                        </div>
                    </template>
                </el-table-column>

        </el-table>
      </ecoContent>
    </eco-content>
</template>
<script>


import ecoContent from '@/components/pageAb/ecoContent.vue'
import {getWFGroupList,getCategorySingleById,updateWFCategory,invalidWFCategory} from '../../service/service.js'
import EcoUtil from '@/components/util/main.js'
import {mapMutations} from 'vuex'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {sysEnv} from '../../config/env.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'


export default{
    name:'wfCategoryDet',
    components:{
        ecoContent,
        ecoToolTitle
    },
    data(){
      return {
          parentId:null,
          dataList:[],
          currentRow:null,
          nodeObj:{},
          listAction:'select-enabled',
          viewEnabled:false
      }
    },
  mounted(){
      this.init();
      window.ecoFrameVm = this; //添加监听
      this.addMonitor(); //添加监听
  },
  methods: {
      ...mapMutations([
            'SET_ECO_EVENT',
            'SET_ECO_EVENT_DATA'
    ]),

    addMonitor(){
          let callBackDialogFunc = function(obj){
              if(obj && (obj.action == 'wfCategoryAddCallBack')){ 
                  window.ecoFrameVm.addCBFunc(obj.data);
              }else if(obj && (obj.action == 'wfCategoryEditCallBack')){
                  window.ecoFrameVm.editCBFunc(obj.data);
              }else if(obj && (obj.action == 'wfCategorySortCallBack')){
                  window.ecoFrameVm.sortCBFunc(obj.data);
              }
          }

          EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'wfCategoryDet');
    },

    init(){
        this.parentId = this.$route.params.parentId;
        this.getWFGroupListFunc();
        this.getCategorySingleByIdFunc();
    },


    getWFGroupListFunc(){
        getWFGroupList(this.parentId).then((response) => {
                let _dataList = [];
                (response.data).forEach((item)=>{
                    if(item.isActiveFlag == 'y'){
                        _dataList.push(item);
                    }
                })
                this.dataList = _dataList;
        });
    },

    getCategorySingleByIdFunc(){
        getCategorySingleById(this.parentId).then((response) => {
              this.nodeObj = response.data;
        });
    },

    addFunc(){
       if(sysEnv == 1){
              let url = '/flowform/index.html#/categoryAdd/'+this.parentId;
              EcoUtil.getSysvm().openDialog('添加数据',url,600,390,'12vh');
        }else{
              this.$router.push({name:'categoryAdd',params:{parentId:this.parentId}});
        }
    },

    addCBFunc(data){
          this.dataList.push(data.queryObj);
          return ;
          this.SET_ECO_EVENT({action:'addNode',key: EcoUtil.getUID()});
          this.SET_ECO_EVENT_DATA(EcoUtil.objDeepCopy(data.queryObj));
    },

    sortFunc(){
        if(sysEnv == 1){
              let url = '/flowform/index.html#/categorySort/'+this.parentId;
              EcoUtil.getSysvm().openDialog("'"+this.nodeObj.name+"' 子类别排序",url,600,400,'12vh');
        }else{
              this.$router.push({name:'categorySort',params:{parentId:this.parentId}});
        }       
    },

    sortCBFunc(data){
            this.reloadAndDoEventAction('sortNode');
    },

    editFunc(id){
        if(sysEnv == 1){
              let url = '/flowform/index.html#/categoryEdit/'+id;
              EcoUtil.getSysvm().openDialog('修改数据',url,600,390,'12vh');
        }else{
              this.$router.push({name:'categoryEdit',params:{id:id}});
        }
    },

    editCBFunc(data){
        this.reloadAndDoEventAction('editNode');
    },


    delFuncConfirm(data){
        let that  = this;
        let confirmYesFunc = function(){
            that.delFunc(data);
        }
        let options = {
                type: 'warning',
                lockScroll:false
        }
        EcoMessageBox.confirm('确认要删除子类别 '+data.name+' 吗？','提示',options,confirmYesFunc);
    },

    delFunc(data){
        let _data = EcoUtil.objDeepCopy(data);
        invalidWFCategory(_data.id).then((response)=>{
            this.reloadAndDoEventAction('editNode');
        });
    },

    recoveryFuncConfirm(data){
        let that  = this;
        let confirmYesFunc = function(){
            that.recoveryFunc(data);
        }
        let options = {
            type: 'warning',
            lockScroll:false
        }
        EcoMessageBox.confirm('确认恢复数据？','提示',options,confirmYesFunc);
    },

    recoveryFunc(data){
            let _data = EcoUtil.objDeepCopy(data);
            _data.isActiveFlag = 'y';
            updateWFCategory(_data).then((response)=>{
                this.reloadAndDoEventAction('editNode');
            });
    },

    reloadAndDoEventAction(action){
        this.getWFGroupListFunc();
    },

    changeAction(val){
        this.getWFGroupListFunc();
    },
  
  },
  watch: {
      $route(){
          this.init();
      }
  },
  destroyed(){
      delete window.ecoFrameVm;
  }
}
</script>
<style scope>
.wfCategoryDet .toolbar{
    padding:10px 10px;
    background-color:#fff;
    border-bottom:1px solid #ddd;
}

.wfCategoryDet .blue2{
    color:#409EFF;
}

.wfCategoryDet .red2{
    color:#f56c6c;
}

.wfCategoryDet  .signSpan{
    cursor: pointer;
    color:#409EFF;
}

.wfCategoryDet .disableSpan{
    color:#ccc;
}

.wfCategoryDet  .split{
    border-right: 1px solid #ddd;
    margin: 0 10px 0 5px;
}
</style>
