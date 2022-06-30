<template>
  <div class="loginVue">
       <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
                  <div class="loginDiv" v-show="activeName=='normal'">

                      <div id='loginBox'>

                          <el-form-item prop="username">
                              <!-- <span class="svg-container">
                                  <i class="icon iconfont icon-yonghu"></i>
                              </span> -->
                              <el-input
                                  v-model="loginForm.username"
                                  :placeholder="$t('login.username')"
                                  name="username"
                                  type="text"
                                  size="small"
                                   auto-complete="on"
                              />
                          </el-form-item>

                          <el-form-item prop="password">
                                  <!-- <span class="svg-container">
                                      <i class="icon iconfont icon-mima"></i>
                                  </span> -->
                                  <el-input
                                    :type="passwordType"
                                    v-model="loginForm.password"
                                    :placeholder="$t('login.password')"
                                    name="password"
                                    auto-complete="on"
                                    size="small"
                                    @keyup.enter.native="handleLogin" />
                          </el-form-item>
                          <el-row :gutter='10' v-show='pwdNeedCaptcha'>
                             <el-col :span='14'>
                              <el-form-item prop="captchaInput">
                                  <el-input
                                    v-model="loginForm.captchaInput"
                                    :placeholder="$t('login.captchaInput')"
                                    name="captchaInput"
                                    type="text"
                                    size="small"
                                    auto-complete="on"
                                    />
                              </el-form-item>
                             </el-col>
                             <el-col :span='10'>
                                <img @click='getBaseImg' :src="captchaImgInfo.imgBase64" v-show='captchaImgInfo.imgBase64' class="captchaImg"/>
                             </el-col>
                          </el-row>
                    </div>
                    <el-button :loading="loading" type="primary" class="loginBtn" @click.native.prevent="handleLogin">{{ $t('login.logIn') }}</el-button>
                    <div class="loginBottom">
                      <div class="loginBottom-left"  v-if="false&&ddSet.enabled">
                        <span>其他登陆方式</span>
                        <img src="../../assets/img/dd.png" @click="activeName='qrLogin'" />
                      </div>
                    </div>
              </div>

              <div class="qr-area" v-show="activeName=='qrLogin'">
                <!-- <div style="line-height:50px;text-align:center;#666;border-bottom:1px solid #222;">扫描钉钉二维码</div> -->
                <div class="btn-qrclose">
                  <i class="el-icon-close" v-show="!hidePassLogin" @click="activeName='normal'"></i>
                </div>
                <div id="qrcode"></div>
                <div style="text-align: center;line-height: 30px;">钉钉扫码，安全登陆</div>
                <div style="font-size: 13px;padding: 10px 18px;"></div>
              </div>
        </el-form>
        <div style="position:absolute;height:40px;width:40px;bottom:0;left:0;" @click="activeName = 'normal'"></div>
  </div>
</template>
<script>
import {loginAjax,getPublicSettingUnion,captchaFetch} from'@/modules/system/service/service'
import {loadOpRole} from '@/modules/bmsMmm/util/utility.js'
import LangSelect from '@/components/LangSelect'
import {EcoUtil} from '@/components/util/main.js'
import {EcoDate} from '@/components/date/main.js'
import CryptoJS  from 'crypto-js'  //引用AES源码js
export default {
  name:'start',
  components: { LangSelect },
  data(){
    const validateUsername = (rule, value, callback) => {
      if (value.length == 0) {
         callback(new Error('请输入用户名'))
      } else {
         callback()
      }
    }

    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
            callback(new Error('密码必须大于6位数字'))
      } else {
        callback()
      }
    }

    return {
      canClick:true,
      captchaImgInfo:{
        ciphertext:'',//密钥
        expiredDateTime:'',//验证码有效时间
        imgBase64:''
      },
      pwdNeedCaptcha:false,//是否需要验证码
      pwdLoginEncrypt:false,//是否启用加密验证
      hidePassLogin:false,
      showpwd:false,
      loginForm: {
            username: '',
            password: '',
            captchaInput:'', //验证码用户输入
            captchaCiphertext:'' //验证码密文
      },
      loginRules: {
            username: [{ required: true, trigger: 'blur', validator: validateUsername }],
            password: [{ required: true, trigger: 'blur', validator: validatePassword }],
            captchaInput:[{required:this.pwdNeedCaptcha,message:'请输入验证码',trigger:'blur'}]
      },
      passwordType: 'password',
      loading: false,
      activeName: "",
      ddSet: {
        dingdingServerTarget: "",
        enabled: false,
        qrAppId: "",
        qrLoginRedirectUri: ""
      }
    }
  },

  beforeCreate() {

  },
  created(){

  },
  mounted(){
      this.hidePassLogin = window.sysSetting.hidePassLogin;
      this.getPublicSettingUnionFunc();
  },
  computed:{
  },
  methods: {
      getBaseImg(){
        if(this.canClick){
          this.canClick=false;
          let nowString = this.getDateTime();

          captchaFetch(this.AES_ECB_encrypt(nowString,window.sysSetting.captchaAesKey)).then(res=>{
              if(res.data){
                  res.data.imgBase64='data:image/jpeg;base64,'+res.data.imgBase64;
                  this.captchaImgInfo = res.data;
                  this.loginForm.captchaCiphertext = res.data.ciphertext
              }
              this.canClick=true;
          }).catch(err=>{
             this.canClick=true;
          })
        }
      },
      getDateTime(){
        let nowDate = new Date();
        let h = nowDate.getHours()<10?('0'+nowDate.getHours()):(''+nowDate.getHours());
        let m = nowDate.getMinutes()<10?('0'+nowDate.getMinutes()):(""+nowDate.getMinutes());
        let s = new Date().getSeconds()<10?('0'+new Date().getSeconds()):(''+new Date().getSeconds());
        return EcoDate.formatDateDefault(nowDate)+' '+h+':'+m+':'+s;
      },
      AES_ECB_encrypt(message, keyB64) {
          var keyBytes = CryptoJS.enc.Base64.parse(keyB64);
          var messageBytes = CryptoJS.enc.Utf8.parse(message);
          return CryptoJS.AES.encrypt(messageBytes, keyBytes, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString();
      },
      //查看密码切换
      showPwd() {
          if (this.passwordType === 'password') {
            this.passwordType = '';
            this.showpwd = true;
          } else {
            this.passwordType = 'password';
            this.showpwd = false;
          }
      },

      //登录
      handleLogin(){
          this.$refs.loginForm.validate(valid => {
            if (valid) {
                  //验证码有效时间
                  if(this.pwdNeedCaptcha && Date.parse(this.captchaImgInfo.expiredDateTime)<(new Date().getTime())){
                      //过期
                      this.$message.warning('验证码已经过期!');
                      this.loginForm.captchaInput='';
                      this.getBaseImg();
                      return;
                  }
                  this.loading = true;
                  let params;
                  if(this.pwdLoginEncrypt){
                    let nowString = this.getDateTime();
                    params = {
                        username: this.AES_ECB_encrypt((nowString+'.'+this.loginForm.username),window.sysSetting.userNamePassWordAesKey),
                        password: this.AES_ECB_encrypt((nowString+'.'+this.loginForm.password),window.sysSetting.userNamePassWordAesKey),
                        captchaInput:this.loginForm.captchaInput,
                        captchaCiphertext:this.loginForm.captchaCiphertext
                    }
                  }else{
                    params=this.loginForm;
                  }
                  loginAjax(params).then((res)=>{
                      sessionStorage.setItem('ecoToken',res.data);
                      this.loading = false;
                      this.initData();
                      if (window.sysSetting.homeUrl){
                           location.href = window.sysSetting.homeUrl;
                      }else{
                          if(window.sysSetting && window.sysSetting.webPlatform){ //web门户
                              this.$router.replace({name:'webPlatform'});
                          }else{
                              this.$router.replace({name:'workPlatform'});
                          }
                      }
                  }).catch((e)=>{
                      this.loading = false;
                      console.log('login unseccessfull!!')
                      //this.$message({type: 'error',message: e});
                  });
            } else {
                console.log('error submit!!')
                return false
            }
          })
      },

      getPublicSettingUnionFunc() {
          getPublicSettingUnion().then(res => {
                if (res.data) {
                    this.pwdNeedCaptcha = res.data.pwdNeedCaptcha;
                    this.pwdLoginEncrypt = res.data.pwdLoginEncrypt;
                    if(res.data.dingding && res.data.dingding.enabled && res.data.dingding.qrAppId != ""){
                        this.ddSet = res.data.dingding;
                        this.$nextTick(() => {
                              if (this.hidePassLogin){
                                  this.activeName = 'qrLogin';
                              }else{
                                  this.activeName = 'normal';
                              }
                              this.qrDisplay();
                              this.listenQrcode();
                          });
                    }else{
                        this.activeName = 'normal';
                        if(this.pwdNeedCaptcha){
                            this.getBaseImg();
                        }

                    }
                }
            }).catch(e => {});
    },

    listenQrcode() {
      let that = this;
      let ddSet = that.ddSet;
      var handleMessage = function(event) {

        var origin = event.origin;
        // console.log("origin", event.origin);
        if (origin == "https://login.dingtalk.com") {
          //判断是否来自ddLogin扫码事件。
          var loginTmpCode = event.data; //拿到loginTmpCode后就可以在这里构造跳转链接进行跳转了
          var url = encodeURIComponent(ddSet.qrLoginRedirectUri);
          var gotoUrl =
            ddSet.dingdingServerTarget +
            "/connect/oauth2/sns_authorize?appid=" +
            ddSet.qrAppId +
            "&response_type=code&scope=snsapi_login&redirect_uri=" +
            url +
            "&loginTmpCode=" +
            loginTmpCode;
          location.href = gotoUrl;
          console.log("loginTmpCode", loginTmpCode);
        }
      };
      if (typeof window.addEventListener != "undefined") {
        window.addEventListener("message", handleMessage, false);
      } else if (typeof window.attachEvent != "undefined") {
        window.attachEvent("onmessage", handleMessage);
      }
    },

    qrDisplay(type) {
      /*
          let ddSet = this.ddSet;
          this.$nextTick(() => {
            var url = encodeURIComponent(ddSet.qrLoginRedirectUri);
            var goto = encodeURIComponent(
              ddSet.dingdingServerTarget +
                "/connect/oauth2/sns_authorize?appid=" +
                ddSet.qrAppId +
                "&response_type=code&scope=snsapi_login&redirect_uri=" +
                url
            );
            var obj = DDLogin({
              id: "qrcode", //这里需要你在自己的页面定义一个HTML标签并设置id，例如<div id="login_container"></div>或<span id="login_container"></span>
              goto: goto, //请参考注释里的方式
              style: "border:none;background-color:#fff;margin-top: -16px;",
              width: "300",
              height: "300"
            });
      });
      */
    },
    async initData(){
        await this.loadOpRole(true);
    },
    loadOpRole
  },
  beforeRouteEnter (to,from,next){
      if(window.sysSetting && window.sysSetting.loginPage){
            window.location.replace(window.sysSetting.loginPage);
            // location.href = '/login.html' //定制登陆页
      }else{
           next(vm => { })
      }
  },

  watch: {
    pwdNeedCaptcha(n){
        if(n){
          this.loginRules.captchaInput=[{required:true,message:'请输入验证码',trigger:'blur'}];
        }
    }
  }
}
</script>
<style scoped>

.loginVue{
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: #2d3a4b;
    font-size: 14px;
    background: url('../../assets/img/ECM_bg.jpg');
     background-size: cover;
     -webkit-background-size: cover;
     -o-background-size: cover;
     background-position: center 0;
}


  .login-form {
    width: 740px;
    height: 340px;
    position: absolute;
    top: 50%;
    margin-top: -224px;
    right: 10%;
    border-radius: 6px;
    -webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, .1);
    -moz-box-shadow: 0 1px 2px rgba(0, 0, 0, .1);
    box-shadow: 0 1px 2px rgba(0, 0, 0, .1);
    background: url('/assets/img/system/bg.png');
  }


  .loginDiv{
      position:absolute;
      right:50px;
      width:250px;
      top:80px;
  }


  .loginVue .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
  }
  .loginVue .show-pwd {
    position: absolute;
    right: 10px;
    top: 11px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }

  .loginVue .title-container {
    position: relative;
  }
  .loginVue .title {
      font-size: 26px;
      color: #eee;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
 }

.loginVue .el-input{
      display: inline-block;
      /* height: 35px !important; */
}


.loginVue .el-form-item {
      /* border: 1px solid rgba(255, 255, 255, 0.1); */
      background: #fff;
      border:1px solid #409EFF;
      border-radius: 5px;
      color: #454545;
  }

.loginVue .svg-container{
    padding: 6px 5px 6px 15px;
    color: #889aa4;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    /* height: 36px;
    line-height: 36px; */
  }

  .loginVue .loginBtn{
    width:100%;
    margin-bottom:30px;
    padding: 10px 20px;
    font-size: 14px;
    border-radius: 4px;
    margin-top:10px;
  }


.loginBottom {
  position: relative;
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  color: #fff;
}
.loginBottom img {
  margin-right: 6px;
  height: 32px;
  cursor: pointer;
}
.loginBottom span,
.loginBottom img {
  vertical-align: middle;
}
.loginBottom-left {
  position: absolute;
  left: 0;
}
.loginBottom-right {
  position: absolute;
  right: 0;
}

.btn-qrclose {
  position: absolute;
  right: 0;
  top: 0;
  width: 30px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  z-index: 100;
}
.btn-qrclose i {
  /* position: absolute; */
  /* top: 0px; */
  /* line-height: 24px; */
  /* right: -32px; */
  font-size: 20px;
  font-style: normal;
  cursor: pointer;
  vertical-align: middle;
}
.qr-area {
  position: absolute;
  right: 20px;
  top: 20px;
  width: 300px;
  height: 300px;
  background-color: #fff;
  z-index: 200;
  overflow: hidden;
  /* margin-left: 100px; */
}
#qrcode {
  /* width: 150px; */
  /* height: 150px; */
  left: 0;
  right: 0;
  margin: 0 auto;
  /* margin-top: 30px; */
}
</style>
<style lang="css">
  .loginVue .login-form .el-input input{
    background: transparent !important;
    border: 0;
    -webkit-appearance: none;
    border-radius: 0;
    padding: 12px 5px 12px 15px !important;
    color: #646464;
    caret-color: #646464;
}

 .loginVue .el-form-item__error{
    margin-top:3px;
  }
  .loginVue .captchaImg{
    width: 100%;
    height:32px;
  }
</style>
