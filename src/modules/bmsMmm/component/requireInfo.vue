<template>
        <div style="width:calc(100% - 30px);margin:0px 10px 0px 20px;">
          <template v-for="(nodeEl,key,i) in detInfo" >
            <div :key="i" :style="{'width':(nodeEl.isWholeRow ? '100%' : '49%')}" class="detRowDiv devDiv" v-if="requireInfoObj[nodeEl.paramName]!=null">
              <div class="devTitleDiv" :style="{'width':(nodeEl.isWholeRow ? '15%' : '30%')}"><span class="titleSpan" >{{nodeEl.desc}}</span></div>
              <div class="devInfoDiv" :style="{'width':(nodeEl.isWholeRow ? '82%' : '67%')}">
                <template v-if="nodeEl.paramName=='desc'">
                  <div class="infoCkDiv" v-ckeditor="requireInfoObj[nodeEl.paramName]"></div>
                </template>
                <template v-else>
                <span class="infoSpan" v-html="requireInfoObj[nodeEl.paramName]">{{requireInfoObj[nodeEl.paramName]}}</span>
                </template>
              </div>
            </div>
          </template>
          <div style="margin-top:20px;">
            <el-tabs v-model="focusPanelName" @tab-click="setTabPanel">
                <el-tab-pane :label="'关联任务 ('+this.taskInfoList.length+')'" name="taskInfo" >
                    {{noTaskInfoToShow}}
                    <el-timeline >
                              <el-timeline-item v-for="(item,index) in taskInfoList" :key="index" v-bind:timestamp="item.date" placement="top">
                                  <el-card>
                                      <el-row>
                                        <el-col :span="3" ><span class="planTitleSpan" >标题</span></el-col>
                                        <el-col :span="21" ><span class="planInfoSpan" >#{{item.id}} : {{item.title}}</span></el-col>
                                      </el-row>
                                      <el-row>
                                        <el-col :span="3" ><span class="planTitleSpan" >状态</span></el-col>
                                        <el-col :span="21" ><span class="planInfoSpan" >{{item.statusDesc}}</span></el-col>
                                      </el-row>
                                      <el-row>
                                        <el-col :span="3" ><span class="planTitleSpan" >类型</span></el-col>
                                        <el-col :span="21" ><span class="planInfoSpan" >{{item.typeDesc}}</span></el-col>
                                      </el-row>
                                      <el-row>
                                        <el-col :span="3" ><span class="planTitleSpan" >优先级</span></el-col>
                                        <el-col :span="21" ><span class="planInfoSpan" >{{item.priority}}</span></el-col>
                                      </el-row>
                                      <el-row v-if="item.projectDesc!=null">
                                        <el-col :span="3" ><span class="planTitleSpan" >关联项目</span></el-col>
                                        <el-col :span="21" ><span class="planInfoSpan" >{{item.projectDesc}}</span></el-col>
                                      </el-row>
                                      <el-row v-if="item.requireDesc!=null">
                                        <el-col :span="3" ><span class="planTitleSpan" >关联需求</span></el-col>
                                        <el-col :span="21" ><span class="planInfoSpan" >{{item.requireDesc}}</span></el-col>
                                      </el-row>
                                      <el-row v-if="item.dealerName!=null">
                                        <el-col :span="24" ><span class="planTitleSpan" style="font-weight:bold;">{{item.dealerName}}已完成{{item.currentRate}}%</span></el-col>
                                      </el-row>
                                  </el-card>
                              </el-timeline-item>
                          </el-timeline>
                </el-tab-pane>
                <el-tab-pane :label="'附件文档 ('+this.requireFileList.length+')'" name="requireFile">
                    {{noRequireFileToShow}}
                    <el-table :data="requireFileList"  stripe style="width: 100%" v-if="requireFileList!=null && requireFileList.length > 0" class="detTable">
                      <el-table-column v-for="(colEl,index) in fileTableColEl" :key="index"  :prop="colEl.paramName" :label="colEl.desc" :width="colEl.colWidth">
                        <template slot-scope="scope"  >
                          <div v-if="colEl.paramName=='op'">
                            <el-button type="text" @click.native="doFilePreviewAction(scope.row)" v-if="_isPreviewFile(scope.row.fileType)" class="fileBtn" >预览</el-button>
                            <span v-else style="padding-left:31px;">&nbsp;</span>
                            <el-button type="text" @click.native="doFileDownloadAction(scope.row)" class="fileBtn" >下载</el-button>
                          </div>
                          <div v-else>
                            {{scope.row[colEl.paramName]}}
                          </div>
                        </template> 
                      </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane :label="'操作历史 ('+this.opActionList.length+')'" name="opActionHis">
                  <el-collapse v-model="opActionActiveNames" @change="changeActionHis">
                    <el-collapse-item :title="(index+1)+'. '+item.actionDesc" :name="item.id" v-for="(item,index) in opActionList" :key="index" :disabled="item.detail.length==0">
                      <div style="margin-left:10px;">
                        <div v-for="(detItem , detIdx) in item.detail" :key="detIdx">
                            <div style="width:100px;white-space:nowrap;display:inline-block;color:rgb(107, 106, 106);font-weight:bold;">{{detItem.fieldDesc}}</div>
                            <div style="display:inline-block;" v-if="detItem.oldValue==''">{{detItem.newValue}}</div>
                            <div style="display:inline-block;" v-else>由旧值 {{detItem.oldValue}} 更改为 {{detItem.newValue}}</div>
                        </div>
                      </div>
                    </el-collapse-item>
                  </el-collapse>  
                </el-tab-pane>  
            </el-tabs>            
          </div>
        </div>
</template>
<script>
import {doFilePreviewAction,doFileDownloadAction} from "@/modules/bmsMmm/util/utility.js";
import {openLoading,closeLoading,getRequireDetail,getTaskListByRequire,dealException,formatDateToMinute,extSearchOpAction,setActionDesc,getRequireFileList,_isPreviewFile } from "@/modules/bmsMmm/service/service.js";
import { formatFileSize } from "@/modules/bmsBa/service/service.js";
import { FormItemEl } from "@/modules/bmsBa/util/FormItemEl.js";
import {mapMutations} from 'vuex';
import { DetShowEl } from "@/modules/bmsBa/util/DetShowEl.js";
import { TableColEl } from "@/modules/bmsBa/util/TableColEl.js";
export default{
  name:'requireInfo',
  components:{
      
  },
  props:['requireId'],
  data(){
    return {
      requireInfoObj:{},
      taskInfoList:[],
      focusPanelName:'taskInfo',
      noTaskInfoToShow:'',
      noRequireFileToShow:'',
      noInfoMsg:'　暂无数据 ...',
      detInfo:new DetShowEl()
        .add("需求ID","id",'',true)
        .add("标题","title",'',true)
        .add("状态","statusDesc",'',false)
        .add("优先级","priority",'',false)
        .add("需要来源","sourceFlag",'',false)
        .add("来源备注","sourceDesc",'',false)
        .add("要求完成时间","expectFinishDate",'',false)
        .add("工时","manHour",'',false)
        .add("详细描述","desc",'',true),
      opActionActiveNames:[],
      opActionList:[],
      requireFileList:[],
      fileTableColEl: new TableColEl()
        .add("文档名称","name",'400','',false,false,false)  
        .add("大小","size",'100',"",false,false,false)
        .add("上传人","createUserName",'80',"",false,false,false)
        .add("上传时间","createDate",'140',"",false,false,false)
        .add("操作","op",'150',"",false,false,false),
    }
  },
  created(){
      this.getRequireInfo();
      this.getOpActionListFunc();
      this.getRequireFileListFunc();
  },
  mounted(){
    
  },
  methods: {
    getRequireInfo(){
        getRequireDetail(this.requireId).then((response)=>{
            if (response.data&&response.data.id){
                this.requireInfoObj = response.data;
                if(this.requireInfoObj.childrenCount==0){
                    this.noTaskInfoToShow=this.noInfoMsg;
                }else{
                    this.getTaskListFunc();
                }
            }
        }).catch((error)=>{
            dealException(error);
        });
    },
    getRequireFileListFunc(){
      this.openLoading();
      this.noRequireFileToShow='';
      getRequireFileList(this.requireId ).then(response => {
            this.requireFileList = response.data;
            let tmp_requireFileList = [];
            for (let i in this.requireFileList) {
              let checkNode = this.requireFileList[i];
              if(checkNode.createDate.length == 19){
                checkNode.createDate = checkNode.createDate.substring(0,16);
              }
              checkNode.size = formatFileSize(checkNode.size);
              tmp_requireFileList.unshift(checkNode);
            }
            this.requireFileList = tmp_requireFileList;
            //console.log("this.requireFileList.length:"+this.requireFileList.length);
            if(this.requireFileList.length==0){
              this.noRequireFileToShow=this.noInfoMsg;
            }
            this.closeLoading();
        }).catch(error => {
          console.log("error:"+error);
          this.closeLoading();
        });
    },
    getTaskListFunc() {
      this.noTaskInfoToShow='';
      getTaskListByRequire(this.requireId).then(response => {
            this.taskInfoList = response.data.rows;
            if(this.taskInfoList.length==0){
              this.noTaskInfoToShow=this.noInfoMsg;
            }
        })
        .catch(error => {
            dealException(error);
        });
    },
    getOpActionListFunc() {
      extSearchOpAction('require' , 'task' , this.requireId).then(response => {
            this.opActionList = response.data;
            //console.log("#####this.opActionList:" + this.opActionList);
            if(this.opActionList!=null&&this.opActionList.length>0){
              for(let i in this.opActionList){
                let actionNode = this.opActionList[i];
                let actionDesc = formatDateToMinute(actionNode.date)+",由"+actionNode.actorName+setActionDesc(actionNode);
                actionNode.actionDesc = actionDesc;
                //console.log("#####actionDesc:" + actionDesc);
              }
            }
        })
        .catch(error => {
            dealException(error);
        });
    },
    setTabPanel(){},
    changeActionHis(){

    },
    formatDateToMinute,
    openLoading,
    closeLoading,
    doFilePreviewAction,
    doFileDownloadAction,
    _isPreviewFile,
  },
  watch: {

  }
}
</script>
<style >
body{
  font-size: 14px;
}
.detRowDiv{
  margin-bottom: 5px;
  display:inline-block;
  vertical-align: top;
}
.devTitleDiv{
  display:inline-block;
  vertical-align: top;
}
.devInfoDiv{
  display:inline-block;
  word-wrap: break-word;
}
.titleSpan{
    font-weight: bold;
    color: rgb(107, 106, 106);
    line-height: 30px;
}
.infoSpan{
    border-bottom:1px solid rgb(187, 186, 186);
    padding-bottom:2px;
    line-height: 25px;
}
.planTitleSpan{
    color: rgb(107, 106, 106);
    line-height: 30px;
}
.planInfoSpan{
    border-bottom:1px solid rgb(187, 186, 186);
    line-height: 30px;
}
.el-timeline-item__timestamp{
  font-weight: bold;
  font-size: 16px;
}
.el-collapse-item.is-disabled .el-collapse-item__header {
    color: #303133;
    cursor: default;
}
.el-collapse-item.is-disabled .el-collapse-item__arrow {
  display: none;
}
</style>
