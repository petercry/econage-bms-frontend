import {
    SET_DEMO,
    SET_BASE_DATA_OBJ,
    SET_ECO_EVENT,
    SET_ECO_EVENT_DATA
} from './mutation-types.js'

export default{
    [SET_DEMO](state,demo){
        state.demo = demo;
    },
    [SET_BASE_DATA_OBJ](state,obj = {}){
        state.baseData[obj.key] = obj.array;
    },

    [SET_ECO_EVENT](state,ecoEvent){
        state.ecoEvent = ecoEvent;
    },

    [SET_ECO_EVENT_DATA](state,ecoEventData){
        state.ecoEventData = ecoEventData;
    },
}
