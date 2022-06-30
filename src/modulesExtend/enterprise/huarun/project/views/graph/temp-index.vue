<template>
  <div>
    <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
    <div class="page-header">
      <el-button size="medium" type="primary" @click="save()">保存</el-button>
    </div>

    <div class="page-content">
      <iframe ref="mxClient" class="mxClient" :src="getIframeSrc"></iframe>
    </div>
    <el-drawer
      :withHeader="false"
      :visible.sync="dialogVisible"
      direction="rtl"
      :show-close="false"
      :before-close="hideDialog">
       <component ref="typeAttr" :is="comName" @saveLoading="saveLoading" @closeSaveLoading="closeSaveLoading" @hideDialog="hideDialog" :cellId="cellId" :dialogVisible.sync="dialogVisible"></component>
    </el-drawer>
  </div>
</template>
<script>
import range from './components/range.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {saveModelNode,getModelNode} from '../../service/service.js'
import {sysEnv} from '../../config/env.js'
import { mapActions } from 'vuex'
import { Loading } from 'element-ui';
export default {
  name: 'mxgraphComp',
  data() {
    return {
      graph: null,
      dialogVisible: false,
      comName: '',
      dialogTitle: '',
      cellId: '',
      _target:{},
      loadingInstance:null
    }
  },
  components: {
    ecoLoading,
    range
  },
  computed: {
      getIframeSrc() {
          if (sysEnv == 0) {
              return '/static/mxgraph/index.html';
          } else {
              if (window.sysSetting && window.sysSetting.ngrootUrl) {
                  return window.sysSetting.ngrootUrl + '/assets/mxgraph/index.html';
              } else if (window.parent.sysSetting && window.parent.sysSetting.ngrootUrl) {
                  return window.parent.sysSetting.ngrootUrl + '/assets/mxgraph/index.html';
              } else {
                  return '/assets/mxgraph/index.html'
              }
          }
      }
  },
  mounted() {
    this.initIframe();
    this.initProjectBaseData();
  },
  methods: {
    ...mapActions([
        'initProjectBaseData'
    ]),
    async initIframe() {
      this.$refs.ecoLoadingRef.open();
      this._window = this.$refs.mxClient.contentWindow;
      this._window.onLoading = this.$refs.ecoLoadingRef.open;
      this._window.readonlyXml = false;//只读
      this._window.showError = this.showError;
      this._window.ecoToken = sessionStorage.getItem('ecoToken');
      this._window.showDialog = this.showDialog;
      this._window.onClose = this.onClose;
      this._window.modelId = this.$route.params.modelId;
      this._window.getNode = this.getModelNode;
    },
    onClose(){
      this.$refs.ecoLoadingRef.close();
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
    getModelNode(){
      getModelNode(this.$route.params.modelId).then(res=>{
        if(res.data){
          this._window.editorUi.editor.setGraphXml(this._window.mxUtils.parseXml(res.data.obj).documentElement);
          this._window.editorUi.editor.setModified(false);
          this._window.editorUi.refresh();
        }
        this.onClose();
      }).catch(e=>{
        console.log(e);
      })
    },
    save() {
      this.saveLoading();
      this._window.editorUi.editor.graph.stopEditing();//停止编辑状态
      const _root = this._window.editorUi.editor.graph.getModel().getRoot();
      if (_root.children == null || _root.children == undefined) return;
      const _children = _root.children[0].children;
      if (_children == null || _children == undefined) {
        return;
      }
      const xmlStr = this._window.mxUtils.getPrettyXml(this._window.editorUi.editor.getGraphXml());
      let data = {
        modelId:this.$route.params.modelId,
        obj:xmlStr
      }
      this.saveLoading();
      saveModelNode(data).then(res => {
        this.closeSaveLoading();
        if(this._window && this._window.editorUi){
            this._window.editorUi.editor.setGraphXml(this._window.mxUtils.parseXml(res.data.obj).documentElement);
            this._window.editorUi.editor.setModified(false);
            this._window.editorUi.refresh();
        }
       
      })
    },
    saveLoading(){
      this.loadingInstance = Loading.service({ fullscreen: true,text:"保存中...."});
    },
    closeSaveLoading(value){
      let self = this;
      this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
        try{
          setTimeout(()=>{
            self.loadingInstance.close()
            self.$message({
              message: '保存成功',
              showClose: true,
              duration:2000,
              customClass:'design-from-el-message',
              type: 'success'
            });
          },1000);
        }catch(e){
          
        }
        this._window.editorUi.editor.graph.getModel().setValue(this._target, value);//更新环节名称
      });
    },
    showDialog(style,cell) {
      this._target = cell;
      if (cell && cell.compId) {
        this.cellId = cell.compId;
        this.dialogVisible = true;
        this.comName = 'range';
        this.dialogTitle = style.desc;
      }
    },
    hideDialog() {
      if (this.$refs.typeAttr.isEdit) {
          this.$confirm('有未保存内容，是否离开？', '', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                this.dialogVisible = false;
                this.$refs.typeAttr.isEdit = false;
                this.comName = '';
            }).catch(() => {

            });
      } else {
          this.dialogVisible = false;
          this.comName = '';
      }
    }
  }
}
</script>
<style lang="less" scoped>
 .page-header{
    position: absolute;
    left:0;
    right:0;
    top:0;
    height:55px;
    text-align: right;
    line-height: 55px;
    padding: 0 10px;
    vertical-align: middle;
    background-color: #fff;
  }
  .page-content{
    position: absolute;
    left:0px;
    top:55px;
    bottom:0px;
    right:0px;
    background-color: #fff;
    overflow:auto;

    .mxClient{
      width:100%;
      height: 100%;
      position: absolute;
    }
  }
</style>
