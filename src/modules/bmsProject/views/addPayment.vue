<template>
    <div >
        <el-form label-width="95px" ref="myform" :rules="rules" :model="paymentInfoObj">
            <template v-for="(nodeEl,key) in formItemInfo" >
                <div :key="nodeEl.paramName" :style="{'width':(nodeEl.isWholeRow ? '98%' : '49%')}" class="formItemDiv" :ref="'i_'+nodeEl.paramName">
                    <el-form-item :label="nodeEl.desc" :prop="nodeEl.paramName" >
                        <template v-if="nodeEl.paramName=='paymtType'">
                            <el-select  :placeholder="'请选择'+nodeEl.desc" v-model="paymentInfoObj[key]" style="width: 100%;" @change="setPaymentTypeStyle">
                                <el-option v-for="(kvEl,index) in projectPaymentTypeV" :key="index" :label="kvEl.desc" :value="kvEl.id"></el-option>
                            </el-select>
                        </template>
                        <template v-else-if="nodeEl.paramName=='taxType'">
                          <el-select  :placeholder="'请选择'+nodeEl.desc" v-model="paymentInfoObj[key]" clearable style="width: 150px;margin-right:10px;" @change="setDefaultTaxAmt">
                              <el-option v-for="(kvEl,index) in kvInfo.getKvListByGroupDesc(nodeEl.kvGroupDesc)" :key="index" :label="kvEl.text" :value="kvEl.id"></el-option>
                          </el-select>
                          ----->>
                          增值税金额
                          <el-input placeholder="请输入增值税金额" v-model="paymentInfoObj['valueAddedTaxAmt']"  style="width: 150px;margin-left:5px;margin-right:10px;"></el-input>
                          附加税金额
                          <el-input placeholder="请输入附加税金额" v-model="paymentInfoObj['superTaxAmt']"  style="width: 150px;margin-left:5px;margin-right:10px;"></el-input>
                          印花税金额
                          <el-input placeholder="请输入印花税金额" v-model="paymentInfoObj['stampTaxAmt']"  style="width: 150px;margin-left:5px;margin-right:10px;"></el-input>
                        </template>
                        <template v-else-if="nodeEl.paramName=='attachment'">
                            <el-table :data="eventFileList"  stripe style="width: 100%" v-if="eventFileList!=null && eventFileList.length > 0" header-row-class-name="hiddenRow" row-class-name="tinyRow" class="detTable">
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
                        <template v-else-if="nodeEl.kvGroupDesc!=''">
                            <template v-if="nodeEl.eleType=='radio'">
                                <el-radio-group v-model="paymentInfoObj[key]">
                                    <el-radio v-for="(kvEl,index) in kvInfo.getKvListByGroupDesc(nodeEl.kvGroupDesc)" :key="index" :label="kvEl.id">{{kvEl.text}}</el-radio>
                                </el-radio-group>
                            </template>
                            <template v-else>
                                <el-select  :placeholder="'请选择'+nodeEl.desc" v-model="paymentInfoObj[key]" style="width: 100%;">
                                    <el-option v-for="(kvEl,index) in kvInfo.getKvListByGroupDesc(nodeEl.kvGroupDesc)" :key="index" :label="kvEl.text" :value="kvEl.id"></el-option>
                                </el-select>
                            </template>
                        </template>
                        <template v-else-if="nodeEl.eleType=='textarea'">
                            <el-input type="textarea" :placeholder="'请输入'+nodeEl.desc" v-model="paymentInfoObj[key]" rows="3"></el-input>
                        </template>
                        <template v-else-if="nodeEl.eleType=='date'">
                            <el-date-picker v-model="paymentInfoObj[key]" type="date" :placeholder="'请选择'+nodeEl.desc" style="width: 100%;" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
                        </template>
                        <template v-else>
                            <el-input  :placeholder="'请输入'+nodeEl.desc" v-model="paymentInfoObj[key]" ></el-input>
                        </template>
                    </el-form-item>
                </div>
            </template>

        </el-form>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @open="cleanDialog()" :destroy-on-close="false" ref="dialog" :close-on-click-modal="false" :close-on-press-escape="false" :append-to-body="true" class="trivialDialog">

          <ecoFileUploadPopup v-if="dialogTab=='addFile'" modular="bmsProjectEvent" :modularInnerId="''+this.paymentInfoObj['id']" ref="addFileWin"></ecoFileUploadPopup>

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
import axios from 'axios';
import {baseUrl} from '@/modules/bmsMmm/config/env';
import {doFilePreviewAction,doFileDownloadAction} from "@/modules/bmsMmm/util/utility.js";
import {openLoading,closeLoading,_isPreviewFile } from "@/modules/bmsMmm/service/service.js";
import { projectPaymentTypeV,addProjectEventAjax,getEventFileList,setDefaultTaxAmt,setPaymentTypeStyle } from "@/modules/bmsProject/service/service.js";
import { formatFileSize,deleteFileDataServer } from "@/modules/bmsBa/service/service.js";
import { FormItemEl } from "@/modules/bmsBa/util/FormItemEl.js";
import { KvGroup } from "@/modules/bmsBa/util/KvGroup.js";
import { TableColEl } from "@/modules/bmsBa/util/TableColEl.js";
import ecoFileUploadPopup from '@/modules/bmsMmm/component/ecoFileUploadPopup.vue';
import {mapMutations} from 'vuex';
export default{
  name:'addPayment',
  components:{
      ecoFileUploadPopup
  },
  data(){
    return {
      newEventId:'',
      projectId:'',
      paymentInfoObj:{},
      kvInfo:new KvGroup(),
      formItemInfo:new FormItemEl()
        .add("发生时间","paymtDate",'',false,'date')
        .add("类型","paymtType",'',false)
        .add("款项种类","stage",'paymentStage',false)
        .add("金额","paymtAmt",'',false)
        .add("税费类别","taxType",'taxType',true)
        .add("备注","subject",'',true,'textarea')
        .add("附件","attachment",'',true),

      rules: {
        paymtDate: [
          { required: true, message: '请选择发生时间', trigger: 'blur' }
        ],
        paymtType: [
          { required: true, message: '请选择收付款类型', trigger: 'blur' }
        ],
        stage: [
          { required: true, message: '请选择款项种类', trigger: 'blur' }
        ],
        paymtAmt: [
          { required: true, message: '请填写金额', trigger: 'blur' }
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
      dialogTab:'',
      projectPaymentTypeV
    }
  },
  created(){
    this.kvInfo = this.$parent.$parent.kvInfo;
    this.projectId = this.$parent.$parent.projectId;
    //console.log("###this.projectId in create:" + this.projectId);
    this.initData();
  },
  mounted(){
  },
  methods: {
    cleanDialog(){
    },
    cleanInfo(){
      this.projectId='';
      this.paymentInfoObj={};
      this.eventFileList=[];
      this.initData();
    },
    setProjectId(projectId){
      this.projectId = projectId;
    },
    setSaveData(data){
      let obj = {};
      for (let i in data) {
        obj[i] = data[i];
      }
      obj.projectId = this.projectId;
      obj.categoryId = 5;
      obj.time = new Date().getTime();
      return obj;
    },
    save(){
      this.$refs['myform'].validate((valid) => {
          if (valid) {
            //console.log("submit!!");
            //return;
            this.$parent.$parent.openLoading();
            addProjectEventAjax(this.setSaveData(this.paymentInfoObj)).then((res)=>{
              console.log("submit  done!!res.data:"+res.data);
              if (res.data&&res.data.id){
                console.log("new id:"+res.data.id);
                this.$parent.$parent.dialogVisible = false;
                this.$parent.$parent.focusPanelName = "fin";
                this.$parent.$parent.setTabPanel();
                this.$message({type: 'success',message: '添加成功！'});
              }else{
                this.$message({type: 'error',message: '添加失败！'});
              }
            }).catch((error)=>{
              this.$parent.$parent.closeLoading();
              console.log("error:"+error);
              this.$message({type: 'error',message: '添加失败！'});
            })
          } else {
            //console.log("invalid!!");
            return false;
          }
      });
    },
    toAddAttachment(){
      this.dialogTitle="添加附件";
      this.dialogTab = 'addFile';
      this.dialogVisible = true;
    },
    async initData(){
      await axios.get(baseUrl+'/bms/public/getId',{
        params:{
          time:new Date().getTime()
        }
      }).then(response => {
        this.newEventId = response.data;
        //console.log("newEventId:"+this.newEventId);
        this.paymentInfoObj['id'] = this.newEventId;
        this.paymentInfoObj = {...this.paymentInfoObj};
      }).catch(error => {
          dealException(error);
      });
    },
    callBackForUploadFile(){
        this.getEventFileListFunc();
    },
    getEventFileListFunc(){
      this.openLoading();
      getEventFileList(this.newEventId ).then(response => {
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
    openLoading,
    closeLoading,
    doFilePreviewAction,
    doFileDownloadAction,
    _isPreviewFile,
    setDefaultTaxAmt,
    setPaymentTypeStyle
  },
  watch: {

  }
}
</script>
<style >

</style>
