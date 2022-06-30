<template>
  <eco-content bottom="0px" top="0px" ref="content"  type="tool" class="wfToDoVue" style="background-color:#f5f5f5">
    <div class="noticesDetail">
      <ecoLoading ref='ecoLoadingRef' text="加载中..."></ecoLoading>
      <div class="detailContent" v-show="loading">
        <div class="titleNotice" v-text="title">
        </div>
        <div class="newAllContent">
            <p v-ckeditor="content" v-if="content!=''" ></p>
        </div>
        <!-- <el-tabs v-show="attItems.length > 0" v-model="activeTabName" @tab-click="handleTabClick" class="rsftab">
          <el-tab-pane v-for="(item, index) in attItems" :key="item.id" :label="item.name" :name="item.id">
              <iframe v-if="index==0" :src="'/fileManager/file_preview.html?fileHeaderId='+item.id+'&fileName='+encodeURIComponent(item.name)" :data-src="'/fileManager/file_preview.html?fileHeaderId='+item.id+'&fileName='+encodeURIComponent(item.name)"></iframe>
              <iframe v-if="index!=0" :data-src="'/fileManager/file_preview.html?fileHeaderId='+item.id+'&fileName='+encodeURIComponent(item.name)"></iframe>
          </el-tab-pane>
        </el-tabs> -->
        <div class="attDiv" v-show="attItems.length > 0" style="display:none">
              <div class="appName">
                <span>附件:</span>
              </div>
              <div class="apponRSF" v-for="item in attItems" :key="item.id">
                <span>{{item.name}}
                    <i @click="openByDownload(item)">下载</i>
                    <i></i>
                    <i @click="openByView(item)">预览</i>
                </span>
              </div>
        </div>
    </div>
      <form name="docviewform"  method="get" >
          <input type="hidden" name="fileHeaderId"/>
          <input type="hidden" name="fileName"/>
      </form>
    </div>
    <iframe name="docviewIframe" style="display:none"></iframe>

  </eco-content>
</template>
<script>

import {Loading } from 'element-ui';
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {EcoFile} from '@/components/file/main.js'
import {getNoticeDetail,getFileListByModularInnerId } from '@/modules/rsf/api/notice.js'
export default {
    name:'noticesDetail',
    components:{
      ecoContent,
      ecoLoading
    },
    data(){
        return{
            content:'',
            title:'',
            date:'',
            sender:'',
            detailObj:{},
            attItems:[],
            loading:false,
            activeTabName:'',
            model:'ANNOUNCEMENT_FILE',
            id:''
        }
    },
    created(){
    },
     mounted(){
        let from = this.$route.params.from;
        this.id=this.$route.params.id
        this.loading=true;
        if(from && from == "send"){
        }else{
            // this.noticesReadMarkExistsFunc();
            // this.noticesReadMarkFunc();
        }
        this.getRSFDetailFunc();
        this.getFileList()
    },
    methods: {
      //获取新闻详情
      getRSFDetailFunc(){
          getNoticeDetail(this.id).then(res=>{
             this.title=res.title
             this.content=res.content
          })
      },
      // 获取附件信息
      getFileList(){
        getFileListByModularInnerId(this.model,this.id).then(res=>{
           this.attItems=res
           this.activeTabName = res.id;
        })
      },

      //标记已读
      noticesReadMarkExistsFunc(){
            let id = this.$route.params.id;
            noticesReadMarkExistsAjax(id).then((response)=>{

            }).catch((error)=>{

            })
      },

      noticesReadMarkFunc(){
          let id = this.$route.params.id;
          noticesReadMarkAjax(id).then((response)=>{

          }).catch((error)=>{

          })
      },
      openByDownload(item){
          EcoFile.openFileHeaderByDownload(item.id,item.name);
      },

      openByView(item){
          EcoFile.openFileHeaderByView(item.id,item.modular);
      },
      handleTabClick(item){
        let aIframe = document.querySelectorAll('.rsftab .el-tab-pane iframe');
        if(!aIframe[item.index].src){
          aIframe[item.index].src= aIframe[item.index].getAttribute('data-src');
        }
      }

  }

}

</script>

<style scope>
body,html{
  background: #fff
}
.noticesDetail{
  position: relative;
  height: 96%;
  margin: 0 24px;
  top: 2%;
  overflow-y: hidden;
  min-width: 1131px;
  border: 1px solid #ddd;
  color: #0f1419;
}
.newAllContent{
  max-width: 1024px;
  margin: auto;
  padding-bottom:40px;
  padding-top:40px;
  border-bottom: 1px dashed #ddd;
}

.newAllContent .wfLink{
  color:#1ba5fa;
  text-decoration:underline;
}

.newsBottom{
    display: flex;justify-content: space-between;
    border-top:2px solid #266db4;
    background: #f5f5f5;
}

.newsBottom span{
  margin-right: 10px;
}

.newsBottom p:nth-child(1){
  margin-left: 20px;
  cursor: pointer;
}

.newsBottom p:nth-child(2){
  margin-right: 10px;
}

.attDiv{
  clear: both;
  line-height: 40px;
  margin-bottom: 20px;
  margin:auto;
  max-width:1024px;
}

.appName{
  float: left
}
 .apponRSF{
   padding-left: 40px;
 }
.appName span{
  margin-right: 10px
}
.apponRSF i{
  color:#3891Eb; cursor: pointer; font-style: normal;
}
.apponRSF i:nth-child(1){
  margin-left: 5px;
}
.apponRSF i:nth-child(2){
  color:#999; font-style: normal;
  width: 2px;height: 10px;background: #999;display: inline-block;
  margin-top: 10px;
  margin: 0 2px;
}

.apponRSF i:nth-child(3){
  margin-left: 5px;
}
.apponRSF i:nth-child(4){
  color:#999; font-style: normal;
  width: 2px;height: 10px;background: #999;display: inline-block;
  margin-top: 10px;
  margin: 0 2px;
}
.apponRSF i:nth-child(5){
  margin-left: 5px;
}

.detailContent{
  height: 100%;
  overflow: auto;
  background-color: #fff;
}

.titleNotice{
  max-width: 1024px;
  margin: auto;
  padding-bottom:20px;
  padding-top:20px;
  border-bottom: 1px solid #ddd;
  text-align: center;
  font-size: 28px;
  font-weight: normal;
  font-family: "宋体";
  color: #333;
}
.rsftab{
  max-width: 1024px;
  margin: auto;
}
.rsftab iframe{
  width:100%;
  height: 900px;
}
</style>
