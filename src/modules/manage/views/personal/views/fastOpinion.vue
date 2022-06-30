<template>
  <div>
    <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
    <eco-content top="0px" height="60px">
      <el-row class="toolbar">
          <el-col :span="8" >
              <eco-tool-title style="line-height: 34px;" :title="'常用意见'"></eco-tool-title>
          </el-col>
          <el-col :span="16" class="tlr">
              <el-button type="text"  class="toolBtn" style="font-size:14px;" @click.native="add" ><i class="el-icon-circle-plus" style="margin-right:10px;font-size: 14px;"></i>&nbsp;添加意见</el-button>
              <el-button type="primary" class="toolBtn" style="font-size:14px;" @click.native="save" ><i class="el-icon-circle-check" style="margin-right:10px;font-size: 14px;"></i>&nbsp;保存</el-button>
          </el-col>
      </el-row>
    </eco-content>

    <eco-content bottom="0" top="60px" ref="content" style="padding:10px 15px;">
      <el-table
        :data="listArray"
        style="width: 100%"
        height="100%"
        size="mini"
        row-key="key"
        highlight-current-row
        class="styleTableDefault"
        stripe>
        <el-table-column
          prop="content"
          show-overflow-tooltip
          label="意见内容"
          min-width="200"
          >
          <template slot-scope="scope">
            <div>
              <div v-if="scope.row.editable">
                <el-input v-model="scope.row.content"></el-input>
              </div>
              <div v-else>{{scope.row.content}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="comments"
          show-overflow-tooltip
          label="备注"
          min-width="200"
          >
          <template slot-scope="scope">
            <div>
              <div v-if="scope.row.editable">
                <el-input v-model="scope.row.comments"></el-input>
              </div>
              <div v-else>{{scope.row.comments}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
              label="操作"
              width="140"
          >
          <template slot-scope="scope" >
            <div>
                <span class="pointerClass"  style="color:#409EFF;" @click="edit(scope.row)">编辑</span> 
                <span class="split"></span>
                <span class="pointerClass"  style="color:#F56C6C;" @click="del(scope)">删除</span> 
                <span class="split"></span>
                <span class="pointerClass"  style="color:#409EFF;"><i class="el-icon-rank"></i></span> 
            </div>
          </template>
        </el-table-column>
      </el-table>
    </eco-content>
  </div>
</template>

<script>
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {Loading } from 'element-ui';
import EcoUtil from '@/components/util/main.js'
import {getFastOpinionList,updateFastOpinionList} from '@/modules/manage/service/service.js'
import {sysEnv} from '../../../config/env.js'
import Sortable from 'sortablejs'
export default {
  name:'',
  components:{
    ecoLoading,
    ecoContent,
    ecoToolTitle
  },
  props: {
 
  },
  data() {
    return {
      listArray:[]
    };
  },
  computed: {},
  created() {},
  mounted() {
      this.getData();
      this.rowDrop();
      window.ecoFrameVm = this; //添加监听
      this.addMonitor(); //添加监听
  },
  methods: {
    addMonitor(){
          let callBackDialogFunc = function(obj){
              if(obj && (obj.action == 'fastOpinionAddCallBack'||obj.action =='fastOpinionEditCallBack')){ //回调的唯一标识符
                window.ecoFrameVm.getData()
              }
          }
          EcoUtil.addCallBackDialogFunc(callBackDialogFunc);
    },
    //行拖拽
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.listArray.splice(oldIndex, 1)[0]
          _this.listArray.splice(newIndex, 0, currRow)
        }
      })
    },
    getData(){
      getFastOpinionList().then(res=>{
        this.listArray = res.data.map(item=>{
          item.editable = false;
          item.key = item.id;
          return item;
        });
      }).catch(e=>{})
    },
    del(scope){
      let $index = scope.$index;
      this.listArray.splice($index,1);
    },
    add(){
      this.listArray.push({content:'',comments:'',editable:true,key:new Date().getTime()+''});
    },
    edit(item){
      item.editable = !item.editable;
    },

    save(){
      this.$refs.ecoLoadingRef.open();
      updateFastOpinionList(this.listArray).then(res=>{
        this.$message.success('保存成功');  
        this.listArray.map(item=>{
          item.editable = false;
          return item;
        })
        this.$refs.ecoLoadingRef.close();
      }).catch(e=>{
        this.$refs.ecoLoadingRef.close();
        this.$message.error('保存失败');
      })
    },
  },

  destroyed(){

  }

};

</script>

<style scoped>
.toolbar{
  padding:12px 10px;
  background-color:#fff;
  border-bottom:1px solid #ddd;
}
.split{
    border-right: 1px solid #ddd;
    margin: 0 10px 0 5px;
}
.styleTableDefault >>> .el-table__body-wrapper tr{
  cursor: move;
}
</style>
