<template>
  <div v-if="formWfList && formWfList.length > 0" class="handleRefMainListVue">
         <div class="refWFTitle">相关子流程</div>
         <el-table :data="formWfList" stripe  style="width: 100%" size="medium" :show-header="false">
                <el-table-column
                    width="">
                     <template slot-scope="scope"><span class="refWFItem" @click="goRefWf(scope.row)">{{scope.row.wfName}}</span></template>
                </el-table-column>
                <el-table-column
                      width="100">
                     <template slot-scope="scope">{{scope.row.statusName}}</template>
                </el-table-column>
                <el-table-column
                      width="100">
                       <template slot-scope="scope">{{scope.row.initUser}}</template>
                </el-table-column>
                <el-table-column
                       width="200">
                        <template slot-scope="scope">{{scope.row.createDate}}</template>
                </el-table-column>
        </el-table>
  </div>
</template>
<script>

import {EcoUtil} from '@/components/util/main.js'
import {getWFViewOperateId} from '../../../service/service.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'

export default{
  name:'handleRefMainList',
  components:{
      
  },
  props:{
        formWfList:{
            type:Array,
            defulat:function(){
                return [];
            }
        }
       
  },
  data(){
        return {
          
        }
  },
  created(){
       
  },
  mounted(){
      
  },
  computed:{

  },
  methods: {
        goRefWf(item){
            let formView = 1;
            let _wfId = item.requestId;
            let _ccId = null;
            getWFViewOperateId(_wfId,formView,_ccId).then((response)=>{
                    if(response.data.status <= 99){
                            let operateId = response.data.operate_id;
                            let goPage = "/flowform/index.html#/wfViewDetail/"+item.requestId+"/"+operateId;

                            EcoUtil.getSysvm().showTopFormContent(item.requestId);
                            // window.open(goPage,'','height=800,width=830,status=yes,scrollbars=yes,resizable=yes');
                    }else{
                            EcoMessageBox.alert(response.data.msg);
                    }
            })
        }
  },
  watch: {

  }
}
</script>
<style scoped>

.handleRefMainListVue .refWFTitle{
    margin-top:15px;
    margin-left:10px;
    font-size: 14px;
    color:rgb(103, 106, 108);
}

.handleRefMainListVue .refWFItem{
    color:#1ba5fa;
    cursor:pointer;
}

</style>
