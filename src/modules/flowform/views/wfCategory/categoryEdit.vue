<template>

    <div class="wfCategoryEdit">

        <el-form ref="form" :model="form" label-width="120px" label-position="left">
            
            <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '名称不能为空'}]">
                <el-input v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item label="编码">
                  <el-input v-model="form.code"></el-input>
            </el-form-item>
            
            <el-form-item label="备注">
                <el-input v-model="form.comments"></el-input>
            </el-form-item>
          
          </el-form>

          <div class="btn">
              <el-button @click="cancelFunc">取消</el-button>
              <el-button type="primary" @click="saveFunc">保存 <i class="el-icon-check el-icon--right"></i></el-button>
          </div>
    </div>

</template>

<script>

import {Loading } from 'element-ui';
import EcoUtil from '@/components/util/main.js'
import {getCategorySingleById,updateWFCategory} from '../../service/service.js'

export default {
  name:'wfCategoryEdit',
  components:{
    
  },
  props: {
 
  },
  data() {
    return {
      form:{
            id:'', //ID
            name:null,   
            code:null, 
            parentId:null,
            comments:'',
      },
      rules:{
        
      }
    };
  },
  mounted(){
            this.form.id = this.$route.params.id;
            this.getData();
  },
  created(){
  
  },
  computed:{
  
  },
  methods:{
        getData(){
                getCategorySingleById(this.form.id).then((response)=>{
                        this.form.name = response.data.name;
                        this.form.code = response.data.code;
                        this.form.parentId = response.data.parentId;
                        this.form.comments = response.data.comments;
                }).catch((error)=>{ });
        },

        saveFunc(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    let loadingInstance = Loading.service({ fullscreen: true,text:'正在更新...'});
                    updateWFCategory(this.form).then((res)=>{
                        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                              loadingInstance.close();
                        });

                        if (res.data){
                            this.$message({type: 'success',message: '更新成功！'});
                            let doObj = {}
                            if(this.form.parentId == 0){
                                doObj.action = 'wfCategoryEidtCallBack-root';
                            }else{
                                doObj.action = 'wfCategoryEditCallBack';
                            }
                            doObj.data = {};
                            doObj.data.queryObj = EcoUtil.objDeepCopy(this.form);
                            doObj.close = true;
                            EcoUtil.getSysvm().callBackDialogFunc(doObj);
                        }else{
                            this.$message({type: 'error',message: '更新失败！'});
                        }
                  }).catch((error)=>{
                         this.$message({type: 'error',message: '更新失败！'});
                  })
                } else {
                    return false;
                }
            });
        },


        cancelFunc(){
              EcoUtil.getSysvm().closeDialog();
        }
  },

  destroyed(){

  }

};

</script>

<style scoped>

.wfCategoryEdit .btn{
    margin-top:30px;
    text-align: right;
    margin-right:10px;
}
</style>
