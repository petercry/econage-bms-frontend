<template>
    <div>
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <ecoContent top="0" bottom="0" style="padding:40px 20px 10px;">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="ID">
            <el-input disabled v-model="form.id"></el-input>
          </el-form-item>
          <el-form-item label="code">
              <el-input v-model="form.code"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="text">
            <el-input v-model="form.text"></el-input>
          </el-form-item>
          <el-form-item label="国际化键" prop="i18nKey">
            <el-input v-model="form.i18nKey"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="order">
            <el-input v-model="form.order"></el-input>
          </el-form-item>
          <el-form-item label="添加可用" prop="enableInCreate">
            <el-checkbox v-model="form.enableInCreate"></el-checkbox>
          </el-form-item>
          <el-form-item label="更新可用" prop="enableInUpdate">
            <el-checkbox v-model="form.enableInUpdate"></el-checkbox>
          </el-form-item>
          <el-form-item label="查询可用" prop="enableInSelect">
            <el-checkbox v-model="form.enableInSelect"></el-checkbox>
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
import {getBasicKvGroupDetail,updateBasicKv} from '@/modules/manage/service/service.js'
import {mapMutations} from 'vuex'
export default{
  name:'roleAdd',
  components:{
    ecoLoading,
    ecoContent
  },
  data(){
    return {
      form:{
        id:'',
        code:'',
        text:'',
        i18nKey:'',
        order:1,
        enableInCreate:true,
        enableInUpdate:true,
        enableInSelect:true,
      }
    }
  },
  mounted(){
    this.getData();
  },
  methods: {
    getData(){
      var that = this;
      let group = this.$route.params.group; 
      getBasicKvGroupDetail(group).then((response)=>{
        let id = this.$route.params.id; 
        let obj = response.data.filter((item)=>{
          return item.id == id
        })[0];
        if (obj){
          that.form.id = obj.id;
          that.form.code = obj.code;
          that.form.text = obj.text;
          that.form.i18nKey = obj.i18nKey;
          that.form.order = obj.order;
          that.form.enableInCreate = obj.enableInCreate;
          that.form.enableInUpdate = obj.enableInUpdate;
          that.form.enableInSelect = obj.enableInSelect;
        }
      }).catch((error)=>{
      });
    },
    save(){
      this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$refs.ecoLoadingRef.open();
            updateBasicKv(this.form).then((res)=>{
              if (res.data&&res.data.id){
                try {
                  this.$message({type: 'success',message: '编辑成功！'});
                  this.$refs.ecoLoadingRef.close();
                  let doObj = {}
                  doObj.action = 'basicKvEditCallBack';
                  doObj.close = true;
                  parent.window.sysvm.callBackDialogFunc(doObj);
                } catch (error) {
                  
                }
              }else{
                this.$refs.ecoLoadingRef.close();
                this.$message({type: 'error',message: '编辑失败！'});
              }
            }).catch((error)=>{
              this.$refs.ecoLoadingRef.close();
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
