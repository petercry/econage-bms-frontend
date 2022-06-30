import {
    SET_DEMO,
    SET_SYSSELECTED,
    SET_SYSTREE,
} from './mutation-types.js'

export default{
    [SET_DEMO](state,demo){
        state.demo = demo;
    },
    [SET_SYSSELECTED](state,sysSelected){
      state.sysSelected = sysSelected;
    },
    [SET_SYSTREE](state,sysTree){
      state.sysTree = sysTree;
    },
}
