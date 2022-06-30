import {
    SET_DEMO,
    SET_REVISIONTYPE,
} from './mutation-types.js'

export default{
    [SET_DEMO](state,demo){
        state.demo = demo;
    },
    [SET_REVISIONTYPE](state,arr){
        state.revisionTypeList = arr;
    },
}
