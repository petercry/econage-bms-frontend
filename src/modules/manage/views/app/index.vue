<template>

 <eco-content top="0px" bottom="0px" type="tool" class="appVue" style="background-color:#f5f5f5">  
        <div class="content webLayout">

        <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
        <eco-content top="0px" height="60px" type="tool">
                      <el-row class="toolbar">
                          <el-col :span="8" >
                              <eco-tool-title style="line-height: 34px;" :title="'第三方客户端'"></eco-tool-title>
                          </el-col>

                          <el-col :span="16" class="tlr">
                              <el-button  type="primary" class="toolBtn" style="font-size:14px;" @click.native="add" ><i class="el-icon-circle-plus-outline" style="margin-right:10px;font-size: 14px;"></i>&nbsp;添加</el-button>
                          </el-col>
                      </el-row>
        </eco-content>
   
        <eco-content bottom="42px" top="60px" ref="content" style="padding:10px 15px;">
              <el-table
                :data="listArray"
                style="width: 100%"
                height="100%"
                size="mini"
                highlight-current-row
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
                  prop="id"
                  show-overflow-tooltip
                  label="应用id"
                  min-width="123"
                >
              </el-table-column>
              <el-table-column
                  prop="appName"
                  show-overflow-tooltip
                  label="应用名称"
                  min-width="123"
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
                  prop="modDate"
                  show-overflow-tooltip
                  label="修改时间"
                  width="180"
                >
              </el-table-column>
        
              <el-table-column
                         label="操作"
                         width="80"
                      >
                            <template slot-scope="scope" >
                              <div>
                                  <span class="pointerClass"  style="color:#409EFF;" @click="edit(scope.row)">编辑</span> 
                              </div>
                            </template>
                    </el-table-column>

            </el-table>
        </eco-content>

        <eco-content  bottom="0px" type="tool" style="padding:5px 0px">
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
        </eco-content>
        </div>

      </eco-Content>
</template>
<script>

import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import EcoUtil from '@/components/util/main.js'
import {sysEnv} from '../../config/env.js'
import {getAppList,appAddAjax} from '../../service/service.js'

export default{
  name:'userGroup',
  components:{
    ecoLoading,
    ecoContent,
    ecoToolTitle
  },
  data(){
    return {
      baseInfo:{
        page:1,
        rows:30,
        total:0,
        sort:'createDate',
        order:'desc',
      },
      listArray:[],
      currentRow:null
    }
  },
  mounted(){
      window.ecoFrameVm = this; //添加监听
      this.addMonitor(); //添加监听
      this.getAppListFunc();
  },
  methods: {
    addMonitor(){
          let callBackDialogFunc = function(obj){
              if(obj && (obj.action =='appEditCallBack')){ //回调的唯一标识符
                window.ecoFrameVm.getAppListFunc()
              }
          }
          EcoUtil.addCallBackDialogFunc(callBackDialogFunc);
    },

    add(){
        let that = this;
        EcoUtil.getSysvm().$prompt('请输入应用名称', '添加应用', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
        }).then(({ value }) => {
            appAddAjax({appName:value}).then((response)=>{
                this.$message({
                    type: 'success',
                    message: '添加成功！'
                });
                that.getAppListFunc();
            }).catch((error)=>{});
        }).catch(() => {});
    },

    edit(item){
        if(sysEnv == 1){
            let url = '/manage/index.html#/appEdit/'+item.id;
            EcoUtil.getSysvm().openDialog('应用编辑（'+item.appName+'）',url,700,700,'8vh');
        }else{
            this.$router.push({name:'appEdit',params:{appId:item.id}});
        }
    },
  
    //列表
    getAppListFunc(){
        this.$refs.ecoLoadingRef.open();
        getAppList(this.baseInfo).then((response)=>{
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
        this.getAppListFunc();
    },
    handleCurrentChange(val) {
        this.$refs.content.setScollTop(0);
        this.baseInfo.page = val;
        this.getAppListFunc();
    },
  },
  watch: {

  }
}
</script>
<style scope>
.appVue .content{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
}

.appVue .toolbar{
  padding:12px 10px;
  background-color:#fff;
  border-bottom:1px solid #ddd;
}

.appVue .split{
    border-right: 1px solid #ddd;
    margin: 0 10px 0 5px;
}
</style>
