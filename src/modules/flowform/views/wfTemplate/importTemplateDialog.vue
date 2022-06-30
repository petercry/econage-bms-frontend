<template>
      <eco-content top="0px" bottom="0px"  class="wfGridExlImportPage" style="background-color:#fff">
            <div class="title" >文档上传<span class="note">文件扩展名: .xml</span></div>
            <div class="fileDiv">
                 <el-input :value="fileName" placeholder="请选择文件" style="width:400px;" readonly @click="uploadFileClick"></el-input>
                 <el-button type="primary" @click="uploadFileClick" style="margin-left:10px;">上传文件</el-button>
            </div>

            <div v-show="false">
                <input type="file" accept=".xml" id="uploadFile" @change="changeFile"/>
            </div>  
        
            <eco-content  bottom="0px" height="50px" class="wfCategoryDet">
                    <div class="btn">
                        <el-button @click="cancelFunc">取消</el-button>
                        <el-button type="primary" @click="submitUpload">保存</el-button>
                    </div>
            </eco-content>
    </eco-content>


</template>
<script>

  import {importWFTemplateSingle} from '../../service/service'
  import {Loading } from 'element-ui';
  import ecoContent from '@/components/pageAb/ecoContent.vue'
  import ecoLoading from '@/components/loading/ecoLoading.vue'
  import {EcoMessageBox} from '@/components/messageBox/main.js'
  import {EcoUtil} from '@/components/util/main.js'
  

  export default {
      components:{
          ecoContent,
          ecoLoading,
      },
      data(){
          return{ 
             upData:{
                 itemId:null,
                 gridData:[],
                 startIdx:2,
                 saveType:"1",
                 operateId:null,
                 gridRowIndex:1,
             },
      
             fileName:null,
             uploadFile:[],
             emitObj:{},
          }
      },
      created(){

      },
      mounted(){
         
      },

      computed:{
           
      },
      methods: {
            uploadFileClick(){
                document.getElementById("uploadFile").click();
            },

            changeFile(e){
                let _file = e.target.files[0];
                if(_file && _file.name){
                    this.fileName = _file.name;
                    this.uploadFile = [{name:_file.name,file:_file,id:new Date().getTime()}];
                }else{
                    this.fileName = null;
                    this.uploadFile = [];
                }
                document.getElementById("uploadFile").value = "";
            },

            submitUpload(){
                if(this.uploadFile.length == 0){
                    EcoMessageBox.alert('请选择上传文档');
                    return ;
                }

                let loadingInstance  = Loading.service({ fullscreen: true,text:'正在上传处理文档...',lock:true});
                importWFTemplateSingle(this.uploadFile).then((response)=>{
                        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                            loadingInstance.close();
                        });
                        if(response.data.status < 99){
                            if(response.data.remap.msg && response.data.remap.msg.length > 0){
                                let _msg = '导入成功!有以下警告！<br>'
                                _msg += response.data.remap.msg.join('<br>');
                                this.$message({
                                     dangerouslyUseHTMLString: true,
                                     message: _msg,
                                     type: 'warning',
                                     showClose: true,
                                     duration:0
                                });
                            }else{
                                this.$message({
                                     message: '导入成功',
                                     type: 'success',
                                });
                            }
                        }else{
                             this.$message({
                                message:'导入失败',
                                type: 'error'
                            });
                        }
                })
            },

            cancelFunc(){
                let doObj = {}
                doObj.data = {};
                doObj.close = true;
                EcoUtil.getSysvm().callBackDialogFunc(doObj);
            },

      }

  }

</script>

<style scoped>
.wfGridExlImportPage{
    background-color: #fff;
}

.wfGridExlImportPage .title{
    font-size: 14px;
    color: #606266;
    height: 32px;
    line-height: 32px;
    font-weight: 700;
    text-align: left;
}

.wfGridExlImportPage .note{
    font-size: 12px;
    color:#8b8b8b;
    font-weight: 400;
    margin-left:10px;
}

.wfGridExlImportPage .fileDiv{
    margin-bottom:20px;
}



.wfGridExlImportPage .op{
    margin:10px 0px 20px 0px;
}

.wfGridExlImportPage .upload-demo{
    
}

.wfGridExlImportPage .btn{
    text-align: right;
    margin-right:10px;
    margin-top:10px;
}
</style>
