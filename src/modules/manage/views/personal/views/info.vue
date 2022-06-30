<template>
  <div>
    <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
    <eco-content top="0px" height="60px">
      <el-row class="toolbar">
          <el-col :span="8" >
              <eco-tool-title style="line-height: 34px;" :title="'个人信息'"></eco-tool-title>
          </el-col>
          <el-col :span="16" class="tlr">
              <el-button v-if="!isEditable"  type="primary" class="toolBtn" style="font-size:14px;" @click="isEditable=true">编辑</el-button>
              <el-button v-if="isEditable"  type="primary" class="toolBtn" style="font-size:14px;" @click.native="save" ><i class="el-icon-circle-check" style="margin-right:10px;font-size: 14px;"></i>&nbsp;保存</el-button>
          </el-col>
      </el-row>
    </eco-content>

    <eco-content bottom="0" top="60px" ref="content" style="padding:10px 15px;max-width:540px;">
      <div style="padding:20px 20px 20px 120px;height:120px;box-sizing:border-box; line-height:60px;position:relative;">
        <div style="position:absolute;left:20px;top:20px">
            <ecoUserImg ref="ecoUserImg" :size="80" :name="form.mi" :userId="form.id"></ecoUserImg>
        </div>
        <userImgUpload accpet=".jpg,.png" ref="ecoFileUploadChunk" modular="userImg" :modularInnerId="form.id" :onSuccess="onImgUploadSuccess"></userImgUpload>
      </div>
      <el-form class="personalForm" ref="form" size="mini" :model="form" :rules="formrule" label-position="top" :disabled="!isEditable">
        <el-form-item label="姓名" prop="mi">
          <el-input v-model="form.mi"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="alias">
          <el-input v-model="form.alias"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobilePhone">
          <el-input v-model="form.mobilePhone"></el-input>
        </el-form-item>
        <el-form-item label="邮件地址" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" prop="ssn">
          <el-input v-model="form.ssn"></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-input :value="form.departments.length?form.departments[0].orgPathI18nText:''" disabled></el-input>
        </el-form-item>
        <!-- <el-form-item label="hrAccount" prop="hrAccount">
          <el-input v-model="form.hrAccount"></el-input>
        </el-form-item> -->
      </el-form>
    </eco-content>
  </div>
</template>

<script>
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoUserImg from '@/components/tool/ecoUserImg.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import userImgUpload from './components/userImgUpload.vue'
import {Loading } from 'element-ui';
import EcoUtil from '@/components/util/main.js'
import {getPersonalInfo,updatePersonalInfo} from '@/modules/manage/service/service.js'

export default {
  name:'',
  components:{
    ecoLoading,
    ecoUserImg,
    ecoContent,
    ecoToolTitle,
    userImgUpload,
  },
  props: {
 
  },
  data() {
   
    return {
      isEditable:false,
      form: {
        id:'',
        alias:'',
        mobilePhone:'',
        email:'',
        ssn:'',
        mi:'',
        hrAccount:'',
        departments:[],
      },
      formrule:{
        mi: [
          {required:true,trigger: 'blur',message:'姓名不能为空' }
        ],
        alias: [
          {required:true,trigger: 'blur',message:'昵称不能为空' }
        ],
      }
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getData();
  },
  methods: {
    getData(){
      getPersonalInfo().then(res=>{
        this.form = Object.assign(this.form,res.data);
      }).catch(e=>{})
    },
    save(){
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$refs.ecoLoadingRef.open();
          updatePersonalInfo(this.form).then(res=>{
            if (res.data&&res.data.id){
              this.$message.success('保存成功');  
              this.isEditable = false;
              this.$parent.userInfo.mi = res.data.mi;
            }else{
              this.$message.error('保存失败');          
            }
            this.$refs.ecoLoadingRef.close();
          }).catch(e=>{
            this.$message.error('保存失败');
            this.$refs.ecoLoadingRef.close();
          })
        } else {
          this.$message.error('请按要求填写表单数据');
          return false;
        }
      });
    },
    onImgUploadSuccess(){
      this.$refs.ecoUserImg.getImgUrl();
      this.$parent.$refs.ecoUserImg.getImgUrl();
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



// WEBPACK FOOTER //
// info.vue