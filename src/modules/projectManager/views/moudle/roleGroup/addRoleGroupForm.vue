<template>
    <div class="addRoleGroupForm">
        <el-form ref="form" :model="form" v-loading="loading" label-width="120px" class="addForm">
            <el-form-item label="标识">
                <el-input v-model.trim="form.sign"></el-input>
            </el-form-item>
            <el-form-item label="名称" required>
                <el-input v-model.trim="form.name"></el-input>
            </el-form-item>
            <el-form-item label="角色类型" required>
                <el-select v-model="roleTypes"  placeholder="请选择类型" multiple filterable @change="roleTypeChange" style="width:440px">
                   <el-option v-for="(item,index) in roleType" :key="index"

                    :label="item.text"
                    :value="item.id">

                    </el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="备注">
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
import {addRoleGroup} from '../../../api/roleGroup.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import { mapActions,mapGetters,mapState } from 'vuex'
export default {
  name:'addRoleGroupForm',
  components: {

  },
  data() {
    return {
        loading:false,
        form:{
            sign:"",
            name:"",
            comments:"",
            links:[]
        },
        roleTypes:[]
    }
  },
  created() {
      this.setRoleType();
  },
  activated(){

  },

  mounted(){

  },

  computed: {
    ...mapGetters([
        'roleType',
    ]),
  },

  methods: {
       ...mapActions([
        'setRoleType'
      ]),
      onCancel(){
          EcoUtil.getSysvm().closeDialog();
      },
      onSubmit(){
        if(!this.form.name){
            return  EcoMessageBox.alert('名称 不能为空','提示')
        }
        if(!this.form.links || this.form.links.length == 0){
            return  EcoMessageBox.alert('角色类型 不能为空','提示')
        }
        this.loading = true;
        addRoleGroup(this.form).then((res)=>{
            this.loading = false;
            let doObj = {}
            doObj.action = 'addRoleGroup';
            doObj.data = {};
            doObj.close = true;
            EcoUtil.getSysvm().callBackDialogFunc(doObj);
        })
      },
      roleTypeChange(values){
          this.form.links = [];
          this.form.links = values.map((item,index) =>{
              let obj = {};
              obj.roleType = item;
              return obj;
          })
          console.log( this.form.links)
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
