<template>
 <div class="resetDialog">
              <el-form label-position="right" label-width="240px" :model="form">
                    <el-form-item label="重启年度：">
                      <el-select v-model="form.data" disabled placeholder="请选择" style="width:100%">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="备注：">
                      <el-input type="textarea" :autosize="{minRows:2,maxRows:4}"></el-input>
                  </el-form-item>
                  <el-form-item>
                            <div class="redText">
                <p>请确认并承诺该项目符合重启项目要求：</p>
                <p>1. 2020年已通过预审但因预算调整暂缓建设;</p>
                <p>2. 建设需求迫切，建设目标、建设内容等情况完全与2020年申报建设方案一致的项目;</p>
                <p>3. 与已建或新建项目不存在重复建设内容。</p>
              </div>
                  </el-form-item>
              </el-form>
              <el-row>
                 <el-col  align="center">
                      <el-button style="width:50%;backgroundColor:#1ab394;color:#fff" @click="confirm">确认重启</el-button>
                 </el-col>
              </el-row>
 </div>
</template>

<script>
import { EcoUtil } from '@/components/util/main.js'
export default {
 name: 'resetDialog',
 data () {
 return {
   form:{
      data:2022,
   },
   options:[
      {
        label:'2022',
        value:2022
      }
   ]
 }
 },
 methods: {
   confirm(){
      let doObj = {};
      doObj.action = 'projectRestart';
      doObj.data = {};
      doObj.close = true;
      EcoUtil.getSysvm().callBackDialogFunc(doObj);
   }
 },
}
</script>

<style scoped>
.resetDialog{
  padding: 20px;
}
.redText{
  color: red;
  font-size: 12px;
  font-weight: 700;
}
</style>
