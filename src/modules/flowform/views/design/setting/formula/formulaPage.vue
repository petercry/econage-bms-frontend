<template>
    <div class="formulaPage">

          <el-form  label-width="80px">
              <el-form-item label="链接1:">
                  <el-input v-model="link1" ></el-input>
              </el-form-item>

              <el-form-item label="链接2:">
                  <el-input v-model="link2" ></el-input>
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
                              <td style="text-align:center;"><i class="icon iconfont iconshanchudelete30 deleteIcon" @click="delRequestOptions(idx)"></i></td>
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
                                <td style="text-align:center;"><i class="icon iconfont iconshanchudelete30 deleteIcon"  @click="delResponseOptions(idx)" ></i></td>
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
  name:'formulaPage',
  components:{

  },
  data(){
    return {
        activeName: 'first',
        formulaList:[],
        link1:'',
        link2:'',
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

     initData(link1,link2,requestList,responseList){
            this.link1 = link1;
            this.link2 = link2;
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
            if(this.link1 == null || this.link1 == ''){
                return {success:false,msg:'链接1必须填写'}
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
            let formula_str = "PAGE{";
            formula_str += this.link1+","+this.link2;
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
.formulaPage .ecoSettingBlock{
    margin-bottom:10px;
}

.formulaPage .ecoSettingDesc{
    height: 32px;
    line-height: 32px;
    color: #262626;
    font-weight: bold;
    font-size: 14px;
}

.formulaPage .requestTable{
    width:100%;
    font-size: 14px;
}

.formulaPage .requestTable th{
    font-size: 14px;
    text-align: left;
    padding:10px 5px;
    background-color: #f5f5f5;
}

.formulaPage .requestTable td{
    font-size: 14px;
    text-align: left;
    padding:10px 0px 5px 0px;
}

.formulaPage .optionsDiv{
    text-align: right;
}

.formulaPage .deleteIcon{
    color:#f56c6c
}
</style>



