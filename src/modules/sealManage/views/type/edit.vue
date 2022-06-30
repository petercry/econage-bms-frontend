<template>
    <div class="sealAdd">
      <ecoLoading ref='ecoLoadingRef' :text="'进行中...'"></ecoLoading>
      <ecoContent top="0" bottom="0" style="padding:0px 20px 10px;">
        <el-form ref="form" :model="form" style="margin-top:20px;">
            <el-form-item label="类型名称" prop="name" :rules="[
              { required: true, message: '类型名称不能为空'}
            ]">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click.native="save">
              保存
            </el-button>
            <!-- <el-button type="default" @click.native="$router.push({name:'sealListInDept'})">
              返回
            </el-button> -->
          </el-form-item>
        </el-form>
      </ecoContent>
    </div>
</template>
<script>

import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {updateSealGroup,getSealGroupSingle} from '@/modules/sealManage/service/service.js'
export default{
  name:'sealTypeAdd',
  components:{
      ecoLoading,
      ecoContent,
      ecoToolTitle
  },
  data(){
    return {
      form:{
        id:'',
        name:'',
        // order:'',
        orgId:'',
        valid:true,
      }
    }
  },
  mounted(){
    this.getData();
  },
  methods: {
    getData(){
      getSealGroupSingle(this.$route.params.id).then(res=>{
        this.form = Object.assign({},res.data);
      }).catch(e=>{})
    },
    save(){
        this.$refs['form'].validate((valid) => {
            if (valid) {
                this.$refs.ecoLoadingRef.open();
                updateSealGroup(this.form).then((res)=>{
                  try {
                      if (res.data&&res.data.id){
                          this.$message({type: 'success',message: '更新成功！'});
                          this.$refs.ecoLoadingRef.close();
                          let doObj = {}
                          doObj.action = 'sealTypeEditCallBack';
                          doObj.close = true;
                          parent.window.sysvm.callBackDialogFunc(doObj);
                      }
                  } catch (error) {}
                }).catch((error)=>{
                    this.$refs.ecoLoadingRef.close();
                    this.$message({type: 'error',message: '更新失败！'});
                })
            } else {
                return false;
            }
        });
    },
  },
  watch: {

  }
}
</script>
<style scope>
.sealAdd .toolbar{
    padding:10px 10px;
    background-color:#fff;
    border-bottom:1px solid #ddd;
}

.sealAdd .toolbar i{
  font-size: 12px;
}
</style>
