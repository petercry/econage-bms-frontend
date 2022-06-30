import {
    SET_TEMP_OBJ,
    SET_STATEFLOW_LIST,
    SET_PHASE_STATUS_LIST,
    SET_STANDARD_TYPE,
    SET_EDIT_TYPE,
    SET_PROGRAM_SOURCE,
    SET_FIVEASPECTS_FIELD,
    SET_APPLICA_CARTYPE,
    SET_APPLICATION_FIELD,
    SET_APPLICABLE_PROJECT
} from './mutation-types.js'

export default {
    [SET_TEMP_OBJ](state, tempObj) {
        state.tempObj = tempObj;
    },
    [SET_STATEFLOW_LIST](state, obj) {
        state.stateFlowList = obj;
    },
    [SET_PHASE_STATUS_LIST](state, obj) {
        state.phaseStatusList = obj;
    },
    [SET_STANDARD_TYPE](state, arr) {
        state.standardType = arr;
    },
    [SET_EDIT_TYPE](state, arr) {
        state.editType = arr;
    },
    [SET_PROGRAM_SOURCE](state, arr) {
        state.programSource = arr;
    },
    [SET_FIVEASPECTS_FIELD](state, arr) {
        state.fiveAspectsField = arr;
    },
    [SET_APPLICA_CARTYPE](state,arr){
        state.applicationCarType = arr;
    },
    [SET_APPLICATION_FIELD](state,arr){
        state.applicationField = arr;
    },
    [SET_APPLICABLE_PROJECT](state,arr){
        state.applicableProject = arr;
    },
}
