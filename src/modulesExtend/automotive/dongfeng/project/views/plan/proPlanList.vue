<template>
    <eco-content top="0px" bottom="0px" class="proNodeList">
        <eco-content top="0px" height="60px" type="tool">
                    <el-row  class="toolbar">
                        <el-col :span="6">
                            <eco-tool-title style="line-height: 38px;" title="项目计划"></eco-tool-title>
                        </el-col>

                        <el-col :span="18" style="text-align:right;padding-right:10px;">
                            <el-button type="text" size="medium" @click="addFunc"><i class="icon iconfont icontianjia"></i> 添加计划</el-button>
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
                    prop="taskName"
                    show-overflow-tooltip
                    label="任务名称"
                >
                    <template slot-scope="scope" >
                            <span >{{scope.row.taskName}}</span> 
                    </template>
              </el-table-column>

              <el-table-column
                    prop="responsibleUserId"
                    show-overflow-tooltip
                    label="责任人"
                    width="80"
                >
                     <template slot-scope="scope" >
                            <span >{{scope.row.responsibleUserName}}</span> 
                    </template>
                    
              </el-table-column>

              <el-table-column
                    prop="planStartDate"
                    show-overflow-tooltip
                    label="计划开始日期"
                    width="110"
                >
              </el-table-column>

              <el-table-column
                    prop="planCompleteDate"
                    show-overflow-tooltip
                    label="计划完成日期"
                    width="110"
                >
              </el-table-column>

              <el-table-column
                    prop="actualCompleteDate"
                    show-overflow-tooltip
                    label="实际完成日期"
                    width="110"
                >
              </el-table-column>

              <el-table-column
                    prop="status"
                    show-overflow-tooltip
                    label="状态"
                    width="80"
                >
                    <template slot-scope="scope">
                        <span>{{statusMap[scope.row.status]}}</span>
                    </template>

              </el-table-column>

               <el-table-column
                    label="操作"
                    width="120"
                    >
                    <template slot-scope="scope" >
                        <div>
                            <span class="signSpan" @click="editFunc(scope.row.id)" >编辑</span>
                            <span class="split" ></span>
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
import {getProNodePlanList,deleteProPlan} from '../../service/service.js'
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
          dataList:[],
          statusMap:{
              'processing':'进行中',
              'complete':'已完成'
          }
      }
  },

  created(){
      this.projectId = this.$route.params.proId;
      this.getProNodePlanListFunc();
  },
  mounted(){
      
  },
  methods: {
        ...mapMutations([
            'SET_ECO_EVENT',
            'SET_ECO_EVENT_DATA'
        ]),

        getProNodePlanListFunc(){
                getProNodePlanList(this.projectId).then((response) => {
                    let _dataList = response.data.plan;
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
            this.$router.push({name:'addProPlan'});
        },

        editFunc(id){
            this.$router.push({ name: 'editProPlan', params: {id:id}});
        },

        delFunc(data){
            let _id = data.id;
            let _that  = this;
            let confirmYesFunc = function(){
                  deleteProPlan(_id).then((response)=>{
                        _that.$message({type: 'success',message: '操作成功'});
                        _that.getProNodePlanListFunc();

                        _that.SET_ECO_EVENT({action:'delPlan',key: EcoUtil.getUID()});
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
