<template>

    <div class="countParams" v-show="paramsObj.loaded1 && paramsObj.loaded2">
            <div class="itemVueName">COUNT 参数设置</div>
            <div class="setting">
            <div class="ecoSettingBlock" v-for="(paramItem,idx) in paramsObj.paramsArray" :key="idx">

                <el-row class="ecoSettingDesc">
                        <el-col :span="24" class="title"><span>{{'参数'}}</span> </el-col>
                </el-row>

                <div>
                    <el-radio-group style="margin-bottom: 15px;" v-model="paramItem.type" @change="changeType(idx)">
                        <el-radio-button  label="1" v-if="false">自定义</el-radio-button>
                        <el-radio-button  label="2" >表单数据</el-radio-button>
                        <el-radio-button  label="3" >函数</el-radio-button>
                    </el-radio-group>
                </div>

                <div v-if="paramItem.type == 1">
                      <el-input v-model="paramItem.value" @input="changeValue(idx)"></el-input>
                </div>

                <div v-if="paramItem.type == 2">
                    <el-select  placeholder="请选择" v-model="paramItem.value" @change="changeSelect(idx)">
                            <el-option
                                v-if="item.modelType == 'GRID'"
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
           
        </div>
    </div>
</template>

<script>

import EcoUtil from '@/components/util/main';
import {mapState,mapMutations} from 'vuex'

export default{
    name:'countSetting',
    components: {},
    data() {
        return {
            paramsObj:{
                paramsArray:[],
                type:'count',
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
            this.$set(this.paramsObj,'paramsArray',(_paramsObj && _paramsObj.paramsArray)? _paramsObj.paramsArray:[{name:null,value:null,type:2}]);
          
            this.paramsObj.loaded1 = true;
            this.paramsObj.loaded2 = true;
        },

        getFormulaLoadFunc(){
            (this.wfFormulateFormData).forEach((item)=>{
                if(item.mapType == 1){
                    this.formulaFormList = item.deriveItems;
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

        onInputChange(val,idx){
            if(EcoUtil.isNumber(val,0)){
                let _re = true;
                if(String(val).indexOf('.')>-1){
                    let _length = (val.substring(String(val),String(val).indexOf('.')+1)).length;
                    if(_length > 3){
                        _re = false;
                    }
                }
                
                if(_re){
                    this.paramsObj.paramsArray[idx].value = val;
                    this.paramsObj.paramsArray[idx].name = val;
                }
            }
        },

        onInputKeyPress(event){
            if(event.keyCode < 45 || event.keyCode > 57){
                event.returnValue = false; 
            }else{
                
            }              
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


.countParams .setting{
    margin:10px 10px 50px 20px;
}

.countParams .itemVueName{
    Font-weight: bold;
    padding: 0 16px 0px 20px;
    height: 48px;
    line-height: 48px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    border-bottom: 1px solid #e8e8e8;
}

.countParams .ecoSettingBlock{
    margin-bottom:10px;
}

.countParams .ecoSettingDesc .title{
    font-size: 14px;
    color: #606266;
    height: 32px;
    line-height: 32px;
    font-weight: bold;
    text-align: left;
}
.countParams .ecoSettingDesc .del{
    font-size: 12px;
    color: #f56c6c;
    height: 32px;
    line-height: 32px;
    font-weight: bold;
    text-align: right;
    cursor: pointer;
}


.countParams .ecoSettingDesc .note{
    font-size: 14px;
    height: 32px;
    line-height: 32px;
    color: #8b8b8b;
    font-weight: normal;
    text-align: right;
}


.countParams .funcItem{
    padding: 0 16px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    position: relative;
}

.countParams .funcItem:hover{
    background-color:rgb(233,250,255);
}

.countParams .plainBtn{
    border-color: #409eff;
    color: #409eff;
    font-size: 14px;
    margin-right:10px;
}

</style>
