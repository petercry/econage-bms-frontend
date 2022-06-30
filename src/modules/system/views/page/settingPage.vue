<template>
  <div style="margin:20px;">
      
      <el-form ref="form" :model="form" label-width="100px" label-position="left">

          <el-form-item label="字体大小">
             <el-radio-group v-model="form.ecoBodySize">
                 <el-radio  :label="item.id"    v-for="item in fontSizeList" :key="item.id">{{item.name}}</el-radio>
              </el-radio-group>
            
          </el-form-item>


          <el-form-item style="margin-top:50px;">
              <el-button type="success" @click="onSubmit">保存</el-button>
          </el-form-item>

      </el-form>
  
  </div>
</template>

<script>

import {mapMutations} from 'vuex'
export default {
  name:'settingPage',
  components: {
    
  },
  data() {
    return {
        form:{
            ecoBodySize:null
        },
        fontSizeList:[]
    };
  },
  created() {
      this.fontSizeList.push({id:'ecofs14',name:'标准'});
      this.fontSizeList.push({id:'ecofs16',name:'16字体'});
      this.fontSizeList.push({id:'ecofs18',name:'18字体'});
      this.fontSizeList.push({id:'ecofs20',name:'20字体'});

      this.form.ecoBodySize = window.sysvm.getEcoCookie('ecoBodySize') || 'ecofs14';
    
      
  },
  mounted() {},
  methods: {
        ...mapMutations([
            'SET_SETTING_CHANGE'
        ]),

        onSubmit(){
            localStorage.setItem("ecoBodySize",this.form.ecoBodySize);//设置字体大小
            this.$message({type: 'success',message: '保存成功！'});
            
            let _time = new Date().getTime();
            this.SET_SETTING_CHANGE(_time);

            let doObj = {}
            doObj.action = 'setEcoSettingCallBack';
            doObj.data = {};
            doObj.close = true;
            window.sysvm.callBackAllTabFunc(doObj);
        }
  },

  destroyed() {}
};
</script>



<style>



</style>
