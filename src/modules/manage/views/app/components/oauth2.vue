<template>
    <div>
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="是否生效">
          <el-checkbox v-model="form.valid" ></el-checkbox>
        </el-form-item>
        <el-form-item label="重定向地址">
          <el-input v-model="form.redirectHost" ></el-input>
        </el-form-item>
        <el-form-item label="移动端重定向地址">
          <el-input v-model="form.redirectHost4Mobile" ></el-input>
        </el-form-item>
        <el-form-item label="密钥">
          <el-button type="primary" @click.native="getNewKey">
              生成密钥
            </el-button>
          <el-input type="textarea" rows="6" v-model="form.secret"></el-input>
        </el-form-item>
        <el-form-item label="">
            <el-button type="primary" @click.native="save">
              保存
            </el-button>
          </el-form-item>
      </el-form>
    </div>
</template>
<script>
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import EcoOrgPick from '@/components/orgPick/main.js'
import {addAppOauth2Ajax,getAppOauth2,editAppOauth2Ajax,getAppOauth2NewKey} from '@/modules/manage/service/service.js'
export default{
  name:'appEdit',
  components:{
    ecoLoading,
    ecoContent,
  },
  data(){
    return {
      origin:null,
      form:{
        appId:'',
        valid:false,
        redirectHost:'',
        redirectHost4Mobile:'',
        secret:'',
      }
    }
  },
  created(){
  },
  mounted(){
    this.getData();
  },
  methods: {
    getData(){
      var that = this;
      let id = this.$route.params.appId; 
      that.form.appId = id;
      getAppOauth2(id).then((response)=>{
        if (response.data){
          that.origin = response.data;
          that.form.valid = response.data.valid;
          that.form.redirectHost = response.data.redirectHost;
          that.form.redirectHost4Mobile = response.data.redirectHost4Mobile;
          that.form.secret = response.data.secret;
        }
      }).catch((error)=>{
      });
    },
    getNewKey(){
      getAppOauth2NewKey().then((response)=>{
        this.form.secret = response.data;
      }).catch((error)=>{
      });
    },
    save(){
      this.$refs['form'].validate((valid) => {
          if (valid) {
            let id = this.$route.params.appId;
            this.$refs.ecoLoadingRef.open();
            // if (this.origin){
              editAppOauth2Ajax(id,this.form).then((res)=>{
                try {
                    this.saveSuccess();
                } catch (error) {}
              }).catch((error)=>{
                this.$refs.ecoLoadingRef.close();
                this.$message({type: 'error',message: '保存失败！'});
              })
            // }else{
            //   addAppOauth2Ajax(this.form).then((res)=>{
            //     if (res.data&&res.data.id){
            //       try {
            //         this.origin = res.data;
            //         this.saveSuccess();
            //       } catch (error) {}
            //     }
                
            //   }).catch((error)=>{
            //     this.$refs.ecoLoadingRef.close();
            //     this.$message({type: 'error',message: '保存失败！'});
            //   })
            // }
          } else {
            return false;
          }
      });
    },
    saveSuccess(){
      this.$refs.ecoLoadingRef.close();
      window.parent.sysvm.$confirm('保存成功！点击确定关闭修改框', '提示', {
        type: 'success'
      }).then(() => {
        let doObj = {}
        // doObj.action = 'appEditCallBack';
        doObj.close = true;
        parent.window.sysvm.callBackDialogFunc(doObj);
      }).catch(() => {});
    }
  },
  watch: {
  }
}
</script>
<style>
</style>
