<template>
    <el-dialog  custom-class="ecoDialog" :title="dialog.title" :visible.sync="dialog.show" :width="dialog.width+'px'" :top="dialog.top"  :append-to-body="true" @close="clear" @closed="closedDialog" :close-on-click-modal="dialog.closeOnClickModal" :show-close="dialog.showClose" :fullscreen="dialog.fullscreen" :close-on-press-escape="dialog.closeOnPressEscape">
        <iframe ref="openIframe" :name=id :id=id  v-bind:src="dialog.url" frameborder="0" style="width:100%;"  v-bind:style="{'height':dialog.height}"/>
   </el-dialog>
</template>

<script>


import { Loading } from 'element-ui';
export default {
  name:'ecoDialog',
  components:{

  },
  props: {
      id:{
          type:String,
          default:''
      }
  },
  data () {
    return {
        dialog:{},
        index:-1,
        url:'',
    }
  },
  mounted(){

  },
  created(){

  },
  methods:{
      open(dialog,_window){
          let formObj = null;
          if(typeof(dialog.url) == "object"){
            formObj = dialog.url;
            if(window.sysSetting && window.sysSetting.ngrootUrl){
                this.url = window.sysSetting.ngrootUrl + '/page/blank.html';
            }else{
                this.url = '/page/blank.html';
            }
          }else{
              this.url = dialog.url;
          }
          dialog.url = '';
          this.dialog = dialog;
          if(this.dialog.fullscreen) {
                this.dialog.height = "100%";
            } else {
                this.dialog.height = this.dialog.height + 'px';
            }
          this.initIframe(_window,formObj);
      },

      initIframe(_window,formObj){


          let that = this;
          setTimeout(()=>{
              let iframe = document.getElementById(that.id);
              if(iframe){
                  that.onloadIframe(_window,formObj);
              }else{
                  that.initIframe(_window,formObj);
              }
          },200)
      },

      onloadIframe(_window,formObj){
          try{
              let iframe = document.getElementById(this.id);
              if(iframe){
                  if(formObj){
                      formObj.setAttribute('target',this.id);
                      formObj.submit();
                  }else{
                      var that = this;
                      iframe.onload = iframe.onreadystatechange = function() {
                           if (this.readyState && this.readyState != 'complete'){
                              return;
                           } else {
                             if(that.dialog && that.dialog.url !=""){
                                    if(iframe.contentWindow && iframe.contentWindow.setPopWin){
                                        iframe.contentWindow.setPopWin(_window);
                                    }
                             }
                           }
                      }
                     if(window.sysSetting && window.sysSetting.ngrootUrl){

                         this.dialog.url = window.sysSetting.ngrootUrl + this.url;
                     }else if(window.parent.sysSetting && window.parent.sysSetting.ngrootUrl){

                         this.dialog.url = window.parent.sysSetting.ngrootUrl + this.url;
                     }else{
                         this.dialog.url = this.url;
                     }

                  }
              }
          }catch(e){

          }
      },
      closeDialog(){
          this.dialog.show = false;
      },
      clear(){
          let iframe = document.getElementById(this.id);
          if(iframe){
              var that = this;
              iframe.onload = iframe.onreadystatechange = null;
              try{iframe.contentWindow.closeOP();}catch(e){}
          }
          this.dialog.title = '';
          this.dialog.width = '';
          this.dialog.height = '';
          this.dialog.url = '';
          let url = '';
          if(window.sysSetting && window.sysSetting.ngrootUrl){
                url = window.sysSetting.ngrootUrl + '/page/blank.html';
            }else{
                url = '/page/blank.html';
            }
          document.getElementById(this.id).src = url;
          this.$emit('closeDialog',{});
      },

      closedDialog(){

          if(this.dialog.closedDialogCallBack && typeof this.dialog.closedDialogCallBack === 'function'){
              this.dialog.closedDialogCallBack();
          }
           this.$emit('closedDialog',{});
      }

  },
  watch: {

  },

  destroyed(){

  }

}



</script>

<style scoped>

</style>
