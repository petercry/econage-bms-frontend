<template>
  <div class="planGantt">
    <eco-content top="0px" height="60px" type="tool" style="border-bottom:1px solid #ddd;overflow:hidden;">
      <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
      <el-row style="padding:12px 10px;background-color:#fff;">
        <el-col :span="24" >
            <eco-tool-title style="line-height: 34px;margin-right:50px;" :title="'计划任务'"></eco-tool-title>
            <el-button plain class="plainBtn toolBtn"  @click.native="goPlanPage"><i class="icon el-icon-document-add"></i>&nbsp;计划编制</el-button>
            <el-button plain @click.native="showExportProjectDialog" class="plainBtn toolBtn"><i class="icon el-icon-upload2"></i>&nbsp;导 入</el-button>
                           

            <el-button plain  class="plainBtn toolBtn" @click.native="exportPlan"><i class="icon el-icon-download"></i>&nbsp;导 出</el-button>

        </el-col>
      </el-row>
    </eco-content>
    <eco-content top="61px" bottom="95px" ref="content"  style="padding:10px 0;background-color:#fff">
      <gantt ref="gantt" :gantt-option="ganttOption" @load="load"></gantt>

    </eco-content>
    <!-- <el-popover
          placement="bottom"
          width="1000px"
          content="这是一段内容,这是一段内容,这是一段内容,这是一段内容12323123。"
          trigger="manual"
          :offset="30"
          v-model="visible"
          >

        </el-popover> -->
    <eco-content bottom="0px" type="tool" style="padding:0px 0;background-color:#fff">
       <el-card class="box-card plandetail">
          <div slot="header" class="clearfix title">
            <span>工作步骤</span>
          </div>
          <div class="deliver-info graph" v-loading="loading">
            <div class="deliver-item">
                <el-scrollbar style="height:auto;">
                    <div class="item pointerClass" v-for="(item,index) in taskInfo.validTaskDelivList" :key="index+'valid'" v-show="taskInfo.validTaskDelivList && item.deliverableEntity" v-bind:class="(item.status == 'faw_pm_task_deliv_status2'? 'green' : '')">
                        <span>{{item.deliverableEntity?item.deliverableEntity.name:""}}</span>
                    </div><div class="item pointerClass gary" v-for="(item,index) in taskInfo.invalidTaskDelivList" :key="index+'invalid'" v-show="taskInfo.invalidTaskDelivList && item.deliverableEntity">
                        <span>{{item.deliverableEntity?item.deliverableEntity.name:""}}</span>
                    </div>
                </el-scrollbar>
            </div>
          </div>
        </el-card>
    </eco-content>
  </div>

</template>

<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import gantt from '../../../../views/components/gantt'
import {EcoUtil} from '@/components/util/main.js'
import {sysEnv} from '../../../../config/env.js'
import { mapActions,mapGetters } from 'vuex'
import {getPlanInfoList,exportPlan} from '../../../../api/plan.js'
import {getTaskInfo} from '../../../../api/task.js'

export default{
    name:'planGantt',
    data(){
      return {
        ganttOption:{
          style:"width:100%;height:100%",
          visable:true,
          readOnly:false,
          showSummary:true,
          allowDragDrop:false,
          autoSyncSummary:false,
          showGanttView:true,
          showTableView:true,
          showLinkLines:false,
          columns:[
            { header:'序号', field: "ID", width: 50, cellCls: "mini-indexcolumn", align: "center", allowDrag: true },
            {
                name: "STATUS_",
                width: 30,
                field:"STATUS_",
                header: ''
            },
            { header:'任务名称', field: "name", width: 250, name: "name"},
             {
                name: "statusName",
                width: 70,
                field:"statusName",
                header: '办理状态'
            },
             {
                name: "publishStatusName",
                width: 70,
                field:"publishStatusName",
                header: '发布状态'
            },

            { header:'计划开始时间', field: "planStartDate", width: 120,name:"planStartDate"},
            { header:'计划完成时间', field: "planEndDate", width: 120,name:"planEndDate"}
          ],
          onTaskdblclick:this.onTaskdblclick,
          onTaskclick:this.onTaskclick,
          baseData:{},
        },
        infoId:null,
        name:"",
        loading:false,
        taskInfo:true,
        visible:false
      }
    },
    components:{
      gantt,
      ecoContent,
      ecoLoading,
      ecoToolTitle
    },
    computed:{
      ...mapGetters(['baseData','getBaseDataTextByKey']),
    },
    created(){
      if(this.$route.params.infoId && this.$route.params.infoId > 0){
        this.infoId = this.$route.params.infoId;
      }
      this.callAction();
      this.initSomeBaseData({array:['faw_pm_work_status','faw_pm_work_publish_status']}).then(res=>{
        this.ganttOption.baseData = this.baseData;
      })
    },
    mounted(){
      this.inintGantt();
    },
    methods: {
      ...mapActions([
        'initSomeBaseData',
      ]),
      callAction(){
        let this_ = this;
        let callBackDialogFunc = function(obj){
          if(obj && (obj.action == 'addPlan') ){
              this_.$message({
                  message: '添加成功！',
                  showClose: true,
                  duration:2000,
                  type: 'success'
              });
              this_.$refs.gantt.addTask(obj.data);
          }
        }
        EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'planGanttVue');

      },
      inintGantt(){

      },
      load(){
        this.$refs.ecoLoadingRef.open();
        getPlanInfoList({infoId:this.infoId,name:this.name}).then((res)=>{
          this.$refs.ecoLoadingRef.close();
          if(res && res.rows.length > 0){
            res.rows.forEach(element => {
              element.UID = element.id;
              element.ParentTaskUID = element.parentId;
              element.Start = element.planStartDate;
              element.Finish = element.planEndDate;
              element.Name = element.name;
              element.statusName = this.getBaseDataTextByKey(element.status,'faw_pm_work_status')
              element.publishStatusName = this.getBaseDataTextByKey(element.publishStatus,'faw_pm_work_publish_status')
            });
          }
          this.$refs.gantt.loadData(res.rows);

        })
      },
      addPlan(){
        if(sysEnv == 0){
            let _width = '900';
            let _height = '600';
            let url = window.location.origin + "/#" +'/addOrUpdatePlan/0/0';
            EcoUtil.getSysvm().openDialog('添加任务',url,_width,_height,'15vh');
        }else{
            let _width = '900';
            let _height = '600';
            let url = '/projectManager/index.html#/addOrUpdatePlan/0/0';
            EcoUtil.getSysvm().openDialog('添加任务',url,_width,_height,'15vh');
        }
      },
      goPlanPage(){
        this.$router.push({name:"planSettingInProjectCard"})
      },
      onTaskclick(e){
        this.loading = true;
        this.$refs.ecoLoadingRef.open();
              this.visible = !this.visible;
        getTaskInfo(e.task.id).then(res=>{
           this.loading = false;

            this.$refs.ecoLoadingRef.close();
            this.taskInfo = res;
        }).catch(e => {
            this.loading = false;
        })

      },
      onTaskdblclick(e){
          EcoUtil.getSysvm().setTempStore("update-record-info",e.task);
          if(e.task.publishStatus == 'faw_pm_work_publish_status1'){

            if(sysEnv == 0){
                let _width = '1024';
                let _height = '800';
                let url = window.location.origin + "/#" +'/addOrUpdatePlan/-1/0';
                EcoUtil.getSysvm().openDialog('计划详情',url,_width,_height,'15vh');
            }else{
                let _width = '1024';
                let _height = '800';
                let url = '/projectManager/index.html#/addOrUpdatePlan/-1/0';
                EcoUtil.getSysvm().openDialog('计划详情',url,_width,_height,'15vh');
            }
          }else{

            if(sysEnv == 0){
                let _width = '1024';
                let _height = '800';
                let url = window.location.origin + "/#" +'/addOrUpdatePlan/-1/0';
                EcoUtil.getSysvm().openDialog('计划详情',url,_width,_height,'15vh');
            }else{
                let _width = '1024';
                let _height = '800';
                let url = '/projectManager/index.html#/addOrUpdatePlan/-1/0';
                EcoUtil.getSysvm().openDialog('计划详情',url,_width,_height,'15vh');
            }
          }

      },
      showExportProjectDialog(){
        if(sysEnv == 0){
            let _width = '500';
            let _height = '400';
            let url = window.location.origin + "/#" +'/exportProject/plan/'+this.infoId;
            EcoUtil.getSysvm().openDialog('导入',url,_width,_height,'15vh');
        }else{
            let _width = '500';
            let _height = '400';
            let url = '/projectManager/index.html#/exportProject/plan/'+this.infoId;
            EcoUtil.getSysvm().openDialog('导入',url,_width,_height,'15vh');
        }
      },
      exportPlan(){
        //window.open('/api/extend/faw/pm/info-exp')
        exportPlan(this.infoId).then((res) => {
            if(res){
                var blob = new Blob([res], {type: "application/vnd.ms-excel"})
                var fileName = "计划列表.xlsx";
                if(window.navigator.msSaveOrOpenBlob){			// IE浏览器下
                    navigator.msSaveBlob(blob, fileName);
                } else {
                    var  link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fileName;
                    link.click();
                    window.URL.revokeObjectURL(link.href);
                }
            }

        })
    },
    },
    watch: {

    }
}

</script>
<style>
.planGantt{
    background: #fff;
    height:100%;
    position: relative;
}
.planGantt .plainBtn{
    border-color: #003b90;
    color: #003b90;
    font-size:14px;
}
.planGantt .toolBtn{
    margin:0 10px;
}
.plandetail{
  height: 90px;
  margin: 0 8px;
  margin-bottom: 10px;
}
.plandetail .el-card__header{
  padding: 5px 10px;
  font-size: 12px;
}
.plandetail .el-card__body{
  padding: 0;
}
.deliver-info .deliver-title{
    background: #f0f0f0;
    line-height: 40px;
    padding-left: 15px;
    font-size: 14px;
}
.workare-title{
    background: #f0f0f0;
    line-height: 40px;
    padding-left: 15px;
    font-size: 12px;
}
.deliver-info.graph{
    overflow-y:hidden;
    overflow-x:auto;
    background-color: #fff;
    white-space: nowrap;
}
.deliver-info.graph .item{
    display: inline-block;
    height: 40px;
    width: 80px;
    border: 1px solid #ddd;
    border-radius: 5px;
    text-align: center;
    margin: 10px 0;
    background: #fff;
    color:#595959;
    font-size: 12px;
    position: relative;
    margin-left: 26px;
}
.deliver-info.graph .item:first-of-type{
    margin-left: 15px;
}
.deliver-info.graph .item:last-of-type{
    margin-right: 15px;
}
.deliver-info.graph .item span{
    display: block;
    line-height: 40px;
    height: 40px;
    font-size: 12px;
}
.deliver-info.graph .item:not(:first-of-type):before{
    content: "";
    border-top: 1px solid #ddd;
    width: 26px;
    position: absolute;
    left: -27px;
    top: 20px;
}
.deliver-info.graph .item.green{
    background-color: green;
    color:#fff;
}
.deliver-info.graph .item.yellow{
    background-color: yellow;
}
.deliver-info.graph .item.red{
    background-color: red;
    color:#fff;
}
.deliver-info.graph .item.active{
    box-shadow: 0 4px 12px 0 rgba(0,0,0,.1);
}
.deliver-info.graph .item.gary{
    background-color: #f0f0f0;
}
.planGantt .upload{
    display: inline-block;
}
</style>
