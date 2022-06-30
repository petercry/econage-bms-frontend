<template>
   <eco-content
    top="0px"
    bottom="0px"
    type="tool"
    style="background-color:#f5f5f5"
  >
 <div class="planDeclare">
      <!-- 项目方案申报 -->
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
              :title="'项目方案申报'"
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
      <!-- <h3 style="marginBottom:15px">XX智慧电子政务云平台项目（政务网XX平台2018）</h3> -->
      <div class="info">
          <div class="title">
             <h3>项目概况</h3>
          </div>
          <div class="content">
            <el-form label-position="right" label-width="240px" :model="form">
            <el-form-item label="项目性质：">
             <el-radio-group v-model="form.data1">
                <el-radio :label="3">新建</el-radio>
                <el-radio :label="6">续建</el-radio>
                <el-radio :label="9">运维</el-radio>
              </el-radio-group>
          </el-form-item>
            <el-form-item label="是否涉密：">
              <el-radio-group v-model="form.data2">
                <el-radio :label="3">是</el-radio>
                <el-radio :label="6">否</el-radio>
              </el-radio-group>
          </el-form-item>
          <el-row>
             <el-col :span="12">
                <el-form-item label="项目开始年度：">
              <el-select v-model="form.startTime" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
                </el-form-item>
             </el-col>
             <el-col :span="12">
                <el-form-item label="项目结束年度：">
                  <el-select v-model="form.endTime" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
              </el-form-item>
             </el-col>
          </el-row>
                  <el-form-item label="启动年限 *：">
              <el-radio-group v-model="form.data3">
                <el-radio :label="3">当年补报项目</el-radio>
                <el-radio :label="6">下一年度项目</el-radio>
              </el-radio-group>
          </el-form-item>
          </el-form>
          </div>
      </div>
      <div class="general">
          <h3>建设单位信息</h3>
          <div class="content">
                <el-form label-position="right" label-width="240px" :model="form">
                    <el-form-item label="项目名称 *：">
                      <el-input v-model="form.data4" size="small" placeholder="填写项目名称，请勿与本单位已申报项目重名"></el-input>
                    </el-form-item>
                    <el-form-item label="建设单位 *：">
                        <el-select v-model="form.data5" placeholder="请选择" style="width:100%">
                    <el-option
                      v-for="item in unitOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                          </el-select>
                    </el-form-item>
                    <el-form-item label="职能 *：">
                        <el-input v-model="form.data6" type="textarea" :autosize="{minRows:2}"></el-input>
                    </el-form-item>
                          <el-form-item label="实施机构 *：">
                        <el-select v-model="form.data5" placeholder="请选择" style="width:100%">
                    <el-option
                      v-for="item in unitOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                          </el-select>
                    </el-form-item>
                      <el-form-item label="职能 *：">
                        <el-input v-model="form.data7" type="textarea" :autosize="{minRows:2,maxRows:4}"></el-input>
                    </el-form-item>
               </el-form>
          </div>
      </div>
      <div class="info">
          <div class="title">
             <h3>建设可行性</h3>
          </div>
          <div class="content">
              <el-form label-position="right" label-width="240px" :model="form">
                  <el-form-item label="新技术应用 *：">
                    <el-switch
                      v-model="form.data8"
                      active-color="#60bfed"
                      inactive-color="#ff4949">
                    </el-switch>
                  </el-form-item>
                  <el-form-item label="实施保障 *：">
                      <el-select v-model="form.data9" placeholder="请选择" style="width:100%">
                    <el-option
                      v-for="item in shishiOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                          </el-select>
                  </el-form-item>
              </el-form>
          </div>
      </div>
        <div class="general" style="paddingBottom:20px;">
            <div class="title">
               <h3>发起流程</h3>
            </div>
            <div class="content">
              <el-form label-position="right" label-width="240px" :model="form">
                <el-form-item label="申报说明：">
                    <el-input size="small" v-model="form.data10"></el-input>
                </el-form-item>
              </el-form>
              <el-row align="center">
                   <el-col :span="10" align="right"  offset="2">
                  <el-button style="width:50%;backgroundColor:#19a689;color:#fff;height:34px;">提交</el-button>
               </el-col>
              <el-col :span="10" align="left" offset="2" >
                   <el-button style="width:50%;backgroundColor:#19a689;color:#fff;height:34px;">保存</el-button>
              </el-col>
              </el-row>
            </div>
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
 name: 'planDeclare',
 components: {
    ecoContent,
    ecoLoading,
    ecoToolTitle,

  },
 data () {
 return {
   form:{
     data1:3,
     data2:6,
     data3:6,
     data4:'',
     data5:1,
     data8:false,
     data9:1,
     data10:'',
     data6:'负责全市党务信息化的规划、建设和管理工作，负责全市电子政务的管理、统筹、协调、推进和技术支持工作，承担市委办公厅、市政府办公厅信息化系统的建设和管理工作。',
     data7:'"（一）贯彻执行国家、省有关数据资源管理的方针政策和法律法规；受委托起草我市相关的地方性法规、规章草案和规范性文件，经审议通过后组织实施；拟订全市数据资源发展战略、发展规划、年度计划、政策措施和评价体系并组织实施。（二）组织实施国家和地方数据技术标准；研究制定我市数据资源采集、存储、使用、开放、共享等标准规范，并监督实施。（三）负责全市政务数据和公共数据平台建设和管理；组织协调全市政务数据和公共数据资源的目录制定、归集管理、整理利用、共享开放；推动数据资源在政府管理和社会治理领域的应用，组织实施城市“数据大脑”等重大项目的建设。（四）指导全市经济社会各领域的数据开发利用工作，促进全市大数据产业发展。（五）指导全市数据安全保障体系建设，组织实施全市政务数据和公共数据的安全保障工作。（六）组织协调市政府系统智慧电子政务项目和数据资源基础设施的建设、管理和绩效评估。（七）负责“中国XX”政府门户网站的建设与管理等工作，指导各区、县（市）政府和市直单位电子政务建设与门户网站建设；承担市政府信息公开数据资源平台建设管理和服务保障工作。（八）负责全市数据资源、政务信息化领域的对外交流合作；会同有关部门做好全市大数据、政务信息化人才培养等工作。（九）承办市政府交办的其他事项。',
     startTime:2021,
     endTime:2022,
   },
        options:[
        {
          label:'2020',
          value:2020
        },
        {
          label:'2021',
          value:2021
        },
        {
          label:'2022',
          value:2022
        },
        {
          label:'2023',
          value:2023
        },
     ],
     unitOptions:[
        {
          label:'XX市数据资源管理局',
          value:1
        },
        {
          label:'XX市大数据管理服务中心（XX市人民政府电子政务办公室）',
          value:2
        }
     ],
     shishiOptions:[
       {
         label:'创新应用（已有成功案例）',
         value:1
       },
       {
         label:'成熟应用',
         value:2
       },
       {
         label:'创新应用（国内首创）',
         value:3
       },
     ]
 }
 }
}
</script>

<style scoped>
.planDeclare {
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
