<template>
    <div class="taskInfo" v-loading="loading">
        <eco-content top="0px" height="60px" type="tool" style="border-bottom:1px solid #ddd;overflow:hidden;">
            <el-row style="padding:12px 10px;background-color:#fff;">
                <el-col :span="24" >
                    <eco-tool-title style="line-height: 34px;margin-right:50px;" :title="'任务卡片'"></eco-tool-title>
                    <el-button plain class="plainBtn toolBtn" v-show="!loading && editable && !viewStatus" @click.native="finishedTask"><i class="icon el-icon-circle-check"></i>&nbsp;完成任务</el-button>
                    <el-button
                        plain
                        class="plainBtn toolBtn"
                        style="float:right"
                        @click.native="goback"
                        v-show="!isFromTaskList"
                    ><i class="icon el-icon-back"></i>&nbsp;返回任务列表</el-button>
                </el-col>
            </el-row>
        </eco-content>
        <eco-content top="61px" bottom="60px" type="tool" style="padding:20px 0;background-color:#fff">
            <div class="mainTable">
                <table>
                    <tr>
                        <th>项目名称</th>
                        <td>{{projectInfo.name}}</td>
                        <th>任务名称</th>
                        <td>
                            {{taskInfo.name}}
                        </td>
                    </tr>
                    <tr>
                        <th>计划开始时间</th>
                        <td>{{taskInfo.planStartDate}}</td>
                        <th>计划完成时间</th>
                        <td>
                            {{taskInfo.planEndDate}}
                        </td>
                    </tr>
                       <tr>
                        <th>关联里程碑</th>
                        <td>{{taskInfo.milestoneEntity?taskInfo.milestoneEntity.name:""}}</td>
                        <th>状态</th>
                        <td>
                           {{getBaseDataTextByKey(taskInfo.status,"faw_pm_work_status")}}
                        </td>
                    </tr>
                </table>
                <div class="deliver-info graph">
                    <p class="deliver-title">交付工作步骤</p>
                    <div class="deliver-item">
                        <el-scrollbar style="height:auto;">
                            <div class="item pointerClass" v-for="(item,index) in taskInfo.validTaskDelivList" :key="index+'valid'" v-show="taskInfo.validTaskDelivList && item.deliverableEntity" v-bind:class="(item.status == 'faw_pm_task_deliv_status2'? 'green' : '') + (item.deliverableEntity.id == form.delivId?' active':'') " @click="qiehuanData(item)">
                                <span>{{item.deliverableEntity?item.deliverableEntity.name:""}}</span>
                            </div><div class="item pointerClass gary" v-for="(item,index) in taskInfo.invalidTaskDelivList" :key="index+'invalid'" v-show="taskInfo.invalidTaskDelivList && item.deliverableEntity">
                                <span>{{item.deliverableEntity?item.deliverableEntity.name:""}}</span>
                            </div>
                        </el-scrollbar>
                    </div>
                </div>
                <div class="workarea" v-show="chooseDeliver.delivId">
                    <p class="workare-title">工作区</p>
                    <table>

                        <tr>
                            <th>名称</th>
                            <td colspan="3">
                                {{chooseDeliver && chooseDeliver.deliverableEntity?chooseDeliver.deliverableEntity.name:""}}
                            </td>
                        </tr>
                        <tr>
                            <th><i class="required" v-show="Object.prototype.hasOwnProperty.call(rules,'status')">*</i>状态</th>
                            <td colspan="3" v-bind:class="{editable:editable && !viewStatus}" >
                                <el-select v-if="editable && !viewStatus" clearable v-model="form.status" placeholder="请选择" style="width:98%;">
                                    <el-option
                                        v-for="(item,index) in baseData['faw_pm_task_deliv_status']" :key="index"
                                        :label="item.text"
                                        :value="item.id"
                                        >
                                    </el-option>
                                </el-select>
                                <span v-else>{{getBaseDataTextByKey(form.status,"faw_pm_task_deliv_status")}}</span>
                            </td>
                        </tr>
                        <tr>
                            <th>工作指导</th>
                            <td colspan="3" v-bind:class="{editable:editable && !viewStatus}">
                                <el-input v-if="editable && !viewStatus" v-model.trim="form.guidance"></el-input>
                                <span v-else>{{form.guidance}}</span>
                            </td>
                        </tr>
                        <tr>
                            <th>交付文件</th>
                            <td colspan="3" v-bind:class="{editable:editable && !viewStatus}" style="padding:10px 0 10px 15px;">
                                <span @click="goAttachementPage" v-if="editable && !viewStatus" class="pointerClass"><i class="el-icon-paperclip"></i>上传文件（上传文件大小限制为2G）</span>
                                <ul class="fileList">
                                    <li v-for="(item,index) in fileLists" :key="index" class="fileItem">
                                        <span class="imgType"><img style="vertical-align: middle;" :src="typeImgList[item.fileType]?typeImgList[item.fileType]:typeImgList['blank']"/>&nbsp;</span>
                                        <span style="cursor:pointer;" v-bind:class="item.operateFlag?'deleted':''">{{item.name}}&nbsp;</span><span>(&nbsp;{{item.size | sizeTostr}}&nbsp;)</span>
                                        <span class="download" @click="fileDownload(item)">下载</span>
                                        |<span class="preview" @click="filePreview(item)">预览</span>
                                        <span class="delete" v-show="!item.operateFlag && editable && !viewStatus" @click="fileDelete(item,index)">[ 点击删除 ]</span>
                                        <span class="recovery" v-show="item.operateFlag && editable && !viewStatus" @click="fileRecovery(item,index)">[ 点击恢复 ]</span>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <th>备注</th>
                            <td colspan="3" v-bind:class="{editable:editable && !viewStatus}">
                                <el-input v-if="editable && !viewStatus" v-model.trim="form.comments"></el-input>
                                <span v-else>{{form.comments}}</span>
                            </td>

                        </tr>
                    </table>
                </div>
            </div>
        </eco-content>
        <div class="btn" style="text-align:center" >

            <el-button type="primary" size="medium" v-show="!loading && !viewStatus" @click="onSubmit">保 存</el-button>
        </div>

    </div>
</template>
<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {EcoUtil} from '@/components/util/main.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import { mapGetters ,mapActions ,mapMutations} from 'vuex'
import {getFileListByModular,batchDeleteFiles,getItemFetchId} from '../../../api/common.js'
import {getTaskInfo,saveTaskDeliv,finishedTask} from '../../../api/task.js'
import {EcoFile} from '@/components/file/main.js'
import linkDeliver from '../../components/linkDeliver.vue'
export default {
  name:'taskInfo',
  components: {
      ecoContent,
      ecoLoading,
      ecoToolTitle,
      linkDeliver
      //ecoFileUploadBtn
  },
  data() {
    return {
        taskInfo:{},
        form:{
            id:"",
            workId:"",
            delivId:"",
            status:"",
            guidance:"",
            comments:""
        },

        fileName:"",
        modularInnerId:"",

        modular:"project_manager",
        fileLists:[],
        loading:true,
        deliverList:[],
        chooseDeliver:{},
        rules: {
        },
        isFromTaskList:false

    }
  },
  created() {
      this.bindAction();
      this.initSomeBaseData({array:['faw_pm_work_status','faw_pm_task_deliv_status']})
      if(this.$route.params.id > 0){
        this.form.workId = this.$route.params.id;
        this.getTaskInfo();

        this.getFileListByModular();
     }

  },
  activated(){

  },

  mounted(){
       this.isFromTaskList = window.isFromTaskList;
  },
   props:{
        editable: {
            type: Boolean,
            default(){
                return true
            }
        }
    },
  computed: {
        ...mapGetters([
            'baseData',
            'getBaseDataTextByKey',
            'typeImgList',
            'projectInfo'
        ]),
        viewStatus(){
            return this.taskInfo.status == 'faw_pm_work_status4' || this.taskInfo.status == 'faw_pm_work_status5';
        }

  },
  filters:{
      sizeTostr(value){
          if(!value) return "0KB";
          return EcoUtil.getFileSize(value);
      }
  },
  methods: {
      ...mapActions(['initSomeBaseData']),
      bindAction(){
          let that = this;
          let callBackDialogFunc = function(obj){
              if(obj && obj.action == 'onFileUploadActionCallBack'){ //附件上传回写
                    that.onFileUploadActionCallBack(obj.data);
              }
          }
           EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'projectTaskInfoVue');
      },
      getItemFetchId(){
          getItemFetchId().then(res => {
              this.form.id = res;
              this.chooseDeliver.id = res;
          })
      },
      getTaskInfo(){
          this.loading = true;
          getTaskInfo(this.$route.params.id).then( res => {
              this.loading = false;
              this.taskInfo = res;
              if(this.taskInfo.validTaskDelivList && this.taskInfo.validTaskDelivList.length > 0){
                  this.chooseDeliver = this.taskInfo.validTaskDelivList[0];
                  this.fixedForm();
              }else if(this.taskInfo.invalidTaskDelivList && this.taskInfo.invalidTaskDelivList.length > 0){
                  this.chooseDeliver = this.taskInfo.invalidTaskDelivList[0];
                  this.fixedForm();
              }
          }).catch(e => {
              this.loading = false;
          })
      },
      getFileListByModular(){
           getFileListByModular(this.modular,this.form.id).then(res => {
               this.fileLists = res;
               this.loading = false;
           })
      },
      goAttachementPage(){
        let data = {};
        data.modular = this.modular;
        data.modularInnerId = this.form.id;
        if(window.sysEnv == 1){
            EcoUtil.getSysvm().onFileUpload(data);
        }else{
            EcoUtil.getSysvm().onFileUploadForEnv(data);
        }
      },
      onFileUploadActionCallBack(data){
          this.fileLists.push.apply(this.fileLists,data.fileLists);

      },
      fileDownload(item){
           EcoFile.openFileHeaderByDownload(item.id,item.name);
      },
      filePreview(item){

        if(item.fileType && item.fileType.toLowerCase()== 'pdf'){
            EcoFile.openFileByPdfJs(item.id,item.modular);
        }else{
            EcoFile.openFileHeaderByView(item.id,item.name);
        }
      },
      fileDelete(item,idx){
        this.$set(item,'operateFlag',true);
      },

      fileRecovery(item,idx){
        this.$set(item,'operateFlag',false);
      },
      onSubmit(){
          this.updateFiles();
          this.loading = true;
          saveTaskDeliv(this.form).then(res=>{
            this.loading = false;
            this.chooseDeliver.status = this.form.status;
            this.$message({
                message: '保存成功！',
                showClose: true,
                duration:2000,
                type: 'success'
            });
          }).catch(e=>{
               this.loading = false;
          })
      },
      updateFiles(){
          if(this.fileLists.length == 0) return;
          this.loading = true;
          let deleteIds = this.fileLists.map(item =>
              item.operateFlag?item.id:""
          )
          batchDeleteFiles(deleteIds).then(res => {
              this.loading = false;
              this.getFileListByModular();
          })
      },

      finishedTask(){
          var that  = this;
          let confirmYesFunc = function(){

                finishedTask(that.$route.params.id).then(res => {
                    that.$message({
                        message: '操作成功！',
                        showClose: true,
                        duration:2000,
                        customClass:'design-from-el-message',
                        type: 'success'
                    });
                    that.goback();
                })
            }
            let options = {
                type: 'warning',
                lockScroll:false
            }
            EcoMessageBox.confirm('确定要完成任务吗?','提示',options,confirmYesFunc);

      },
      goback() {
        this.$router.push({ name: 'taskListInProjectCard'})
      },
      qiehuanData(item){
        this.chooseDeliver = item;
        this.fixedForm();
      },
      fixedForm(){
        this.form.delivId = this.chooseDeliver.deliverableEntity.id || '';
        this.form.status = this.chooseDeliver.status || '';
        this.fileLists = [];
        if(this.chooseDeliver.id){
            this.form.id = this.chooseDeliver.id;
            this.getFileListByModular();
        }else{
            this.getItemFetchId();
        }
        this.form.workId = this.$route.params.id;
        this.form.guidance = this.chooseDeliver.guidance || '';
        this.form.comments = this.chooseDeliver.comments || '';

        //this.fileLists = this.chooseDeliver.delivFiles || [];
      }

  },
  watch:{

  },

};
</script>

<style scoped>
.taskInfo{
    background: #fff;
    height:100%;
}
.taskInfo .btn{
    text-align: right;
    padding: 10px;
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    right: 0;
    border-top: 1px solid #ddd;
}
.taskInfo .addForm{
    min-width: 800px;
    width: 60%;
    margin: 0 auto;
    position: absolute;
    bottom: 60px;
    left: 0;
    right: 0;
    top: 90px;
    font-size: 0;
}
.taskInfo .addForm .el-form-item{
    width:378px;
    border: 1px solid #ddd;
    margin: 0;
    line-height: 50px;
}
.taskInfo .addForm .allItem{
    width: auto;
}
.taskInfo .plainBtn{
    border-color: #003b90;
    color: #003b90;
    font-size:14px;
}
.taskInfo .toolBtn{
    margin:0 10px;
}
.taskInfo .mainTable{
    min-width: 800px;
    width: 60%;
    margin: 0 auto;
}
.taskInfo .mainTable table{
    width:100%;
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: fixed;
    font-size: 14px;
}
.taskInfo .mainTable table tr{
    height: 50px;
    line-height: 1.5;
}
.taskInfo .mainTable table th{
    background: #f0f0f0;
    padding-left: 15px;
    width: 130px;
    border:1px solid #e8e8e8;
    color: #0f1419 !important;
    position: relative;
}
.taskInfo .mainTable table td{
    background: #fafafa;
    padding-left: 15px;
    border:1px solid #e8e8e8;
    word-break: break-all;
    color: #666;
}
.taskInfo .mainTable table td.editable{
    background: #fff;
    padding: 0;
}
.taskInfo table.neiqianTable th{
    border: none;
    border-right:1px solid #e8e8e8

}
.fileItem .download{
    margin-right:5px;
    cursor: pointer;
    color:#3891eb;
}
.fileItem .preview{
    margin-left:5px;
    cursor: pointer;
    color:#3891eb;
    margin-right:5px;
}
.fileItem .delete{
    margin-left:5px;
    cursor: pointer;
    color:#67c23a;
}

.fileItem .recovery{
    margin-left:5px;
    cursor: pointer;
    color:#e03a3a
}

.fileItem .imgType{
    width:16px;
    height:16px;
}
.fileItem .deleted{
    text-decoration: line-through;
}
.taskInfo i.required{
    color:red;
    position: absolute;
    top: 15px;
    left: 5px;
}
.deliver-info{
    margin:10px 0;
    border:1px solid #e8e8e8;
    height:150px;
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
    font-size: 14px;
}
.deliver-info.graph{
    overflow-y:hidden;
    overflow-x:auto;
    background-color: #fff;
    white-space: nowrap;
}
.deliver-info.graph .item{
    display: inline-block;
    height: 60px;
    width: 100px;
    border: 1px solid #ddd;
    border-radius: 5px;
    text-align: center;
    margin: 20px 0;
    background: #fff;
    color:#595959;
    font-size: 12px;
    position: relative;
    margin-left: 26px;
}
.deliver-info.graph .item:first-of-type{
    margin-left: 20px;
}
.deliver-info.graph .item:last-of-type{
    margin-right: 20px;
}
.deliver-info.graph .item span{
    display: block;
    line-height: 60px;
    height: 60px;
    font-size: 14px;
}
.deliver-info.graph .item:not(:first-of-type):before{
    content: "";
    border-top: 1px solid #ddd;
    width: 26px;
    position: absolute;
    left: -27px;
    top: 30px;
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
</style>
