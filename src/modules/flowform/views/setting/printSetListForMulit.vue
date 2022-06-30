<template>
    <div class="printSetList">
        <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
        <el-table
            v-loading="loading"
            size="medium"
             @selection-change="handleSelectionChange"
            :data="listData"
            style="width: 100%;">
             <el-table-column
            type="selection"
            width="55">
            </el-table-column>
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
         
        </el-table>
        <div class="btn">
            <el-button class="plainBtn" size="medium" @click="onCancel">取消</el-button>
            <el-button type="primary" size="medium"  @click="onSubmit">保存</el-button>
        </div>
    </div>
</template>
<script>

import {Loading } from 'element-ui';
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {EcoUtil} from '@/components/util/main.js'
import {getPrintSetList} from '../../service/service.js'
export default{
  data(){
    return {
       listData:[],
       reqId:'',
       loading:true,
       multipleSelection: []
    }
  },
  components: {
   ecoLoading
  
  },
  created(){
      this.reqId = this.$route.params.wfTemplateId;
  },
  beforeDestroy() {
     
  },
  mounted(){
    this.getPrintSetList();
  },
  computed:{

  },
  methods: {
    handleSelectionChange(val) {
        this.multipleSelection = val;
    },
    getPrintSetList(){
        getPrintSetList(this.reqId).then((response) => {
            this.loading = false;
            if(response.data.status<100){
                let remap = response.data.remap;
                let array = remap.set_list;
                let print_set_list = []
                array.forEach(element => {
                  if(element.is_selected == 1){
                    print_set_list.push(element);
                  }
                });
                this.listData = print_set_list;
            }
        }).catch((error) => {
            this.loading = false;
        });
    },
    onCancel(){
        EcoUtil.getSysvm().closeDialog();
    },
    onSubmit(){
        let doObj = {}
        doObj.action = 'selectPrintSet';
        doObj.data = this.multipleSelection;
        doObj.close = true;
        EcoUtil.getSysvm().callBackDialogFunc(doObj);
    }
  },
  watch: {
     
  }
}
</script>
<style scoped>
 
 .printSetList{
    width:100%;
    min-height: 100%;
    height:auto;
    position: absolute;
    background: #fff;
 }
  .printSetList .btn{
    text-align: right;
    margin:10px;
}
</style>
