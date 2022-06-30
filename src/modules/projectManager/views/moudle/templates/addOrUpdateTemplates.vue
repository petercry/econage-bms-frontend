<template>
    <div class="addOrUpdateTemplates">
       <el-form :model="form" v-loading="loading" :rules="rules" ref="addForm" class="addForm" label-width="100px">
            <el-form-item label="编码" prop="code">
                <el-input v-model.trim="form.code" placeholder="请输入模型编码"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name" >
                <el-input v-model.trim="form.name" placeholder="请输入模型名称"></el-input>
            </el-form-item>
            <el-form-item label="简介" >
                <el-input type="textarea" rows="3" v-model="form.introduce"></el-input>
            </el-form-item>
            <el-form-item label="备注" >
                <el-input type="textarea" rows="3" v-model="form.comments"></el-input>
            </el-form-item>
            <!-- <el-form-item label="项目平台" prop="pmSort" required>
                <el-select v-model="form.pmSort" placeholder="请选择">
                    <el-option
                    v-for="(item,index) in baseData['faw_pm_sort']" :key="index"
                    :label="item.text"
                    :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="项目类型" prop="type" required>
                <el-select v-model="form.type" placeholder="请选择">
                    <el-option
                    v-for="(item,index) in baseData['faw_pm_type']" :key="index"
                    :label="item.text"
                    :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="模型状态" prop="status" required>
                <el-select v-model="form.status" placeholder="请选择">
                    <el-option
                    v-for="(item,index) in baseData['faw_pm_model_status']" :key="index"
                    :label="item.text"
                    :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="初始化" prop="init" required v-if="!form.id">
                <el-radio-group v-model="form.init">
                    <el-radio :label="true" >是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
            </el-form-item>

        </el-form>
        <div class="btn" v-if="!form.id">
            <el-button class="plainBtn" size="medium" @click="onCancel">取消</el-button>
            <el-button type="primary" size="medium"  @click="onSubmit">保存</el-button>
        </div>
        <div class="btn" style="text-align:center" v-else>

            <el-button type="primary" size="medium"  @click="onSubmit">保 存</el-button>
        </div>
    </div>
</template>
<script>
import {EcoUtil} from '@/components/util/main.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import { mapGetters,mapActions } from 'vuex'
import {addTemplates,getTemplatesInfo,updateTemplates} from '../../../api/templates.js'
export default {
  name:'addOrUpdateTemplates',
  components: {

  },
  data() {
    return {
        loading:false,
        form:{
            id:null,
            code:"",
            name:"",
            introduce:"",
            comments:"",
            productType:"",
            type:"",
            status:"faw_pm_model_normal",
            init:true,
        },
        rules: {
          name: [
            { required: true, message: '请输入模型名称', trigger: 'blur' },
          ],
          code: [
            { required: true, message: '请输入模型编号', trigger: 'blur' }
          ],
          pmSort: [
            { required: true, message: '请选择项目平台', trigger: 'change' }
          ],
          type: [
            { required: true, message: '请选择项目类型', trigger: 'change' }
          ],
          status: [
            { required: true, message: '请选择模型状态', trigger: 'change' }
          ],
        },

    }
  },
  created() {

     if(this.$route.params.modelId > 0){
        this.getTemplatesInfo();
        this.initSomeBaseData({array:['faw_pm_sort','faw_pm_type','faw_pm_model_status'],action:"update-enabled"})
     }else{
        this.initSomeBaseData({array:['faw_pm_sort','faw_pm_type','faw_pm_model_status'],action:"create-enabled"})
     }
  },
  activated(){

  },

  mounted(){

  },

  computed: {
     ...mapGetters([
        'baseData',
      ]),
  },

  methods: {
      ...mapActions([
        'initSomeBaseData'
      ]),
      onCancel(){
          EcoUtil.getSysvm().closeDialog();
      },
      onSubmit(){
        this.$refs['addForm'].validate((valid) => {
            if (valid) {
                if(this.$route.params.modelId > 0){
                    this.updateTemplates();
                }else{
                    this.addTemplates();
                }
            } else {

                return false;
            }
       });

        //this.loading = true;

      },
      getTemplatesInfo(){
          this.loading = true;
          this.form.id = this.$route.params.modelId;
          getTemplatesInfo(this.$route.params.modelId).then( res => {
              this.loading = false;
              this.form = res;
          }).catch(e => {
              this.loading = false;
              console.log(e);
          })
      },
      addTemplates(){
          this.loading = true;
          addTemplates(this.form).then(res => {
            this.loading = false;
            let doObj = {}
            doObj.action = 'addTemplates';
            doObj.data = {};
            doObj.close = true;
            EcoUtil.getSysvm().callBackDialogFunc(doObj);
          }).catch(e =>{
              this.loading = false;
          })
      },
      updateTemplates(){
        this.loading = true;
        updateTemplates(this.form).then(res => {
            this.loading = false;
            this.$message({
                message: '修改成功！',
                showClose: true,
                duration:2000,
                type: 'success'
            });
        }).catch(e =>{
            this.loading = false;
        })
      }

  },
  watch:{

  },

};
</script>

<style scoped>
.addOrUpdateTemplates{
    background: #fff;
    height:100%;
}
.addOrUpdateTemplates .btn{
    text-align: right;
    padding: 10px;
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    right: 0;
    border-top: 1px solid #ddd;
}
.addOrUpdateTemplates .addForm{
    padding-top: 20px;
    padding-right: 20px;
    overflow: auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 60px;
}
.addOrUpdateTemplates .addForm .allItem{
    width: auto;
}
</style>
