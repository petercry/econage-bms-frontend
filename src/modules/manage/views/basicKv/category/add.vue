<template>
    <div class="basicKvCategoryAdd">
            <el-form ref="form" :model="form" label-width="100px" size="mini">
                <el-form-item label="ID">
                    <el-input v-model="form.id"></el-input>
                </el-form-item>

                <el-form-item label="名称" prop="name" :rules="[ { required: true, message: '名称不能为空'}]">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>

                <el-form-item label="排序">
                    <el-input-number v-model="form.order" :min="0"></el-input-number>
                </el-form-item>

                <el-form-item label="国际化编码">
                    <el-input v-model="form.i18nKey"></el-input>
                </el-form-item>

                <el-form-item label="备注">
                    <el-input v-model="form.description"></el-input>
                </el-form-item>

                <el-form-item label="">
                    <el-button type="primary" @click.native="addBasicKvCategory">
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
import {addBasicKvCategory} from '@/modules/manage/service/service.js'
import { mapState } from 'vuex';
export default {
  name:'basicKvCategoryAdd',
  components:{
  
  },
  props: {
 
  },
  data() {
    return {
      form:{
        name:'',   //菜单名称
        i18nKey:'', //国际化key
        id:'', //ID
        description:'',    //备注
        order:1,    //序号
      },
      rules:{}
    };
  },
  mounted(){
   
  },
  created(){
  },
  computed:{
  
  },
  methods:{
    addBasicKvCategory(){
      this.$refs['form'].validate((valid) => {
          if (valid) {
                let loadingInstance = Loading.service({ fullscreen: true,text:'正在添加...'});
                addBasicKvCategory(this.form).then((res)=>{
                        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                              loadingInstance.close();
                        });

                        if (res.data&&res.data.id){
                            this.$message({type: 'success',message: '添加成功！'});

                            let doObj = {}
                            doObj.action = 'basicKvCategoryAddCallBack';
                            doObj.data = {};
                            doObj.data.queryObj = res.data;
                            doObj.close = true;
                            EcoUtil.getSysvm().callBackDialogFunc(doObj);
                        
                        }else{
                                this.$message({type: 'error',message: '添加失败！'});
                        }
                }).catch((error)=>{
                         this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                              loadingInstance.close();
                        });
                        this.$message({type: 'error',message: '添加失败！'});
                })
          } else {
            return false;
          }
      });
    },
  },

  destroyed(){

  }

};

</script>

<style scoped>

</style>
