<template>
    <div class="addRoleGroupForm">
        <el-form ref="form" :model="form" v-loading="loading" label-width="120px" class="addForm">
            <el-form-item label="标识" required>
                <el-input v-model.trim="form.sign"></el-input>
            </el-form-item>
            <el-form-item label="名称" required>
                <el-input v-model.trim="form.name"></el-input>
            </el-form-item>
            <el-form-item label="备注" required>
                <el-input type="textarea" v-model.trim="form.comments"></el-input>
            </el-form-item>
        </el-form>
        <div class="btn">
            <el-button class="plainBtn" size="medium" @click="onCancel">取消</el-button>
            <el-button type="primary" size="medium"  @click="onSubmit">保存</el-button>
        </div>
    </div>
</template>
<script>
import {EcoUtil} from '@/components/util/main.js'
import {addSetting} from '../../../api/setting.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
export default {
  name:'addRoleGroupForm',
  components: {

  },
  data() {
    return {
        loading:false,
        form:{
            id:"",
            model:"",
            editBefore:"",
            editAfter:"",
            hour:""
        }
    }
  },
  created() {

  },
  activated(){

  },

  mounted(){

  },

  computed: {

  },

  methods: {
      onCancel(){
          EcoUtil.getSysvm().closeDialog();
      },
      onSubmit(){
        if(!this.form.id){
            return  EcoMessageBox.alert('数据主键 不能为空','提示')
        }
        if(!this.form.model){
            return  EcoMessageBox.alert('模块名称 不能为空','提示')
        }
        if(!this.form.editBefore && this.form.editBefore != "0"){
            return  EcoMessageBox.alert('可编辑天数(当前时间之前) 不能为空','提示')
        }
        if(!this.form.editAfter && this.form.editAfter != "0"){
            return  EcoMessageBox.alert('可编辑天数(当前时间之前) 不能为空','提示')
        }
        if(!this.form.hour && this.form.hour != "0"){
            return  EcoMessageBox.alert('一天工时数 不能为空','提示')
        }
        this.loading = true;
        addSetting(this.form).then((res)=>{
            this.loading = false;
            let doObj = {}
            doObj.action = 'addSetting';
            doObj.data = {};
            doObj.close = true;
            EcoUtil.getSysvm().callBackDialogFunc(doObj);
        })
      }
  },
  watch:{

  },

};
</script>

<style scoped>
.addRoleGroupForm{
    background: #fff;
    height:100%;
}
.addRoleGroupForm .btn{
    text-align: right;
    margin:10px;
    position: absolute;
    bottom: 0;
    right: 0;
}
.addRoleGroupForm .addForm{
    padding-top: 20px;
}
</style>
