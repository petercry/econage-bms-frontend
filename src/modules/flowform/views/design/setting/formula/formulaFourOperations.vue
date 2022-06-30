<template>
    <div class="pageFourOperations">
         
         <div class="ecoSettingBlock">
                <div class="ecoSettingDesc"><span class="title">公式设置</span></div>
                <div></div>
        </div>

        <table  class="requestTable">
            <tr>
                 <th style="width:200px;">请求组件</th>
                 <th >四则运算</th>
                 <th style="width:50px;">操作</th>  
            </tr>

            <tr v-for="(item,idx) in requestList" :key="'tr'+idx">
                    <td>
                            <el-select v-model="item.itemId" filterable placeholder="请选择">
                                    <el-option
                                        v-for="modelItem in itemsList"
                                        :key="modelItem.itemId"
                                        :label="modelItem.titleName"
                                        :value="String(modelItem.itemId)">
                                    </el-option>
                            </el-select>
                    </td>
                    
                    <td>
                         <el-select v-model="item.operationId" filterable placeholder="请选择" v-show="(idx < (requestList.length-1))">
                                <el-option
                                    v-for="optionsItem in optionsList"
                                    :key="optionsItem.value"
                                    :label="optionsItem.label"
                                    :value="optionsItem.value"
                                >
                                </el-option>
                        </el-select>
                    </td>

                    <td style="text-align:center;">
                        <i class="icon iconfont iconshanchudelete30 deleteIcon" @click="delRequestOptions(idx)"></i>
                    </td>
            </tr>
        </table>

        <div style="margin-top:20px;" class="optionsDiv">
                <span><i class="icon iconfont iconjia pointerCalss" @click="addRequestOptions" title="添加" style="font-size:22px;color:#409eff"></i></span>
                <span><i class="icon iconfont iconjian pointerCalss" @click="delRequestOptionsLast" title="删除" style="font-size:22px;color:#f56c6c"></i></span>
        </div>
         
    </div>
</template>
<script>
import {EcoUtil} from '@/components/util/main.js'

export default{
  name:'pageFourOperations',
  components:{

  },
  data(){
        return {
            requestList:[],
            optionsList:[],
        }
  },
  props:{
        itemsList:{
            type:Array,
        },
  },
  created(){
            this.optionsList.push({value:'+',label:'+'});
            this.optionsList.push({value:'-',label:'-'});
            this.optionsList.push({value:'*',label:'*'});
            this.optionsList.push({value:'/',label:'/'});
  },
  methods: {

      initData(requestList){
            this.requestList = EcoUtil.objDeepCopy(requestList);
      },

      addRequestOptions(){
             let _item = {itemId:null,desc:null,operationId:'+'};
             if(this.itemsList && this.itemsList.length > 0){
                 _item.itemId = String(this.itemsList[0].itemId);
                 _item.desc = this.itemsList[0].titleName;
             }
             this.requestList.push(_item);
      },

      delRequestOptions(idx){
              this.requestList.splice(idx,1);
      },

      delRequestOptionsLast(){
         if(this.requestList.length > 0){
             this.requestList.splice(this.requestList.length-1,1);
         }
      },

      checkData(){
            let _checked = true;
            let _msg = '';
            for(let i = 0;i<this.requestList.length;i++){
               if(this.requestList[i].itemId == null){
                     _checked = false;
                    _msg = '请求组件 必须选择';
                    break;
                }
            }
            return {success:_checked,msg:_msg}
      },

      getData(){
            let formula_str = "";
            (this.requestList).forEach((item,idx)=>{
                 formula_str += "["+ item.itemId +"]"
                 if(idx != (this.requestList.length -1)){
                     formula_str+= item.operationId;
                 }
            })
            return formula_str;
      },
    
  }
}

</script>
<style scoped>
.pageFourOperations .ecoSettingBlock{
    margin-bottom:10px;
}


.pageFourOperations .ecoSettingDesc{
    height: 32px;
    line-height: 32px;
    color: #262626;
    font-weight: bold;
    font-size: 14px;
}

.pageFourOperations .requestTable{
    width:100%;
    font-size: 14px;
}

.pageFourOperations .requestTable th{
    font-size: 14px;
    text-align: left;
    padding:10px 5px;
    background-color: #f5f5f5;
}

.pageFourOperations .requestTable td{
    font-size: 14px;
    text-align: left;
    padding:10px 0px 5px 0px;
}

.pageFourOperations .optionsDiv{
    text-align: right;
}

.pageFourOperations .deleteIcon{
    color:#f56c6c
}

</style>



