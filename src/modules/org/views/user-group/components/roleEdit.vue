<template>
    <div style="height:180px;">
      <ecoLoading ref='ecoLoadingRef' :text="'加载中'"></ecoLoading>
      <div style="padding:40px 20px 10px;position: relative;">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="角色范围" prop="roleScope" :rules="[
              { required: true, message: '角色范围不能为空'}
            ]">
            <el-input v-model="form.orgObj.orgPath" @click.native="openChooser">
              <div slot="suffix" style="padding: 0 5px;cursor:pointer;">
                <span>选择</span>
              </div>
            </el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role" :rules="[
              { required: true, message: '角色不能为空'}
            ]">
            <el-select class="selectType1" popper-class="selectpop1" style="width:100%;" v-model="form.role" :popper-append-to-body="false" placeholder="请选择角色">
              <el-option v-for="item in roleList" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
            <!-- <el-input v-model="form.role"></el-input> -->
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click.native="save">
              保存
              <i class="el-icon-check el-icon--right"></i>
            </el-button>
          </el-form-item>
          <!-- <el-dialog
            title="组织架构"
            :visible.sync="dialogVisible">
            <iframe style="width: 100%;height: 430px;" src="/org/#/deptSelect/1"></iframe>
          </el-dialog> -->
        </el-form>
      </div>
      <!-- <div class="kn-main">
        
      </div> -->
    </div>
</template>
<script>
import ecoActionBtn from '../../../views/components/ecoActionBtn.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {getRoleList,editGroupRoleConfig,getGroupRoleConfig} from '../../../service/service.js'
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
      roleList:[],
      form:{
        role:'',
        roleScope:'',
        orgObj:{
          orgPath:''
        }
      }
    }
  },
  mounted(){
    this.getData();
    window.ecoPop = this;
    this.getRoleListFunc();
    this.addMonitor(); //添加监听
  },
  methods: {
    getData(){
        let orgRoleId = this.$route.params.orgRoleId; 
        let id = this.$route.params.id; 
        getGroupRoleConfig(id).then((response)=>{
            let objArr = response.data.rows.filter(item=>{
              return item.id == orgRoleId
            });
            if (objArr[0]){
              this.form = {
                role:objArr[0].role,
                roleScope:objArr[0].roleScope,
                orgObj:{
                  orgPath:objArr[0].roleScopePathI18n
                }
              }
            }
        }).catch((error)=>{
        });
    },
    openChooser(){
      window.parent.sysvm.openDialog('组织架构',
        '/org/index.html#/deptSelect/1',700,450);
    },
     addMonitor(){
        let callBackDialogFunc = function(obj){
            if(obj && obj.action == 'deptChooseCallBack'){ //回调的唯一标识符
              window.ecoPop.form.roleScope = obj.data.orgId;
              window.ecoPop.form.orgObj = obj.data;
              // window.ecoPop.dialogVisible = false;
            }
        }
        EcoUtil.addCallBackDialogFunc(callBackDialogFunc);
    },
    getRoleListFunc(){
      getRoleList().then((response)=>{
          this.roleList = response.data.rows;
      }).catch((error)=>{
      });
    },
    save(){
      this.$refs['form'].validate((valid) => {
          if (valid) {
            let orgRoleId = this.$route.params.orgRoleId;
            let id = this.$route.params.id;
            this.$refs.ecoLoadingRef.open();
            editGroupRoleConfig(id,orgRoleId,this.form).then((res)=>{
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
