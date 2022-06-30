<template>
    <div>
    
 
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="流水号名称" prop="name" :rules="[
            { required: true, message: '流水号名称不能为空'}
          ]">
            <el-input v-model="form.name" @blur="previewCommonSequence()"></el-input>
          </el-form-item>
          <el-form-item label="前缀">
            <el-input v-model="form.prefix" @blur="previewCommonSequence()"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="18">
              <el-form-item label="年号规则">
                <el-radio-group v-model="form.formulaType" @change="previewCommonSequence()">
                  <el-radio v-for="(item,key) in formulaTypeMap" :key="'formulaType'+key" :label="key">{{item}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="结束符">
                <el-input v-model="form.formulaSuffix" @blur="previewCommonSequence()"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
           <el-row>
            <el-col :span="12">
              <el-form-item label="起始值" prop="startIdx" :rules="[
                { required: true, message: '起始值不能为空'}
              ]">
                <el-input v-model="form.startIdx"  @blur="toFormNumber($event,form.startIdx,'startIdx')&&previewCommonSequence()"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="位数" prop="length" :rules="[
                { required: true, message: '位数不能为空'}
              ]">
                <el-input v-model.number="form.length"  @blur="toFormNumber($event,form.length,'length')&&previewCommonSequence()"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-checkbox style="margin-left:20px;" v-model="form.isFixLengthShow" @change="previewCommonSequence()">固定长度显示</el-checkbox>
            </el-col>
          </el-row>
          <el-form-item label="后缀">
            <el-input v-model="form.suffix" @blur="previewCommonSequence()"></el-input>
          </el-form-item>
          <el-form-item label="重置规则">
            <el-radio-group v-model="form.idxResetType" @change="previewCommonSequence()">
              <el-radio v-for="(item,key) in idxResetTypeMap" :key="'idxResetType'+key" :label="key">{{item}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="预览">
            <el-input readonly v-model="previewResult"></el-input>
          </el-form-item>
          <el-form-item>
            <p style="color:#007644">注:重置规则设置为“按年份”，该流水号在年份变化后值重置为最小值；重置规则设置为“按月份”，该流水号在月份变化后值重置为最小值；重置规则设置为“按日”，该流水号在日变化后值重置为最小值。</p>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click.native="save">
              保存
              <i class="el-icon-check el-icon--right"></i>
            </el-button>
          </el-form-item>
        </el-form>
    
   
    </div>
</template>
<script>
import {Loading } from 'element-ui';
import EcoUtil from '@/components/util/main.js'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {addCommonSequence,getCommonSequenceFormuiaType,getCommonSequenceIdxRestType,previewCommonSequence} from '../../service/service.js'
import {mapMutations} from 'vuex'
export default{
  name:'addCommonSequence',
  components:{
   
      ecoContent
  },
  data(){
    return {
      previewResult:'',
      form:{
        prefix:"",
        name:"",
        formulaType:"NONE",
        formulaSuffix:"",
        startIdx:"",
        length:0,
        isFixLengthShow:true,
        suffix:"",
        idxResetType:"NONE",
      },
      formulaTypeMap:{},
      idxResetTypeMap:{},
    }
  },
  mounted(){
    this.getCommonSequenceFormuiaType();
    this.getCommonSequenceIdxRestType();
  },
  methods: {
    toFormNumber($event,formVal,key){
      if (/^[0-9]*$/.test(formVal)){
      }else{
        this.$message.error('该输入框只能输入数字')
        let val = formVal.replace(/(\D+[\d\D]*)/,'')
        this.form[key] = val;
        return false;
      }
      return true;
    },
    getCommonSequenceFormuiaType(){
      getCommonSequenceFormuiaType().then(res=>{
        this.formulaTypeMap = res.data;
      }).catch(e=>{})
    },
    getCommonSequenceIdxRestType(){
      getCommonSequenceIdxRestType().then(res=>{
        this.idxResetTypeMap = res.data;
      }).catch(e=>{})
    },
    previewCommonSequence(){
      previewCommonSequence(this.form).then(res=>{
        this.previewResult = res.data;
      }).catch(e=>{})
    },
    save(){
      this.$refs['form'].validate((valid) => {
          if (valid) {
            let loadingInstance = Loading.service({ fullscreen: true,text:'正在添加...'});
            addCommonSequence(this.form).then((res)=>{
                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                            loadingInstance.close();
                });

               try {
                  if (res.data&&res.data.id){
                      this.$message({type: 'success',message: '添加成功！'});
                      let doObj = {}
                      doObj.action = 'commonSequenceAddCallBack';
                      doObj.close = true;
                       EcoUtil.getSysvm().callBackDialogFunc(doObj);
                  }
              } catch (error) {
                
              }
            }).catch((error)=>{
               this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                            loadingInstance.close();
                  });
              this.$message({type: 'error',message: '添加失败！'});
            })
          } else {
            return false;
          }
      });
    }
  },
  watch: {}
}
</script>
<style>

</style>
