<template>
    <div class="ecoDescAttachment" v-if="fileLists && fileLists.length > 0">
            <div class="fileItem" v-for="(item,idx) in fileLists" :key="item.fileHeaderId">
                        <div >
                                <span class="imgType"> <img style="vertical-align: middle;" :src="typeImgList[item.fileType]?typeImgList[item.fileType]:typeImgList['blank']"/></span>
                                <span>{{item.fileName}}&nbsp;(&nbsp;{{item.fileSize}}&nbsp;)</span>
                                <span class="download" @click="fileDownload(item)">下载</span>|<span class="preview" @click="filePreview(item)">预览</span>
                        </div>
            </div>
   </div>
</template>
<script>
import {EcoFile} from '@/components/file/main.js'
import { mapState,mapMutations } from 'vuex';
export default{
  components:{
    
  },
  name:'ecoDescAttachment',
  props:{
    fileLists:{
        type:Array,
        default:function(){
            return [];
        },
        
    },
  },
  data(){
        return {
             model:'TASK_ATTACHMENT',
        }
  },
  created(){
       
  },
  mounted(){
  },
  computed:{
        ...mapState(['typeImgList'])
      },
  methods: {

        filePreview(item){
            EcoFile.openFileHeaderByView(item.fileHeaderId,this.model);
        },

        fileDownload(item){
             EcoFile.openFileHeaderByDownload(item.fileHeaderId,item.fileName);
        },


  },
  watch: {

  }
}
</script>
<style scoped>

.approvalRun1 .ecoDescAttachment{
    margin-left:10px;
}

.ecoDescAttachment .attachment i{
    font-size: 10px;
}

.ecoDescAttachment .attachment{
    margin-left:0px;
    line-height: 20px;
    padding-top:10px;
}

.ecoDescAttachment .attachment .uploadBtn{
    cursor: pointer;
    color:#409eff;
}

.ecoDescAttachment  .fileItem{
    color: #606266;
    margin-left:0px;
    line-height: 20px;
    margin-bottom:5px;
    margin-top:5px;
}

.ecoDescAttachment .fileItem .download{
    margin-right:5px;
    cursor: pointer;
    color:#3891eb;
}

.ecoDescAttachment .fileItem .preview{
    margin-left:5px;
    cursor: pointer;
    color:#3891eb;
}

.ecoDescAttachment .fileItem .delete{
    margin-left:5px;
    cursor: pointer;
    color:#67c23a;
}

.ecoDescAttachment .fileItem .recovery{
    margin-left:5px;
    cursor: pointer;
    color:#e03a3a
}

.ecoDescAttachment .fileItem .imgType{
    width:16px;
    height:16px;
}
</style>
