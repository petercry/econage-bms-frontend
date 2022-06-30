<template>
    <div class="pageAjax">
          <el-form  label-width="80px">
                <el-form-item label="API链接:">
                        <el-input v-model="APILink" ></el-input>
                </el-form-item>
          </el-form>

          <div style="margin-top:20px;">
             <el-tabs v-model="activeName" type="card" size="mini">
                <el-tab-pane label="输入参数配置" name="first" >
                      <table  class="requestTable">
                          <tr><th style="width:200px;">请求组件</th><th>名称</th> <th style="width:50px;">操作</th>  </tr>
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
                              <td><el-input v-model="item.name"></el-input></td>
                              <td style="text-align:center;"><i class="icon iconfont iconshanchudelete30 pointerCalss" @click="delRequestOptions(idx)"></i></td>
                          </tr>
                      </table>

                      <div style="margin-top:20px;" class="optionsDiv">
                            <span><i class="icon iconfont iconjia pointerCalss" @click="addRequestOptions" title="添加" style="font-size:22px;color:#409eff"></i></span>
                            <span><i class="icon iconfont iconjian pointerCalss" @click="delRequestOptionsLast" title="删除" style="font-size:22px;color:#f56c6c"></i></span>
                      </div>

                    </el-tab-pane>
                    
                    <el-tab-pane label="赋值组件配置" name="second">
                        <table  class="requestTable">
                            <tr><th style="width:200px;">赋值组件</th> <th>名称</th> <th style="width:50px;">操作</th>  </tr>
                            <tr v-for="(item,idx) in responseList" :key="'tr'+idx">
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
                                <td><el-input v-model="item.name"></el-input></td>
                                <td style="text-align:center;"><i class="icon iconfont iconshanchudelete30 pointerCalss"  @click="delResponseOptions(idx)"></i></td>
                            </tr>
                        </table>

                        <div style="margin-top:20px;" class="optionsDiv">

                             <span><i class="icon iconfont iconjia pointerCalss" @click="addResponseOptions" title="添加" style="font-size:22px;color:#409eff"></i></span>
                             <span><i class="icon iconfont iconjian pointerCalss" @click="delResponseOptionsLast" title="删除" style="font-size:22px;color:#f56c6c"></i></span>
                           
                        </div>

                    </el-tab-pane>
                </el-tabs>
            </div>
    </div>
</template>
<script>

import {EcoUtil} from '@/components/util/main.js'
export default{
  name:'pageAjax',
  components:{


  },
  data(){
    return {
        activeName: 'first',
        APILink:'',
        requestList:[],
        responseList:[],
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
      initData(APILink,requestList,responseList){
            this.APILink = APILink;
            this.requestList = EcoUtil.objDeepCopy(requestList);
            this.responseList = EcoUtil.objDeepCopy(responseList);
      },

      addRequestOptions(){
             let _item = {itemId:null,name:null};
             if(this.itemsList && this.itemsList.length > 0){
                 _item.itemId = String(this.itemsList[0].itemId);
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

      addResponseOptions(){
          let _item = {itemId:null,name:null};
          if(this.itemsList && this.itemsList.length > 0){
                 _item.itemId = String(this.itemsList[0].itemId);
          }
          this.responseList.push(_item);
      },
      delResponseOptions(idx){
          this.responseList.splice(idx,1);
      },
      delResponseOptionsLast(){
          if(this.responseList.length > 0){
               this.responseList.splice(this.responseList.length-1,1);
          }
      },

     checkData(){
            let _checked = true;
            let _msg = '';
            if(this.APILink == null || this.APILink == ''){
                return {success:false,msg:'API链接 必须填写'}
            }

            for(let i = 0;i<this.requestList.length;i++){
                if( this.requestList[i].name == null || this.requestList[i].name == ''){
                    _checked = false;
                    _msg = '输入参数配置 名称必须填写';
                    break;
                }
            }
            for(let i = 0;i<this.responseList.length;i++){
                if( this.responseList[i].name == null || this.responseList[i].name == ''){
                    _checked = false;
                    _msg = '赋值参数配置 名称必须填写';
                    break;
                }
            }
            return {success:_checked,msg:_msg}
      },


      getData(){
            let formula_str = "AJAX{";
            formula_str += this.APILink;
            formula_str += "," + this.saveTableParamValue(this.requestList);
            formula_str += "," + this.saveTableParamValue(this.responseList);
            formula_str += "}";
            return formula_str;
      },

      saveTableParamValue(list){
            let paramArray = [];
            (list).forEach((item,idx)=>{
                if(item.name && item.name !=""){
                    paramArray.push("("+item.name+"*["+item.itemId+"])");
                }else{
                     paramArray.push("["+item.itemId+"]");
                }
            })
            return paramArray.join("-");
      },
      
  }
}

</script>
<style scoped>
.pageAjax .ecoSettingBlock{
    margin-bottom:10px;
}

.pageAjax .ecoSettingDesc{
    height: 32px;
    line-height: 32px;
    color: #262626;
    font-weight: bold;
    font-size: 14px;
}

.pageAjax .requestTable{
    width:100%;
    font-size: 14px;
}

.pageAjax .requestTable th{
    font-size: 14px;
    text-align: left;
    padding:10px 5px;
    background-color: #f5f5f5;
}

.pageAjax .requestTable td{
    font-size: 14px;
    text-align: left;
    padding:10px 0px 5px 0px;
}

.pageAjax .optionsDiv{
    text-align: right;
}

</style>



