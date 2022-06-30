import {
    SET_DEMO,
    SET_REVISIONTYPE,
    SET_TEMP_OBJ
} from './mutation-types.js'

export default{
    [SET_DEMO](state,demo){
        state.demo = demo;
    },
    [SET_REVISIONTYPE](state,arr){
        state.revisionTypeList = arr;
    },
    [SET_TEMP_OBJ](state,tempObj){
        state.tempObj = tempObj;
    },
}
