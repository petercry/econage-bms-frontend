<template>
 <div class="updateRisk">
         <div class="mainTable">
                <table>
                    <tr>
                        <th>措施描述</th>
                        <td >
                          <!-- <el-input v-model.trim="form.text" style="width:100%;"></el-input>-->
                          {{form.text}}
                          </td>
                    </tr>
                    <tr>
                        <th :class="{editable:false}">备注</th>
                        <td :class="{editable:riskStatus}">
                            <el-input v-if="riskStatus" v-model.trim="form.content" style="width:100%;"></el-input>
                            <span v-else>{{form.content}}</span>
                        </td>
                     </tr>
                    <tr>
                        <th>文档上传</th>
                        <td :class="{editable:riskStatus}" style="padding-left:15px">
                           <span @click="goAttachementPage" class="pointerClass" v-if="riskStatus"><i class="el-icon-paperclip"></i>上传文件（上传文件大小限制为2G）</span>
                            <ul class="fileList">
                                <li v-for="(item,index) in fileLists" :key="index" class="fileItem">
                                    <span class="imgType"><img style="vertical-align: middle;" :src="typeImgList[item.fileType]?typeImgList[item.fileType]:typeImgList['blank']"/>&nbsp;</span>
                                    <span style="cursor:pointer;" v-bind:class="item.operateFlag?'deleted':''">{{item.name}}&nbsp;</span><span>(&nbsp;{{item.size | sizeTostr}}&nbsp;)</span>
                                    <span class="download" @click="fileDownload(item)">下载</span>
                                    |<span class="preview" @click="filePreview(item)">预览</span>
                                    <span class="delete" v-show="!item.operateFlag&&riskStatus" @click="fileDelete(item,index)">[ 点击删除 ]</span>
                                    <span class="recovery" v-show="item.operateFlag&&riskStatus" @click="fileRecovery(item,index)">[ 点击恢复 ]</span>
                                </li>
                            </ul>
                        </td>
                     </tr>
                    <tr>
                        <th>是否完成</th>
                        <td :class="{editable:riskStatus}" style="padding-left:15px">
                           <template v-if="riskStatus">
                              <el-radio v-model="form.completeStatus" :label="true">是</el-radio>
                              <el-radio v-model="form.completeStatus" :label="false">否</el-radio>
                            </template>
                            <template v-else>
                                {{form.completeStatus===false?'否':'是'}}
                            </template>
                        </td>
                     </tr>
                </table>
         </div>
          <div class="btn" v-if="riskStatus">
            <el-button class="plainBtn" size="medium" @click="onCancel" >取消</el-button>
            <el-button type="primary" size="medium"  @click="onSubmit">保存</el-button>
        </div>
          <form name="docviewform"  method="get" >
          <input type="hidden" name="fileHeaderId"/>
          <input type="hidden" name="fileName"/>
          <input type="hidden" name="fileHeaderIds"/>
          <input type="hidden" name="expectedName"/>
        </form>
        <iframe name="docviewIframe" style="display:none"></iframe>
 </div>
</template>

<script>
import {EcoUtil} from '@/components/util/main.js'
import { mapGetters ,mapActions} from 'vuex'
import {EcoFile} from '@/components/file/main.js'
import {getItemFetchId,getEnumSelectEnabled,getFileListByModular,batchDeleteFiles} from '../../../api/common.js'
import {getSingleMeasureInfo,updateSingleMeasureInfo,getRiskInfo} from '../../../api/risk.js'
export default {
 name: 'updateRisk',
 data () {
 return {
   form:{
     measuresId:"",
     riskId:'',
     content:'',
     text:'',
     completeStatus:'1',
   },
   id:'',
   fileId:'',
   fileHeardId:'',
   modular:'project_manager',
   modularInnerId:'',
   riskStatus:true,
   fileLists:[],
   measuresCallBackId:'',
   loading:true
 }
 },

  computed: {
     ...mapGetters([
        'baseData',
        'getBaseDataTextByKey',
        'typeImgList'
      ]),
  },
    filters:{
      sizeTostr(value){
          if(!value) return "0KB";
          return EcoUtil.getFileSize(value);
      }
  },
  created() {
    this.form.measuresId=this.$route.params.measureId
    this.form.riskId=this.$route.params.riskId
    this.initProjectBaseData('create-enabled').then(()=>{
        this.loading = false;
  });
    this.bindAction()
    this.getInfo()
    this.getFileListByModular()

  },
 methods: {
      ...mapActions([
        'initProjectBaseData',
      ]),
    // 附件上传回写
      bindAction(){
          let that = this;
          let callBackDialogFunc = function(obj){
              if(obj && obj.action == 'onFileUploadActionCallBack'){ //附件上传回写
                    that.onFileUploadActionCallBack(obj.data);
              }
          }
           EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'updateRiskVue');
      },
      getInfo(){
          getSingleMeasureInfo(this.form.measuresId).then(res=>{
              const {text,completeStatus,pmInfoRiskMeasuresRecordEntity}=res
              this.form.text=text
              this.form.completeStatus=completeStatus
                if(pmInfoRiskMeasuresRecordEntity!==null){
                this.form.content=pmInfoRiskMeasuresRecordEntity.content
                this.measuresCallBackId=pmInfoRiskMeasuresRecordEntity.id
              }
          })
          getRiskInfo(this.form.riskId).then(res=>{
            //  let riskStatus= this.getBaseDataTextByKey(res.status,"faw_pm_risk_status")
             let riskStatus= res.status
             if(riskStatus==='faw_pm_risk_status3'||riskStatus==='faw_pm_risk_status5'){
                 this.riskStatus=false
             }else{
                 this.riskStatus=true
             }
          })
      },
    goAttachementPage(){
        let data = {};
        data.modular = this.modular;
        data.modularInnerId = this.form.measuresId;
        if(window.sysEnv == 1){
            EcoUtil.getSysvm().onFileUpload(data);
        }else{
            EcoUtil.getSysvm().onFileUploadForEnv(data);
        }
      },
      onFileUploadActionCallBack(data){
          this.fileLists.push.apply(this.fileLists,data.fileLists);

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
      getFileListByModular(){
           this.loading = true;
           getFileListByModular(this.modular,this.form.measuresId).then(res => {
               this.fileLists = res;
           })
      },
      fileChange(file, fileList){
          this.loading = true;
      },
      fileOnSuccess(response, file, fileList){
          this.loading = false;
          this.fileHeardId = response.id;
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
      onCancel(){
          EcoUtil.getSysvm().closeDialog();
      },
      updateMeasure(){
          this.loading = true;
          let formObj={}
          formObj.id=this.form.measuresId
          formObj.text=this.form.text
          formObj.pmInfoRiskMeasuresRecordEntity={
             id:this.measuresCallBackId,
             riskId:this.form.riskId,
             measuresId:this.form.measuresId,
             content:this.form.content,
             completeStatus:this.form.completeStatus
          }
          updateSingleMeasureInfo(formObj).then(res=>{
            this.loading = false;
             this.$message({
                message: '保存成功！',
                showClose: true,
                duration:1000,
                type: 'success',
                onClose:(()=>{
                    let doObj = {}
                    doObj.action = 'updateRisk';
                    doObj.data = {};
                    doObj.close = true;
                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
                })
            });

          })
      },
      onSubmit(){
        this.updateMeasure();
        this.updateFiles();
      }

 },
}
</script>

<style  scoped>
.updateRisk{
  background-color: #fff;
  height: 100%;
}
.updateRisk .mainTable{
    min-width: 400px;
    width: 100%;
    margin: 0 auto;
}
.updateRisk .mainTable table{
    width:100%;
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: fixed;
    font-size: 14px;
}
.updateRisk .mainTable table tr{
    height: 50px;
    line-height: 1.5;
}
.updateRisk .mainTable table th{
    background: #f0f0f0;
    padding-left: 15px;
    width: 130px;
    border:1px solid #e8e8e8;
    color: #0f1419 !important;
}
.updateRisk .mainTable table td{
    background: #fafafa;
    padding-left: 15px;
    border:1px solid #e8e8e8;
    word-break: break-all;
    color: #666;
}
.updateRisk .mainTable table td.editable{
    background: #fff;
    padding: 0;
}
.updateRisk table.neiqianTable th{
    border: none;
    border-right:1px solid #e8e8e8

}
.updateRisk .btn{
   text-align: right;
   margin-top: 30px;
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
.updateRisk .btn{
    text-align: right;
    padding: 10px;
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    right: 0;
    border-top: 1px solid #ddd;
}
</style>
