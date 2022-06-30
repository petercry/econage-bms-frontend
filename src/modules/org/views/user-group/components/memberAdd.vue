<template>
    <div style="height:180px;">
      <ecoLoading ref='ecoLoadingRef' :text="'加载中'"></ecoLoading>
      <div style="padding:40px 20px 10px;position: relative;">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="添加人员" prop="userArr" :rules="[
              { required: true, message: '添加人员不能为空'}
            ]">
            <div class="display-input"  @click="openChooser">
              <el-tag
                v-for="(item, index) in form.userArr" 
                :key="index"
                closable
                type="info"
                @close="tagClick(item,index)">
                {{item.orgPath}}
              </el-tag>
            </div>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click.native="save">
              保存
              <i class="el-icon-check el-icon--right"></i>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>
<script>
import ecoActionBtn from '../../../views/components/ecoActionBtn.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {addGroupMember} from '../../../service/service.js'
import {mapMutations} from 'vuex'
import EcoUtil from '@/components/util/main.js'
export default{
  name:'userRoleAdd',
  components:{
    ecoActionBtn,
    ecoLoading,
    ecoContent
  },
  data(){
    return {
      dialogVisible:false,
      form:{
        userArr:[]
      }
    }
  },
  mounted(){
    window.ecoPop = this;
    this.addMonitor(); //添加监听
  },
  methods: {
    tagClick(item,index){
      this.form.userArr.splice(index,1);
    },
    openChooser(){
      window.parent.sysvm.openDialog('组织架构',
        '/org/index.html#/userSelect/2',700,450);
      setTimeout(()=>{
        let doObj = {}
        doObj.action = 'userChooseDataCallBack';
        doObj.data = window.ecoPop.form.userArr;
        parent.window.sysvm.callBackDialogFunc(doObj);
      },2000)
    },
     addMonitor(){
        let callBackDialogFunc = function(obj){
            if(obj && obj.action == 'userChooseCallBack'){ //回调的唯一标识符
              window.ecoPop.form.userArr = obj.data;
            }
        }
        EcoUtil.addCallBackDialogFunc(callBackDialogFunc);
    },
    save(){
      this.$refs['form'].validate((valid) => {
          if (valid) {
            let id = this.$route.params.id;
            let userId = this.form.userArr.map(item=>{
              return item.resourceId;
            })
            this.$refs.ecoLoadingRef.open();
            addGroupMember(id,userId).then((res)=>{
              try {
                this.$message({type: 'success',message: '添加成功！'});
                this.$refs.ecoLoadingRef.close();
                let doObj = {}
                doObj.action = 'memberAddCallBack';
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
