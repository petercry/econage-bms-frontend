<template>
  <div>
    <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
    <eco-content top="0px" height="60px">
      <el-row class="toolbar">
          <el-col :span="8" >
              <eco-tool-title style="line-height: 34px;" :title="'消息提醒'"></eco-tool-title>
          </el-col>
          <el-col :span="16" class="tlr">
              <el-button type="primary" class="toolBtn" style="font-size:14px;" @click.native="save" ><i class="el-icon-circle-check" style="margin-right:10px;font-size: 14px;"></i>&nbsp;保存</el-button>
          </el-col>
      </el-row>
    </eco-content>

    <eco-content bottom="0" top="60px" ref="content" style="padding:10px 15px;">
      <div></div>
      <el-form class="personalForm" ref="form" size="mini" :model="form" :rules="formrule" label-width="90px">
        <el-form-item label="提醒频率" prop="freqType">
          <el-radio-group v-model="form.freqType">
            <el-radio v-for="(item,key) in RemindFreqTypeEnum" :key="key" :label="key">{{item}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </eco-content>
  </div>
</template>

<script>
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {Loading } from 'element-ui';
import EcoUtil from '@/components/util/main.js'
import {getRemindFreqTypeEnum,getRemindFreq,updateRemindFreq} from '@/modules/manage/service/service.js'

export default {
  name:'',
  components:{
    ecoLoading,
    ecoContent,
    ecoToolTitle
  },
  props: {
 
  },
  data() {
   
    return {
      isEditable:false,
      form: {
        freqType:'',
      },
      formrule:{
      },
      RemindFreqTypeEnum:{}
    };
  },
  computed: {},
  created() {
    this.getRemindFreqTypeEnum();
    this.getData();
  },
  mounted() {},
  methods: {
    getData(){
      getRemindFreq().then(res=>{
        this.form.freqType = res.data;
      }).catch(e=>{})
    },
    getRemindFreqTypeEnum(){
      getRemindFreqTypeEnum().then(res=>{
        this.RemindFreqTypeEnum = res.data;
      }).catch(e=>{})
    },
    save(){
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$refs.ecoLoadingRef.open();
          updateRemindFreq(this.form.freqType).then(res=>{
            this.$message.success('保存成功');
            this.$refs.ecoLoadingRef.close();
          }).catch(e=>{
            this.$message.error('保存失败');  
            this.$refs.ecoLoadingRef.close();
          })
        } else {
          this.$message.error('请按要求填写表单数据');
          return false;
        }
      });
    },
  },

  destroyed(){

  }

};

</script>

<style scoped>
.toolbar{
  padding:12px 10px;
  background-color:#fff;
  border-bottom:1px solid #ddd;
}
</style>
