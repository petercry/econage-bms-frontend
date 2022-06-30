<template>
    <div>
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <ecoContent top="0" bottom="0" style="padding:40px 20px 10px;">
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
      </ecoContent>
    
    </div>
</template>
<script>

import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {instancePrivilegeAddAjax} from '../../service/service.js'

export default{
  name:'instancePrivilegeAdd',
  components:{
    ecoLoading,
    ecoContent
  },
  data(){
    return {
      form:{
        order:'',
        name:'',
        comment:'',
      }
    }
  },
  mounted(){
  },
  methods: {
 
    save(){
      this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$refs.ecoLoadingRef.open();
            instancePrivilegeAddAjax(this.form).then((res)=>{
              try {
                if (res.data&&res.data.id){
                  this.$message({type: 'success',message: '添加成功！'});
                  this.$refs.ecoLoadingRef.close();
                  let doObj = {}
                  doObj.action = 'instancePrivilegeAddCallBack';
                  doObj.close = true;
                  parent.window.sysvm.callBackDialogFunc(doObj);
                }
              } catch (error) {
                
              }
            }).catch((error)=>{
              this.$refs.ecoLoadingRef.close();
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
