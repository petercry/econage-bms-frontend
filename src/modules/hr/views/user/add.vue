<template>
    <div class="userAdd">

      <ecoLoading ref='ecoLoadingRef' :text="'正在创建人员'"></ecoLoading>
      <ecoContent top="0" bottom="0" style="padding:0px 20px 10px;">
          <el-row  class="toolbar">
                  <el-col :span="6">
                             <eco-tool-title style="line-height: 38px;" :title="'人员添加'"></eco-tool-title>
                  </el-col>
                  <el-col :span="18" style="text-align:right;padding-right:10px;padding-top:5px;">
                            <el-button type="primary"  size="mini" @click="save" >保存 </el-button>
                            <el-button type="default"  size="mini" @click="goBack" >返回 </el-button>
                  </el-col>
         </el-row>


        <el-form ref="form" :model="form" label-width="90px" style="margin-top:20px;">
            <el-form-item label="别称" prop="alias" :rules="[
                { validator: validateAccount,trigger:'blur'}
              ]">
                    <el-input v-model="form.alias"></el-input>
                    <template slot="error" slot-scope="error">
                        <div class="el-form-item__error">
                            <span v-if="error.error=='登陆项冲突'" style="color:#909399;">
                              <i class="el-icon-warning-outline"></i> {{ error.error }}
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
              <el-input type="textarea" rows="4" v-model="form.comments"></el-input>
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
            </el-button>
            <el-button type="default" @click.native="$router.push({name:'userListInDept'})">
              返回
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
import {addUser,isExistAccountRefInOtherUser,getUnionSetting} from '../../service/service.js'
export default{
  name:'userAdd',
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
        ignoreHrSync:false,
        hrLink:'',
        hrAccount:'',
      }
    }
  },
  mounted(){
    this.getUnionSetting();
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
        let userId = null; 
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
    save(){
        this.$refs['form'].validate((valid) => {
            if (!valid){
                if (this.form.emId&&this.form.mi&&this.form.alias){
                    valid = true;
                }
                if (this.HrAccountIdShow&&(this.form.hrLink==''||this.form.hrAccount=='')){
                    valid = false;
                }
            }

            if (valid) {
                this.$refs.ecoLoadingRef.open();
                this.form.deptId4Config = this.$route.params.deptId;;
                addUser(this.form).then((res)=>{
                  try {
                      if (res.data&&res.data.id){
                          this.$message({type: 'success',message: '添加成功！'});
                          this.$refs.ecoLoadingRef.close();
                          this.goBack();
                      }
                  } catch (error) {}
                }).catch((error)=>{
                    this.$refs.ecoLoadingRef.close();
                    this.$message({type: 'error',message: '添加失败！'});
                })
            } else {
                return false;
            }
        });
    },

    goBack(){
        this.$router.push({name:'userListInDept'});
    }
  },
  watch: {

  }
}
</script>
<style scope>
.userAdd .toolbar{
    padding:10px 10px;
    background-color:#fff;
    border-bottom:1px solid #ddd;
}

.userAdd .toolbar i{
  font-size: 12px;
}
</style>
