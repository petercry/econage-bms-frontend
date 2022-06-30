<template>
    <span class="countFunc formulaFuncItem" v-bind:class="{'clickActive':isClickActive}"  >

        <span class="desc1" @click="clickParams">COUNT</span>
        <span class="desc2"> ( </span>

        <span  v-for="(paramItem,idx) in paramsObj.paramsArray" :key="idx"  v-if="paramItem.type == 3 && paramItem.name">
             <span>{{idx>0?',':''}}</span>
             <component 
                :is="paramItem.name.toLowerCase()" 
                :mItem="paramItem"
                :paramsMap="paramsMap"  
                :extData="extData"
                @emitParams="emitParams"
                @delFunc="delFunc"
                :ref="'m'+paramItem.uuid"
            ></component>
        </span>
       
        <template v-else>
            <span v-if="idx > 0">,</span>
            <span  v-bind:class="[paramItem.value?'hasSetDesc':'needSetDesc'] ">{{(paramItem.name) ? paramItem.name:'参数'}}</span>
        </template>
       
        
        
        <span class="desc2"> 
             ) 
             <i class="del icon iconfont iconshanchu1 pointerClass"  v-if="isClickActive" @click="delBtnFunc"></i>
        </span>
       

    </span>
</template>

<script>
import calculate from "./calculate.vue"
import concatenate from "./concatenate.vue"
import count from "./count.vue"
import datedelta from "./datedelta.vue"
import days from "./days.vue"
import gridindx from "./gridindx.vue"
import hours from "./hours.vue"
import indx from "./indx.vue"
import max from "./max.vue"
import mid from "./mid.vue"
import min from "./min.vue"
import rmbupper from "./rmbupper.vue"
import sum from "./sum.vue"
import tonumber from "./tonumber.vue"
import years from "./years.vue"

import {FlowFormUtil} from '../../../config/util'
import EcoUtil from '@/components/util/main'
import {mapState,mapMutations} from 'vuex'

export default{
    name:'count',
    components: {
       calculate,
        concatenate,
        count,
        datedelta,
        days,
        gridindx,
        hours,
        indx,
        max,
        mid,
        min,
        rmbupper,
        sum,
        tonumber,
        years
    },
    props: {
        mItem:{
            type:Object
        },

        paramsMap:{
            type:Object
        },

        extData:{
            type:Object
        }

    },
    data() {
        return {

        };
    },
    created(){
       
    },
    computed:{
        ...mapState([
            'wfFormulateSetting',
        ]),

        isClickActive(){
            if(this.$route.params.uuid && this.$route.params.uuid == this.mItem.uuid){
                return true;
            }else{
                return false;
            }
        },

        paramsObj(){
            let _params = ( this.paramsMap && this.paramsMap[this.mItem.uuid] )? this.paramsMap[this.mItem.uuid]:null;
            let _item = {};
            _item.paramsArray = _params?_params.paramsArray:[{name:null,value:null,type:2,uuid:null}];
            for(let i = 0;i<_item.paramsArray.length ;i++){
                if(_item.paramsArray[i].type == 3){
                    if(!_item.paramsArray[i].uuid){
                        _item.paramsArray[i].uuid = EcoUtil.getUID();
                    }
                    if(FlowFormUtil.isFormulaFunc(_item.paramsArray[i].name)){

                    }else{
                        _item.paramsArray[i].name = null;
                        _item.paramsArray[i].value = null;
                    }
                }
            }
            return _item ;
        }

    },
    methods: {

        clickParams(){
            let _data = {};            
            _data.uuidArray = [this.mItem.uuid];
            _data.paramsName = 'formulaCountSetting';
            this.$emit('emitParams',_data);
        },
        

        delBtnFunc(){
            let _data = {};    
            _data.uuidArray = [this.mItem.uuid];        
            this.$emit('delFunc',_data);
        },

        delFunc(data){
            data.uuidArray.push(this.mItem.uuid);
            this.$emit('delFunc',data)
        },

        emitParams(data){
            data.uuidArray.push(this.mItem.uuid);
            this.$emit('emitParams',data);
        },
        
        getRefValue(){
            let _re  = "COUNT(";
            for(let i = 0;i<this.paramsObj.paramsArray.length;i++){
                if(i>0){
                     _re += ',';
                }
                if(this.paramsObj.paramsArray[i].type == 1){
                    _re += '"'+this.paramsObj.paramsArray[i].value+'"';
                }else if(this.paramsObj.paramsArray[i].type == 2){
                   _re += 'VAL("'+this.paramsObj.paramsArray[i].value+'",'+ (this.extData.itemParentId == null?true:false) +')'; 
                }else if(this.paramsObj.paramsArray[i].type == 3){
                    _re += this.getRefComponentByRefName('m'+this.paramsObj.paramsArray[i].uuid).getRefValue();
                }
            }
            _re+=')';
            return _re;
        },

        getRefInfo(itemArray,funcUUIDArray){
            funcUUIDArray.push(this.mItem.uuid);
            for(let i = 0;i<this.paramsObj.paramsArray.length;i++){
                if(this.paramsObj.paramsArray[i].type == 2){
                    itemArray.push(this.paramsObj.paramsArray[i].value);
                }else if(this.paramsObj.paramsArray[i].type == 3){
                    this.getRefComponentByRefName('m'+this.paramsObj.paramsArray[i].uuid).getRefInfo(itemArray,funcUUIDArray);
                }
            }
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
    
    },
    watch: {

    }
}

</script>
<style scope>
.countFunc .del{
    position: absolute;
    right: -5px;
    top: -13px;
    color:red;
}
.countFunc{
    /* float: left; */
    margin-right:10px;
}

.countFunc .desc1{
    color:#fa8e1b;
    font-size: 18px;
    cursor: pointer;
}

.countFunc .desc2{
    font-size: 18px;
    position: relative;
}

.countFunc .needSetDesc{
    background-color: yellow;
    font-size: 14px;
    padding-left:5px;
    padding-right:5px;
}

.countFunc .needSetDesc i{
    background-color: none;
}

.countFunc .hasSetDesc{
    font-size: 14px;
    padding-left:5px;
    padding-right:5px;
    color:#999;
}

.countFunc .hasSetDesc i{
    color:#000;
}

</style>
