<template>
    <div>
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <ecoContent top="0" bottom="0" style="padding:20px 20px 10px;">
        <el-form ref="form" :model="form" label-width="110px">

          <el-form-item label="编号">
              <!-- <span style="color:#999;font-size:12px;">自动生成</span> -->
              <el-input v-model="form.code"></el-input>
          </el-form-item>
          
          <el-form-item label="名称" prop="name">
              <el-input v-model="form.name"></el-input>
          </el-form-item>

          <el-form-item label="角色类型" prop="name">
              <el-select v-model="form.type">
                    <el-option
                          :key="index"
                          v-for="(item,index) in roleTypeArray"
                          :label="item.name"
                          :value="item.id">
                    </el-option>
              </el-select>
          </el-form-item>

           <el-form-item label="所属分支机构"  v-if="branchDeptEnabled" prop="branchDeptId" :rules="[{ required: true, message: '所属分支机构不能为空'}]">
                <el-select v-model="form.branchDeptId" >
                      <el-option
                            :key="index"
                            v-for="(item,index) in departments"
                            :label="item.name"
                            :value="item.id">
                      </el-option>
                </el-select>
          </el-form-item>

          <el-form-item label="国际化键" prop="name">
              <el-input v-model="form.i18nKey"></el-input>
          </el-form-item>

          <el-form-item label="排序" prop="order">
              <el-input v-model="form.order"></el-input>
          </el-form-item>

          <el-form-item label="">
              <el-button type="primary" @click.native="save">
                保存
                <i class="el-icon-check el-icon--right"></i>
              </el-button>
          </el-form-item>

        </el-form>
      </ecoContent>
      <!-- <div class="kn-main">
        
      </div> -->
    </div>
</template>
<script>

import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {addRole,getRoleTypeEnum,getRoleBrachDeptView} from '@/modules/hr/service/service.js'

export default{
  name:'roleAdd',
  components:{
      ecoLoading,
      ecoContent
  },
  data(){
    return {
      form:{
          code:'',
          name:'',
          i18nKey:'',
          i18nText:'',
          order:1,
          type:'',
          branchDeptId:'-100'
      },

      roleTypeArray:[],
      branchDeptEnabled:false,
      departments:[],
      nearestDeptId:[],

    }
  },
  mounted(){
      this.form.type  = this.$route.params.type;
      this.getRoleTypeEnumFunc();
      this.getRoleBrachDeptViewFunc();
  },
  methods: {

    getRoleTypeEnumFunc(){
        getRoleTypeEnum().then((response)=>{
            let _roleTypeObj = response.data;
            for(let key in _roleTypeObj){
                this.roleTypeArray.push({id:key,name:_roleTypeObj[key]});
            }
        })
    },

    getRoleBrachDeptViewFunc(){
          getRoleBrachDeptView().then((response)=>{
              this.branchDeptEnabled = response.data.branchDeptEnabled;
              let _departments = [];
               _departments.push({name:'跨机构通用',id:'-public'});
              (response.data.departments).forEach(element => {
                    _departments.push(element);
              });
              this.departments = _departments;
              this.nearestDeptId = response.data.nearestDeptId;
              if(this.branchDeptEnabled){
                  this.form.branchDeptId = null;
              }
          })
    },

    save(){
      this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$refs.ecoLoadingRef.open();
            addRole(this.form).then((res)=>{
              try {
                this.$message({type: 'success',message: '添加成功！'});
                this.$refs.ecoLoadingRef.close();
                let doObj = {}
                doObj.action = 'roleAddCallBack';
                doObj.close = true;
                parent.window.sysvm.callBackDialogFunc(doObj);
              } catch (error) {
                
              }
            }).catch((error)=>{
              this.$refs.ecoLoadingRef.close();
              this.$message({type: 'error',message: '添加失败！'});
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
