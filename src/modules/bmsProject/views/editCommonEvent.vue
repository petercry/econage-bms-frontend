<template>
    <div >
        <el-form label-width="95px" ref="myform" :rules="rules" :model="commonEventInfoObj" >
            <template v-for="(nodeEl,key) in formItemInfo" >
                <div :key="nodeEl.paramName" :style="{'width':(nodeEl.isWholeRow ? '98%' : '49%')}" class="formItemDiv">
                    <el-form-item :label="nodeEl.desc" :prop="nodeEl.paramName" >
                        <template v-if="nodeEl.eleType=='time'">
                            <el-date-picker v-model="commonEventInfoObj[key]" type="datetime" :placeholder="'请选择'+nodeEl.desc" style="width: 100%;" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm"></el-date-picker>
                        </template>
                        <template v-else-if="nodeEl.paramName=='attachment'">
                            <el-table :data="eventFileList"  stripe style="width: 100%" v-if="eventFileList!=null && eventFileList.length > 0" header-row-class-name="hiddenRow" row-class-name="tinyRow" class="detTable">
                            <el-table-column v-for="(colEl,index) in fileTableColEl" :key="index" :prop="colEl.paramName" :label="colEl.desc" :width="colEl.colWidth">
                                <template slot-scope="scope"  >
                                <div v-if="colEl.paramName=='op'">
                                    <el-button type="text" @click.native="doFilePreviewAction(scope.row)" v-if="_isPreviewFile(scope.row.fileType)" class="fileBtn">预览</el-button>
                                    <span v-else style="padding-left:31px;">&nbsp;</span>
                                    <el-button type="text" @click.native="doFileDownloadAction(scope.row)" class="fileBtn">下载</el-button>
                                    <el-button type="text" @click.native="deleteFile(scope.row.id , scope.row.name)" class="fileBtn" style="color:red;">删除</el-button>
                                </div>
                                <div v-else>
                                    {{scope.row[colEl.paramName]}}
                                </div>
                                </template> 
                            </el-table-column>
                            </el-table>
                            <el-button type="primary" size="medium" icon="el-icon-paperclip" @click.native="toAddAttachment" style="margin-top:7px;">添加附件</el-button>
                        </template>
                        <template v-else-if="nodeEl.kvGroupDesc!=''">
                            <el-select  :placeholder="'请选择'+nodeEl.desc" v-model="commonEventInfoObj[key]" style="width: 100%;">
                                <el-option v-for="(kvEl,index) in kvInfo.getKvListByGroupDesc(nodeEl.kvGroupDesc)" :key="index" :label="kvEl.text" :value="kvEl.id"></el-option>
                            </el-select>
                        </template>
                        <template v-else-if="nodeEl.eleType=='textarea'">
                            <el-input type="textarea" :placeholder="'请输入'+nodeEl.desc" v-model="commonEventInfoObj[key]" rows="3"></el-input>
                        </template>
                        <template v-else-if="nodeEl.eleType=='date'">
                            <el-date-picker v-model="commonEventInfoObj[key]" type="date" :placeholder="'请选择'+nodeEl.desc" style="width: 100%;" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
                        </template>
                        <template v-else>
                            <el-input  :placeholder="'请输入'+nodeEl.desc" v-model="commonEventInfoObj[key]" ></el-input>
                        </template>
                    </el-form-item>
                </div>
            </template>
        </el-form>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @open="cleanDialog()" :destroy-on-close="false" ref="dialog" :close-on-click-modal="false" :close-on-press-escape="false" :append-to-body="true" class="trivialDialog">
         
          <ecoFileUploadPopup v-if="dialogTab=='addFile'" modular="bmsProjectEvent" :modularInnerId="''+this.eventId" ref="addFileWin"></ecoFileUploadPopup>
         
          <div slot="footer" class="dialog-footer" v-if="dialogTab!='addFile'">
            <el-button @click.native="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click.native="dialogSave()" >保 存</el-button>
          </div>
          <div slot="footer" class="dialog-footer" v-else>
            <el-button @click.native="dialogVisible = false">关 闭</el-button>
          </div>
        </el-dialog>
    </div>
</template>
<script>
import {doFilePreviewAction,doFileDownloadAction} from "@/modules/bmsMmm/util/utility.js";
import { getEnumText } from "@/modules/bmsBa/service/service.js";
import { getProjectEventDetail,editProjectEventAjax,getEventFileList} from "@/modules/bmsProject/service/service.js";
import {openLoading,closeLoading,_isPreviewFile } from "@/modules/bmsMmm/service/service.js";
import { formatFileSize,deleteFileDataServer } from "@/modules/bmsBa/service/service.js";
import { FormItemEl } from "@/modules/bmsBa/util/FormItemEl.js";
import { KvGroup } from "@/modules/bmsBa/util/KvGroup.js";
import { TableColEl } from "@/modules/bmsBa/util/TableColEl.js";
import ecoFileUploadPopup from '@/modules/bmsMmm/component/ecoFileUploadPopup.vue';
import {mapMutations} from 'vuex';
export default{
  name:'editCommonEvent',
  components:{
      ecoFileUploadPopup
  },
  data(){
    return {
      commonEventInfoObj:{},
      eventId:'',
      kvInfo:new KvGroup(),
       formItemInfo:new FormItemEl()
        .add("联系方式","typeId",'eventContactType',false)
        .add("客户联系人","contactPerson",'',false) 
        .add("时间","actionDate",'',false,'time')
        .add("经办方","actionUser",'',false)
        .add("内容","subject",'',true,'textarea')
        .add("附件","attachment",'',true),
      rules: {
        typeId: [
          { required: true, message: '请选择联系方式', trigger: 'blur' }
        ],
        contactPerson: [
          { required: true, message: '请填写客户联系人', trigger: 'blur' }
        ],
        actionDate: [
          { required: true, message: '请选择发生时间', trigger: 'blur' }
        ],
        actionUser: [
          { required: true, message: '请填写经办方', trigger: 'blur' }
        ],
        subject: [
          { required: true, message: '请填写内容', trigger: 'blur' }
        ]
      },
      eventFileList:[],
      fileTableColEl: new TableColEl()
        .add("文档名称","name",'300','',false,false,false)  
        .add("大小","size",'100',"",false,false,false)
        .add("上传人","createUserName",'80',"",false,false,false)
        .add("上传时间","createDate",'140',"",false,false,false)
        .add("操作","op",'135',"",false,false,false),
      dialogVisible:false,
      dialogTitle:'',
      dialogTab:''
    }
  },
  created(){
    this.kvInfo = this.$parent.$parent.kvInfo;
    this.eventId = this.$parent.$parent.focusEventId;
    this.getCommonEventInfo(this.eventId);
  },
  mounted(){
  },
  methods: {
    getCommonEventInfo(eventId){
      if(eventId=='')return;
      this.$parent.$parent.openLoading();
      this.eventId = eventId;
      console.log("this.eventId :" + this.eventId );
      getProjectEventDetail(eventId).then((response)=>{
          //console.log("response back:" + eventId);
        if (response.data&&response.data.id){
            this.commonEventInfoObj = response.data;
            this.getEventFileListFunc();
            this.$parent.$parent.closeLoading();
        }
      }).catch((error)=>{
          console.log("error!!!!!:" + error);
         this.$parent.$parent.closeLoading();
      });
    },
    cleanDialog(){
    }, 
    cleanInfo(){
      this.eventId='';
      this.commonEventInfoObj={};
      this.eventFileList=[];
    },
    setSaveData(data){
      let obj = {};
      for (let i in data) {
        obj[i] = data[i];
      }
      obj.id = this.eventId;
      obj.time = new Date().getTime();
      return obj;
    },
    save(){
      this.$refs['myform'].validate((valid) => {
          if (valid) {
            //console.log("submit!!");
            //return;
            this.$parent.$parent.openLoading();
            console.log("this.eventId for editing :" + this.eventId );
            editProjectEventAjax(this.eventId,this.setSaveData(this.commonEventInfoObj)).then((res)=>{
              //console.log("submit  done!!");
              this.$message({type: 'success',message: '编辑成功！'});
              this.$parent.$parent.dialogVisible = false;
              this.$parent.$parent.focusPanelName = "eventInfo";
              this.$parent.$parent.setTabPanel();
            }).catch((error)=>{
              this.$parent.$parent.closeLoading();
              console.log("error:"+error);
              this.$message({type: 'error',message: '编辑失败！'});
            })
          } else {
            //console.log("invalid!!");
            return false;
          }
      });
    },
    callBackForUploadFile(){
        this.getEventFileListFunc();
    },
    getEventFileListFunc(){
      this.openLoading();
      getEventFileList(this.eventId ).then(response => {
            this.eventFileList = response.data;
            let tmp_eventFileList = [];
            for (let i in this.eventFileList) {
              let checkNode = this.eventFileList[i];
              if(checkNode.createDate.length == 19){
                checkNode.createDate = checkNode.createDate.substring(0,16);
              }
              checkNode.size = formatFileSize(checkNode.size);
              tmp_eventFileList.unshift(checkNode);
            }
            this.eventFileList = tmp_eventFileList;
            //console.log("this.eventFileList.length:"+this.eventFileList.length);
            this.closeLoading();
        }).catch(error => {
          console.log("error:"+error);
          this.closeLoading();
        });
    },
    deleteFile(fileId,fileName){
        deleteFileDataServer(fileId).then(response => {
          this.$message({type: 'success',message: '删除成功！'});
          this.getEventFileListFunc();      
        }).catch(error => {
          console.log("error:"+error);
          this.$message({type: 'error',message: '删除失败！'});
        });
    },
    toAddAttachment(){
      this.dialogTitle="添加附件";
      this.dialogTab = 'addFile';
      this.dialogVisible = true;
    },
    openLoading,
    closeLoading,
    doFilePreviewAction,
    doFileDownloadAction,
    _isPreviewFile,
    getEnumText
  },
  watch: {

  }
}
</script>
<style scoped>
.formItemDiv{
    display:inline-block;
}
.el-form-item {
    margin-bottom: 15px;
}
.el-form-item__error {
  padding-top: 1px;
}
</style>
