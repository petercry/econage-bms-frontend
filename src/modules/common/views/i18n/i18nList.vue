<template>

    <eco-content top="0px" bottom="0px" type="tool" class="i18nList" style="background-color:#f5f5f5">  
        <div class="content">
          <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
          <eco-content top="0px" height="60px" type="tool">
                          <el-row class="toolbar">
                              <el-col :span="8" >
                                  <eco-tool-title style="line-height: 34px;" :title="'国际化信息'"></eco-tool-title>
                              </el-col>

                              <el-col :span="16" class="tlr">
                                  <el-button  type="primary" class="toolBtn" style="font-size:14px;" @click.native="addBatch" ><i class="el-icon-circle-plus-outline" style="margin-right:10px;font-size: 14px;"></i>&nbsp;批量更新</el-button>
                                  <el-button  type="primary" class="toolBtn" style="font-size:14px;" @click.native="refreshI18n" ><i class="el-icon-refresh" style="margin-right:10px;font-size: 14px;"></i>&nbsp;刷新国际化缓存</el-button>
                              </el-col>
                          </el-row>
          </eco-content>
        
         <eco-content bottom="42px" top="60px" ref="content" style="padding:10px 15px;">
              <el-table
                :data="listArray"
                style="width: 100%"
                height="100%"
                size="mini"
                class="styleTableDefault"
                stripe
              >
              <el-table-column
                type="index"
                min-width="40"
                max-width="50"
                >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="语言"
                width="70"
                >
                <template slot-scope="scope" ><span>{{i18nMap[scope.row.locale]||''}}</span></template>
              </el-table-column>
              <el-table-column
                prop="key"
                show-overflow-tooltip
                label="键"
                min-width="123"
                >
              </el-table-column>
              <el-table-column
                prop="text"
                show-overflow-tooltip
                label="文本"
                min-width="123"
                >
              </el-table-column>
              <el-table-column
                prop="group"
                show-overflow-tooltip
                label="分组"
                width="80"
                >
              </el-table-column>
              <el-table-column
                prop="createUser"
                show-overflow-tooltip
                label="创建人"
                width="80"
                >
              </el-table-column>
              <el-table-column
                prop="createDate"
                show-overflow-tooltip
                label="创建时间"
                width="180"
                >
              </el-table-column>
              <el-table-column
                prop="modUser"
                show-overflow-tooltip
                label="修改人"
                width="80"
                >
              </el-table-column>
              <el-table-column
                prop="modDate"
                show-overflow-tooltip
                label="修改时间"
                width="180"
                >
              </el-table-column>
            </el-table>
        </eco-content>

        <eco-content  bottom="0px" type="tool" style="padding:5px 0px">
          <div>
            <div style="text-align: right;">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="baseInfo.page"
                :page-sizes="[20,30,50,100]"
                :page-size="baseInfo.rows"
                layout="total, sizes, prev, pager, next, jumper"
                :total="baseInfo.total">
              </el-pagination>
            </div>
          </div>
        </eco-content>
        </div>
      </eco-content>
</template>
<script>

import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import EcoUtil from '@/components/util/main.js'
import {getI18nMap,getI18nList,i18nRefresh} from '../../service/service.js'
import {sysEnv} from '../../config/env.js'

export default{
  name:'i18nList',
  components:{
      ecoToolTitle,
      ecoLoading,
      ecoContent
  },
  data(){
    return {
      i18nMap:{},
      baseInfo:{
        page:1,
        rows:30,
        total:0,
        sort:'createDate',
        order:'desc',
      },
      listArray:[]
    }
  },
  mounted(){
      this.getI18nListFunc();
      this.getI18nMap();

      window.ecoFrameVm = this; //添加监听
      this.addMonitor(); //添加监听

  },
  methods: {
     addMonitor(){
          let callBackDialogFunc = function(obj){
              if(obj && (obj.action == 'i18nAddCallBack')){ //回调的唯一标识符
                  window.ecoFrameVm.getI18nListFunc()
              }
          }
          EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'i18nList');
     },

      addBatch(){
          if(sysEnv == 1){
              let url = '/common/index.html#/i18nBatch'
              EcoUtil.getSysvm().openDialog('国际化批量更新',url,600,400,'8vh');
          }else{
              this.$router.push({name:'i18nBatch'});
          }
      },

      refreshI18n(){
          this.$refs.ecoLoadingRef.open();
          i18nRefresh().then((response)=>{
              this.$refs.ecoLoadingRef.close();
          }).catch((error)=>{
              this.$refs.ecoLoadingRef.close();
          });
      },

      getI18nMap(){
          getI18nMap().then((response)=>{
              this.i18nMap = response.data;
          }).catch((error)=>{
          });
      },

      //列表
      getI18nListFunc(){
          this.$refs.ecoLoadingRef.open();
          getI18nList(this.baseInfo).then((response)=>{
              this.listArray = response.data.rows;
              this.baseInfo.total  = response.data.total;
              this.$refs.ecoLoadingRef.close();
          }).catch((error)=>{
              this.$refs.ecoLoadingRef.close();
          });
      },

      handleSizeChange(val) {
          this.$refs.content.setScollTop(0);
          this.baseInfo.rows = val;
          this.baseInfo.page = 1;
          this.getI18nListFunc();
      },

      handleCurrentChange(val) {
          this.$refs.content.setScollTop(0);
          this.baseInfo.page = val;
          this.getI18nListFunc();
      },
  },
  destroyed(){
      delete window.ecoFrameVm;
  }
}
</script>
<style>
.i18nList .content{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
}

.i18nList .toolbar{
  padding:12px 10px;
  background-color:#fff;
  border-bottom:1px solid #ddd;
}

.i18nList .split{
    border-right: 1px solid #ddd;
    margin: 0 10px 0 5px;
}
</style>
