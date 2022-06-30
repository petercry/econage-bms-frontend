<template>
  <div>
    <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
    <eco-content top="0px" height="60px">
      <el-row class="toolbar">
          <el-col :span="8" >
              <eco-tool-title style="line-height: 34px;" :title="'修改密码'"></eco-tool-title>
          </el-col>
          <el-col :span="16" class="tlr">
              <el-button  v-if="fromLogin" class="toolBtn" style="font-size:14px;" @click.native="returnLogin" >返回登录页</el-button>
              <el-button  type="primary" class="toolBtn" style="font-size:14px;" @click.native="changePasswordSubmit" ><i class="el-icon-circle-check" style="margin-right:10px;font-size: 14px;"></i>&nbsp;保存</el-button>
          </el-col>
      </el-row>
    </eco-content>

    <eco-content bottom="0" top="60px" ref="content" style="padding:10px 15px;max-width:540px;">
      <el-form class="personalForm" ref="form" size="mini" :model="form" :rules="formrule" label-position="top">
        <el-form-item label="旧密码" prop="oldPass">
          <el-input v-model="form.oldPass" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass">
          <div style="position:absolute;right:0;top:-38px;line-height:28px;font-size:12px;color:#999;">
            由6-16位数字、大写字母、小写字母组合而成
          </div>
          <el-input v-model="form.newPass" type="password"  show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmed_password">
          <el-input v-model="form.confirmed_password" type="password"  show-password></el-input>
        </el-form-item>
      </el-form>
    </eco-content>
  </div>
</template>

<script>
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {Loading } from 'element-ui';
import EcoUtil from '@/components/util/main.js'
import {updatePasswordAjax} from '@/modules/manage/service/service.js'

export default {
  name:'',
  components:{
    ecoLoading,
    ecoContent,
    ecoToolTitle
  },
  props: {
 
  },
  data() {
    var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('旧密码不能为空'));
        } else {
          callback();
        }
    };
    var validatePassNew = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('新密码不能为空'));
      } else if (value == this.form.oldPass) {
        callback(new Error('新密码不能等于旧密码!'));
      } else if (value.length<6||value.length>16) {
        callback(new Error('新密码长度不符合!'));
      } else if (!(/^[a-zA-Z0-9]+$/.test(value))) {
        callback(new Error('新密码由数字、大写字母、小写字母组成!'));
      } else if (!(/[0-9]+/.test(value))) {
        callback(new Error('新密码缺少数字!'));
      } else if (!(/[a-z]+/.test(value))) {
        callback(new Error('新密码缺少小写字母!'));
      } else if (!(/[A-Z]+/.test(value))) {
        callback(new Error('新密码缺少大写字母!'));
      } else {
        callback();
      }
    };
    var validatePassConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('确认密码不能为空'));
      } else if (value != this.form.newPass) {
        callback(new Error('确认密码和新密码要一样!'));
      } else {
        callback();
      }
    };
    return {
      fromLogin:false,
      form: {
        oldPass: "",
        newPass: "",
        confirmed_password: ""
      },
      formrule:{
        oldPass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        newPass: [
          { validator: validatePassNew, trigger: 'blur' }
        ],
        confirmed_password: [
          { validator: validatePassConfirm, trigger: 'blur' }
        ]
      }
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.fromLogin = this.$route.query.fromLogin=='Y';
  },
  methods: {
    returnLogin(){
      window.history.go(-1);
    },
    changePasswordSubmit(){
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.changePassword();
        } else {
          this.$message.error('请按要求填写表单数据');
          return false;
        }
      });
    },
    changePassword(){
      this.$refs.ecoLoadingRef.open();
      updatePasswordAjax({
        oldPass:this.form.oldPass,
        newPass:this.form.newPass,
        // confirmed_password:this.form.confirmed_password
      }).then(res=>{
        this.form.oldPass='';
        this.form.newPass='';
        this.form.confirmed_password='';
        this.$message.success('保存成功');
        this.$refs.ecoLoadingRef.close();
      }).catch(e=>{
        this.$message.error('保存失败');  
        this.$refs.ecoLoadingRef.close();
      })
    }
  },

  destroyed(){

  }

};

</script>

<style scoped>
.toolbar{
  padding:12px 10px;
  background-color:#fff;
  border-bottom:1px solid #ddd;
}
</style>
