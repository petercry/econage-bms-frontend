<template>
    <div style="padding:10px 20px;">
          <el-form ref="form" :model="form" label-width="80px">

            <el-form-item label="状态">
                <el-select style="width:100%;" v-model="form.status" placeholder="请选择状态">
                    <el-option v-for="(item,key) in accountStatusMap" :key="key" :label="item" :value="key"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="变更密码">
                <el-input :type="passInput" v-model="form.newPwd">
                  <div slot="suffix" style="padding: 0 5px;cursor:pointer;" @mousedown="passInput='text'" @mouseup="passInput = 'password'">
                      <i class="el-icon-view"></i>
                  </div>
                </el-input>
            </el-form-item>

            <el-form-item label="到期时间">
              <el-date-picker
                style="width:100%;"
                v-model="form.accountExpiration"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择到期时间">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="主题包">
              <el-select style="width:100%;" v-model="form.themePackage" placeholder="请选择状态">
                <el-option v-for="(item,key) in themeMap" :key="key" :label="item" :value="key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click.native="save">
                保存
                <i class="el-icon-check el-icon--right"></i>
              </el-button>
            </el-form-item>
          </el-form>
    </div>
</template>
<script>
import {Loading } from 'element-ui';
import EcoUtil from '@/components/util/main.js'
import {getAccountStatusMap,getAccountDetail,getThemeMap,editAccount} from '../../../service/service.js'


export default{
  name:'accountConfig',
  components:{
    
  },
  data(){
    return {
      passInput:'password',
      accountStatusMap:{},
      themeMap:{},
      form:{
        themePackage:'',
        accountExpiration:'',
        status:'',
        newPwd:''
      }
    }
  },
  mounted(){
    this.getAccountStatusMap();
    this.getThemeMap();
    this.getData();
  },
  methods: {
      getAccountStatusMap(){
          getAccountStatusMap().then((response)=>{
              this.accountStatusMap = response.data
          }).catch((error)=>{});
      },

      getThemeMap(){
        getThemeMap().then((response)=>{
            this.themeMap = response.data
        }).catch((error)=>{ });
      },

    getData(){
      var that = this;
      let id = this.$route.params.userId; 
      getAccountDetail(id).then((response)=>{
          if (response.data&&response.data.userId){
                that.form.themePackage = response.data.themePackage;
                that.form.status = response.data.status;
                that.form.accountExpiration = response.data.accountExpiration?response.data.accountExpiration:'';
          }
      }).catch((error)=>{
      });
    },
    save(){
      this.$refs['form'].validate((valid) => {
          if (valid) {
            this.form.userId = this.$route.params.userId;
            let loadingInstance = Loading.service({ fullscreen: true,text:'正在修改...'});
            editAccount(this.form).then((res)=>{
                 this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                              loadingInstance.close();
                  });

                 try {
                      this.$message({type: 'success',message: '编辑成功！'});
                      let doObj = {}
                      doObj.action = 'linkAddCallBack';
                      doObj.close = true;
                      EcoUtil.getSysvm().callBackDialogFunc(doObj);
                 } catch (error) { }

            }).catch((error)=>{
                 this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                              loadingInstance.close();
                  });
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
