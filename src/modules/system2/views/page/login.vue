<template>
  <div class="loginVue">

    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      
        <div class="title-container">
            <h3 class="title">{{ $t('login.title') }}</h3>
            <lang-select class="set-language"/>
        </div>
      
        <div id='loginBox'>
            <el-form-item prop="username">
                <span class="svg-container">
                    <i class="icon iconfont icon-yonghu"></i>
                </span>

                <el-input
                    v-model="loginForm.username"
                    :placeholder="$t('login.username')"
                    name="username"
                    type="text"
                    auto-complete="on"
                />
        </el-form-item>

            <el-form-item prop="password">
                    <span class="svg-container">
                    <i class="icon iconfont icon-mima"></i>
                    </span>
                    <el-input
                    :type="passwordType"
                    v-model="loginForm.password"
                    :placeholder="$t('login.password')"
                    name="password"
                    auto-complete="on"
                    @keyup.enter.native="handleLogin" />
            </el-form-item>
      </div>

      <el-button :loading="loading" type="primary" class="loginBtn" @click.native.prevent="handleLogin">{{ $t('login.logIn') }}</el-button>
      


        
    </el-form>
    <!-- <img class="btn-qropen" src="@/modules/system2/assets/img/qr.png" title="钉钉登陆" @click="qrDisplay('show')"/> -->
    <transition name="fade" mode="out-in" appear>
      <div class="qr-area" v-if="qrShow">
        <div class="btn-qrclose">
          <i @click="qrDisplay('hide')">x</i>
        </div>
        <div id="qrcode"></div>
        <div style="text-align: center;line-height: 30px;">钉钉扫码，安全登陆</div>
        <div style="font-size: 13px;padding: 10px 18px;">
          <!-- <div>请使用钉钉扫描上图二维码</div> -->
          <!-- <div></div> -->
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import {loginAjax} from'@/modules/system2/service/service'
import LangSelect from '@/components/LangSelect'
import {EcoUtil} from '@/components/util/main.js'
export default{
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
      qrShow:false,
      showpwd:false,
      loginForm: {
            username: '',
            password: ''
      },
      loginRules: {
            username: [{ required: true, trigger: 'blur', validator: validateUsername }],
            password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false,
    }
  },
  created(){

  },
  mounted(){
       this.listenQrcode();
  },
  computed:{
  },
  methods: {
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
                this.loading = true;
                loginAjax(this.loginForm).then((res)=>{
                    sessionStorage.setItem('ecoToken',res.data);
                    this.loading = false;
                    this.$router.push({name:'index'});
                    // location.href="/portalIndex/#/serviceList";
                }).catch((e)=>{
                    this.loading = false;
                    this.$message({type: 'error',message: e});
                });
          } else {
            console.log('error submit!!')
            return false
          }
        })
    },
    listenQrcode(){
      var handleMessage = function (event) {
              var origin = event.origin;
              console.log("origin", event.origin);
              if( origin == "https://login.dingtalk.com" ) { //判断是否来自ddLogin扫码事件。
                  var loginTmpCode = event.data; //拿到loginTmpCode后就可以在这里构造跳转链接进行跳转了
                  console.log("loginTmpCode", loginTmpCode);
              }
      };
      if (typeof window.addEventListener != 'undefined') {
          window.addEventListener('message', handleMessage, false);
      } else if (typeof window.attachEvent != 'undefined') {
          window.attachEvent('onmessage', handleMessage);
      }
    },
    qrDisplay(type){
      if (type=='show'){
        this.qrShow = true;
        this.$nextTick(()=>{
          var url = encodeURIComponent('http://localhost:8080/#/loginQr');
          var goto = encodeURIComponent('https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=appid&response_type=code&scope=snsapi_login&state=STATE&redirect_uri='+url)
          var obj = DDLogin({
              id:"qrcode",//这里需要你在自己的页面定义一个HTML标签并设置id，例如<div id="login_container"></div>或<span id="login_container"></span>
              goto: goto, //请参考注释里的方式
              style: "border:none;background-color:#FFFFFF;",
              width : "320",
              height: "360"
          });
        })
      }
      if (type=='hide'){
        this.qrShow = false;
      }
    }
   
    
  
  },
  watch: {

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
}
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .loginVue .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    /* span {
      &:first-of-type {
        margin-right: 16px;
      } */
    /* } */
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
      height: 41px !important;
      width: 85%;
}

 
.loginVue .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
.loginVue .svg-container{
    padding: 6px 5px 6px 15px;
    color: #889aa4;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    height: 36px;
    line-height: 36px;
  }
  .loginVue .loginBtn{
    width:100%;
    margin-bottom:30px;
    padding: 10px 20px;
    font-size: 14px;
    border-radius: 4px;
  }
  .loginVue .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
</style>
<style lang="css">
  .loginVue .login-form .el-input input{
    background: transparent !important;
    border: 0;
    -webkit-appearance: none;
    border-radius: 0;
    padding: 12px 5px 12px 15px !important;
    color: #fff;
    height: 47px !important;
    caret-color: #fff;
}

.btn-qropen{
  position: absolute;
  right: 0;
  top: 0;
  width: 40px;
  cursor: pointer;
  z-index: 100;
}
.btn-qrclose{
  position: absolute;
  right: 0;
  top: -40px;
  width: 0px;
  height: 0px;
  cursor: pointer;
  border-top: 40px solid transparent;
  border-bottom: 40px solid transparent;
  border-left: 40px solid transparent;
  border-right: 40px solid #fff;
  z-index: 100;
}
.btn-qrclose i{
  position: absolute;
  top: 0px;
  line-height: 24px;
  right: -32px;
  font-style: normal;
}
.qr-area{
  position: absolute;
  right: 0;
  top: 0;
  width: 320px;
  height: 360px;
  background-color: #fff;
  z-index: 200;
  overflow: hidden;
}
#qrcode{
  /* width: 150px; */
  /* height: 150px; */
  left: 0;
  right: 0;
  margin: 0 auto;
  margin-top: 30px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>
