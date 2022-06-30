import {
    SET_DEMO,
    SET_SYSSELECTED,
    SET_SYSTREE,
    SET_ECO_EVENT,
    SET_ECO_EVENT_DATA,
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
    
    [SET_ECO_EVENT](state,ecoEvent){
      state.ecoEvent = ecoEvent;
    },

    [SET_ECO_EVENT_DATA](state,ecoEventData){
      state.ecoEventData = ecoEventData;
    },
}
