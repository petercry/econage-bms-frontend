<template>
    <div class="userEdit">
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <ecoContent top="0" bottom="0" style="padding:0px 10px">

            <el-row  class="toolbar">
                    <el-col :span="6">
                              <eco-tool-title style="line-height: 38px;" :title="'用户编辑'"></eco-tool-title>
                    </el-col>
                    <el-col :span="18" style="text-align:right;padding-right:10px;padding-top:5px;">
                              <el-button type="primary"  size="mini" @click="save" >保存 <i class="el-icon-check el-icon--right"></i></el-button>
                              <el-button type="default"  size="mini" @click="goBack" >返回 <i class="el-icon-refresh-right"></i></el-button>
                    </el-col>
          </el-row>
       
         

            <el-form ref="form" :model="form" label-width="90px" style="margin-top:20px;">
              <el-form-item label="别称" prop="alias" error :rules="[
              { required: true, message: '别称不能为空'},
              { validator: validateAccount,trigger:'blur'}
            ]">
              <el-input v-model="form.alias"></el-input>
              <template slot="error" slot-scope="error">
                  <div class="el-form-item__error">
                      <span v-if="error.error=='登陆项冲突'" style="color:#909399;">
                        <i class="el-icon-warning-outline"></i> {{ error.error }}
                        <span class="glBtn" @click="linkAccountRefForce('alias')">关联登陆项</span>
                      </span>
                      <span v-else>{{ error.error }}</span>
                  </div>
              </template>
            </el-form-item>
            <el-form-item label="员工编号" prop="emId" :rules="[
              { required: true, message: '员工编号不能为空'},
              { validator: validateAccount,trigger:'blur'}
            ]">
              <el-input v-model="form.emId"></el-input>
              <template slot="error" slot-scope="error">
                  <div class="el-form-item__error">
                      <span v-if="error.error=='登陆项冲突'" style="color:#909399;">
                        <i class="el-icon-warning-outline"></i> {{ error.error }}
                        <span class="glBtn" @click="linkAccountRefForce('emId')">关联登陆项</span>
                      </span>
                      <span v-else>{{ error.error }}</span>
                  </div>
              </template>
            </el-form-item>
            <el-form-item label="移动电话" prop="mobilePhone" :rules="[
              { validator: validateAccount,trigger:'blur'}
            ]">
              <el-input v-model="form.mobilePhone"></el-input>
              <template slot="error" slot-scope="error">
                  <div class="el-form-item__error">
                      <span v-if="error.error=='登陆项冲突'" style="color:#909399;">
                        <i class="el-icon-warning-outline"></i> {{ error.error }}
                        <span class="glBtn" @click="linkAccountRefForce('mobilePhone')">关联登陆项</span>
                      </span>
                      <span v-else>{{ error.error }}</span>
                  </div>
              </template>
            </el-form-item>
            <el-form-item label="电子邮件" prop="email" :rules="[
              { validator: validateAccount,trigger:'blur'}
            ]">
              <el-input v-model="form.email"></el-input>
              <template slot="error" slot-scope="error">
                  <div class="el-form-item__error">
                      <span v-if="error.error=='登陆项冲突'" style="color:#909399;">
                        <i class="el-icon-warning-outline"></i> {{ error.error }}
                        <span class="glBtn" @click="linkAccountRefForce('email')">关联登陆项</span>
                      </span>
                      <span v-else>{{ error.error }}</span>
                  </div>
              </template>
            </el-form-item>
            <el-form-item label="全名" prop="mi" :rules="[
              { required: true, message: '全名不能为空'}
            ]">
              <el-input v-model="form.mi"></el-input>
            </el-form-item>
            <el-form-item label="简拼">
              <el-input v-model="form.pyIdx"></el-input>
            </el-form-item>
            <el-form-item label="全拼">
              <el-input v-model="form.pyFull"></el-input>
            </el-form-item>
            <el-form-item label="身份证号">
              <el-input v-model="form.ssn"></el-input>
            </el-form-item>
            <el-form-item label="排序">
              <el-input-number v-model="form.order" :min="1" ></el-input-number>
              <!-- <el-input v-model="form.order"></el-input> -->
            </el-form-item>
            
            <el-form-item label="忽略同步" prop="ignoreHrSync">
              <el-select style="width:100%;" v-model="form.ignoreHrSync" placeholder="请选择">
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="comments">
              <el-input type="textarea" rows="6" v-model="form.comments"></el-input>
            </el-form-item>

            <el-form-item label="所属部门">
              <div class="display-input">
                  <el-tag
                      v-for="tag in form.departments"
                      :key="tag.id"
                      closable
                      type="info">
                      {{tag.name}}
                  </el-tag>
              </div>
            </el-form-item>
            <el-form-item  prop="hrAccount" label="HrAccountId" v-if="HrAccountIdShow" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-input v-model="form.hrAccount"></el-input>
            </el-form-item>
            <el-form-item  prop="hrLink" label="hrLink" v-if="HrAccountIdShow" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-input v-model="form.hrLink"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click.native="save">
                保存
                <i class="el-icon-check el-icon--right"></i>
              </el-button>
            </el-form-item>
          </el-form>
   
      </ecoContent>
  
    </div>
</template>
<script>
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {editUser,getUserDetail,isExistAccountRefInOtherUser,linkAccountRefForce,getUnionSetting} from '../../../service/service.js'
import {mapState,mapMutations} from 'vuex'

export default{
  name:'baseInfo',
  components:{
      ecoLoading,
      ecoContent,
      ecoToolTitle
  },
  data(){
    return {
      HrAccountIdShow:false,
      form:{
          alias:'',
          emId:'',
          deptId4Config:'',
          comments:'',
          email:'',
          mi:'',
          pyFull:'',
          pyIdx:'',
          ssn:'',
          mobilePhone:'',
          order:'',
          departments:[],
          ignoreHrSync:false,
          hrLink:'',
          hrAccount:'',
      }
    }
  },
  computed:{
      ...mapState([
          'ecoEventData',
      ]),
  },
  mounted(){
      this.getUnionSetting();
      this.getData();
  },
  methods: {
    getUnionSetting(){
      getUnionSetting().then(res=>{
        if (res.data.hr&&res.data.hr.userHrUpdateManualEnabled){
          this.HrAccountIdShow = true;
        }
      }).catch(e=>{})
    },
    validateAccount(rule, value, callback){
      if (value === '') {
        callback();
      } else {
        let accountRef = value+'';
        let userId = this.$route.params.userId; 
        isExistAccountRefInOtherUser(accountRef,userId).then(res=>{
          if (res.data){
            // callback();
            callback(new Error('登陆项冲突'));
          }else{
            callback();
          }
        }).catch(e=>{})
      }
    },
    linkAccountRefForce(key){
      let userId = this.$route.params.userId; 
      let accountRef = this.form[key];
      linkAccountRefForce(accountRef,userId).then(res=>{
        this.$refs['form'].validateField(key);
      }).catch(e=>{})
    },
    getData(){
      var that = this;
      let id = this.$route.params.userId; 
      getUserDetail(id).then((response)=>{
        if (response.data&&response.data.id){
          that.form.alias = response.data.alias;
          that.form.emId = response.data.emId;
          that.form.deptId4Config = response.data.deptId4Config;
          that.form.comments = response.data.comments;
          that.form.email = response.data.email;
          that.form.mi = response.data.mi;
          that.form.pyFull = response.data.pyFull;
          that.form.pyIdx = response.data.pyIdx;
          that.form.ssn = response.data.ssn;
          that.form.mobilePhone = response.data.mobilePhone;
          that.form.order = response.data.order;
          that.form.ignoreHrSync = response.data.ignoreHrSync;
          that.form.departments = response.data.departments;
          that.form.hrLink = response.data.hrLink;
          that.form.hrAccount = response.data.hrAccount;
          this.$refs['form'].validate((valid,params) => {});
        }
      }).catch((error)=>{ });
    },
    save(){
        this.$refs['form'].validate((valid,params) => {
            if (!valid){
                if (this.form.emId&&this.form.mi&&this.form.alias){
                    valid = true;
                }
                if (this.HrAccountIdShow&&(this.form.hrLink==''||this.form.hrAccount=='')){
                    valid = false;
                }
            }
            if (valid) {
                let id = this.$route.params.userId; 
                this.$refs.ecoLoadingRef.open();
                editUser(id,this.form).then((res)=>{
                  try {
                      // if (res.data&&res.data.id){
                        this.$message({type: 'success',message: '编辑成功！'});
                        this.$refs.ecoLoadingRef.close();
                      // }
                  } catch (error) {
                    
                  }
                }).catch((error)=>{
                    this.$refs.ecoLoadingRef.close();
                    this.$message({type: 'error',message: '编辑失败！'});
                })
              } else {
                return false;
              }
        });
    },

    goBack(){
         let _deptId = this.$route.params.deptId;
         let _type = this.$route.params.type;
         if(_type == 'LIST'){
              this.$router.push({name:'userListInDept',params:{deptId:_deptId}});
         }else if(_type == 'SEARCH'){
              this.$router.push({name:'userListSearch', params:{searchKey:encodeURIComponent(this.ecoEventData.searchKey),selectAll:this.ecoEventData.selectAll }} );
         }
   
        
    }
    
  },
  watch: {

  }
}
</script>
<style>
.userEdit .toolbar{
    padding:10px 10px;
    background-color:#fff;
    border-bottom:1px solid #ddd;
     color:#303133;
}


.glBtn{
  cursor: pointer;
  text-decoration:underline;
  color: #666;
}
.glBtn:hover{
  color: #333;
  font-weight: bold;
}
</style>
