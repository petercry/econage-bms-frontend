<template>
        <div >
            <el-form ref="form" :model="form" label-width="80px" style="margin:0px 10px;">
                <el-form-item label="分组" prop="group">
                  <el-input v-model="form.group"></el-input>
                </el-form-item>

                <el-form-item label="语言" prop="locale" :rules="[
                  { required: true, message: '必须选择语言'}
                ]">
                    <el-select v-model="form.locale" placeholder="请选择语言" style="width:100%;">
                      <el-option v-for="(item, key) in i18nMap" :key="key" :label="item" :value="key"></el-option>
                    </el-select>
                </el-form-item>
              
                <el-form-item label="内容" prop="content" :rules="[
                      { required: true, message: '内容不能为空'}
                    ]">
                      <el-input type="textarea" :autosize="{ minRows: 10}" v-model="form.content"></el-input>
                </el-form-item>

                  <el-form-item label="">
                      <el-button type="primary" @click.native="save">
                        保存
                        <i class="el-icon-check el-icon--right"></i>
                      </el-button>
                  </el-form-item>
            </el-form>
      </div>
</template>
<script>


import ecoContent from '@/components/pageAb/ecoContent.vue'
import {getI18nMap,i18nBatch} from '@/modules/common/service/service.js'
import {Loading } from 'element-ui';
import {EcoUtil} from '@/components/util/main.js'

export default{
  name:'i18nBatch',
  components:{
      ecoContent
  },
  data(){
    return {
      i18nMap:{},
      form:{
          group:'',
          locale:'',
          content:'',
      }
    }
  },
  mounted(){
      this.getI18nMap();
  },
  methods: {
    getI18nMap(){
        getI18nMap().then((response)=>{
            this.i18nMap = response.data;
        }).catch((error)=>{
        });
    },

    save(){
      this.$refs['form'].validate((valid) => {
          if (valid) {
             let loadingInstance = Loading.service({ fullscreen: true,text:'正在保存...'});
              i18nBatch(this.form).then((res)=>{
                  this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                      loadingInstance.close();
                  });
                  this.$message({type: 'success',message: '添加成功！'});

                  let doObj = {}
                  doObj.action = 'i18nAddCallBack';
                  doObj.close = true;
                  EcoUtil.getSysvm().callBackDialogFunc(doObj);
                
              }).catch((error)=>{
                  this.$message({type: 'error',message: '添加失败！'});
              })
          } else {
            return false;
          }
      });
    }
  },
  watch: {

  }
}
</script>
<style>

</style>
