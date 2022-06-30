<template>
    <div class="basicKvDetailAdd">
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="ID">
                <el-input v-model="form.id"></el-input>
            </el-form-item>

          <el-form-item label="名称" prop="text">
              <el-input v-model="form.text"></el-input>
          </el-form-item>

          <el-form-item label="简称" prop="text">
              <el-input v-model="form.shortName"></el-input>
          </el-form-item>

           <el-form-item label="编码/备注" prop="text">
              <el-input v-model="form.code"></el-input>
          </el-form-item>

          <el-form-item label="国际化键" prop="i18nKey">
              <el-input v-model="form.i18nKey"></el-input>
          </el-form-item>

          <el-form-item label="排序" prop="order">
              <el-input-number v-model="form.order" :min="1"></el-input-number>
          </el-form-item>

          <el-form-item label="添加可用" prop="enableInCreate">
              <el-checkbox v-model="form.enableInCreate" disabled></el-checkbox>
          </el-form-item>

          <el-form-item label="更新可用" prop="enableInUpdate">
             <el-checkbox v-model="form.enableInUpdate" disabled></el-checkbox>
          </el-form-item>

          <el-form-item label="查询可用" prop="enableInSelect">
              <el-checkbox v-model="form.enableInSelect" disabled></el-checkbox>
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

import {Loading } from 'element-ui';
import EcoUtil from '@/components/util/main.js'
import {addBasicKv} from '../../../service/service.js'
import {mapMutations} from 'vuex'

export default{
  name:'basicKvDetailAdd',
  components:{

  },
  data(){
    return {
      form:{
          group:'',
          id:'',
          text:'',
          shortName:'',
          code:'',
          i18nKey:'',
          i18nText:'',
          order:1,
          enableInCreate:true,
          enableInUpdate:true,
          enableInSelect:true,
      }
    }
  },
  mounted(){
      this.form.group = this.$route.params.group;
  },
  methods: {
    save(){
      this.$refs['form'].validate((valid) => {
          if (valid) {
            let loadingInstance = Loading.service({ fullscreen: true,text:'正在添加...'});
            addBasicKv(this.form).then((res)=>{
                  this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                            loadingInstance.close();
                  });
                  if (res.data&&res.data.id){
                    try {
                          this.$message({type: 'success',message: '添加成功！'});
                          let doObj = {}
                          doObj.action = 'basicKvDetailAddCallBack';
                          doObj.close = true;
                          EcoUtil.getSysvm().callBackDialogFunc(doObj);
                    } catch (error) {}
                  }else{
                      this.$message({type: 'error',message: '添加失败！'});
                  }
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
