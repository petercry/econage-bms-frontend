import {
    SET_DEMO,
    SET_BASE_DATA_OBJ,
    SET_ECO_EVENT,
    SET_ECO_EVENT_DATA,
    SET_STATUS_LIST,
    SET_IMPORTANTTYPE_LIST,
    SET_REGULATORYCOMPLIANCE_LIST,
    SET_INIT_ROLE
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
    [SET_STATUS_LIST](state,obj){
        state.statusList = obj;
    },
    [SET_IMPORTANTTYPE_LIST](state,arr){
        state.importantTypeList =arr;
    },
    [SET_REGULATORYCOMPLIANCE_LIST](state,arr){
        state.regulatoryComplianceList =arr;
    },
    [SET_INIT_ROLE](state,obj){
        state.initRole = obj;
    }
}
