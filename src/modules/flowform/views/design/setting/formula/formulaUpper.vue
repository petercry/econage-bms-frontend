<template>
    <div class="pageUpper">
         
         <div class="ecoSettingBlock">
                <div class="ecoSettingDesc"><span class="title">公式设置</span></div>
                <div>
                    <el-select v-model="itemId" filterable placeholder="请选择">
                                    <el-option
                                        v-for="item in itemsList"
                                        :key="item.itemId"
                                        :label="item.titleName"
                                        :value="String(item.itemId)">
                                    </el-option>
                    </el-select>
                </div>
        </div>
      
         
    </div>
</template>
<script>
import {EcoUtil} from '@/components/util/main.js'

export default{
  name:'pageUpper',
  components:{

  },
  data(){
        return {
            itemId:null,
           
        }
  },
  props:{
        itemsList:{
            type:Array,
        },
  },
  created(){
          
  },
  methods: {

      initData(requestList){
            if(requestList && requestList.length > 0){
                this.itemId = requestList[0];
            }
      },

      checkData(){
            let _checked = true;
            let _msg = '';
            if(this.itemId == null){
                 _checked = false;
                _msg = '组件 必须选择';
               
             }
            return {success:_checked,msg:_msg}
      },
    
      getData(){
            let formula_str = "UPPER{["+this.itemId+"]}";
            return formula_str;
      },
    
  }
}

</script>
<style scoped>
.pageUpper .ecoSettingBlock{
    margin-bottom:10px;
}


.pageUpper .ecoSettingDesc{
    height: 32px;
    line-height: 32px;
    color: #262626;
    font-weight: bold;
    font-size: 14px;
}

.pageUpper .requestTable{
    width:100%;
    font-size: 14px;
}

.pageUpper .requestTable th{
    font-size: 14px;
    text-align: left;
    padding:10px 5px;
    background-color: #f5f5f5;
}

.pageUpper .requestTable td{
    font-size: 14px;
    text-align: left;
    padding:10px 0px 5px 0px;
}

.pageUpper .optionsDiv{
    text-align: right;
}

</style>



