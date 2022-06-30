<template>
    <div class="proMember">
        <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>

        <div  class="toolbar">
            <el-button v-show='initRole.PAGE_PANEL.permission.PLAN' type="primary" @click="addFunc">计划编制</el-button>
        </div>

        <eco-content top="50px" bottom="0px" style="padding:0px 15px;">
            <gantt ref="gantt" :gantt-option="ganttOption" @load="load"></gantt>   
        </eco-content>

    </div>
</template>
<script>

import {getProNodePlanList} from '../../service/service'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {EcoUtil} from '@/components/util/main.js'
import {EcoDate} from '@/components/date/main.js'
import {mapState} from 'vuex'

import {sysEnv} from '../../config/env.js'
import gantt from './gantt'

  export default {
      components:{
          ecoContent,
          gantt,
          ecoLoading
      },
      data(){
          return{
                projectId:null,
                ganttOption: {
                    style: 'width:100%;height:100%',
                    visable: true,
                    readOnly: false,
                    showSummary: true,
                    allowDragDrop: false,
                    autoSyncSummary: false,
                    showGanttView: true,
                    showTableView: true,
                    showLinkLines: false,
                    columns: [
                        { header: '序号', field: 'ID', width: 50, cellCls: 'mini-indexcolumn', align: 'center', allowDrag: true },
                        { header: '任务名称', field: 'taskName', width: 250, name: 'taskName'},
                        { header: '责任人', field: 'responsibleUserName', width: 70, name: 'responsibleUserName'},
                        { header: '状态',field: 'status',width: 80,name: 'status'},
                        { header: '计划开始日期', field: 'planStartDate', width: 120,name: 'planStartDate'},
                        { header: '计划完成日期', field: 'planCompleteDate', width: 120,name: 'planCompleteDate'},
                        { header: '实际完成日期', field: 'actualCompleteDate', width: 120,name: 'actualCompleteDate'},
                    ],
                    onTaskdblclick: this.onTaskdblclick,
                    onTaskclick: this.onTaskclick,
                    baseData: {}
                },
                statusMap:{
                    'processing':'进行中',
                    'complete':'已完成'
                }
          }
      },
      
      created(){
            this.projectId = this.$route.params.proId;

            window.proPlanGantt = this;
            this.addMonitor(); //添加监听
      },
      mounted(){
         
      },
      computed:{
           ...mapState(['initRole'])
      },
      methods: {

        addMonitor(){
            let callBackDialogFunc = function(obj){
                if(obj && (obj.action == 'proPlanProcessCallBack')){ 
                    window.proPlanGantt.load();
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'proPlanGantt');
        },

        addFunc(){
            this.$router.push({name:'proPlanIndex'});
        },

        load() {
            this.$refs.ecoLoadingRef.open();
            getProNodePlanList(this.projectId).then((response)=>{
                    this.$refs.ecoLoadingRef.close();

                    let _nodeArray = [];
                    let _planArray = [];

                    response.data.node.map((item)=>{
                        item.date = EcoDate.convertDateTimeFromString(item.planCompleteDate+" 12:00:00");
                        item.text = item.node;
                        _nodeArray.push(item);
                    })

                    response.data.plan.map((item)=>{
                        item.UID = item.id;
                        item.Start = item.planStartDate;
                        item.Finish = item.planCompleteDate;
                        item.Name = item.taskName;
                        item.status = this.statusMap[item.status];
                        _planArray.push(item);
                    })

                    let sortFunc = function (x, y) {//比较函数
                        if (x.planCompleteDate < y.planCompleteDate) {
                                return -1;
                        } else if (x.planCompleteDate > y.planCompleteDate) {
                                return 1;
                        } else {
                                return 0;
                        }
                    }

                    _planArray.sort(sortFunc);
                    this.$refs.gantt.loadData(_planArray);
                    this.$refs.gantt.setTimeLines(_nodeArray);
                })
        },

        onTaskdblclick(data){
            let _id = data.task.id;
            if(sysEnv == 1){
                let url = '/project/index.html#/proPlanProcess/'+_id;
                EcoUtil.getSysvm().openDialog('任务反馈',url,800,500,'12vh');
            }else{
                this.$router.push({name:'proPlanProcess',params:{id:_id}})
            }
           
        },

        onTaskclick(){
           
        }
        
      }
  }
</script>

<style scoped>

.proMember{
    padding:0px 15px 20px 15px;
    background-color:#fff;
}

.proMember .toolbar{
    margin-top: 10px;
    margin-bottom:10px;
}

.proMember .editSpan{
    cursor: pointer;
    color:#409eff;
}

.proMember .searchBox{
      font-size: 14px;
      padding: 10px 20px;
      line-height: 30px;
      overflow-y:auto;
      background-color: #fafafa;
}

.proMember .itemInput{
    display: inline-block;
    width: 120px;
    margin-right: 10px;
}

</style>
