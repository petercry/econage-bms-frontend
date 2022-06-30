<template>
    <eco-content top="0px" bottom="0px" type="tool" class="wfToDoVue" style="background-color:#f5f5f5">
        <div class="settingMain">
            <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
            <eco-content top="0px" height="60px" type="tool" style="border-bottom:1px solid #ddd;overflow:hidden;">
                    <el-row style="padding:12px 10px;background-color:#fff;">
                        <el-col :span="8" >
                            <eco-tool-title style="line-height: 34px;" :title="'参数配置（'+total+'）'"></eco-tool-title>
                        </el-col>
                        <el-col :span="16">
                            <el-button plain class="plainBtn toolBtn" @click.native="addSetting" ><i class="icon el-icon-circle-plus-outline"></i>&nbsp;新增配置</el-button>
                        </el-col>
                    </el-row>
            </eco-content>
            <eco-content bottom="0" top="61px" ref="content" style="padding:10px 15px;">
                <el-table
                    :data="dataList"
                    tooltip-effect="dark"
                    style="width: 100%;"
                    size="mini"
                    class="ecoList"
                    height="100%"
                    stripe
                >
                    <el-table-column
                        label="操作"
                        width="100"
                        show-overflow-tooltip
                        >
                        <template slot-scope="scope" >
                            <span class="pointerClass"  @click="deleteSetting(scope.row.id)" style="color:#F56C6C;">删除</span>

                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="id"
                        label="数据主键"
                        width='200'
                        show-overflow-tooltip
                        >
                    </el-table-column>
                    <el-table-column
                        prop="model"
                        label="模块名称"
                        show-overflow-tooltip
                        >
                    </el-table-column>
                    <el-table-column
                        prop="editBefore"
                        label="可显示周数(当前周之前)"
                        width="220"
                        show-overflow-tooltip
                        >
                    </el-table-column>
                    <el-table-column
                        prop="editAfter"
                        label="可显示周数(当前周之后)"
                        width="220"
                        show-overflow-tooltip
                        >
                    </el-table-column>
                    <el-table-column
                        prop="hour"
                        label="一天工时数"
                        width="100"
                        show-overflow-tooltip
                        >
                    </el-table-column>

                </el-table>

            </eco-content>
        </div>
    </eco-content>
</template>
<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {sysEnv} from '../../../config/env.js'
import {EcoUtil} from '@/components/util/main.js'
import {getSettingList,deleteSetting} from '../../../api/setting.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
export default {
  name:'baseData',
  components: {
      ecoContent,
      ecoLoading,
      ecoToolTitle
  },
  data() {
    return {
       dataList:[],
       total:0
    }
  },
  created() {
      this.callAction();
  },
  activated(){

  },

  mounted(){
      this.getListDataFunc();
  },

  computed: {

  },

  methods: {
    callAction(){
        let this_ = this;
        window.tabClickFunc = function(){
            this_.getListDataFunc();
        }
        let callBackDialogFunc = function(obj){
            if(obj && (obj.action == 'addSetting') ){
                this_.$message({
                    message: '添加成功！',
                    showClose: true,
                    duration:2000,
                    type: 'success'
                });
                this_.getListDataFunc();
            }
        }
        EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'workHourSetting');
    },
    addSetting(){
        if(sysEnv == 0){
            this.$router.push({name:'addSettingForm'});
        }else{
            let _width = '600';
            let _height = '500';
            let url = '/workHours/index.html#/addSettingForm';
            EcoUtil.getSysvm().openDialog('新增配置',url,_width,_height,'15vh');
        }
    },
    getListDataFunc(){
        getSettingList().then(res => {
            console.log(res)
            this.dataList = res.rows;
            this.total = res.total;
        })
    },
    deleteSetting(id){
        var that  = this;
        let confirmYesFunc = function(){

           that.deleteSettingFunc(id);
        }
        let options = {
            type: 'warning',
            lockScroll:false
        }
        EcoMessageBox.confirm('确定要删除吗?','提示',options,confirmYesFunc);
    },
    deleteSettingFunc(id){
        deleteSetting(id).then(res =>{
            this.$message({
                message: '删除成功',
                showClose: true,
                duration:2000,
                customClass:'design-from-el-message',
                type: 'success'
            });
            this.getListDataFunc();
        })
    }
  },
  watch:{

  },

};
</script>

<style scoped>
  .settingMain{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
    color:#0f1419;
}
.settingMain .plainBtn{
    border-color: #003b90;
    color: #003b90;
    font-size:14px;
    float: right;
}
</style>
