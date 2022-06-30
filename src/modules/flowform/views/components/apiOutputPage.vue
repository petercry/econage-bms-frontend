<template>
    <div class="apiSetting">
        <el-form  v-loading="loading" :model="form" ref="form" label-position="top" :show-message="false" class="container" label-width="100px">
    
            <el-form-item label="输出参数">
                <el-table
                    size="medium"
                    class="list"
                    :data="form.outputParamList"
                    style="width: 100%;">
                    <el-table-column
                        prop="paramName"
                        label="赋值参数"
                        show-overflow-tooltip
                        >
                        <template slot-scope="scope">
                             <i class="iconfont icon-act iconhandright" v-if="scope.row.paramPath"></i>
                             {{scope.row.paramName}}
                         </template>
                    </el-table-column>
                    <el-table-column
                        prop="titleName"
                        label="参数描述"
                        >
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        >
                        <template slot-scope="scope">
                            <el-button type="text" size="medium" @click="choose(scope.row)">应用</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>

import {Loading } from 'element-ui';
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {EcoUtil} from '@/components/util/main.js'
import {getOutPutInfo} from '../../service/service.js'

export default{
  data(){
    return {
      loading:true,
      form:{
         
          outputParamList:[],
         
      },

    }
  },
  components: {
   ecoLoading,
  },
  created(){
    this.refId = this.$route.params.refId;
    
  },
  beforeDestroy() {
     
  },
  mounted(){
      this.loadConnectorInfo();
  },
  computed:{

  },
  methods: {
       loadConnectorInfo(){
         
           getOutPutInfo(this.refId).then((response)=>{
                if(response.data.status<100){
                    let remap = response.data.remap;
                    // this.form = remap.ref_entity;
                    this.form.outputParamList = remap.out_params;
                    
                }
                this.loading = false;
           });
       },
       choose(item){
           let doObj = {}
            doObj.action = 'apiOutPutPage';
            doObj.data = item;
            doObj.close = true;
            EcoUtil.getSysvm().callBackDialogFunc(doObj);
            return;
       },
      
  },
  watch: {
     
  }
}
</script>
<style scoped>
.apiSetting{
    width:100%;
    min-height: 100%;
    height:auto;
    position: absolute;
    background: #fff;
}
.container{
    padding: 20px 12px 10px;
}
.apiSetting .btn{
  text-align: right;
  margin:20px 10px;
}
.apiSetting .plainBtn{
    border-color: #409eff;
    color: #409eff;
    font-size: 14px;
    margin-right:10px;
}
.qiehuan{
    height: 32px;
    line-height: 32px;
    display: inline-block;
    background: #fff;
    border-radius: 4px;
    width: 28px;
    text-align: center;
    border: 1px solid #DCDFE6;
    color: #1ba5fa;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    position: relative;
    top: 1px;
    cursor: pointer;
}
.icon-act {
    color: #1ba5fa;
    margin-right: 8px;
    margin-left: 15px;
    position: relative;
    top: 2px;
}
</style>
