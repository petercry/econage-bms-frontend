<template>
  <div class="fileInfo">

    <el-form
      ref="form"
      :model="form"
      label-width="80px"
      label-position="left"
    >
    <el-row :gutter="20">
         <el-col :span="8">
          <el-form-item label="文档编号">
        <el-input v-model="form.fileCode"></el-input>
      </el-form-item>

      </el-col>
      <el-col :span="8" :offset="6">
            <el-form-item label="关键字">
        <el-input v-model="form.keyword"></el-input>
      </el-form-item>
      </el-col>
    </el-row>
      <el-row :gutter="20">
         <el-col :span="8">
              <el-form-item label="文档摘要">
        <el-input v-model="form.summary" type="textarea"  :autosize="{ minRows: 4, maxRows: 8}"
></el-input>
      </el-form-item>
         </el-col>
         <el-col :span="8" :offset="6">
            <el-form-item label="备注">
        <el-input v-model="form.comments" type="textarea"  :autosize="{ minRows: 4, maxRows: 8}"></el-input>
      </el-form-item>
         </el-col>
      </el-row>
      <el-row :gutter="20">
         <el-col :span="8">
          <el-form-item label="修改用户">
                <el-input v-model="form.createUser"></el-input>
          </el-form-item>
         </el-col>
         <el-col :span="8" :offset="6">
          <el-form-item label="修改时间">
              <el-input v-model="form.createDate"></el-input>
          </el-form-item>
         </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'fileInfo',
  props:{
     entryobj:{
        fileCode:'',
        keyword:'',
        summary:'',
        comments:'',
        modUser:'',
        modDate:''
     }
  },
  data() {
    return {
      form:{
        fileCode:'',
        keyword:'',
        summary:'',
        comments:'',
        modUser:'',
        modDate:''
      }
    }
  },
  mounted(){
    for (const key in this.entryobj) {
      if (this.entryobj.hasOwnProperty(key)) {
       this.form[key] = this.entryobj[key];
      }
    }
  }
}
</script>

<style scoped>
.fileInfo {
  padding: 20px 20px;
}
</style>
