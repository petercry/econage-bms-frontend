<template>
    <div>
     
      <ecoContent top="0" bottom="0" style="padding:10px 20px 10px;">
        <el-form ref="form" :model="form" label-width="140px">
          <el-form-item label="应用id">
            {{$route.params.appId}}
            <!-- <el-input v-model="$route.params.appId" disabled>
            </el-input> -->
          </el-form-item>
          <el-form-item label="应用编码" prop="code" :rules="[
            { required: true, message: '应用编码不能为空'}
          ]">
            <el-input v-model="form.code">
            </el-input>
          </el-form-item>
          <el-form-item label="应用名称" prop="appName" :rules="[
            { required: true, message: '应用名称不能为空'}
          ]">
            <el-input v-model="form.appName">
            </el-input>
          </el-form-item>
          <el-form-item label="是否门户显示">
            <el-checkbox v-model="form.portalShow"></el-checkbox>
          </el-form-item> 
          <el-form-item label="分支机构" prop="branchDept">
            <el-select style="width:100%;" v-model="form.branchDept" placeholder="请选择分支机构">
              <el-option label="无" :value="null"></el-option>
              <el-option v-for="item in branchList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图片">
            <ecoFileUploadSingle :modularInnerId="$route.params.appId" modular="APP_IMG" ref="ecoFileUploadRef"></ecoFileUploadSingle>
          </el-form-item>

          <el-collapse v-model="activeName" accordion>
            <el-collapse-item title="OAUTH2" name="oauth2">
              
              <el-form-item label="是否生效">
                <el-checkbox v-model="form.oauth2.valid" ></el-checkbox>
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
                <el-input style="margin-top:10px;" type="textarea" rows="6" v-model="form.oauth2.secret"></el-input>
              </el-form-item>
              
            </el-collapse-item>
            <el-collapse-item title="公共密钥" name="pubKeyStore">
             
              <el-form-item label="是否生效">
                <el-checkbox v-model="form.pubKeyStore.valid" ></el-checkbox>
              </el-form-item>
              <el-form-item label="是否检查令牌过期">
                <el-checkbox v-model="form.pubKeyStore.checkExpire" ></el-checkbox>
              </el-form-item>
              <el-form-item label="公共密钥">
                <el-input type="textarea" rows="6" v-model="form.pubKeyStore.pubKey" placeholder="请用RSA签名生成工具生成密钥"></el-input>
              </el-form-item>
             
            </el-collapse-item>
          </el-collapse>


          <div style="text-align:center;padding-top:20px;">
            <el-button @click.native="save" type="primary">保存</el-button>
          </div>
        </el-form>
          <!-- <el-tabs class="u-tab" v-model="activeName">
            <el-tab-pane label="OAUTH2" name="oauth2"></el-tab-pane>
            <el-tab-pane label="公共密钥" name="pubKeyStore"></el-tab-pane>
            <component :is="activeName"></component>
          </el-tabs> -->
          <!-- <el-form-item label="">
            <el-button type="primary" @click.native="save">
              保存
            </el-button>
          </el-form-item> -->
        
      </ecoContent>
    </div>
</template>
<script>

import ecoContent from '@/components/pageAb/ecoContent.vue'
import EcoUtil from '@/components/util/main.js'
import {appEditAjax,getAppItem,getBranchDeptList,getAppOauth2NewKey} from '../../service/service.js'
import pubKeyStore from './components/pubKeyStore.vue'
import oauth2 from './components/oauth2.vue'
import {Loading } from 'element-ui';
import ecoFileUploadSingle from '@/components/file/ecoFileUploadSingle.vue'

export default{
  name:'appEdit',
  components:{
    ecoFileUploadSingle,
    ecoContent,
    oauth2,
    pubKeyStore
  },
  data(){
    return {
      activeName:'oauth2',
      branchList:[],
      form:{
        appName:'',
        code:'',
        branchDept:'',
        portalShow:false,
        oauth2:{
          appId:'',
          valid:false,
          redirectHost:'',
          redirectHost4Mobile:'',
          secret:''
        },
        pubKeyStore:{
          valid:false,
          // allUserAccessible:false,
          // members:[],
          // canSso:true,
          pubKey:'',
          checkExpire:false,
        },
      }
    }
  },
  created(){
  },
  mounted(){
    this.getBranchDeptList();
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
    getBranchDeptList(){
      getBranchDeptList().then(res=>{
        if(res.data&&res.data.length>0){
          this.branchList = res.data;
        }
      }).catch(e=>{})
    },
    getData(){
      var that = this;
      let id = this.$route.params.appId; 
      getAppItem(id).then((response)=>{
        if (response.data&&response.data.id){
          that.form.appName = response.data.appName;
          that.form.code = response.data.code;
          that.form.branchDept = response.data.branchDept;
          that.form.portalShow = response.data.portalShow;
          if (response.data.oauth2&&response.data.oauth2.id){
            that.form.oauth2.appId = response.data.oauth2.id;
            that.form.oauth2.valid = response.data.oauth2.valid;
            that.form.oauth2.redirectHost = response.data.oauth2.redirectHost;
            that.form.oauth2.redirectHost4Mobile = response.data.oauth2.redirectHost4Mobile;
            that.form.oauth2.secret = response.data.oauth2.secret;
          }
          if (response.data.pubKeyStore&&response.data.pubKeyStore.id){
            that.form.pubKeyStore.valid = response.data.pubKeyStore.valid;
            that.form.pubKeyStore.pubKey = response.data.pubKeyStore.pubKey;
            that.form.pubKeyStore.checkExpire = response.data.pubKeyStore.checkExpire;
          }
        }
      }).catch((error)=>{
      });
    },
    save(){
      this.$refs['form'].validate((valid) => {
          if (valid) {
            let id = this.$route.params.appId;
            let loadingInstance = Loading.service({ fullscreen: true,text:'正在修改...'});
            appEditAjax(id,this.form).then((res)=>{
                  this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                      loadingInstance.close();
                  });
                  try {
                      this.$message({type: 'success',message: '编辑成功'});
                      let doObj = {}
                      doObj.action = 'appEditCallBack';
                      doObj.close = true;
                      EcoUtil.getSysvm().callBackDialogFunc(doObj);
                  } catch (error) {}
            }).catch((error)=>{
                 this.$message({type: 'error',message: '编辑失败！'});
            })
          } else {
            return false;
          }
      });
    },

    getNewKey(){
      getAppOauth2NewKey().then((response)=>{
            this.form.oauth2.secret = response.data;
      }).catch((error)=>{
      });
    },
  },
  watch: {
  }
}
</script>
<style>
</style>
