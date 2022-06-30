<template>

    <div class="wfCategoryAdd">

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
              <el-button type="primary" @click="addFunc">保存 <i class="el-icon-check el-icon--right"></i></el-button>
          </div>
    </div>

</template>

<script>

import {Loading } from 'element-ui';
import EcoUtil from '@/components/util/main.js'
import {addWFGroup} from '../../service/service.js'
import { mapState } from 'vuex';
export default {
  name:'editSysMenu',
  components:{
 
    
  },
  props: {
 
  },
  data() {
    return {
    
      form:{
            name:null,   
            code:null, 
            parentId:null,
            comments:'',    //备注
      },
      
      rules:{
        
      }
    };
  },
  mounted(){
      this.form.parentId = this.$route.params.parentId;
  },
  created(){
  
  },
  computed:{
  
  },
  methods:{
        addFunc(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    let loadingInstance = Loading.service({ fullscreen: true,text:'正在添加...'});

                    addWFGroup(this.form).then((res)=>{
                            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                                loadingInstance.close();
                            });

                            if (res.data){
                                this.$message({type: 'success',message: '添加成功！'});
                                let doObj = {}
                                if(this.form.parentId == 0){
                                    doObj.action = 'wfCategoryAddCallBack-root';
                                }else{
                                    doObj.action = 'wfCategoryAddCallBack';
                                }
                                doObj.data = {};
                                doObj.data.queryObj = res.data;
                                doObj.close = true;
                                EcoUtil.getSysvm().callBackDialogFunc(doObj);
                          
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

.wfCategoryAdd .btn{
    margin-top:30px;
    text-align: right;
    margin-right:10px;
}
</style>
