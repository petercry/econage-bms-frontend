<template>
    <div>
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <ecoContent top="0" bottom="0" style="padding:40px 20px 10px;">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="名称" prop="name" :rules="[
            { required: true, message: '名称不能为空'}
          ]">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="desc">
            <el-input v-model="form.desc"></el-input>
          </el-form-item>
          <el-form-item label="是否显示" prop="enabledShow">
            <el-checkbox v-model="form.enabledShow"></el-checkbox>
          </el-form-item>
          <el-form-item label="添加可用" prop="enabledInCreate">
            <el-checkbox v-model="form.enabledInCreate"></el-checkbox>
          </el-form-item>
          <el-form-item label="查询可用" prop="enabledInSelect">
            <el-checkbox v-model="form.enabledInSelect"></el-checkbox>
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
import {updateGroup,getGroupSingle} from '@/modules/portal1/service/service.js'
import {mapMutations} from 'vuex'
export default{
  name:'themeEdit',
  components:{
    ecoLoading,
    ecoContent
  },
  data(){
    return {
      form:{
        name:'',
        desc:'',
        titleId:'',
        enabledShow:true,
        enabledInCreate:true,
        enabledInSelect:true,
      }
    }
  },
  mounted(){
    this.getData();
  },
  methods: {
    getData(){
      let id = this.$route.params.id;
      this.$refs.ecoLoadingRef.open();
      getGroupSingle(id).then((res)=>{
        if (res.data&&res.data.id){
          let obj = res.data;
          this.form.name = obj.name;
          this.form.desc = obj.desc;
          this.form.titleId = obj.titleId;
          this.form.enabledShow = obj.enabledShow;
          this.form.enabledInCreate = obj.enabledInCreate;
          this.form.enabledInSelect = obj.enabledInSelect;
        }
        this.$refs.ecoLoadingRef.close();
      }).catch((error)=>{
        this.$refs.ecoLoadingRef.close();
      })
    },
    save(){
      this.$refs['form'].validate((valid) => {
          if (valid) {
            let id = this.$route.params.id;
            this.$refs.ecoLoadingRef.open();
            updateGroup(id,this.form).then((res)=>{
              if (res.data&&res.data.id){
                try {
                  this.$message({type: 'success',message: '更新成功！'});
                  this.$refs.ecoLoadingRef.close();
                  let doObj = {}
                  doObj.action = 'groupUpdateCallBack';
                  doObj.close = true;
                  parent.window.sysvm.callBackDialogFunc(doObj);
                } catch (error) {
                }
              }else{
                this.$refs.ecoLoadingRef.close();
                this.$message({type: 'error',message: '更新失败！'});
              }
            }).catch((error)=>{
              this.$refs.ecoLoadingRef.close();
              this.$message({type: 'error',message: '更新失败！'});
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
