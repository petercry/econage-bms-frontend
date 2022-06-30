<template>
  <div >
    <el-upload
          class="upload-demo"
          :action="importFileUrl"
          :data="upLoadData"
          :on-success="fileSuccessCallBack"
          :on-error="fileErrorCallBack"
          :on-remove="handleRemove"
          multiple
          :limit="999"
          :file-list="fileList">
          <el-button size="mini" type="primary">{{btnName}}</el-button>
    </el-upload>
  </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs';
//全局设置超时时间 600s
axios.defaults.timeout = 600000;
import {baseMainServerUrl} from '@/system/config/env'
export default {
  name:'ecoFileUpload',
  props: {
      model:{
          type:String,
          default:''
      },
      modelInnerId:{
          type:String,
          default:''
      },
      forwardFile:{
         type:Boolean,
         default:false
      },
      btnName:{
          type:String,
          default:'上传附件'
      }
  },
  data() {
    return {
        fileList: [],
      //  baseMainServerUrl:'http://localhost:9090/wh/servlet/MainServletV3TestAjaxServlet',
        baseMainServerUrl:'/wh/servlet/MainServer',
    //    importFileUrl:'http://localhost:9090/wh/servlet/MainServletV3TestAjaxServlet?cmd=EccmFileManagerSingle&_method=create&set_token_flag=N&model='+this.model+'&modelInnerId='+this.modelInnerId,
        importFileUrl:'/wh/servlet/MainServer?cmd=EccmFileManagerSingle&_method=create&set_token_flag=N&model='+this.model+'&modelInnerId='+this.modelInnerId,
        upLoadData: {},
        upfileList: [],
    };
  },
  mounted(){
  //    this.initFile();
  },
  created(){

  },
  computed:{

  },
  methods:{
    initFile(){
        if(this.modelInnerId && this.modelInnerId !=''){
          axios.get(this.baseMainServerUrl,{
              params: {
                 cmd:'EccmFileManagerList',
                 set_token_flag:'N',
                 action:'modelFileList',
                 _method:'read',
                 model:this.model,
                 modelInnerId:this.modelInnerId,
                 time:new Date().getTime()
              }
          }).then((response)=>{
              for(let i = 0;i<response.data.rows.length;i++){
                  let tempAttItem = response.data.rows[i];
                  let  attItem = {};
                  attItem.name = tempAttItem.fileName;
                  attItem.size = tempAttItem.size;
                  attItem.response = {};
                  attItem.response.queryObj = tempAttItem;
                  attItem.forwardFile = this.forwardFile;
                  this.fileList.push(attItem);
                  this.upfileList.push(attItem);
             }
          }).catch((e)=>{

          })
        }
    },

    fileSuccessCallBack(response,file,fileList){
        this.upfileList = fileList;
    },
    fileErrorCallBack(err,file,fileList){

    },
    handleRemove(file, fileList) {
         let headerId = file.response.queryObj.id;
         let model = this.model;
         let forwardFile = file.forwardFile;

         if(forwardFile){
              this.upfileList = fileList;
         }else{
             //数据库删除
             axios.post(this.baseMainServerUrl,qs.stringify({
                  cmd:'EccmFileManagerSingle',
                  flag:'EccmFileManagerSingle',
                  _method:'destroy',
                  set_token_flag:'N',
                  fileHeaderId:headerId,
                  model:model,
                  time:new Date().getTime()
             }),{traditional:true}).then((response)=>{
                  this.upfileList = fileList;
             }).catch((e)=>{

             })
         }
     },

     getAddFileHeaderIds(){
         let fileHeaderIds = [];
         this.upfileList.forEach((item)=>{
              if(!item.forwardFile){
                  fileHeaderIds.push(item.response.queryObj.id);
              }
         })
         return fileHeaderIds;
     },

     getAddFileForwardHeaderIds(){
         let fileHeaderIds = [];
         this.upfileList.forEach((item)=>{
              if(item.forwardFile){
                    fileHeaderIds.push(item.response.queryObj.id);
              }
         })
         return fileHeaderIds;
     }

  },

  destroyed(){

  },
  watch: {
        modelInnerId(v,ov){
            this.initFile();
        }
  }

};

</script>

<style scoped>


</style>
