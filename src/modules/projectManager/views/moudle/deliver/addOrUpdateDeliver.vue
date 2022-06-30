<template>
    <div class="addOrUpdateDeliver">
       <el-form :model="form" v-loading="loading" :rules="rules" ref="addForm" class="addForm" label-position="left" label-width="100px">
            <el-form-item label="类型" prop="type" required >
                <el-select v-model="form.type" placeholder="请选择" style="width:100%;">
                    <el-option
                    v-for="(item,index) in deliverType" :key="index"
                    :label="item.text"
                    :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                 <el-input v-model.trim="form.name"></el-input>
            </el-form-item>
            <el-form-item label="关联流程">
                <link-wf></link-wf>
            </el-form-item>
            <el-form-item label="关联工作" prop="link">
                <el-input readonly v-model="form.aaa"></el-input>
            </el-form-item>
            <el-form-item label="交付文件">
                <div class="fileMain">
                    <el-row :gutter="20">
                        <el-col :span="18">
                            名称
                        </el-col>
                        <el-col :span="6">
                            类型
                        </el-col>
                    </el-row>
                    <el-row v-for="(item,index) in form.fileList" :key="index" :gutter="20" style="margin:10px -10px">
                        <el-col :span="18">
                            <el-input v-model="item.name"></el-input>
                        </el-col>
                        <el-col :span="6">
                            <el-select v-model="item.type" style="width:70%" clearable>
                                <el-option
                                v-for="(item,index) in deliverType" :key="index"
                                :label="item.text"
                                :value="item.id"
                                >
                                </el-option>
                            </el-select>
                             <i @click="deleteFileItem(index)" class="iconfont icon iconclosecircleo"></i>
                        </el-col>
                    </el-row>
                    <div class="btn-line">
                        <el-button size="medium" @click="addFileItem" type="text"><i class="iconfont icon iconicon-test"></i> 添加</el-button>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="备注" prop="comments">
                <el-input v-model="form.comments" type="textarea"></el-input>
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
import {EcoMessageBox} from '@/components/messageBox/main.js'
import { mapActions,mapGetters } from 'vuex'
import {addDeliver,getDeliverInfo,updateDeliver} from '../../../api/deliver.js'
import linkWf from '../../components/linkWf.vue'
export default {
  name:'addOrUpdateDeliver',
  components: {
      linkWf
  },
  data() {
    return {
        loading:false,
        form:{
            id:"",
            name:"",
            type:"",
            fileList:[],
            wfList:[],
            workList:[],
            comments:""
        },
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ],

          type: [
            { required: true, message: '请选择类型', trigger: 'change' }
          ],


        }
    }
  },
  created() {
       if(this.$route.params.moudleId && this.$route.params.moudleId > 0){
            if(this.$route.params.moudle == "templates"){
                this.form.modelId = this.$route.params.moudleId;
            }
            if(this.$route.params.moudle == "project"){
                this.form.infoId = this.$route.params.moudleId;
            }

        }
       this.setDeliverType();

  },
  activated(){

  },

  mounted(){

      if(this.$route.params.id > 0){
          this.getDeliverInfo();
      }
  },

  computed: {
     ...mapGetters([
        'deliverType',
      ]),
  },

  methods: {
      ...mapActions([
        'setDeliverType',
      ]),
      addFileItem(){
          let obj = {
              name:"",
              type:""
          };
          this.form.fileList.push(obj);
      },
      deleteFileItem(index){
          this.form.fileList.splice(index,1);
      },
      getDeliverInfo(){
          this.loading = true;
          getDeliverInfo(this.$route.params.id,this.$route.params.moudle).then( res => {
              this.loading = false;
              this.form = res;
          }).catch(e => {
              this.loading = false;
              console.log(e);
          })
      },
      onCancel(){
          EcoUtil.getSysvm().closeDialog();
      },
      onSubmit(){
        this.$refs['addForm'].validate((valid) => {
            if (valid) {
                if(this.$route.params.id > 0){
                    this.updateDeliver();
                }else{
                    this.addDeliver();
                }

            } else {

                return false;
            }
       });

        //this.loading = true;

      },
      addDeliver(){
          this.loading = true;
          addDeliver(this.form,this.$route.params.moudle).then(res => {
            this.loading = false;
            let doObj = {}
            doObj.action = 'addDeliver';
            doObj.data = {};
            doObj.close = true;
            EcoUtil.getSysvm().callBackDialogFunc(doObj);
          })
      },
      updateDeliver(){
          this.loading = true;
          updateDeliver(this.form,this.$route.params.moudle).then(res => {
            this.loading = false;
            let doObj = {}
            doObj.action = 'updateDeliver';
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
.addOrUpdateDeliver{
    background: #fff;
    height:100%;
}
.addOrUpdateDeliver .btn{
    text-align: right;
    padding: 10px;
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    right: 0;
    border-top: 1px solid #ddd;
}
.addOrUpdateDeliver .addForm{
    overflow: auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 60px;
    padding: 0 10px;
    padding-top: 20px;
}

.addOrUpdateDeliver .addForm .allItem{
    width: auto;
}
.fileMain{
    padding: 16px;
    border: 1px solid #e8e8e8;
    background-color: #fafafa;
}
.btn-line {
	border: 1px dashed #003b90;
	background-color: #fff;
	color: #003b90;
	cursor: pointer;
    text-align: center;
    border-radius: 4px;
	margin: 10px 0px;
}
.iconclosecircleo{
    font-size: 16px;
    color: #003b90;
    margin-left: 5px;
    cursor: pointer;
}
</style>
