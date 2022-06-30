<template>
    <div>
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <ecoContent top="0" bottom="0" style="padding:40px 20px 10px;">
        
        <el-form ref="form" :model="form" label-width="80px">

          <el-form-item label="编号">
            <span style="color:#999;font-size:12px;">{{form.code}}</span>
            <!-- <el-input v-model="form.group"></el-input> -->
          </el-form-item>

          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>

          <el-form-item label="角色类型" prop="name">
              <el-select v-model="form.type" disabled>
                    <el-option
                          :key="index"
                          v-for="(item,index) in roleTypeArray"
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
import ecoActionBtn from '../../views/components/ecoActionBtn.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {editRole,getRoleList,getRoleTypeEnum} from '../../service/service.js'
import EcoUtil from '@/components/util/main.js'
import {mapMutations} from 'vuex'
export default{
  name:'roleEdit',
  components:{
    ecoActionBtn,
    ecoLoading,
    ecoContent
  },
  data(){
    return {
      form:{
          code:'',
          name:'',
          type:'',
          i18nKey:'',
          i18nText:'',
          order:1
      },
      roleTypeArray:[]
    }
  },
  mounted(){
      this.getData();
      this.getRoleTypeEnumFunc();
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


    getData(){
      var that = this;
      getRoleList().then((response)=>{
          let code = this.$route.params.code; 
          let obj = response.data.rows.filter((item)=>{
              return item.code == code
          })[0];
          if (obj){
              that.form.code = obj.code;
              that.form.name = obj.name;
              that.form.i18nKey = obj.i18nKey;
              that.form.i18nText = obj.i18nText;
              that.form.order = obj.order;
              that.form.type = obj.type;
          }
      }).catch((error)=>{
      });
    },
    save(){
      this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$refs.ecoLoadingRef.open();
            editRole(this.form).then((res)=>{
              try {
                this.$message({type: 'success',message: '修改成功！'});
                this.$refs.ecoLoadingRef.close();
                let doObj = {}
                doObj.action = 'roleEditCallBack';
                doObj.close = true;
                parent.window.sysvm.callBackDialogFunc(doObj);
              } catch (error) {
                
              }
            }).catch((error)=>{
              this.$refs.ecoLoadingRef.close();
              this.$message({type: 'error',message: '修改失败！'});
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
