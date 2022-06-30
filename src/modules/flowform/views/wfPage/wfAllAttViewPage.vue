<template>
  <eco-content top="0px" bottom="0px" class="wfAllAttViewVue">
    
    <eco-content top="0px" height="42px" >
            
        <el-tabs v-model="tabActive"  @tab-click="handleClick" style="margin:0px 10px;">
            <el-tab-pane :label="item.fileShootName" :name="item.fileHeaderId" v-for="(item,idx) in fileList" :key="idx"></el-tab-pane>
        </el-tabs>

    </eco-content>
    
    <eco-content bottom="0px" top="42px" ref="content" class="ecoContentClass"  style="padding:0px;">
        <div class="openIframeDiv">
            <iframe v-bind:src='getIframeSrc' frameborder="0" class="ifr"></iframe>
        </div>
    </eco-content>
  </eco-content>
</template>
<script>

  import {getWFAllAttachment} from '../../service/service'
  import {Loading } from 'element-ui';
  import ecoContent from '@/components/pageAb/ecoContent.vue'
  import {EcoMessageBox} from '@/components/messageBox/main.js'
  import {EcoUtil} from '@/components/util/main.js'
  

  export default {
      components:{
          ecoContent,
   
      },
      data(){
          return{ 
            operate_id:null,
            tabActive:null,
            fileList:[],
            fileHeaderId:null,
            fileName:null,
          }
      },
      created(){
          this.operate_id = this.$route.params.operate_id;
          this.getWFAllAttachmentFunc();
      },
      mounted(){
          
      },
      computed:{
         getIframeSrc:function(){
            if(this.fileHeaderId && this.fileHeaderId!=null){
                 return "/fileManager/file_preview.html?fileHeaderId="+this.fileHeaderId+"&fileName="+encodeURIComponent(this.fileName);
            }else{
                return null;
            }
         }
      },
      methods: {
         getWFAllAttachmentFunc(){
             let loadingInstance  = Loading.service({ fullscreen: true,text:'正在加载数据...',lock:true});
             getWFAllAttachment(this.operate_id).then((response)=>{
                 this.fileList = response.data.remap.list;
                 ( this.fileList).forEach(element => {
                     element.fileShootName = this.getTabShotName(element.fileName);
                   
                 });

                 if(this.fileList.length > 0){
                    this.tabActive = this.fileList[0].fileHeaderId;
                    this.fileHeaderId = this.fileList[0].fileHeaderId;
                    this.fileName = this.fileList[0].fileName;
                 }
                 this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close();
                 });
             })
         },

         handleClick(tab){
             for(let i = 0;i<this.fileList.length;i++){
                 if(this.tabActive == this.fileList[i].fileHeaderId){
                     this.fileHeaderId = this.fileList[i].fileHeaderId;
                     this.fileName = this.fileList[i].fileName;
                     break;
                 }
             }
         },

           getTabShotName(name){
                let tempName = name;
                if(name){
                    let length = name.length;
                    if(length > 10){
                        length = 10;
                        tempName =  name.substring(0,10)+"...";
                    }
                }
                return tempName;
            }
      }
  }

</script>

<style>

.wfAllAttViewVue .el-tabs__header{
    margin:0px;
}
</style>

<style scoped>
 .wfAllAttViewVue .openIframeDiv{
   position: absolute;
   width: 100%;
   height: 100%;
   background: #fff;
 }

 .wfAllAttViewVue .ifr{
      width: 100%;
      height: 100%;
      position: absolute;
  }
</style>
