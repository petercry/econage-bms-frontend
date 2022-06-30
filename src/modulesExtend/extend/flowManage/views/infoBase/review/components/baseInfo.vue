<template>
 <div class="baseInfo">
      <!-- 预审基本信息 -->
      <div class="general">
          <div class="title">
             <h3>项目概况</h3>
          </div>
          <div class="content">
            <el-form label-position="right" label-width="240px" :model="form">
            <el-form-item label="项目类型：">
          <el-tag
           size="medium"
           color="#1c84c6"
           style="fontWeight:700;fontSize:16px"
            effect="dark">
            {{ form.type }}
          </el-tag>
          </el-form-item>
            <el-form-item label="是否涉密：">
              <el-input v-model="form.screct" readonly></el-input>
            </el-form-item>
            <el-col :span="12">
              <el-form-item label="项目开始年度：">
              <el-input v-model="form.startTime" readonly> </el-input>
            </el-form-item>
              </el-col>
            <el-col :span="12">
                 <el-form-item label="项目结束年度：">
              <el-input v-model="form.endTime" readonly></el-input>
            </el-form-item>
            </el-col>
            <el-form-item label="启动年限：">
              <el-input v-model="form.year" readonly></el-input>
            </el-form-item>
          </el-form>
          </div>
      </div>
      <div class="info">
          <div class="title">
             <h3>项目基本信息</h3>
          </div>
           <div class="content">
            <el-form label-position="right" label-width="240px" :model="form">
            <el-form-item label="项目名称：">
            <el-input v-model="form.name" readonly></el-input>
          </el-form-item>
            <el-form-item label="申报单位：">
              <el-input v-model="form.unit" readonly></el-input>
            </el-form-item>
            <el-form-item label="职能：">
              <el-input v-model="form.zhineng"   :autosize="{ minRows: 4}"
              type="textarea" readonly> </el-input>
            </el-form-item>
            <el-form-item label="实施机构 ：">
              <el-input v-model="form.jigou" readonly></el-input>
            </el-form-item>
            <el-col :span="12">
                <el-form-item label="项目负责人：">
              <el-input v-model="form.person" readonly></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="12">
                  <el-form-item label="职务：">
              <el-input v-model="form.zhiwu" readonly></el-input>
            </el-form-item>
            </el-col>
            <el-row>
                   <el-col :span="12">
                  <el-form-item label="项目联系人：">
              <el-input v-model="form.lianxiren" readonly></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="12">
                 <el-form-item label="部门：">
              <el-input v-model="form.bumen" readonly></el-input>
            </el-form-item>
            </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                  <el-form-item label="手机号码：">
              <el-input v-model="form.phone" readonly></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="12">
               <el-form-item label="电话：">
              <el-input v-model="form.tel" readonly></el-input>
            </el-form-item>
            </el-col>
            </el-row>
            <el-row>
                  <el-col :span="12">
                <el-form-item label="电子邮件：">
              <el-input v-model="form.email" readonly></el-input>
            </el-form-item>
            </el-col>
            </el-row>
          </el-form>
          </div>
      </div>
      <div class="general" style="marginTop:3px">
          <div class="title">
             <h3>项目背景</h3>
          </div>
          <div class="content">
            <el-form label-position="right" label-width="240px" :model="form">
            <el-form-item label="建设期：">
              <el-input v-model="form.jianshe" readonly></el-input>
            </el-form-item>
              <el-form-item label="项目管理分类：">
              <el-input v-model="form.guanlifenlei" readonly> </el-input>
            </el-form-item>
                 <el-form-item label="业务类型：">
              <el-input v-model="form.yewuType" readonly></el-input>
            </el-form-item>
            <el-form-item label="运行网络环境：">
              <el-input v-model="form.network" readonly></el-input>
            </el-form-item>
            <el-form-item label="行业类别：">
              <el-input v-model="form.hangyeleibie" readonly></el-input>
            </el-form-item>
            <el-form-item label="客户端：">
              <el-input v-model="form.client" readonly></el-input>
            </el-form-item>
            <el-form-item label="是否调研：">
              <el-switch
              v-model="form.diaoyan"
               active-text="是"
              inactive-text="否"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
            </el-form-item>
            <el-form-item label="项目主要建设内容：">
             <el-input v-model="form.jiansheContent"   :autosize="{ minRows: 4}"
              type="textarea" readonly> </el-input>
            </el-form-item>
          </el-form>
          </div>
      </div>
 </div>
</template>

<script>
export default {
 name: 'baseInfo',
 data () {
 return {
   form:{
      type:'新建',
      screct:'非密',
      startTime:'2021',
      endTime:'2021',
      year:'下一年度项目',
      name:'XX市数据资源平台2.0项目',
      unit:'XX市管理局',
      zhineng:'"（一）贯彻执行国家、省有关数据资源管理的方针政策和法律法规；受委托起草我市相关的地方性法规、规章草案和规范性文件，经审议通过后组织实施；拟订全市数据资源发展战略、发展规划、年度计划、政策措施和评价体系并组织实施。（二）组织实施国家和地方数据技术标准；研究制定我市数据资源采集、存储、使用、开放、共享等标准规范，并监督实施。',
      jigou:'XX市数据资源管理局',
      person:'XXX',
      zhiwu:'未知',
      lianxiren:'XXX',
      bumen:'基础设施和安全科',
      phone:'1234',
      tel:'456',
      email:'',
      jianshe:'3个月以内',
      guanlifenlei:'信息化建设专项（政府投资类）',
      yewuType:'基础设施类',
      network:'政务外网,政务专网',
      hangyeleibie:'党建,教育,医疗,社区,城管,市场监管',
      client:'PC端,自助端',
      diaoyan:false,
      jiansheContent:'测试'
   }
 }
 }
}
</script>

<style scoped>
.general{
  width: 100%;
  /* height: 260px; */
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
</style>
