<template>
<div class="fileCard">
    <!-- 正文 -->
    <ecoLoading ref='ecoLoadingRef' text="加载中"></ecoLoading>
    <eco-content top="0" ref="cardTitle" style="padding:20px">
        <div class="top-content" style="border-bottom: 1px solid #eee;">
            <p>{{this.pathUrl}}</p>
            <p style="fontWeight:700">{{entryInfo['name']}}</p>
            <p><span><span style="marginRight:4px">{{entryInfo['createUser']}}上传于</span>{{entryInfo['createDate']}}</span><span style="margin:0 20px">|</span><span>{{extInfo.downloadCount}}次下载</span><span style="margin:0 20px">|</span><span></span>{{extInfo.clickCount}}次点击
            <el-button type="text" style="marginLeft:24px" @click="fileDownLoad">下载</el-button>
            <el-button type="text" @click="fileEditOnline">在线编辑</el-button>
            </p>
        </div>
    </eco-content>
    <eco-content bottom="60px" top="160px" ref="cardContent">
        <fileContent v-show="activeTab=='content'" :fileobj="fileInfo"></fileContent>
        <fileInfo v-if="activeTab=='info'" :entryobj="entryInfo"></fileInfo>
        <fileOpHistory v-show="activeTab=='history'" > </fileOpHistory>
    </eco-content>
    <eco-content bottom="0px" height="60px" style="overflow:hidden;padding:0 6px">
        <div class="file-card-bottom">
            <el-button @click="showTab('content')"><i class="el-icon-view" style="color:#409eff;fontSize:18px;marginRight:3px"></i>正文</el-button>
            <el-button @click="showTab('info')"><i class="el-icon-view" style="color:#409eff;fontSize:18px;marginRight:3px"></i>文档信息</el-button>
            <el-button @click="showTab('history')"><i class="el-icon-view" style="color:#409eff;fontSize:18px;marginRight:3px"></i>操作历史</el-button>
        </div>
    </eco-content>
    <form name="docviewform"  method="get" >
          <input type="hidden" name="fileHeaderId"/>
          <input type="hidden" name="fileName"/>
          <input type="hidden" name="fileHeaderIds"/>
      </form>
      <iframe name="docviewIframe" style="display:none"></iframe>
</div>
</template>

<script>
import { getFileDetail,addDownloadRecord} from '@/modules/knowledge/api/knowledge.js'
import {EcoFile} from '@/components/file/main.js'
import fileContent from './fileContent'
import fileInfo from './fileInfo'
import fileOpHistory from './fileOpHistory'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
export default {
    name: 'fileCard',
    components: {
        fileContent,
        fileInfo,
        fileOpHistory,
        ecoContent,
        ecoLoading
    },
    data() {
        return {
            activeTab: 'content',
            fileInfo:{
               fileHeaderId:'',
               fileName:''
            },
            infoObj:{},
            extInfo:{},
            entryInfo:{},
            id:'',
            pathUrl:'',
            baseId:''
        }
    },
    created(){
      this.id=this.$route.params.id
      this.getFileInfo()
    },
    methods: {

        showTab(flag) {
            this.activeTab = flag
        },
        getFileInfo(){
            getFileDetail(this.id).then(res=>{
              let pathArr=[]
              res.path.forEach(item => {
                  pathArr.push(item.name)
              });
              this.pathUrl=pathArr.join(' > ')
              this.infoObj=res
              this.extInfo=res.extInfo
              this.entryInfo=res.entry
              this.fileInfo.fileHeaderId=res.entry.fileHeaderId
              this.fileInfo.fileName=res.entry.name
              this.baseId=res.entry.baseId
            })
        },
        fileDownLoad(){
          this.addDownloadRecord()
          EcoFile.openFileHeaderByDownload(this.fileInfo.fileHeaderId,this.fileInfo.fileName);
        },
        fileEditOnline(){
          EcoFile.openFileHeaderByEdit(this.fileInfo.fileHeaderId,this.fileInfo.fileName)
        },
        // 添加点击记录
        addDownloadRecord(){
          addDownloadRecord(this.id).then(res=>{
             this.extInfo.downloadCount++
          })
        }
    },
}
</script>

<style>
.fileCard {
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
    color: #0f1419;
}

.bread-brumbs {
    padding: 20px;
    font-size: 14px;
}

.file-card-bottom {
    border-top: 1px solid #eee;
    /* padding-left: 50px; */
    line-height: 60px;
}

/* .file-card-bottom .iconfont{
  color: #1188ff;
} */
.file-card-bottom .el-button {
    border: none;
    outline: 0;
}
.top-content p{
  line-height: 40px;
}
</style>
