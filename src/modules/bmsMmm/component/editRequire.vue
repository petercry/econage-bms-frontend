<template>
    <div style="display:inline-block;width:100%;height:100%">
        <div style="display:inline-block;width:99%;border-right: 2px solid #ebebeb;padding-right:25px;" ref="taskDiv">
            <el-form label-width="120px" ref="requireForm" :rules="requireFormRules" :model="requireInfoObj" v-if="dataMountedFlag">
                <template v-for="(nodeEl,key) in requireFormItemInfo" >
                    <div :key="nodeEl.paramName" :style="{'width':(nodeEl.isWholeRow ? '98%' : '49%') , 'display': 'inline-block'}" class="formItemDiv">
                        <el-form-item :label="nodeEl.desc" :prop="nodeEl.paramName" >
                            <template v-if="nodeEl.paramName=='status'">
                              <el-select v-model="requireInfoObj[key]" :placeholder="'请选择'+nodeEl.desc">
                                <el-option
                                  v-for="statusItem in requireStatusV"
                                  :key="statusItem.id"
                                  :label="statusItem.desc"
                                  :value="statusItem.id">
                                </el-option>
                              </el-select>
                            </template> 
                            <template v-else-if="nodeEl.paramName=='priority'">
                              <div>
                                <el-radio v-model="requireInfoObj[key]" :label="Number(1)" border class="priority1">1</el-radio>
                                <el-radio v-model="requireInfoObj[key]" :label="Number(2)" border class="priority2">2</el-radio>
                                <el-radio v-model="requireInfoObj[key]" :label="Number(3)" border class="priority3">3</el-radio>
                              </div>
                            </template>
                            <template v-else-if="nodeEl.paramName=='attachment'">
                              <el-table :data="requireFileList"  stripe style="width: 100%" v-if="requireFileList!=null && requireFileList.length > 0" header-row-class-name="hiddenRow" row-class-name="tinyRow">
                                <el-table-column v-for="(colEl,index) in fileTableColEl" :key="index"  :prop="colEl.paramName" :label="colEl.desc" :width="colEl.colWidth">
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
                            <template v-else-if="nodeEl.paramName=='sourceFlag'">
                              <el-select v-model="requireInfoObj[key]"  v-if="productDataMount">
                                  <el-option
                                  v-for="item in requireSourceFlagV"
                                  :key="item.id"
                                  :label="item.desc"
                                  :value="item.id">
                                  </el-option>
                              </el-select>
                            </template>
                             <template v-else-if="nodeEl.paramName=='productId'">
                                <el-select v-model="requireInfoObj[key]"  v-if="productDataMount">
                                    <el-option
                                    v-for="item in productList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </template>
                            <template v-else-if="nodeEl.paramName=='desc'">
                                <ckeditor ref="requireDescRef" :content="requireInfoObj[key]" ></ckeditor>
                            </template>
                            <template v-else-if="nodeEl.eleType=='date'">
                                <el-date-picker v-model="requireInfoObj[key]" type="date" :placeholder="'请选择'+nodeEl.desc" style="width: 100%;" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
                            </template>
                            <template v-else-if="nodeEl.eleType=='textarea'">
                                <el-input type="textarea" :placeholder="'请输入'+nodeEl.desc" v-model="requireInfoObj[key]" :rows="nodeEl.paramName=='desc'?'10':'3'"></el-input>
                            </template>   
                            <template v-else-if="nodeEl.eleType=='number'">
                                <el-input  :placeholder="'请输入'+nodeEl.desc" v-model.number="requireInfoObj[key]" ></el-input>
                            </template>   
                            <template v-else>
                                <el-input  :placeholder="'请输入'+nodeEl.desc" v-model="requireInfoObj[key]" ></el-input>
                            </template>
                        </el-form-item>
                    </div>
                </template>
            </el-form>
        </div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @open="cleanDialog()" :destroy-on-close="false" ref="dialog" :close-on-click-modal="false" :close-on-press-escape="false" :append-to-body="true" class="trivialDialog">
         
          <ecoFileUploadPopup v-if="dialogTab=='addFile'" modular="bmsRequire" :modularInnerId="''+this.requireId" ref="addFileWin"></ecoFileUploadPopup>
         
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
import {getRequireDetail,dealException,openLoading,closeLoading,requireStatusV,updateRequireAjax,addActionLogForEdit,getProductList,requireSourceFlagV,getRequireFileList,_isPreviewFile } from "@/modules/bmsMmm/service/service.js";
import { formatFileSize,deleteFileDataServer } from "@/modules/bmsBa/service/service.js";
import ecoFileUploadPopup from '@/modules/bmsMmm/component/ecoFileUploadPopup.vue';
import { FormItemEl } from "@/modules/bmsBa/util/FormItemEl.js";
import { TableColEl } from "@/modules/bmsBa/util/TableColEl.js";
import {mapMutations} from 'vuex';
import ckeditor from "@/modules/bmsMmm/component/ckeditor.vue";
export default{
  name:'editRequire',
  components:{
      ecoFileUploadPopup,
      ckeditor
  },
  data(){
    return {
      requireId:'',
      requireInfoObj:{},
      oriRequireInoObj:{},
      dataMountedFlag : false,
      requireFormItemInfo:new FormItemEl()
        .add("标题","title",'',true,'textarea')
        .add("状态","status",'',false,'')
        .add("关联产品","productId",'',false,'')
        .add("优先级","priority",'',false,'')
        .add("需要来源","sourceFlag",'',false,'')
        .add("来源备注","sourceDesc",'',false,'')
        .add("要求完成时间","expectFinishDate",'',false,'date')
        .add("附件","attachment",'',true,'')
        .add("详情描述","desc",'',true,'textarea'),
      requireFormRules: {
        title: [
          { required: true, message: '请填写标题' }
        ],
        status: [
          { required: true, message: '请选择状态' }
        ],
        productId: [
          { required: true, message: '请选择关联产品' }
        ],
      },
      pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '明天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '后天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 2);
              picker.$emit('pick', date);
            }
          }]
      },
      requireStatusV,
      requireSourceFlagV,
      productList:[],
      productDataMount:false,
      dialogVisible:false,
      dialogTitle:'',
      dialogTab:'',
      requireFileList:[],
      fileTableColEl: new TableColEl()
        .add("文档名称","name",'300','',false,false,false)  
        .add("大小","size",'100',"",false,false,false)
        .add("上传人","createUserName",'80',"",false,false,false)
        .add("上传时间","createDate",'140',"",false,false,false)
        .add("操作","op",'150',"",false,false,false),
    }
  },
  created(){
    //console.log("this.$parent.$parent.focusRequireId:"+this.$parent.$parent.focusRequireId);
    this.initData();
  },
  mounted(){
    
  },
  methods: { 
    initData(){
      if(typeof this.$parent.$parent.seq_num=="undefined"){
        this.requireId = this.$parent.$parent.focusRequireId;
      }else{
        this.requireId = this.$parent.$parent.seq_num;
      }
      this.getProductListFunc();
      this.getRequireInfo();
    },
    setSaveData(data){
      let obj = {};
      for (let i in data) {
        obj[i] = data[i];
      }
      obj.taskId = this.taskId;
      obj.time = new Date().getTime();
      obj.desc = this.$refs.requireDescRef[0].getCkeditorData();
      return obj;
    },
    save(){
      let formValid = false;
      this.$refs['requireForm'].validate((requireFormValid) => {
          if (requireFormValid) {
              formValid = true;
          }
      });
      console.log("formValid:" + formValid);
      if(formValid){
        updateRequireAjax(this.requireId , this.setSaveData(this.requireInfoObj)).then((res)=>{
              console.log("submit  done!!res.data:"+res.data);
              if (res.data&&res.data.id){
                console.log("new id:"+res.data.id);
                addActionLogForEdit(this.requireFormItemInfo , this.oriRequireInoObj , this.requireInfoObj , 'require',this.requireId , '','edit');
                this.$message({type: 'success',message: '需求编辑成功！'});
                try{
                  this.$parent.$parent.dialogVisible = false;
                  this.$parent.$parent.$parent.$parent.$parent.getRequireListFunc();
                }catch(e){
                  this.$parent.$parent.callBackForDialogEdit(this.requireId);
                  this.$parent.$parent.dialogVisible = false;
                }
              }else{
                this.$message({type: 'error',message: '需求编辑失败！'});
              }
        }).catch((error)=>{
              dealException(error);
              this.$message({type: 'error',message: '需求编辑失败！'});
        });
      }
    },
    cleanInfo(){
       this.requireId='';
       this.requireInfoObj={};
    },
    getRequireInfo(){
      getRequireDetail(this.requireId).then((response)=>{
        if (response.data&&response.data.id){
            this.requireInfoObj = response.data;
            this.oriRequireInoObj = JSON.parse(JSON.stringify(this.requireInfoObj));
            this.getRequireFileListFunc();
            this.dataMountedFlag = true;
        }
      }).catch((error)=>{
         dealException(error);
      });
    },
    getProductListFunc() {
      getProductList().then(response => {
        this.productList = response.data.rows;
        this.productDataMount = true;
      })
      .catch(error => {
          dealException(error);
      });
    },
    toAddAttachment(){
      this.dialogTitle="添加附件";
      this.dialogTab = 'addFile';
      this.dialogVisible = true;
    },
    cleanDialog(){

    },
    getRequireFileListFunc(){
      this.openLoading();
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
            this.closeLoading();
        }).catch(error => {
          console.log("error:"+error);
          this.closeLoading();
        });
    },
    deleteFile(fileId,fileName){
      this.$confirm('确定要删除文档“'+fileName+'”吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //console.log("fileId"+fileId);
        deleteFileDataServer(fileId).then(response => {
          this.$message({type: 'success',message: '删除成功！'});
          this.getRequireFileListFunc();      
        }).catch(error => {
          console.log("error:"+error);
          this.$message({type: 'error',message: '删除失败！'});
        });
      }).catch((error) => {console.log("error:"+error);});
    },
    doFilePreviewAction,
    doFileDownloadAction,
    _isPreviewFile,
    openLoading,
    closeLoading
  },
  watch: {

  }
}
</script>
<style scpoe>
.el-select{
  width: 100%;
}
</style>
