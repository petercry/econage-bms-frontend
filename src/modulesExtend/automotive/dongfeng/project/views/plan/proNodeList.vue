<template>
    <eco-content top="0px" bottom="0px" class="proNodeList">
        <eco-content top="0px" height="60px" type="tool">
                    <el-row  class="toolbar">
                        <el-col :span="6">
                            <eco-tool-title style="line-height: 38px;" title="项目节点"></eco-tool-title>
                        </el-col>

                        <el-col :span="18" style="text-align:right;padding-right:10px;">
                            <el-button type="text" size="medium" @click="addFunc"><i class="icon iconfont icontianjia"></i> 添加节点</el-button>
                            <!-- <el-button type="text" size="medium" @click="sortFunc"><i class="icon iconfont iconpaixu"></i> 排序</el-button> -->
                        </el-col>
                    </el-row>
        </eco-content>


      <ecoContent top="60px" bottom="0" style="padding:15px;">
            <el-table
                  :data="dataList"
                  highlight-current-row
                  stripe
                  class="styleTableDefault"
                  style="width: 100%"
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
                    prop="node"
                    show-overflow-tooltip
                    label="节点名称"
                >
                    <template slot-scope="scope" >
                            <span >{{scope.row.node}}</span> 
                    </template>
              </el-table-column>

              <el-table-column
                    prop="planCompleteDate"
                    show-overflow-tooltip
                    label="计划完成时间"
                    width="200"
                >
              </el-table-column>

               <el-table-column
                    label="操作"
                    width="120"
                    >
                    <template slot-scope="scope" >
                        <div>
                            <!-- <span class="signSpan" @click="editFunc(scope.row.id)" >编辑</span>
                            <span class="split" ></span> -->
                            <span  class="pointerClass" @click="delFunc(scope.row)"  style="color:#f56c6c;" >删除</span> 
                        </div>
                    </template>
                </el-table-column>

        </el-table>
      </ecoContent>
    </eco-content>
</template>
<script>

import ecoContent from '@/components/pageAb/ecoContent.vue'
import {getProNodePlanList,deleteProNode} from '../../service/service.js'
import EcoUtil from '@/components/util/main.js'
import {mapMutations} from 'vuex'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {sysEnv} from '../../config/env.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'

export default{
    name:'proNodeList',
    components:{
        ecoContent,
        ecoToolTitle
    },
    data(){
      return {

          projectId:null,

          parentId:null,
          dataList:[],
          currentRow:null,
          listAction:'select-enabled',
          viewEnabled:false
      }
  },

  created(){
      this.projectId = this.$route.params.proId;
      this.getProNodePlanListFunc();

      window.ecoFrameVm = this; //添加监听
      this.addMonitor(); //添加监听
  },
  mounted(){
      
  },
  methods: {
    ...mapMutations([
            'SET_ECO_EVENT',
            'SET_ECO_EVENT_DATA'
    ]),

    addMonitor(){
          let callBackDialogFunc = function(obj){
              if(obj && (obj.action == 'treeKvAddCallBack')){ 
                  window.ecoFrameVm.addCBFunc(obj.data);
              }else if(obj && (obj.action == 'treeKvEditCallBack')){
                  window.ecoFrameVm.editCBFunc(obj.data);
              }else if(obj && (obj.action == 'treeKvSortCallBack')){
                  window.ecoFrameVm.sortCBFunc(obj.data);
              }
          }

          EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'proNodeList');
    },

        getProNodePlanListFunc(){
                getProNodePlanList(this.projectId).then((response) => {
                        let _dataList = response.data.node;

                        let sortFunc = function (x, y) {//比较函数
                            if (x.planCompleteDate < y.planCompleteDate) {
                                    return -1;
                            } else if (x.planCompleteDate > y.planCompleteDate) {
                                    return 1;
                            } else {
                                    return 0;
                            }
                        }
                        _dataList.sort(sortFunc);

                        this.dataList = _dataList;
                });
        },

    addFunc(){
       
        this.$router.push({name:'addProNode'});
        
    },

    addCBFunc(data){
          this.dataList.push(data.queryObj);
          this.SET_ECO_EVENT({action:'addNode',key: EcoUtil.getUID()});
          this.SET_ECO_EVENT_DATA(EcoUtil.objDeepCopy(data.queryObj));
    },

    sortFunc(){
        if(sysEnv == 1){
              let url = '/manage/index.html#/treeKvSort/'+this.parentId;
              EcoUtil.getSysvm().openDialog('数据排序',url,600,400,'12vh');
        }else{
              this.$router.push({name:'treeKvSort',params:{parentId:this.parentId}});
        }       
    },

        sortCBFunc(data){
                this.reloadAndDoEventAction('sortNode');
        },

        editFunc(id){
            if(sysEnv == 1){
                let url = '/manage/index.html#/treeKvEdit/'+id;
                EcoUtil.getSysvm().openDialog('修改数据',url,600,470,'12vh');
            }else{
                this.$router.push({name:'treeKvEdit',params:{id:id}});
            }
        },

        editCBFunc(data){
            this.reloadAndDoEventAction('editNode');
        },

        delFunc(data){
            let _id = data.id;
            let _that  = this;
            let confirmYesFunc = function(){
                  deleteProNode(_id).then((response)=>{
                        _that.$message({type: 'success',message: '操作成功'});
                        _that.getProNodePlanListFunc();

                        _that.SET_ECO_EVENT({action:'delNode',key: EcoUtil.getUID()});
                        _that.SET_ECO_EVENT_DATA({id:_id});
                  }).catch((error)=>{});
              }

              EcoMessageBox.confirm('确定删除该节点 ？','提示',{
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
              },confirmYesFunc);
        }

  
  },
  watch: {
      
  },
  destroyed(){
      delete window.ecoFrameVm;
  }
}
</script>
<style scope>
.proNodeList .toolbar{
    padding:10px 10px;
    background-color:#fff;
    border-bottom:1px solid #ddd;
}

.proNodeList .blue{
    color:#409EFF;
}

.proNodeList .red{
    color:#f56c6c;
}

.proNodeList  .signSpan{
    cursor: pointer;
    color:#409EFF;
}

.proNodeList .disableSpan{
    color:#ccc;
}
</style>
