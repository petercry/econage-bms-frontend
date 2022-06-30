<template>
  <eco-content
    top="0px"
    bottom="0px"
    type="tool"
    style="background-color:#f5f5f5"
  >
  <div  class="graphicalAppoint" >
    <el-card class="e9-card" :body-style="{padding: '0 20px 2px'}"   shadow='never' >
        <eco-content
        top="0px"
        height="60px"
        type="tool"
        style="border-bottom:1px solid #ddd;box-sizing:border-box"
      >
        <el-row style="padding:12px 10px;background-color:#fff;">
          <el-col :span="24">
            <eco-tool-title
              style="line-height: 34px;margin-right:50px;fontWeight:700;"
              :title="'图形化预约'"
            ></eco-tool-title>
            <el-button type="primary" class="fl-right" icon="el-icon-search">搜索</el-button>
            <el-form :inline="true"  class="fl-right">
                <el-form-item label="资源名称" style="margin-bottom: 6px">
                      <el-input></el-input>
                </el-form-item>
                <el-form-item label="时间" style="margin-bottom: 6px">
                    <el-date-picker  value-format="yyyy-MM-dd" type="date" v-model="chooseDate"  placeholder="选择日期时间" size="mini" @change="listenTimeChange"></el-date-picker>
                </el-form-item>
            </el-form>
         <el-radio-group v-model="viewType" class="fl-right" style="marginRight:30px" @change="viewChange">
            <el-radio-button label="普通视图"></el-radio-button>
            <el-radio-button label="列表视图"></el-radio-button>
          </el-radio-group>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content top="60px" bottom="0"  style="padding:10px 15px;overflow-y:hidden;">
        <gantt-view v-if="contentType" :dateTime="chooseDate"></gantt-view>
        <list-view v-else :dateTime="chooseDate"></list-view>
      </eco-content>
    </el-card>
  </div>
    </eco-content>
</template>

<script>
import echarts from 'echarts'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import { sysEnv } from '@/modules/meeting/config/env.js'
import { EcoUtil } from '@/components/util/main.js'
import { EcoMessageBox } from '@/components/messageBox/main.js'
import { mapActions, mapGetters, mapState } from 'vuex'
import {EcoDate} from '@/components/date/main.js'
import { Loading } from 'element-ui';
import listView from './listView.vue'
import ganttView from './ganttView.vue'
  export default {
    components:{
    ecoContent,
    ecoLoading,
    ecoToolTitle,
    listView,
    ganttView
    },
    name:'graphicalAppoint',
    data(){
      return {
        chooseDate:'',
        viewType:'普通视图',
        contentType:true,
      }
    },
    computed:{

    },

    created(){
      this.chooseDate=EcoDate.formatDateDefault(new Date())
    },
    mounted() {
    },
    methods: {
      viewChange(val){
        if(val==='普通视图'){
          this.contentType=true
        }else{
          this.contentType=false
        }
      },
      listenTimeChange(val){
         console.log(val);
      }

    },
    destroyed() {

    },
    watch:{

    }
  }
</script>
<style scoped>
.graphicalAppoint{
  position: relative;
  height: 96%;
  margin: 0 24px;
  top: 2%;
  overflow-y: hidden;
  min-width: 1131px;
  border: 1px solid #ddd;
  color: #0f1419;
}
.graphicalAppoint .e9-card{
    /* overflow-y:scroll; */
    height: 100%;
}
.graphicalAppoint .e9-card .header{
    border-bottom: 1px solid #e8e8e8;
}

.graphicalAppoint .e9-mitem-main .title{
    line-height: 16px;
    font-size:12px;
    color: #262626;
}

.graphicalAppoint .e9-mitem-main .desc{
    line-height: 24px;
    font-size: 12px;
    color: #8b8b8b;
}

.graphicalAppoint .e9-mitem-main .red{
    color: #e9342b;
    font-weight: 700;
}

.graphicalAppoint .top{
    margin-right: 10px;
    padding: 2px;
    background-color: red;
    color: #fff;
    border-radius: 2px;
    font-size: 12px;
}



.graphicalAppoint .gui-whole {
    width: auto;
    /* border: 1px solid #e5e5e5; */
    font-family: 'microsoft yahei';
    color: #333;
    padding-bottom: 12px;
    overflow: auto;
}
.graphicalAppoint .slideBox {
    width: 100%;
    height: 60px;
    overflow: hidden;
    position: relative;
    background: #fff;
}

.graphicalAppoint .slideBox .bd {
    position: relative;
    height: 100%;
    z-index: 0;
    width: 90%;
    margin: auto;
    overflow: hidden;
}
.graphicalAppoint .bd ul {
    width: 7680px;
}
.graphicalAppoint .slideBox .bd li {
    zoom: 1;
    vertical-align: middle;
}

.graphicalAppoint .bd li {
    float: left;
}

.graphicalAppoint .bd li div {
    width: 14.28%;
    float: left;
    height: 59px;
    /* cursor: pointer; */
    text-align: center;
    border-bottom: solid 3px #1ba5fa;
    font-size: 12.6px;
}
.graphicalAppoint .bd li p:nth-child(1) {
    margin-top: 12px;
}

.graphicalAppoint .bd li p {
    line-height: 18px;
}

.graphicalAppoint .gui-list:first-child {
    background: #fff;
}
.graphicalAppoint .gui-list {
    position: relative;
}

.graphicalAppoint .room-gui-list{
    border-bottom:1px solid #f5f5f5;
}

.graphicalAppoint .fasten {
    width: 12%;
    float: left;
    height: 60px;
    text-align: center;
    line-height: 60px;
    font-size: 12px;
    color: #333;
}
.graphicalAppoint .gui-tab, .gui-table {}
.graphicalAppoint .gui-table, .gui-tab {
    font-size: 12px;
    color: #333;
    margin: 0;
    width: 88%;
    float: right;
    white-space: nowrap;
    height: 60px;
}
.graphicalAppoint .gui-table li {
    position: relative;
    border-bottom: solid 1px #1ba5fa;
    z-index: 666;
}
.graphicalAppoint .gui-table li {
    cursor: default;
}

.graphicalAppoint .gui-table li, .gui-tab li {
    float: left;
    text-align: left;
    width: 8.9%;
    height: 60px;
    line-height: 60px;
    /* cursor: pointer; */
}
.graphicalAppoint .gui-cle {
    position: absolute;
    left: -5px;
    bottom: -5px;
    width: 6px;
    height: 6px;
    background: #fff;
    border-radius: 50%;
    border: solid 2px #1ba5fa;
    z-index: 666;
}
.graphicalAppoint .gui-lit {
    position: absolute;
    left: 0;
    bottom: -3px;
    width: 3px;
    height: 3px;
    background: #fff;
    border-radius: 50%;
    border: solid 1px #1ba5fa;
    margin-left: 50%;
    z-index: 666;
}
.graphicalAppoint .clear {
    *zoom: 1;
}
.graphicalAppoint .clear:after {
    content: ".";
    display: block;
    clear: both;
    visibility: hidden;
    line-height: 0;
    height: 0;
    font-size: 0;
}

.graphicalAppoint .meet-item-one {
    color: #000;
    text-align: center;
    position: absolute;
    height: 58px;
    left: 12%;
    top: 1px;
    color: #fafafa;
    font: 14px/60px microsoft yahei;
    padding: 0 5px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    overflow: hidden;
    cursor: pointer;
     width: 20%;
}

.graphicalAppoint .meet-color-finished{
    background:#4dc394
}

.graphicalAppoint .meet-color-having{
    background:#eb865e
}
</style>
