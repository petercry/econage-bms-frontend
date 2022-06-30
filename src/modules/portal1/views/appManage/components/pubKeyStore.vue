<template>
    <div>
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="是否生效">
          <el-checkbox v-model="form.valid" ></el-checkbox>
        </el-form-item>
        <el-form-item label="是否访问全体账号">
          <el-checkbox v-model="form.allUserAccessible" ></el-checkbox>
        </el-form-item>
        <el-form-item label="成员" v-if="!form.allUserAccessible">
          <div class="display-input"  @click="openUserChooser">
            <el-tag
              v-for="(item, index) in form.members" :key="index"
              closable
              type="info"
              @close="form.members.splice(index,1)">
              {{item.orgPath}}
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item label="是否检查令牌过期">
          <el-checkbox v-model="form.checkExpire" ></el-checkbox>
        </el-form-item>
        <el-form-item label="是否用于单点登陆">
          <el-checkbox v-model="form.canSso" ></el-checkbox>
        </el-form-item>
        <el-form-item label="公共密钥">
          <el-input type="textarea" rows="6" v-model="form.pubKey" placeholder="请用RSA签名生成工具生成密钥"></el-input>
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
import {getAppPubkeyStore,editAppPubkeyStoreAjax} from '@/modules/portal1/service/service.js'
export default{
  name:'appEdit',
  components:{
    ecoLoading,
    ecoContent,
  },
  data(){
    return {
      // origin:null,
      form:{
        valid:false,
        allUserAccessible:false,
        members:[],
        canSso:true,
        pubKey:'',
        checkExpire:false,
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
      getAppPubkeyStore(id).then((response)=>{
        if (response.data){
          // that.origin = response.data;
          that.form.valid = response.data.valid;
          that.form.allUserAccessible = response.data.allUserAccessible;
          // that.form.members = response.data.members;
          if (response.data.members){
            EcoOrgPick.loadByOrgIds(response.data.members.map(item=>{return item.userOrgId})).then(res=>{
              that.form.members = res.data
            }).catch(e=>{})
          }
          that.form.canSso = response.data.canSso;
          that.form.pubKey = response.data.pubKey;
          that.form.checkExpire = response.data.checkExpire;
        }
      }).catch((error)=>{
      });
    },
    openUserChooser(){
      let options = {
          selectMulti:true,
          selectType:'User',
          selectDefault:'',
          deptScopeType:'MANAGE',
      }
      options.selectDefault = this.form.members.map(item=>{return item.userOrgId}).join(',');
      var that  = this;
      let callBack = function(callObj){
        that.form['members'] = callObj.map(item=>{
          item.userOrgId=item.orgId;
          item.userId=item.resourceId;
          return item;
        });
      }
      EcoOrgPick.searchReceiver(options,callBack);
    },
    save(){
      this.$refs['form'].validate((valid) => {
          if (valid) {
            let id = this.$route.params.appId;
            this.$refs.ecoLoadingRef.open();
            editAppPubkeyStoreAjax(id,this.form).then((res)=>{
              try {
                  this.saveSuccess();
              } catch (error) {}
            }).catch((error)=>{
              this.$refs.ecoLoadingRef.close();
              this.$message({type: 'error',message: '保存失败！'});
            })
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
