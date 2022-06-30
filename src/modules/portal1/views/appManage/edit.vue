<template>
    <div>
      <!-- 没在使用 -->
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <ecoContent top="0" bottom="0" style="padding:40px 20px 10px;">
        <el-form ref="form" :model="form" label-width="140px">
          <el-form-item label="应用名称" prop="appName" :rules="[
            { required: true, message: '应用名称不能为空'}
          ]">
            <el-input v-model="form.appName">
              <el-button slot="append" @click.native="save">更新</el-button>
            </el-input>
          </el-form-item>
        </el-form>
          <el-tabs class="u-tab" v-model="activeName">
            <!-- <el-tab-pane label="公共密钥" name="pubKeyStore"></el-tab-pane> -->
            <el-tab-pane label="OAUTH2" name="oauth2"></el-tab-pane>
            <component :is="activeName"></component>
          </el-tabs>
          <!-- <component :is="'oauth2'"></component> -->
          <!-- <el-form-item label="">
            <el-button type="primary" @click.native="save">
              保存
            </el-button>
          </el-form-item> -->
        
      </ecoContent>
    </div>
</template>
<script>
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {appEditAjax,getAppItem} from '@/modules/portal1/service/service.js'
import pubKeyStore from './components/pubKeyStore.vue'
import oauth2 from './components/oauth2.vue'
export default{
  name:'appEdit',
  components:{
    ecoLoading,
    ecoContent,
    oauth2,
    pubKeyStore
  },
  data(){
    return {
      activeName:'oauth2',
      form:{
        appName:'',
      }
    }
  },
  created(){
  },
  mounted(){
    this.getData();
  },
  methods: {
    toFormNumber($event,formVal,key){
      if (/^[0-9]*$/.test(formVal)){
      }else{
        this.$message.error('该输入框只能输入数字')
        let val = formVal.replace(/(\D+[\d\D]*)/,'')
        this.form[key] = val;
      }
    },
    getData(){
      var that = this;
      let id = this.$route.params.appId; 
      getAppItem(id).then((response)=>{
        if (response.data&&response.data.id){
          that.form.appName = response.data.appName;
        }
      }).catch((error)=>{
      });
    },
    save(){
      this.$refs['form'].validate((valid) => {
          if (valid) {
            let id = this.$route.params.appId;
            this.$refs.ecoLoadingRef.open();
            appEditAjax(id,this.form).then((res)=>{
              try {
                // if (res.data&&res.data.id){
                  // this.$message({type: 'success',message: '编辑成功！'});
                  this.$refs.ecoLoadingRef.close();
                  window.parent.sysvm.$confirm('编辑成功！点击确定关闭修改框', '提示', {
                    type: 'success'
                  }).then(() => {
                    let doObj = {}
                    doObj.action = 'appEditCallBack';
                    doObj.close = true;
                    parent.window.sysvm.callBackDialogFunc(doObj);
                  }).catch(() => {});
                // }
              } catch (error) {
                
              }
            }).catch((error)=>{
              this.$refs.ecoLoadingRef.close();
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
