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
      <iframe :src="getIframeSrc" ref="gantt_iframe" style="width:100%;height:calc(100% - 40px );"></iframe>
    </div>
</template>

<script>
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoButton from '@/components/button/ecoButton.vue'
import {sysEnv} from '../../config/env'

export default {
  name: 'gantt',
  data() {
    return {
      window_: '',
      project_: {},
      option: {
        style: '',
        readOnly: false,
        showSummary: false,
        allowDragDrop: false,
        autoSyncSummary: false,
        showGanttView: true,
        showTableView: true,
        showLinkLines: false,
        tableViewWidth: '',
        showTimeLineLabelInHeader:true,
        highLightOnItemClick: true,
        onTaskclick() {

        },
        onTaskdblclick() {

        },
        onExpandtask() {

        },
        onItemdragstart() {

        },
        onItemDragComplete() {

        }
      },
      isRender_: false
    }
  },
  components: {
    ecoLoading,
    ecoButton
  },
  props: {
    ganttOption: {
      type: Object,
      default() {
        return {}
      }
    },
    onTaskclick: {
      type: Function,
      default() {
        return ()=>({

        })
      }
    }
  },
  created() {

  },
  computed: {
    getIframeSrc() {
        if (sysEnv === 0) {
            return 'static/gant/index.html';
        } else {
            return '/assets/gant/index.html';
        }
    }
  },
  mounted() {
     this.initIframe();
  },
  activated() {
    this.initIframe();
  },
  methods: {
    initIframe() {
        // this.$refs.ecoLoadingRef.open();
        this.window_ = this.$refs.gantt_iframe.contentWindow;
        this.window_._option = Object.assign(this.option,this.ganttOption);
        this.window_._onLoading = this.$refs.ecoLoadingRef.open;
        this.window_._onClose = this.onClose;
        this.window_._showError = this.showError;
        this.project_ = this.window_.project;

        //this.window_.isRender_ = this.isRender_;
        //this.isRender_ = this.window_.isRender;
        //this.setStyle();
    },
    showError(msg) {
      this.$message({
          showClose: true,
          duration: 2000,
          message: msg,
          customClass: 'design-from-el-message',
          type: 'warning'
      });
    },
    onClose() {
      this.$refs.ecoLoadingRef.close();
      this.$emit('load');
    },
    addTask(row) {
      this.window_._addTask(row);
    },
    setStyle() {
      this.window_._setStyle(this.ganttStyle);
    },
    loadData(rows) {
      this.window_._loadData(rows);
    },

    setTimeLines(timeLines){
        this.window_._setTimeLines(timeLines);
    },

    zoomIn() {
      this.window_._zoomIn();
    },
    zoomOut() {
      this.window_._zoomOut();
    },
    upload() {

    },
    expandAll() {
      this.window_._expandAll();
    },
    collapseAll() {
      this.window_._collapseAll();
    }
  },
  watch: {


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
