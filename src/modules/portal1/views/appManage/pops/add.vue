<template>
    <div>
      <!-- 没在使用 -->
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <ecoContent top="0" bottom="0" style="padding:40px 20px 10px;">
        <el-form ref="form" :model="form" label-width="140px">
          <el-form-item label="应用名称" prop="appName" :rules="[
            { required: true, message: '应用名称不能为空'}
          ]">
            <el-input v-model="form.appName"></el-input>
          </el-form-item>
          <el-form-item label="重定向地址">
            <el-input v-model="form.oauth2.redirectHost" ></el-input>
          </el-form-item> 
          <el-form-item label="移动端重定向地址">
            <el-input v-model="form.oauth2.redirectHost4Mobile" ></el-input>
          </el-form-item>
          <el-form-item label="密钥">
            <el-button type="primary" @click.native="getNewKey">
                生成密钥
              </el-button>
            <el-input type="textarea" rows="6" v-model="form.oauth2.secret"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click.native="save">
              保存
              <i class="el-icon-check el-icon--right"></i>
            </el-button>
          </el-form-item>
        </el-form>
      </ecoContent>
      <!-- <div class="kn-main">
        
      </div> -->
    </div>
</template>
<script>
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {appPortalAddAjax,getAppOauth2NewKey} from '@/modules/portal1/service/service.js'
import {mapMutations} from 'vuex'
export default{
  name:'appAdd',
  components:{
    ecoLoading,
    ecoContent
  },
  data(){
    return {
      form:{
        appName:'',
        oauth2:{
          secret:'',
          redirectHost:'',
          redirectHost4Mobile:''
        }
      }
    }
  },
  mounted(){
  },
  methods: {
    getNewKey(){
      getAppOauth2NewKey().then((response)=>{
        this.form.oauth2.secret = response.data;
      }).catch((error)=>{
      });
    },
    save(){
      this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$refs.ecoLoadingRef.open();
            appPortalAddAjax(this.form).then((res)=>{
              if (res.data&&res.data.id){
                try {
                  this.$message({type: 'success',message: '添加成功！'});
                  this.$refs.ecoLoadingRef.close();
                  let doObj = {}
                  doObj.action = 'appEditCallBack';
                  doObj.close = true;
                  parent.window.sysvm.callBackDialogFunc(doObj);
                } catch (error) {
                }
              }else{
                this.$refs.ecoLoadingRef.close();
                this.$message({type: 'error',message: '添加失败！'});
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
