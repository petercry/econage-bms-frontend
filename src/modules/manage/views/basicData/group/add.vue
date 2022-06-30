<template>
  <div class="">
    <div class="kn-header" >
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <div>
        添加枚举
        <!-- <ecoActionBtn :ecoActionBtnFunc="addBasicKvGroup">
          <i slot="icon" class="el-icon-circle-check-outline"/>
          保存
        </ecoActionBtn> -->
      </div>
    </div>
    <div class="page-main">
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-form-item label="ID">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name" :rules="[
            { required: true, message: '名称不能为空'}
          ]">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.order" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="国际化编码">
          <el-input v-model="form.i18nKey"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click.native="addBasicKvGroup">
            保存
            <i class="el-icon-check el-icon--right"></i>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import ecoActionBtn from '@/modules/menu/views/components/ecoActionBtn.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import EcoUtil from '@/components/util/main.js'
import {addBasicKvGroup} from '@/modules/manage/service/service.js'
import { mapState } from 'vuex';
export default {
  name:'editSysMenu',
  components:{
    ecoActionBtn,
    ecoLoading
  },
  props: {
 
  },
  data() {
    return {
      form:{
        name:'',   //菜单名称
        i18nKey:'', //国际化key
        categoryId:'', //上级节点
        id:'', //ID
        description:'',    //备注
        order:1,    //序号
      },
      rules:{
        
      }
    };
  },
  mounted(){
    this.form.categoryId = this.$route.params.categoryId;
  },
  created(){
  },
  computed:{
    ...mapState(['sysTree'])
  },
  methods:{
    addBasicKvGroup(){
      this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$refs.ecoLoadingRef.open();
            addBasicKvGroup(this.form).then((res)=>{
              if (res.data&&res.data.id){
                let obj = res.data;
                this.$message({type: 'success',message: '添加成功！'});
                this.sysTree.$parent.$parent.$parent.resetCategoryChildren(this.form.categoryId,()=>{
                  this.sysTree.$parent.$parent.$parent.reload();
                  this.$nextTick(()=>{
                     this.sysTree.setCurrentKey(obj.id);
                  })
                  this.$router.push({
                    name: 'basicDataDetailList',
                    params: {
                      group:obj.id
                    }
                  })
                })
              }else{
                this.$message({type: 'error',message: '添加失败！'});
              }
              this.$refs.ecoLoadingRef.close();
            }).catch((error)=>{
              this.$refs.ecoLoadingRef.close();
              this.$message({type: 'error',message: '添加失败！'});
            })
          } else {
            return false;
          }
      });
    },
  },

  destroyed(){

  }

};

</script>

<style scoped>

</style>
