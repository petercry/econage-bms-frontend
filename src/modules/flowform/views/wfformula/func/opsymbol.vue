<template>
    <span class="opsymbolFunc formulaFuncItem" v-bind:class="{'clickActive':isClickActive}"  >
        <span class="desc1" @click="clickParams">{{symbolDesc}}</span>

        <i class="del icon iconfont iconshanchu1 pointerClass"  v-if="isClickActive" @click="delBtnFunc"></i>
    </span>
</template>

<script>
import EcoUtil from '@/components/util/main'
import {mapState,mapMutations} from 'vuex'

export default{
    name:'opsymbol',
    components: {
       
    },
    props: {
        mItem:{
            type:Object
        },

        paramsMap:{
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

        symbolDesc(){
            if(this.mItem){
                if(this.mItem.type == 1){
                    return '+';
                }else if(this.mItem.type == 2){
                    return '-';
                }else if(this.mItem.type == 3){
                    return 'x';
                }else if(this.mItem.type == 4){
                    return '÷';
                }else if(this.mItem.type == 5){
                    return '(';
                }else if(this.mItem.type == 6){
                    return ')';
                }
            }
            return '';
        }

    },
    methods: {

       clickParams(){
            let _data = {};            
            _data.uuidArray = [this.mItem.uuid];
            _data.paramsName = 'formulaOpsymbolSetting';
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
                if(this.mItem.type == 1){
                    return '+';
                }else if(this.mItem.type == 2){
                    return '-';
                }else if(this.mItem.type == 3){
                    return 'x';
                }else if(this.mItem.type == 4){
                    return '÷';
                }else if(this.mItem.type == 5){
                    return '(';
                }else if(this.mItem.type == 6){
                    return ')';
                }
        },

        getRefInfo(itemArray,funcUUIDArray){
            funcUUIDArray.push(this.mItem.uuid);
        }
     
    },
    watch: {

    }
}

</script>
<style scope>
.opsymbolFunc .del{
    position: absolute;
    right:0px;
    right: -5px;
    top: -13px;
    color:red;
}
.opsymbolFunc{
    /* float: left; */
    margin-right:10px;
}

.opsymbolFunc .desc1{
    color:#2196f3;
    font-size: 18px;
    cursor: pointer;
    padding-left:5px;
    padding-right:5px;
}

.opsymbolFunc .desc2{
    font-size: 18px;
}

.opsymbolFunc .needSetDesc{
    background-color: yellow;
    font-size: 14px;
    padding-left:5px;
    padding-right:5px;
}

.opsymbolFunc .hasSetDesc{
    font-size: 14px;
    padding-left:5px;
    padding-right:5px;
    color:#999;
}

</style>
