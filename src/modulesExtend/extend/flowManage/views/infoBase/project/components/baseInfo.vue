<template>
 <div class="baseInfo">
      <!-- 预审基本信息 -->
      <div class="general">
          <div class="content">
            <el-form label-position="right" label-width="240px" :model="form">
            <el-col :span="12">
                 <el-form-item label="项目年度计划编号：">
              <el-input v-model="form.jihuaNum"></el-input>
          </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="项目内部编号：">
              <el-input v-model="form.neibuNum" readonly></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目起始年份：">
              <el-input v-model="form.startTime" readonly> </el-input>
            </el-form-item>
              </el-col>
            <el-col :span="12">
                 <el-form-item label="项目截止年份：">
              <el-input v-model="form.endTime" readonly></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="12">
               <el-form-item label="申报资金：">
              <el-input v-model="form.money1" readonly></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="12">
                  <el-form-item label="财政审核金额：">
              <el-input v-model="form.money2" readonly></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="12">
                 <el-form-item label="项目建设模式：">
              <el-input v-model="form.moshi" readonly></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="12">
                  <el-form-item label="项目管理分类：">
              <el-input v-model="form.fenlei" readonly></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="项目属性：">
              <el-input v-model="form.shuxing" readonly></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="12">
                 <el-form-item label="功能科目名称：">
              <el-input v-model="form.funName" readonly></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="12">
                 <el-form-item label="是否上云：">
              <el-input v-model="form.yun" readonly></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="12">
                  <el-form-item label="是否数据归集：">
              <el-input v-model="form.guiji" readonly></el-input>
            </el-form-item>
            </el-col>
            <el-form-item label="项目建设内容：">
              <el-input v-model="form.content" readonly></el-input>
            </el-form-item>
            <el-form-item label="项目建设简介：">
              <el-input v-model="form.desc" type="textarea" readonly></el-input>
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
      jihuaNum:'dzzw_zw201619',
      neibuNum:'XXH-2016095002002',
      startTime:'2016',
      endTime:'2017',
      money1:'2017',
      money2:'360.0',
      moshi:'新建',
      fenlei:'信息化建设专项（政府投资类）',
      shuxing:'',
      funName:'科技成果转化与扩散',
      yun:'否',
      guiji:'否',
      content:'',
      desc:'建成覆盖市府大楼、市府综合楼及市民中心的信息化基础平台，该平台将作为市电子政务外网的基础平台，可承载高清视频会议系统等各种智慧电子政务应用。'
   }
 }
 }
}
</script>

<style scoped>
.general{
  width: 100%;
  /* height: 260px; */
  /* background-color: #fafafa;
  border-left: 3px solid #808b97;
  padding: 10px; */
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
