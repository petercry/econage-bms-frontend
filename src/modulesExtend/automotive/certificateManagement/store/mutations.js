import {
    SET_DEMO,
    SET_TEMP_OBJ,
    SET_TYPE_LIST
} from './mutation-types.js'

export default{
    [SET_DEMO](state,demo){
        state.demo = demo;
    },
    [SET_TEMP_OBJ](state,tempObj){
        state.tempObj = tempObj;
    },
    [SET_TYPE_LIST](state,arr){
        state.typeList = arr;
    }
}
