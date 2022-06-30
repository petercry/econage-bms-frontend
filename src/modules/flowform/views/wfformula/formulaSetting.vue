<template>
  <div class="formulaSetting">
        <div class="lay-left">
            <div >
                <div class="funcTitle">函数</div>
                <div v-for="(item,idx) in formulaFuncList" :key="idx" class="funcItem" @click="clickFormulaFunc(item)">
                    <span>{{item.name}}</span>
                    <span class="funcTip">
                          <el-popover
                                placement="left"
                                width="370"
                                trigger="hover"
                            >
                            <component :is="item.name.toLowerCase()+'Tip'"></component>
                            <span slot="reference"><i class="icon iconfont iconbangzhu-kong pointerClass"></i></span>
                        </el-popover>
                    </span>
                </div>
            </div>
        </div>

        <div class="lay-center">
            <div class="viewTitle">&nbsp;{{itemName}} = </div>
            <div class="viewFormula">
                <div >
                   
                    <component :is="item.name.toLowerCase()" 
                        v-for="(item,idx) in formulaSetDataList" :key="idx"
                        :extData="extData"
                        :mItem="item"
                        :paramsMap="paramsMap"  
                        @emitParams="emitParams"
                        @delFunc="delFunc"
                        :ref="'m'+item.uuid" >
                    </component>
                  
                </div>
            </div>
        </div>


        <div class="lay-right">
            <router-view v-show="rightContent == 'routerView'"></router-view>
        </div>

        <div class="lay-bottom">
                <el-row  class="formula-div">
                    <el-col :span="20">
                        <span class="formula-desc">计算符号：</span>
                        <span class="formula-btn-com" @click="clickSymbolFunc(1)">+</span>
                        <span class="formula-btn-com" @click="clickSymbolFunc(2)">-</span>
                        <span class="formula-btn-com" @click="clickSymbolFunc(3)">x</span>
                        <span class="formula-btn-com" @click="clickSymbolFunc(4)">÷</span>
                        <span class="formula-btn-com" style="line-height:32px" @click="clickSymbolFunc(5)">(</span>
                        <span class="formula-btn-com" style="line-height:32px" @click="clickSymbolFunc(6)">)</span>
                    </el-col>
                    <el-col :span="4" style="text-align:right;">
                        <span @click="deleteAll"><i class="icon iconfont icondelete1 ecoDelIcon"></i></span>
                    </el-col>
                </el-row>

                <div style="text-align:right;padding-right:10px;margin-top:5px;">
                    <el-button type="primary" @click="save">确定</el-button>
                </div>
            
        </div>

  </div>
</template>
<script>

import ecoContent from "@/components/pageAb/ecoContent.vue"
import {getFormulaLoad,loadFormulaItem,createFormula,updateFormula,deleteFormula} from '../../service/service'
import {mapState,mapMutations} from 'vuex'
import EcoUtil from '@/components/util/main'
import {Loading } from 'element-ui';

import concatenate from "./func/concatenate.vue"
import concatenateTip from "./tip/concatenateTip.vue"
import calculate from "./func/calculate.vue"
import calculateTip from "./tip/calculateTip.vue"
import sum from "./func/sum.vue"
import sumTip from "./tip/sumTip.vue"
import rmbupper from "./func/rmbupper.vue"
import rmbupperTip from "./tip/rmbupperTip.vue"
import days from "./func/days.vue"
import daysTip from "./tip/daysTip.vue"
import hours from "./func/hours.vue"
import hoursTip from "./tip/hoursTip.vue"
import years from "./func/years.vue"
import yearsTip from "./tip/yearsTip.vue"
import datedelta from "./func/datedelta.vue"
import datedeltaTip from "./tip/datedeltaTip.vue"
import mid from "./func/mid.vue"
import midTip from "./tip/midTip.vue"
import tonumber from "./func/tonumber.vue"
import tonumberTip from "./tip/tonumberTip.vue"
import count from "./func/count.vue"
import countTip from "./tip/countTip.vue"
import max from "./func/max.vue"
import maxTip from "./tip/maxTip.vue"
import min from "./func/min.vue"
import minTip from "./tip/minTip.vue"
import indx from "./func/indx.vue"
import indxTip from "./tip/indxTip.vue"
import gridindx from "./func/gridindx.vue"
import gridindxTip from "./tip/gridindxTip.vue"

import opsymbol from "./func/opsymbol.vue"

export default {
  components: {
        ecoContent,
        concatenate,
        concatenateTip,
        calculate,
        calculateTip,
        sum,
        sumTip,
        rmbupper,
        rmbupperTip,
        days,
        daysTip,
        hours,
        hoursTip,
        years,
        yearsTip,
        datedelta,
        datedeltaTip,
        mid,
        midTip,
        tonumber,
        tonumberTip,
        count,
        countTip,
        max,
        maxTip,
        min,
        minTip,
        indx,
        indxTip,
        gridindx,
        gridindxTip,
        opsymbol
  },
  props: {
   
  },
  data() {
        return {
            wfTemplateId:null,
            funcDataId:null,
            itemName:null,
            formulaFuncList:[], //公式数据
            formulaFormList:[], //表单数据
            formulaSetDataList:[],
            paramsMap:{},
            clickFuncUUIDArray:[],
            rightContent:'funcView',
            extData:{}

        };
  },
 
  created() {

        let _storeKey = this.$route.params.storeKey;
        if( _storeKey){
            try{
                let _storeData = EcoUtil.objDeepCopy(EcoUtil.getSysvm().getTempStore(_storeKey));
                EcoUtil.getSysvm().deleteTempStore(_storeKey);
               
                this.wfTemplateId = _storeData.wfTemplateId;//流程模板id
                this.funcDataId = _storeData.funcDataId;//公式id
                this.itemName = _storeData.itemName;
                this.extData.itemParentId = _storeData.itemParentId;
          
            }catch(e){}
        }

        this.getFormulaLoadFunc();
        if(this.funcDataId  && this.funcDataId!= null){
            this.loadFormulaItemFunc();
        }
  },
  mounted() {
  
  },
  computed: {
        ...mapState([
            'wfFormulateSetting',
            'wfFormulateSettingChange',
        ]),
  },
  methods: {
        ...mapMutations([
            'SET_FORMULA_SETTING',
            'SET_FORMULA_FORM_DATA',
            'DELETA_ALL_FORMULA_SETTING'
        ]),

        getFormulaLoadFunc(){
            getFormulaLoad(this.wfTemplateId).then((response)=>{
                this.formulaFuncList = response.data.remap.func_list;
                this.formulaFormList = response.data.remap.data_items;
               
                this.SET_FORMULA_FORM_DATA(this.formulaFormList);
            })
        },
        
        loadFormulaItemFunc(){
            loadFormulaItem(this.funcDataId).then((response)=>{
                let _func = response.data.remap.item.func;
                if(_func && _func !=''){
                    try{
                       let _funcObj = JSON.parse(_func);
                       this.paramsMap = EcoUtil.objDeepCopy(_funcObj.paramsMap);
                       this.formulaSetDataList = EcoUtil.objDeepCopy(_funcObj.formulaSetDataList);

                       for(let _key in this.paramsMap){
                            let obj = {};
                            obj.key = _key;
                            obj.value = EcoUtil.objDeepCopy(this.paramsMap[_key]);
                            this.SET_FORMULA_SETTING(obj);
                       }
                    }catch(e){
                        console.log(e);
                    }
                }
            })
        },

        addFunc(){
            this.rightContent = 'funcView';
        },

        //添加函数
        clickFormulaFunc(item){
            let _item = {};
            _item.name = item.name;
            _item.uuid = EcoUtil.getUID();

            let _idx =  this.getClickFormulaSetDataListIndex();
            if(_idx ==-1 || (_idx == (this.formulaSetDataList.length -1))){ //插入到最后
                this.formulaSetDataList.push(_item);
            }else{
                this.formulaSetDataList.splice(_idx+1,0,_item);
            }

            let _data = {};
            _data.uuidArray = [_item.uuid];
            _data.paramsName = 'formula'+((_item.name.toLowerCase()).charAt(0).toUpperCase() + (_item.name.toLowerCase()).slice(1))  +'Setting';
            this.emitParams(_data);

        },

        //添加符号
        clickSymbolFunc(type){
            let _item = {};
            _item.name = 'opsymbol'; //符号
            _item.type = type;
            _item.uuid = EcoUtil.getUID();

            let _idx =  this.getClickFormulaSetDataListIndex();
            if(_idx ==-1 || (_idx == (this.formulaSetDataList.length -1))){ //插入到最后
                this.formulaSetDataList.push(_item);
            }else{
                this.formulaSetDataList.splice(_idx+1,0,_item);
            }
            this.$router.push({name:'formulaOpsymbolSetting',params:{uuid:_item.uuid}});
        },

        //获取当前点击位置
        getClickFormulaSetDataListIndex(){
            let _idx = -1;
            let _clickUUID = this.$route.params.uuid;
            if(_clickUUID){
                for(let i = 0;i<this.formulaSetDataList.length;i++){
                    if(_clickUUID == this.formulaSetDataList[i].uuid){
                        _idx = i;
                        break;
                    }
                }
            }
            return _idx;
        },

        emitParams(data){
            this.rightContent = 'routerView';
            this.clickFuncUUIDArray = EcoUtil.objDeepCopy(data.uuidArray);
            this.$router.push({name:data.paramsName,params:{uuid:data.uuidArray[0]}});
        },

        delFunc(data){
      
            if(data.uuidArray.length == 1){ //最外层
                let _idx = 0;
                for(var i= 0;i<this.formulaSetDataList.length;i++){
                    if(this.formulaSetDataList[i].uuid == data.uuidArray[0]){
                        _idx = i;
                        this.formulaSetDataList.splice(i,1);
                        break;
                    }
                }

                delete this.paramsMap[data.uuidArray[0]];
                if(this.formulaSetDataList.length > 0){ //还有数据
                    if(_idx >= this.formulaSetDataList.length){
                        _idx = _idx-1;
                    }
                    let _data = {};
                    _data.uuidArray = [this.formulaSetDataList[_idx].uuid];
                    _data.paramsName = 'formula'+((this.formulaSetDataList[_idx].name.toLowerCase()).charAt(0).toUpperCase() + (this.formulaSetDataList[_idx].name.toLowerCase()).slice(1))  +'Setting';
                    this.emitParams(_data);
                   
                }else{
                    this.$router.push({name:'formulaSetting'})
                }
               
            
            }else{ //里层嵌套的公式
                    delete this.paramsMap[data.uuidArray[0]]; //删除关联
                    if(this.paramsMap[data.uuidArray[1]].paramsArray){ //删除父节点的关联
                        for(let j = 0;j<this.paramsMap[data.uuidArray[1]].paramsArray.length;j++){
                            if(this.paramsMap[data.uuidArray[1]].paramsArray[j].uuid == data.uuidArray[0]){
                                this.paramsMap[data.uuidArray[1]].paramsArray[j].name = null;
                                this.paramsMap[data.uuidArray[1]].paramsArray[j].value = null;
                                this.paramsMap[data.uuidArray[1]].paramsArray[j].type = 1;
                                delete  this.paramsMap[data.uuidArray[1]].paramsArray[j].uuid ;


                                let _obj = {};
                                _obj.key = data.uuidArray[1];
                                _obj.value = EcoUtil.objDeepCopy(this.paramsMap[data.uuidArray[1]]);
                                this.SET_FORMULA_SETTING(_obj);
                                
                            }
                        }
                    }
                  
                    let _data = {};
                    _data.uuidArray = [data.uuidArray[1]];
                    _data.paramsName = 'formula'+((this.paramsMap[data.uuidArray[1]].type.toLowerCase()).charAt(0).toUpperCase() + (this.paramsMap[data.uuidArray[1]].type.toLowerCase()).slice(1))  +'Setting';
                    this.emitParams(_data);
            }
           
        },

        deleteAll(){
            this.$router.push({name:'formulaSetting'});
            this.formulaSetDataList = [];
            this.paramsMap = {};
            this.DELETA_ALL_FORMULA_SETTING();


        },

        getRefComponentByRefName(refName){
                if(this.$refs[refName]){
                    if(this.$refs[refName][0]){
                        return this.$refs[refName][0];
                    }else{
                        return this.$refs[refName];
                    }
                }
                return null;
        },


        save(){

            let loadingInstance = Loading.service({ fullscreen: true,text:'正在保存...'});

            let _relItemsArray = [];
            let _funcUUIDArray = [];
            let _express = '';

            for(let i = 0;i< this.formulaSetDataList.length;i++){
                this.getRefComponentByRefName('m'+this.formulaSetDataList[i].uuid).getRefInfo(_relItemsArray,_funcUUIDArray);
                _express += (this.getRefComponentByRefName('m'+this.formulaSetDataList[i].uuid).getRefValue());
            }

            let _saveFuncObj = {};
            let _saveParamsMap = {};
            for(let i  = 0;i< _funcUUIDArray.length;i++){
                _saveParamsMap[_funcUUIDArray[i]] = EcoUtil.objDeepCopy(this.paramsMap[_funcUUIDArray[i]]);
            }

            _saveFuncObj.paramsMap = _saveParamsMap;
            _saveFuncObj.formulaSetDataList = EcoUtil.objDeepCopy(this.formulaSetDataList);
         

            let _saveData = {};
            _saveData.wf_id = this.wfTemplateId; //流程id
            _saveData.name = this.itemName; //公式名称
            _saveData.rel_items = _relItemsArray.join(",");
            _saveData.express = _express;
            _saveData.func = JSON.stringify(_saveFuncObj);
            _saveData.funcDataId = this.funcDataId;



         

            if(_saveData.funcDataId == "" || _saveData.funcDataId == null){
                    createFormula(_saveData).then((response)=>{
                            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                                loadingInstance.close();
                            });
                            this.funcDataId = response.data.remap.item.id;
                            this.callBack();
                    })
            }else{
                if(_saveData.express == ''){ //删除
                     deleteFormula(_saveData.funcDataId).then((response)=>{
                        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                            loadingInstance.close();
                        });
                        this.funcDataId = null;
                        this.callBack();
                     })
                }else{
                    updateFormula(_saveData).then((response)=>{
                        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                            loadingInstance.close();
                        });
                        this.callBack();
                    })
                }
            }
        },

        callBack(){
                let doObj = {}
                doObj.action = 'formulaSettingV2Callback';
                doObj.data = {};
                doObj.data.funcDataId =  this.funcDataId;
                doObj.close = true;
                EcoUtil.getSysvm().callBackDialogFunc(doObj);
        },

        watchConfigAction(obj){
            if(obj.action == 'changeConfig'){
                this.$set(this.paramsMap,obj.uuid,EcoUtil.objDeepCopy(this.wfFormulateSetting[obj.uuid]));
            }
        }
  },

   watch:{
       'wfFormulateSettingChange'(newvalue,oldvalue){ //监听设置 里面发生的变化
            this.watchConfigAction(newvalue);
        } 
   }
};
</script>
<style>
.funcTip .funcTip-title{
    padding-bottom: 16px;
    border-bottom: 1px solid #e8e8e8;
}

.funcTip .funcTip-text-color{
    color: #fa8e1b;
}

.funcTip .funcTip-name{
    padding-top: 16px;
}

.ecoDatePick .el-time-panel{
    width:120px;
}

.formulaSetting .clickActive{
    background-color: #e7f2f7;
}

.formulaSetting .formulaFuncItem{
    line-height: 30px;
    position: relative;
    padding-top:5px;
    padding-bottom:5px;
}

</style>
<style scoped >

.formulaSetting  .lay-left{
    position:absolute;
    left:0px;
    width:200px;
    top:0px;
    bottom:0px;
    background-color: #fff;
    border-right:1px solid #e8e8e8;
    overflow: auto;
}

.formulaSetting  .lay-center{
    position:absolute;
    left:201px;
    right:250px;
    top:0px;
    bottom:100px;
    background-color: #fff;
    border-right:1px solid #e8e8e8;
    padding-left:20px;
    padding-right:20px;
}

.formulaSetting .lay-right{
    position:absolute;
    width:250px;
    right:0px;
    top:0px;
    bottom:0px;
    background-color: #fff;
    overflow: auto;
}

.formulaSetting .lay-bottom{
    position:absolute;
    left:201px;
    right:250px;
    bottom:0px;
    height:100px;
    background-color: #fff;
    border-right:1px solid #e8e8e8;
    border-top:1px solid #e8e8e8;
}

.formulaSetting .funcTitle{
    padding: 18px 16px;
    font-size: 14px;
    border-bottom:1px solid #e8e8e8;
}

.formulaSetting .funcTip{
    position: absolute;
    right:10px;
}


.formulaSetting .funcItem{
    padding: 0 16px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    position: relative;
}

.formulaSetting .funcItem:hover{
    background-color:rgb(233,250,255);
}


.formulaSetting .viewTitle{
    font-size: 20px;
    color: #262626;
    padding: 12px 0 12px 24px;
}

.formulaSetting .viewFormula{
    margin-left:20px;
}



.formulaSetting .viewFormula .needSet{
    color:#999;
    cursor: pointer;
}


.formulaSetting .formula-div{
    background-color: #fafafa;
    height:48px;
    line-height:48px;
}

.formulaSetting .formula-desc{
    padding:0 16px 0 24px;
    color:rgba(0,0,0,0.65)
}

.formulaSetting .formula-btn-com{
    display: inline-block;
    width: 32px;
    height: 32px;
    margin-right: 16px;
    border-radius: 2px;
    font-size: 24px;
    color: #fff;
    background: #1ba5fa;
    line-height: 24px;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
}

.formulaSetting .ecoDelIcon{
    margin-right:10px;
    font-size: 20px;
    color:red;
    cursor: pointer;
}
</style>
