<template>
    <div class="gantt">
      <div class="toolbar">
        <el-row>
          <el-col :span="24">
             <eco-button type="tool" :leftSplit="false" @click.native="zoomIn" >
                  <i class="el-icon-zoom-in" ></i>
                  <span>&nbsp;放大</span>
              </eco-button>
              <eco-button type="tool" :leftSplit="false" @click.native="zoomOut">
                  <i class="el-icon-zoom-out" ></i>
                  <span>&nbsp;缩小</span>
              </eco-button>
              <!-- <eco-button type="tool" :leftSplit="false" @click.native="upload">
                  <i class="el-icon-upload" ></i>
                  <span>&nbsp;导出</span>
              </eco-button> -->
              <eco-button type="tool" :leftSplit="false" @click.native="expandAll">
                  <i class="el-icon-s-unfold" ></i>
                  <span>&nbsp;展开所有</span>
              </eco-button>
               <eco-button type="tool" :leftSplit="false" @click.native="collapseAll">
                  <i class="el-icon-s-fold" ></i>
                  <span>&nbsp;折叠所有</span>
              </eco-button>
          </el-col>
        </el-row>
      </div>
      <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
      <iframe :src="getIframeSrc" ref="gantt_iframe" style="width:100%;height:calc(100% - 30px );"></iframe>
    </div>
</template>

<script>
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoButton from '@/components/button/ecoButton.vue'


import {sysEnv} from '../../config/env'
export default{
  name:'gantt',
  data(){
    return {
      _window:"",
      _project:{},
      option:{
        style:"",
        readOnly:false,
        showSummary:false,
        allowDragDrop:false,
        autoSyncSummary:false,
        showGanttView:true,
        showTableView:true,
        showLinkLines:false,
        tableViewWidth:"",
        showTimeLineLabelInHeader:false,
        onItemDragComplete:false,
        highLightOnItemClick:true,
        onTaskclick(){

        },
        onTaskdblclick(){

        },
        onExpandtask(){

        },
        onItemdragstart(){

        },
        onItemDragComplete(){

        }
      },
      _isRender:false
    }
  },
  components:{
    ecoLoading,
    ecoButton
  },
  props:{
    ganttOption:{
      type:Object,
      default(){
        return {}
      }
    },
    onTaskclick:{
      type:Function,
      default(){
        return (container,event)=>({

        })
      }
    }
  },
  created(){

  },
  computed:{
    getIframeSrc(){
      if(sysEnv == 0){
        return '/static/gant/index.html';
      }else{
        return '/assets/gant/index.html';
      }
    }
  },
  mounted(){
     this.initIframe();
  },
  activated() {
    this.initIframe();
  },
  methods: {
    initIframe(){
      this.$refs.ecoLoadingRef.open();
      this._window = this.$refs.gantt_iframe.contentWindow;
      this._window._option = Object.assign(this.option,this.ganttOption);
      this._window._onLoading = this.$refs.ecoLoadingRef.open;
      this._window._onClose = this.onClose;
      this._window._showError = this.showError;
      this._project = this._window.project;
      //this._window._isRender = this._isRender;
      //this._isRender = this._window.isRender;

      //this.setStyle();
    },
    showError(msg){
      this.$message({
          showClose: true,
          duration:2000,
          message: msg,
          customClass:'design-from-el-message',
          type: 'warning'
      });
    },
    onClose(){
      this.$refs.ecoLoadingRef.close();
      this.$emit('load');
    },
    addTask(row){
      this._window._addTask(row);
    },
    setStyle(){
      this._window._setStyle(this.ganttStyle);
    },
    loadData(rows){
      this._window._loadData(rows);
    },
    zoomIn(){
      this._window._zoomIn();
    },
    zoomOut(){
      this._window._zoomOut();
    },
    upload(){

    },
    expandAll(){
      this._window._expandAll();
    },
    collapseAll(){
      this._window._collapseAll();
    }
  },
  watch: {
    _isRender(value){

    }


  }
}

</script>
<style>

.gantt{
  width: 100%;
  height: 100%;
}
.gantt .toolbar{
    color: #3a8ee6;
    font-size:12px;
    height: 30px;
    line-height: 30px;
    margin: 0 8px;
    padding: 0 5px;
    background: #F5F5F5;
    border:solid 1px #99bce8
}
.gantt .toolbar span,.gantt .toolbar i{
    color: #003b90;
    font-size:12px;
}
</style>
