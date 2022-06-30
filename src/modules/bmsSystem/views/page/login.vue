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
                    </div>
                    <el-button :loading="loading" type="primary" class="loginBtn" @click.native.prevent="handleLogin">{{ $t('login.logIn') }}</el-button>
        
              </div>
              
           
        </el-form>
        <div style="position:absolute;height:40px;width:40px;bottom:0;left:0;" @click="activeName = 'normal'"></div>
  </div>
</template>
<script>
import {loginAjax,getPublicSettingUnion} from'@/modules/bmsSystem/service/service'
import {loadOpRole} from '@/modules/bmsMmm/util/utility.js'
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
      hidePassLogin:false,
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
                      // this.$message({type: 'error',message: e});
                  });
                  
            } else {
                console.log('error submit!!')
                return false
            }
          })
      },

      getPublicSettingUnionFunc() {
          this.activeName = 'normal';
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
    background: url('../../assets/img/bg.png');
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
</style>
