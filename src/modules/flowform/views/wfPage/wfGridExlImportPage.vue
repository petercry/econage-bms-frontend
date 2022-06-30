<template>

      <eco-content top="0px" bottom="0px"  class="wfGridExlImportPage" style="background-color:#fff">
            <div class="title">将Excel文件中的数据导入到对应的数据方阵中</div>
            <div class="title" >文档上传<span class="note">文件扩展名: .xls,.xlsx</span></div>
            <div class="fileDiv">
                 <el-input :value="fileName" placeholder="请选择文件" style="width:400px;" readonly @click="uploadFileClick"></el-input>
                 <el-button type="primary" @click="uploadFileClick" style="margin-left:10px;">上传文件</el-button>
            </div>

            <div v-show="false">
                  <input type="file" accept=".xls,.xlsx" id="uploadFile" @change="changeFile"/>
            </div>  
            <div class="title">导入类型:</div>
            <div class="title" style="margin-bottom:10px">
                 <el-radio-group v-model="upData.saveType">
                        <el-radio label="1" >覆盖</el-radio>
                        <el-radio label="2" >新增</el-radio>
                </el-radio-group>
            </div>

            <div class="title" v-show="upData.saveType == '1'" style="margin-bottom:10px;">从数据方阵的第 <el-input v-model="upData.gridRowIndex" style="width:100px;" size="mini"></el-input> 行开始覆盖 </div>
            <div class="title">从Excel文件的第 <el-input v-model="upData.startIdx" style="width:100px;" size="mini"></el-input> 行开始导入 </div>

            <eco-content  bottom="0px" height="50px" class="wfCategoryDet">
                    <div class="btn">
                        <el-button @click="cancelFunc">取消</el-button>
                        <el-button type="primary" @click="submitUpload">保存</el-button>
                    </div>
            </eco-content>
    </eco-content>


</template>
<script>

  import {doGridExlImpAjax} from '../../service/service'
  import {Loading } from 'element-ui';

  import ecoContent from '@/components/pageAb/ecoContent.vue'
  import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
  import ecoLoading from '@/components/loading/ecoLoading.vue'
  import tagSelect from '../../views/direction/module/tagSelect.vue'
  import {EcoMessageBox} from '@/components/messageBox/main.js'
  import {EcoUtil} from '@/components/util/main.js'
  

  export default {
      components:{
          ecoContent,
          ecoToolTitle,
          ecoLoading,
          tagSelect
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
           let _storeKey = this.$route.params.storeKey;       
           if(_storeKey){
                try{
                    let _storeData = EcoUtil.objDeepCopy(EcoUtil.getSysvm().getTempStore(_storeKey));
                    EcoUtil.getSysvm().deleteTempStore(_storeKey);
                
                    this.upData.operateId = _storeData.operateId;
                    this.upData.itemId = _storeData.itemId;
                    this.upData.gridData = [];

                    this.emitObj = {};
                }catch(e){
                    console.log(e);
                }
           }else{
                this.upData.operateId = _storeKey;
           }
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
                doGridExlImpAjax(this.upData,this.uploadFile).then((response)=>{
                        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                            loadingInstance.close();
                        });

                        if(response.data.status < 99){
                            let doObj = {}
                            doObj.action = 'wfGridExlImportCallBack';
                            doObj.data = {};

                            doObj.data.itemId =  this.upData.itemId;
                            doObj.data.selectObj = {};
                            doObj.data.selectObj.selItems =  EcoUtil.objDeepCopy(response.data.remap.val.valRow);
                        
                            doObj.data.selectObj.emitObj = {};
                            doObj.data.selectObj.emitObj.emitStatus = {};
                            doObj.data.selectObj.emitObj.emitStatus.gridColIndex = 0;
                            
                            if(this.upData.saveType == '1'){ //覆盖
                                doObj.data.selectObj.emitObj.emitStatus.gridRowIndex = this.upData.gridRowIndex -1;
                            }else{
                                doObj.data.selectObj.emitObj.emitStatus.gridRowIndex = this.upData.gridData.length;
                            }

                            doObj.close = true;
                            EcoUtil.getSysvm().callBackDialogFunc(doObj);
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
