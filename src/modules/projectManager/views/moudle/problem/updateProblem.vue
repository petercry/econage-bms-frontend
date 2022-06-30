<template>
 <div class="updateProblem">
         <div class="mainTable">
                <table>
                    <tr>
                        <th>措施描述</th>
                        <td :class="{editable:problemStatus}">
                          <el-input v-if="problemStatus"  v-model.trim="form.text" style="width:100%;"></el-input>
                          <span v-else>{{form.text}}</span>
                          </td>
                    </tr>
                    <tr>
                        <th>备注</th>
                        <td :class="{editable:problemStatus}">
                            <el-input v-if="problemStatus" v-model.trim="form.content" style="width:100%;"></el-input>
                            <span v-else>{{form.content}}</span>
                        </td>
                     </tr>
                    <tr>
                        <th>文档上传</th>
                        <td :class="{editable:problemStatus}" style="padding-left:15px">
                           <span @click="goAttachementPage" class="pointerClass" v-if="problemStatus"><i class="el-icon-paperclip"></i>上传文件（上传文件大小限制为2G）</span>
                            <ul class="fileList">
                                <li v-for="(item,index) in fileLists" :key="index" class="fileItem">
                                    <span class="imgType"><img style="vertical-align: middle;" :src="typeImgList[item.fileType]?typeImgList[item.fileType]:typeImgList['blank']"/>&nbsp;</span>
                                    <span style="cursor:pointer;" v-bind:class="item.operateFlag?'deleted':''">{{item.name}}&nbsp;</span><span>(&nbsp;{{item.size | sizeTostr}}&nbsp;)</span>
                                    <span class="download" @click="fileDownload(item)">下载</span>
                                    |<span class="preview" @click="filePreview(item)">预览</span>
                                    <span class="delete" v-show="!item.operateFlag&&problemStatus" @click="fileDelete(item,index)">[ 点击删除 ]</span>
                                    <span class="recovery" v-show="item.operateFlag&&problemStatus" @click="fileRecovery(item,index)">[ 点击恢复 ]</span>
                                </li>
                            </ul>
                        </td>
                     </tr>
                    <tr>
                        <th>是否完成</th>
                        <td :class="{editable:problemStatus}" style="padding-left:15px">
                           <template v-if="problemStatus">
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
          <div class="btn" v-if="problemStatus">
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
import {getSingleMeasureInfo,updateSingleMeasureInfo,getProblemInfo} from '../../../api/problem.js'
export default {
 name: 'updateProblem',
 data () {
 return {
   form:{
     measuresId:"",
     problemId:'',
     content:'',
     text:'',
     completeStatus:'1',
   },
   id:'',
   fileId:'',
   fileHeardId:'',
   modular:'project_manager',
   modularInnerId:'',
   problemStatus:true,
   fileLists:[],
   loading:true,
   measuresCallBackId:'',
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
    this.form.problemId=this.$route.params.prId
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
           EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'updateMeasureVue');
      },
      getInfo(){
          getSingleMeasureInfo(this.form.measuresId).then(res=>{
              const {text,completeStatus,pmInfoProMeasuresRecordEntity}=res
              this.form.text=text
              this.form.completeStatus=completeStatus
              if(pmInfoProMeasuresRecordEntity!==null){
                this.form.content=pmInfoProMeasuresRecordEntity.content
                this.measuresCallBackId=pmInfoProMeasuresRecordEntity.id
              }
          })
          getProblemInfo(this.form.problemId).then(res=>{
            //  let problemStatus= this.getBaseDataTextByKey(res.status,"faw_pm_pro_status")
             if(res.status=='faw_pm_pro_status3'||res.status=='faw_pm_pro_status5'){
                 this.problemStatus=false
             }else{
                 this.problemStatus=true
             }
          })
      },

      // getItemFetchId(){
      //     getItemFetchId().then(res => {
      //         this.modularInnerId  = res;
      //         this.fileId = this.modularInnerId;
      //         this.getFileListByModular();
      //     })
      // },
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
          formObj.pmInfoProMeasuresRecordEntity={
             id:this.measuresCallBackId,
             problemId:this.form.problemId,
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
                    doObj.action = 'updateProblem';
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
.updateProblem{
  background-color: #fff;
  height: 100%;
}
.updateProblem .mainTable{
    min-width: 400px;
    width: 100%;
    margin: 0 auto;
}
.updateProblem .mainTable table{
    width:100%;
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: fixed;
    font-size: 14px;
}
.updateProblem .mainTable table tr{
    height: 50px;
    line-height: 1.5;
}
.updateProblem .mainTable table th{
    background: #f0f0f0;
    padding-left: 15px;
    width: 130px;
    border:1px solid #e8e8e8;
    color: #0f1419 !important;
}
.updateProblem .mainTable table td{
    background: #fafafa;
    padding-left: 15px;
    border:1px solid #e8e8e8;
    word-break: break-all;
    color: #666;
}
.updateProblem .mainTable table td.editable{
    background: #fff;
    /* padding: 0; */
    padding-left: 0;
}
.updateProblem table.neiqianTable th{
    border: none;
    border-right:1px solid #e8e8e8

}
.updateProblem .btn{
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
.updateProblem .btn{
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
