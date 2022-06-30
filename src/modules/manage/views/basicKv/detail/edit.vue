<template>
    <div> 
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="ID">
                 <el-input disabled v-model="form.id"></el-input>
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
                <el-input v-model="form.order"></el-input>
            </el-form-item>

            <el-form-item label="添加可用" prop="enableInCreate">
                <el-checkbox v-model="form.enableInCreate"></el-checkbox>
            </el-form-item>

            <el-form-item label="更新可用" prop="enableInUpdate">
                <el-checkbox v-model="form.enableInUpdate"></el-checkbox>
            </el-form-item>

            <el-form-item label="查询可用" prop="enableInSelect">
                <el-checkbox v-model="form.enableInSelect"></el-checkbox>
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
import {updateBasicKv} from '../../../service/service.js'

export default{
  name:'basicKvDetailEdit',
  components:{
  },
  data(){
    return {
      form:{
          id:'',
          text:'',
          shortName:'',
          code:'',
          i18nKey:'',
          order:1,
          enableInCreate:true,
          enableInUpdate:true,
          enableInSelect:true,
      }
    }
  },
  mounted(){
      this.getData();
  },
  methods: {
    getData(){
          let _storeKey = this.$route.params.key;
          let _storeData = EcoUtil.objDeepCopy(EcoUtil.getSysvm().getTempStore(_storeKey));
          EcoUtil.getSysvm().deleteTempStore(_storeKey);
          
          this.form.id = _storeData.item.id;
          this.form.text = _storeData.item.text;
          this.form.shortName = _storeData.item.shortName;
          this.form.code = _storeData.item.code;
          this.form.i18nKey = _storeData.item.i18nKey;
          this.form.order = _storeData.item.order;

          this.form.enableInCreate = _storeData.item.enableInCreate;
          this.form.enableInUpdate = _storeData.item.enableInUpdate;
          this.form.enableInSelect = _storeData.item.enableInSelect;
         
    },
    save(){
      this.$refs['form'].validate((valid) => {
           if (valid) {
                let loadingInstance = Loading.service({ fullscreen: true,text:'正在修改...'});
                updateBasicKv(this.form).then((res)=>{
                    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                                loadingInstance.close();
                    });
                    if (res.data && res.data.id){
                    try {
                            this.$message({type: 'success',message: '编辑成功！'});
                            let doObj = {}
                            doObj.action = 'basicKvDetailEditCallBack';
                            doObj.close = true;
                            EcoUtil.getSysvm().callBackDialogFunc(doObj);
                      } catch (error) { }
                    }else{
                        this.$message({type: 'error',message: '编辑失败！'});
                    }
                }).catch((error)=>{
                      this.$message({type: 'error',message: '编辑失败！'});
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
