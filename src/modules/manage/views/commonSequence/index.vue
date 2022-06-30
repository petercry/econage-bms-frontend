<template>

   <eco-content top="0px" bottom="0px" type="tool" class="commonSequence" style="background-color:#f5f5f5">  
       <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
        <div class="content webLayout">
          <eco-content top="0px" height="60px" type="tool">
                        <el-row class="toolbar">
                            <el-col :span="8" >
                                <eco-tool-title style="line-height: 34px;" :title="'编号'"></eco-tool-title>
                            </el-col>

                            <el-col :span="16" class="tlr">
                                <el-button  type="primary" class="toolBtn" style="font-size:14px;" @click.native="addSequence" ><i class="el-icon-circle-plus-outline" style="margin-right:10px;font-size: 14px;"></i>&nbsp;添加</el-button>
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
                prop="name"
                show-overflow-tooltip
                label="名称"
                min-width="123"
                >
              </el-table-column>
          <el-table-column
            prop="ticketPreview"
            show-overflow-tooltip
            label="流水号"
            min-width="123"
            >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="状态"
            width="72"
            >
            <template slot-scope="scope" >
              <div style="">
                <span v-if="scope.row.status=='NOT_USED'" style="color:#f56c6c">未使用</span>
                <span v-if="scope.row.status=='USED'" style="color:#67c23a">已使用</span>
              </div>
            </template>
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


          <el-table-column
                  label="操作"
                  width="80"
            >
                <template slot-scope="scope" >
                    <div>
                        <span v-if="scope.row.status=='NOT_USED'" class="pointerClass"  style="color:#409EFF;" @click="editSequence(scope.row)">编辑</span> 
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
   </eco-content>
</template>
<script>


import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {getCommonSequenceList} from '../../service/service.js'
import {mapMutations} from 'vuex'
import EcoUtil from '@/components/util/main.js'
import {sysEnv} from '../../config/env.js'

export default{
  name:'commonSequence',
  components:{
    ecoToolTitle,
    ecoLoading,
    ecoContent
  },
  data(){
    return {
      hackReset:true,
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
      this.getCommonSequenceListFunc();
  },
  methods: {
      addMonitor(){
            let callBackDialogFunc = function(obj){
                if(obj && (obj.action == 'commonSequenceAddCallBack'||obj.action =='commonSequenceEditCallBack')){ //回调的唯一标识符
                  window.ecoFrameVm.getCommonSequenceListFunc()
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'commonSequence');
      },

      addSequence(){
            if(sysEnv == 1){
                let url = '/manage/index.html#/commonSequenceAdd';
                EcoUtil.getSysvm().openDialog('流水号添加',url,800,480,'8vh');
            }else{
                this.$router.push({name:'commonSequenceAdd'});
            }
      },

      editSequence(item){
           if(sysEnv == 1){
                let url = '/manage/index.html#/commonSequenceEdit/'+item.id;
                EcoUtil.getSysvm().openDialog('流水号编辑',url,800,480,'8vh');
            }else{
                this.$router.push({name:'commonSequenceEdit',params:{id:item.id}});
            }
      },

      handleCurrentChangeTable(val) {
        this.currentRow = val;
      },
      //列表
      getCommonSequenceListFunc(){
          this.$refs.ecoLoadingRef.open();
          getCommonSequenceList(this.baseInfo).then((response)=>{
              this.listArray = response.data.rows;
              this.baseInfo.total  = response.data.total;
              this.$refs.ecoLoadingRef.close();
          }).catch((error)=>{
              this.$refs.ecoLoadingRef.close();
          });
      },

      handleSizeChange(val) {
          // this.$refs.content.setScollTop(0);
          this.baseInfo.rows = val;
          this.baseInfo.page = 1;
          this.getCommonSequenceListFunc();
      },
      handleCurrentChange(val) {
          // this.$refs.content.setScollTop(0);
          this.baseInfo.page = val;
          this.getCommonSequenceListFunc();
      },
      reload(){
        this.hackReset = false
        this.$nextTick(() => {
          this.hackReset = true
        })
      }
  },
  watch: {

  }
}
</script>
<style>
.commonSequence .content{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
}

.commonSequence .toolbar{
  padding:12px 10px;
  background-color:#fff;
  border-bottom:1px solid #ddd;
}

.commonSequence .split{
    border-right: 1px solid #ddd;
    margin: 0 10px 0 5px;
}
</style>
