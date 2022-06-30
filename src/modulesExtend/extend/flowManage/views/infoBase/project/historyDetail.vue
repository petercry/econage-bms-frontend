<template>
   <eco-content
    top="0px"
    bottom="0px"
    type="tool"
    style="background-color:#f5f5f5"
  >
 <div class="historyDetail">
      <!-- 历史项目信息维护 -->
            <ecoLoading
        ref='ecoLoadingRef'
        text='加载中...'
      ></ecoLoading>
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
              :title="'历史项目信息维护'"
            ></eco-tool-title>
          </el-col>
        </el-row>
      </eco-content>
        <eco-content
        bottom="0"
        top="60px"
        ref="content"
        class="ecoContentClass"
      >
      <h3 style="marginBottom:15px">XX智慧平台项目</h3>
      <div class="info">
          <div class="title">
             <h3>建设方案环节</h3>
          </div>
          <div class="content">
            <el-form label-position="right" label-width="240px" :model="form">
            <el-form-item label="是否已建设方案评审：">
              <el-switch
                  v-model="form.data1"
                  active-color="#42b7f1"
                  inactive-color="red">
                </el-switch>
          </el-form-item>
            <el-form-item label="项目建设方案附件：">
                <el-button type="primary" :disabled="!form.data1" icon="el-icon-upload2">添加项目建设方案附件</el-button>
          </el-form-item>
          </el-form>
          </div>
      </div>
      <div class="general">
          <div class="title">
             <h3>立项审批环节</h3>
          </div>
          <div class="content">
            <el-form label-position="right" label-width="240px" :model="form">
            <el-form-item label="是否已立项审批：">
              <el-switch
                  v-model="form.data2"
                  active-color="#42b7f1"
                  inactive-color="red">
                </el-switch>
          </el-form-item>
            <el-row>
                   <el-col :span="12">
            <el-form-item label="批复函文号：">
              <el-input v-model="form.data3" :disabled="!form.data2" ></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="12">
            <el-form-item label="批复日期：">
                   <el-date-picker
                    v-model="form.data4"
                    :disabled="!form.data2"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
            </el-form-item>
            </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
            <el-form-item label="可研报告附件：">
                <el-button type="primary" :disabled="!form.data2" icon="el-icon-upload2">添加可研报告附件</el-button>
            </el-form-item>
            </el-col>

          <el-col :span="12">
                <el-form-item label="可研批复附件：">
                <el-button type="primary" :disabled="!form.data2" icon="el-icon-upload2">添加可研批复附件</el-button>
          </el-form-item>
          </el-col>
            </el-row>
          </el-form>
          </div>
      </div>
      <div class="info">
          <div class="title">
             <h3>实施方案环节</h3>
          </div>
          <div class="content">
            <el-form label-position="right" label-width="240px" :model="form">
            <el-form-item label="是否已实施方案评审：">
              <el-switch
                  v-model="form.data5"
                  active-color="#42b7f1"
                  inactive-color="red">
                </el-switch>
          </el-form-item>
            <el-form-item label="项目实施方案附件：">
                <el-button type="primary" :disabled="!form.data5" icon="el-icon-upload2">添加项目实施方案附件</el-button>
          </el-form-item>
          </el-form>
          </div>
      </div>
        <div class="general">
          <div class="title">
             <!-- <h3>立项审批环节</h3> -->
          </div>
          <div class="content">
            <el-form label-position="right" label-width="240px" :model="form">
            <el-form-item label="备注信息：">
              <el-input v-model="form.data6" type="textarea" :autosize="{minRows:2}">
              </el-input>
          </el-form-item>
            <el-form-item label="已添加文件：">
            </el-form-item>
          </el-form>
          </div>

        </div>
        <div class="info" style="textAlign:center;paddingBottom:20px;">
            <el-button style="width:50%;backgroundColor:#19a689;color:#fff;height:34px;">提交</el-button>
        </div>
      </eco-content>
 </div>
   </eco-content>
</template>

<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import { sysEnv } from '@/modulesExtend/extend/flowManage/config/env.js'
import { EcoUtil } from '@/components/util/main.js'
import { EcoMessageBox } from '@/components/messageBox/main.js'
import { mapActions, mapGetters, mapState } from 'vuex'
import { Loading } from 'element-ui';
export default {
 name: 'historyDetail',
 components: {
    ecoContent,
    ecoLoading,
    ecoToolTitle,

  },
 data () {
 return {
   form:{
     data1:false,
     data2:false,
     data3:'',
     data4:'',
     data5:false,
     data6:''
   }
 }
 }
}
</script>

<style scoped>
.historyDetail {
  position: relative;
  height: 96%;
  margin: 0 24px;
  top: 2%;
  overflow-y: hidden;
  min-width: 1131px;
  border: 1px solid #ddd;
  color: #0f1419;
}
h3{
  color: #676a6c;
  font-weight: 600;
}
.ecoContentClass{
  padding: 20px;
}
.general{
  width: 100%;
  /* height: 260px; */
  margin-top: 3px;
  background-color: #fafafa;
  border-left: 3px solid #808b97;
  padding: 10px;
}
.info{
  width: 100%;
  margin-top: 3px;
  /* height: 260px; */
  background-color: #ecfafb;
  border-left: 3px solid #0278ae;
  padding: 10px;
}
.title{
    height: 30px;
    padding-left: 20px;
    padding-top: 10px;
    color: #808b97;
}
.info .title h3{
  color: #0278ae;
}
.content{
  padding: 20px;
  padding-right: 200px;
}
.content .el-form /deep/ .el-input input{
  color: #2e6da4;
;
}
.el-input /deep/ input{
  font-size: 14px;
}
.el-textarea /deep/ .el-textarea__inner{
  font-size: 14px;
}
.el-form /deep/  .el-form-item__label{
  font-weight: 600;
  color: #676a67;
}
.el-button {
  font-size: 14px;
}

</style>
