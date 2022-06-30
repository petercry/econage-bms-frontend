<template>
    <div class="designFormulaSetting">

        <eco-content top="0px" height="40px" type="tool">
            <el-row style="padding:5px 10px 5px 10px">
                <el-col :span="24" >
                        <eco-button type="tool" :leftSplit="false"  @click.native="save"><i class="icon iconfont iconqueding"></i>&nbsp;保存</eco-button>
                        <eco-button type="tool"  @click.native="cancel"><i class="icon iconfont iconshanchudelete30"></i>&nbsp;取消</eco-button>
                </el-col>
            </el-row>  
        </eco-content>

        <eco-content top="40px" bottom="0px" >
           <div style="margin:20px 10px;">
                <el-form  label-width="80px">
                    <el-form-item label="公式类型">
                            <el-select v-model="formulaType"  placeholder="请选择">
                                <el-option
                                        v-for="item in formulaList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                    </el-form-item>
                </el-form>
         
            <el-divider></el-divider>
            <formulaFourOperations v-show="formulaType==1" :itemsList="itemsList" ref="page1"></formulaFourOperations>
            <formulaPage v-show="formulaType==2" :itemsList="itemsList" ref="page2"></formulaPage>
            <formulaUpper  v-show="formulaType==4" :itemsList="itemsList" ref="page4"></formulaUpper>
            <formulaAjax v-show="formulaType == 5"  :itemsList="itemsList" ref="page5"></formulaAjax>
           </div>
        </eco-content>
            
        
    </div>
</template>
<script>

import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoButton from '@/components/button/ecoButton.vue'

import formulaFourOperations from './formulaFourOperations.vue'
import formulaPage from "./formulaPage.vue"
import formulaAjax from './formulaAjax.vue'
import formulaUpper from './formulaUpper.vue'
import {EcoUtil} from '@/components/util/main.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'

export default{
  name:'designFormulaSetting',
  components:{
        ecoContent,
        ecoButton,
        formulaFourOperations,
        formulaPage,
        formulaUpper,
        formulaAjax,
  },
  data(){
    return {

        formulaList:[],
        formulaType:1,
        itemsList:[],
        initType1RequestList:[],
        initType2Link1:null,
        initType2Link2:null,
        initType2RequestList:[],
        initType2ResponseList:[],
        initType4RequestList:[],
        initType5Api:null,
        initType5RequestList:[],
        initType5ResponseList:[]
     
    }
  },
  created(){
            
  },
  mounted(){
            this.formulaList.push({value:1,label:'四则运算'});
            this.formulaList.push({value:2,label:'弹出窗口'});
            this.formulaList.push({value:4,label:'大写金额'});
            this.formulaList.push({value:5,label:'异步请求'});
            this.formulaList.push({value:6,label:'模糊搜索'});

            let _storeKey = this.$route.params.storeKey;
            if(_storeKey){
               try{
                    let _data = EcoUtil.getSysvm().getTempStore(_storeKey);
                    this.itemsList = _data.formItems;
                    this.init(_data.formula);
                    
                }catch(e){
                    console.log(e);
                }
            }
  },

  methods: {
      
      init(init_formula){
          if(init_formula && init_formula!=""){
                if(init_formula.indexOf("UPPER{")>=0){ //金额大写
                    this.formulaType = 4;
                    init_formula = init_formula.substring(init_formula.indexOf("UPPER{")+6,init_formula.indexOf("}"));
                    if(init_formula.indexOf("[")>=0){
                          init_formula = init_formula.substring(init_formula.indexOf("[")+1,init_formula.indexOf("]"));
                    }
                    this.initType4RequestList.push(init_formula);
                    this.$refs.page4.initData(this.initType4RequestList);
                }else if(init_formula.indexOf("PAGE{")>=0||init_formula.indexOf("DIALOG{")>=0){ //弹出窗口

                  this.formulaType  = 2;
                  if(init_formula.indexOf("PAGE{")>=0){
                      init_formula = init_formula.substring(init_formula.indexOf("PAGE{")+5,init_formula.indexOf("}"));
                  }else if(init_formula.indexOf("DIALOG{")>=0){
                      init_formula = init_formula.substring(init_formula.indexOf("DIALOG{")+7,init_formula.indexOf("}"));
                  }

                  let  config_list = init_formula.split(",");
                  this.initType2Link1 = config_list[0];
                  this.initType2Link2 = config_list[1];
                  let  page_param_out = config_list[2].split("-");
                  let  page_param_in = config_list[3].split("-");
                  this.setTableParamValue(this.initType2RequestList,page_param_out);
                  this.setTableParamValue(this.initType2ResponseList,page_param_in);

                  this.$refs.page2.initData(this.initType2Link1,this.initType2Link2, this.initType2RequestList,this.initType2ResponseList);
                
                }else if(init_formula.indexOf("AJAX{")>=0){
                
                      this.formulaType  = 5; //异步请求
                      init_formula = init_formula.substring(init_formula.indexOf("AJAX{")+5,init_formula.indexOf("}"));
                      let config_list = init_formula.split(",");
                      this.initType5Api = config_list[0];

                      let page_param_out = config_list[1].split("-");
                      let page_param_in = config_list[2].split("-");
                      
                      this.setTableParamValue(this.initType5RequestList, page_param_out);
                      this.setTableParamValue(this.initType5ResponseList, page_param_in);

                      this.$refs.page5.initData(this.initType5Api,this.initType5RequestList,this.initType5ResponseList);
                }else{  //四则运算
                      this.formulaType  = 1; 
                      while(init_formula.indexOf("[")>=0){
                          let ele_id_str = init_formula.substring(init_formula.indexOf("[")+1,init_formula.indexOf("]"));
                          let _item = {};
                          _item.itemId = ele_id_str;
                          if(init_formula.indexOf("]")==init_formula.length-1){ 
                              this.initType1RequestList.push(_item);
                              break;
                          }
                          let judge_str = init_formula.substring(init_formula.indexOf("]")+1,init_formula.indexOf("]")+2);
                          _item.operationId = judge_str;
                          init_formula = init_formula.substring(init_formula.indexOf("]")+2);
                          this.initType1RequestList.push(_item);
                    }

                     this.$refs.page1.initData(this.initType1RequestList);
                }
            }
      },


      setTableParamValue(list, page_param_out){
          if(page_param_out == "") return;
              for(var i=0;i<page_param_out.length;i++){
                  if(page_param_out[i].indexOf("(")>=0&&page_param_out[i].indexOf(")")>=0&&page_param_out[i].indexOf("*")>=0){
                      let param_pair = page_param_out[i].substring(page_param_out[i].indexOf("(")+1,page_param_out[i].indexOf(")"));
                    
                      let param_pair_name = param_pair.split("*")[0];
                      let param_pair_value = param_pair.split("*")[1];
                      if(param_pair_value.indexOf("[")>=0&&param_pair_value.indexOf("]")>=0){
                          param_pair_value = param_pair_value.substring(param_pair_value.indexOf("[")+1,param_pair_value.indexOf("]"));
                      }
                      list.push({itemId:param_pair_value,name:param_pair_name});
                  }else{
                      var param_pair_value = page_param_out[i];
                      if(param_pair_value.indexOf("[")>=0&&param_pair_value.indexOf("]")>=0){
                          param_pair_value = param_pair_value.substring(param_pair_value.indexOf("[")+1,param_pair_value.indexOf("]"));
                      }
                       list.push({itemId:param_pair_value,name:null});
                 }
            }
      },
      
      save(){
            let _check = this.$refs['page'+this.formulaType].checkData();
            if(!_check.success){
                 EcoMessageBox.alert(_check.msg,'提示');
                 return ;
            }

            let _data = this.$refs['page'+this.formulaType].getData();
            let doObj = {}
            doObj.action = 'formulaCallBack';
            doObj.data = {};
            doObj.data.formula = _data
            doObj.close = true;
            EcoUtil.getSysvm().callBackDialogFunc(doObj);
      },
      cancel(){
          EcoUtil.getSysvm().closeDialog();
      }
  }
}

</script>
<style scoped>
.designFormulaSetting{
  background-color: #fff;
  min-height: 400px;
  padding:20px;
  font-size: 12px;
}

.designFormulaSetting .ecoSettingBlock{
  margin-bottom:20px;
}

.designFormulaSetting .ecoSettingDesc .title{
    font-size: 14px;
    color: #606266;
    height: 32px;
    line-height: 32px;
    font-weight: bold;
    text-align: left;
}

.designFormulaSetting .ecoSettingDesc .note{
    font-size: 14px;
    height: 32px;
    line-height: 32px;
    color: #8b8b8b;
    font-weight: normal;
    text-align: right;
}

.designFormulaSetting .requestTable{
  width:100%;
  font-size: 14px;
}

.designFormulaSetting .requestTable th{
  font-size: 14px;
  text-align: left;
  padding:3px;
  background-color: #f5f5f5;
}

.designFormulaSetting .requestTable td{
    font-size: 14px;
    text-align: left;
    padding:10px 0px 5px 0px;
}

.designFormulaSetting .optionsDiv{
  text-align: right;
}
</style>



