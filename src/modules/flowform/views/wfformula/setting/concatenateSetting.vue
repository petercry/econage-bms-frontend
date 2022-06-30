<template>

    <div class="concatenateParams" v-show="paramsObj.loaded1 && paramsObj.loaded2">
            <div class="itemVueName">CONCATENATE 参数设置</div>
            <div class="setting">
            <div class="ecoSettingBlock" v-for="(paramItem,idx) in paramsObj.paramsArray" :key="idx">

                <el-row class="ecoSettingDesc">
                        <el-col :span="20" class="title"><span>{{idx==0?'分隔符':'参数'+idx }}</span> </el-col>
                        <el-col :span="4"  class="del" ><span @click="delParams(idx)" v-if="idx > 0">删除</span><span v-else>&nbsp;</span></el-col>
                </el-row>

                <div>
                    <el-radio-group style="margin-bottom: 15px;" v-model="paramItem.type" @change="changeType(idx)">
                        <el-radio-button  label="1" >自定义</el-radio-button>
                        <el-radio-button  label="2" >表单数据</el-radio-button>
                        <el-radio-button  label="3" v-if="idx > 0">函数</el-radio-button>
                    </el-radio-group>
                </div>

                <div v-if="paramItem.type == 1">
                    <el-input v-model="paramItem.value" @input="changeValue(idx)"></el-input>
                </div>

                <div v-if="paramItem.type == 2">
                    <el-select  placeholder="请选择" v-model="paramItem.value" @change="changeSelect(idx)">
                            <el-option
                                v-for="item in formulaFormList"
                                :key="item.optionId"
                                :label="item.optionName"
                                :value="item.optionId">
                            </el-option>
                    </el-select>
                </div>

                <div v-if="paramItem.type == 3">
                    <el-select  placeholder="请选择" v-model="paramItem.value" @change="changeFunc(idx)">
                            <el-option
                                v-for="item in funcList"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                    </el-select>    
                </div>
            </div>

             <el-divider></el-divider>
             <div class="ecoSettingBlock">
                <el-row class="ecoSettingDesc">
                    <el-col :span="24" class="title">
                         <el-button  @click="addParams" class="plainBtn" style="width:100%;">添加参数</el-button>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>

import EcoUtil from '@/components/util/main';
import {mapState,mapMutations} from 'vuex'

export default{
    name:'concatenateSetting',
    components: {},
    data() {
        return {
            paramsObj:{
                paramsArray:[],
                type:'concatenate',
                loaded1:false,
                loaded2:false,
            },
            formulaFormList:[],
            loaded:false,
            changed:false,
            funcList:[],
        };
    },

    computed: {
        ...mapState([
            'wfFormulateSetting',
            'wfFormulateFormData'
        ]),
    },
    created(){
        this.funcList = [];
        this.funcList.push({name:'CONCATENATE',value:'CONCATENATE'});
        this.funcList.push({name:'CALCULATE',value:'CALCULATE'});
        this.funcList.push({name:'SUM',value:'SUM'});
        this.funcList.push({name:'RMBUPPER',value:'RMBUPPER'});
        this.funcList.push({name:'DAYS',value:'DAYS'});
        this.funcList.push({name:'HOURS',value:'HOURS'});
        this.funcList.push({name:'YEARS',value:'YEARS'});
        this.funcList.push({name:'DATEDELTA',value:'DATEDELTA'});
        this.funcList.push({name:'MID',value:'MID'});
        this.funcList.push({name:'TONUMBER',value:'TONUMBER'});
        this.funcList.push({name:'VAL',value:'VAL'});
        this.funcList.push({name:'COUNT',value:'COUNT'});
        this.funcList.push({name:'MAX',value:'MAX'});
        this.funcList.push({name:'MIN',value:'MIN'});
        this.funcList.push({name:'INDX',value:'INDX'});
        this.funcList.push({name:'GRIDINDX',value:'GRIDINDX'});

        this.getFormulaLoadFunc();
    },

    methods: {
        ...mapMutations([
            'SET_FORMULA_SETTING',
            'SET_FORMULA_SETTING_CHANGE'
        ]),

        init(){

            this.paramsObj.loaded1 = false;
            this.paramsObj.loaded2 = false;
          
            let _paramsObj = EcoUtil.objDeepCopy(this.wfFormulateSetting[this.$route.params.uuid]);
            this.$set(this.paramsObj,'paramsArray',(_paramsObj && _paramsObj.paramsArray)? _paramsObj.paramsArray:[{name:null,value:null,type:1},{name:null,value:null,type:1}]);
          
            this.paramsObj.loaded1 = true;
            this.paramsObj.loaded2 = true;
        },

        getFormulaLoadFunc(){
            (this.wfFormulateFormData).forEach((item)=>{
                if(item.mapType == 1){
                    for(let i = 0;i< item.deriveItems.length ;i++){
                        if(item.deriveItems[i].deriveItems && item.deriveItems[i].deriveItems.length > 0){
                            for(let j = 0;j<item.deriveItems[i].deriveItems.length;j++){
                                this.formulaFormList.push({optionId:item.deriveItems[i].deriveItems[j].optionId ,optionName:item.deriveItems[i].optionName+'（'+item.deriveItems[i].deriveItems[j].optionName+'）'});
                                // this.formulaFormList.push(item.deriveItems[i].deriveItems[j]);
                            }
                        }else{
                            this.formulaFormList.push(item.deriveItems[i]);
                        }
                    }

                    // this.formulaFormList = item.deriveItems;
                }
                this.init();
            })
        },

        addParams(){
            this.paramsObj.paramsArray.push({name:null,value:null,type:1})
        },

        delParams(idx){
            this.paramsObj.paramsArray.splice(idx,1);
        },

        changeValue(idx){
            this.paramsObj.paramsArray[idx].name = this.paramsObj.paramsArray[idx].value;        
        },

        changeSelect(idx){
            let _name = null;
            for(let i = 0;i<this.formulaFormList.length;i++){
                if(this.formulaFormList[i].optionId == this.paramsObj.paramsArray[idx].value){
                    _name = this.formulaFormList[i].optionName;
                    break;
                }
            }

            this.paramsObj.paramsArray[idx].name = _name;    
        },

        changeType(idx){
            this.paramsObj.paramsArray[idx].value = null;
            this.paramsObj.paramsArray[idx].name = null;
        },

        changeFunc(idx){
            let _name = null;
            for(let i = 0;i<this.funcList.length;i++){
                    if(this.funcList[i].value == this.paramsObj.paramsArray[idx].value){
                        _name = this.funcList[i].name;
                        break;
                    }
            }
            this.paramsObj.paramsArray[idx].name = _name;    
        },


        onEmitHandle(action,emitConfig){
                if(emitConfig){
                    let obj = {};
                    obj.key = this.$route.params.uuid;
                    obj.value = EcoUtil.objDeepCopy(this.paramsObj);
                    this.SET_FORMULA_SETTING(obj);
                }

                let actionObj = {};
                actionObj.uuid = this.$route.params.uuid;
                actionObj.action = action;
                actionObj.time = new Date().getTime();
                this.SET_FORMULA_SETTING_CHANGE(actionObj); //设置操作
        }
      

    },
    watch: {
        '$route' (to, from) {
            if(this.changed){
                // this.onEmitHandle('saveUpdateConfig',true);
            }
            this.changed = false;
            this.loaded = false;
            this.paramsObj.loaded1 = false;
            this.paramsObj.loaded2 = false;
            this.init();
        },

        paramsObj: {
            handler(newValue, oldValue) {
                
                if(newValue.loaded1 && newValue.loaded2){  
                    if(this.loaded){
                        this.changed = true;
                        this.onEmitHandle('changeConfig',true);
                    }else{
                        this.loaded = true;
                    }
                }
            },
            deep: true,
            immediate:true,
        }
    }
}

</script>
<style scope>


.concatenateParams .setting{
    margin:10px 10px 50px 20px;
}

.concatenateParams .itemVueName{
    Font-weight: bold;
    padding: 0 16px 0px 20px;
    height: 48px;
    line-height: 48px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    border-bottom: 1px solid #e8e8e8;
}

.concatenateParams .ecoSettingBlock{
    margin-bottom:10px;
}

.concatenateParams .ecoSettingDesc .title{
    font-size: 14px;
    color: #606266;
    height: 32px;
    line-height: 32px;
    font-weight: bold;
    text-align: left;
}
.concatenateParams .ecoSettingDesc .del{
    font-size: 12px;
    color: #f56c6c;
    height: 32px;
    line-height: 32px;
    font-weight: bold;
    text-align: right;
    cursor: pointer;
}


.concatenateParams .ecoSettingDesc .note{
    font-size: 14px;
    height: 32px;
    line-height: 32px;
    color: #8b8b8b;
    font-weight: normal;
    text-align: right;
}


.concatenateParams .funcItem{
    padding: 0 16px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    position: relative;
}

.concatenateParams .funcItem:hover{
    background-color:rgb(233,250,255);
}

.concatenateParams .plainBtn{
    border-color: #409eff;
    color: #409eff;
    font-size: 14px;
    margin-right:10px;
}

</style>
