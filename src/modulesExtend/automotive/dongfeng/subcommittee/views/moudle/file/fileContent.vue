<template>
 <div class="fileContent">
    <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
      <iframe style="height:100%;width:100%;" :src="'/fileManager/file_preview.html?fileHeaderId='+fileHeaderId+'&fileName='+encodeURIComponent(fileName)"></iframe>
 </div>
</template>

<script>
import ecoLoading from '@/components/loading/ecoLoading.vue'
export default {
 name: 'fileContent',
 components:{
    ecoLoading
 },
 props:{
   fileobj:{
     fileHeaderId:'',
     fileName:''
   }
 },
 data () {
 return {
   fileHeaderId:'',
   fileName:'',
 }
 },
 mounted() {
   this.fileHeaderId=this.fileobj.fileHeaderId
   this.fileName=this.fileobj.fileName
 },
 watch:{
   'fileobj.fileHeaderId':function (newValue,oldValue) {
      this.fileHeaderId=newValue
    },
   'fileobj.fileName':function (newValue,oldValue) {
      this.fileName=newValue
    }
 }
}
</script>

<style scoped >
.fileContent{
  padding: 20px;
  height: 100%;
}
</style>
