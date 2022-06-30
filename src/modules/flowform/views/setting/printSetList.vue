<template>
    <div class="printSetList">
        <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
        <el-scrollbar class="page-component__nav" style="height: 100%;">
        <el-table
            v-loading="loading"
            size="medium"
            :data="listData"
            style="width: 100%;">
            <el-table-column
                prop="setName"
                label="打印模板名称"
                >
            </el-table-column>
            <el-table-column
                label="备注"
                 prop="comments"
            >
            
            </el-table-column>
            <el-table-column
                label="操作"
                 prop="id"
            >
            <template slot-scope="scope" >
                <el-button type="text" @click="print(scope)">选中</el-button>
             </template>
            </el-table-column>
        </el-table>
        
         <form name="docviewform"  method="post">
          <input type="hidden" name="fileHeaderId"/>
          <input type="hidden" name="model"/>
          <input type="hidden" name="doNothing" value="Y" />
          <input type="hidden" name="nextPage" value="/wh/jsp/version3/file/v3_idocview.jsp" />
            </form>
            <iframe name="docviewIframe" style="display:none"></iframe>
         </el-scrollbar>
    </div>
</template>
<script>

import {Loading } from 'element-ui';
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {EcoUtil} from '@/components/util/main.js'
import {EcoFile} from '@/components/file/main.js'
import {getSelectedPrintSetList,getPrintFormData} from '../../service/service.js'
export default{
  data(){
    return {
       listData:[],
       reqId:'',
       flag:0,
       loading:true
    }
  },
  components: {
   ecoLoading
  
  },
  created(){
      this.reqId = this.$route.params.wfId;
      this.flag = this.$route.params.flag;
  },
  beforeDestroy() {
     
  },
  mounted(){
    this.getPrintSetList();
  },
  computed:{

  },
  methods: {
    getPrintSetList(){
        getSelectedPrintSetList(this.reqId).then((response) => {
            this.loading = false;
            if(response.data.status<100){
                this.listData = response.data.remap.print_set_list;
            }
        }).catch((error) => {
            this.loading = false;
        });
    },
    print(scope){
        this.$refs.ecoLoadingRef.open();
        
        
        getPrintFormData(this.reqId,scope.row.id).then((response) => {
            this.$refs.ecoLoadingRef.close();
            if(response.data.status<100){
                let obj = response.data.remap;
                if(this.flag == 0){
                     EcoFile.openFileByPdfJs(obj.filder_header_id,obj.model_id);
                }else if(this.flag == 1 || this.flag == 2){//ukey
                    
                    let doObj = {}
                    doObj.action = 'selectUkeyPrintTemplate';
                    doObj.data = {};
                    doObj.data.printTemplateId = scope.row.id;
                    doObj.data.filderHeaderId = obj.filder_header_id;
                    doObj.data.modelId = obj.model_id;
                    doObj.data.flag = this.flag

                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
               
                }
                //EcoFile.openFileHeaderByView(obj.filder_header_id,obj.model_id);
                setTimeout(()=>{
                    EcoUtil.getSysvm().closeDialog();
                },100);
            }
        }).catch((error) => {
            this.$refs.ecoLoadingRef.close();
        });
    }
  },
  watch: {
     
  }
}
</script>
<style scoped>
 
 .printSetList{
    height: 100%;
    overflow: auto;
    background: #fff;
 }
</style>
