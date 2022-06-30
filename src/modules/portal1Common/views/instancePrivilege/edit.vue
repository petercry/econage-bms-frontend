<template>
    <div>
        
          <el-form ref="form" :model="form" label-width="80px">
                <!-- <el-form-item label="序号">
                    <el-input v-model="form.order"></el-input>
                </el-form-item> -->

                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                
                <el-form-item label="备注" prop="comment">
                  <el-input type="textarea" rows="6" v-model="form.comment"></el-input>
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
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {instancePrivilegeEditAjax,getInstancePrivilegeSingle} from '../../service/service.js'
import {Loading } from 'element-ui';
import {EcoUtil} from '@/components/util/main.js'

export default{
  name:'instancePrivilegeBaseInfo',
  components:{
    ecoLoading,
    ecoContent
  },
  data(){
    return {
      form:{
          id:'',
          order:'',
          name:'',
          comment:'',
      }
    }
  },
  mounted(){
      this.getData();
  },
  methods: {
    getData(){
          var that = this;
          let id = this.$route.params.id; 
          getInstancePrivilegeSingle(id).then((response)=>{
                if (response.data&&response.data.id){
                    that.form.id = response.data.id;
                    that.form.order = response.data.order;
                    that.form.name = response.data.name;
                    that.form.comment = response.data.comment;
                }
          }).catch((error)=>{ });
    },

    save(){
        this.$refs['form'].validate((valid) => {
            if (valid) {
              let loadingInstance = Loading.service({ fullscreen: true,text:'正在修改...'});
              instancePrivilegeEditAjax(this.form).then((res)=>{
                    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                            loadingInstance.close();
                    });

                    try {
                      if (res.data&&res.data.id){
                          this.$message({type: 'success',message: '编辑成功！'});
                          let doObj = {}
                          doObj.action = 'instancePrivilegeEditCallBack';
                          doObj.close = true;
                          EcoUtil.getSysvm().callBackDialogFunc(doObj);
                      }
                    } catch (error) {
                      
                }
              }).catch((error)=>{
                  this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                          loadingInstance.close();
                  });
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
