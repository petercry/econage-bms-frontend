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
          <i class="icon iconfont icon-ai-password"></i>
        </span>
        <el-input
          :type="passwordType"
          v-model="loginForm.password"
          :placeholder="$t('login.password')"
          name="password"
          auto-complete="on"
          @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <!-- <svg-icon icon-class="eye" /> -->
          <i  v-if='showpwd==true' class="icon iconfont icon-chakanmima"></i>
          <i  v-else class="icon iconfont icon-chakanmimaclose"></i>
        </span>
      </el-form-item>
      </div>

      <el-button :loading="loading" type="primary" class="loginBtn" @click.native.prevent="handleLogin">{{ $t('login.logIn') }}</el-button>
      <el-button :loading="loading" type="primary" class="loginBtn" @click.native.prevent="test">测试</el-button>


        
    </el-form>

  <button @click="handleLogin">1111</button>
         <button @click="test">2222</button>

    <!-- <el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog" append-to-body>
      {{ $t('login.thirdpartyTips') }}
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog> -->
  </div>
</template>
<script>
import {loginAjax,getTest} from'@/modules/login/service/service'
import LangSelect from '@/components/LangSelect'
import {EcoUtil} from '@/components/util/main.js'
export default{
  name:'start',
  components: { LangSelect },
  data(){
    function isvalidUsername(str) {
      const valid_map = ['admin', 'editor']
      return valid_map.indexOf(str.trim()) >= 0
    }
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      showpwd:false,
      loginForm: {
        username: 'admin',
        password: '1111111'
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
        this.listAction();
       
  },
  computed:{
  },
  methods: {

    //监听dialog 回写事件
    listAction(){
          let callBackDialogFunc = function(obj){
              if(obj && obj.action == 'initWorkflow'){
                  window.ecoVm.initWorkflowCallBack(obj);
              }
          }
          EcoUtil.addCallBackDialogFunc(callBackDialogFunc);
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

    test(){
        getTest().then((res)=>{
            console.log(res);
        })
    },


    //登录
    handleLogin(){
        loginAjax().then((res)=>{
            sessionStorage.setItem('ecoToken',res.data);
        })
        return ;
        this.$refs.loginForm.validate(valid => {
          if (valid) {
              this.loading = true;
              setTimeout(() => {
                  this.loading = false;
              }, 3000);
          } else {
            console.log('error submit!!')
            return false
          }
        })
    },

    search(){
      if (this.srchTxt==''){
        this.$message({
            message: this.$t('msg.srchTxtNotNull'),
            type: 'error'
        });
        return false;
      }
      let that = this;
      let choosedItems = this.fitems.filter(item=>{
        if (item.desc.indexOf(that.srchTxt)>-1){
          that.openCollapseItems.indexOf(item.groupId+item.rname)>-1?null:
          that.openCollapseItems.push(item.groupId+item.rname);
          return true;
        }else{
          return false;
        }
      }).map(item=>item.id);
      this.choosedItems = choosedItems;
      this.$nextTick(()=>{
        if (choosedItems.length==0){
          this.$message({
              message: this.$t('msg.srchResultNone'),
              type: 'error'
          });
        }else{
          let firstId = choosedItems[0];
          let firstElem = document.getElementById('f'+firstId);
          if (firstElem.offsetTop > window.innerHeight){
            window.scrollTo(0,firstElem.offsetTop - window.innerHeight/2)
          }
        }
      });
    },
    getWFStartInfo(){
      getWFStartInfo().then((res)=>{
        // console.log(res)
        if(res.data&&res.data.info){
          this.isMultiWs = res.data.isMultiWs;
          this.itemList = res.data.info;
          res.data.info.map(item=>{
            return item.child.map(item=>{
              if (item.child) {
                this.fitems=this.fitems.concat(item.child);
              }else{
                this.fitems.push(item)
              }
            })
          })
        }
      }).catch((error)=>{});
    },
    itemClick(fitem){
      // console.log(fitem)
      if(this.isMultiWs){
        window.parent.window.sysvm.openDialog(fitem.desc,'/wh/jsp/component/workflow/newworkflowinstance.jsp?map_id='+fitem.id
        +'&req_name='+encodeURIComponent(fitem.desc)
        +'&req_desc='+encodeURIComponent(fitem.comments)
        +'&priority='+fitem.priority,600,260);
      }else{
        let tabObj = {};
        tabObj.desc = fitem.desc;
        let goPage = '/jsp/version3/wf/wfStartWf.jsp?map_id='+fitem.id
        +'&req_name='+encodeURIComponent(fitem.desc)
        +'&req_desc='+encodeURIComponent(fitem.comments)
        +'&priority='+fitem.priority;
        tabObj.tabKey = "wftask_info_"+fitem.id;
        tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wftask_info_"+fitem.id+"',doNothing:'Y',nextPage:'"+goPage+"'}";
        window.parent.window.sysvm.doTab(tabObj);
      }
    },
    initWorkflowCallBack(obj){
    //    console.log(obj);
        let tabObj = {};
        tabObj.desc = obj.data.name;
        let goPage = '/jsp/version3/wf/wfAdapter.jsp?id='+obj.data.id;
        tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wftask_info_"+obj.data.mapId+"',doNothing:'Y',nextPage:'"+goPage+"'}";
        window.parent.window.sysvm.doTab(tabObj);
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
</style>
